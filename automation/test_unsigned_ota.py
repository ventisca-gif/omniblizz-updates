"""Pruebas sin red de la preparacion OTA; nunca acceden a claves privadas."""
import copy
import hashlib
import json
import sys
import tempfile
import unittest
from pathlib import Path
import zipfile

sys.path.insert(0, str(Path(__file__).resolve().parent))
import validate_and_stage as ota


def record(data, path, pack=False):
    sha = hashlib.sha256(data).hexdigest()
    base = {"bytes": len(data), "mime": "text/javascript"
            if path == "game.js" else "image/png",
            "path": path, "sha256": sha}
    if pack:
        base.update(pack=sha, offset=0)
    else:
        base["url"] = (f"{ota.DOWNLOAD_PREFIX}2.43.26/"
                       f"original-{sha}.bin")
    return base


def fixtures():
    game = b"console.log('old-version');\n"
    sprite = b"sprite-data-0"
    raw = {"edition": "original", "schema": 1, "minShell": 147,
           "notes": "old", "version": "2.43.26", "revision": 338,
           "files": [record(sprite, "map/sprite.png"), record(game, "game.js")]}
    content = {"edition": "original", "schema": 2, "minShell": 189,
               "notes": "old", "version": "2.43.26", "revision": 338,
               "full": True,
               "files": [record(sprite, "map/sprite.png", True),
                         record(game, "game.js", True)],
               "packs": []}
    for blob in (sprite, game):
        sha = hashlib.sha256(blob).hexdigest()
        content["packs"].append({
            "bytes": len(blob), "sha256": sha,
            "url": f"{ota.DOWNLOAD_PREFIX}2.43.26/content-{sha}.bin"
        })
    candidate = {"version": "2.43.27", "revision": 339,
                 "notes": "Solo prueba, NO publicar"}
    return raw, content, candidate, game, sprite


class UnsignedOtaTests(unittest.TestCase):
    def test_preserve_existing_assets_and_historical_manifest(self):
        base, full, meta, old, sprite = fixtures()
        original_snapshot, content_snapshot = copy.deepcopy(base), copy.deepcopy(full)
        new = b"console.log('new-version');\n"
        next_raw, next_full = ota.prepare_unsigned_payloads(base, full, meta, new)
        self.assertEqual(base, original_snapshot)
        self.assertEqual(full, content_snapshot)
        self.assertEqual(next_raw["files"][0], base["files"][0])
        self.assertEqual(next_full["files"][0], full["files"][0])
        self.assertEqual(len(next_raw["files"]), len(base["files"]))
        self.assertEqual(len(next_full["files"]), len(full["files"]))
        self.assertEqual(next_raw["minShell"], 147)
        self.assertEqual(next_full["minShell"], 189)
        self.assertEqual(len(next_full["packs"]), len(full["packs"]))
        self.assertEqual(next_raw["revision"], 339)
        self.assertEqual(next_full["revision"], 339)
        self.assertEqual(next_raw["files"][-1]["sha256"], ota.checksum(new))
        self.assertEqual(next_full["files"][-1]["pack"], ota.checksum(new))
        self.assertNotIn(ota.checksum(old),
                         {p["sha256"] for p in next_full["packs"]})
        self.assertEqual(next_raw["files"][0]["sha256"], ota.checksum(sprite))

    def test_reject_unchanged_game(self):
        raw, full, meta, old, _ = fixtures()
        with self.assertRaisesRegex(ValueError, "Sin cambios"):
            ota.prepare_unsigned_payloads(raw, full, meta, old)

    def test_reject_dangerous_paths(self):
        raw, _, _, _, _ = fixtures()
        raw["files"][0]["path"] = "../private/update-signing.pem"
        with self.assertRaisesRegex(ValueError, "insegura"):
            ota.validate_manifest_files(raw)

    def test_stage_drafts_are_explicitly_unsigned(self):
        raw, full, meta, old, _ = fixtures()
        with tempfile.TemporaryDirectory() as d:
            source = Path(d) / "candidate"
            source.mkdir()
            (source / "game.js").write_bytes(b"console.log('new-version');\n")
            (source / "release.json").write_text(json.dumps(meta))
            dest = Path(d) / "output"
            ota.stage_candidate(raw, full, {"game.js": raw["files"][-1]},
                                source, dest)
            output = dest / "OmniBlizz-Candidato-SIN-FIRMA.zip"
            self.assertTrue(output.is_file())
            with zipfile.ZipFile(output) as archive:
                names = set(archive.namelist())
                self.assertNotIn("original-manifest.json", names)
                self.assertNotIn("original-content-manifest.json", names)
                self.assertIn("original-manifest.PAYLOAD-SIN-FIRMA.json", names)
                self.assertIn("original-content-manifest.PAYLOAD-SIN-FIRMA.json",
                              names)
                sha = ota.checksum((source / "game.js").read_bytes())
                self.assertEqual(archive.read(f"original-{sha}.bin"),
                                 (source / "game.js").read_bytes())
                self.assertEqual(archive.read(f"content-{sha}.bin"),
                                 (source / "game.js").read_bytes())
                self.assertEqual(json.loads(archive.read("candidate-report.json"))
                                 ["status"], "UNSIGNED_NOT_PUBLISHED")


if __name__ == "__main__":
    unittest.main()
