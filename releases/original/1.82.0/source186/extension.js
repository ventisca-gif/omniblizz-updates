// Original 1.82 / revision186. Namek: only the requested first visit.
const N186=(...a)=>L148(...a);
const NAMEK_Z186=Array.from({length:6},(_,i)=>REGIONS.length+i);
const NAMEK_NAMES186=[
 ['Namek · aldea del lago','Namek · lake village','Namek · aldeia do lago','Namek · göl köyü'],
 ['Namek · sendero azul','Namek · blue trail','Namek · trilha azul','Namek · mavi patika'],
 ['Namek · grandes mesetas','Namek · great mesas','Namek · grandes planaltos','Namek · büyük platolar'],
 ['Namek · pradera','Namek · meadow','Namek · pradaria','Namek · çayır'],
 ['Namek · orilla tranquila','Namek · quiet shore','Namek · margem tranquila','Namek · sakin kıyı'],
 ['Namek · Gran Patriarca','Namek · Grand Elder','Namek · Grande Patriarca','Namek · Büyük Ata']
];
for(let i=0;i<6;i++){
 REGIONS.push(makeRegion17('namek186-'+i,N186(...NAMEK_NAMES186[i]),'Namek · 1×',{},{
  worldW:1600,worldH:900,minX:70,maxX:1530,top:620,bottom:735,namek186:true,colliders:[]
 }));
 SAI_ZONES167.push(NAMEK_Z186[i]);SAI_NAMES167.push(NAMEK_NAMES186[i]);
}
function namekHere186(){return sai167()&&NAMEK_Z186.includes(zone);}
function namekIndex186(){return NAMEK_Z186.indexOf(zone);}
function namekState186(p=player){
 const n=saiState167(p);
 if(!n.namek186||typeof n.namek186!=='object')n.namek186={};
 const s=n.namek186;
 s.visited=!!s.visited;s.potential=!!s.potential;s.evil=!!s.evil;
 s.shipAt=s.shipAt==='namek'?'namek':'earth';
 s.room=Number.isInteger(s.room)?clamp(s.room,-1,5):-1;
 s.x=Number.isFinite(s.x)?clamp(s.x,90,1510):240;
 s.y=Number.isFinite(s.y)?clamp(s.y,600,725):695;
 s.wins=Math.max(0,Math.floor(Number(s.wins)||0));
 s.nextDuel=Math.max(0,Math.floor(Number(s.nextDuel)||0));
 if(!s.people||typeof s.people!=='object'||Array.isArray(s.people))s.people={};
 return s;
}
const namekDefs186=NAMEK_Z186.flatMap((z,room)=>[0,1].map((v)=>{
 const type=(room*2+v)%4,power=[40000,50000,70000,80000][type];
 return {id:room+'-'+v,room,z,type,power,max:900+power/60,
  x:v?1120:room===0?660:420,y:room===5?625:v?710:680};
}));
function personState186(d){
 const s=namekState186();let p=s.people[d.id];
 if(!p||typeof p!=='object')p=s.people[d.id]={};
 p.hp=Number.isFinite(p.hp)?clamp(p.hp,0,d.max):d.max;
 p.dead=!!p.dead;p.down=clamp(Number(p.down)||0,0,25);
 p.angry=!!p.angry&&!p.dead&&p.down<=0;
 p.claimed=Math.max(0,Math.floor(Number(p.claimed)||0));
 if(p.dead)p.hp=0;
 return p;
}
const namekRun186={people:[],duel:null,lock:1,shots:[],flash:0,guruGlow:0,save:0,flight:null};
function rebuildPeople186(){
 namekRun186.people=namekDefs186.filter(d=>d.room===namekIndex186()).map(d=>{
  const s=personState186(d);
  return {...d,x:d.x,y:d.y,wind:0,cd:1.5,flash:0,pose:0,moving:false,state:s};
 });
}
function namekBusy186(){return !!namekRun186.duel||namekRun186.people.some(p=>p.state.angry&&!p.state.dead&&p.state.down<=0);}
function namekGate186(){return sai167()&&cityUnlocked184()&&story184().bulma&&!otherState172().dead;}
function namekEnter186(index,x=220,y=695,internal=false){
 if(!Number.isInteger(index)||index<0||index>5||!namekGate186()||run184.exercise||namekRun186.flight)return false;
 if(!internal&&!namekHere186())return false;
 if(namekBusy186())return false;
 zone=NAMEK_Z186[index];saiClear167();raditz168=null;
 player.x=clamp(x,90,1510);player.y=index===5?clamp(y,610,635):clamp(y,635,725);
 player.dx=player.face=x>800?-1:1;player.dy=0;player.walkDir64=player.face<0?'left':'right';
 player.moving=false;cam.x=cam.y=0;namekRun186.lock=1;namekRun186.shots=[];
 namekState186().visited=true;namekState186().shipAt='namek';
 zoneStates[region().id]=[];civilStates[region().id]=[];
 if(!discovered.includes(region().id))discovered.push(region().id);
 rebuildPeople186();for(let a=0;a<6;a++){const k='area'+a;if(Math.abs(a-index)<=1)ready186(k);else if(art186[k]){delete art186[k];artRequest186.delete(k);}}closeDialog();resetInput();hud();persistGame();return true;
}
function nearestPerson186(max=180){
 return namekRun186.people.filter(p=>!p.state.dead&&p.state.down<=0)
 .map(p=>({p,d:Math.hypot(p.x-player.x,p.y-player.y)})).filter(o=>o.d<max)
 .sort((a,b)=>a.d-b.d)[0]?.p||null;
}
const blockedBefore186=saiBlocked167;
saiBlocked167=function(x,y){return namekHere186()?x<70||x>1530||y<(namekIndex186()===5?600:620)||y>(namekIndex186()===5?645:735):blockedBefore186(x,y);};
const damageBefore186=saiDamage167;
saiDamage167=function(base){return damageBefore186(base)*(sai167()&&namekState186().potential?1.2:1);};
const powerBefore186=effectivePower172;
effectivePower172=function(){return powerBefore186()*(namekState186().potential?1.2:1);};
const targetBefore186=saiTarget168;
saiTarget168=function(){
 if(!namekHere186())return targetBefore186();
 const duel=namekRun186.duel;
 const p=duel?namekRun186.people.find(p=>p.id===duel.id):nearestPerson186(1700);
 return p&&!p.state.dead&&p.state.down<=0?p:{x:-99999,y:-99999};
};
const hitBefore186=saiHitTarget167;
saiHitTarget167=function(damage){
 if(!namekHere186())return hitBefore186(damage);
 const p=saiTarget168();
 if(!p.state||p.state.dead||p.state.down>0||!Number.isFinite(damage)||damage<=0)return false;
 const ratio=clamp(Math.sqrt(effectivePower172()/p.power),.18,3);
 p.state.hp=Math.max(0,p.state.hp-damage*ratio);p.flash=.18;p.state.angry=true;
 if(p.state.hp<=0){
  const s=namekState186(),duel=namekRun186.duel;
  if(duel&&duel.id===p.id){
   // Claim before granting; the claim and reward are persisted together.
   if(p.state.claimed<duel.token){p.state.claimed=duel.token;s.wins++;saiState167().power=Math.min(1e12,saiState167().power+100);}
   p.state.down=20;p.state.angry=false;namekRun186.duel=null;s.practice=null;
   toast(N186('Entrenamiento completado · +100 PL','Training complete · +100 PL','Treino concluído · +100 PL','Eğitim tamamlandı · +100 PL'));
  }else{
   p.state.dead=true;p.state.angry=false;s.evil=true;
   toast(N186('Has matado a un namekiano · ahora eres malo','You killed a Namekian · you are now evil','Você matou um namekuseijin · agora é mau','Bir Namekliyi öldürdün · artık kötüsün'));
  }
 }
 persistGame();return true;
};
function startDuel186(id){
 if(!namekHere186()||namekBusy186()||player.hp<=0||saiRun167.action||otherRun172.genki||otherRun172.bomb)return false;
 const p=nearestPerson186();
 if(!p||p.id!==id||p.state.hp<p.max||p.state.angry)return false;
 const s=namekState186();s.nextDuel++;p.state.angry=true;
 namekRun186.duel={id,token:s.nextDuel};s.practice=id;p.cd=1.8;closeDialog();resetInput();persistGame();return true;
}
function talkPerson186(p){
 if(!namekHere186()||!p||Math.hypot(p.x-player.x,p.y-player.y)>180||p.state.dead||p.state.down>0)return false;
 if(namekBusy186())return false;
 showDialog('NAMEK',N186('Namekiano','Namekian','Namekuseijin','Namekli')+' · '+p.power.toLocaleString()+' PL',
 '<div data-no-i18n><p>'+N186('Somos pacíficos. Puedes entrenar conmigo: vencer me dejará descansando un momento y ganarás +100 PL. Un entrenamiento no te vuelve malo. Atacar fuera del entrenamiento puede matarme.','We are peaceful. Train with me: winning lets me rest for a while and gives you +100 PL. Training does not make you evil. Attacking outside training can kill me.','Somos pacíficos. Treine comigo: vencer me deixa descansando um pouco e concede +100 PL. Treinar não torna você mau. Atacar fora do treino pode me matar.','Biz barışçılız. Benimle çalış: kazanırsan biraz dinlenirim ve +100 PL alırsın. Eğitim seni kötü yapmaz. Eğitim dışında saldırmak beni öldürebilir.')+'</p></div>',
 [[N186('ENTRENAR · +100 PL','TRAIN · +100 PL','TREINAR · +100 PL','EĞİTİM · +100 PL'),()=>startDuel186(p.id)],[N186('CONTINUAR','CONTINUE','CONTINUAR','DEVAM'),closeDialog]]);
 return true;
}
function guruTalk186(){
 if(!namekHere186()||namekIndex186()!==5||Math.hypot(player.x-1000,player.y-625)>240||namekBusy186())return false;
 const s=namekState186();
 showDialog('NAMEK',N186('Gran Patriarca','Grand Elder','Grande Patriarca','Büyük Ata'),
 '<div data-no-i18n><p>'+N186('Puedo despertar tu potencial oculto. Tu poder efectivo y daño pasarán del 100 % al 120 %. Este don se concede una sola vez.','I can awaken your hidden potential. Your effective power and damage rise from 100% to 120%. This gift is granted only once.','Posso despertar seu potencial oculto. Seu poder efetivo e dano passam de 100% para 120%. Este dom é concedido apenas uma vez.','Gizli potansiyelini uyandırabilirim. Etkin gücün ve hasarın %100’den %120’ye çıkar. Bu armağan yalnızca bir kez verilir.')+'</p><strong>'+N186('POTENCIAL','POTENTIAL','POTENCIAL','POTANSİYEL')+' '+(s.potential?'120%':'100%')+'</strong></div>',
 [...(!s.potential?[[N186('DESPERTAR POTENCIAL','AWAKEN POTENTIAL','DESPERTAR POTENCIAL','POTANSİYELİ UYANDIR'),awakenPotential186]]:[]),[N186('CONTINUAR','CONTINUE','CONTINUAR','DEVAM'),closeDialog]]);return true;
}
function awakenPotential186(){
 if(!namekHere186()||namekIndex186()!==5||Math.hypot(player.x-1000,player.y-625)>240||namekBusy186()||namekState186().potential)return false;
 namekState186().potential=true;namekRun186.guruGlow=5;closeDialog();persistGame();hud();return true;
}
function namekTick186(dt){
 if(!namekHere186())return;
 namekRun186.lock=Math.max(0,namekRun186.lock-dt);namekRun186.guruGlow=Math.max(0,namekRun186.guruGlow-dt);
 for(const def of namekDefs186){
  const s=personState186(def);
  if(s.down>0){s.down=Math.max(0,s.down-dt);if(s.down===0)s.hp=def.max;}
 }
 for(const p of namekRun186.people){
  const s=p.state;p.flash=Math.max(0,p.flash-dt);p.pose=Math.max(0,p.pose-dt);p.moving=false;
  if(s.dead||s.down>0||!s.angry)continue;
  p.cd-=dt;
  const distance=Math.hypot(player.x-p.x,player.y-p.y),dx=player.x-p.x;
  if(p.wind>0){
   p.wind=Math.max(0,p.wind-dt);
   if(p.wind===0){
    p.pose=.4;p.cd=2.2;
    if(distance<170){player.hp=Math.max(0,player.hp-saiHP167()*.09*clamp(Math.sqrt(p.power/effectivePower172()),.3,3));player.regenWait=3;}
    else if(distance<800){
     const dy=player.y-p.y,l=Math.hypot(dx,dy)||1;
     namekRun186.shots.push({x:p.x,y:p.y-50,dx:dx/l*340,dy:dy/l*340,t:2.5,power:p.power});
    }
   }
  }else if(p.cd<=0&&distance<800)p.wind=.75;
  else if(distance>125){
   const x=clamp(p.x+Math.sign(dx)*110*dt,80,1520);
   if(!saiBlocked167(x,p.y)){p.x=x;p.moving=true;}
   p.y=clamp(p.y+Math.sign(player.y-p.y)*45*dt,namekIndex186()===5?610:635,namekIndex186()===5?635:725);
  }
 }
 for(const b of namekRun186.shots){
  b.t-=dt;b.x+=b.dx*dt;b.y+=b.dy*dt;
  if(b.t>0&&Math.hypot(b.x-player.x,b.y-(player.y-50))<35){
   b.t=0;player.hp=Math.max(0,player.hp-saiHP167()*.07*clamp(Math.sqrt(b.power/effectivePower172()),.3,3));player.regenWait=3;
  }
 }
 namekRun186.shots=namekRun186.shots.filter(b=>b.t>0);
 if(player.hp<=0){saiDeath172(false);return;}
 namekRun186.save+=dt;if(namekRun186.save>3){namekRun186.save=0;persistGame();}
 if(namekRun186.lock<=0&&!namekBusy186()&&player.moving){
  const i=namekIndex186();
  if(player.x>1460&&player.dx>.2&&i<5)namekEnter186(i+1,150,player.y,true);
  else if(player.x<140&&player.dx<-.2&&i>0)namekEnter186(i-1,1450,player.y,true);
 }
}
const updateBefore186=saiUpdate167;
saiUpdate167=function(dt){
 if(!namekHere186())return updateBefore186(dt);
 if(!started||paused||cinematic||document.hidden||namekRun186.flight)return;
 dt=clamp(Number(dt)||0,0,.1);updateBefore168(dt);
 if(!namekHere186())return;otherTick172(dt);namekTick186(dt);saiHud167();
 if(toastTime>0){toastTime=Math.max(0,toastTime-dt);if(!toastTime)$('#toast').classList.remove('show');}
};
const travelBefore186=saiTravel167;
saiTravel167=function(index,initial=false){
 const ni=NAMEK_Z186.indexOf(SAI_ZONES167[index]);
 if(ni>=0)return namekEnter186(ni,220,695,initial&&namekGate186()&&namekState186().visited);
 if(namekHere186()&&!initial){toast(N186('Regresa con la nave','Return using the ship','Volte pela nave','Gemiyle geri dön'));return false;}
 return travelBefore186(index,initial);
};
const enterBefore186=enterZone;
enterZone=function(next,...a){
 if(NAMEK_Z186.includes(next))return namekEnter186(NAMEK_Z186.indexOf(next));
 if(namekHere186()&&namekBusy186())return false;
 return enterBefore186(next,...a);
};
const roomBefore186=enter184;
enter184=function(...a){
 if(namekHere186()){if(namekBusy186())return false;return false;}
 return roomBefore186(...a);
};
const art186={},artRequest186=new Set();
function ready186(key){
 if(!artRequest186.has(key)){artRequest186.add(key);const im=new Image();art186[key]=im;im.src='namek186/'+key+'.webp';}
 return !!art186[key]?.complete&&art186[key].naturalWidth>0;
}
let namekAtlas186={"frames":[[[31,18,150,163],[182,22,160,159],[365,21,160,160],[556,15,154,166],[733,17,164,164],[945,16,141,165],[1099,26,151,155],[1286,27,132,154]],[[0,181,181,181],[182,181,180,181],[362,181,181,181],[543,181,181,181],[724,181,181,181],[905,181,181,181],[1086,181,179,181],[1284,181,146,181]],[[16,362,162,181],[186,362,158,181],[377,362,162,181],[564,362,160,181],[725,362,163,181],[931,362,155,181],[1107,362,159,181],[1286,362,146,181]],[[29,543,150,181],[198,543,164,181],[365,543,178,181],[543,543,181,181],[724,543,181,181],[905,543,181,181],[1086,543,174,181],[1286,543,130,181]],[[0,724,181,181],[181,724,175,181],[365,724,178,181],[543,724,181,181],[724,724,181,181],[905,724,181,181],[1086,724,174,181],[1272,724,176,181]],[[0,905,181,181],[181,905,181,181],[362,905,181,181],[543,905,181,181],[724,905,181,181],[905,905,181,181],[1086,905,181,181],[1267,905,181,181]]],"units":[163,181,181,181,181,181],"size":[1448,1086]};
function actor186(row,frame,x,y,h=126,flip=false){
 if(!ready186('actors')||!namekAtlas186)return;
 const f=namekAtlas186.frames[row]?.[Math.floor(frame)%8];if(!f)return;
 const scale=h/namekAtlas186.units[row];
 ctx.save();ctx.translate(x,y);if(flip)ctx.scale(-1,1);ctx.imageSmoothingEnabled=false;
 ctx.drawImage(art186.actors,f[0],f[1],f[2],f[3],-f[2]*scale/2,-f[3]*scale,f[2]*scale,f[3]*scale);ctx.restore();
}
function drawHero186(){
 const r=saiRun167,a=r.action;
 let row=player.walkDir64==='back'?1:player.walkDir64==='right'?2:player.walkDir64==='left'?3:0;
 let frame=player.moving?Math.floor(r.phase)%8:0,flip=false;
 if(a?.type==='punch'){row=4;frame=Math.min(7,Math.floor(a.t/a.max*8));flip=player.face<0;}
 else if(a?.type==='kame'){row=5;frame=Math.min(7,Math.floor(a.t/a.max*8));flip=a.dx<0;}
 else if(r.charging&&!player.moving){row=6;frame=Math.floor(clock*8)%8;}
 if(otherRun172.kai||r.charging)aura172(player.x,player.y,true);
 saiSprite167(row,frame,player.x,player.y,120,flip);
 for(const s of r.shot)kiVisual180(ctx,s.x,s.y,s.dx,s.dy);
 if(r.beam){const b=r.beam;ctx.lineCap='round';for(const [w,col]of[[45,'#2bc5ff66'],[24,'#8af6ff'],[10,'#ffffff']]){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x+b.dx*800,b.y+b.dy*800);ctx.stroke();}}
 if(otherRun172.bomb){const b=otherRun172.bomb;ctx.fillStyle='#aff9ff';ctx.beginPath();ctx.arc(b.x,b.y,25+b.charge*5,0,Math.PI*2);ctx.fill();}
}
function namekDraw186(){
 const c=ctx,i=namekIndex186(),zoom=Math.max(W/1600,H/900);
 const cx=clamp(player.x-W/(2*zoom),0,Math.max(0,1600-W/zoom)),cy=clamp(player.y-H*.74/zoom,0,Math.max(0,900-H/zoom));
 c.fillStyle='#26b455';c.fillRect(0,0,W,H);c.save();c.scale(zoom,zoom);c.translate(-cx,-cy);c.imageSmoothingEnabled=false;
 if(ready186('area'+i))c.drawImage(art186['area'+i],0,0,1600,900);
 if(i===0){actor186Ship(205,670,165);arrow184(205,540,N186('NAVE','SHIP','NAVE','GEMİ'));}
 const drawables=namekRun186.people.map(p=>({y:p.y,draw:()=>{
  const s=p.state;if(s.dead)return;
  const row=s.down>0?4:p.wind>0||p.pose>0?p.type%2?3:1:p.type%2?2:0;
  const frame=s.down>0?5:p.wind>0?Math.floor((.75-p.wind)/.75*4):p.pose>0?5:p.moving?Math.floor(clock*9)%8:Math.floor(clock*2)%2;
  c.fillStyle='#071a3f66';c.beginPath();c.ellipse(p.x,p.y-2,28,8,0,0,Math.PI*2);c.fill();
  actor186(row,frame,p.x,p.y,126,player.x<p.x);
  c.font='bold 15px monospace';c.textAlign='center';c.strokeStyle='#182844';c.lineWidth=4;
  const label=p.power.toLocaleString()+' PL'+(s.down>0?' · '+N186('DESCANSANDO','RESTING','DESCANSANDO','DİNLENİYOR'):'');
  c.strokeText(label,p.x,p.y-146);c.fillStyle=s.angry?'#ffab8a':'#fff3bf';c.fillText(label,p.x,p.y-146);
  if(s.angry){c.fillStyle='#222e44';c.fillRect(p.x-50,p.y-137,100,7);c.fillStyle='#a1e986';c.fillRect(p.x-50,p.y-137,100*s.hp/p.max,7);}
  if(p.wind>0){c.strokeStyle='#ffd666';c.lineWidth=3;c.beginPath();c.ellipse(p.x,p.y,170,40,0,0,Math.PI*2);c.stroke();}
 }}));
 drawables.push({y:player.y,draw:drawHero186});
 if(i===5)drawables.push({y:625,draw:()=>{actor186(5,Math.floor(clock*3)%8,1000,625,210);arrow184(1000,445,N186('GRAN PATRIARCA','GRAND ELDER','GRANDE PATRIARCA','BÜYÜK ATA'));}});
 drawables.sort((a,b)=>a.y-b.y).forEach(d=>d.draw());
 if(namekRun186.guruGlow>0){c.save();c.strokeStyle='#c6ffa6';c.lineWidth=5;c.globalAlpha=Math.min(1,namekRun186.guruGlow);c.beginPath();c.ellipse(player.x,player.y-60,65+Math.sin(clock*6)*8,100,0,0,Math.PI*2);c.stroke();c.restore();}
 for(const b of namekRun186.shots){c.fillStyle='#fffca6';c.strokeStyle='#ffc543';c.lineWidth=5;c.beginPath();c.arc(b.x,b.y,12,0,Math.PI*2);c.fill();c.stroke();}
 if(i>0)arrow184(110,610,'← '+N186('REGRESAR','BACK','VOLTAR','GERİ'));
 if(i<5)arrow184(1490,610,N186('CONTINUAR','NEXT','CONTINUAR','DEVAM')+' →');
 c.restore();
}
function actor186Ship(x,y,w){
 if(!ready186('ship'))return;
 const im=art186.ship;ctx.drawImage(im,x-w/2,y-w*.85,w,w*.85);
}
const drawBefore186=saiDraw167;
saiDraw167=function(...a){return namekHere186()?namekDraw186():drawBefore186(...a);};

// An ordered, touch-accessible target game accelerates the existing real exercise.
const ballBox186=document.createElement('div');ballBox186.id='training-balls186';ballBox186.hidden=true;
ballBox186.innerHTML='<p></p><button type="button" id="training-ball186">1</button><small></small>';
document.body.append(ballBox186);
const ballRun186={exercise:null,step:0};
function renderBall186(){
 const ex=run184.exercise,show=!!ex&&sai167()&&zone===SHIP184&&started&&!namekRun186.flight;
 ballBox186.hidden=!show;if(!show)return;
 const b=ballBox186.querySelector('button');
 ballBox186.querySelector('p').textContent=N186('TOCA LA BOLITA · ACELERA TU SERIE','TAP THE TARGET · SPEED UP YOUR SET','TOQUE A BOLINHA · ACELERE SUA SÉRIE','HEDEFE DOKUN · SETİNİ HIZLANDIR');
 ballBox186.querySelector('small').textContent=N186('PC: Espacio · E: cancelar','PC: Space · E: cancel','PC: Espaço · E: cancelar','PC: Boşluk · E: iptal');
 b.textContent=String(ballRun186.step+1);
 const positions=[[12,30],[62,40],[34,65],[72,72],[20,70],[47,28],[75,30],[43,70]],p=positions[ballRun186.step%8];
 b.style.left=p[0]+'%';b.style.top=p[1]+'%';
}
function ballTap186(){
 const ex=run184.exercise;
 if(!ex||ballRun186.exercise!==ex||zone!==SHIP184||paused||cinematic||!started)return false;
 ballRun186.step++;
 if(ex.kind==='kame'){ex.fireWait=Math.max(0,ex.fireWait-.8);saiState167().ki=Math.min(saiKiMax167(),saiState167().ki+6);}
 else ex.t=Math.min(12,ex.t+1.5);
 renderBall186();return true;
}
ballBox186.querySelector('button').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();ballTap186();});
const startBefore186=exerciseStart184;
exerciseStart184=function(...a){
 const out=startBefore186(...a);
 if(out){ballRun186.exercise=run184.exercise;ballRun186.step=0;renderBall186();}return out;
};
const cancelBefore186=exerciseCancel184;
exerciseCancel184=function(...a){const out=cancelBefore186(...a);ballRun186.exercise=null;ballBox186.hidden=true;return out;};
const exTickBefore186=exerciseTick184;
exerciseTick184=function(dt){const out=exTickBefore186(dt);renderBall186();return out;};
const tripBox186=document.createElement('section');tripBox186.id='namek-flight186';tripBox186.hidden=true;
tripBox186.innerHTML='<canvas></canvas><div><h2></h2><p></p><button type="button"></button></div>';
document.body.append(tripBox186);
function flight186(toNamek){
 if(!namekGate186()||namekBusy186()||run184.exercise||saiRun167.action||namekRun186.flight)return false;
 if(toNamek&&zone!==SHIP184)return false;
 if(!toNamek&&(!namekHere186()||namekIndex186()!==0||Math.hypot(player.x-205,player.y-695)>190))return false;
 namekRun186.flight={toNamek,t:0,lastTap:-1000};paused=true;resetInput();closeDialog();paused=true;
 tripBox186.querySelector('h2').textContent=toNamek?N186('RUMBO A NAMEK','JOURNEY TO NAMEK','RUMO A NAMEK','NAMEK YOLCULUĞU'):N186('REGRESO A LA TIERRA','RETURN TO EARTH','VOLTA À TERRA','DÜNYA’YA DÖNÜŞ');
 tripBox186.querySelector('p').textContent=N186('Doble toque para saltar · Enter / Esc','Double-tap to skip · Enter / Esc','Toque duas vezes para pular · Enter / Esc','Atlamak için çift dokun · Enter / Esc');
 const b=tripBox186.querySelector('button');b.textContent=N186('SALTAR','SKIP','PULAR','ATLA');b.onclick=finishFlight186;
 tripBox186.hidden=false;ready186('area0');ready186('actors');ready186('planet');ready186('ship');requestAnimationFrame(flightFrame186);return true;
}
function finishFlight186(){
 const f=namekRun186.flight;if(!f)return false;
 namekRun186.flight=null;tripBox186.hidden=true;paused=false;resetInput();
 if(f.toNamek){namekState186().shipAt='namek';return namekEnter186(0,380,695,true);}
 namekState186().shipAt='earth';namekState186().room=-1;
 // Leave Namek via the authorised return journey, retaining the original room enter path.
 zone=SHIP184;const out=roomBefore186(CORP184,1120,850);
 persistGame();return out;
}
function flightFrame186(now){
 const f=namekRun186.flight;if(!f)return;
 if(f.prev===undefined)f.prev=now;
 f.t+=Math.min(.1,Math.max(0,(now-f.prev)/1000));f.prev=now;
 const canvas=tripBox186.querySelector('canvas'),c=canvas.getContext('2d');
 canvas.width=960;canvas.height=540;c.fillStyle='#020a1e';c.fillRect(0,0,960,540);
 for(let i=0;i<85;i++){const x=((i*193-f.t*100)%980+980)%980,y=(i*83)%540;c.fillStyle=i%3?'#93bed4':'#fff';c.fillRect(x,y,i%3?2:3,2);}
 if(ready186('planet')){const a=art186.planet;c.globalAlpha=clamp(f.t/2,0,1);c.drawImage(a,600,60,300,300);c.globalAlpha=1;}
 if(ready186('ship')){const x=f.toNamek?100+Math.min(1,f.t/5)*480:580-Math.min(1,f.t/5)*480;c.drawImage(art186.ship,x,220+Math.sin(f.t*2)*8,220,185);}
 if(f.t>=6)return finishFlight186();requestAnimationFrame(flightFrame186);
}
tripBox186.addEventListener('pointerup',e=>{
 if(!namekRun186.flight||e.target.closest?.('button'))return;
 const now=performance.now();if(now-namekRun186.flight.lastTap<450)finishFlight186();else namekRun186.flight.lastTap=now;
});
window.addEventListener('keydown',e=>{if(namekRun186.flight&&['Enter','Escape',' '].includes(e.key)){e.preventDefault();finishFlight186();}},true);
function shipMenu186(){
 if(zone!==SHIP184||!namekGate186())return false;
 showDialog('CAPSULE CORP.',shipName184(),'<div data-no-i18n><p>'+N186('Toca las bolitas durante los ejercicios para terminar antes. Cada serie conserva +70 PL. Namek está listo: viaja y regresa en esta misma nave. Gravedad 1×.','Tap the targets during exercises to finish sooner. Each set still gives +70 PL. Namek is ready: travel and return in this same ship. Gravity 1×.','Toque as bolinhas durante os exercícios para terminar antes. Cada série mantém +70 PL. Namek está pronto: viaje e volte nesta mesma nave. Gravidade 1×.','Egzersizleri hızlandırmak için hedeflere dokun. Her set yine +70 PL verir. Namek hazır: aynı gemiyle git ve geri dön. Yer çekimi 1×.')+'</p></div>',
 [[N186('VIAJAR A NAMEK','TRAVEL TO NAMEK','VIAJAR A NAMEK','NAMEK’E GİT'),()=>flight186(true)],
 [N186('FLEXIONES · +70 PL','PUSH-UPS · +70 PL','FLEXÕES · +70 PL','ŞINAV · +70 PL'),()=>exerciseStart184('push')],
 [N186('PESAS · +70 PL','WEIGHTS · +70 PL','PESOS · +70 PL','AĞIRLIK · +70 PL'),()=>exerciseStart184('weights')],
 ['KAMEHAMEHA · +70 PL',()=>exerciseStart184('kame')],
 [N186('SALIR DE LA NAVE','LEAVE SHIP','SAIR DA NAVE','GEMİDEN ÇIK'),()=>enter184(CORP184,1120,850)],
 [N186('CONTINUAR','CONTINUE','CONTINUAR','DEVAM'),closeDialog]]);return true;
}
trainingMenu184=shipMenu186;
const bulmaBefore186=bulmaTalk184;
bulmaTalk184=function(){
 const out=bulmaBefore186();
 if(out&&cityUnlocked184())$('#dialogbody').innerHTML='<div data-no-i18n><p>'+N186('La nave está lista para Namek. Entra por la derecha y usa VIAJAR A NAMEK. Puedes entrenar durante los preparativos y regresar a la Tierra en la misma nave. Buscaremos cómo revivir a nuestros amigos.','The ship is ready for Namek. Board on the right and choose TRAVEL TO NAMEK. Train during preparations and return to Earth in the same ship. We will seek a way to revive our friends.','A nave está pronta para Namek. Entre à direita e escolha VIAJAR A NAMEK. Treine nos preparativos e volte à Terra na mesma nave. Buscaremos uma forma de reviver nossos amigos.','Gemi Namek için hazır. Sağdan bin ve NAMEK’E GİT seçeneğini seç. Hazırlık sırasında çalış ve aynı gemiyle Dünya’ya dön. Arkadaşlarımızı diriltmenin yolunu arayacağız.')+'</p></div>';
 return out;
};
function interactNamek186(){
 if(!namekHere186())return false;
 if(namekBusy186())return false;
 if(namekIndex186()===0&&Math.hypot(player.x-205,player.y-695)<190)return flight186(false);
 if(namekIndex186()===5&&Math.hypot(player.x-1000,player.y-625)<240)return guruTalk186();
 const p=nearestPerson186();if(p)return talkPerson186(p);return false;
}
const interactBefore186=interact;
interact=function(...a){return namekHere186()?interactNamek186():interactBefore186(...a);};
const hudBefore186=saiHud167;
saiHud167=function(...a){
 const out=hudBefore186(...a);if(!sai167())return out;
 if(namekHere186()){
  const s=namekState186(),busy=namekBusy186(),p=nearestPerson186();
  $('#sai-place167').textContent=N186(...NAMEK_NAMES186[namekIndex186()]);
  $('#sai-objective167').textContent=(busy?N186('Combate · esquiva los avisos dorados','Combat · dodge golden warnings','Combate · desvie dos avisos dourados','Dövüş · altın uyarılardan kaçın'):N186('Habla para entrenar · gravedad 1×','Talk to train · gravity 1×','Fale para treinar · gravidade 1×','Eğitim için konuş · yer çekimi 1×'))+' · '+N186('Potencial','Potential','Potencial','Potansiyel')+' '+(s.potential?'120%':'100%')+(s.evil?' · '+N186('MALO','EVIL','MAU','KÖTÜ'):'');
  const b=$('#sai-talk167'),ship=namekIndex186()===0&&Math.hypot(player.x-205,player.y-695)<190,guru=namekIndex186()===5&&Math.hypot(player.x-1000,player.y-625)<240;
  b.hidden=busy||!(p||ship||guru);b.textContent=ship?N186('REGRESAR A TIERRA','RETURN TO EARTH','VOLTAR À TERRA','DÜNYA’YA DÖN'):N186('HABLAR','TALK','FALAR','KONUŞ');b.onclick=interactNamek186;
 }else if(zone===SHIP184)$('#sai-objective167').textContent=N186('Entrena +70 PL · nave lista para Namek','Train +70 PL · ship ready for Namek','Treine +70 PL · nave pronta para Namek','+70 PL eğitim · gemi Namek’e hazır');
 renderBall186();return out;
};
const persistBefore186=persistGame;
persistGame=function(...a){
 if(sai167()){
  const s=namekState186();s.room=namekHere186()?namekIndex186():-1;
  if(namekHere186()){s.x=player.x;s.y=player.y;}
 }
 return persistBefore186(...a);
};
function restoreNamek186(){
 namekRun186.duel=null;namekRun186.flight=null;tripBox186.hidden=true;namekRun186.shots=[];
 ballRun186.exercise=null;ballBox186.hidden=true;
 if(!namekHere186())return;
 if(!namekGate186()){zone=CORP184;player.x=1120;player.y=850;return;}
 const s=namekState186();player.x=s.x;player.y=s.y;
 // An interrupted practice is cancelled without a prize or a free healing reset.
 for(const d of namekDefs186){const p=personState186(d);if(p.angry&&s.practice===d.id){p.angry=false;if(p.hp<d.max)p.down=Math.max(p.down,15);}}s.practice=null;
 rebuildPeople186();namekRun186.lock=1;
}
const initBefore186=initProgress;
initProgress=function(...a){const out=initBefore186(...a);restoreNamek186();return out;};
const loadBefore186=load;
load=function(...a){const out=loadBefore186(...a);restoreNamek186();return out;};
const chooseBefore186=chooseRace;
chooseRace=function(...a){if(namekHere186()&&namekBusy186())return false;const prior=race,out=chooseBefore186(...a);if(race!==prior){namekRun186.duel=null;namekRun186.people=[];namekRun186.shots=[];if(namekRun186.flight){namekRun186.flight=null;tripBox186.hidden=true;paused=false;}restoreNamek186();}return out;};
const deathBefore186=saiDeath172;
saiDeath172=function(...a){
 namekRun186.duel=null;namekRun186.shots=[];if(sai167())namekState186().practice=null;
 for(const p of namekRun186.people){if(!p.state.dead){p.state.angry=false;if(p.state.hp<p.max)p.state.down=Math.max(p.state.down,20);}}
 return deathBefore186(...a);
};
const style186=document.createElement('style');
style186.textContent='#training-balls186[hidden],#namek-flight186[hidden]{display:none!important}#training-balls186{position:fixed;left:22%;top:24%;width:48%;height:45%;z-index:190;pointer-events:none;color:#fff4bd;font:bold clamp(10px,1.5vw,17px) system-ui;text-align:center;text-shadow:0 2px 3px #001a32}#training-balls186 p{margin:0}#training-balls186 small{position:absolute;bottom:0;left:0;right:0}#training-balls186 button{position:absolute;width:54px;height:54px;min-width:48px;min-height:48px;border:3px solid #fffac1;border-radius:50%;background:#42cdcb;color:#071c39;font:bold 22px system-ui;box-shadow:0 0 0 6px #06344e88,0 0 20px #8affdc;pointer-events:auto;touch-action:manipulation;transform:translate(-50%,-50%)}#namek-flight186{position:fixed;inset:0;background:#020a1e;z-index:16000;display:grid;place-items:center;touch-action:manipulation}#namek-flight186 canvas{width:100%;height:100%;object-fit:contain;image-rendering:pixelated}#namek-flight186>div{position:absolute;bottom:0;left:0;right:0;text-align:center;padding:16px;color:#fff4cf;background:linear-gradient(transparent,#020a1ef0);font:600 clamp(12px,2vw,21px) system-ui}#namek-flight186 button{padding:10px 25px;background:#12334e;color:#fff4cf;border:1px solid #e5c77e;border-radius:8px;font:inherit}';
document.head.append(style186);
const newsBefore186=updateLog23;
updateLog23=function(...a){
 newsBefore186(...a);$('#dialogeyebrow').textContent='OMNIBLIZZ ORIGINAL · 1.82';
 const p=document.createElement('p');p.setAttribute('data-no-i18n','');
 p.textContent=N186('Namek: viaje y regreso con la nave, seis escenarios, namekianos pacíficos de 40 000 a 80 000 PL, entrenamiento +100 PL y potencial 120% con el Gran Patriarca una sola vez. Minijuego de bolitas acelera las series de nave, siempre +70 PL. Matar namekianos te vuelve malo; entrenar no. Gravedad 1×.','Namek: ship journey and return, six areas, peaceful Namekians from 40,000 to 80,000 PL, +100 PL training and a one-time 120% potential awakening with the Grand Elder. Target minigame speeds up ship sets, still +70 PL. Killing Namekians makes you evil; training does not. Gravity 1×.','Namek: viagem e retorno na nave, seis áreas, namekuseijins pacíficos de 40 000 a 80 000 PL, treino +100 PL e potencial 120% com o Grande Patriarca uma vez. Minijogo de bolinhas acelera séries da nave, sempre +70 PL. Matar namekuseijins torna você mau; treinar não. Gravidade 1×.','Namek: gemiyle gidiş dönüş, altı bölge, 40.000–80.000 PL barışçıl Namekliler, +100 PL eğitim ve Büyük Ata ile tek seferlik %120 potansiyel. Hedef mini oyunu gemi setlerini hızlandırır; ödül yine +70 PL. Nameklileri öldürmek seni kötü yapar; eğitim yapmaz. Yer çekimi 1×.');
 $('#dialogbody').prepend(p);
};
readyLog23=function(){if(logFirst23||!ready)return;logFirst23=true;if(localStorage.getItem('omni-seen-update')!=='1.82'){updateLog23();localStorage.setItem('omni-seen-update','1.82');}};
if(location.search.includes('qa=1'))window.__v186={eval:s=>eval(s),ball:ballTap186,finishFlight:finishFlight186};

