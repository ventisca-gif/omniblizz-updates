from pathlib import Path
import json,base64,hashlib,mimetypes,tempfile,subprocess,zipfile
r=Path(__file__).resolve().parent;root=r.parent;out=root/'release306';out.mkdir(exist_ok=True);key=root/'private-signing297/update-signing.pem';pub=(root/'private-signing297/derived-public.pem').read_bytes();sha=lambda b:hashlib.sha256(b).hexdigest()
resources={n:(r/'candidate'/n).read_bytes() for n in ['game.js','game-entry147.html','expansion306/cast.webp']};notes=(r/'candidate/release-notes.md').read_text();baseURL='https://github.com/ventisca-gif/omniblizz-updates/releases/download/v2.40.1/'
pack=b''.join(resources.values());assert len(pack)<8*1024*1024;ph=sha(pack);(out/f'content-{ph}.bin').write_bytes(pack);files=[];offset=0
for n,b in resources.items():
 h=sha(b);(out/f'original-{h}.bin').write_bytes(b);files.append(dict(path=n,bytes=len(b),sha256=h,mime=mimetypes.guess_type(n)[0] or 'application/octet-stream',offset=offset,pack=ph));offset+=len(b)
for n in ['original-content-manifest.json','original-manifest.json']:
 env=json.loads((r/('base305-'+n)).read_text());raw=base64.b64decode(env['payload']);sig=base64.b64decode(env['signature'])
 with tempfile.TemporaryDirectory() as d:
  p=Path(d);(p/'raw').write_bytes(raw);(p/'sig').write_bytes(sig);(p/'pub').write_bytes(pub);subprocess.run(['openssl','dgst','-sha256','-verify',str(p/'pub'),'-signature',str(p/'sig'),str(p/'raw')],check=True,capture_output=True)
 m=json.loads(raw);assert m['version']=='2.40.0' and m['revision']==305;prior={f['path'] for f in m['files']};m.update(version='2.40.1',revision=306,notes=notes)
 if n=='original-content-manifest.json':
  m['files']=[f for f in m['files'] if f['path'] not in resources]+files;used={f['pack'] for f in m['files']};m['packs']=[p for p in m['packs'] if p['sha256'] in used]+[dict(sha256=ph,bytes=len(pack),url=baseURL+f'content-{ph}.bin')];assert len(m['files'])==1636;assert {p['sha256'] for p in m['packs']}==used
 else:
  m['files']=[f for f in m['files'] if f['path'] not in resources]+[{k:v for k,v in f.items() if k not in ['offset','pack']}|dict(url=baseURL+'original-'+f['sha256']+'.bin') for f in files];assert len(m['files'])==565
 assert prior<={f['path'] for f in m['files']};assert len(m['files'])==len({f['path'] for f in m['files']});raw=json.dumps(m,ensure_ascii=False,separators=(',',':')).encode()
 with tempfile.TemporaryDirectory() as d:
  p=Path(d);(p/'raw').write_bytes(raw);(p/'pub').write_bytes(pub);sig=subprocess.check_output(['openssl','dgst','-sha256','-sign',str(key),str(p/'raw')]);(p/'sig').write_bytes(sig);subprocess.run(['openssl','dgst','-sha256','-verify',str(p/'pub'),'-signature',str(p/'sig'),str(p/'raw')],check=True,capture_output=True)
 (out/n).write_text(json.dumps(dict(payload=base64.b64encode(raw).decode(),signature=base64.b64encode(sig).decode()),separators=(',',':')))
checks=sum(len(json.loads((r/n).read_text())['checks']) for n in ['regression305-results.json','regression306-results.json']);assert checks==93
info=dict(version='2.40.1',revision=306,resources=1636,legacyResources=565,changed=list(resources),checksPassed=checks,signatureVerified=True,androidBenchmark=False,combatVictory=json.loads((r/'fight306-results.json').read_text())['won'],combatSeconds=json.loads((r/'fight306-results.json').read_text())['seconds'],sha256={n:sha(b) for n,b in resources.items()});(out/'build-info.json').write_text(json.dumps(info,indent=2));(out/'release-notes.md').write_text(notes)
(r/'release-digests306.json').write_text(json.dumps({p.name:sha(p.read_bytes()) for p in out.iterdir()},indent=2))
with zipfile.ZipFile(root/'omniblizz-release306-transfer.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in out.iterdir():z.write(p,'release306/'+p.name)
 for p in r.rglob('*'):
  if p.is_file() and p.name not in ['qa306-game.js','tests-final306.zip'] and p.suffix!='.zip' and not p.name.startswith('base305-'):z.write(p,'optimization306/'+str(p.relative_to(r)))
print(json.dumps(info,indent=2))
