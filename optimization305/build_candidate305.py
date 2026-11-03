from pathlib import Path
import zipfile
r=Path(__file__).resolve().parent.parent
base=(r/'audit304/candidate/game.js').read_text();token='const drawFrameBefore299=draw;'
ext='\n'.join((r/'audit305/candidate'/n).read_text() for n in ['diamond305.js','mission305.js'])
s=base.replace(token,ext+'\n'+token).replace('2.39.1','2.40.0').replace("'greyaf302'].includes(id)","'greyaf302','diamondaf305'].includes(id)")
(r/'audit305/candidate/game.js').write_text(s)
entry=(r/'audit303/candidate/game-entry147.html').read_text().replace('2.39.0','2.40.0').replace('game.js?v=303','game.js?v=305')
(r/'audit305/candidate/game-entry147.html').write_text(entry)
qa=(r/'audit302/qa302.js').read_text()+(r/'audit305/qa305.js').read_text();pos=s.rfind('})();');assert pos>0
(r/'audit305/qa-game305.js').write_text(s[:pos]+qa+'\n'+s[pos:])
with zipfile.ZipFile(r/'omniblizz-diamond305-tests.zip','w',zipfile.ZIP_DEFLATED) as z:
 z.write(r/'audit305/qa-game305.js','qa-game305.js')
 for p in (r/'audit305/candidate/expansion305').iterdir():z.write(p,'expansion305/'+p.name)
