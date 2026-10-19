# Rebuild large signed resources from small repository parts (connector size limit).
# No private material is present; every resulting byte is checked against the signed manifest.
from pathlib import Path
import json,hashlib,base64,shutil,re
R=Path(__file__).resolve().parents[1];D=R/'releases/original/1.75.0';S=D/'source179'
facts=json.loads((S/'files.json').read_text());m=json.loads(base64.b64decode(json.loads((D/'original-manifest.json').read_text())['payload']));files={f['path']:f for f in m['files']}
base=(R/'releases/original/1.74.0'/('original-'+facts['baseGame']+'.bin')).read_text();needle='initProgress();window.OmniUpdates147?.gameReady();';at=base.rfind(needle);assert at>0
text=base[:at]+'\n'+(S/'extension.js').read_text()+'\n'+base[at:];text=text.replace("mc.fillStyle='#183856'","mc.fillStyle='#000'");game=text.encode();assert hashlib.sha256(game).hexdigest()==facts['gameSha256']
resources={'game.js':game}
for record in facts['files']:
 b=b''.join((S/part).read_bytes()for part in record['parts']);assert len(b)==record['bytes']and hashlib.sha256(b).hexdigest()==record['sha256'];resources[record['path']]=b
for name,b in resources.items():
 f=files[name];assert len(b)==f['bytes']and hashlib.sha256(b).hexdigest()==f['sha256'];(D/('original-'+f['sha256']+'.bin')).write_bytes(b)
# Update the public web build only while this content revision is current.
W=R/'website/static/play';config=(W/'update147/config147.js').read_text();revision=int(re.search(r'"baseRevision"\s*:\s*(\d+)',config)[1])
if revision<=179:
 for name,b in resources.items():
  if name=='game.js':
   t=b.decode();t=re.sub(r'(walk166/(?:0|1|9|10|14|150|152|sys0|sys25))\.png',r'\1.webp',t)
   for key in ['buildings','props','paving']:t=t.replace('city164/'+key+'.png','city164/'+key+'.webp')
   b=t.encode()
  p=W/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b)
 config=re.sub(r'"baseVersion"\s*:\s*"[^"]+"','"baseVersion": "1.75.0"',config);config=re.sub(r'"baseRevision"\s*:\s*\d+','"baseRevision": 179',config);(W/'update147/config147.js').write_text(config)
 (W/'update147/entry-base147.js').write_text('window.OMNI_BASE_ENTRY147='+json.dumps(resources['game-entry147.html'].decode(),ensure_ascii=False)+';\n')
 wf=json.loads((R/'website/files.json').read_text());items={f['path']:f for f in wf['files']}
 for name in list(resources)+['update147/config147.js','update147/entry-base147.js']:
  b=(W/name).read_bytes();key='play/'+name;items[key]={'path':key,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
 wf['files']=list(items.values());(R/'website/files.json').write_text(json.dumps(wf,separators=(',',':')))
print('Reconstructed and verified Original1.75 revision179 resources and public web content.')
