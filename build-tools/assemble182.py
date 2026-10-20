# Reconstruct authorized public game artwork/code. Every resource is checked against its signed manifest.
from pathlib import Path
import json,hashlib,base64,shutil,re
R=Path(__file__).resolve().parents[1];D=R/'releases/original/1.78.0';S=D/'source182';facts=json.loads((S/'files.json').read_text());m=json.loads(base64.b64decode(json.loads((D/'original-manifest.json').read_text())['payload']));files={f['path']:f for f in m['files']};OLD=R/'releases/original'/facts['baseVersion']
base=(OLD/('original-'+facts['baseGame']+'.bin')).read_text()
for a,b in facts['edits']:assert base.count(a)==1;base=base.replace(a,b)
end='initProgress();window.OmniUpdates147?.gameReady();';at=base.rfind(end);assert at>0;game=(base[:at]+'\n'+(S/'extension.js').read_text()+'\n'+base[at:]).encode();assert hashlib.sha256(game).hexdigest()==facts['gameSha256'];resources={'game.js':game}
# Derive lossless images from the already signed public 1.77 assets.
# No opaque image chunks are submitted by this release.
from PIL import Image, features, __version__ as pillow_version
import io, concurrent.futures
assert pillow_version == '12.3.0' and features.version('webp') == '1.6.0', 'Use pinned Pillow 12.3.0 / libwebp 1.6.0'
previous_envelope=json.loads((OLD/'original-manifest.json').read_text())
previous_files={f['path']:f for f in json.loads(base64.b64decode(previous_envelope['payload']))['files']}
compressed={f['path'] for f in json.loads((S/'compression-proof.json').read_text())}
def derive182(f):
 if f['path'] in compressed:
  old=previous_files[f['path']]; original=(OLD/('original-'+old['sha256']+'.bin')).read_bytes()
  assert len(original)==old['bytes'] and hashlib.sha256(original).hexdigest()==old['sha256']
  im=Image.open(io.BytesIO(original)); output=io.BytesIO(); im.save(output,format='WEBP',lossless=True,method=6,exact=True); b=output.getvalue()
  decoded=Image.open(io.BytesIO(b)).convert('RGBA'); before=im.convert('RGBA')
  assert decoded.size==before.size and decoded.tobytes()==before.tobytes(), f['path']+' pixel mismatch'
 else: b=(S/f['path']).read_bytes()
 assert len(b)==f['bytes'] and hashlib.sha256(b).hexdigest()==f['sha256'], f['path']+' signed hash mismatch'
 return f['path'],b
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 resources.update(pool.map(derive182,facts['files']))
for name,b in resources.items():
 f=files[name];assert len(b)==f['bytes']and hashlib.sha256(b).hexdigest()==f['sha256'];(D/('original-'+f['sha256']+'.bin')).write_bytes(b)
for f in files.values():
 p=D/('original-'+f['sha256']+'.bin')
 if not p.exists():shutil.copyfile(OLD/p.name,p)
 b=p.read_bytes();assert len(b)==f['bytes']and hashlib.sha256(b).hexdigest()==f['sha256']
W=R/'website/static/play';config=(W/'update147/config147.js').read_text();revision=int(re.search(r'"baseRevision"\s*:\s*(\d+)',config)[1])
if revision<=182:
 for name,b in resources.items():
  if name=='game.js':
   t=b.decode();t=re.sub(r'(walk166/(?:0|1|9|10|14|150|152|sys0|sys25))\.png',r'\1.webp',t)
   for k in ['buildings','props','paving']:t=t.replace('city164/'+k+'.png','city164/'+k+'.webp')
   b=t.encode()
  p=W/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b)
 config=re.sub(r'"baseVersion"\s*:\s*"[^\"]+"','"baseVersion": "1.78.0"',config);config=re.sub(r'"baseRevision"\s*:\s*\d+','"baseRevision": 182',config);(W/'update147/config147.js').write_text(config)
 (W/'update147/entry-base147.js').write_text('window.OMNI_BASE_ENTRY147='+json.dumps(resources['game-entry147.html'].decode(),ensure_ascii=False)+';\n')
 wf=json.loads((R/'website/files.json').read_text());items={f['path']:f for f in wf['files']}
 for name in list(resources)+['update147/config147.js','update147/entry-base147.js']:
  b=(W/name).read_bytes();key='play/'+name;items[key]={'path':key,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
 wf['files']=list(items.values());(R/'website/files.json').write_text(json.dumps(wf,separators=(',',':')))
print('Reconstructed and SHA256-verified all Original1.78 resources; web content prepared.')
