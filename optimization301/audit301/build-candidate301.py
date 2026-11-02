from pathlib import Path
root=Path(__file__).resolve().parent.parent
p=root/'audit301/candidate'
s=(root/'audit300/candidate/game.js').read_text();marker='const drawFrameBefore299=draw;';assert s.count(marker)==1
s=s.replace("'highbreedaf270'].includes(id)?200:100","'highbreedaf270','aquaticaf301','heatblastaf301'].includes(id)?200:100")
s=s.replace(marker,(p/'aliens301.js').read_text()+'\n'+(p/'hud301.js').read_text()+'\n'+marker).replace('2.36.8','2.37.0');(p/'game.js').write_text(s)
(p/'game-entry147.html').write_text((root/'audit300/candidate/game-entry147.html').read_text().replace('2.36.8','2.37.0').replace('game.js?v=300','game.js?v=301'))
i=s.rfind('})();');qa=(root/'audit301/qa301.js').read_text()+(root/'audit301/qa-extra301.js').read_text();(root/'audit301/qa-game301.js').write_text(s[:i]+qa+'\n'+s[i:])
