// Original188: spatial broad phase for unchanged city polygons; bounded minimap cache.
function collisionIndex188(polygons,cell=128){
 const grid=new Map();for(const ps of polygons){const xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]),b={ps,x0:Math.min(...xs),y0:Math.min(...ys),x1:Math.max(...xs),y1:Math.max(...ys)};
  for(let y=Math.floor(b.y0/cell);y<=Math.floor(b.y1/cell);y++)for(let x=Math.floor(b.x0/cell);x<=Math.floor(b.x1/cell);x++){const k=x+','+y;if(!grid.has(k))grid.set(k,[]);grid.get(k).push(b);}}
 return (x,y,r)=>{const seen=new Set();for(let yy=Math.floor((y-r)/cell);yy<=Math.floor((y+r)/cell);yy++)for(let xx=Math.floor((x-r)/cell);xx<=Math.floor((x+r)/cell);xx++)for(const b of grid.get(xx+','+yy)||[]){if(seen.has(b)||x+r<b.x0||x-r>b.x1||y+r<b.y0||y-r>b.y1)continue;seen.add(b);if(pointBuilding182(x,y,b.ps))return false;for(let i=0;i<b.ps.length;i++)if(segment181(x,y,b.ps[i],b.ps[(i+1)%b.ps.length])<r)return false;}return true;};
}
const cityCollision188=collisionIndex188(buildings182),capsuleCollision188=collisionIndex188(capsuleBuildings183);
const oldPass188=pass181,oldCapsulePass188=capsulePass183;
pass181=function(x,y,r=13){if(x<35+r||x>CW181-35-r||y<35+r||y>CH181-35-r)return false;return cityCollision188(x/3,y/3,r/3);};
capsulePass183=function(x,y,r=13){if(x<40+r||y<40+r||x>CAPSULE_W183-40-r||y>CAPSULE_H183-40-r||!pointBuilding182(x/3,y/3,capsuleLand183))return false;return capsuleCollision188(x/3,y/3,r/3);};
let miniCache188=null;
function miniBackground188(c,im,w,h){if(!(im?.complete&&im.naturalWidth))return;const smooth=c.imageSmoothingEnabled!==false;if(!miniCache188||miniCache188.im!==im||miniCache188.w!==w||miniCache188.h!==h||miniCache188.smooth!==smooth){if(miniCache188)miniCache188.canvas.width=miniCache188.canvas.height=1;const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const cc=canvas.getContext('2d');cc.imageSmoothingEnabled=smooth;cc.drawImage(im,0,0,w,h);miniCache188={im,w,h,smooth,canvas};}c.drawImage(miniCache188.canvas,0,0);}
pokeMapPaint177=function(el){if(!el)return;const c=el.getContext('2d'),im=pokeArt177[pMapKey179()];c.clearRect(0,0,el.width,el.height);miniBackground188(c,im,el.width,el.height);const x=player.x/1536*el.width,y=player.y/864*el.height;c.fillStyle='#ff4545';c.strokeStyle='white';c.lineWidth=2;c.beginPath();c.moveTo(x,y-7);c.lineTo(x-6,y+5);c.lineTo(x+6,y+5);c.closePath();c.fill();c.stroke();};
if(location.search.includes('qa=1'))window.__v188={eval:s=>eval(s)};
// Refresh expensive HUD DOM at 15 Hz inside simulation updates; explicit input refreshes stay immediate.
let inFrame188=false,lastHud188=-Infinity,lastHudKey188='';
const hudBefore188=hud;hud=function(...a){const now=performance.now(),key=[race,zone,started,paused,dialogOpen,player.alien,player.selected,player.activeAlien].join('|');if(inFrame188&&key===lastHudKey188&&now-lastHud188<1000/15)return;lastHud188=now;lastHudKey188=key;return hudBefore188(...a);};
const updateBefore188=update;update=function(...a){const outer=inFrame188;inFrame188=true;try{return updateBefore188(...a);}finally{inFrame188=outer;}};
