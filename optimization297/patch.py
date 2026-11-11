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
print('Patched render alignment and HUD transaction:',p)

# Bound initial required artwork loading and retry a transient failure once.
start='async function boot(){try{await Promise.all(['
end=".map(([name,url])=>new Promise((resolve,reject)=>{let im=new Image();im.onload=()=>{art[name]=im;resolve();};im.onerror=()=>{reject(new Error(url));};im.src=url;})))"
assert s.count(start)==1 and s.count(end)==1
s=s.replace(start,'async function boot(){try{await loadBootArt297([').replace(end,')')
helper="async function loadBootArt297(entries){\n let next=0,failure=null;\n async function loadOne(name,url){\n  for(let attempt=0;attempt<2;attempt++){\n   try{\n    const im=await new Promise((resolve,reject)=>{\n     const image=new Image();\n     image.onload=()=>{image.onload=image.onerror=null;resolve(image);};\n     image.onerror=()=>{image.onload=image.onerror=null;reject(new Error(url));};\n     image.src=url;\n    });\n    art[name]=im;return;\n   }catch(error){if(attempt===1)throw error;}\n  }\n }\n async function worker(){\n  while(!failure){const i=next++;if(i>=entries.length)return;\n   try{await loadOne(...entries[i]);}catch(error){failure=error;}\n  }\n }\n await Promise.all(Array.from({length:Math.min(6,entries.length)},()=>worker()));\n if(failure)throw failure;\n}\n"
at=s.index('async function boot(){')
s=s[:at]+helper+s[at:]
p.write_text(s)
