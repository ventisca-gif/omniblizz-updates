from pathlib import Path
import zipfile,json,difflib,hashlib,sys
root=Path(__file__).parent
src=Path(sys.argv[1])
pub=src/'alienx280/public'
base=zipfile.ZipFile(next(src.parent.glob('*.zip'))).read('alienx280/public/game.js').decode()
current=(pub/'game.js').read_text()
assert json.loads((root/'results.json').read_text())['failed']==0
assert json.loads((root/'loader-results.json').read_text())['failed']==0
(root/'source.patch').write_text(''.join(difflib.unified_diff(base.splitlines(True),current.splitlines(True),fromfile='a/alienx280/public/game.js',tofile='b/alienx280/public/game.js')))
entry=(pub/'game-entry147.html').read_text().replace('2.36.4','2.36.5').replace('game.js?v=296','game.js?v=297')
output=root/'OmniBlizz-Original-2.36.5-Codigo-Publico.zip'
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as z:
 z.writestr('alienx280/public/game.js',current)
 z.writestr('alienx280/public/game-entry147.html',entry)
 for name in ['original-content-manifest.json','original-manifest.json','original-update-public.pem']:z.write(src/name,'base2364/'+name)
 for name in ['patch.py','test.cjs','test-loader.cjs','results.json','loader-results.json','source.patch','notes.md','recover_runtime.py','build_review.py']:z.write(root/name,'optimization297/'+name)
print(json.dumps({'bundle':str(output),'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'bytes':output.stat().st_size}))
