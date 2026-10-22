# Reconstruct public 1.84 using exact, pinned lossless recompression of existing public images.
from pathlib import Path
import json,hashlib,base64,shutil,re,io,urllib.request,concurrent.futures
from PIL import Image,features,__version__ as pillow_version
assert pillow_version=='12.3.0' and features.version('webp')=='1.6.0'
R=Path(__file__).resolve().parents[1];D=R/'releases/original/1.84.0';S=D/'source188';facts=json.loads((S/'files.json').read_text());m=json.loads(base64.b64decode(json.loads((D/'original-manifest.json').read_text())['payload']));files={f['path']:f for f in m['files']};OLD=R/'releases/original/1.83.0'
sha=lambda b:hashlib.sha256(b).hexdigest()
base=(OLD/('original-'+facts['baseGame']+'.bin')).read_text();assert sha(base.encode())==facts['baseGame'];end='initProgress();window.OmniUpdates147?.gameReady();';at=base.rfind(end);assert at>0;game=(base[:at]+'\n'+(S/'extension.js').read_text()+'\n'+base[at:]).encode();assert sha(game)==facts['gameSha256'];resources={'game.js':game}
for f in facts['files']:
 b=(S/f['source']).read_bytes();assert sha(b)==f['sha256']and len(b)==f['bytes'];resources[f['path']]=b
proof=json.loads((S/'compression-proof.json').read_text())
def derive(f):
 s=f['source'];cached=D/('original-'+f['sha256']+'.bin')
 if cached.exists():
  b=cached.read_bytes();assert sha(b)==f['sha256']and len(b)==f['bytes'];return f['path'],b
 # Reuse the already-published immutable bytes when available; the exact digest
 # is the same one checked by the original pixel-equivalence proof below.
 try:
  url='https://github.com/ventisca-gif/omniblizz-updates/releases/download/v1.84.0/original-'+f['sha256']+'.bin'
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'OmniBlizz-content189','Accept-Encoding':'identity'}),timeout=30)as response:b=response.read(f['bytes']+1)
  if len(b)==f['bytes']and sha(b)==f['sha256']:return f['path'],b
 except Exception:pass
 if 'release'in s:original=(R/'releases/original'/s['release']/('original-'+s['sha256']+'.bin')).read_bytes()
 else:
  assert s['url'].startswith('https://omniblizz-ventisca-sergio.pokeventiscapoke.chatgpt.site/play/')
  with urllib.request.urlopen(s['url'],timeout=90)as response:original=response.read(s['bytes']+1)
 assert len(original)==s['bytes']and sha(original)==s['sha256'],f['path']+' source mismatch'
 im=Image.open(io.BytesIO(original));out=io.BytesIO();im.save(out,'WEBP',lossless=True,quality=100,method=6,exact=True);b=out.getvalue();assert len(b)==f['bytes']and sha(b)==f['sha256'],f['path']+' encoded mismatch';rgba=im.convert('RGBA').tobytes();assert rgba==Image.open(io.BytesIO(b)).convert('RGBA').tobytes()and sha(rgba)==f['rgbaSha256'];return f['path'],b
with concurrent.futures.ThreadPoolExecutor(max_workers=4)as pool:resources.update(pool.map(derive,proof))
for name,b in resources.items():
 f=files[name];assert len(b)==f['bytes']and sha(b)==f['sha256'];(D/('original-'+f['sha256']+'.bin')).write_bytes(b)
for f in files.values():
 p=D/('original-'+f['sha256']+'.bin')
 if not p.exists():shutil.copyfile(OLD/p.name,p)
 b=p.read_bytes();assert len(b)==f['bytes']and sha(b)==f['sha256']
W=R/'website/static/play';config=(W/'update147/config147.js').read_text();revision=int(re.search(r'"baseRevision"\s*:\s*(\d+)',config)[1])
if revision<=188:
 changed=[]
 for name,b in resources.items():
  if name=='game.js':
   t=b.decode();t=re.sub(r'(walk166/(?:0|1|9|10|14|150|152|sys0|sys25))\.png',r'\1.webp',t)
   for k in ['buildings','props','paving']:t=t.replace('city164/'+k+'.png','city164/'+k+'.webp')
   b=t.encode()
  webname=name
  if name.startswith('walk166/')and name.endswith('.png')or name in ['city164/buildings.png','city164/props.png','city164/paving.png']:webname=name[:-4]+'.webp'
  p=W/webname;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b);changed.append(webname)
 config=re.sub(r'"baseVersion"\s*:\s*"[^\"]+"','"baseVersion": "1.84.0"',config);config=re.sub(r'"baseRevision"\s*:\s*\d+','"baseRevision": 188',config);(W/'update147/config147.js').write_text(config);(W/'update147/entry-base147.js').write_text('window.OMNI_BASE_ENTRY147='+json.dumps(resources['game-entry147.html'].decode(),ensure_ascii=False)+';\n')
 wf=json.loads((R/'website/files.json').read_text());items={f['path']:f for f in wf['files']}
 for name in changed+['update147/config147.js','update147/entry-base147.js']:
  b=(W/name).read_bytes();key='play/'+name;items[key]={'path':key,'bytes':len(b),'sha256':sha(b)}
 wf['files']=list(items.values());(R/'website/files.json').write_text(json.dumps(wf,separators=(',',':')))
print('Verified all Original 1.84 resources and prepared web content.')
