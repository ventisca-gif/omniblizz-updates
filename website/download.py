"""Assemble GitHub Pages from the pinned, signed Original content manifest."""
import base64
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
from tempfile import TemporaryDirectory
from urllib.request import urlopen
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / '_site'
PLAY = SITE / 'play'
RELEASE = '2.44.15'
REVISION = 354
BUNDLE = ROOT / 'website' / f'original-web-{RELEASE}.zip'
MANIFEST = 'original-content-manifest.json'


def digest(data):
    return hashlib.sha256(data).hexdigest()


def load_manifest(bundle):
    envelope = json.loads(bundle.read(MANIFEST))
    payload = base64.b64decode(envelope['payload'], validate=True)
    with TemporaryDirectory() as directory:
        signature = Path(directory) / 'signature'
        signature.write_bytes(base64.b64decode(envelope['signature'], validate=True))
        subprocess.run([
            'openssl', 'dgst', '-sha256', '-verify',
            str(ROOT / 'original-update-public.pem'), '-signature', str(signature),
        ], input=payload, check=True)
    manifest = json.loads(payload)
    if (manifest['edition'], manifest['version'], manifest['revision'],
            manifest['schema'], manifest['full']) != ('original', RELEASE, REVISION, 2, True):
        raise ValueError('Unexpected Original content manifest')
    return manifest


def restore_pack(pack, files, bundled):
    sha = pack['sha256']
    if sha in bundled:
        data = bundled[sha]
    else:
        with urlopen(pack['url'], timeout=120) as response:
            data = response.read()
    if len(data) != pack['bytes'] or digest(data) != sha:
        raise ValueError(f'Invalid content pack {sha}')

    for file in files:
        offset = file['offset']
        size = file['bytes']
        path = Path(file['path'])
        if path.is_absolute() or '..' in path.parts or offset < 0 or size < 0:
            raise ValueError(f'Invalid content entry {path}')
        resource = data[offset:offset + size]
        if len(resource) != size or digest(resource) != file['sha256']:
            raise ValueError(f'Invalid content entry {path}')
        target = PLAY / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(resource)


def build():
    with ZipFile(BUNDLE) as bundle:
        manifest = load_manifest(bundle)
        packs = {pack['sha256']: pack for pack in manifest['packs']}
        bundled = {
            sha: bundle.read(f'content-{sha}.bin')
            for sha in packs if f'content-{sha}.bin' in bundle.namelist()
        }
    files = {sha: [] for sha in packs}
    for file in manifest['files']:
        files[file['pack']].append(file)
    with ThreadPoolExecutor(max_workers=10) as executor:
        for job in [executor.submit(restore_pack, pack, files[sha], bundled)
                    for sha, pack in packs.items()]:
            job.result()

    entry = PLAY / 'game-entry147.html'
    html = entry.read_bytes()
    old_script = b'game.js?v=316'
    if html.count(old_script) != 1:
        raise ValueError('Missing Original web entry script')
    html = html.replace(old_script, f'game.js?v={REVISION}'.encode())
    entry.write_bytes(html)
    (PLAY / 'index.html').write_bytes(html)
    shutil.copyfile(ROOT / 'landing307.html', SITE / 'index.html')
    gameplay = SITE / 'gameplay'
    gameplay.mkdir(exist_ok=True)
    for name in ('night', 'refuge', 'smoothie', 'xlr8'):
        shutil.copyfile(ROOT / f'{name}307.jpg', gameplay / f'{name}.jpg')
    (SITE / '.nojekyll').touch()
    print(f'Verified Original {RELEASE}: {len(manifest["files"])} web resources')


if __name__ == '__main__':
    build()
