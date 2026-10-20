// Original183: Saiyan-only Capsule City, automatic Raditz and charging aura.
const CAPSULE183=REGIONS.length,CAPSULE_W183=4608,CAPSULE_H183=3072;
const capsuleName183=()=>L148('Ciudad Cápsula','Capsule City','Cidade Cápsula','Kapsül Şehri');
const capsuleBuildings183=[
 [[0,0],[70,0],[76,40],[25,48],[0,35]],[[85,0],[155,0],[159,48],[94,57]],
 [[35,118],[83,117],[105,151],[100,204],[63,220],[34,195]],
 [[104,171],[172,163],[213,194],[214,252],[155,278],[100,246]],
 [[286,82],[315,39],[365,25],[414,45],[466,99],[477,176],[428,198],[327,197],[283,171]],
 [[485,6],[514,3],[534,37],[529,74],[491,82],[477,52]],
 [[608,75],[641,68],[669,93],[672,160],[641,174],[611,157]],
 [[682,62],[714,55],[747,82],[750,147],[719,160],[682,142]],
 [[732,149],[764,148],[790,177],[788,231],[750,247],[729,225]],
 [[881,119],[907,110],[937,133],[939,184],[906,196],[881,181]],
 [[972,88],[1004,80],[1034,105],[1036,163],[1002,180],[974,158]],
 [[839,151],[890,143],[960,173],[1025,189],[1093,222],[1094,289],[1038,316],[957,300],[883,272],[836,239]],
 [[1230,271],[1262,262],[1291,287],[1287,344],[1253,357],[1229,337]],
 [[1369,69],[1408,59],[1444,92],[1446,144],[1406,163],[1368,141]],
 [[1287,79],[1316,78],[1337,103],[1338,151],[1305,162],[1287,143]],
 [[1193,8],[1222,7],[1243,34],[1243,86],[1217,99],[1190,78]],
 [[1127,23],[1151,21],[1171,43],[1170,91],[1141,106],[1126,84]],
 [[949,20],[976,20],[997,48],[996,109],[967,118],[943,95]],
 [[1100,387],[1133,379],[1160,404],[1157,437],[1124,447],[1101,430]],
 [[1187,387],[1211,348],[1257,334],[1294,357],[1325,389],[1328,451],[1282,479],[1211,475],[1184,443]],
 [[1141,444],[1170,434],[1193,456],[1194,491],[1164,508],[1138,484]],
 [[1039,566],[1067,540],[1106,531],[1134,551],[1145,584],[1127,645],[1124,689],[1091,709],[1053,689],[1052,642]],
 [[963,515],[992,509],[1014,528],[1013,563],[982,578],[958,555]],
 [[842,562],[864,555],[888,577],[889,604],[860,615],[840,598]],
 [[679,658],[705,644],[732,662],[735,695],[705,708],[679,693]],
 [[614,876],[640,866],[665,888],[666,919],[640,933],[614,916]],
 [[505,189],[537,184],[563,206],[566,238],[540,253],[509,239]],
 [[413,340],[446,331],[477,352],[480,399],[447,413],[416,395]],
 [[240,404],[273,388],[304,410],[308,451],[276,470],[244,448]],
 [[284,470],[314,457],[340,477],[341,511],[311,527],[284,505]],
 [[9,492],[45,464],[85,465],[111,493],[115,549],[66,578],[19,557]],
 [[190,557],[218,522],[270,505],[319,513],[365,546],[403,597],[404,647],[372,682],[299,704],[224,689],[191,644]],
 [[119,658],[149,643],[181,665],[185,704],[151,724],[121,706]],
 [[91,816],[129,789],[169,793],[193,824],[194,867],[152,893],[108,874]],
 [[402,773],[432,749],[467,744],[489,756],[502,788],[494,816],[451,844],[410,832]],
 [[759,0],[790,0],[813,28],[810,75],[777,87],[754,62]],
 [[817,23],[845,23],[872,50],[874,94],[845,110],[818,92]],
 [[234,38],[261,36],[280,57],[279,94],[254,109],[231,90]]
];
// Coastline is the world boundary; streets, pavements, parks and plazas are open.
const capsuleLand183=[[0,0],[1536,0],[1480,150],[1502,213],[1430,285],[1510,333],[1470,430],[1390,495],[1355,550],[1254,622],[1230,693],[1157,749],[1050,752],[991,793],[944,846],[991,894],[1044,1024],[0,1024]];
function capsulePass183(x,y,r=13){const xx=x/3,yy=y/3,rr=r/3;if(x<40+r||y<40+r||x>CAPSULE_W183-40-r||y>CAPSULE_H183-40-r||!pointBuilding182(xx,yy,capsuleLand183))return false;for(const ps of capsuleBuildings183){if(pointBuilding182(xx,yy,ps))return false;for(let i=0;i<ps.length;i++)if(segment181(xx,yy,ps[i],ps[(i+1)%ps.length])<rr)return false;}return true;}
REGIONS.push(makeRegion17('capsuleCity183',capsuleName183(),L148('Campus, plaza y costa conectados','Connected campus, plaza and coast','Campus, praça e costa conectados','Bağlı kampüs, meydan ve kıyı'),{}, {worldW:CAPSULE_W183,worldH:CAPSULE_H183,minX:40,maxX:CAPSULE_W183-40,top:40,bottom:CAPSULE_H183-40,capsule183:true,colliders:[]}));
SAI_ZONES167.push(CAPSULE183);SAI_NAMES167.push(['Ciudad Cápsula','Capsule City','Cidade Cápsula','Kapsül Şehri']);
routes168[4].push({x:1440,y:820,to:5,at:[180,1290],axis:'x',sign:1,label:5});
routes168[5]=[{x:110,y:1290,to:4,at:[1330,820],axis:'x',sign:-1,label:4}];
const capsuleArt183=new Image();let capsuleRequested183=false;
function capsuleReady183(){if(!capsuleRequested183){capsuleRequested183=true;capsuleArt183.src='capsule183/world.webp';}return capsuleArt183.complete&&capsuleArt183.naturalWidth>0;}
function capsuleCamera183(){const zoom=clamp(H/1450,.36,.55);return{zoom,cx:clamp(player.x-W/(2*zoom),0,Math.max(0,CAPSULE_W183-W/zoom)),cy:clamp(player.y-H*.58/zoom,0,Math.max(0,CAPSULE_H183-H/zoom))};}
function capsuleSnap183(){if(capsulePass183(player.x,player.y))return;player.x=180;player.y=1290;}
const blockedBefore183=saiBlocked167;saiBlocked167=function(x,y){return zone===CAPSULE183?!capsulePass183(x,y):blockedBefore183(x,y);};
const travelBefore183=saiTravel167;saiTravel167=function(index,initial=false){if(index===4){raditzAuto183.wait=0;raditzAuto183.ready=false;raditz168=null;}if(index!==5)return travelBefore183(index,initial);if(!sai167()||otherState172().dead||!initial&&(saiRun167.spar||saiRun167.action))return false;zone=CAPSULE183;saiClear167();raditz168=null;zoneStates[region().id]=[];civilStates[region().id]=[];player.x=180;player.y=1290;player.dx=1;player.dy=0;player.face=1;player.walkDir64='right';routeLock168=1.3;cam.x=cam.y=0;if(!discovered.includes(region().id))discovered.push(region().id);capsuleReady183();closeDialog();hud();if(!initial)persistGame();return true;};
const enterBefore183=enterZone;enterZone=function(next,...a){if(next===CAPSULE183)return sai167()?saiTravel167(5):false;return enterBefore183(next,...a);};
const targetBefore183=saiTarget168;saiTarget168=function(){return zone===CAPSULE183?{x:-99999,y:-99999}:targetBefore183();};
const persistBefore183=persistGame;persistGame=function(...a){if(sai167()){const n=saiState167();n.capsule183={inside:zone===CAPSULE183,x:player.x,y:player.y};}return persistBefore183(...a);};
const loadBefore183=load;load=function(...a){const out=loadBefore183(...a);if(sai167()&&zone===CAPSULE183){const p=saiState167().capsule183;if(p?.inside&&Number.isFinite(p.x)&&Number.isFinite(p.y)){player.x=p.x;player.y=p.y;}capsuleSnap183();}return out;};

const raditzAuto183={wait:0,ready:false,lastZone:-1};
const seedBefore183=raditzSeed168;raditzSeed168=function(){if(!raditzHere168())return seedBefore183();if(raditz168?.active&&raditz168.hp>0)return raditz168;if(!raditzAuto183.ready)return null;const p=raditzProgress168();if(p.defeated)raditzRepeat173=true;if(!Number.isFinite(p.hp)||p.hp<=0)p.hp=RADITZ_HP168;p.seen=true;raditz168=null;const b=seedBefore183();if(b){b.active=true;b.cd=2;raditzStory168=-1;raditzAuto183.ready=false;raditzAuto183.wait=0;}return b;};
const updateBefore183=saiUpdate167;saiUpdate167=function(dt){if(!sai167()||!started||paused||cinematic||document.hidden)return updateBefore183(dt);const step=clamp(dt,0,.1);if(raditzAuto183.lastZone!==zone){raditzAuto183.lastZone=zone;raditzAuto183.wait=0;raditzAuto183.ready=false;}const out=updateBefore183(step);if(raditzHere168()&&!otherState172().dead&&player.hp>0){if(raditz168?.active&&raditz168.hp>0){raditzAuto183.wait=0;}else{raditzAuto183.wait=Math.min(3,raditzAuto183.wait+step);if(raditzAuto183.wait>=3-1e-8){raditzAuto183.ready=true;raditzSeed168();persistGame();}}}else{raditzAuto183.wait=0;raditzAuto183.ready=false;}return out;};

// A flowing, white, layered aura; animated in world coordinates while walking too.
function whiteAura183(c,x,y,t=clock){c.save();c.translate(x,y);c.globalCompositeOperation='screen';const pulse=1+Math.sin(t*14)*.035;c.scale(pulse,pulse);const g=c.createRadialGradient(0,-105,15,0,-105,170);g.addColorStop(0,'#f8ffff0a');g.addColorStop(.45,'#e5fbff18');g.addColorStop(.72,'#faffff66');g.addColorStop(1,'#8be5ff00');c.fillStyle=g;c.beginPath();c.ellipse(0,-98,108,183,0,0,Math.PI*2);c.fill();for(let side of[-1,1]){for(let layer=0;layer<3;layer++){c.beginPath();c.moveTo(side*17,12);for(let i=0;i<=16;i++){const u=i/16,w=(70+layer*9)*Math.sin(Math.PI*u*.91)+15,noise=Math.sin(i*2.71-t*(9+layer*2))*10+Math.sin(i*4.2+t*12)*5;c.lineTo(side*(w+noise),-u*(222+layer*9));}for(let i=16;i>=0;i--){const u=i/16,w=(44+layer*6)*Math.sin(Math.PI*u*.91)+11;c.lineTo(side*w,-u*(220+layer*9));}c.closePath();c.fillStyle=['#d4f5ff44','#efffff99','#ffffffcc'][layer];c.fill();}}
c.strokeStyle='#ffffffdd';c.lineWidth=2;for(let i=0;i<17;i++){const seed=i*2.399,phase=(t*(.6+i%3*.12)+i*.173)%1,px=Math.sin(seed)*105*(1-phase*.4),py=10-phase*245,len=12+phase*28;c.beginPath();c.moveTo(px,py);c.lineTo(px+Math.sin(seed+t*3)*6,py-len);c.stroke();}c.globalCompositeOperation='source-over';for(let i=0;i<8;i++){const phase=(t*.45+i*.137)%1,px=Math.cos(i*2.17)*96,py=16-phase*150;c.save();c.translate(px,py);c.rotate(t*.6+i);c.fillStyle='#7c817e';c.fillRect(-3,-2,6+i%3,4+i%2);c.fillStyle='#d1d8d3';c.fillRect(-2,-2,3,1);c.restore();}c.restore();}
const auraBefore183=aura172;aura172=function(x,y,red=false){if(saiRun167.charging&&!red)return whiteAura183(ctx,x,y);return auraBefore183(x,y,red);};

const hudBefore183=saiHud167;saiHud167=function(...a){const out=hudBefore183(...a);if(sai167()&&zone===CAPSULE183){$('#sai-place167').textContent=capsuleName183();$('#sai-objective167').textContent=L148('Explora la ciudad · cráter al oeste ←','Explore the city · crater to the west ←','Explore a cidade · cratera a oeste ←','Şehri keşfet · krater batıda ←');$('#sai-talk167').hidden=true;}return out;};
const css183=document.createElement('style');css183.textContent=`body.sai167 #sai-talk167{position:fixed!important;top:auto!important;right:auto!important;left:41%!important;bottom:max(7%,env(safe-area-inset-bottom))!important;transform:none!important;width:16%!important;min-width:90px!important;max-width:200px!important;min-height:44px!important;height:auto!important;margin:0!important;z-index:65!important}body.sai167 #sai-talk167[hidden]{display:none!important}@media(max-height:420px){body.sai167 #sai-talk167{bottom:max(5%,env(safe-area-inset-bottom))!important;min-height:38px!important;font-size:11px!important}}`;document.head.append(css183);

function capsuleDraw183(){const c=ctx,cam=capsuleCamera183();c.fillStyle='#2198b3';c.fillRect(0,0,W,H);c.save();c.scale(cam.zoom,cam.zoom);c.translate(-cam.cx,-cam.cy);if(capsuleReady183()){c.imageSmoothingEnabled=false;c.drawImage(capsuleArt183,0,0,CAPSULE_W183,CAPSULE_H183);}const r=saiRun167;let row=player.walkDir64==='back'?1:player.walkDir64==='right'?2:player.walkDir64==='left'?3:0,frame=player.moving?Math.floor(r.phase)%8:0;c.fillStyle='#10253066';c.beginPath();c.ellipse(player.x,player.y-2,31,10,0,0,Math.PI*2);c.fill();saiSprite167(row,frame,player.x,player.y,120,player.face<0);for(const s of r.shot)kiVisual180(c,s.x,s.y,s.dx,s.dy);if(otherRun172.genki)kiVisual180(c,player.x,player.y-245,0,-1,'#b7f6ff',24+otherRun172.genki.t*7);if(otherRun172.bomb){const b=otherRun172.bomb;kiVisual180(c,b.x,b.y,b.dx,b.dy,'#b7f6ff',28+(b.charge||0)*5);}if(r.beam){const b=r.beam;c.strokeStyle='#98f7ff';c.lineWidth=28;c.lineCap='round';c.beginPath();c.moveTo(b.x,b.y);c.lineTo(b.x+b.dx*800,b.y+b.dy*800);c.stroke();}c.fillStyle='#082139e6';c.fillRect(70,1190,400,54);c.strokeStyle='#e7c477';c.strokeRect(70,1190,400,54);c.fillStyle='#fff0bc';c.font='bold 25px monospace';c.textAlign='center';c.fillText('← '+L148('CRÁTER','CRATER','CRATERA','KRATER'),270,1226);c.restore();}
const drawBefore183=saiDraw167;saiDraw167=function(...a){return zone===CAPSULE183&&sai167()?capsuleDraw183():drawBefore183(...a);};
const initBefore183=initProgress;initProgress=function(...a){const out=initBefore183(...a);raditzAuto183.wait=0;raditzAuto183.ready=false;raditzAuto183.lastZone=zone;if(sai167()&&zone===CAPSULE183){capsuleSnap183();capsuleReady183();}return out;};
if(location.search.includes('qa=1'))window.__v183={eval:s=>eval(s)};
