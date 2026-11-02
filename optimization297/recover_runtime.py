from pathlib import Path
import json,base64,hashlib,urllib.request,concurrent.futures
import sys
root=Path(sys.argv[1])
m=json.loads(base64.b64decode(json.loads((root/'original-content-manifest.json').read_text())['payload']))
cache=Path('/workspaces/omni-runtime297/packs'); cache.mkdir(parents=True,exist_ok=True)
out=Path('/workspaces/omni-runtime297/base'); out.mkdir(parents=True,exist_ok=True)
def pack(p):
 path=cache/(p['sha256']+'.bin')
 if not path.exists():
  with urllib.request.urlopen(p['url'],timeout=90) as r: data=r.read()
  assert len(data)==p['bytes'] and hashlib.sha256(data).hexdigest()==p['sha256']
  path.write_bytes(data)
 return p['sha256']
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
 for i,x in enumerate(ex.map(pack,m['packs']),1): print('packs',i,'/',len(m['packs']),flush=True)
for f in m['files']:
 p=(out/f['path']).resolve(); assert p.is_relative_to(out.resolve())
 with (cache/(f['pack']+'.bin')).open('rb') as h: h.seek(f['offset']); data=h.read(f['bytes'])
 assert len(data)==f['bytes'] and hashlib.sha256(data).hexdigest()==f['sha256'],f['path']
 p.parent.mkdir(parents=True,exist_ok=True); p.write_bytes(data)
print(json.dumps({'files':len(m['files']),'packs':len(m['packs']),'forestResources':sum(f['path'].startswith('forest292/') for f in m['files']),'verified':True}),flush=True)
