from pathlib import Path
import base64, json, hashlib, subprocess, zipfile, urllib.request, concurrent.futures

r=Path(__file__).resolve().parent
out=Path('release307');out.mkdir(exist_ok=True)
sha=lambda b:hashlib.sha256(b).hexdigest()
with zipfile.ZipFile(r/'update307.zip') as z:
    for n in z.namelist():
        p=Path(n);assert not p.is_absolute() and '..' not in p.parts
        z.extract(n,out)
resources={n:(out/'candidate'/n).read_bytes() for n in json.loads((out/'build-info.json').read_text())['changed']}
pack=b''.join(resources.values())
(out/('content-'+sha(pack)+'.bin')).write_bytes(pack)
for n,b in resources.items():(out/('original-'+sha(b)+'.bin')).write_bytes(b)
manifests={}
for n in ['original-manifest.json','original-content-manifest.json']:
    env=json.loads((out/n).read_text());raw=base64.b64decode(env['payload']);sig=base64.b64decode(env['signature'])
    (out/'payload').write_bytes(raw);(out/'signature').write_bytes(sig)
    subprocess.run(['openssl','dgst','-sha256','-verify',str(r/'original-update-public.pem'),'-signature',str(out/'signature'),str(out/'payload')],check=True)
    m=json.loads(raw);assert m['revision']==307 and m['version']=='2.41.0'
    for f in m['files']:
        if f['path'] in resources:assert sha(resources[f['path']])==f['sha256'] and len(resources[f['path']])==f['bytes']
    manifests[n]=m
oldurl='https://github.com/ventisca-gif/omniblizz-updates/releases/download/v2.40.1/OmniBlizz-Original-2.40.1-Codigo-Publico.zip'
old=urllib.request.urlopen(oldurl,timeout=120).read()
assert sha(old)=='65d00e4f95e851dfaae67f16f263c24f14e6cb45b92c67825c4cbf09660de1b5'
import io
with zipfile.ZipFile(io.BytesIO(old)) as a,zipfile.ZipFile(out/'OmniBlizz-Original-2.41.0-Codigo-Publico.zip','w',zipfile.ZIP_DEFLATED) as z:
    seen=set()
    for n in a.namelist():
        k=n.removeprefix('alienx280/public/')
        z.writestr(n,resources[k] if n.startswith('alienx280/public/') and k in resources else a.read(n));seen.add(n)
    for k,b in resources.items():
        n='alienx280/public/'+k
        if n not in seen:z.writestr(n,b)
    for n in ['original-manifest.json','original-content-manifest.json','build-info.json','release-notes.md']:z.write(out/n,'base2410/'+n)
    for n in ['mission307.js','qa307.js','browser-results307.json']:z.write(out/n,'audit307/'+n)
if '--web' in __import__('sys').argv:
    stage=Path('_site/play');stage.mkdir(parents=True,exist_ok=True)
    m=manifests['original-content-manifest.json']
    def restore(p):
        local=out/('content-'+p['sha256']+'.bin')
        b=local.read_bytes() if local.exists() else urllib.request.urlopen(p['url'],timeout=120).read()
        assert len(b)==p['bytes'] and sha(b)==p['sha256']
        for f in m['files']:
            if f['pack']!=p['sha256']:continue
            data=b[f['offset']:f['offset']+f['bytes']];assert sha(data)==f['sha256']
            target=stage/f['path'];target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:list(ex.map(restore,m['packs']))
    (Path('_site')/'index.html').write_text('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>OmniBlizz · Ventisca and Sergio</title><style>html,body,iframe{margin:0;width:100%;height:100%;border:0;background:#041a12}body{overflow:hidden}</style><iframe src="play/game-entry147.html" title="OmniBlizz Original" allow="fullscreen;autoplay;gamepad" allowfullscreen></iframe></html>')
    import shutil
    shutil.copyfile(stage/'game-entry147.html',stage/'index.html')
    shutil.copyfile(r/'landing307.html',Path('_site')/'index.html')
    (Path('_site')/'gameplay').mkdir(exist_ok=True)
    for n in ['night','refuge','smoothie','xlr8']:shutil.copyfile(r/(n+'307.jpg'),Path('_site')/'gameplay'/(n+'.jpg'))
    print('Verified web resources:',len(m['files']))
print('Release verified',len(resources),'changed resources')
