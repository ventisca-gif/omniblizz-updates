from pathlib import Path
import sys
p=Path(sys.argv[1])
s=p.read_text()
import hashlib
assert hashlib.sha256(p.read_bytes()).hexdigest()=='53d6e1ca8a27a4d9500867f1205403d8d26c7431786f6d11bc66d404bbdbffae', 'Base must be unmodified Original 2.36.4'
old=" if(race!=='omni'&&race!=='anodite'){pendingTime202=0;return loopBefore202(now);}"
assert s.count(old)==1, 'Unexpected render loop baseline'
s=s.replace(old," // All races share render-aligned simulation; elapsed time remains accumulated.")
marker="initProgress();window.OmniUpdates147?.gameReady();"
assert s.count(marker)>=1
extension='''// Render transaction: retain safe physics steps and one final HUD refresh.
const simulateBefore297=simulate75;
simulate75=function(...args){
 simulationDepth200++;
 try{return simulateBefore297(...args);}
 finally{
  if(--simulationDepth200===0&&hudDirty200){
   hudDirty200=false;
   const now=performance.now(),key=hudKey200();
   if(key!==lastKey200||now-lastHud200>=1000/(race==='anodite'?12:15))hud();
  }
 }
};
'''
at=s.rindex(marker)
s=s[:at]+extension+chr(10)+s[at:]
p.write_text(s)
print('Patched render alignment and HUD transaction:',p)
