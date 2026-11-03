from pathlib import Path
import zipfile,json,hashlib
p=Path('/workspaces/omni-runtime297/publish306');src=p/'optimization306';out=p/'release306';old=Path('/workspaces/omni-runtime297/publish305/release305/OmniBlizz-Original-2.40.0-Codigo-Publico.zip');new=out/'OmniBlizz-Original-2.40.1-Codigo-Publico.zip'
resources={n:(src/'candidate'/n).read_bytes() for n in ['game.js','game-entry147.html','expansion306/cast.webp']}
with zipfile.ZipFile(old) as a,zipfile.ZipFile(new,'w',zipfile.ZIP_DEFLATED) as z:
 for n in a.namelist():
  k=n.removeprefix('alienx280/public/');z.writestr(n,resources[k] if n.startswith('alienx280/public/') and k in resources else a.read(n))
 for k,b in resources.items():
  target='alienx280/public/'+k
  if target not in a.namelist():z.writestr(target,b)
 for f in src.rglob('*'):
  if f.is_file() and f.name not in ['game.js','qa306-game.js','release-digests306.json'] and f.suffix in ['.py','.md','.js','.json']:z.write(f,'audit306/'+str(f.relative_to(src)))
 for n in ['original-content-manifest.json','original-manifest.json']:z.write(out/n,'base2401/'+n)
checks=json.loads((src/'release-digests306.json').read_text())
for n,h in checks.items():assert hashlib.sha256((out/n).read_bytes()).hexdigest()==h,n
checks[new.name]=hashlib.sha256(new.read_bytes()).hexdigest();(src/'release-digests306.json').write_text(json.dumps(checks,indent=2))
print('9 release assets ready; source ZIP',new.stat().st_size,checks[new.name])
