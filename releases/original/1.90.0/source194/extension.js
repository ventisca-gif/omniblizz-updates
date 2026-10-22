// Original1.90: viewport culling and inactive-layer guards; source artwork is unchanged.
const mainCtx194=ctx,nativeImage194=ctx.drawImage;
const raster194={enabled:true,hits:0,misses:0,culls:0,get bytes(){return 0},clear(){}};
ctx.drawImage=function(im,...args){
 if(!raster194.enabled||this!==mainCtx194||this.globalCompositeOperation!=='source-over'||this.filter&&this.filter!=='none'||this.shadowBlur||this.shadowOffsetX||this.shadowOffsetY)return nativeImage194.call(this,im,...args);
 const iw=im?.naturalWidth||im?.videoWidth||im?.width,ih=im?.naturalHeight||im?.videoHeight||im?.height;if(!(iw>0&&ih>0))return nativeImage194.call(this,im,...args);
 let sx=0,sy=0,sw=iw,sh=ih,dx,dy,dw,dh;if(args.length===8)[sx,sy,sw,sh,dx,dy,dw,dh]=args;else if(args.length===4)[dx,dy,dw,dh]=args;else if(args.length===2){[dx,dy]=args;dw=iw;dh=ih;}else return nativeImage194.call(this,im,...args);
 if(!(sw>0&&sh>0&&dw>0&&dh>0))return nativeImage194.call(this,im,...args);
 const m=this.getTransform(),x=m.a*dx+m.c*dy+m.e,y=m.b*dx+m.d*dy+m.f;
 // Canvas clipping prevents pixels outside the viewport; avoid submitting those image draws.
 const x1=x+m.a*dw,x2=x+m.c*dh,x3=x+m.a*dw+m.c*dh,y1=y+m.b*dw,y2=y+m.d*dh,y3=y+m.b*dw+m.d*dh;
 if(Math.max(x,x1,x2,x3)<-2||Math.min(x,x1,x2,x3)>this.canvas.width+2||Math.max(y,y1,y2,y3)<-2||Math.min(y,y1,y2,y3)>this.canvas.height+2){raster194.culls++;return;}
 return nativeImage194.call(this,im,...args);
};
const drawBefore194=draw;draw=function(...a){if(window.OmniRhythm?.active||window.OmniCooking?.active)return;return drawBefore194(...a);};
if(location.search.includes('qa=1'))window.__v194={eval:s=>eval(s),raster:raster194};

// Preserve the render deadline instead of dropping the fractional frame budget on 90/120 Hz screens.
function paintClock194(state,now,fps){const interval=1000/fps;if(!Number.isFinite(now))return false;if(state.rate!==fps||!Number.isFinite(state.last)||now<state.last-interval||now-state.last>250){state.rate=fps;state.last=now;return true;}const elapsed=now-state.last;if(elapsed+.5<interval)return false;state.last+=Math.max(1,Math.floor((elapsed+.5)/interval))*interval;return true;}
const worldClock194={last:-Infinity,rate:0};
function targetFPS194(quality=quality17){return quality==='low'||frameControl75.mode==='30'||frameControl75.mode==='auto'&&frameControl75.fps===30?30:60;}
frameControl75.render=function(now,quality){worldClock194.last=this.lastDraw;const result=paintClock194(worldClock194,now,targetFPS194(quality));this.lastDraw=worldClock194.last;return result;};
const miniClocks194=new Map();window.OmniRender194={allow(key,now){let c=miniClocks194.get(key);if(!c){c={last:-Infinity,rate:0};miniClocks194.set(key,c);}return paintClock194(c,now,targetFPS194());}};
// SVG frames retain their baked glow; don't blur whole dynamic text/control surfaces again.
const hudPerf194=document.createElement('style');hudPerf194.textContent='#game #hud.hud86[data-reference190="omni"][data-reference190][data-reference190][data-reference190][data-reference190] .panel,#game #hud.hud86[data-reference190="omni"][data-reference190][data-reference190][data-reference190][data-reference190] .attack,#game #hud.hud86[data-reference190="omni"][data-reference190][data-reference190][data-reference190][data-reference190] #joystick,#game #hud.hud86[data-reference190="omni"][data-reference190][data-reference190][data-reference190][data-reference190] #pause,#game #hud.hud86[data-reference190="omni"][data-reference190][data-reference190][data-reference190][data-reference190] #treebtn,#game #hud.hud86[data-reference190="omni"][data-reference190][data-reference190][data-reference190][data-reference190] #regen,#game #hud.hud86[data-reference190="omni"][data-reference190][data-reference190][data-reference190][data-reference190] #lawstatus,#game #hud.hud86[data-reference190="omni"][data-reference190][data-reference190][data-reference190][data-reference190] #talk,#game #hud.hud86[data-reference190="omni"][data-reference190][data-reference190][data-reference190][data-reference190] #phone-button105,#game #hud.hud86[data-reference190="omni"][data-reference190][data-reference190][data-reference190][data-reference190] #jump,#game #hud.hud86[data-reference190="omni"][data-reference190][data-reference190][data-reference190][data-reference190] #greypunch,#game #hud.hud86[data-reference190="omni"][data-reference190][data-reference190][data-reference190][data-reference190] #moreattacks{filter:none!important}';document.head.appendChild(hudPerf194);
// Reset Canvas state without replacing its backing surface when the dimensions did not change.
var canvasResizing194={enabled:true,reused:0,resized:0};
function resetSurface194(surface,w,h){if(!canvasResizing194?.enabled){surface.width=w;surface.height=h;return;}if(surface.width!==w||surface.height!==h){if(surface.width!==w)surface.width=w;if(surface.height!==h)surface.height=h;canvasResizing194.resized++;return;}const c=surface.getContext('2d');if(c.reset)c.reset();else surface.width=w;canvasResizing194.reused++;}
if(location.search.includes('qa=1'))Object.assign(window.__v194,{resize:canvasResizing194});
// Regenerate disposable sprite copies on demand instead of retaining every visited pose forever.
function boundCanvasCache194(map,limit=8*1024*1024){let bytes=0;const sizes=new Map(),rawGet=Map.prototype.get,rawSet=Map.prototype.set,rawDelete=Map.prototype.delete,rawClear=Map.prototype.clear;for(const[k,v]of map){const n=(v?.width||0)*(v?.height||0)*4;sizes.set(k,n);bytes+=n;}const remove=k=>{if(!map.has(k))return false;bytes-=sizes.get(k)||0;sizes.delete(k);return rawDelete.call(map,k);};map.get=function(k){const v=rawGet.call(this,k);if(this.has(k)){rawDelete.call(this,k);rawSet.call(this,k,v);}return v;};map.set=function(k,v){remove(k);const n=(v?.width||0)*(v?.height||0)*4;if(n>limit)return this;while((bytes+n>limit||this.size>=256)&&this.size)remove(this.keys().next().value);rawSet.call(this,k,v);sizes.set(k,n);bytes+=n;return this;};map.delete=remove;map.clear=function(){rawClear.call(this);sizes.clear();bytes=0;};while(bytes>limit&&map.size)remove(map.keys().next().value);return{get bytes(){return bytes},limit};}
const sagaCache194=boundCanvasCache194(spriteCache173),gokuCache194=boundCanvasCache194(tintCache180);
if(location.search.includes('qa=1'))Object.assign(window.__v194,{sagaCache:sagaCache194,gokuCache:gokuCache194,boundCache:boundCanvasCache194});
