// Original1.89: bounded shared HUD work; rendering and gameplay clocks remain independent.
function text193(el,value){const next=value==null?'':String(value);if(el.childElementCount||el.textContent!==next)el.textContent=next;return value;}
const controlsBefore193=applyControls184;let controlKey193='';
applyControls184=function(){const key=[started,actualMode184(),OmniI18n.lang].join('|');if(key===controlKey193)return;controlKey193=key;return controlsBefore193();};
function hudGate193(fn){let last=-Infinity,lastKey='';return function(...args){const now=performance.now(),key=[race,zone,started,paused,dialogOpen,player.alien,player.selected,player.activeAlien,player.watchOpen,attackPage,player.gwenForm51,player.form,OmniI18n.lang].join('|');if(inFrame188&&key===lastKey&&now-last<1000/(race==='anodite'?12:15))return;last=now;lastKey=key;return fn.apply(this,args);};}
hud=hudGate193(hudBefore192);saiHud167=hudGate193(saiHud167);pokeHud177=hudGate193(pokeHud177);
// Sprite definitions depend only on row and their loaded sheet, not animation frame.
const infoBefore193=spriteInfo,infoCache193=new Map();
spriteInfo=function(row){const hit=infoCache193.get(row);if(hit&&(!(row===ROW187||row===ROW187+1)||hit.sheet===art187[row===ROW187?'four':'gwen'])&&hit.sheet.complete&&hit.sheet.naturalWidth===hit.w&&hit.sheet.naturalHeight===hit.h&&hit.sheet.src===hit.src)return hit.info;const info=infoBefore193(row),sheet=info?.sheet;if(sheet?.complete&&sheet.naturalWidth){if(infoCache193.size>=512)infoCache193.clear();infoCache193.set(row,{info,sheet,w:sheet.naturalWidth,h:sheet.naturalHeight,src:sheet.src});}return info;};
if(location.search.includes('qa=1'))window.__v193={eval:s=>eval(s)};
// Auto FPS may retry 60 after sustained headroom; manual 30/60 and low quality remain unchanged.
const sampleBefore193=frameControl75.sample;let recovery193=0;
frameControl75.sample=function(ms,cost,active){const previous=this.fps;const out=sampleBefore193.call(this,ms,cost,active);if(previous!==this.fps)recovery193=0;if(this.mode==='auto'&&this.fps===30&&quality17!=='low'&&active&&ms>0&&ms<25&&this.mean<20&&this.cost<10){recovery193+=ms;if(recovery193>=12000){this.fps=60;this.slow=0;this.warm=0;this.lastDraw=-Infinity;recovery193=0;}}else recovery193=0;return out;};
