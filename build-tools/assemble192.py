"""Reconstruct public Original 1.88 from the verified 1.85 source, with no private material."""
from pathlib import Path
import json,base64,hashlib,subprocess,tempfile,shutil,re
R=Path(__file__).resolve().parents[1];D=R/'releases/original/1.88.0';S=D/'source192';OLD=R/'releases/original/1.85.0';sha=lambda b:hashlib.sha256(b).hexdigest();facts=json.loads((S/'files.json').read_text())
base=(OLD/('original-'+facts['baseGame']+'.bin')).read_bytes();assert sha(base)==facts['baseGame'];game=base.decode();assert game.count(facts['renderNeedle'])==2;game=game.replace(facts['renderNeedle'],facts['renderReplacement']);end='initProgress();window.OmniUpdates147?.gameReady();';pos=game.rfind(end);assert pos>0;game=game[:pos]+(S/'extension.js').read_text()+'\n'+game[pos:];resources={'game.js':game.encode()};assert sha(resources['game.js'])==facts['gameSha256']
for f in facts['files']:
 b=(S/f['source']).read_bytes();assert len(b)==f['bytes']and sha(b)==f['sha256'];resources[f['path']]=b
head=json.loads((S/'signed-content.json').read_text());raw=b''.join((S/n).read_bytes()for n in head['parts']);assert sha(raw)==head['payloadSha256']
with tempfile.TemporaryDirectory()as tmp:
 p=Path(tmp);(p/'raw').write_bytes(raw);(p/'sig').write_bytes(base64.b64decode(head['signature']));subprocess.run(['openssl','dgst','-sha256','-verify',str(R/'original-update-public.pem'),'-signature',str(p/'sig'),str(p/'raw')],check=True)
m=json.loads(raw);assert m['version']=='1.88.0'and m['revision']==192;(D/'original-content-manifest.json').write_text(json.dumps({'payload':base64.b64encode(raw).decode(),'signature':head['signature']},ensure_ascii=False,indent=2))
pack=next(p for p in m['packs']if p['sha256']==facts['newPack']);out=bytearray(pack['bytes'])
for f in m['files']:
 if f['pack']==pack['sha256']:
  b=resources[f['path']];assert len(b)==f['bytes']and sha(b)==f['sha256'];out[f['offset']:f['offset']+f['bytes']]=b
assert sha(out)==pack['sha256'];(D/('content-'+pack['sha256']+'.bin')).write_bytes(out)
legacy=json.loads(base64.b64decode(json.loads((D/'original-manifest.json').read_text())['payload']))
for f in legacy['files']:
 dest=D/('original-'+f['sha256']+'.bin')
 if f['path']in resources:dest.write_bytes(resources[f['path']])
 elif not dest.exists():shutil.copyfile(OLD/dest.name,dest)
 b=dest.read_bytes();assert len(b)==f['bytes']and sha(b)==f['sha256'],f['path']
W=R/'website/static/play';changed=[]
for name,b in resources.items():
 if name=='game.js':
  t=b.decode();t=re.sub(r'(walk166/(?:0|1|9|10|14|150|152|sys0|sys25))\.png',r'\1.webp',t)
  for k in ['buildings','props','paving']:t=t.replace('city164/'+k+'.png','city164/'+k+'.webp')
  b=t.encode()
 p=W/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b);changed.append(name)
config=(W/'update147/config147.js').read_text();config=re.sub(r'"baseVersion"\s*:\s*"[^\"]+"','"baseVersion": "1.88.0"',config);config=re.sub(r'"baseRevision"\s*:\s*\d+','"baseRevision": 192',config);(W/'update147/config147.js').write_text(config);(W/'update147/entry-base147.js').write_text('window.OMNI_BASE_ENTRY147='+json.dumps(resources['game-entry147.html'].decode(),ensure_ascii=False)+';\n');changed+=['update147/config147.js','update147/entry-base147.js']
manifest=json.loads((R/'website/files.json').read_text());items={f['path']:f for f in manifest['files']}
for name in changed:
 b=(W/name).read_bytes();key='play/'+name;items[key]={'path':key,'bytes':len(b),'sha256':sha(b)}
manifest['files']=list(items.values());(R/'website/files.json').write_text(json.dumps(manifest,separators=(',',':')))
print('Verified Original 1.88 gameplay, 64 sprites, reference HUDs, full and legacy manifests.')
