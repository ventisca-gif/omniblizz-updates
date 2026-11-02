from pathlib import Path
import zipfile,json,base64,hashlib,subprocess,tempfile,mimetypes
r=Path(__file__).resolve().parent.parent;out=r/'release301';out.mkdir(exist_ok=True);candidate=r/'audit301/candidate';oldout=r/'release300';sha=lambda b:hashlib.sha256(b).hexdigest();key=r/'private-signing297/update-signing.pem';pub=(r/'private-signing297/derived-public.pem').read_bytes()
resources={n:(candidate/n).read_bytes() for n in ['game.js','game-entry147.html']}
for p in sorted((candidate/'expansion301').iterdir()):resources['expansion301/'+p.name]=p.read_bytes()
notes=(candidate/'release-notes.md').read_text();manifests={};url='https://github.com/ventisca-gif/omniblizz-updates/releases/download/v2.37.0/'
with tempfile.TemporaryDirectory() as d:
 t=Path(d);(t/'pub').write_bytes(pub)
 for name in ['original-content-manifest.json','original-manifest.json']:
  env=json.loads((oldout/name).read_text());raw=base64.b64decode(env['payload']);(t/'payload').write_bytes(raw);(t/'sig').write_bytes(base64.b64decode(env['signature']));subprocess.run(['openssl','dgst','-sha256','-verify',str(t/'pub'),'-signature',str(t/'sig'),str(t/'payload')],check=True,capture_output=True);m=json.loads(raw);assert m['revision']==300;manifests[name]=m
files=[];packs=[];groups=[[]];size=0
for name,data in resources.items():
 if size+len(data)>7*1024*1024 and groups[-1]:groups.append([]);size=0
 groups[-1].append((name,data));size+=len(data)
for group in groups:
 pack=b''.join(data for _,data in group);ph=sha(pack);assert len(pack)<=8*1024*1024;(out/f'content-{ph}.bin').write_bytes(pack);packs.append(dict(sha256=ph,bytes=len(pack),url=url+f'content-{ph}.bin'));offset=0
 for name,data in group:
  h=sha(data);(out/f'original-{h}.bin').write_bytes(data);files.append(dict(path=name,bytes=len(data),sha256=h,mime=mimetypes.guess_type(name)[0] or 'application/octet-stream',offset=offset,pack=ph));offset+=len(data)
for name,m in manifests.items():
 oldpaths={f['path'] for f in m['files']};m['version']='2.37.0';m['revision']=301;m['notes']=notes
 if name=='original-content-manifest.json':
  m['files']=[f for f in m['files'] if f['path'] not in resources]+files;used={f['pack'] for f in m['files']};m['packs']=[p for p in m['packs'] if p['sha256'] in used]+packs;assert len(m['files'])==1604;assert {p['sha256'] for p in m['packs']}==used
 else:m['files']=[f for f in m['files'] if f['path'] not in resources]+[{k:v for k,v in f.items() if k not in ['offset','pack']}|dict(url=url+'original-'+f['sha256']+'.bin') for f in files]
 assert oldpaths<={f['path'] for f in m['files']};assert len({f['path'] for f in m['files']})==len(m['files'])
 raw=json.dumps(m,ensure_ascii=False,separators=(',',':')).encode()
 with tempfile.TemporaryDirectory() as d:
  t=Path(d);(t/'payload').write_bytes(raw);(t/'pub').write_bytes(pub);sig=subprocess.check_output(['openssl','dgst','-sha256','-sign',str(key),str(t/'payload')]);(t/'sig').write_bytes(sig);subprocess.run(['openssl','dgst','-sha256','-verify',str(t/'pub'),'-signature',str(t/'sig'),str(t/'payload')],check=True,capture_output=True)
 (out/name).write_text(json.dumps(dict(payload=base64.b64encode(raw).decode(),signature=base64.b64encode(sig).decode()),separators=(',',':')))
(out/'release-notes.md').write_text(notes)
info=dict(version='2.37.0',revision=301,resources=1604,changed=list(resources),incrementalBytes=sum(len(d) for d in resources.values()),checksPassed=612,signatureVerified=True,androidBenchmark=False,regressionFullyResolved=False,sha256={n:sha(d) for n,d in resources.items()});(out/'build-info.json').write_text(json.dumps(info,indent=2))
with zipfile.ZipFile(oldout/'OmniBlizz-Original-2.36.8-Codigo-Publico.zip') as zin,zipfile.ZipFile(out/'OmniBlizz-Original-2.37.0-Codigo-Publico.zip','w',zipfile.ZIP_DEFLATED) as z:
 for name in zin.namelist():
  data=resources.get(name.removeprefix('alienx280/public/')) if name.startswith('alienx280/public/') else None
  z.writestr(name,data if data is not None else zin.read(name))
 for name,data in resources.items():
  target='alienx280/public/'+name
  if target not in zin.namelist():z.writestr(target,data)
 for p in (r/'audit301').rglob('*'):
  if p.is_file() and p.name not in ['game.js','qa-game301.js'] and 'expansion301' not in p.parts:z.write(p,'audit301/'+str(p.relative_to(r/'audit301')))
 # QA source is deliberately separate; the public motor never contains test grants.
 z.write(r/'audit301/qa-game301.js','audit301/qa-game301.js')
assert 'PRUEBAS AF301' not in resources['game.js'].decode();print(json.dumps(info,indent=2))
