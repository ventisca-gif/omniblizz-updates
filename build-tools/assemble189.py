# Reconstruct the complete, already-public game content for lightweight Android installers.
from pathlib import Path
import json,hashlib,base64,io,shutil,re,urllib.request,urllib.parse,time,concurrent.futures,subprocess,tempfile,zipfile
from PIL import Image,features,__version__ as pillow_version
assert pillow_version=='12.3.0'and features.version('webp')=='1.6.0'
R=Path(__file__).resolve().parents[1];D=R/'releases/original/1.85.0';S=D/'source189';facts=json.loads((S/'files.json').read_text());OLD=R/'releases/original/1.84.0';sha=lambda b:hashlib.sha256(b).hexdigest()
header=json.loads((S/'signed-content.json').read_text());raw=b''.join((S/n).read_bytes()for n in header['parts']);assert sha(raw)==header['payloadSha256']
with tempfile.TemporaryDirectory()as tmp:
 t=Path(tmp);(t/'payload').write_bytes(raw);(t/'signature').write_bytes(base64.b64decode(header['signature']));subprocess.run(['openssl','dgst','-sha256','-verify',str(R/'original-update-public.pem'),'-signature',str(t/'signature'),str(t/'payload')],check=True)
m=json.loads(raw);assert m['schema']==2 and m['full']is True and m['edition']=='original'and m['revision']==189
(D/'original-content-manifest.json').write_text(json.dumps({'payload':base64.b64encode(raw).decode(),'signature':header['signature']},ensure_ascii=False,indent=2));files={f['path']:f for f in m['files']};old=json.loads(base64.b64decode(json.loads((OLD/'original-manifest.json').read_text())['payload']));previous={f['path']:f for f in old['files']}
base=(OLD/('original-'+facts['baseGame']+'.bin')).read_bytes();assert sha(base)==facts['baseGame'];game=base.decode()
for a,b in facts['edits']:assert game.count(a)==1;game=game.replace(a,b)
resources={'game.js':game.encode(),'game-entry147.html':(S/'game-entry147.html').read_bytes()};assert sha(resources['game.js'])==facts['gameSha256']
cache=D/'_derived189';cache.mkdir(exist_ok=True)
def cacheWrite(p,b):
 with tempfile.NamedTemporaryFile(dir=p.parent,delete=False)as out:out.write(b);tmp=Path(out.name)
 tmp.replace(p)
def fetch(url,size,digest):
 p=cache/digest
 if p.exists():
  b=p.read_bytes()
  if len(b)==size and sha(b)==digest:return b
 for attempt in range(4):
  try:
   with urllib.request.urlopen(urllib.request.Request(url,headers={'Accept-Encoding':'identity','User-Agent':'OmniBlizz-content189'}),timeout=90)as r:b=r.read(size+1)
   assert len(b)==size and sha(b)==digest,url+' integrity mismatch';cacheWrite(p,b);return b
  except Exception:
   if attempt==3:raise
   time.sleep(2**attempt)
weburl='https://raw.githubusercontent.com/ventisca-gif/omniblizz-updates/'+facts['baseWebCommit']+'/website/files.json'
# The signed previous source inventory is immutable, independent of later web deployments.
local=cache/'web-baseline.json'
if local.exists()and sha(local.read_bytes())==facts['baseWebSha256']:wb=local.read_bytes()
else:
 with urllib.request.urlopen(weburl,timeout=60)as response:wb=response.read()
 assert sha(wb)==facts['baseWebSha256'];local.write_bytes(wb)
web=json.loads(wb);wf={f['path']:f for f in web['files']};proof={f['path']:f for f in json.loads((S/'compression-proof.json').read_text())}
archiveFiles={}
for spec in json.loads((S/'baseline-archives.json').read_text()):
 p=S/spec['path']
 if not p.exists():
  p.parent.mkdir(parents=True,exist_ok=True);cacheWrite(p,fetch(spec['url'],spec['bytes'],spec['sha256']))
 b=p.read_bytes();assert len(b)==spec['bytes']and sha(b)==spec['sha256']
 with zipfile.ZipFile(io.BytesIO(b))as z:
  for name in z.namelist():
   assert name in files and name not in archiveFiles;archiveFiles[name]=(p,name)

def sourceWeb(name,digest):
 names=['play/'+name]
 if name.startswith('walk166/')and name.endswith('.png')or name in ['city164/buildings.png','city164/props.png','city164/paving.png']:names.append('play/'+name[:-4]+'.webp')
 for key in names:
  f=wf.get(key)
  if f and f['sha256']==digest:
   localWeb=R/'website/static'/key
   if localWeb.is_file():
    b=localWeb.read_bytes()
    if len(b)==f['bytes']and sha(b)==digest:return b
   return fetch(web['origin']+'/'+urllib.parse.quote(key,safe='/'),f['bytes'],digest)
 raise AssertionError('No verified public baseline for '+name)
def derive(f):
 name=f['path'];expected=f['sha256'];cached=cache/expected
 if name in resources:b=resources[name]
 elif cached.exists():b=cached.read_bytes()
 elif name in previous and previous[name]['sha256']==expected:b=(OLD/('original-'+expected+'.bin')).read_bytes()
 elif name in archiveFiles:
  p,member=archiveFiles[name]
  with zipfile.ZipFile(p)as z:b=z.read(member)
 elif name in proof:
  spec=proof[name];original=sourceWeb(name,next(x['sha256']for x in wf.values()if x['path']=='play/'+name));im=Image.open(io.BytesIO(original));out=io.BytesIO();im.save(out,'WEBP',lossless=True,quality=100,method=6,exact=True);b=out.getvalue();rgba=im.convert('RGBA').tobytes();assert rgba==Image.open(io.BytesIO(b)).convert('RGBA').tobytes()and sha(rgba)==spec['rgbaSha256']
 else:b=sourceWeb(name,expected)
 assert len(b)==f['bytes']and sha(b)==expected,name+' integrity mismatch';cacheWrite(cached,b);return name,b
with concurrent.futures.ThreadPoolExecutor(max_workers=8)as pool:resources.update(pool.map(derive,m['files']))
for p in m['packs']:
 out=bytearray(p['bytes'])
 for f in m['files']:
  if f['pack']==p['sha256']:out[f['offset']:f['offset']+f['bytes']]=resources[f['path']]
 assert sha(out)==p['sha256'];(D/('content-'+p['sha256']+'.bin')).write_bytes(out)
legacy=json.loads(base64.b64decode(json.loads((D/'original-manifest.json').read_text())['payload']))
for f in legacy['files']:
 dest=D/('original-'+f['sha256']+'.bin')
 if f['path']in ['game.js','game-entry147.html']:b=resources[f['path']];assert sha(b)==f['sha256'];dest.write_bytes(b)
 elif not dest.exists():shutil.copyfile(OLD/dest.name,dest)
 b=dest.read_bytes();assert len(b)==f['bytes']and sha(b)==f['sha256']
# Publish normal web resources too; browser visitors retain the existing full web entry.
W=R/'website/static/play';changed=[]
for name,b in resources.items():
 if name=='game.js':
  t=b.decode();t=re.sub(r'(walk166/(?:0|1|9|10|14|150|152|sys0|sys25))\.png',r'\1.webp',t)
  for k in ['buildings','props','paving']:t=t.replace('city164/'+k+'.png','city164/'+k+'.webp')
  b=t.encode()
 p=W/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b);changed.append(name)
 if name.startswith('walk166/')and name.endswith('.png')or name in ['city164/buildings.png','city164/props.png','city164/paving.png']:
  alias=name[:-4]+'.webp';(W/alias).write_bytes(b);changed.append(alias)
config=(W/'update147/config147.js').read_text();config=re.sub(r'"baseVersion"\s*:\s*"[^\"]+"','"baseVersion": "1.85.0"',config);config=re.sub(r'"baseRevision"\s*:\s*\d+','"baseRevision": 189',config);(W/'update147/config147.js').write_text(config);(W/'update147/entry-base147.js').write_text('window.OMNI_BASE_ENTRY147='+json.dumps(resources['game-entry147.html'].decode(),ensure_ascii=False)+';\n');changed+=['update147/config147.js','update147/entry-base147.js']
manifest=json.loads((R/'website/files.json').read_text());items={f['path']:f for f in manifest['files']}
for name in changed:
 b=(W/name).read_bytes();key='play/'+name;items[key]={'path':key,'bytes':len(b),'sha256':sha(b)}
manifest['files']=list(items.values());(R/'website/files.json').write_text(json.dumps(manifest,separators=(',',':')))
print('Verified full content:',len(resources),'files,',len(m['packs']),'packs,',sum(p['bytes']for p in m['packs']),'bytes. Legacy Original updater retained.')
