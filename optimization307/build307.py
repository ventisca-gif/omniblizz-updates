from pathlib import Path
import hashlib

root = Path(__file__).resolve().parent
base = (root / 'base306-game.js').read_bytes()
assert hashlib.sha256(base).hexdigest() == 'a5bd0fe75697af208800a6b3151f5454a712786415e2a3e55415d638394d2a17'
source = base.decode()
marker = 'const drawFrameBefore299=draw;'
assert source.count(marker) == 1
mission = (root / 'incursean-mission.js').read_text().split("if (typeof module")[0]
integration = (root / 'integration.js').read_text()
(root / 'game-307.js').write_text(source.replace(marker, mission + integration + '\n' + marker))
