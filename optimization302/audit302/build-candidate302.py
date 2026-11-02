from pathlib import Path
root=Path(__file__).resolve().parent.parent;p=root/'audit302/candidate'
s=(root/'audit301/candidate/game.js').read_text();marker='const drawFrameBefore299=draw;';assert s.count(marker)==1
s=s.replace("'aquaticaf301','heatblastaf301'].includes(id)?200:100","'aquaticaf301','heatblastaf301','greyaf302'].includes(id)?200:100")
s=s.replace(marker,(p/'af302.js').read_text()+'\n'+marker).replace('2.37.0','2.38.0');(p/'game.js').write_text(s)
(p/'game-entry147.html').write_text((root/'audit301/candidate/game-entry147.html').read_text().replace('2.37.0','2.38.0').replace('game.js?v=301','game.js?v=302'))
