// OmniBlizz 1.86: Four Arms AF render/movement and reference HUDs.
SPEEDS[FOUR187]=220;
const mobileBefore190=mobileForm125;mobileForm125=()=>fourForm187()||mobileBefore190();
const fourAtlas190=new Image();fourAtlas190.src='content190/four.webp';
fourAtlas190.onload=()=>{art187.four=fourAtlas190;atlas187.four.width=fourAtlas190.width;atlas187.four.height=fourAtlas190.height;portraitKey86='';};
const poseBefore190=pose187;pose187=function(o=player){
 if(!fourForm187(o))return poseBefore190(o);
 if(o!==player&&o.pose187)return o.pose187;
 const c=o===player?run187.cast:null;
 if(c){const face=Math.cos(c.a??(o.face<0?Math.PI:0))<0?-1:1;
  if(c.kind==='hold')return {row:4,frame:Math.min(4,Math.floor(c.t/.55*5)),face};
  if(c.kind==='throw')return {row:4,frame:Math.min(7,5+Math.floor(Math.max(0,c.t-.65)/.3*3)),face};
  if(c.kind==='clap')return {row:5,frame:Math.min(7,Math.floor(c.t/.8*8)),face};
  if(c.kind==='volley')return {row:6,frame:Math.floor(c.t*16)%8,face};
  if(c.kind==='push')return {row:7,frame:Math.floor(c.t*(o.moving?12:6))%8,face};
  if(c.kind==='basic')return {row:3,frame:Math.min(7,Math.floor(c.t/.42*8)),face};
 }
 const dir=o.walkDir64||o.dir187||'right',row=dir==='back'?2:dir==='front'?1:0;
 return {row,frame:o.moving?Math.floor(o.anim||0)%8:0,face:row===0?(o.face<0?-1:1):1};
};
const fourTileBefore190=tile187;tile187=function(c,key,row,frame,x,y,h=130,face=1){
 if(key!=='four')return fourTileBefore190(c,key,row,frame,x,y,h,face);
 const im=fourAtlas190;if(!im.complete||!im.naturalWidth)return fourTileBefore190(c,key,row,frame,x,y,h,face);
 const w=im.width/8,ch=im.height/8;c.save();c.translate(Math.round(x),Math.round(y));c.scale(face,1);c.imageSmoothingEnabled=false;c.drawImage(im,Math.floor(frame)%8*w,row*ch,w,ch,-h*w/ch/2,-h,h*w/ch,h);c.restore();return true;
};
const basicBefore190=basic187;basic187=function(){const ok=basicBefore190();if(ok&&fourForm187()){effect187(8,player.x+Math.cos(run187.cast.a)*80,player.y+Math.sin(run187.cast.a)*55-65,90,.28,{a:run187.cast.a,four190:true});}return ok;};
const effectsBefore190=effect187;effect187=function(row,x,y,size,max,more={}){return effectsBefore190(row,x,y,size,max,{...more,four190:more.four190||fourForm187()});};
function rock190(c,x,y,size,angle=0,seed=0){c.save();c.translate(Math.round(x),Math.round(y));c.rotate(angle);c.scale(size/100,size/100);const pts=[[-45,-18],[-25,-42],[13,-46],[41,-22],[48,14],[25,42],[-19,45],[-46,19]];c.fillStyle='#4c3430';c.strokeStyle='#251f27';c.lineWidth=4;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fill();c.stroke();c.fillStyle='#a27b57';c.beginPath();c.moveTo(-25,-36);c.lineTo(9,-40);c.lineTo(25,-19);c.lineTo(-3,-9);c.lineTo(-36,-13);c.closePath();c.fill();c.fillStyle='#74523c';c.beginPath();c.moveTo(-38,-7);c.lineTo(-4,1);c.lineTo(18,27);c.lineTo(-16,38);c.lineTo(-39,17);c.closePath();c.fill();c.strokeStyle='#c09a69';c.lineWidth=3;c.beginPath();c.moveTo(-24,-34);c.lineTo(8,-38);c.lineTo(22,-22);c.stroke();c.strokeStyle='#30282c';c.lineWidth=3;c.beginPath();c.moveTo(6,-6);c.lineTo(18,5);c.lineTo(7,20);c.moveTo(18,5);c.lineTo(37,1);c.stroke();c.restore();}
function fourEffect190(c,f){const t=clamp(f.t/f.max,0,1),r=f.size*(.2+t*.65);c.save();c.globalAlpha=1-t;c.translate(f.x,f.y);
 if(f.row===7){c.rotate(f.a||0);for(let k=0;k<3;k++){c.strokeStyle=k===0?'#f9f1c9':'#cfb58a';c.lineWidth=5-k;c.beginPath();c.ellipse(k*20,0,r*(.45+k*.2),r*.42,0,-Math.PI*.7,Math.PI*.7);c.stroke();}}
 else if(f.row===8){c.rotate(f.a||0);c.strokeStyle='#fff2b5';c.lineWidth=5;c.beginPath();c.arc(0,0,r*.6,-1.3,1.3);c.stroke();}
 else {for(let i=0;i<12;i++){const a=i*Math.PI/6,s=(i%3+1)*3,dx=Math.cos(a)*r,dy=Math.sin(a)*r*.5;c.fillStyle=i%2?'#a47e56':'#dbb987';c.fillRect(Math.round(dx),Math.round(dy-18*Math.sin(Math.PI*t)),s,s);}}
 c.restore();}
drawFX187=function(){if(!started)return;ctx.save();ctx.scale(sceneZoom(),sceneZoom());ctx.translate(-Math.round(cam.x),-Math.round(cam.y));ctx.imageSmoothingEnabled=false;
 for(const f of run187.effects){if(f.four190){fourEffect190(ctx,f);continue;}let x=f.follow?player.x:f.x,y=f.follow?(f.row===4?player.y-8:player.y-60):f.y;ctx.save();if(f.beam){ctx.translate(x,y);ctx.rotate(f.a||0);const im=art187.vfx,rr=atlas187.vfx.frames[f.row][Math.min(8,Math.floor(f.t/f.max*9))];if(im.complete&&im.naturalWidth)ctx.drawImage(im,...rr,0,-45,650,90);}else if(f.a!==undefined){ctx.translate(x,y);ctx.rotate(f.a);tile187(ctx,'vfx',f.row,Math.min(8,Math.floor(f.t/f.max*9)),0,f.size/2,f.size,1);}else tile187(ctx,'vfx',f.row,Math.min(8,Math.floor(f.t/f.max*9)),x,y+f.size/2,f.size,1);ctx.restore();}
 for(const q of run187.shots){if(q.kind==='rock'){ctx.save();ctx.strokeStyle='#c5aa7260';ctx.lineWidth=Math.max(3,q.size*.1);ctx.beginPath();ctx.moveTo(q.x-Math.cos(q.a)*40,q.y-55-Math.sin(q.a)*40);ctx.lineTo(q.x,q.y-55);ctx.stroke();ctx.restore();rock190(ctx,q.x,q.y-55,q.size||60,q.t*3);}else tile187(ctx,'vfx',q.kind==='blade'?5:0,Math.floor(q.t*12)%6,q.x,q.y-55+(q.size||40)/2,q.size||40,1);}
 const cast=run187.cast;if(fourForm187()&&cast?.kind==='hold'&&cast.t>=.25)rock190(ctx,player.x,player.y-160,95,Math.sin(clock*3)*.025);
 if(fourForm187()&&cast?.kind==='push'){rock190(ctx,player.x+Math.cos(cast.a)*125,player.y+Math.sin(cast.a)*80-65,155,clock*.3);for(let i=0;i<5;i++){ctx.fillStyle='#b9986155';ctx.fillRect(player.x+Math.cos(cast.a)*120-30+i*14,player.y+Math.sin(cast.a)*80+Math.sin(clock*9+i)*5,8,4);}}
 if(run187.shield>0)tile187(ctx,'vfx',2,3+Math.floor(clock*6)%3,player.x,player.y+8,170,1);ctx.restore();
};
const hudStyle190=document.createElement('link');hudStyle190.rel='stylesheet';hudStyle190.href='content190/hud.css';document.head.append(hudStyle190);
const hudBefore190=hud;hud=function(...a){const r=hudBefore190(...a);$('#hud').dataset.reference190=race==='anodite'?'anodite':race==='omni'?'omni':'';return r;};
const drawActorBefore190=draw187Actor;draw187Actor=function(o){if(!fourForm187(o))return drawActorBefore190(o);const pose=pose187(o);ctx.save();ctx.globalAlpha=o.inv>0&&Math.floor(clock*15)%2?.55:1;ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(o.x,o.y-2,34,10,0,0,Math.PI*2);ctx.fill();tile187(ctx,'four',pose.row,pose.frame,o.x,o.y-(o===player?jumpHeight():0),180,pose.face);ctx.restore();return true;};
const newsBefore190=updateLog23;updateLog23=function(){showDialog('OMNIBLIZZ · 1.86',L148('Fuerza y maná','Strength and mana','Força e mana','Güç ve mana'),'<p>'+L148('Cuatro Brazos AF: movimiento reparado, animaciones de caminata y combate recreadas, rocas y ondas sónicas nuevas. Interfaces de Omnitrix y Anodita renovadas.','Four Arms AF: movement fixed, rebuilt walking and combat animations, new rocks and sonic waves. Renewed Omnitrix and Anodite interfaces.','Quatro Braços AF: movimento corrigido, animações de caminhada e combate refeitas, novas rochas e ondas sônicas. Interfaces Omnitrix e Anodita renovadas.','Dört Kol AF: hareket düzeltildi, yürüyüş ve dövüş animasyonları yenilendi, yeni kayalar ve sonik dalgalar. Omnitrix ve Anodit arayüzleri yenilendi.')+'</p>',[[L148('JUGAR','PLAY','JOGAR','OYNA'),closeDialog]]);localStorage.setItem('omni-seen-update','1.86');};
readyLog23=function(){if(logFirst23||!ready)return;logFirst23=true;if(localStorage.getItem('omni-seen-update')!=='1.86')updateLog23();};
if(location.search.includes('qa=1'))window.__v190={eval:s=>eval(s)};

// 1.87: HUD coordinates belong to the 960x540 game, never to the device viewport.
ALIENS[FOUR187].skills.forEach(s=>{s.cost=0;});
const portraitBefore191=paintPortrait86;paintPortrait86=function(){if(!fourForm187()||!fourAtlas190.complete||!fourAtlas190.naturalWidth)return portraitBefore191();portraitCtx86.clearRect(0,0,96,96);portraitCtx86.imageSmoothingEnabled=false;portraitCtx86.drawImage(fourAtlas190,68,234,56,56,0,0,96,96);};
hudStyle190.href='content191/hud.css';
const energyArt191=document.createElement('canvas');energyArt191.id='energy-art191';energyArt191.width=72;energyArt191.height=80;energyArt191.setAttribute('aria-hidden','true');$('.omni').append(energyArt191);
function energyPortrait191(){if(race!=='omni')return;const id=player.alien?player.activeAlien:player.selected,info=spriteInfo(ALIENS[id]?.row??0),im=info?.sheet,r=info?.table?.[0];if(!r||!im?.complete||!im.naturalWidth)return;const c=energyArt191.getContext('2d');c.clearRect(0,0,72,80);c.imageSmoothingEnabled=false;const scale=Math.min(66/r[2],76/r[3]);c.drawImage(im,...r,(72-r[2]*scale)/2,80-r[3]*scale,r[2]*scale,r[3]*scale);}
const hudBefore191=hud;hud=function(...a){const r=hudBefore191(...a);energyArt191.hidden=race!=='omni';energyPortrait191();return r;};
point=function(e){const el=$('#joystick'),r=el.getBoundingClientRect(),logical=el.offsetWidth||154,limit=logical*.325;let x=(e.clientX-r.left)/r.width*logical-logical/2,y=(e.clientY-r.top)/r.height*logical-logical/2,len=Math.hypot(x,y);if(len>limit){x*=limit/len;y*=limit/len;}stick.x=x/limit;stick.y=y/limit;$('#stick').style.transform='translate('+x+'px,'+y+'px)';};
if(location.search.includes('qa=1'))window.__v191={eval:s=>eval(s)};

// 1.88: compact Anodite sidebar, static HUD artwork and larger closed recalibrated icon only.
hudStyle190.href='content192/hud.css';
roomButton51.id='room-exit192';
let energyKey192='';const energyPaintBefore192=energyPortrait191;
energyPortrait191=function(){if(race!=='omni')return;const id=player.alien?player.activeAlien:player.selected,info=spriteInfo(ALIENS[id]?.row??0),im=info?.sheet;if(!im?.complete||!im.naturalWidth)return;const key=[id,im.src,im.naturalWidth,im.naturalHeight].join('|');if(key===energyKey192)return;energyPaintBefore192();energyKey192=key;};
let fourPortraitKey192='';const portraitBefore192=paintPortrait86;
paintPortrait86=function(){if(!fourForm187()){fourPortraitKey192='';return portraitBefore192();}if(!fourAtlas190.complete||!fourAtlas190.naturalWidth)return;const key=fourAtlas190.src+'|'+fourAtlas190.naturalWidth;if(key===fourPortraitKey192)return;portraitBefore192();fourPortraitKey192=key;};
let lastHudTime192=-Infinity,lastHudKey192='';const hudBefore192=hud;
hud=function(...a){const now=performance.now(),key=[race,zone,started,paused,dialogOpen,player.alien,player.selected,player.activeAlien,player.watchOpen,attackPage].join('|');if(race==='anodite'&&inFrame188&&key===lastHudKey192&&now-lastHudTime192<1000/12)return;lastHudTime192=now;lastHudKey192=key;return hudBefore192(...a);};
if(location.search.includes('qa=1'))window.__v192={eval:s=>eval(s)};
