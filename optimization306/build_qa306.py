from pathlib import Path
import zipfile
r=Path(__file__).resolve().parent;s=(r/'candidate/game.js').read_text();q=(r.parent/'audit302/qa302.js').read_text()+(r/'qa305-base.js').read_text()+(r/'qa306.js').read_text();i=s.rfind('})();');assert i>0;(r/'qa306-game.js').write_text(s[:i]+q+'\n'+s[i:])
with zipfile.ZipFile(r.parent/'omniblizz-tests306.zip','w',zipfile.ZIP_DEFLATED) as z:
 z.write(r/'qa306-game.js','qa306.js');z.write(r/'candidate/expansion306/cast.webp','expansion306/cast.webp');z.write(r/'candidate/game-entry147.html','entry306.html')
