"""Resource overlays, legacy manifests and signed publication integrity."""
import copy
import json
from pathlib import Path
import tempfile
import unittest
import subprocess
from unittest.mock import patch

import validate_and_stage as ota
import sign_candidate_locally as signer
import verify_staged_release as gate
from test_unsigned_ota import fixtures
import test_signed_publication as signed_tests


class ResourceTests(unittest.TestCase):
    setUp = signed_tests.SignedReleaseTests.setUp
    tearDown = signed_tests.SignedReleaseTests.tearDown

    def stage_resources(self, assets, game=None, base=None, full=None):
        b, f, meta, old_game, _ = fixtures()
        base, full = base or b, full or f
        game = old_game if game is None else game
        candidate = Path("candidate")
        candidate.mkdir()
        (candidate / "game.js").write_bytes(game)
        (candidate / "release.json").write_text(json.dumps(meta))
        for name, blob in assets.items():
            p = candidate / "assets" / name
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(blob)
        with patch.object(signer, "verify_current_release", return_value=(
                base, full, {f['path']: f for f in base['files']}, {})):
            folder = signer.prepare_release(candidate, Path("releases/original"), self.private, self.public)
        return folder, base, full

    def validate(self, folder, base, full):
        return gate.validate_stage(folder, base, full, {f['path']: f for f in base['files']})

    def test_asset_only_release_and_replacement(self):
        assets = {"art/new-alien.webp": b"RIFF-new-sprite", "map/sprite.png": b"new-image",
                  "maps/new-zone.json": b'{"spawn":[1,2]}', "music/new.mp3": b"ID3new-music"}
        folder, base, full = self.stage_resources(assets)
        self.assertEqual(self.validate(folder, base, full), "2.43.27")
        self.assertEqual(len(list(folder.glob('*.bin'))), 8)
        manifest = ota.verify_envelope((folder / 'original-content-manifest.json').read_bytes(), self.public, 2)
        self.assertEqual(manifest['files'][1], full['files'][1])  # unchanged game
        self.assertEqual(len(manifest['files']), 5)

    def test_new_js_and_entry_css_audio_fonts_supported(self):
        folder, base, full = self.stage_resources({
            "mechanics/alien.js": b"const alien = {power: 20};", "game-entry147.html": b"<!doctype html><p>new</p>",
            "ui/new.css": b"body{color:green}", "sounds/new.ogg": b"OggS-sound", "fonts/new.woff2": b"wOF2-font"},
            b"console.log('new mechanics');\n")
        self.validate(folder, base, full)

    def test_full_only_resource_updated_in_both_schemas(self):
        base, full, _, _, _ = fixtures()
        base['files'] = base['files'][1:]
        folder, base, full = self.stage_resources({"map/sprite.png": b"replacement"}, base=base, full=full)
        self.validate(folder, base, full)
        raw = ota.verify_envelope((folder / 'original-manifest.json').read_bytes(), self.public, 1)
        self.assertIn('map/sprite.png', {f['path'] for f in raw['files']})

    def test_shared_legacy_pack_preserved_for_unchanged_file(self):
        base, full, _, game, sprite = fixtures()
        blob = sprite + game
        sha = ota.checksum(blob)
        full['packs'] = [{'sha256': sha, 'bytes': len(blob), 'url': f'{ota.DOWNLOAD_PREFIX}2.43.26/content-{sha}.bin'}]
        full['files'][0].update(pack=sha, offset=0)
        full['files'][1].update(pack=sha, offset=len(sprite))
        folder, base, full = self.stage_resources({"map/sprite.png": b"replacement"}, base=base, full=full)
        self.validate(folder, base, full)
        manifest = ota.verify_envelope((folder / 'original-content-manifest.json').read_bytes(), self.public, 2)
        self.assertIn(full['packs'][0], manifest['packs'])

    def test_duplicate_asset_content_is_deduplicated(self):
        folder, base, full = self.stage_resources({"art/a.png": b"same", "art/b.png": b"same"})
        self.validate(folder, base, full)
        self.assertEqual(len(list(folder.glob('*.bin'))), 2)

    def test_missing_asset_binary_rejected(self):
        folder, base, full = self.stage_resources({"art/a.png": b"sprite"})
        next(folder.glob('content-*.bin')).unlink()
        with self.assertRaises(ValueError):
            self.validate(folder, base, full)

    def test_valid_signature_cannot_hide_resource_deletion(self):
        folder, base, full = self.stage_resources({"art/a.png": b"sprite"})
        path = folder / 'original-content-manifest.json'
        m = ota.verify_envelope(path.read_bytes(), self.public, 2)
        m['files'] = [f for f in m['files'] if f['path'] != 'map/sprite.png']
        path.write_bytes(signer.signed_envelope(m, self.private, self.public))
        with self.assertRaisesRegex(ValueError, 'eliminado'):
            self.validate(folder, base, full)

    def test_manifest_mime_or_offset_tampering_rejected(self):
        folder, base, full = self.stage_resources({"art/a.png": b"sprite"})
        path = folder / 'original-content-manifest.json'
        m = ota.verify_envelope(path.read_bytes(), self.public, 2)
        m['files'][-1]['mime'] = 'text/html'
        path.write_bytes(signer.signed_envelope(m, self.private, self.public))
        with self.assertRaises(ValueError):
            self.validate(folder, base, full)

    def test_private_reserved_unsafe_paths_and_case_collision_rejected(self):
        for name in ['../key.pem', 'index.html', 'update147/config.js', 'META-INF/a.txt',
                     '.github/workflows/publish.yml', 'private/key.txt', 'art/key.pem',
                     'a?b.png', 'art/a#b.png', 'art/á.png', 'foo//a.png']:
            with self.subTest(name=name), self.assertRaises(ValueError):
                ota.content_path(name)
        base, full, meta, game, _ = fixtures()
        with self.assertRaisesRegex(ValueError, 'mayusculas'):
            ota.prepare_unsigned_payloads(base, full, meta, game, {'Game.js': b'let x=1;'})

    def test_oversize_and_private_key_in_content_rejected(self):
        for data in [b'a' * (ota.MAX_ASSET_BYTES + 1), b'-----BEGIN RSA PRIVATE KEY-----']:
            with self.assertRaises(ValueError):
                ota.validate_blob('art/a.png', data)

    def test_invalid_javascript_json_and_symlinks_rejected(self):
        for name, blob in [('mechanics/a.js', b'const = ;'), ('maps/a.json', b'{bad}')]:
            with self.assertRaises((ValueError, json.JSONDecodeError)):
                ota.validate_blob(name, blob)
        root = Path('assets')
        root.mkdir()
        (root / 'leak.txt').symlink_to(self.private.resolve())
        with self.assertRaises(ValueError):
            ota.read_asset_overlay(root)

    def test_unchanged_overlay_rejected_and_baseline_not_mutated(self):
        base, full, meta, game, sprite = fixtures()
        snapshot = copy.deepcopy((base, full))
        with self.assertRaisesRegex(ValueError, 'Sin cambios'):
            ota.prepare_unsigned_payloads(base, full, meta, game, {'map/sprite.png': sprite})
        ota.prepare_unsigned_payloads(base, full, meta, game, {'art/new.webp': b'new'})
        self.assertEqual((base, full), snapshot)

    def test_deployed_updater_accepts_new_content_manifest(self):
        folder, base, full = self.stage_resources({
            'game-entry147.html': b'<!doctype html><p>game</p>',
            'art/new.png': b'image-content'})
        self.validate(folder, base, full)
        source = Path(__file__).resolve().parents[1] / 'releases/original/1.85.0/source189/updater189.js'
        program = r'''
const fs=require('fs'),vm=require('vm'),crypto=require('crypto');
let src=fs.readFileSync(process.argv[1],'utf8');
src=src.replace(/boot\(\)\.catch\([\s\S]*?\);\s*\}\)\(\);\s*$/, 'window.qaVerify=verifiedManifest;})();');
if(!src.includes('window.qaVerify=verifiedManifest'))throw Error('Updater QA hook failed');
const c={TextEncoder,TextDecoder,URL,Uint8Array,Map,Set,Blob,crypto:crypto.webcrypto,
atob:s=>Buffer.from(s,'base64').toString('binary'),localStorage:{getItem:()=>null},navigator:{language:'es'}};
c.window={fetch:async()=>{},OMNI_UPDATE_CONFIG147:{edition:'original',baseRevision:338,
publicKey:fs.readFileSync('original-update-public.pem','utf8')}};
c.location={href:'https://example.test/',search:''};vm.createContext(c);vm.runInContext(src,c);
c.window.qaVerify(JSON.parse(fs.readFileSync(process.argv[2],'utf8')))
.then(m=>console.log('Legacy updater accepted '+m.files.length+' files'))
.catch(e=>{console.error(e);process.exitCode=1});
'''
        subprocess.run(['node', '-e', program, str(source),
                        str(folder / 'original-content-manifest.json')], check=True,
                       capture_output=True)
