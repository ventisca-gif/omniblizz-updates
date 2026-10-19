'use strict';
(() => {
const CREATOR116=false;
const $=s=>document.querySelector(s), canvas=$('#world');let ctx=canvas.getContext('2d',{alpha:false});
const W=960,H=540,STORE='omni-forest-v1';let WW=1600,WH=900;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const ALIENS={
 heatblast:{name:'Heatblast',row:1,color:'#ffc276',skills:[{name:'Bola de fuego',short:'FUEGO',unlock:0,cost:0,cd:.65,damage:20},{name:'RÃ¡faga Ã­gnea',short:'RÃFAGA',unlock:15,cost:5,cd:3.5,damage:14},{name:'Anillo solar',short:'ANILLO',unlock:40,cost:9,cd:7,damage:40},{name:'Meteoro',short:'METEORO',unlock:75,cost:16,cd:11,damage:72}]},
 diamond:{name:'Diamante',row:4,color:'#a0f6dc',skills:[{name:'Lanza de diamantes',short:'LANZA',unlock:0,cost:0,cd:.7,damage:19},{name:'Escudo de diamante',short:'ESCUDO',unlock:15,cost:7,cd:14,damage:0},{name:'Campo de cristales',short:'CAMPO',unlock:40,cost:10,cd:8,damage:9},{name:'Diamante celeste',short:'CELESTE',unlock:75,cost:18,cd:12,damage:70}]}
};
ALIENS.heatblast.hp=200;ALIENS.diamond.hp=200;
ALIENS.fourarms={name:'Cuatro Brazos',row:5,hp:400,color:'#ffad96',skills:[{name:'Aplauso sÃ³nico',short:'APLAUSO',unlock:0,cost:0,cd:.95,damage:22},{name:'Salto aplastante',short:'SALTO',unlock:15,cost:0,cd:7,damage:48},{name:'Roca gigante',short:'ROCA',unlock:40,cost:0,cd:5,damage:44},{name:'Furia sÃ­smica',short:'SISMO',unlock:75,cost:0,cd:14,damage:26}]};
ALIENS.xlr8={name:'XLR8',row:11,hp:200,color:'#7bdfff',skills:[{name:'Golpes rÃ¡pidos',short:'RÃPIDOS',unlock:0,cost:0,cd:.7,damage:6},{name:'Tornado',short:'TORNADO',unlock:15,cost:0,cd:8,damage:8},{name:'Zigzag',short:'ZIGZAG',unlock:40,cost:0,cd:6,damage:28},{name:'Embestida supersÃ³nica',short:'EMBESTIDA',unlock:75,cost:0,cd:12,damage:54}]};
ALIENS.bestia={name:'Bestia',row:16,hp:250,color:'#b8ff85',skills:[{name:'RasguÃ±o',short:'RASGUÃ‘O',unlock:0,cost:0,cd:.75,damage:23},{name:'Sentido sensorial',short:'SENTIDOS',unlock:15,cost:0,cd:14,damage:0},{name:'Embestida salvaje',short:'EMBESTIDA',unlock:40,cost:0,cd:6,damage:38},{name:'Mordida feroz',short:'MORDIDA',unlock:75,cost:0,cd:9,damage:53}]};
ALIENS.insect={name:'Insecotide',row:21,hp:200,color:'#b6ed6d',skills:[{name:'Escupitajo viscoso',short:'ESCUPITAJO',unlock:0,cost:0,cd:.9,damage:18},{name:'Charco corrosivo',short:'CHARCO',unlock:15,cost:0,cd:9,damage:6},{name:'Saliva venenosa',short:'VENENO',unlock:40,cost:0,cd:6,damage:12},{name:'Vuelo',short:'VOLAR',unlock:75,cost:0,cd:20,damage:0}]};
ALIENS.aquatic={name:'AcuÃ¡tico',row:30,hp:250,color:'#9aeafb',skills:[{name:'RÃ¡faga a presiÃ³n',short:'PRESIÃ“N',unlock:0,cost:0,cd:1.2,damage:10},{name:'Hidroquinesis',short:'HIDRO',unlock:15,cost:0,cd:8,damage:12},{name:'Absorber humedad (pasiva)',short:'HUMEDAD',unlock:40,cost:0,cd:0,damage:0},{name:'PuÃ±o de choque',short:'CHOQUE',unlock:75,cost:0,cd:6,damage:58}]};
ALIENS.wolf={name:'Blitztwolfer',row:40,hp:300,color:'#b7deef',skills:[{name:'Garras',short:'GARRAS',unlock:0,cost:0,cd:.75,damage:24},{name:'Aullido sÃ³nico',short:'AULLIDO',unlock:15,cost:0,cd:5,damage:48},{name:'Carrera feral',short:'CARRERA',unlock:40,cost:0,cd:7,damage:35},{name:'Sujetar y lanzar',short:'LANZAR',unlock:75,cost:0,cd:8,damage:66}]};
const SKINS=[{name:'Original',row:0},{name:'Urbano',row:9},{name:'Plateado',row:10}];
const SPEEDS={wolf:225,aquatic:175,human:220,heatblast:160,diamond:200,fourarms:180,xlr8:360,bestia:255,insect:190};
let moveSpeed=()=>newRace26()?raceSpeed26():cannonForm23()&&player.cannonBall23?430:wildForm19()&&player.wildSwing19?620:ultraForm()&&player.ultraMode==='tank'?140:ultraForm()&&player.ultraMode==='robot'?170:underwater()?oceanSpeed():race==='osmo'?(player.form==='stone'?180:player.form==='electric'?260:220):player.alien&&player.activeAlien==='insect'&&player.flight>0?275:SPEEDS[player.alien?player.activeAlien:'human'];
for(const a of Object.values(ALIENS))for(const k of a.skills)k.cost=0;
const REGIONS=window.OMNI_REGIONS;
let citizens=[],civilStates={},officers=[],hostileShots=[];
let law={karma:0,heat:0,timer:0,spawn:1,notice:0};
let nextAttackId=1;
const isCity=()=>!!REGIONS[zone].city;
const wantedLevel=()=>law.timer<=0?0:law.heat>=60?3:law.heat>=25?2:1;
let zone=1,zoneStates={},discovered=['camp'],opened=[],transition=0,gateLock=0,migrated=false;
const mastery=()=>player.masteries[race==='osmo'&&player.form==='prototype87'?'prototype87':race==='osmo'&&player.form==='acid'?'acid':race==='osmo'&&player.form==='ghost'?'ghost':player.alien?player.activeAlien:player.selected];
const alien=()=>ALIENS[player.alien?player.activeAlien:player.selected];
const currentSkills=()=>alien().skills;
const region=()=>REGIONS[zone];
let sceneZoom=()=>zone===SHOP28?.8:zone===MINE25?.8:zone===CITY21?cityZoom22():zone>=28?.65:[8,9,10,12].includes(zone)?.65:1;
const cameraMaxX=()=>Math.max(0,WW-W/sceneZoom());
const cameraMaxY=()=>Math.max(0,WH-H/sceneZoom()+(zone===CITY21||zone===SHOP28?0:zone>=6?140:0));
const npcHere=()=>zone===1;
const newFrames=[[[77,105,232,381],[442,105,262,377],[806,100,272,383],[1185,105,287,383]],[[68,543,279,417],[440,541,280,421],[775,549,294,414],[1077,554,453,409]]];
const frames=[[[87,56,168,246],[398,55,164,247],[687,58,177,244],[976,65,245,237]],[[74,323,204,297],[372,322,204,298],[657,324,186,296],[908,334,332,286]],[[83,643,212,258],[392,643,184,258],[668,645,187,255],[924,653,309,246]],[[91,920,160,290],[386,920,171,290],[690,923,174,288],[980,916,224,295]]];
const art={}, particles=[], projectiles=[], numbers=[], effects=[];
let ready=false,started=false,paused=false,dialogOpen=false,clock=0,last=0,saveClock=0,shake=0,flash=0,toastTime=0,audioCtx=null,sound=true;
let cam={x:0,y:260},keys={},stick={x:0,y:0,id:null},held=-1,dayMode='noche';
let player={x:540,y:627,face:1,dx:1,dy:0,alien:false,hp:100,battery:100,lock:0,emptyLock:0,mastery:0,level:1,xp:0,inv:0,anim:0,attack:0,moving:false,cool:[0,0,0,0],selected:'heatblast',activeAlien:'heatblast',masteries:{heatblast:0,diamond:0,fourarms:0,xlr8:0},cooldowns:{heatblast:[0,0,0,0],diamond:[0,0,0,0],fourarms:[0,0,0,0],xlr8:[0,0,0,0]},shield:0,shieldTime:0,attackFrame:3,leap:null,skin:0,motion:null,slideCool:0};
let quest={state:'new',kills:0,completions:0},enemies=[];const npc={x:420,y:596,face:1};
// OMNI 0.5: progression, races, boss and absorption. Included inside game closure at build-time.
const CORE_ALIENS=['heatblast','diamond','fourarms','xlr8','bestia','insect','aquatic','wolf'];
const EXTRA={wolf:[['Garra lunar','LUNAR',70,10],['Resonancia salvaje','RESONAR',24,12]],aquatic:[['Remolino abisal','REMOLINO',16,12],['Lanza de presiÃ³n','LANZA',76,9]],insect:[['Batida sÃ³nica','BATIDA',32,8],['RÃ¡faga pegajosa','TRIPLE',12,7]],bestia:[['Garra giratoria','GARRA',43,7],['Rugido sÃ­smico','RUGIDO',56,12]],heatblast:[['Lanza solar','LANZA SOLAR',44,5],['Lluvia Ã­gnea','LLUVIA',18,13]],diamond:[['Abanico de pÃºas','ABANICO',13,5],['PrisiÃ³n cristalina','PRISIÃ“N',46,11]],fourarms:[['Doble martillo','MARTILLO',42,5],['Onda tectÃ³nica','TECTÃ“NICA',62,12]],xlr8:[['Patada relÃ¡mpago','PATADA',36,4.5],['Ã“rbita veloz','Ã“RBITA',12,12]]};
for(const id of CORE_ALIENS)for(const [name,short,damage,cd] of EXTRA[id])ALIENS[id].skills.push({name,short,damage,cd,unlock:0,cost:0,points:3});
const OSMO_FORMS={water:{name:'Agua',hp:250,color:'#99efff'},human:{name:'Osmosiano',hp:100,color:'#d7b762'},wood:{name:'Madera',hp:200,color:'#ac713c'},stone:{name:'Concreto',hp:250,color:'#adb2bd'},electric:{name:'Electricidad',hp:200,color:'#80e8ff'},fire:{name:'ADN de fuego',hp:250,color:'#ffb264'}};
const makeSkill=(name,short,damage,cd,unlock=0)=>({name,short,damage,cd,unlock,cost:0});
const OSMO_SKILLS={
 human:[makeSkill('PuÃ±o','PUÃ‘O',12,.6),makeSkill('Doble golpe','DOBLE',22,3,15),makeSkill('Impacto al suelo','IMPACTO',30,6,40),makeSkill('Descarga cinÃ©tica','CINÃ‰TICA',45,10,75)],
 wood:[makeSkill('PuÃ±o de madera','MADERA',18,.7),makeSkill('Astillas','ASTILLAS',12,3.5,15),makeSkill('RaÃ­ces','RAÃCES',8,8,40),makeSkill('Tronco ariete','ARIETE',55,11,75)],
 stone:[makeSkill('PuÃ±o de concreto','CONCRETO',21,.8),makeSkill('Fragmento de roca','FRAGMENTO',32,4,15),makeSkill('PisotÃ³n pÃ©treo','PISOTÃ“N',38,7,40),makeSkill('Ruptura de suelo','RUPTURA',60,12,75)],
 electric:[makeSkill('Chispa','CHISPA',18,.65),makeSkill('Arco elÃ©ctrico','ARCO',28,4,15),makeSkill('Pulso electromagnÃ©tico','PULSO',38,7,40),makeSkill('Tormenta','TORMENTA',16,12,75)],
 fire:[makeSkill('Proyectil Ã­gneo','BRASA',21,.75),makeSkill('Llamarada','LLAMARADA',38,4,15),makeSkill('Fuego circular','CÃRCULO',43,7,40),makeSkill('ErupciÃ³n','ERUPCIÃ“N',70,12,75)]};
OSMO_SKILLS.water=[makeSkill('PuÃ±o de agua','PUÃ‘O AGUA',20,.75),makeSkill('Chorro acuoso','CHORRO',26,3,15),makeSkill('Barrera acuosa','BARRERA',0,14,40),makeSkill('Marea expansiva','MAREA',55,9,75)];
for(const a of Object.values(OSMO_SKILLS)){a.push({...makeSkill('Golpe absorbente','ABSORBENTE',34,5),points:3},{...makeSkill('Resonancia material','RESONANCIA',58,12),points:3});}
OSMO_SKILLS.water[4]={...makeSkill('VÃ³rtice acuoso','VÃ“RTICE',16,12),points:3};OSMO_SKILLS.water[5]={...makeSkill('GÃ©iser a presiÃ³n','GÃ‰ISER',80,11),points:3};
ALIENS.osmo={name:'Osmosiano',row:14,hp:100,color:'#d7b762',skills:OSMO_SKILLS.human};
let race='omni',profiles={},bossTimer=0,attackPage=0;
const cleanClone=o=>JSON.parse(JSON.stringify(o));
const playerTemplate=cleanClone(player);
function initProgress(){initV16();initV15();initV13();initV14();initV12();initV8();initV9();initV10();initV11();player.coins=Math.max(0,Math.floor(Number(player.coins)||0));player.knightQuest=Object.assign({state:'new',kills:0,completions:0},player.knightQuest||{});player.cast=null;player.flight=0;player.slow=0;player.poison=null;player.jump=0;player.jumpCool=0;player.sense=0;player.fireCharge=clamp(Number(player.fireCharge)||0,0,60);if(player.form!=='fire')player.fireCharge=0;player.points=Number.isFinite(player.points)?player.points:Math.max(0,player.level-1);player.learned=player.learned||{};player.regenWait=Number.isFinite(player.regenWait)?player.regenWait:0;player.form=OSMO_FORMS[player.form]?player.form:'human';player.dnaFire=!!player.dnaFire;player.absorbUnlocks=player.absorbUnlocks||{};for(const id of Object.keys(ALIENS)){player.masteries[id]=player.masteries[id]||0;player.cooldowns[id]=Array.from({length:6},(_,i)=>player.cooldowns[id]?.[i]||0);player.learned[id]=player.learned[id]||[false,false];}player.cool=player.cooldowns[race==='osmo'&&player.form==='acid'?'acid':race==='osmo'&&player.form==='ghost'?'ghost':player.activeAlien];refreshOsmo();}
function refreshOsmo(){const f=OSMO_FORMS[player.form||'human'];ALIENS.osmo.name=f.name;ALIENS.osmo.hp=f.hp;ALIENS.osmo.color=f.color;ALIENS.osmo.skills=OSMO_SKILLS[player.form||'human'];}
function profileSnapshot(){zoneStates[region().id]=enemies;civilStates[region().id]=citizens;const p=cleanClone({...player,motion:null,leap:null});return cleanClone({player:p,quest,zone,zoneStates,civilStates,law,discovered,opened,bossTimer});}
function freshProfile(){const p=cleanClone(playerTemplate);p.selected=p.activeAlien='osmo';p.skin=0;return {player:p,quest:{state:'new',kills:0,completions:0},zone:1,zoneStates:{},civilStates:{},law:{karma:0,heat:0,timer:0,spawn:1,notice:0},discovered:['camp'],opened:[],bossTimer:0};}
function applyProfile(s){player=cleanClone(s.player);quest=cleanClone(s.quest);zone=s.zone;zoneStates=cleanClone(s.zoneStates||{});civilStates=cleanClone(s.civilStates||{});law=cleanClone(s.law);discovered=[...s.discovered];opened=[...s.opened];bossTimer=s.bossTimer||0;enemies=zoneStates[region().id]||[];officers=[];ensureCitizens();initProgress();player.motion=player.leap=null;player.attack=0;projectiles.length=effects.length=hostileShots.length=particles.length=numbers.length=0;attackPage=0;toastTime=0;$('#toast').classList.remove('show');resetInput();ensureBoss();cam.x=clamp(player.x-W*.48/sceneZoom(),0,cameraMaxX());cam.y=(zone===CITY21?cityCameraY22():clamp(player.y-H*.61/sceneZoom(),0,cameraMaxY()));}
function chooseRace(id){if(net.role){toast('Sal de la sala antes de cambiar de raza; tu progreso se conserva');return;}if(id===race)return raceMenu();if(started&&(player.regenWait>0||law.timer>0)){toast('AlÃ©jate del combate: cambia de raza tras 12 s sin recibir daÃ±o y sin bÃºsqueda');return;}profiles[race]=profileSnapshot();race=id;applyProfile(profiles[id]||freshProfile());persistGame();raceMenu();}
function persistGame(){if(window.omniRestoring63||localStorage.getItem("omni-pending-restore63"))return;try{profiles[race]=profileSnapshot();localStorage.setItem(STORE,JSON.stringify({version:15,...profileSnapshot(),race,profiles,dayMode,sound,clock,totalPlaySeconds56}));}catch(e){console.warn('Save failed',e);}}
function raceMenu(){$('#alienskins').classList.toggle('hidden',race!=='omni');showDialog('DOS RAZAS Â· PROGRESOS INDEPENDIENTES','Elige tu raza','<p>Cada raza conserva su nivel, experiencia, maestrÃ­a, puntos, misiones, monedas y karma. Cambiar no borra ninguna partida.</p><div class="racecards">'+[['omni','Portador del Omnitrix','Diez aliens Â· tres skins'],['osmo','Osmosiano','Madera Â· concreto Â· electricidad Â· ADN']].map(([id,n,d])=>'<button data-race="'+id+'" class="racecard '+(race===id?'active':'')+'"><b>'+n+'</b><p>'+d+'</p><small>Nivel '+(id===race?player.level:profiles[id]?.player.level||1)+' Â· '+(id===race?'SELECCIONADO':'CAMBIAR')+'</small></button>').join('')+'</div>',[['LISTO',closeDialog]]);document.querySelectorAll('[data-race]').forEach(b=>b.onclick=()=>chooseRace(b.dataset.race));}
function skillId(){return race==='osmo'?(player.form==='ghost'?'ghost':'osmo'):player.alien?player.activeAlien:player.selected;}
function unlockedSkill(id,i){return i<4?player.masteries[id]>=ALIENS[id].skills[i].unlock:!!player.learned[id]?.[i-4];}
function buySkill(id,i){if(!CORE_ALIENS.includes(id)&&id!=='osmo'&&id!=='acid')return false;if(i<4||i>=ALIENS[id].skills.length||player.learned[id][i-4]||player.points<3)return false;player.points-=3;player.learned[id][i-4]=true;persistGame();return true;}
function refundSkills(id){for(let i=0;i<2;i++)if(player.learned[id][i]){player.points+=3;player.learned[id][i]=false;}persistGame();skillTree();}
function skillTree(){const id=skillId(),a=ALIENS[id];showDialog('ÃRBOL Â· '+a.name.toUpperCase()+' Â· '+player.points+' PUNTOS','Domina tus habilidades','<p>Ganas 1 punto por nivel. Cada habilidad nueva cuesta 3 puntos. Las cuatro originales se abren con maestrÃ­a. Puedes devolver los puntos de esta rama.</p><div class="treegrid">'+a.skills.map((k,i)=>'<button data-node="'+i+'" class="skillnode '+(unlockedSkill(id,i)?'active':'')+'"><b>'+['I','II','III','IV','V','VI'][i]+' Â· '+k.name+'</b><small>'+ (i<4?'MaestrÃ­a '+k.unlock:player.learned[id][i-4]?'APRENDIDA':'3 PUNTOS')+' Â· '+k.cd+' s</small><span>'+k.damage+' daÃ±o base'+(i>=4?' Â· adicional':'')+'</span></button>').join('')+'</div>'+(race==='osmo'?'<p>Absorciones avanzadas: electricidad requiere M30 + 3 puntos; fuego requiere M60 + ADN del jefe + 3 puntos.</p><button id="unlockelectric" class="inlinebtn">ELECTRICIDAD Â· '+(player.absorbUnlocks.electric?'APRENDIDA':'3 PUNTOS')+'</button><button id="unlockfire" class="inlinebtn">ADN DE FUEGO Â· '+(player.absorbUnlocks.fire?'APRENDIDA':'3 PUNTOS')+'</button>':''),[['VOLVER',closeDialog],['DEVOLVER PUNTOS DE V / VI',()=>refundSkills(id)]]);document.querySelectorAll('[data-node]').forEach(b=>b.onclick=()=>{const i=+b.dataset.node;if(i<4){toast('Se desbloquea al alcanzar '+a.skills[i].unlock+' de maestrÃ­a');return;}if(buySkill(id,i))skillTree();else toast('Necesitas 3 puntos o ya conoces esta habilidad');});if(race==='osmo'){for(const form of ['electric','fire'])$('#unlock'+form).onclick=()=>{if(unlockAbsorption(form))skillTree();};}}
function unlockAbsorption(form){const req=form==='electric'?30:60;if(player.absorbUnlocks[form])return false;if(player.points<3||mastery()<req||(form==='fire'&&!player.dnaFire)){toast('Necesitas 3 puntos, M'+req+(form==='fire'?' y ADN del jefe':''));return false;}player.points-=3;player.absorbUnlocks[form]=true;persistGame();return true;}
function materials(){if(underwater())return [{type:'water',x:player.x,y:player.y}];return [{type:'wood',x:zone===1?560:560,y:region().exitY+25},{type:'stone',x:zone===1?780:850,y:region().exitY-30},...(isCity()?[{type:'electric',x:1080,y:region().exitY+20}]:[])];}
function nearbyMaterial(){return materials().find(m=>dist(player,m)<105);}
function absorb(form){if(race!=='osmo')return false;if(form==='ghost')return absorbGhost();if(interference()&&form!=='human'){toast('Interferencia: no puedes absorber aquÃ­');return false;}if(player.form==='ghost')endGhost();if(form!=='human'&&player.battery<=0){toast('Necesitas algo de energÃ­a');return false;}if(form==='electric'||form==='fire'){if(!player.absorbUnlocks[form]){toast('Desbloquea esta absorciÃ³n en tu Ã¡rbol');return false;}}if(form==='water'&&!underwater()){toast('Absorbe agua dentro del mundo submarino');return false;}if(form!=='human'&&form!=='fire'){const m=nearbyMaterial();if(!m||m.type!==form){toast('AcÃ©rcate a un material marcado: madera, concreto o generador');return false;}}const ratio=player.hp/maxHP();if(form!==player.form)player.fireCharge=0;player.waterGuard=0;player.form=form;refreshOsmo();player.hp=clamp(ratio*maxHP(),1,maxHP());player.attack=.5;player.attackFrame=3;burst(player.x,player.y-55,35,ALIENS.osmo.color);tone(450,.3);closeDialog();persistGame();return true;}
function absorptionMenu(){const m=nearbyMaterial();showDialog('OSMOSIANO Â· MAESTRÃA '+Math.floor(mastery())+'%','Absorber materia','<p>AcÃ©rcate a las fuentes marcadas del mapa. Vida base: madera200, concreto250, electricidad200, fuego250, agua250. Tu vitalidad de Ten multiplica estas cifras. Agua se absorbe en el mar y permite respirar. Se conserva tu porcentaje de vida al cambiar.</p><p>Cerca: <b>'+(m?OSMO_FORMS[m.type].name:'ningÃºn material')+'</b><br>ADN del jefe: <b>'+(player.dnaFire?'OBTENIDO':'pendiente Â· 30% por victoria osmosiana')+'</b></p><p>Una forma absorbida dura hasta 120 s con energÃ­a completa; recuperas toda la energÃ­a en 40 s en tu forma base.</p>',[['ABSORBER CERCA',()=>{if(m)absorb(m.type);else toast('Busca una fuente marcada');}],['ABSORBER AGUA',()=>absorb('water')],['FORMA DE FUEGO',()=>absorb('fire')],['ADN ESPECTRAL',()=>absorbGhost()],['VOLVER A BASE',()=>absorb('human')],['ÃRBOL',skillTree],['CERRAR',closeDialog]]);}
function shoot(type,a,damage,speed=420){projectiles.push({type,x:player.x,y:player.y-35,dx:Math.cos(a)*speed,dy:Math.sin(a)*speed,t:1.4,r:type==='boulder'?22:10,damage});}
function castArea(type,x,y,r,damage,duration=.6,color='#efcd8d'){effects.push({type,x,y,r,t:duration,max:duration,color});areaHit(x,y,r,damage,.25);}
function extraAttack(i){if(skillId()==='insect'){insectAttack(i);return;}if(skillId()==='bestia'){bestiaAttack(i);return;}const id=skillId(),s=ALIENS[id].skills[i];if(!unlockedSkill(id,i)){toast('Aprende esta habilidad por 3 puntos en el Ã¡rbol');return;}player.cool[i]=s.cd;player.attack=.5;if(id==='heatblast'||id==='diamond')beginCast(id,i);if(id==='fourarms')musicalAttack(i);player.attackFrame=id==='fourarms'?7:id==='xlr8'?3:3;const t=nearest(450),a=t?Math.atan2(t.y-player.y,t.x-player.x):Math.atan2(player.dy,player.dx),d=s.damage*multiplier();player.face=Math.cos(a)>=0?1:-1;const aim=t||{x:player.x+Math.cos(a)*140,y:player.y+Math.sin(a)*80};
 if(id==='heatblast'){if(i===4){shoot('fire',a,d,620);effects.push({type:'sonic',x:player.x,y:player.y-35,a,t:.3,max:.3,r:100});}else effects.push({type:'rain',x:aim.x,y:aim.y,r:145,t:2.5,max:2.5,tick:0,pulses:0,damage:d,color:'#ffc064'});}
 if(id==='diamond'){if(i===4)for(let n=-2;n<=2;n++)shoot('crystal',a+n*.13,d,460);else{castArea('prison',aim.x,aim.y,120,d,2,'#a8ffdf');for(const e of enemies)if(e.alive&&dist(e,aim)<120)e.stun=2;}}
 if(id==='fourarms'){if(i===4)castArea('slam',player.x,player.y,140,d);else{effects.push({type:'fault',x:player.x,y:player.y,r:290,a,t:.8,max:.8});for(const e of combatants())if(e.alive&&dist(player,e)<300&&lineClear(player.x,player.y,e.x,e.y)&&Math.abs(Math.atan2(Math.sin(Math.atan2(e.y-player.y,e.x-player.x)-a),Math.cos(Math.atan2(e.y-player.y,e.x-player.x)-a)))<.55)damageTarget(e,d,.7);}}
 if(id==='xlr8'){if(i===4){player.motion={type:'sonicdash',t:.23,max:.23,dx:Math.cos(a),dy:Math.sin(a),hits:[],damage:d};player.attackFrame=6;}else{effects.push({type:'orbit',x:aim.x,y:aim.y,r:125,t:1.7,max:1.7,tick:0,pulses:0,damage:d,color:'#86e6ff'});player.attackFrame=4;}}
 tone(620,.2,'triangle');}
function osmoAttack(i){if(player.form==='water'){waterOsmoAttack(i);return;}const s=currentSkills()[i];if(!unlockedSkill('osmo',i)){toast(i<4?'Requiere maestrÃ­a '+s.unlock:'Aprende esta habilidad en el Ã¡rbol');return;}player.cool[i]=s.cd;player.attack=.4;player.fullFrame=i===0?3:i===1?4:i===2?5:i===3?6:7;const target=nearest(460),a=target?Math.atan2(target.y-player.y,target.x-player.x):Math.atan2(player.dy,player.dx),d=s.damage*multiplier();player.face=Math.cos(a)>=0?1:-1;const form=player.form;if(form==='human'||form==='fire')beginCast(form==='fire'?'osmofire':'osmo',i);
 if(i>=4){castArea(i===4?'slam':'resonance',player.x,player.y,i===4?115:180,d,.7,ALIENS.osmo.color);return;}
 if(form==='fire'){if(i===0)shoot('fire',a,d);if(i===1){effects.push({type:'friendlyflame',x:player.x,y:player.y,a,t:.6,max:.6,r:220});for(const e of combatants())if(e.alive&&dist(player,e)<220&&lineClear(player.x,player.y,e.x,e.y)){const angle=Math.atan2(e.y-player.y,e.x-player.x);if(Math.abs(Math.atan2(Math.sin(angle-a),Math.cos(angle-a)))<.55)damageTarget(e,d);}}if(i===2)castArea('ring',player.x,player.y,155,d);if(i===3)effects.push({type:'meteor',x:target?.x||player.x+100,y:target?.y||player.y,t:1.05,max:1.05,r:145,hit:false,damage:d});}
 else if(form==='electric'){if(i===0||i===1){shoot('electric',a,d,550);if(i===1)effects.push({type:'resonance',x:player.x,y:player.y,r:95,t:.3,max:.3,color:'#8dedff'});}if(i===2)castArea('resonance',player.x,player.y,155,d,.6,'#8dedff');if(i===3)effects.push({type:'rain',x:target?.x||player.x,y:target?.y||player.y,r:150,t:2.5,max:2.5,tick:0,pulses:0,damage:d,color:'#8dedff'});}
 else if(i===0||form==='human'&&i===1){const t=nearest(i===0?90:105);effects.push({type:'punch',x:player.x+Math.cos(a)*45,y:player.y-35,r:30,t:.25,max:.25});if(t)damageTarget(t,d);}
 else if(i===1){if(form==='wood')for(let n=-1;n<=1;n++)shoot('wood',a+n*.15,d);else shoot('boulder',a,d,320);}
 else if(i===2&&form==='wood')effects.push({type:'roots',x:target?.x||player.x,y:target?.y||player.y,r:120,t:3,max:3,tick:0,pulses:0,damage:d,color:'#bd8d59'});
 else castArea('slam',player.x,player.y,i===2?140:190,d,.7,ALIENS.osmo.color);tone(250,.13,'triangle');}
function ensureBoss(){if(net.role==='guest')return;if(zone!==0)return;let b=enemies.find(e=>e.majorBoss);if(b&&b.alive)return;if(bossTimer>0)return;const fresh={id:'emberboss',kind:'boss',majorBoss:true,x:1130,y:710,homeX:1130,homeY:710,hp:650,max:650,alive:true,face:-1,anim:0,moving:false,hit:0,stun:0,cast:0,frame:0,flameCD:2,ballCD:4,slamCD:6,wind:0};if(b)Object.assign(b,fresh);else enemies.push(fresh);zoneStates[region().id]=enemies;}
function bossReward(b,roll=Math.random()){if(!b.alive)return;if(net.source==='guest'){b.alive=false;b.hp=0;bossTimer=60;lanSend({type:'reward',xp:120,dna:net.remote?.race==='osmo'&&roll<.3});burst(b.x,b.y-50,45,'#ffb158');persistGame();return;}b.alive=false;b.hp=0;bossTimer=60;xp(120);if(race==='osmo'&&!player.dnaFire&&roll<.3){player.dnaFire=true;toast('Â¡ADN Ã­gneo obtenido! Desbloquea su absorciÃ³n en tu Ã¡rbol');}else toast('Jefe derrotado Â· +120 EXP Â· Regresa en 60 s'+(race==='osmo'?' Â· Sin ADN esta vez':''));burst(b.x,b.y-50,45,'#ffb158');persistGame();}
function updateBoss(dt){if(net.role==='guest')return;bossTimer=Math.max(0,bossTimer-dt);ensureBoss();if(zone!==0)return;const b=enemies.find(e=>e.majorBoss&&e.alive);if(!b||b.possessedTime>0)return;b.hit=Math.max(0,b.hit-dt);b.stun=Math.max(0,b.stun-dt);b.cast=Math.max(0,b.cast-dt);for(const k of ['flameCD','ballCD','slamCD'])b[k]=Math.max(0,b[k]-dt);b.moving=false;const target=teamTargets().sort((a,c)=>dist(a,b)-dist(c,b))[0];const d=dist(b,target);b.face=target.x>=b.x?1:-1;if(b.stun>0||b.cast>0||d>520)return;const a=Math.atan2(target.y-b.y,target.x-b.x);if(b.flameCD<=0&&d<250&&lineClear(b.x,b.y,target.x,target.y)){b.flameCD=4;b.cast=1.2;b.frame=3;effects.push({type:'bossflame',x:b.x,y:b.y,a,r:230,t:1.2,max:1.2,hit:false});}else if(b.slamCD<=0&&d<160){b.slamCD=8;b.cast=1.3;b.frame=5;effects.push({type:'bossslam',x:b.x,y:b.y,r:145,t:1.3,max:1.3,hit:false});}else if(b.ballCD<=0&&lineClear(b.x,b.y,target.x,target.y)){b.ballCD=5.5;b.cast=.7;b.frame=4;effects.push({type:'bossball',x:b.x,y:b.y,a,t:.7,max:.7,hit:false});}else if(d>115){moveActor(b,(target.x-b.x)/Math.max(1,d)*104*dt,(target.y-b.y)/Math.max(1,d)*104*dt);b.anim+=dt*6;b.moving=true;}}
function updateExpansion(dt){updateV16(dt);updateV15(dt);updateHex(dt);updateGhost13(dt);updateHospital(dt);updateRecovery(dt);updateChapter2(dt);if(paused)return;updateV11(dt);updateV6(dt);updateV7(dt);updateRobot(dt);updateVitality(dt);if(race==='osmo'&&player.form==='human')player.masteries.osmo=Math.min(100,player.masteries.osmo+dt*.04);updateBoss(dt);for(const f of effects){if(['rain','orbit','roots'].includes(f.type)){f.tick-=dt;const limit=f.type==='orbit'?5:4;if(f.tick<=0&&f.pulses<limit){f.tick+=f.type==='orbit'?.32:.65;f.pulses++;areaHit(f.x,f.y,f.r,f.damage,f.type==='roots'?.4:0);burst(f.x,f.y-45,12,f.color);}}
 if(f.type==='bossball'&&!f.hit&&f.t<.22){f.hit=true;hostileShots.push({type:'bossfire',x:f.x,y:f.y-35,dx:Math.cos(f.a)*245,dy:Math.sin(f.a)*245,t:2.4,r:12,damage:9});}
 if(f.type==='bossflame'&&!f.hit&&f.t<.55){f.hit=true;for(const target of teamTargets()){const a=Math.atan2(target.y-f.y,target.x-f.x);if(dist(target,f)<f.r&&Math.abs(Math.atan2(Math.sin(a-f.a),Math.cos(a-f.a)))<.5&&lineClear(f.x,f.y,target.x,target.y))hurtTeam(target,9);}}
 if(f.type==='bossslam'&&!f.hit&&f.t<.4){f.hit=true;for(const target of teamTargets())if(dist(target,f)<f.r&&lineClear(f.x,f.y,target.x,target.y))hurtTeam(target,10);shake=.2;}
 }}
function drawExpansion(){if(race==='osmo'&&!underwater())for(const m of materials()){ctx.fillStyle=m.type==='wood'?'#98622e':m.type==='stone'?'#969da6':'#385c71';ctx.fillRect(m.x-23,m.y-29,46,28);ctx.strokeStyle=m.type==='electric'?'#82f3ff':'#25282c';ctx.lineWidth=3;ctx.strokeRect(m.x-23,m.y-29,46,28);if(m.type==='wood'){ctx.fillStyle='#ce9c57';ctx.fillRect(m.x-20,m.y-21,40,4);ctx.fillRect(m.x-20,m.y-10,40,4);}if(m.type==='electric')txt('ÏŸ',m.x,m.y-6,25,'#8dffff');txt(OSMO_FORMS[m.type].name.toUpperCase(),m.x,m.y-40,8,'#e2e1bd');}
 for(const f of effects){let p=1-f.t/f.max;ctx.save();ctx.globalAlpha=Math.min(1,f.t*3);if(['resonance','orbit','prison','roots','rain'].includes(f.type)){ctx.strokeStyle=f.color||'#b3ffe7';ctx.lineWidth=3;for(let i=0;i<4;i++){let a=clock*5+i*Math.PI/2;ctx.beginPath();if(f.type==='rain'){let x=f.x+Math.cos(i*2.4)*f.r*.8;ctx.moveTo(x,f.y-220+(p*3%1)*180);ctx.lineTo(x+10,f.y-190+(p*3%1)*180);}else{ctx.ellipse(f.x,f.y-10-i*12,f.r*(.6+i*.12),12+i*3,a*.05,0,Math.PI*1.7);}ctx.stroke();}if(f.type==='prison'||f.type==='roots')for(let i=0;i<8;i++)crystal(f.x+Math.cos(i)*f.r*.8,f.y+Math.sin(i)*f.r*.25,13,70);}
 if(f.type==='bossflame'){const active=f.type==='friendlyflame'||f.t<.55;ctx.translate(f.x,f.y);ctx.rotate(f.a);ctx.fillStyle=active?'#ff8b2699':'#edb05b33';ctx.strokeStyle=active?'#ffda79':'#ffba72';ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,f.r,-.5,.5);ctx.closePath();ctx.fill();ctx.stroke();if(active){ctx.fillStyle='#ffef9e';for(let i=0;i<12;i++)ctx.fillRect(25+i*15,-8+Math.sin(clock*30+i)*16,20,10);}}
 if(f.type==='bossslam'){ctx.strokeStyle=f.t<.4?'#ffe2a5':'#ff9678';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(f.x,f.y,f.r,f.r*.7,0,0,Math.PI*2);ctx.stroke();txt(f.t>.4?'Â¡ALÃ‰JATE!':'',f.x,f.y-50,12,'#ffb1a2');}
 if(f.type==='fault'){ctx.strokeStyle='#e2c7a0';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(f.x,f.y);for(let i=1;i<=8;i++)ctx.lineTo(f.x+Math.cos(f.a)*i*34,f.y+Math.sin(f.a)*i*34+(i%2?8:-8));ctx.stroke();}ctx.restore();}}
function hudExpansion(){hudV6();hudV7();const id=skillId();$('#energyname').textContent=race==='osmo'?'ENERGÃA':'OMNITRIX';$('#treebtn').textContent='ÃRBOL Â· '+player.points+' PT';$('#regen').textContent=player.hp>=maxHP()?'VIDA COMPLETA':player.regenWait>0?'REGENERACIÃ“N EN '+Math.ceil(player.regenWait)+' s':'REGENERANDO Â· '+(regenRate()*100).toFixed(2)+'% / s';$('#moreattacks').textContent=attackPage?'â† ATAQUES Iâ€“IV':'ATAQUES Vâ€“VI â†’';const buttons=[...document.querySelectorAll('.attack')];for(let j=0;j<4;j++){const i=attackPage?j+4:j,b=buttons[j];b.classList.toggle('hidden',i>=ALIENS[id].skills.length);if(i>=ALIENS[id].skills.length)continue;const s=ALIENS[id].skills[i],usable=(race==='osmo'||player.alien||i===0)&&unlockedSkill(id,i);b.dataset.skill=i;b.querySelector('b').textContent=['I','II','III','IV','V','VI'][i];b.querySelector('span').textContent=race==='omni'&&!player.alien&&i===0?'PUÃ‘O':s.short;b.querySelector('small').textContent=!usable?(i>=4?'ÃRBOL Â· 3 PT':'M '+s.unlock):player.cool[i]>.1?player.cool[i].toFixed(1)+' s':'LISTO';b.classList.toggle('locked',!usable);b.classList.toggle('cooldown',player.cool[i]>0);}
 if(race==='osmo'){$('#form').textContent=OSMO_FORMS[player.form].name.toUpperCase();$('#transformlabel').textContent='ABSORBER';$('#transformhint').textContent='MATERIA / ADN';$('#dialname').textContent='OSMOSIANO';$('#dialprev').disabled=$('#dialnext').disabled=true;$('#masterylabel').textContent='MAESTRÃA DE ABSORCIÃ“N';$('#batteryhint').textContent=player.form==='human'?'Recarga en forma base':Math.ceil(player.battery*1.2)+' s de material';$('#slide').classList.add('hidden');}
 const b=zone===0?enemies.find(e=>e.majorBoss&&e.alive):null;$('#bossbar').classList.toggle('hidden',zone!==0);$('#bossbar').textContent=b?'JEFE ÃGNEO Â· NV. RECOMENDADO 10 Â· '+Math.ceil(b.hp)+' / 650': 'JEFE Â· REAPARECE EN '+Math.ceil(bossTimer)+' s';}
const tintCanvas=document.createElement('canvas'),tintCtx=tintCanvas.getContext('2d');
function drawOsmo(frame,x,y,face,avatar=player){if(avatar.form==='ghost'){const p=ghostPose(avatar);sprite(p.row,p.f,x,y-p.lift,132,face,avatar.ghostInvisible>0?.3:avatar.ghostPhase>0?.55:1);return;}if(avatar.form==='water'){drawWaterOsmo(avatar,x,y,face);return;}if(underwater()&&avatar.form==='human'){drawUnderwaterHuman(avatar,x,y,face);return;}const cf=castFrame(avatar);if(cf!==null&&(avatar.form==='human'||avatar.form==='fire'&&avatar.fireCharge<60)){sprite(24,cf,x,y,132,face);return;}if(avatar.form==='fire'&&avatar.fireCharge>=60){sprite(19,avatar.attack>0?(avatar.cast&&1-avatar.cast.t/avatar.cast.max<.2?0:avatar.cast&&avatar.cast.t/avatar.cast.max<.2?0:avatar.fullFrame||3):frame,x,y,145,face);return;}const row=avatar.form==='fire'?15:14,{table,sheet}=spriteInfo(row),f=table[frame]||table[0],h=132,scale=h/table[0][3],w=f[2]*scale,dh=f[3]*scale;tintCanvas.width=Math.ceil(w);tintCanvas.height=Math.ceil(dh);tintCtx.imageSmoothingEnabled=false;tintCtx.drawImage(sheet,...f,0,0,w,dh);if(row===14&&frame===3){const base=table[0],cut=.69,lh=h*(1-cut),bw=base[2]*scale;tintCtx.clearRect(0,dh-lh,w,lh);tintCtx.drawImage(sheet,base[0],base[1]+base[3]*cut,base[2],base[3]*(1-cut),(w-bw)/2,dh-lh,bw,lh);}if(['wood','stone','electric'].includes(avatar.form)){tintCtx.globalCompositeOperation='source-atop';tintCtx.fillStyle=avatar.form==='wood'?'#a56d37b0':avatar.form==='stone'?'#959eaed0':'#53d4ff55';tintCtx.fillRect(0,0,w,dh);tintCtx.fillStyle=avatar.form==='wood'?'#70472899':'#e3eaf14a';for(let i=0;i<8;i++)tintCtx.fillRect(w*.2+(i%2)*5,dh*.45+i*7,w*.6,2);tintCtx.globalCompositeOperation='source-over';}ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha=avatar.inv>0&&Math.floor(clock*12)%2===0?.5:1;ctx.drawImage(tintCanvas,-w/2,-dh);ctx.restore();if(avatar.form==='electric'){ctx.strokeStyle='#a0f7ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-35,y-100);ctx.lineTo(x-45,y-65);ctx.lineTo(x-30,y-73);ctx.lineTo(x-40,y-25);ctx.stroke();}}

// OMNI 0.11 â€” gameplay extension. Source kept here for review; compiled into game.js.
function jump(){if(interference()||ghostForm()||underwater())return;if(!started||paused||player.alien||player.leap||player.motion||player.jumpCool>0)return;player.jump=.75;player.jumpCool=1.15;burst(player.x,player.y-3,8,'#b5c2ae');tone(310,.08,'triangle');}
function jumpHeight(){return player.jump>0?Math.sin((.75-player.jump)/.75*Math.PI)*72:0;}
function updateV6(dt){player.jump=Math.max(0,(player.jump||0)-dt);player.jumpCool=Math.max(0,(player.jumpCool||0)-dt);player.sense=Math.max(0,(player.sense||0)-dt);
 if(race==='osmo'&&player.form==='fire'){const old=player.fireCharge;player.fireCharge=Math.min(60,old+dt);if(old<60&&player.fireCharge>=60){player.hp=clamp(player.hp*1.2,1,maxHP());flash=.35;burst(player.x,player.y-65,45,'#ffce65');toast('Â¡FUEGO COMPLETO! Â· '+maxHP()+' vida Â· +12% daÃ±o');}}else player.fireCharge=0;
}
function hudV6(){$('#jump').classList.toggle('hidden',player.alien);$('#jump').disabled=player.jumpCool>0;$('#jump').textContent=player.jumpCool>0?'SALTO '+player.jumpCool.toFixed(1):'SALTAR Â· J';const show=race==='osmo'&&player.form==='fire';$('#fullpower').classList.toggle('hidden',!show);if(show){$('#fullpower span').textContent=player.fireCharge>=60?'FUEGO COMPLETO Â· '+maxHP()+' VIDA Â· +12% DAÃ‘O':'PODER ÃGNEO Â· '+Math.floor(player.fireCharge/60*100)+'%';$('#fullpower i').style.width=player.fireCharge/60*100+'%';}$('#lanstatus').classList.toggle('hidden',!net.role);if(net.role)$('#lanstatus').textContent=net.remoteAway?'OTRO JUGADOR EN MENÃš Â· PARTIDA PAUSADA':net.peer?(net.role==='host'?'ANFITRIÃ“N':'INVITADO')+' Â· '+(1+Object.keys(net.members).length)+'/4 JUGADORES Â· FUEGO AMIGO':net.info||'CONECTANDOâ€¦';}
function bestiaAttack(i,prepared=false){const s=ALIENS.bestia.skills[i];if(!prepared){if(!unlockedSkill('bestia',i)){toast('Aprende esta habilidad por 3 puntos en el Ã¡rbol');return;}player.cool[i]=s.cd;}const t=nearest(350),a=t?Math.atan2(t.y-player.y,t.x-player.x):Math.atan2(player.dy,player.dx),d=s.damage*multiplier();player.face=Math.cos(a)>=0?1:-1;player.attack=.45;player.attackFrame=[3,4,5,6,8,9][i];
 if(i===1){player.sense=8;effects.push({type:'sense',x:player.x,y:player.y,r:550,t:1,max:1});toast('SENTIDOS Â· Presencias reveladas durante 8 s');}
 if(i===2){player.motion={type:'beastcharge',t:.55,max:.55,dx:Math.cos(a),dy:Math.sin(a),hits:[],damage:d};player.attack=.55;}
 if(i===0||i===3){effects.push({type:i===0?'claw':'bite',x:player.x,y:player.y-35,a,r:i===0?110:130,t:.45,max:.45});for(const e of combatants())if(e.alive&&dist(player,e)<(i===0?110:130)&&lineClear(player.x,player.y,e.x,e.y)){const b=Math.atan2(e.y-player.y,e.x-player.x);if(Math.abs(Math.atan2(Math.sin(b-a),Math.cos(b-a)))<.9)damageTarget(e,d,.15);}}
 if(i===4){castArea('clawspin',player.x,player.y,140,d,.7,'#eecc8b');player.attack=.7;}
 if(i===5){castArea('beastroar',player.x,player.y,190,d,.9,'#baff86');for(const e of enemies)if(e.alive&&dist(player,e)<190)e.stun=Math.max(e.stun,1);player.attack=.8;}
 tone(i===1?850:130,.2,'triangle');}
function updateKnight(e,dt){e.hit=Math.max(0,e.hit-dt);e.stun=Math.max(0,e.stun-dt);e.cd=Math.max(0,e.cd-dt);e.rcd=Math.max(0,e.rcd-dt);e.cast=Math.max(0,e.cast-dt);e.moving=false;if(!e.alive){e.respawn-=dt;if(e.respawn<=0){Object.assign(e,{alive:true,hp:e.max,x:e.homeX,y:e.homeY,cd:2,rcd:3,wind:0,shotWind:0});}return;}if(e.stun>0)return;const t=teamTargets().sort((a,b)=>dist(e,a)-dist(e,b))[0]||player,d=dist(e,t);e.face=t.x>=e.x?1:-1;
 if(e.shotWind>0){e.shotWind-=dt;e.cast=.15;if(e.shotWind<=0)hostileShots.push({type:'green',x:e.x,y:e.y-45,dx:Math.cos(e.aim)*260,dy:Math.sin(e.aim)*260,t:2.2,r:10,damage:11});return;}
 if(e.wind>0){e.wind-=dt;if(e.wind<=0&&d<80&&lineClear(e.x,e.y,t.x,t.y))hurtTeam(t,12);return;}
 if(d>530)return;
 if(e.knight==='ranged'&&d<440&&e.rcd<=0&&lineClear(e.x,e.y,t.x,t.y)){e.aim=Math.atan2(t.y-e.y,t.x-e.x);e.shotWind=.4;e.cast=.4;e.rcd=4;return;}
 const stop=e.knight==='ranged'?80:60;if(d>stop||!lineClear(e.x,e.y,t.x,t.y)){moveActor(e,(t.x-e.x)/Math.max(1,d)*92*dt,(t.y-e.y)/Math.max(1,d)*92*dt);e.anim+=dt*7;e.moving=true;}else if(e.knight==='ranged'&&d<55){moveActor(e,(e.x-t.x)/Math.max(1,d)*65*dt,(e.y-t.y)/Math.max(1,d)*65*dt);e.anim+=dt*6;e.moving=true;}else if(e.knight==='melee'&&e.cd<=0){e.wind=.6;e.cd=2.4;}}
function drawVerticalGates(){const r=region();for(const dir of ['up','down'])if(r.links[dir]!==undefined){const y=dir==='up'?floorBounds(r.portalX).top+15:r.bottom-8;ctx.fillStyle='#153331d9';ctx.fillRect(r.portalX-77,y-27,154,25);ctx.strokeStyle='#bcdea0';ctx.strokeRect(r.portalX-77,y-27,154,25);txt((dir==='up'?'â†‘ ':'â†“ ')+REGIONS[r.links[dir]].name.toUpperCase(),r.portalX,y-10,9,'#d3f6ab');ctx.strokeStyle='#a3d4a666';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(r.portalX,y,55,10,0,0,Math.PI*2);ctx.stroke();}}
function drawV6Effects(){for(const f of effects){if(!['claw','bite','clawspin','beastroar','sense'].includes(f.type))continue;const p=1-f.t/f.max;ctx.save();ctx.globalAlpha=Math.min(1,f.t*4);ctx.translate(f.x,f.y);ctx.strokeStyle=f.type==='sense'||f.type==='beastroar'?'#b8ff85':'#ffe1a0';ctx.lineWidth=4;if(f.type==='claw'){ctx.rotate(f.a);for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(30,-18+i*14,30+p*45,-1.2,.6);ctx.stroke();}}else if(f.type==='bite'){ctx.rotate(f.a);for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(30+i*12,-25*(1-p));ctx.lineTo(35+i*12,0);ctx.lineTo(30+i*12,25*(1-p));ctx.stroke();}}else{for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,0,Math.max(1,f.r*p-i*16),Math.max(1,(f.r*p-i*16)*.45),0,0,Math.PI*2);ctx.stroke();}}ctx.restore();}}
function drawSensory(){if(!started||!player.alien||player.activeAlien!=='bestia')return;ctx.fillStyle='#010704dc';ctx.fillRect(0,0,WW,WH+140);const range=player.sense>0?650:245;ctx.strokeStyle='#487f4855';ctx.lineWidth=2;for(const b of region().colliders)if(Math.hypot(b.x+b.w/2-player.x,b.y+b.h-player.y)<range)ctx.strokeRect(b.x,b.y,b.w,b.h);for(const a of [...enemies,...citizens,...officers,...remoteTargets(),...(npcHere()?[{...npc,alive:true}]:[])])if(a.alive&&dist(player,a)<range){const power=player.sense>0?1:.55+Math.sin(clock*6)*.2;ctx.globalAlpha=power;const row=a.clancy21?105:a.wasp21?106:a.wolfBoss?40:a.sea?(a.seaType==='manta'?37:38):a.robotBoss?28:a.majorBoss?13:a.knight==='melee'?17:a.knight==='ranged'?18:a.kind==='civil'?a.row:a.kind==='police'?8:a.kind==='remote'?(a.race==='osmo'?14:a.alien?ALIENS[a.activeAlien].row:SKINS[a.skin].row):a===npc?3:a.kind?'2':3;
 const info=a.city21?{...(a.person21>=6?FRAMES22.cityExtra22:FRAMES21.cityPeople21),sheet:art[a.person21>=6?'cityExtra22':'cityPeople21']}:spriteInfo(Number(row)),f=info.table[a.city21?cityPersonFrame21(a):a.moving?1+Math.floor(a.anim||0)%2:0],height=a.robotBoss?190:a.majorBoss?155:a.knight?119:105,scale=height/info.table[0][3],w=f[2]*scale,h=f[3]*scale;tintCanvas.width=Math.ceil(w);tintCanvas.height=Math.ceil(h);tintCtx.imageSmoothingEnabled=false;tintCtx.drawImage(info.sheet,...f,0,0,w,h);tintCtx.globalCompositeOperation='source-in';tintCtx.fillStyle='#8fff93';tintCtx.fillRect(0,0,w,h);tintCtx.globalCompositeOperation='source-over';ctx.save();ctx.translate(a.x,a.y);ctx.scale(a.face||1,1);ctx.drawImage(tintCanvas,-w/2,-h);ctx.restore();txt(a.clancy21?'CLANCY':a.wasp21?'AVISPA':a.robotBoss?'ROBOT':a.majorBoss?'ÃGNEO':a.knight?'CABALLERO':a.kind==='civil'?'CIVIL':a.kind==='remote'?'ALIADO':'PRESENCIA',a.x,a.y-100,8,'#baffaa');}ctx.globalAlpha=1;sprite(16,player.attack>0?player.attackFrame:player.moving?1+walkFrame166(player,2,Math.floor(player.anim)%2):0,player.x,player.y,92,player.face);ctx.strokeStyle='#8dea7155';ctx.beginPath();ctx.ellipse(player.x,player.y,range,range*.45,0,0,Math.PI*2);ctx.stroke();txt(player.sense>0?'SENTIDOS AMPLIFICADOS Â· '+Math.ceil(player.sense)+' s':'ECOLOCALIZACIÃ“N Â· VISIÃ“N CERCANA',player.x,player.y-113,10,'#aefc98');}
// Two-player LAN: host owns mobs, guest owns their avatar and persistent progression.
const net={role:null,peer:false,remote:null,info:'',tick:0,source:null,seq:0,seen:0,last:0,room:null,applying:false,waiting:false,away:false,remoteAway:false};
function remoteTargets(){return Object.values(net.members||{}).filter(o=>o.zone===zone&&o.alive!==false);}
function teamTargets(){const visible=[player,...remoteTargets()].filter(o=>!(o.ghostInvisible>0));return visible.length?visible:[{x:-99999,y:-99999,kind:'decoy',alive:false}];}
function combatants(){return [...enemies,...citizens,...officers,...remoteTargets()];}
function hurtTeam(t,d){if(t.kind==='decoy')return;if(t.kind==='remote')lanSend({type:'hurt',damage:d,zone,to:t.id});else hitPlayer(d);}
function avatarPacket(){return {id:net.id,ultraMode:player.ultraMode,ultraFrame:player.ultraFrame,ultraTime:player.ultraTime,greyFrame:player.greyFrame,intellect:player.intellect,warps:player.warps,regenWait:player.regenWait,hauntPhase:player.haunt.phase,crouching:player.crouching,ghostPhase:player.ghostPhase,ghostInvisible:player.ghostInvisible,ghostFrame:player.ghostFrame,possession:player.possession?{id:player.possession.id}:null,watchOpen:player.watchOpen,watchTurn:player.watchTurn,x:player.x,y:player.y,zone,face:player.face,dx:player.dx,dy:player.dy,hp:player.hp,max:maxHP(),level:player.level,race,skin:player.skin,alienSkins:player.alienSkins,musicFrame:player.musicFrame,aquaFrame:player.aquaFrame,wolfFrame:player.wolfFrame,wolfDash:player.wolfDash?{t:player.wolfDash.t}:null,osmoWaterFrame:player.osmoWaterFrame,vitality:player.vitality,oxygen:player.oxygen,alien:player.alien,activeAlien:player.activeAlien,form:player.form,fireCharge:player.fireCharge,anim:player.anim,moving:player.moving,attack:player.attack,attackFrame:player.attackFrame,fullFrame:player.fullFrame,cast:player.cast,flight:player.flight,jump:player.jump,leap:player.leap?player.leap.t:0,shield:player.shield,motion:player.motion?{type:player.motion.type,t:player.motion.t,max:player.motion.max}:null,alive:true};}
function syncEntities(old,next){const map=new Map(old.map(e=>[String(e.id),e]));return (next||[]).slice(0,40).map(e=>Object.assign(map.get(String(e.id))||{},e));}
function worldPacket(){return {type:'world',avatars:[{...avatarPacket(),paused:paused||net.away},...Object.values(net.members)],peerVisuals:net.peerVisuals,hauntWorld,zone,dayMode,clock,enemies,citizens,officers,bossTimer,robotTimer:player.robotTimer,wolfTimer:player.wolfTimer,quest:quest.state,shots:hostileShots,projectiles,effects:effects.map(e=>({...e,t:Math.max(.02,e.t)})),avatar:avatarPacket(),paused:paused||net.away||partyPaused16(),law:{heat:law.heat,timer:law.timer}};}
function lanReceiveLegacy(m){if(!m||m.v!==16||!net.role)return;net.last=performance.now();if(v15Receive(m)||v14Receive(m)||v13Receive(m))return;
 if(m.type==='wolfRecovery'&&net.role==='host'&&m.zone===17&&zone===17&&net.remote?.zone===17){recoverWolf();return;}if(m.type==='story2Kill'&&net.role==='guest'&&m.zone===18&&zone===18){story2Kill(m.id);return;}if(m.type==='wolfDNA'&&net.role==='guest'){grantWolfDNA();return;}if(m.type==='wolfThrow'&&net.role==='host'&&m.zone===zone&&m.seq>net.seen&&net.remote?.activeAlien==='wolf'&&Number.isFinite(m.damage)&&m.damage>=0&&m.damage<=200&&Number.isFinite(m.a)){net.seen=m.seq;const t=combatants().find(e=>e.id===m.id&&e.kind===m.kind);if(t&&t.alive&&!t.hexBoss&&!t.ghostBoss&&!t.chapter2&&!t.wolfBoss&&!t.majorBoss&&!t.robotBoss&&t.kind!=='remote'&&dist(net.remote,t)<180){net.source='guest';performThrow(t,m.a,m.damage);net.source=null;}return;}if(m.type==='robotKill'&&net.role==='guest'&&m.zone===11&&zone===11){robotQuestKill();return;}if(m.type==='status'||m.type==='statusSelf'){statusPacket(m);return;}if(m.type==='knightKill'&&net.role==='guest'){knightKill();save();return;}if(m.type==='knightStart'&&net.role==='host'&&zone===6&&net.remote?.level>=15&&dist(net.remote,questKnight)<160){spawnEnemies();lanSend(worldPacket());return;}
 if(m.type==='mission'&&net.role==='guest'){quest.state='active';quest.kills=0;save();return;}if(m.type==='hello'){net.peer=true;net.waiting=false;net.remote={...m.avatar,kind:'remote',id:'remote'};net.info='DOS JUGADORES';if(net.role==='host'){lanSend(worldPacket());toast('Jugador conectado Â· Fuego amigo activo');}return;}
 if(m.type==='avatar'&&m.avatar){net.remote={...m.avatar,kind:'remote',id:'remote'};net.remoteAway=!!m.paused;return;}
 if(m.type==='world'&&net.role==='guest'){if(m.hauntWorld){hauntWorld=cleanClone(m.hauntWorld);if(player.haunt.phase>=2&&player.haunt.phase<3&&hauntWorld.switches.every(Boolean))syncHauntProgress();}net.peer=true;net.waiting=false;net.applying=true;if(Number.isInteger(m.zone)&&REGIONS[m.zone]&&zone!==m.zone){enterZone(m.zone,'center');player.x=clamp(m.avatar.x-70,region().minX+20,region().maxX-20);player.y=m.avatar.y;}dayMode=m.dayMode;clock=m.clock;enemies=syncEntities(enemies,m.enemies);zoneStates[region().id]=enemies;citizens=syncEntities(citizens,m.citizens);officers=syncEntities(officers,m.officers);bossTimer=m.bossTimer;player.robotTimer=Math.max(0,m.robotTimer||0);player.wolfTimer=Math.max(0,m.wolfTimer||0);net.remote={...m.avatar,kind:'remote',id:'remote'};net.remoteAway=!!m.paused;net.visuals={shots:m.shots||[],projectiles:m.projectiles||[],effects:m.effects||[]};if(m.quest==='active'&&quest.state==='new'){quest.state='active';quest.kills=0;}law.heat=m.law?.heat||0;law.timer=m.law?.timer||0;net.applying=false;return;}
 if(m.type==='damage'&&net.role==='host'&&m.zone===zone&&m.seq>net.seen&&net.remote){net.seen=m.seq;const pool=m.kind==='civil'?citizens:m.kind==='police'?officers:enemies,t=pool.find(e=>String(e.id)===String(m.id));if(!t||!t.alive||!Number.isFinite(m.damage)||m.damage<0||m.damage>partyDamageCap112(net.remote)||dist(net.remote,t)>850)return;net.source='guest';damageTarget(t,m.damage,Math.min(1,m.stun||0));net.source=null;lanSend(worldPacket());return;}
 if(m.type==='hurt'&&m.zone===zone&&Number.isFinite(m.damage)&&m.damage>0&&m.damage<=600){hitPlayer(m.damage);return;}
 if(m.type==='reward'&&net.role==='guest'){if(m.xp)xp(clamp(m.xp,0,1200));if(m.kill&&quest.state==='active'){quest.kills=Math.min(7,quest.kills+1);if(quest.kills===7)quest.state='return';}if(m.dna&&race==='osmo'){player.dnaFire=true;toast('Â¡ADN Ã­gneo obtenido!');}save();return;}
 if(m.type==='crime'&&net.role==='guest'){crime(clamp(m.penalty,0,20));return;}
 if(m.type==='visual'){net.guestVisuals=m;return;}
}
function lanMenu(){const supported=!!window.OmniLAN,ip=supported?window.OmniLAN.address():'Disponible en el APK Android';showDialog('MULTIJUGADOR LOCAL Â· HASTA 4 JUGADORES','Jugar en la misma Wi-Fi','<p>Hasta cuatro telÃ©fonos deben estar en la misma red Wi-Fi y usar OMNI 0.16. Cada uno conserva su nivel y raza. El anfitriÃ³n dirige los viajes. <b>Fuego amigo activo</b>; no da EXP. Los menÃºs y cinemÃ¡ticas pausan al grupo.</p><p>Tu IP: <b id="lanip"></b><br><span id="roominfo"></span></p><div class="lanfields"><label>IP del anfitriÃ³n<input id="hostip" inputmode="decimal" placeholder="192.168.1.20" maxlength="15"></label><label>CÃ³digo de sala<input id="roomcode" inputmode="numeric" placeholder="6 dÃ­gitos" maxlength="6"></label></div><p>Primero elige tu raza en el menÃº. Crea una sala y comparte IP y cÃ³digo; los otros jugadores pulsan UNIRSE. Una red de invitados con aislamiento puede impedir la conexiÃ³n.</p>',[['VOLVER',closeDialog],['CREAR SALA',()=>{if(!supported){toast('Instala el APK para jugar por Wi-Fi');return;}window.OmniLAN.stop();clearRoom16();net.role='host';net.waiting=false;net.remote=null;net.peer=false;net.seq=net.seen=0;net.info='CREANDO SALAâ€¦';window.OmniLAN.host();closeDialog();if(!started)$('#play').click();}],['UNIRSE',()=>{if(!supported){toast('Disponible en el APK Android');return;}const host=$('#hostip').value.trim(),code=$('#roomcode').value.trim();if(!/^(\d{1,3}\.){3}\d{1,3}$/.test(host)||host.split('.').some(n=>+n>255)||!/^\d{6}$/.test(code)){toast('Escribe una IP IPv4 y un cÃ³digo de 6 dÃ­gitos');return;}window.OmniLAN.stop();clearRoom16();net.role='guest';net.peer=false;net.waiting=true;net.remote=null;net.seq=net.seen=0;net.info='CONECTANDOâ€¦';window.OmniLAN.join(host,code);closeDialog();if(!started)$('#play').click();}],['SALIR DE LA SALA',()=>{if(supported)window.OmniLAN.stop();clearRoom16();net.role=null;net.peer=false;net.remote=null;net.waiting=false;net.remoteAway=false;net.visuals=net.guestVisuals=null;save();closeDialog();}]]);$('#lanip').textContent=ip;$('#roominfo').textContent=net.role?net.info+(net.room?' Â· CÃ³digo: '+net.room:''):'Sin sala activa';}
function drawRemote(single){for(const o of single?[single]:remoteTargets()){if(o.possession){txt('J'+(Number(o.id)+1)+' Â· POSESIÃ“N',o.x,o.y-140,9,'#d9b2ff');continue;}let row=o.race==='osmo'?(o.form==='fire'?(o.fireCharge>=60?19:15):14):o.alien?ALIENS[o.activeAlien]?.row||1:SKINS[o.skin]?.row||0,f=o.attack>0?(o.race==='osmo'?(o.fireCharge>=60?o.fullFrame||3:3):o.attackFrame||3):o.moving?1+walkFrame166(o,2,Math.floor(o.anim)%2):0,h=o.race==='osmo'?132:o.alien?(o.activeAlien==='ultra'?ultraHeight(o):o.activeAlien==='grey'?52:underwater()&&o.activeAlien!=='aquatic'?(o.activeAlien==='fourarms'?92:76):o.activeAlien==='fourarms'?144:o.activeAlien==='bestia'?92:o.activeAlien==='benmomia'?165:123):98;let lift=o.jump>0?Math.sin((.75-o.jump)/.75*Math.PI)*72:o.leap?Math.sin((1-o.leap)*Math.PI)*140:0;if(o.jump>0&&o.race==='omni'&&!o.alien){if(o.skin===0){row=20;f=o.jump>.65?0:o.jump>.35?1:o.jump>.1?2:3;}else f=o.jump>.1?4:5;}if(o.motion?.type==='slide'){row=12;f=1;}
 ctx.fillStyle='#05182588';ctx.beginPath();ctx.ellipse(o.x,o.y,26,8,0,0,Math.PI*2);ctx.fill();if(o.race==='osmo')drawOsmo(f,o.x,o.y-lift,o.face,o);else if(underwater()&&!o.alien&&!o.watchOpen)drawUnderwaterHuman(o,o.x,o.y,o.face);else {const pose=combatPose(o,row,f);sprite(pose.row,pose.f,o.x,o.y-lift-pose.lift,h,o.face,o.ghostInvisible>0?.3:o.ghostPhase>0?.55:1);}txt('J'+(Number(o.id)+1)+' Â· NV. '+o.level,o.x,o.y-h-22,9,'#92eaff');ctx.fillStyle='#102b3a';ctx.fillRect(o.x-35,o.y-h-14,70,5);ctx.fillStyle='#89ddec';ctx.fillRect(o.x-35,o.y-h-14,70*clamp(o.hp/o.max,0,1),5);}}
function drawNetworkEffects(){for(const v of [net.role==='guest'?net.visuals:null,...Object.entries(net.peerVisuals||{}).filter(([id])=>Number(id)!==net.id).map(([,v])=>v)])if(v)drawNetworkLayer16(v);}
function drawNetworkLayer16(v){for(const p of [...(v.projectiles||[]),...(v.shots||[])]){if(drawProjectile28(ctx,p))continue;if(p.wasp21){drawSting21(ctx,p);continue;}ctx.fillStyle=p.pink?'#ff70df':p.type==='plasma16'?'#aaff55':p.type==='hexbolt'?'#ce8aff':p.type==='crystal'?'#aaffdc':['green','goo','toxin'].includes(p.type)?'#abff7d':p.type==='boulder'?'#ad9c87':'#ffc86a';ctx.fillRect(p.x-8,p.y-6,16,12);}for(const f of v.effects||[]){if(drawNetworkFX28(ctx,f))continue;if(drawUltraEffect16(f))continue;if(f.type==='musicnotes'){drawMusicEffect(f);continue;}if(!f.r)continue;ctx.strokeStyle=f.pink?'#ff83e1':['bossflame','bossslam'].includes(f.type)?'#ff9b6b':'#aacde299';ctx.lineWidth=3;ctx.beginPath();if(f.type.includes('flame')){ctx.moveTo(f.x,f.y);ctx.arc(f.x,f.y,f.r,(f.a||0)-.5,(f.a||0)+.5);ctx.closePath();}else ctx.ellipse(f.x,f.y,f.r*Math.max(.1,1-f.t/f.max),f.r*.4*Math.max(.1,1-f.t/f.max),0,0,Math.PI*2);ctx.stroke();}}

// OMNI 0.11: separate race wallets, knight patrol, animated casts and Insecotide.
const questKnight={x:270,y:790,face:1,row:22,name:'SIR ALDRIC'},ten={x:1080,y:726,face:-1,row:23,name:'TEN'};
function extraNPC(){return zone===6?questKnight:zone===9?ten:zone===10?kim:zone===12?neko:null;}
function knightKill(){const q=player.knightQuest;if(q.state==='active'){q.kills=Math.min(4,q.kills+1);if(q.kills===4){q.state='return';toast('Caballeros derrotados Â· Vuelve con Sir Aldric');}}}
function beginKnightQuest(){if(zone!==6||dist(player,questKnight)>140||player.level<13)return false;const q=player.knightQuest;if(q.state==='active'||q.state==='return')return false;q.state='active';q.kills=0;if(net.role==='guest')lanSend({type:'knightStart',zone});else{spawnEnemies();if(net.peer)lanSend(worldPacket());}closeDialog();toast('Patrulla de la orden Â· Derrota a 4 caballeros');save();return true;}
function claimKnightQuest(){const q=player.knightQuest;if(zone!==6||dist(player,questKnight)>140||q.state!=='return'||player.level<13)return false;q.state='done';q.completions++;player.coins+=20;xp(400);closeDialog();toast('Patrulla completada Â· +400 EXP Â· +20 monedas');save();return true;}
function knightTalk(){const q=player.knightQuest;if(player.level<13){showDialog('SIR ALDRIC Â· PATRULLA DE LA ORDEN','Vuelve al nivel 13','<p>Â«La fortaleza estÃ¡ tomada por caballeros hostiles. Antes de enfrentarlos, alcanza el <b>nivel 13</b> con tu raza actual.Â»</p><p>Tu nivel: '+player.level+'. Cada raza debe cumplir el requisito por separado.</p>',[['ENTENDIDO',closeDialog]]);return;}const near=zone===6&&dist(player,questKnight)<=140;showDialog('SIR ALDRIC Â· MISIÃ“N REPETIBLE','Romper el cerco','<p>Â«Derrota a cuatro caballeros de la fortaleza o del salÃ³n norte y regresa conmigo.Â»</p><p><b>'+q.kills+' / 4 caballeros</b> Â· Patrullas: '+q.completions+'</p><p class="reward">400 EXP Â· 20 monedas para tu raza actual</p><p>'+(near?'Puedes repetirla despuÃ©s de cobrar.':'Sir Aldric espera en la parte oeste del patio de la Fortaleza. AcÃ©rcate para aceptar o cobrar.')+'</p>',[...(near?[q.state==='return'?['COBRAR RECOMPENSA',claimKnightQuest]:q.state==='active'?['SEGUIR PATRULLA',closeDialog]:['ACEPTAR PATRULLA',beginKnightQuest]]:[]),['VOLVER',closeDialog]]);}
function talkExtra(){const n=extraNPC();if(!n||dist(player,n)>140)return false;if(n===questKnight)knightTalk();else if(n===ten)tenHub();else if(n===neko)nekoTalk();else danceMenu();return true;}
function beginCast(style,i){const duration=i===0?.46:i===1?.64:.8;player.cast={style,i,t:duration,max:duration};player.attack=duration;window.OmniSound?.play(style==='diamond'?'crystal':style.includes('fire')||style==='heatblast'?'fire':style==='insect'?'spit':'punch');}
function castFrame(o){const c=o.cast;if(!c||c.t<=0)return null;const p=1-c.t/c.max,stage=p<.2?0:p>.78?2:1;const i=c.i;if(c.style==='heatblast')return [0,[1,2,3,4,5,6][i],7][stage];if(c.style==='diamond')return 8+[0,[1,2,3,4,5,6][i],7][stage];if(c.style==='osmo')return [0,[1,2,3,4,5,6][i],7][stage];if(c.style==='osmofire')return [8,[9,10,11,11,9,11][i],8][stage];if(c.style==='insect')return stage===0?3:stage===2?(o.flight>0?7:0):[4,8,9,5,10,11][i];return null;}
function combatPose(o,row,f){if(ultraForm(o))return ultraPose(o);if(greyForm(o))return greyPose(o);if(hasPinkSkin(o))return pinkPose(o);if(ghostForm(o))return ghostPose(o);if(!o.alien&&o.watchOpen)return {row:60+(o.skin||0),f:cinematic?.mode==='press'?Math.min(3,2+Math.floor(cinematic.time*3)):o.watchTurn>0?1:0,lift:0};if(underwater()&&o.alien){const swim=swimAlienPose(o);if(swim)return swim;}if(o.alien&&o.activeAlien==='wolf')return wolfPose(o);if(o.alien&&o.activeAlien==='aquatic')return aquaticPose(o);if(hasMusicSkin(o)){row=26;if(o.attack>0){f=o.leap?4:o.attackFrame===5?5:o.musicFrame||3;}else f=o.moving?1+walkFrame166(o,2,Math.floor(o.anim)%2):0;return {row,f,lift:0};}const cf=castFrame(o);if(cf!==null){if(o.cast.style==='heatblast'||o.cast.style==='diamond'){row=25;f=cf;}else if(o.cast.style==='insect'){row=21;f=cf;}}else if(o.alien&&o.activeAlien==='insect'){row=21;f=o.flight>0?5+Math.floor(clock*11)%3:o.moving?1+walkFrame166(o,2,Math.floor(o.anim)%2):0;}return {row,f,lift:o.alien&&o.activeAlien==='insect'&&o.flight>0?38+Math.sin(clock*6)*5:0};}
function insectAttack(i){const s=ALIENS.insect.skills[i];if(!unlockedSkill('insect',i)){toast(i<4?'Requiere maestrÃ­a '+s.unlock:'Aprende esta habilidad por 3 puntos');return;}player.cool[i]=s.cd;beginCast('insect',i);const t=nearest(470),a=t?Math.atan2(t.y-player.y,t.x-player.x):Math.atan2(player.dy,player.dx),d=s.damage*multiplier();player.face=Math.cos(a)>=0?1:-1;const spit=(angle,type,damage)=>{shoot(type,angle,damage,430);const p=projectiles.at(-1);p.r=12;p.t=1.5;};if(i===0)spit(a,'goo',d);if(i===1){const at=t||{x:player.x+Math.cos(a)*145,y:player.y+Math.sin(a)*100};effects.push({type:'puddle',x:at.x,y:at.y,r:145,t:4.55,max:4.55,tick:.05,pulses:0,damage:d});}if(i===2){spit(a,'toxin',d);projectiles.at(-1).poisonDamage=4*multiplier();}if(i===3){player.flight=12;burst(player.x,player.y-20,14,'#dcff91');toast('Vuelo Â· 12 s Â· MuÃ©vete con la palanca');}if(i===4){effects.push({type:'wingwave',x:player.x,y:player.y-28,r:155,t:.7,max:.7});areaHit(player.x,player.y,155,d,.55);}if(i===5)for(let n=-1;n<=1;n++)spit(a+n*.14,'goo',d);}
function applyStatus(t,type,duration,damage=0){if(!t||t.alive===false)return;if(t.kind==='remote'){lanSend({type:'statusSelf',status:type,duration,damage,zone,to:t.id});return;}if(net.role==='guest'&&!net.applying&&t!==player){lanSend({type:'status',id:t.id,kind:t.kind,status:type,duration,damage,zone});return;}if(type==='slow')t.slow=Math.max(t.slow||0,duration);if(type==='poison')t.poison={time:duration,tick:1,damage,owner:net.source==='guest'?'guest':'host',peer:net.sourcePeer};}
function statusPacket(m){if(m.zone!==zone||!['slow','poison'].includes(m.status))return;const duration=clamp(Number(m.duration)||0,0,m.status==='slow'?3:5),damage=clamp(Number(m.damage)||0,0,4*(1+69*.035));if(m.type==='statusSelf'){applyStatus(player,m.status,duration,damage);return;}if(net.role!=='host'||!net.remote)return;const target=(m.kind==='civil'?citizens:m.kind==='police'?officers:enemies).find(e=>String(e.id)===String(m.id));if(target?.alive&&dist(target,net.remote)<850){net.source='guest';applyStatus(target,m.status,duration,damage);net.source=null;}}
function updateStatus(o,dt){o.slow=Math.max(0,(o.slow||0)-dt);const p=o.poison;if(!p||o.alive===false){o.poison=null;return;}const elapsed=Math.min(dt,Math.max(0,p.time));p.time-=dt;p.tick-=elapsed;if(p.tick<.00001){p.tick+=1;if(o===player)hitPlayer(p.damage);else{withPeerSource16(p.owner==='guest'?p.peer:null,()=>damageTarget(o,p.damage));}burst(o.x,o.y-45,3,'#b4ed55');}if(p.time<.00001)o.poison=null;}
function updateV7(dt){if(player.cast){player.cast.t-=dt;if(player.cast.t<=0)player.cast=null;}player.flight=player.alien&&player.activeAlien==='insect'?Math.max(0,(player.flight||0)-dt):0;updateStatus(player,dt);if(net.role!=='guest')for(const e of [...enemies,...citizens,...officers])updateStatus(e,dt);for(const f of effects)if(f.type==='puddle'){f.tick-=dt;if(f.tick<=0&&f.pulses<6){f.tick+=.75;f.pulses++;for(const t of combatants())if(t.alive&&Math.hypot(t.x-f.x,t.y-f.y)<f.r&&lineClear(f.x,f.y,t.x,t.y)){damageTarget(t,f.damage);applyStatus(t,'slow',1);}}}window.OmniSound?.step(dt,player.moving&&!player.flight&&!player.jump,underwater()?'water':zone<3||zone===17?'forest':zone===9?'wood':'stone',moveSpeed());}
function drawV7Effects(){for(const f of effects){if(f.type==='puddle'){ctx.save();ctx.globalAlpha=Math.min(.8,f.t*2);ctx.fillStyle='#285e20';ctx.beginPath();ctx.ellipse(f.x,f.y,f.r,f.r*.34,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8ae837';ctx.lineWidth=3;ctx.stroke();for(let i=0;i<12;i++){const a=i*2.4,x=f.x+Math.cos(a)*f.r*.8,y=f.y+Math.sin(a)*f.r*.26;ctx.fillStyle=i%2?'#5fc829':'#c7fa6c';ctx.fillRect(x,y-Math.sin(clock*4+i)*4,5+(i%3)*3,4);}ctx.restore();}if(f.type==='wingwave'){ctx.strokeStyle='#e4ffae';ctx.lineWidth=3;const p=1-f.t/f.max;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(f.x,f.y,Math.max(1,f.r*p-i*20),Math.max(1,f.r*.55*p-i*8),0,0,Math.PI*2);ctx.stroke();}}if(f.type==='friendlyflame'){ctx.save();ctx.translate(f.x,f.y-47);ctx.rotate(f.a);for(let layer=0;layer<3;layer++){ctx.fillStyle=(f.pink?['#d72a9abb','#ff72dfdd','#fff0fa']:['#ee5b22bb','#ffab38dd','#fff0a9'])[layer];ctx.beginPath();ctx.moveTo(30,0);for(let i=0;i<=18;i++){let x=30+i*10,width=(9+i*.6)*(1-layer*.29),flicker=Math.sin(clock*34-i*1.7)*5;ctx.lineTo(x,-width+flicker);}for(let i=18;i>=0;i--){let x=30+i*10,width=(9+i*.6)*(1-layer*.29),flicker=Math.sin(clock*30-i*1.3)*5;ctx.lineTo(x,width+flicker);}ctx.closePath();ctx.fill();}for(let i=0;i<9;i++){ctx.fillStyle=f.pink?(i%2?'#ffc7f2':'#ff59ca'):(i%2?'#ffd469':'#ff7334');const x=45+(clock*170+i*23)%180;ctx.fillRect(x,Math.sin(i*2.4+clock*15)*26,5,3);}ctx.restore();}}
 for(const e of [...enemies,...citizens,...officers,player]){if(e.alive===false)continue;if(e.poison)txt('VENENO',e.x,e.y-145,8,'#c7ff6b');else if(e.slow>0)txt('LENTO',e.x,e.y-145,8,'#91e0ce');}}
function hudV7(){$('#coins').textContent='â—ˆ '+player.coins+' MONEDAS';const n=extraNPC();if(n&&dist(player,n)<140){$('#talk').classList.remove('hidden');$('#talk').textContent='â—† HABLAR CON '+n.name;}if(zone===6||zone===8){const q=player.knightQuest;$('#mission .tiny').textContent='MISIÃ“N 02 Â· LA ORDEN Â· NV. 15';$('#questtext').textContent=q.state==='active'?'Caballeros Â· '+q.kills+' / 4':q.state==='return'?'Regresa con Sir Aldric':player.level<15?'Se desbloquea al nivel 15':'Habla con Sir Aldric';$('#questsub').textContent='400 EXP Â· 20 monedas Â· Fortaleza';}else $('#mission .tiny').textContent='MISIÃ“N 01 Â· EL CLARO';if(player.flight>0){$('#shieldstatus').classList.remove('hidden');$('#shieldstatus').textContent='VUELO Â· '+Math.ceil(player.flight)+' s';}}

// OMNI 0.11 â€” cosmetic concert reward and first story chapter.
const kim={x:800,y:690,face:-1,row:27,name:'KIM TAEHYUNG'};
function initV8(){player.story=Object.assign({state:'new',completions:0,reward:0},player.story||{});player.story.completions=clamp(Math.floor(player.story.completions)||0,0,2);if(player.story.completions>=2)player.story.state='complete';player.robotTimer=Math.max(0,Number(player.robotTimer)||0);player.alienSkins=Object.assign({fourarms:'classic'},player.alienSkins||{});player.unlockedAlienSkins=Object.assign({fourarmsConcert:false},player.unlockedAlienSkins||{});if(!player.unlockedAlienSkins.fourarmsConcert)player.alienSkins.fourarms='classic';player.danceBest=player.danceBest||{};$('#alienskins')?.classList.toggle('hidden',race!=='omni');}
function hasMusicSkin(o=player){return o.alien&&o.activeAlien==='fourarms'&&o.alienSkins?.fourarms==='concert';}
function selectAlienSkinLegacy(id){if(race!=='omni'||!['classic','concert'].includes(id))return false;if(id==='concert'&&!player.unlockedAlienSkins.fourarmsConcert)return false;player.alienSkins.fourarms=id;persistGame();return true;}
function alienSkinMenuLegacy(){if(race!=='omni'){showDialog('SKINS DE ALIENS','Solo para portadores del Omnitrix','<p>El osmosiano conserva sus propias formas. Cambia a la raza del Omnitrix desde RAZAS para elegir skins de aliens.</p>',[['VOLVER',closeDialog]]);return;}showDialog('APARIENCIA Â· MISMO PODER','Skins de aliens','<p><b>Cuatro Brazos Â· Traje de concierto</b>. Conserva 400 de vida, el mismo daÃ±o, maestrÃ­a, velocidad y seis habilidades. Sus movimientos son propios y los ataques emiten notas musicales.</p><div class="alien-skin-cards">'+[['classic','ClÃ¡sico',5],['concert','Traje de concierto',26]].map(([id,n])=>'<button data-alien-skin="'+id+'" class="'+(player.alienSkins.fourarms===id?'active':'')+'"><canvas width="150" height="170"></canvas><b>'+n+'</b><small>'+(id==='classic'?'DISPONIBLE':player.unlockedAlienSkins.fourarmsConcert?'DESBLOQUEADA':'GANA LA BATALLA EN FÃCIL')+'</small></button>').join('')+'</div><p>Concierto: entra al local de Ciudad Bellwood y habla con Kim Taehyung. El premio se obtiene con la raza del Omnitrix y queda guardado.</p>',[['LISTO',closeDialog]]);for(const b of document.querySelectorAll('[data-alien-skin]')){const row=b.dataset.alienSkin==='classic'?5:26,{table,sheet}=spriteInfo(row),f=table[0],c=b.querySelector('canvas').getContext('2d'),h=155,w=f[2]/f[3]*h;c.imageSmoothingEnabled=false;c.drawImage(sheet,...f,(150-w)/2,10,w,h);b.onclick=()=>{if(selectAlienSkin(b.dataset.alienSkin))alienSkinMenu();else toast('Gana en DIFÃCIL con el portador del Omnitrix');};}}
function musicalAttack(i){if(!hasMusicSkin())return;player.musicFrame=[3,4,6,7,8,9][i];effects.push({type:'musicnotes',x:player.x,y:player.y-100,t:1.05,max:1.05,r:100,style:i});window.OmniSound?.play('music');}
function drawMusicEffect(f){const p=1-f.t/f.max;ctx.save();ctx.globalAlpha=Math.min(1,f.t*2.5);for(let i=0;i<8;i++){const a=i*.81+(f.style||0)*.3,x=f.x+Math.cos(a)*(65+p*85),y=f.y+Math.sin(a)*50-p*65;txt(i%3===0?'â™«':'â™ª',x,y,22+(i%3)*3,['#dbadff','#ffd69f','#a8f6fa'][i%3]);}ctx.restore();}
function danceMenu(){const notes=window.OmniRhythm.chart;showDialog('KIM TAEHYUNG Â· CONCIERTO BAHÃA','Â¿Una batalla de baile?','<p>Â«Â¡Hola! Â¿Quieres subir al escenario? Elige una dificultad y sigue las flechas.Â»</p><p><b>RUN Â· BTS Â· Ronda de 4:20</b>. Pulsa las flechas cuando lleguen a la lÃ­nea inferior. PERFECT y SICK recuperan energÃ­a; los fallos la reducen. Ganas si llegas al final con energÃ­a.</p><p>'+(race==='omni'?'Premio al ganar FÃCIL: skin musical de Cuatro Brazos.':'Puedes bailar con esta raza. Para obtener la skin de Cuatro Brazos, gana FÃ¡cil con el Omnitrix.')+'</p><p>FÃ¡cil: '+notes.charts.easy.length+' flechas Â· Normal: '+notes.charts.normal.length+' Â· DifÃ­cil: '+notes.charts.hard.length+'.</p><label>SincronizaciÃ³n tÃ¡ctil <span id="synclabel">'+OmniRhythm.offset+' ms</span><input id="rhythmsync" type="range" min="-150" max="150" step="5" value="'+OmniRhythm.offset+'"></label><p>0 ms recomendado. Si necesitas ajustar la sensaciÃ³n de los toques, cambia este valor. Puedes pausar durante la canciÃ³n.</p>'+(net.peer?'<p>El reto es individual. El mundo compartido queda en pausa durante tu actuaciÃ³n.</p>':''),[['FÃCIL',()=>startDance('easy')],['NORMAL',()=>startDance('normal')],['DIFÃCIL',()=>startDance('hard')],['AHORA NO',closeDialog]]);$('#rhythmsync').oninput=e=>{OmniRhythm.calibrate(+e.target.value);$('#synclabel').textContent=OmniRhythm.offset+' ms';};}
function danceReward(result){const old=player.danceBest[result.mode];if(!old||result.score>old.score)player.danceBest[result.mode]={score:result.score,accuracy:result.accuracy,won:result.won};let message=result.won?'Â¡Buen ritmo! Puedes volver a intentarlo en otra dificultad.':'No pierdes vida ni progreso de tu aventura. IntÃ©ntalo otra vez.';if(result.won&&['easy','normal','hard'].includes(result.mode)&&race==='omni'){const fresh=!player.unlockedAlienSkins.fourarmsConcert;player.unlockedAlienSkins.fourarmsConcert=true;message=fresh?'Â¡SKIN DESBLOQUEADA! Cuatro Brazos Â· Traje de concierto. EquÃ­pala en SKINS DE ALIENS.':'Ya tienes la skin musical. Tu mejor puntuaciÃ³n queda guardada.';}persistGame();return message;}
function startDance(mode){if(zone!==10||dist(player,kim)>145)return false;resetInput();dialogOpen=false;$('#modal').classList.add('hidden');paused=true;save();return OmniRhythm.start(mode,{background:art.places8,npc:spriteInfo(27),onComplete:danceReward,onExit:()=>{paused=false;last=performance.now();resetInput();hud();save();}});}
function startStory(){if(zone!==9||dist(player,ten)>140)return false;const q=player.story;if(q.completions>=2||q.state==='active'||q.state==='return')return false;q.state='active';q.reward=Math.round(xpNeed()*.9);showDialog('TEN Â· CAPÃTULO 1','Gracias, cuento contigo','<p>Â«Vilgax estÃ¡ causando estragos por la ciudad. Su robot estÃ¡ en la zona devastada al <b>sur del Barrio residencial</b>. DerrÃ³talo y regresa conmigo.Â»</p><p>Recompensa al volver: <b>'+q.reward+' EXP</b>. Tu intento no se pierde si caes.</p>',[['BUSCAR AL ROBOT',closeDialog]]);save();return true;}
function robotQuestKill(){if(zone===11&&player.story.state==='active'){player.story.state='return';toast('Robot de Vilgax derrotado Â· Regresa con Ten');save();}}
function claimStory(){const q=player.story;if(zone!==9||dist(player,ten)>140||q.state!=='return'||q.completions>=2)return false;const reward=q.reward;q.completions++;q.state=q.completions>=2?'complete':'done';q.reward=0;xp(reward);showDialog('TEN Â· HISTORIA 01 COMPLETADA','La ciudad puede respirar','<p>Â«Gracias por ayudarme. Detuvimos al robot, pero Vilgax no se rendirÃ¡ tan fÃ¡cilmente.Â»</p><p class="reward">+'+reward+' EXP</p><p>'+(q.completions===1?'Te queda una repeticiÃ³n de este capÃ­tulo con esta raza.':'Has completado la primera victoria y la Ãºnica repeticiÃ³n de esta raza. PrÃ³ximo capÃ­tulo prÃ³ximamente.')+'</p>',[['CONTINUAR',closeDialog]]);save();return true;}
function storyTalk(){const q=player.story,near=zone===9&&dist(player,ten)<=140;if(q.state==='complete'){showDialog('TEN Â· MODO HISTORIA','CapÃ­tulo 1 completado','<p>Â«Ya venciste al robot y completaste la Ãºnica repeticiÃ³n con esta raza. Gracias, chico. El capÃ­tulo 2 ya estÃ¡ disponible al nivel 20.Â»</p><p>Victorias cobradas: 2 / 2 Â· Progreso independiente para cada raza.</p>',[['HASTA PRONTO',closeDialog]]);return;}if(q.state==='return'){showDialog('TEN Â· VICTORIA CONFIRMADA','Buen trabajo contra el robot','<p>Â«Â¡Lo lograste! La ciudad estÃ¡ mÃ¡s segura gracias a ti.Â»</p><p class="reward">Recompensa: '+q.reward+' EXP</p><p>'+(near?'Cobra tu recompensa.':'Regresa a la habitaciÃ³n de Ten, al norte del Barrio.')+'</p>',[...(near?[['COBRAR RECOMPENSA',claimStory]]:[]),['VOLVER',closeDialog]]);return;}if(q.state==='active'){showDialog('TEN Â· HISTORIA 01','DetÃ©n al robot de Vilgax','<p>Encuentra la zona devastada <b>hacia abajo desde el Barrio residencial</b>. Derrota al robot y regresa con Ten.</p><p>Robot: 950 vida Â· nivel recomendado 12 Â· ataques anunciados de 14â€“18 de daÃ±o. Reaparece 60 s despuÃ©s de caer.</p><p class="reward">'+q.reward+' EXP al regresar</p>',[['CONTINUAR',closeDialog]]);return;}showDialog('TEN Â· MODO HISTORIA Â· CAPÃTULO 1',q.completions?'Una Ãºltima patrulla':'Vilgax amenaza la ciudad','<p>Â«Oye, chico, quiero que me ayudes a enfrentarme a Vilgax. EstÃ¡ causando estragos por la ciudad y necesito a alguien que detenga a su robot. Â¿Aceptas?Â»</p><p>Recompensa: <b>'+Math.round(xpNeed()*.9)+' EXP</b>, el 90% de lo necesario para un nivel al aceptar. Sin requisito de raza.</p><p>'+ (q.completions?'Esta es la Ãºnica repeticiÃ³n disponible para tu raza.':'Una primera victoria y una sola repeticiÃ³n por raza.')+(near?'':' Habla con Ten en su habitaciÃ³n para aceptar.')+'</p>',[...(near?[['ACEPTAR MISIÃ“N',startStory]]:[]),['AHORA NO',closeDialog]]);}
function ensureRobot(){if(net.role==='guest'||zone!==11)return;let b=enemies.find(e=>e.robotBoss);if(b?.alive||player.robotTimer>0)return;const fresh={id:'vilgaxrobot',kind:'robot',robotBoss:true,x:1120,y:715,homeX:1120,homeY:715,hp:950,max:950,alive:true,face:-1,anim:0,moving:false,hit:0,stun:0,clawCD:2,laserCD:3,quakeCD:5,castData:null};if(b)Object.assign(b,fresh);else enemies.push(fresh);zoneStates[region().id]=enemies;}
function defeatRobot(b){if(!b.alive)return;b.alive=false;b.hp=0;b.castData=null;player.robotTimer=60;robotQuestKill();if(net.peer)lanSend({type:'robotKill',zone});burst(b.x,b.y-65,45,'#ffad76');effects.push({type:'robotscrap',x:b.x,y:b.y,r:120,t:1,max:1});toast(player.story.state==='return'?'Robot derrotado Â· Cobra la EXP con Ten':'Robot derrotado Â· Vuelve en 60 s Â· Ten ofrece su misiÃ³n de historia');save();}
function robotCast(b,type){const a=Math.atan2((teamTargets().sort((x,y)=>dist(x,b)-dist(y,b))[0]||player).y-b.y,(teamTargets().sort((x,y)=>dist(x,b)-dist(y,b))[0]||player).x-b.x),max=type==='claw'?1.1:type==='laser'?1.45:1.6;b.castData={type,t:max,max,a,hit:false};b[type==='claw'?'clawCD':type==='laser'?'laserCD':'quakeCD']=type==='claw'?4:type==='laser'?6:9;}
function updateRobot(dt){if(net.role==='guest')return;player.robotTimer=Math.max(0,player.robotTimer-dt);ensureRobot();if(zone!==11)return;const b=enemies.find(e=>e.robotBoss&&e.alive);if(!b||b.possessedTime>0)return;b.hit=Math.max(0,b.hit-dt);b.stun=Math.max(0,b.stun-dt);for(const k of ['clawCD','laserCD','quakeCD'])b[k]=Math.max(0,b[k]-dt);b.moving=false;if(b.castData){const f=b.castData;f.t-=dt;const release=f.type==='claw'?.43:f.type==='laser'?.5:.45;if(!f.hit&&f.t<=release){f.hit=true;for(const t of teamTargets()){const d=dist(t,b),a=Math.atan2(t.y-b.y,t.x-b.x),angle=Math.abs(Math.atan2(Math.sin(a-f.a),Math.cos(a-f.a)));if(lineClear(b.x,b.y,t.x,t.y)&&((f.type==='claw'&&d<145&&angle<1.05)||(f.type==='laser'&&d<550&&angle<.13)||(f.type==='quake'&&d<195)))hurtTeam(t,f.type==='claw'?14:f.type==='laser'?16:18);}effects.push({type:'robotimpact',x:b.x,y:b.y,a:f.a,r:f.type==='quake'?195:145,t:.5,max:.5,style:f.type});window.OmniSound?.play(f.type==='laser'?'crystal':'hit');shake=.18;}if(f.t<=0)b.castData=null;return;}if(b.stun>0)return;const target=teamTargets().sort((x,y)=>dist(x,b)-dist(y,b))[0],d=dist(b,target);b.face=target.x>=b.x?1:-1;if(d>750)return;if(d<145&&b.clawCD<=0)robotCast(b,'claw');else if(d<195&&b.quakeCD<=0)robotCast(b,'quake');else if(d<520&&b.laserCD<=0&&lineClear(b.x,b.y,target.x,target.y))robotCast(b,'laser');else if(d>100){moveActor(b,(target.x-b.x)/d*115*dt,(target.y-b.y)/d*115*dt);b.anim+=dt*6;b.moving=true;}}
function drawRobot(b){const f=b.castData,frame=f?(f.type==='claw'?(f.hit?4:3):f.type==='laser'?(f.hit?6:5):(f.hit?8:7)):b.hit>0?10:b.moving?1+Math.floor(b.anim)%2:0;sprite(28,frame,b.x,b.y,190,b.face,b.hit>0?.6:1);txt('ROBOT DE VILGAX Â· NV. 12',b.x,b.y-204,10,'#ffbf91');ctx.fillStyle='#25151b';ctx.fillRect(b.x-58,b.y-197,116,6);ctx.fillStyle='#fb8757';ctx.fillRect(b.x-58,b.y-197,116*Math.max(0,b.hp/b.max),6);if(f){ctx.save();ctx.translate(b.x,b.y);ctx.strokeStyle=f.hit?'#fff1b2':'#ff806e';ctx.fillStyle=f.hit?'#ff985f66':'#ed624522';ctx.lineWidth=f.hit?7:2;if(f.type==='quake'){ctx.beginPath();ctx.ellipse(0,0,195,80,0,0,Math.PI*2);ctx.fill();ctx.stroke();}else{ctx.rotate(f.a);if(f.type==='laser'){ctx.fillRect(20,-13,530,26);ctx.strokeRect(20,-13,530,26);if(f.hit){ctx.fillStyle='#fff5c8';ctx.fillRect(15,-5,535,10);}}else{ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,145,-1.05,1.05);ctx.closePath();ctx.fill();ctx.stroke();}}ctx.restore();if(!f.hit)txt(f.type==='claw'?'Â¡PINZAS!':f.type==='laser'?'Â¡RAYO!':'Â¡ALÃ‰JATE!',b.x,b.y-224,11,'#ffba9a');}}
function drawV8Effects(){for(const f of effects){if(f.type==='musicnotes')drawMusicEffect(f);if(f.type==='robotimpact'||f.type==='robotscrap'){ctx.strokeStyle=f.type==='robotscrap'?'#ffc892':'#ff8963';ctx.lineWidth=4;const p=1-f.t/f.max;ctx.beginPath();ctx.ellipse(f.x,f.y,Math.max(1,f.r*p),Math.max(1,f.r*.4*p),0,0,Math.PI*2);ctx.stroke();}}}
function hudV8(){if(zone===9||zone===11){const q=player.story;$('#mission .tiny').textContent='HISTORIA 01 Â· TEN';$('#questtext').textContent=q.state==='active'?'Derrota al robot de Vilgax':q.state==='return'?'Regresa con Ten':q.state==='complete'?'CapÃ­tulo completado':'Habla con Ten';$('#questsub').textContent=q.state==='active'?'Zona devastada Â· Sur del Barrio':q.state==='return'?q.reward+' EXP pendientes':'HabitaciÃ³n Â· Norte del Barrio';}if(zone===10){$('#mission .tiny').textContent='CONCIERTO Â· KIM TAEHYUNG';$('#questtext').textContent='Batalla de baile Â· RUN';$('#questsub').textContent='DifÃ­cil: skin musical de Cuatro Brazos';}if(zone===11){const b=enemies.find(e=>e.robotBoss&&e.alive);$('#bossbar').classList.remove('hidden');$('#bossbar').textContent=b?'ROBOT DE VILGAX Â· '+Math.ceil(b.hp)+' / 950':'ROBOT Â· REAPARECE EN '+Math.ceil(player.robotTimer)+' s';}}

const neko={x:1050,y:685,face:-1,row:29,name:'MAID NEKO'};
function initV9(){player.kitchen=Object.assign({orders:0,storyRead:false},player.kitchen||{});player.kitchen.orders=Math.max(0,Math.floor(Number(player.kitchen.orders)||0));}
function kitchenProgress(){return {orders:player.kitchen.orders,coins:player.coins};}
function nekoTalk(){const n=player.kitchen.orders,r=OmniCooking.rankOf(n),next=OmniCooking.ranks[r+1];showDialog('BELLWOOD Â· MAID NEKO','Bienvenido a mi cocina','<p>Â«AquÃ­ cada plato cuenta una historia. Â¿Quieres escuchar la mÃ­a o ponerte el delantal?Â»</p><p>Puesto: <b>'+OmniCooking.ranks[r].name+'</b> Â· '+n+' pedidos entregados.<br>'+(next?'PrÃ³ximo ascenso a los '+next.at+' pedidos: '+next.name+'.':'Â¡Has llegado a chef de Bellwood!')+'</p><p>Arrastra los ingredientes al plato siguiendo la comanda. Cada pedido correcto paga <b>10 monedas</b>. Puedes corregirlo sin penalizaciÃ³n y trabajar sin lÃ­mite de tiempo. Tus ascensos y monedas son independientes para cada raza.</p>',[['TRABAJAR EN COCINA',startCooking],['LA HISTORIA DE NEKO',()=>nekoStory(0)],['HASTA LUEGO',closeDialog]]);}
function nekoStory(page){const story=[['Un hogar en la bahÃ­a','Â«LleguÃ© desde el bosque con una maleta y el cuaderno de recetas de mi familia. Bellwood me abriÃ³ sus puertas: vivÃ­a en el pequeÃ±o cuarto sobre el restaurante y ayudaba a limpiar despuÃ©s del Ãºltimo cliente.Â»'],['La primera comanda','Â«Al principio quemaba las tostadas y confundÃ­a los pedidos. La antigua chef me enseÃ±Ã³ a escuchar, ordenar los ingredientes y probar cada receta. Mi primer sÃ¡ndwich perfecto fue para una vecina que venÃ­a sola todas las tardes.Â»'],['Mi propia cocina','Â«Con los aÃ±os pasÃ© de ayudante a cocinera y aprendÃ­ a dirigir el servicio. Ahora soy la chef de Bellwood. Quiero que la gente encuentre aquÃ­ el mismo hogar que encontrÃ© yo. Â¿Me ayudas con el siguiente pedido?Â»']];if(page===2){player.kitchen.storyRead=true;persistGame();}showDialog('MAID NEKO Â· SU HISTORIA Â· '+(page+1)+' / 3',story[page][0],'<p>'+story[page][1]+'</p>',[[page<2?'SEGUIR ESCUCHANDO':'VOLVER A LA COCINA',()=>page<2?nekoStory(page+1):nekoTalk()],['VOLVER',nekoTalk]]);}
function startCooking(){if(zone!==12||dist(player,neko)>145)return false;const workingRace=race;resetInput();dialogOpen=false;$('#modal').classList.add('hidden');paused=true;save();return OmniCooking.start({background:art.bellwood9,neko:art.neko9,food:art.food9,progress:kitchenProgress,onOrder:()=>{if(race!==workingRace||zone!==12||!OmniCooking.active)return;player.coins+=10;player.kitchen.orders++;persistGame();},onExit:()=>{paused=false;last=performance.now();resetInput();hud();save();}});}
function jobsMenu(){if(!ready)return;showDialog('VIAJE DIRECTO Â· DOS ACTIVIDADES','Minijuegos / Trabajos','<p>Viaja directamente frente al NPC. Conservas tu raza, nivel, vida y progreso.</p><div class="jobcards"><button id="jobfood"><strong>BELLWOOD</strong><p>Crea platos con ingredientes tÃ¡ctiles y asciende hasta chef.</p><small>10 monedas por pedido Â· '+OmniCooking.ranks[OmniCooking.rankOf(player.kitchen.orders)].name+'</small></button><button id="jobrhythm"><strong>CONCIERTO</strong><p>Batalla de baile con Kim Taehyung al ritmo de RUN.</p><small>Tres dificultades Â· skin en DifÃ­cil con Omnitrix</small></button></div>'+(net.role==='guest'?'<p>En multijugador, el anfitriÃ³n dirige los viajes. PÃ­dele que abra este menÃº para ir juntos.</p>':''),[['VOLVER',closeDialog]]);$('#jobfood').onclick=()=>travelToJob('food');$('#jobrhythm').onclick=()=>travelToJob('rhythm');}
function travelToJob(id){if(!ready||!['food','rhythm'].includes(id)||OmniCooking.active||OmniRhythm.active)return false;if(net.role==='guest'){toast('El anfitriÃ³n dirige los viajes; pÃ­dele que elija el destino');return false;}closeDialog();if(!started)$('#play').click();enterZone(id==='food'?12:10,'center');const n=id==='food'?neko:kim;player.x=n.x-115;player.y=n.y+18;cam.x=clamp(player.x-W*.48/sceneZoom(),0,cameraMaxX());cam.y=(zone===CITY21?cityCameraY22():clamp(player.y-H*.61/sceneZoom(),0,cameraMaxY()));hud();persistGame();toast('Habla con '+n.name+' para comenzar');return true;}
function drawBellwoodGate(){return;const x=1110,y=565;ctx.fillStyle='#174748';ctx.fillRect(x-82,y-31,164,28);ctx.strokeStyle='#f4d89d';ctx.strokeRect(x-82,y-31,164,28);txt('â†‘ BELLWOOD Â· COCINA',x,y-13,10,'#ffe6aa');}
function hudV9(){if(zone!==12)return;$('#mission .tiny').textContent='BELLWOOD Â· TRABAJO DE COCINA';$('#questtext').textContent=OmniCooking.ranks[OmniCooking.rankOf(player.kitchen.orders)].name+' Â· '+player.kitchen.orders+' pedidos';$('#questsub').textContent='Habla con Maid Neko Â· 10 monedas / pedido';}

function underwater(z=zone){return !!REGIONS[z]?.underwater;}
function healthFactor(o=player){return 1+clamp(o.vitality||0,0,25)*.1;}
function humanHP(){return Math.round(100*healthFactor())+(player.sixSuitEquipped80&&player.inventory28?.sixsix?300:player.suitEquipped28?150:0);}
function initV10(){player.vitality=clamp(Math.floor(Number(player.vitality)||0),0,25);player.oxygen=clamp(Number.isFinite(player.oxygen)?player.oxygen:45,0,45);player.waterGuard=0;player.aquaFrame=0;player.osmoWaterFrame=0;}
function tenHub(){showDialog('TEN Â· HISTORIA Y ENTRENAMIENTO','Â¿QuÃ© necesitas, chico?','<p>Â«Podemos seguir enfrentÃ¡ndonos a Vilgax o trabajar en tu resistencia.Â»</p><p>Entrenamiento de vitalidad: <b>nivel 30</b>, en forma humana/base. Cada mejora cuesta <b>110 monedas</b> y aÃ±ade <b>10 de vida humana</b>. MÃ¡ximo 25 por raza; tambiÃ©n aumenta proporcionalmente la vida de tus transformaciones.</p>',[['MODO HISTORIA',chaptersMenu],['MEJORAR VITALIDAD',vitalityMenu],['VOLVER',closeDialog]]);}
function canTrain(){return zone===9&&dist(player,ten)<=140&&player.level>=30&&(race==='osmo'?player.form==='human':!player.alien)&&player.vitality<25&&player.coins>=110;}
function buyVitality(){if(!canTrain())return false;const ratio=player.hp/maxHP();player.coins-=110;player.vitality++;player.hp=clamp(ratio*maxHP(),1,maxHP());persistGame();return true;}
function vitalityMenu(){const base=race==='osmo'?player.form==='human':!player.alien;showDialog('TEN Â· VITALIDAD Â· '+player.vitality+' / 25','MÃ¡s resistencia, paso a paso','<p>Vida humana: <b>'+humanHP()+'</b> Â· Multiplicador de vida: <b>Ã—'+healthFactor().toFixed(1)+'</b><br>Monedas: '+player.coins+' Â· Precio fijo: 110 por mejora.</p><p>Con todas las mejoras: humano 350, AcuÃ¡tico 875, Cuatro Brazos 1400. Las absorciones osmosianas reciben la misma proporciÃ³n. El daÃ±o sigue creciendo por nivel.</p><p>'+ (player.level<30?'Necesitas llegar al nivel 30 con esta raza.':!base?'Vuelve a tu forma humana/base para entrenar.':player.vitality>=25?'Ya tienes las 25 mejoras de esta raza.':player.coins<110?'Necesitas 110 monedas.':'Siguiente mejora: '+(humanHP()+10)+' de vida humana. Conservas tu porcentaje de vida al comprar.')+'</p>',[...(canTrain()?[['COMPRAR Â· 110 MONEDAS',()=>{buyVitality();vitalityMenu();}]]:[]),['VOLVER',tenHub]]);}
function oceanSpeed(){if(extinguished())return 85;if(race==='osmo')return player.form==='water'?255:player.form==='stone'?105:145;if(player.alien)return player.activeAlien==='aquatic'?325:Math.min(245,SPEEDS[player.activeAlien]*.72);return 145;}
function canBreathe(){return race==='osmo'?player.form==='water':player.alien;}
function regenRate(){return .0125+(player.alien&&player.activeAlien==='aquatic'&&player.masteries.aquatic>=40?.0025:0);}
function updateVitality(dt){const wait=player.regenWait;player.regenWait=Math.max(0,wait-dt);const active=Math.max(0,dt-wait);if(active>0&&(!underwater()||canBreathe()||player.oxygen>0))player.hp=Math.min(maxHP(),player.hp+maxHP()*regenRate()*active);}
function updateOcean(dt){player.waterGuard=Math.max(0,(player.waterGuard||0)-dt);if(!underwater())player.oxygen=Math.min(45,player.oxygen+dt*9);else if(canBreathe())player.oxygen=Math.min(45,player.oxygen+dt*6);else{player.oxygen=Math.max(0,player.oxygen-dt);if(player.oxygen<=0){player.regenWait=12;player.hp-=maxHP()*.04*dt;if(player.hp<=0){defeat();return true;}}}for(const f of effects){if(f.type==='hydro'||f.type==='maelstrom'){f.tick-=dt;if(f.tick<=0&&f.pulses<f.limit){f.tick+=.45;f.pulses++;areaHit(f.x,f.y,f.r,f.damage,.1);for(const e of enemies)if(e.alive&&dist(e,f)<f.r&&lineClear(e.x,e.y,f.x,f.y))moveActor(e,(f.x-e.x)*.08,(f.y-e.y)*.08);}}}return false;}
function aquaticAttack(i){const s=ALIENS.aquatic.skills[i];if(!unlockedSkill('aquatic',i)){toast(i<4?'Requiere maestrÃ­a '+s.unlock:'Aprende esta habilidad por 3 puntos');return;}if(i===2){player.cool[i]=1;player.aquaFrame=6;player.attack=.7;toast('Humedad pasiva: regeneraciÃ³n +0,25%/s fuera de combate y daÃ±o recibido âˆ’10% bajo el agua');return;}player.cool[i]=s.cd;player.attack=i===1||i===4?1:.55;player.aquaFrame=[4,5,6,7,8,9][i];const target=nearest(550),a=target?Math.atan2(target.y-player.y,target.x-player.x):Math.atan2(player.dy,player.dx),d=s.damage*multiplier()*(underwater()?1.25:1);player.face=Math.cos(a)>=0?1:-1;const at=target||{x:player.x+Math.cos(a)*150,y:player.y+Math.sin(a)*100};if(i===0)for(let n=-1;n<=1;n++)shoot('water',a+n*.09,d,520);if(i===1||i===4)effects.push({type:i===1?'hydro':'maelstrom',x:at.x,y:at.y,r:i===1?145:185,t:i===1?2:2.6,max:i===1?2:2.6,tick:0,pulses:0,limit:i===1?4:5,damage:d});if(i===3){castArea('waterwave',player.x,player.y,160,d,.7,'#8ceaff');shake=.16;}if(i===5){shoot('waterlance',a,d,700);projectiles.at(-1).r=20;effects.push({type:'waterwave',x:player.x,y:player.y,r:105,t:.4,max:.4});}window.OmniSound?.play('crystal');}
function waterOsmoAttack(i){const s=OSMO_SKILLS.water[i];if(!unlockedSkill('osmo',i)){toast(i<4?'Requiere maestrÃ­a '+s.unlock:'Aprende la habilidad en el Ã¡rbol');return;}player.cool[i]=s.cd;player.attack=.6;player.osmoWaterFrame=3+i;const t=nearest(480),a=t?Math.atan2(t.y-player.y,t.x-player.x):Math.atan2(player.dy,player.dx),d=s.damage*multiplier()*(underwater()?1.15:1);player.face=Math.cos(a)>=0?1:-1;if(i===0){const near=nearest(110);if(near)damageTarget(near,d);effects.push({type:'waterwave',x:player.x+Math.cos(a)*40,y:player.y-35,r:50,t:.4,max:.4});}if(i===1||i===5){shoot(i===5?'waterlance':'water',a,d,i===5?650:470);}if(i===2){player.waterGuard=8;toast('Barrera acuosa Â· âˆ’35% daÃ±o durante 8 s');}if(i===3)castArea('waterwave',player.x,player.y,170,d,.8,'#a2f8ff');if(i===4)effects.push({type:'hydro',x:t?.x||player.x,y:t?.y||player.y,r:160,t:2,max:2,tick:0,pulses:0,limit:4,damage:d});window.OmniSound?.play('crystal');}
function seedSeaEnemies(){const depth=zone-13;enemies=region().spawns.map(([x,y],i)=>{const type=i%2?'predator':'manta',max=Math.round((type==='manta'?900:1250)*(1+depth*.15));return {id:'sea'+zone+'_'+i,kind:'sea',sea:true,seaType:type,x,y,homeX:x,homeY:y,hp:max,max,alive:true,face:-1,anim:0,moving:false,hit:0,stun:0,cd:2+i,wind:0,respawn:0,level:30+depth*2,reward:(type==='manta'?240:340)+depth*60,damage:Math.round((type==='manta'?34:48)*(1+depth*.12))};});zoneStates[region().id]=enemies;}
function seaDeath(e){e.alive=false;e.respawn=50;e.hp=0;e.wind=0;xp(scaledSeaXP(e));burst(e.x,e.y-45,25,'#b0f6eb');save();}
function updateSeaEnemy(e,dt){e.hit=Math.max(0,e.hit-dt);e.stun=Math.max(0,e.stun-dt);e.cd=Math.max(0,e.cd-dt);e.moving=false;if(!e.alive){e.respawn-=dt;if(e.respawn<=0)Object.assign(e,{alive:true,hp:e.max,x:e.homeX,y:e.homeY,cd:2,wind:0});return;}if(e.stun>0)return;const t=teamTargets().sort((a,b)=>dist(e,a)-dist(e,b))[0],d=dist(e,t);e.face=t.x>=e.x?1:-1;if(e.wind>0){e.wind-=dt;if(e.wind<=0){if(e.seaType==='manta')hostileShots.push({type:'seabolt',x:e.x,y:e.y-35,dx:Math.cos(e.aim)*285,dy:Math.sin(e.aim)*285,t:2.2,r:12,damage:e.damage});else for(const target of teamTargets()){const angle=Math.atan2(target.y-e.y,target.x-e.x);if(dist(e,target)<135&&Math.abs(Math.atan2(Math.sin(angle-e.aim),Math.cos(angle-e.aim)))<1.0&&lineClear(e.x,e.y,target.x,target.y))hurtTeam(target,e.damage);}e.cast=.35;}return;}e.cast=Math.max(0,(e.cast||0)-dt);if(d>620)return;const range=e.seaType==='manta'?365:115;if(d<range&&e.cd<=0&&lineClear(e.x,e.y,t.x,t.y)){e.aim=Math.atan2(t.y-e.y,t.x-e.x);e.wind=e.seaType==='manta'?.85:.7;e.cd=e.seaType==='manta'?4:3.2;}else if(d>range*.7){const speed=(e.seaType==='manta'?105:145)*(e.slow>0?.6:1);moveActor(e,(t.x-e.x)/Math.max(1,d)*speed*dt,(t.y-e.y)/Math.max(1,d)*speed*dt);e.anim+=dt*5;e.moving=true;}}
function drawSeaEnemy(e){const frame=e.wind>0||e.cast>0?3:e.moving?1+Math.floor(e.anim)%2:0;const row=e.seaType==='manta'?37:38;sprite(row,frame,e.x,e.y,95,e.face,e.hit>0?.55:1);txt((e.seaType==='manta'?'MANTA ABISAL':'DEPREDADOR')+' Â· NV.'+e.level,e.x,e.y-108,9,'#ffe2b0');ctx.fillStyle='#102636';ctx.fillRect(e.x-42,e.y-101,84,5);ctx.fillStyle='#df90b1';ctx.fillRect(e.x-42,e.y-101,84*e.hp/e.max,5);if(e.wind>0){txt(e.seaType==='manta'?'Â¡PROYECTIL!':'Â¡MORDIDA!',e.x,e.y-125,10,'#ffc27f');ctx.strokeStyle='#ffb994';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(e.x,e.y-35);ctx.lineTo(e.x+Math.cos(e.aim)*(e.seaType==='manta'?290:135),e.y-35+Math.sin(e.aim)*(e.seaType==='manta'?290:135));ctx.stroke();}}
function aquaticPose(o){return {row:underwater()?31:30,f:o.attack>0?(o.attack<.12?11:o.attack>.48&&o.attack<.6?3:o.aquaFrame||4):o.moving?1+walkFrame166(o,2,Math.floor(o.anim)%2):0,lift:underwater()?Math.sin(clock*3)*4:0};}
function drawUnderwaterHuman(o,x,y,face){const row=o.race==='osmo'||o===player&&race==='osmo'?36:33+(o.skin||0),frame=o.attack>0?3:o.moving?1+walkFrame166(o,2,Math.floor(o.anim)%2):0;sprite(row,frame,x,y,76,face,o.inv>0?.65:1);}
function drawWaterOsmo(o,x,y,face){let frame=o.attack>0?o.osmoWaterFrame||3:underwater()?(o.moving?10+walkFrame166(o,2,Math.floor(o.anim)%2):9):o.moving?1+walkFrame166(o,2,Math.floor(o.anim)%2):0;sprite(32,frame,x,y,125,face,o.inv>0?.65:1);}
function drawOceanEffects(){if(underwater()){for(let i=0;i<30;i++){const x=(i*179+Math.sin(clock*.5+i)*12)%1600,y=900-((clock*25+i*79)%800);ctx.strokeStyle='#a7f5ff50';ctx.lineWidth=1;ctx.strokeRect(x,y,3+i%3,3+i%3);}}for(const f of effects){if(['hydro','maelstrom','waterwave'].includes(f.type)){ctx.strokeStyle=f.type==='maelstrom'?'#69bbff':'#a5f7ff';ctx.lineWidth=4;for(let i=0;i<4;i++){ctx.beginPath();const p=1-f.t/f.max;ctx.ellipse(f.x,f.y-15-i*14,Math.max(1,f.r*(f.type==='waterwave'?p:.7-i*.1)),20+i*8,0,clock*5+i,clock*5+i+Math.PI*1.6);ctx.stroke();}}}if(player.waterGuard>0){ctx.strokeStyle='#a2f9ffe0';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(player.x,player.y-60,50,72,Math.sin(clock*4)*.1,0,Math.PI*2);ctx.stroke();}}
function hudV10(){const wet=underwater();$('#oxygen').classList.toggle('hidden',!wet);if(wet){$('#oxygenfill').style.width=player.oxygen/45*100+'%';$('#oxygentext').textContent=canBreathe()?'RESPIRACIÃ“N SEGURA':player.oxygen>0?'OXÃGENO Â· '+Math.ceil(player.oxygen)+' s':'Â¡SIN OXÃGENO! TRANSFÃ“RMATE';$('#oxygen').classList.toggle('danger',!canBreathe()&&player.oxygen<10);$('#jump').classList.add('hidden');$('#clock').textContent=region().name.toUpperCase()+' Â· NIVEL '+(30+(zone-13)*2);}
if(player.alien&&player.activeAlien==='aquatic'){const b=document.querySelector('[data-skill="2"]');if(b){b.querySelector('span').textContent='HUMEDAD';b.querySelector('small').textContent=mastery()>=40?'PASIVA':'M40';}$('#batteryhint').textContent=(wet?'ALETA Â· +25% DAÃ‘O Â· ':'')+Math.ceil(player.battery*1.2)+' s';}if(race==='osmo'&&player.form==='water')$('#transformhint').textContent='AGUA Â· RESPIRA BAJO EL MAR';}

function initV11(){player.wolfDNA=!!player.wolfDNA;player.wolfTimer=Math.max(0,Number(player.wolfTimer)||0);player.wolfDash=null;player.wolfGrab=null;player.wolfFrame=0;}
function wolfUnlocked(){return race==='omni'&&player.level>=30&&player.wolfDNA;}
function scaledSeaXP(e,level=net.source==='guest'?net.remote?.level||1:player.level){return Math.floor(e.reward*Math.min(1,Math.pow(Math.max(1,level)/e.level,2)));}
function extinguished(){return underwater()&&race==='omni'&&player.alien&&player.activeAlien==='heatblast';}
function coldAttack(i){if(i!==0){toast('Fuego apagado: solo puedes golpear dÃ©bilmente bajo el agua');return;}player.cool[0]=1;player.attack=.4;const t=nearest(100);if(t)damageTarget(t,5*multiplier());effects.push({type:'punch',x:player.x+player.face*35,y:player.y-35,r:25,t:.3,max:.3});}
function swimAlienPose(o){let id=o.activeAlien,k={heatblast:41,diamond:42,fourarms:43,xlr8:44,bestia:45,insect:46,wolf:48}[id];if(id==='fourarms'&&hasMusicSkin(o))k=47;return k?{row:k,f:o.wolfDash?1+Math.floor(clock*12)%2:o.attack>0?3:o.moving?1+walkFrame166(o,2,Math.floor(o.anim)%2):0,lift:Math.sin(clock*3)*3}:null;}
function wolfPose(o){return {row:40,f:o.wolfDash?8+Math.floor(clock*12)%2:o.attack>0?(o.attack>.5?3:o.wolfFrame||5):o.moving?1+walkFrame166(o,2,Math.floor(o.anim)%2):0,lift:0};}
function wolfAttack(i){const s=ALIENS.wolf.skills[i];if(!unlockedSkill('wolf',i)){toast(i<4?'Requiere maestrÃ­a '+s.unlock:'Desbloquea por 3 puntos');return;}player.cool[i]=s.cd;player.attack=.65;player.wolfFrame=[5,4,8,6,10,11][i];const t=nearest(i===3?115:480),a=t?Math.atan2(t.y-player.y,t.x-player.x):Math.atan2(player.dy,player.dx),d=s.damage*multiplier();player.face=Math.cos(a)>=0?1:-1;
 if(i===0){if(t&&dist(player,t)<115)damageTarget(t,d,.12);effects.push({type:'wolfslash',x:player.x,y:player.y,a,r:110,t:.4,max:.4});}
 if(i===1){effects.push({type:'sonic',x:player.x,y:player.y-40,a,r:300,t:.65,max:.65});for(const e of combatants())if(e.alive&&dist(player,e)<300&&lineClear(player.x,player.y,e.x,e.y)&&Math.abs(Math.atan2(Math.sin(Math.atan2(e.y-player.y,e.x-player.x)-a),Math.cos(Math.atan2(e.y-player.y,e.x-player.x)-a)))<.7)damageTarget(e,d,.35);}
 if(i===2){player.wolfDash={t:1.15,a,damage:d,hits:[]};}
 if(i===3){if(!t){toast('AcÃ©rcate a un enemigo para sujetarlo');player.cool[i]=1;return;}if(t.ghostBoss||t.chapter2||t.majorBoss||t.robotBoss||t.wolfBoss||t.kind==='remote'){damageTarget(t,d*.5,.2);player.wolfFrame=7;toast('Demasiado pesado: golpe de empuje');}else{player.wolfGrab={id:t.id,kind:t.kind,t:.45,a,damage:d};damageTarget(t,0,.65);}}
 if(i===4){areaHit(player.x,player.y,155,d,.25);effects.push({type:'wolfslash',x:player.x,y:player.y,a,r:155,t:.7,max:.7});}
 if(i===5)effects.push({type:'wolfpulse',x:player.x,y:player.y,r:210,damage:d,pulses:0,tick:0,t:1.5,max:1.5});tone(140,.25,'triangle');}
function ensureWolf(){if(zone!==17||net.role==='guest')return;let b=enemies.find(e=>e.wolfBoss);if(b?.alive||player.wolfTimer>0)return;const e={id:'blitztwolfer-boss',kind:'wolfboss',wolfBoss:true,level:30,x:1110,y:705,homeX:1110,homeY:705,hp:3600,max:3600,alive:true,face:-1,anim:0,moving:false,hit:0,stun:0,cast:0,wind:0,frame:0,clawCD:2,howlCD:3,pounceCD:6,quakeCD:9};if(b)Object.assign(b,e);else enemies.push(e);zoneStates[region().id]=enemies;}
function grantWolfDNA(){if(race!=='omni'||player.level<30)return false;player.wolfDNA=true;toast('Â¡ADN DE BLITZTWOLFER OBTENIDO! Disponible en el dial');save();return true;}
function wolfReward(b,roll=Math.random()){if(!b.alive)return;b.alive=false;b.hp=0;player.wolfTimer=60;const source=net.source==='guest'?net.remote:player,sourceRace=net.source==='guest'?net.remote?.race:race,eligible=source.level>=30;const drop=eligible&&sourceRace==='omni'&&roll<.2;if(eligible)xp(900);else if(net.source!=='guest')toast('Recompensas de Blitztwolfer: necesitas nivel 30');if(drop){if(net.source==='guest')lanSend({type:'wolfDNA'});else grantWolfDNA();}else if(eligible&&sourceRace==='omni'&&net.source!=='guest')toast('Blitztwolfer derrotado Â· 900 EXP Â· Sin ADN esta vez');burst(b.x,b.y-60,45,'#a5daec');save();}
function updateWolfBoss(dt){if(net.role==='guest')return;player.wolfTimer=Math.max(0,player.wolfTimer-dt);ensureWolf();if(zone!==17)return;const b=enemies.find(e=>e.wolfBoss&&e.alive);if(!b||b.possessedTime>0)return;b.hit=Math.max(0,b.hit-dt);b.stun=Math.max(0,b.stun-dt);b.cast=Math.max(0,b.cast-dt);for(const k of ['clawCD','howlCD','pounceCD','quakeCD'])b[k]=Math.max(0,b[k]-dt);b.moving=false;if(b.stun>0||b.cast>0)return;
 if(b.wind>0){b.wind-=dt;if(b.wind<=0){if(b.action==='pounce')moveActor(b,b.tx-b.x,b.ty-b.y);const range={claw:125,howl:315,pounce:135,quake:210}[b.action],dmg={claw:48,howl:64,pounce:76,quake:85}[b.action];for(const t of teamTargets()){const angle=Math.atan2(t.y-b.y,t.x-b.x),cone=b.action==='claw'||b.action==='howl';if(dist(t,b)<range&&lineClear(b.x,b.y,t.x,t.y)&&(!cone||Math.abs(Math.atan2(Math.sin(angle-b.aim),Math.cos(angle-b.aim)))<.75))hurtTeam(t,dmg);}b.frame={claw:5,howl:4,pounce:11,quake:11}[b.action];b.cast=.55;effects.push({type:b.action==='howl'?'sonic':'wolfslash',x:b.x,y:b.y-35,a:b.aim,r:range,t:.6,max:.6});}return;}
 const t=teamTargets().sort((a,c)=>dist(a,b)-dist(c,b))[0],d=dist(b,t);b.face=t.x>=b.x?1:-1;if(d>700){if(dist(b,{x:b.homeX,y:b.homeY})>10){const len=Math.hypot(b.homeX-b.x,b.homeY-b.y);moveActor(b,(b.homeX-b.x)/len*130*dt,(b.homeY-b.y)/len*130*dt);b.moving=true;b.anim+=dt*7;}return;}const a=Math.atan2(t.y-b.y,t.x-b.x);let action=null;if(d<210&&b.quakeCD<=0){action='quake';b.quakeCD=11;}else if(d<120&&b.clawCD<=0){action='claw';b.clawCD=2.8;}else if(d<320&&b.howlCD<=0){action='howl';b.howlCD=6;}else if(d>150&&d<490&&b.pounceCD<=0){action='pounce';b.pounceCD=8;}if(action&&lineClear(b.x,b.y,t.x,t.y)){b.action=action;b.aim=a;b.tx=t.x;b.ty=t.y;b.wind=action==='claw'?.6:action==='howl'?.95:1.2;b.frame=action==='pounce'?14:15;}else if(d>90){moveActor(b,(t.x-b.x)/d*155*dt,(t.y-b.y)/d*155*dt);b.anim+=dt*8;b.moving=true;}}
function updateV11(dt){updateWolfBoss(dt);if(player.wolfDash){const q=player.wolfDash;q.t-=dt;moveActor(player,Math.cos(q.a)*(underwater()?270:500)*dt,Math.sin(q.a)*(underwater()?270:500)*dt);player.attack=.3;player.wolfFrame=8+Math.floor(clock*12)%2;for(const e of combatants())if(e.alive&&dist(e,player)<90&&!q.hits.includes(e.kind+e.id)){q.hits.push(e.kind+e.id);damageTarget(e,q.damage,.25);}if(q.t<=0)player.wolfDash=null;}
 if(player.wolfGrab){const q=player.wolfGrab;q.t-=dt;const e=combatants().find(e=>e.id===q.id&&e.kind===q.kind&&e.alive);if(e){if(net.role!=='guest'){moveActor(e,player.x+player.face*45-e.x,player.y-e.y);}if(q.t<=0){if(net.role==='guest')lanSend({type:'wolfThrow',zone,id:e.id,kind:e.kind,a:q.a,damage:q.damage,seq:++net.seq});else performThrow(e,q.a,q.damage);player.wolfFrame=7;player.attack=.45;}}if(q.t<=0||!e)player.wolfGrab=null;}
 for(const e of effects)if(e.type==='wolfpulse'){e.tick-=dt;if(e.tick<=0&&e.pulses<3){e.tick+=.45;e.pulses++;areaHit(e.x,e.y,e.r,e.damage,.15);}}}
function performThrow(e,a,d){moveActor(e,Math.cos(a)*200,Math.sin(a)*200);damageTarget(e,d,.6);effects.push({type:'wolfslash',x:e.x,y:e.y,r:100,a,t:.5,max:.5});}
function drawWolf(b){const f=b.wind>0||b.cast>0?b.frame:b.moving?1+Math.floor(b.anim)%2:0;const leap=b.wind>0&&b.action==='pounce'?clamp(1-b.wind/.4,0,1):0;const sx=b.x+(b.tx-b.x||0)*leap,sy=b.y+(b.ty-b.y||0)*leap-Math.sin(leap*Math.PI)*110;sprite(40,f,sx,sy,169,b.face,b.hit>0?.6:1);txt('BLITZTWOLFER Â· NV.30',b.x,b.y-185,11,'#c8eaff');if(b.wind>0){const pounce=b.action==='pounce';ctx.strokeStyle='#ffb28c';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(pounce?b.tx:b.x,pounce?b.ty:b.y,pounce?135:b.action==='quake'?210:110,50,0,0,Math.PI*2);ctx.stroke();txt(({claw:'Â¡GARRAS!',howl:'Â¡AULLIDO!',pounce:'Â¡SALTO!',quake:'Â¡ALÃ‰JATE!'})[b.action],b.x,b.y-205,12,'#ffd2ad');}}
function drawV11Effects(){for(const f of effects)if(f.type==='wolfslash'||f.type==='wolfpulse'){ctx.strokeStyle='#c5f4ff';ctx.lineWidth=3;for(let i=0;i<3;i++){ctx.beginPath();const r=Math.max(1,f.r*(1-f.t/f.max)-i*13);if(f.type==='wolfpulse')ctx.ellipse(f.x,f.y-20,r,r*.48,0,0,Math.PI*2);else ctx.arc(f.x,f.y-40,r,(f.a||0)-1,(f.a||0)+1);ctx.stroke();}}}
function hudV11(){const b=enemies.find(e=>e.wolfBoss&&e.alive),near=zone===17&&b&&dist(player,b)<600;$('#wolfbar').classList.toggle('hidden',!near);if(near){$('#wolfbar').style.background='linear-gradient(90deg,#365e73 '+(100*b.hp/b.max)+'%,#152637 '+(100*b.hp/b.max)+'%)';}if(near)$('#wolfbar').textContent='BLITZTWOLFER Â· NV.30 Â· '+Math.ceil(b.hp)+' / 3600 Â· ADN 20% (OMNITRIX NV.30+)';if(zone===17&&!b)$('#questsub').textContent='Blitztwolfer reaparece en '+Math.ceil(player.wolfTimer)+' s';if(race==='omni'&&!player.alien&&player.selected==='wolf'&&!wolfUnlocked()){$('#transformhint').textContent=player.level<30?'BLOQUEADO Â· NIVEL 30 + ADN':'BLOQUEADO Â· CONSIGUE SU ADN';$('#transform').classList.add('unavailable');$('#dialmastery').textContent=player.wolfDNA?'ADN OBTENIDO':'ADN: JEFE Â· 20%';}if(extinguished()){$('#form').textContent='FUEGO APAGADO';$('#batteryhint').textContent='SIN LLAMA Â· SOLO PUÃ‘O DÃ‰BIL';document.querySelectorAll('.attack').forEach(b=>{const i=+b.dataset.skill;b.querySelector('span').textContent=i===0?'PUÃ‘O DÃ‰BIL':'APAGADO';b.classList.toggle('locked',i!==0);});}if(underwater()){$('#questsub').textContent='EXP por nivel Â· '+Math.round(Math.min(1,(player.level/(30+(zone-13)*2))**2)*100)+'% Â· completa al igualar al enemigo';}}

// OMNI 0.14: cosmetic unlocks, Hex chapter and viewport cinematics.
function initV14(){player.story3=Object.assign({state:'new',reward:0},player.story3||{});if(!['new','active','return','complete'].includes(player.story3.state))player.story3.state='new';player.ghostDropReceipts=Array.isArray(player.ghostDropReceipts)?player.ghostDropReceipts.slice(-30):[];player.alienSkins=Object.assign({ghost:'classic',heatblast:'classic'},player.alienSkins||{});player.unlockedAlienSkins=Object.assign({ghostLady:false,pinkFire:false},player.unlockedAlienSkins||{});if(!player.unlockedAlienSkins.ghostLady)player.alienSkins.ghost='classic';if(!player.unlockedAlienSkins.pinkFire)player.alienSkins.heatblast='classic';}
function hasPinkSkin(o=player){return o.alien&&o.activeAlien==='heatblast'&&o.alienSkins?.heatblast==='pink';}
function hasGhostLady(o=player){return o.alien&&o.activeAlien==='ghost'&&o.alienSkins?.ghost==='lady'&&(o===player?race==='omni':o.race!=='osmo');}
function buyPinkSkin(){if(race!=='omni'||player.unlockedAlienSkins.pinkFire||player.coins<500)return false;player.coins-=500;player.unlockedAlienSkins.pinkFire=true;player.alienSkins.heatblast='pink';save();return true;}
function selectAlienSkin(id,alienId='fourarms'){if(race!=='omni')return false;const allowed={fourarms:['classic','concert'],ghost:['classic','lady'],heatblast:['classic','pink']};if(!allowed[alienId]?.includes(id))return false;if(id==='concert'&&!player.unlockedAlienSkins.fourarmsConcert||id==='lady'&&!player.unlockedAlienSkins.ghostLady||id==='pink'&&!player.unlockedAlienSkins.pinkFire)return false;player.alienSkins[alienId]=id;save();return true;}
function alienSkinMenu(selected='fourarms'){if(race!=='omni'){toast('Skins exclusivas de usuarios del Omnitrix');return;}if(typeof selected!=='string')selected='fourarms';const options={fourarms:[['classic','ClÃ¡sico',5,true],['concert','Traje de concierto',26,player.unlockedAlienSkins.fourarmsConcert]],ghost:[['classic','ClÃ¡sico',70,true],['lady','Ghost Lady',74,player.unlockedAlienSkins.ghostLady]],heatblast:[['classic','ClÃ¡sico',1,true],['pink','Fuego rosa',75,player.unlockedAlienSkins.pinkFire]]};const info=selected==='ghost'?'Ghost Lady: 10% por victoria contra el jefe FantasmÃ¡tico de nivel 20. Reaparece en 60 s. Es una tirada independiente: diez victorias no garantizan el premio. Requiere obtener el ADN para usar el alien.':selected==='heatblast'?'Fuego rosa: 500 monedas, una sola compra. Poses, llamas y efectos propios; mismos ataques, daÃ±o, vida y maestrÃ­a.':'Traje de concierto: gana la batalla de baile en fÃ¡cil. Conserva el mismo poder.';showDialog('APARIENCIA Â· MISMO PODER','Skins de aliens','<div class="skin-tabs">'+['fourarms','ghost','heatblast'].map(id=>'<button data-skin-tab="'+id+'">'+ALIENS[id].name+'</button>').join('')+'</div><p>'+info+'</p><div class="alien-skin-cards">'+options[selected].map(([id,n,row,owned])=>'<button data-skin-choice="'+id+'" class="'+(player.alienSkins[selected]===id?'active':'')+'"><canvas width="150" height="170"></canvas><b>'+n+'</b><small>'+(owned?player.alienSkins[selected]===id?'EQUIPADA':'EQUIPAR':selected==='heatblast'?'COMPRAR Â· 500 MONEDAS':selected==='ghost'?'DROP Â· 10%':'GANA EN DIFÃCIL')+'</small></button>').join('')+'</div><p>Monedas: '+player.coins+' Â· Solo cambia la apariencia.</p>',[['LISTO',closeDialog]]);document.querySelectorAll('[data-skin-tab]').forEach(b=>b.onclick=()=>alienSkinMenu(b.dataset.skinTab));for(const b of document.querySelectorAll('[data-skin-choice]')){const id=b.dataset.skinChoice,o=options[selected].find(o=>o[0]===id),{table,sheet}=spriteInfo(o[2]),f=table[0],c=b.querySelector('canvas').getContext('2d'),h=148,w=f[2]/f[3]*h;c.imageSmoothingEnabled=false;c.drawImage(sheet,...f,(150-w)/2,10,w,h);b.onclick=()=>{if(!o[3]&&selected==='heatblast'){showDialog('SKIN EXCLUSIVA Â· HEATBLAST','Comprar Fuego rosa','<p>Precio: 500 monedas. Saldo:'+player.coins+'. No modifica el poder ni consume puntos.</p>',[['COMPRAR Â· 500',()=>{if(buyPinkSkin())alienSkinMenu('heatblast');else toast('Necesitas 500 monedas o ya tienes esta skin');}],['VOLVER',()=>alienSkinMenu('heatblast')]]);}else if(selectAlienSkin(id,selected))alienSkinMenu(selected);else toast(selected==='ghost'?'Derrota al jefe del hospital Â· drop 10%':'Gana el concierto en difÃ­cil');};}}
function ghostSkinReward(token,won){if(race!=='omni'||player.level<20||player.ghostDropReceipts.includes(token))return false;player.ghostDropReceipts.push(token);player.ghostDropReceipts=player.ghostDropReceipts.slice(-30);if(won&&!player.unlockedAlienSkins.ghostLady){player.unlockedAlienSkins.ghostLady=true;toast('Â¡SKIN GHOST LADY! EquÃ­pala en Skins de aliens');}save();return !!won;}
function rollGhostSkin(){const token=String(Date.now())+'-'+Math.random().toString(36).slice(2,9);if(race==='omni'&&player.level>=20)ghostSkinReward(token,Math.random()<.10);for(const o of remoteTargets())if(o.race==='omni'&&o.level>=20)lanSend({type:'ghostSkin',zone:22,token,won:Math.random()<.10,to:o.id});}
function pinkPose(o){if(underwater())return {row:75,f:o.moving?10+walkFrame166(o,2,Math.floor(o.anim)%2):10,lift:0};const c=o.cast;return {row:75,f:c?[5,4,8,7,3,6][c.i]:(o.attack>0?3:o.moving?1+walkFrame166(o,2,Math.floor(o.anim)%2):0),lift:0};}
function attack(i){const p=projectiles.length,f=effects.length,n=particles.length;attackBase14(i);if(hasPinkSkin()&&!extinguished()){for(const o of projectiles.slice(p))o.pink=true;for(const o of effects.slice(f)){o.pink=true;o.color='#ff78de';}for(const o of particles.slice(n))o.color='#ff89e2';}}
function canStartStory3(){return player.level>=30&&player.story2.state==='complete'&&player.story3.state==='new'&&zone===9&&dist(player,ten)<140;}
function startStory3(){if(!canStartStory3())return false;player.story3={state:'active',reward:Math.floor(xpNeed()*.5)};if(!net.peer)delete zoneStates.magicSchool;closeDialog();toast('CapÃ­tulo 3: Escuela Arcana Â· derecha del SalÃ³n de la Fortaleza');save();return true;}
function story3Kill(){if(player.level<30||player.story3.state!=='active')return false;player.story3.state='return';save();toast('Â¡Ritual de Hex interrumpido! Regresa con Ten');return true;}
function claimStory3(){const q=player.story3;if(q.state!=='return'||zone!==9||dist(player,ten)>140)return false;const reward=q.reward;q.state='complete';q.reward=0;xp(reward);save();closeDialog();toast('CapÃ­tulo 3 completado Â· '+reward+' EXP');return true;}
function story3Talk(){const q=player.story3,text=q.state==='complete'?'Â«Hex ha perdido el control de la escuela. El grimorio estÃ¡ a salvo. Gracias; te avisarÃ© cuando aparezca otra amenaza.Â»':q.state==='return'?'Â«Las runas se apagaron. Le arrebataste a Hex el control del ritual; ahora podemos proteger el grimorio.Â»':q.state==='active'?'Â«La Escuela Arcana estÃ¡ a la derecha del SalÃ³n de la Fortaleza. Cuando Hex levante su escudo, espera cinco segundos y esquiva. Ataca al caer la barrera.Â»':'Â«Hex es un hechicero que canaliza su magia con un bastÃ³n. En el pasado buscÃ³ un grimorio y el poder de los Amuletos de Bezel. Ahora ha ocupado nuestra escuela para alimentar un nuevo ritual. Necesito que lo detengas antes de que las runas se extiendan por Bellwood. Â¿Me ayudas?Â»';showDialog('TEN Â· HISTORIA 03 Â· NIVEL 30','El sello de la Escuela Arcana','<p>'+text+'</p><p>Completa el capÃ­tulo 2 y llega a nivel 30. Una misiÃ³n y recompensa por raza.</p>'+(q.state==='complete'?'':'<p class="reward">'+(q.reward||Math.floor(xpNeed()*.5))+' EXP: 50% de un nivel, fijado al aceptar. Vuelve con Ten para cobrar.</p>'),[...(canStartStory3()?[['ACEPTAR',startStory3]]:[]),...(q.state==='return'&&zone===9&&dist(player,ten)<140?[['COBRAR',claimStory3]]:[]),['VOLVER',closeDialog]]);}
function ensureHex(){if(zone!==23||net.role==='guest'||enemies.some(e=>e.hexBoss))return;enemies.push({id:'hex-boss',kind:'hex',hexBoss:true,level:30,x:1120,y:760,homeX:1120,homeY:760,hp:4800,max:4800,alive:true,face:-1,anim:0,moving:false,hit:0,stun:0,cd:2,boltCD:4,runeCD:8,shieldCD:12,shield:0,castData:null,respawn:0});zoneStates.magicSchool=enemies;}
function damageHex(e,damage){if(!e.alive)return;if(e.shield>0){popup(e.x,e.y-150,'INMUNE Â· '+Math.ceil(e.shield)+'s','#deafff');return;}e.hp=Math.max(0,e.hp-Math.round(damage));e.hit=.2;popup(e.x,e.y-145,String(Math.round(damage)));if(e.hp===0){e.alive=false;e.castData=null;e.respawn=60;story3Kill();if(net.peer)lanSend({type:'story3Kill',zone:23});burst(e.x,e.y-70,35,'#d29aff');save();}}
function hexCast(b,type){const t=teamTargets().sort((a,c)=>dist(a,b)-dist(c,b))[0],spec={staff:[1.0,145,50,3.5],bolt:[1.15,620,55,5.5],runes:[1.55,110,60,10],shield:[1.2,0,0,18]}[type];b.castData={type,t:spec[0],max:spec[0],r:spec[1],damage:spec[2],a:Math.atan2(t.y-b.y,t.x-b.x),x:t.x,y:t.y,hit:false};b[type==='staff'?'cd':type==='bolt'?'boltCD':type==='runes'?'runeCD':'shieldCD']=spec[3];}
function updateHex(dt){if(net.role==='guest'||zone!==23)return;ensureHex();const b=enemies.find(e=>e.hexBoss);if(!b)return;if(!b.alive){b.respawn=Math.max(0,(b.respawn||60)-dt);if(b.respawn===0){enemies.splice(enemies.indexOf(b),1);ensureHex();}return;}if(b.possessedTime>0)return;for(const k of ['cd','boltCD','runeCD','shieldCD','shield','hit','stun'])b[k]=Math.max(0,(b[k]||0)-dt);b.moving=false;const f=b.castData;if(f){f.t-=dt;if(!f.hit&&f.t<=.2){f.hit=true;if(f.type==='shield'){b.shield=5;burst(b.x,b.y-60,20,'#ce8cff');}else if(f.type==='bolt'){hostileShots.push({type:'hexbolt',x:b.x,y:b.y-35,dx:Math.cos(f.a)*280,dy:Math.sin(f.a)*280,t:2.5,r:14,damage:55});}else for(const o of teamTargets()){const d=f.type==='runes'?Math.hypot(o.x-f.x,o.y-f.y):dist(o,b),a=Math.atan2(o.y-b.y,o.x-b.x),angle=Math.abs(Math.atan2(Math.sin(a-f.a),Math.cos(a-f.a)));if(d<f.r&&(f.type==='runes'||angle<.9)&&lineClear(b.x,b.y,o.x,o.y))hurtTeam(o,f.damage);}if(f.type==='runes')burst(f.x,f.y-15,30,'#d088f8');}if(f.t<=0)b.castData=null;return;}if(b.stun>0||b.shield>0)return;const t=teamTargets().sort((a,c)=>dist(a,b)-dist(c,b))[0],d=dist(t,b);if(d>800)return;b.face=t.x>=b.x?1:-1;if(b.shieldCD<=0)hexCast(b,'shield');else if(b.runeCD<=0)hexCast(b,'runes');else if(b.cd<=0&&d<145)hexCast(b,'staff');else if(b.boltCD<=0&&d<620)hexCast(b,'bolt');if(!b.castData&&d>120){moveActor(b,(t.x-b.x)/d*145*dt,(t.y-b.y)/d*145*dt);b.moving=true;b.anim+=dt*6;}}
function drawHex(b){const c=b.castData,frame=b.shield>0?10:c?c.type==='staff'?(c.hit?4:3):c.type==='bolt'?(c.hit?6:5):c.type==='runes'?(c.hit?8:7):9:b.hit>0?11:b.moving?1+Math.floor(b.anim)%2:0;sprite(76,frame,b.x,b.y,165,b.face);txt('HEX Â· NV.30',b.x,b.y-183,12,'#f5d5ff');ctx.fillStyle='#28182f';ctx.fillRect(b.x-70,b.y-176,140,7);ctx.fillStyle='#c782e8';ctx.fillRect(b.x-70,b.y-176,140*b.hp/b.max,7);if(b.shield>0)txt('INMUNE Â· '+Math.ceil(b.shield)+'s',b.x,b.y-199,11,'#f2c5ff');if(c&&c.type!=='shield'){ctx.strokeStyle=c.hit?'#f5c7ff':'#da8ff9';ctx.fillStyle=c.hit?'#e4b1ff66':'#cb77ff22';ctx.lineWidth=3;ctx.beginPath();if(c.type==='runes')ctx.ellipse(c.x,c.y,c.r,c.r*.55,0,0,Math.PI*2);else{ctx.moveTo(b.x,b.y);ctx.arc(b.x,b.y,c.r,c.a-.25,c.a+.25);ctx.closePath();}ctx.fill();ctx.stroke();txt(c.type==='runes'?'Â¡SAL DE LA RUNA!':c.type==='bolt'?'Â¡RAYO!':'Â¡BASTÃ“N!',b.x,b.y-205,12,'#ffdda4');}}
function hudV14(){if(zone===23){$('#mission .tiny').textContent='HISTORIA 03 Â· HEX Â· NIVEL 30';$('#questtext').textContent=player.story3.state==='active'?'Interrumpe el ritual':player.story3.state==='return'?'Regresa con Ten':player.story3.state==='complete'?'CapÃ­tulo 3 completado':'Acepta la misiÃ³n con Ten';$('#questsub').textContent='Escuela Arcana Â· salida al oeste';const b=enemies.find(e=>e.hexBoss&&e.alive);$('#wolfbar').classList.remove('hidden');$('#wolfbar').textContent=b?'HEX Â· '+Math.ceil(b.hp)+' / '+b.max+(b.shield>0?' Â· INMUNE '+Math.ceil(b.shield)+'s':' Â· EVITA LAS RUNAS'):'Hex reaparece en '+Math.ceil(enemies.find(e=>e.hexBoss)?.respawn||0)+'s';}if(zone===22){const b=enemies.find(e=>e.ghostBoss);$('#questsub').textContent=b?.alive?'Ghost Lady Â·10% (Omnitrix)':'Reaparece en '+Math.ceil(b?.respawn||0)+'s Â· Ghost Lady10%';}}
function v14Receive(m){if(m.type==='story3Kill'&&net.role==='guest'&&m.zone===23&&zone===23){story3Kill();return true;}if(m.type==='ghostSkin'&&net.role==='guest'&&zone===22&&m.zone===22&&typeof m.token==='string'){ghostSkinReward(m.token,m.won===true);return true;}return false;}
function drawCinema(){if(!cinematic||cinematic.mode!=='movie')return;const screen=$('#cinemaworld'),cw=innerWidth,ch=innerHeight,dpr=Math.min(2,devicePixelRatio||1);if(screen.width!==Math.round(cw*dpr)||screen.height!==Math.round(ch*dpr)){screen.width=Math.round(cw*dpr);screen.height=Math.round(ch*dpr);}const c=screen.getContext('2d'),t=cinematic.time,k=cinematic.id==='diamond'?'diamond14':cinematic.id==='fourarms'?'fourarms14':null,map=CINE13[cinematic.id];let im,f,ix,local;if(k){const position=Math.min(11.999,t/16.065306*12);ix=Math.floor(position);local=position-ix;im=art[k];f=OMNI_V14_FRAMES[k][ix];if(k==='fourarms14'&&ix>=10){im=art.fourfix15;f=OMNI_V15_FRAMES.fourfix15[ix-10];}}else{ix=Math.min(5,Math.floor(Math.max(0,t-1)/2.45));local=(Math.max(0,t-1)/2.45)%1;im=map?art[map[0]]:t<1?art.cineStart12:art.cine12;f=map?OMNI_V13_FRAMES[map[0]][map[1]+ix]:t<1?[0,0,im.width,im.height]:OMNI_V12_FRAMES.cine12[ix];}if(cinematic.id==='grey'){im=art.greycine15;f=OMNI_V15_FRAMES.greycine15[ix];}const cinema16={grey:'greycin16',bestia:'beastcin16',ultra:'ultracin16',insect:'insectcin16'}[cinematic.id];if(cinema16&&art[cinema16]){const pos=Math.min(11.999,t/16.065306*12);ix=Math.floor(pos);local=pos-ix;im=art[cinema16];f=OMNI_V16_FRAMES[cinema16][ix];}c.setTransform(dpr,0,0,dpr,0,0);c.imageSmoothingEnabled=false;const scale=Math.max(cw/f[2],ch/f[3])*(1+.018*Math.sin(local*Math.PI)),w=f[2]*scale,h=f[3]*scale;c.drawImage(im,...f,(cw-w)/2,(ch-h)/2,w,h);for(let i=0;i<20;i++){c.fillStyle=(ALIENS[cinematic.id]?.color||'#c8ff99')+'88';c.fillRect((i*137+t*90)%cw,(i*73-t*38+ch*10)%ch,2+i%3,2+i%3);}if(local<.08&&ix>0){c.fillStyle='rgba(201,255,164,'+(1-local/.08)*.3+')';c.fillRect(0,0,cw,ch);}c.textAlign='center';c.font='bold '+Math.max(11,ch*.027)+'px Arial';c.lineWidth=3;c.strokeStyle='#061209';c.fillStyle='#e9ffd9';c.strokeText('DOBLE TOQUE PARA SALTAR',cw/2,ch-15);c.fillText('DOBLE TOQUE PARA SALTAR',cw/2,ch-15);c.fillStyle='#bcff8d';c.fillRect(0,ch-3,cw*t/16.065306,3);}

// Progress initializes after all extension definitions.
function baseMaxHP(){return race==='osmo'?(player.form==='fire'&&player.fireCharge>=60?300:OSMO_FORMS[player.form].hp):player.alien?ALIENS[player.activeAlien].hp:100}function maxHP(){return Math.round(baseMaxHP()*healthFactor()*(greyForm()&&player.intellect>0?1.2:1));}function xpNeed(){let n=player.level-1;return 140+n*45+n*n*4}function multiplier(){return (1+(Math.min(player.level,70)-1)*.035+Math.max(0,player.level-70)*.06)*(race==='osmo'&&player.form==='fire'&&player.fireCharge>=60?1.12:1)}
function save(){if(started)persistGame();}
function load(){try{const s=JSON.parse(localStorage.getItem(STORE));if(!s||![1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].includes(s.version))return;
 race=['omni','osmo','bendy','anodite','system148','saiyan167'].includes(s.race)?s.race:'omni';profiles=s.profiles||{};bossTimer=s.bossTimer||0;const defaults=JSON.parse(JSON.stringify(player));Object.assign(player,s.player);player.selected=ALIENS[player.selected]?player.selected:'heatblast';player.activeAlien=ALIENS[player.activeAlien]?player.activeAlien:'heatblast';
 player.masteries=Object.assign(defaults.masteries,s.player.masteries||{});player.cooldowns=Object.assign(defaults.cooldowns,s.player.cooldowns||{});player.level=clamp(player.level||1,1,150);player.shield=0;player.shieldTime=0;player.leap=null;player.motion=null;player.attackFrame=3;
 quest=Object.assign({state:'new',kills:0,completions:s.quest&&s.quest.state==='done'?1:0},s.quest||{});dayMode=s.dayMode||'noche';sound=s.sound!==false;clock=s.clock||0;
 if(s.version===1){player.masteries.heatblast=clamp(s.player.mastery||0,0,100);player.xp=Math.floor((s.player.xp/(60+(player.level-1)*20))*xpNeed());zone=1;zoneStates={camp:s.enemies||[]};}
 else{zone=clamp(s.zone||0,0,REGIONS.length-1);zoneStates=s.zoneStates||{};discovered=s.discovered||['camp'];opened=s.opened||[];}
 if(s.version<4&&player.alien&&player.activeAlien==='fourarms')player.hp=Math.min(400,player.hp*4/3);player.skin=SKINS[player.skin]?player.skin:0;player.motion=null;player.slideCool=Math.max(0,player.slideCool||0);if(s.version<5){player.points=Math.max(0,player.level-1);player.learned={};}migrated=s.version<15;if(migrated){player.emptyLock=0;player.lock=0;}
 for(const id of Object.keys(ALIENS)){player.masteries[id]=clamp(player.masteries[id]||0,0,['swampfire115','echoecho118','humungousaur129','jetray136','spidermonkey136','goop139','bigchill139','chromastone141','benghostaf141','system148','cerebron154'].includes(id)?200:100);if(!Array.isArray(player.cooldowns[id]))player.cooldowns[id]=[0,0,0,0];}
 law=Object.assign(law,s.law||{});law.karma=clamp(law.karma,-100,0);law.heat=clamp(law.heat,0,100);law.timer=clamp(law.timer,0,60);civilStates=s.civilStates||{};
 initProgress();player.cool=player.cooldowns[race==='osmo'&&player.form==='acid'?'acid':race==='osmo'&&player.form==='ghost'?'ghost':player.activeAlien];enemies=zoneStates[region().id]||[];for(const e of enemies){e.kind=e.voidEnemy?'void':e.hexBoss?'hex':e.guard?'guard':e.ghostBoss?'ghostboss':e.chapter2?'chapter2':e.wolfBoss?'wolfboss':e.sea?'sea':e.robotBoss?'robot':e.majorBoss?'boss':'enemy';e.rcd=Number.isFinite(e.rcd)?e.rcd:2;e.cast=0;}
 ensureCitizens();player.inv=2;player.attack=0;player.moving=false;if(isSolid(player.x,player.y)){player.x=540;player.y=region().exitY;}
 $('#play').innerHTML='CONTINUAR AVENTURA <span>â†’</span>';
 }catch(e){console.warn('Save could not be restored',e);}}
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');toastTime=3.3;}
function tone(freq,duration=.12,type='sine',vol=.035){if(sound)window.OmniSound?.tone(freq,duration,type,vol);}
function burst(x,y,n,color){for(let i=0;i<n;i++){let a=Math.random()*Math.PI*2,v=30+Math.random()*125;particles.push({x,y,dx:Math.cos(a)*v,dy:Math.sin(a)*v-30,t:.3+Math.random()*.5,color,size:2+Math.random()*4});}}
function popup(x,y,text,color='#ffe0a6'){numbers.push({x,y,text,color,t:1.1});}
function xp(amount){if(net.source==='guest'){lanSend({type:'reward',xp:amount});return;}if(player.level>=150)return;player.xp+=amount;let up=false;while(player.level<150&&player.xp>=xpNeed()){player.xp-=xpNeed();player.level++;player.points++;up=true;}if(player.level>=150)player.xp=0;if(up){toast('Â¡Nivel '+player.level+'! Tus ataques son mÃ¡s fuertes.');burst(player.x,player.y-40,35,'#c3ff8a');tone(880,.35); }save();}
function commitTransform(){initV16();if(interference()){toast('Interferencia magnÃ©tica Â· Omnitrix desactivado');return;}if(!player.alien&&player.selected==='ghost'&&(!player.ghostDNA||player.level<20)){toast('Completa el hospital de nivel 20 para conseguir este ADN');return;}player.cast=null;player.flight=0;if(race==='osmo'){if(started&&!paused)absorptionMenu();return;}if(!started||paused||player.leap||player.motion||player.jump>0)return;if(player.alien){revert(false);return;}if(player.battery<=0){toast('BaterÃ­a vacÃ­a Â· Recupera un poco de carga');tone(90);return;}
 if(player.selected==='wolf'&&!wolfUnlocked()){toast('Blitztwolfer requiere nivel 30 y su ADN (20% del jefe)');return;}const ratio=player.hp/humanHP();player.activeAlien=player.selected;player.cool=player.cooldowns[race==='osmo'&&player.form==='acid'?'acid':race==='osmo'&&player.form==='ghost'?'ghost':player.activeAlien];player.alien=true;player.hp=clamp(ratio*maxHP(),1,maxHP());player.lock=0;player.emptyLock=0;flash=.3;burst(player.x,player.y-50,30,alien().color);if(cinemaEnabled)tone(player.activeAlien==='fourarms'?250:720,.35,'sawtooth',.02);toast(alien().name.toUpperCase()+' Â· '+maxHP()+' vida mÃ¡xima');save();}
function revert(empty){initV16();endGhost();player.wolfDash=player.wolfGrab=null;player.waterGuard=0;player.cast=null;player.flight=0;if(race==='osmo'){const ratio=player.hp/maxHP();player.form='human';player.fireCharge=0;refreshOsmo();player.hp=clamp(ratio*humanHP(),1,humanHP());player.motion=player.leap=null;if(empty)player.battery=0;save();return;}if(!player.alien)return;const ratio=player.hp/maxHP();player.hp=clamp(ratio*humanHP(),1,humanHP());player.alien=false;player.shield=0;player.shieldTime=0;player.leap=null;player.motion=null;player.lock=0;player.emptyLock=0;if(empty){player.battery=0;toast('Recargando Â· 40 s hasta el 100%; puedes usar carga parcial');}else toast('Humano Â· Puedes usar cualquier carga disponible');flash=.2;burst(player.x,player.y-45,22,'#b7ff6b');tone(260,.25);save();}
function selectAlien(step){if(race==='osmo')return;if(!started||paused)return;if(player.alien){toast('Vuelve a humano para cambiar el dial');return;}player.watchOpen=true;player.watchTurn=.4;if(cinemaEnabled)window.OmniSound?.sample('dial');const ids=CORE_ALIENS,i=ids.indexOf(player.selected);player.selected=ids[(i+step+ids.length)%ids.length];if(cinemaEnabled)tone(540,.06,'triangle');hud();save();}
function spawnEnemies(){if(inVoid()){seedVoid();return;}if(zone===23){enemies=[];ensureHex();return;}if(zone>=19){enemies=[];zoneStates[region().id]=enemies;if(zone===20)seedGuards();if(zone===22)ensureGhostBoss();return;}if(zone===18){enemies=[];ensureAnimo();return;}if(zone===17){enemies=[];zoneStates[region().id]=enemies;ensureWolf();return;}if(underwater()){seedSeaEnemies();return;}enemies=region().spawns.map((p,i)=>({id:i,x:p[0],y:p[1],homeX:p[0],homeY:p[1],face:-1,hp:zone===1&&i===5?190:100,max:zone===1&&i===5?190:100,boss:zone===1&&i===5,knight:(zone===6||zone===8)?(i%2?'ranged':'melee'):null,kind:'enemy',rcd:1+i*.35,cast:0,stun:0,alive:true,respawn:0,cd:1+i*.3,wind:0,anim:0,hit:0,moving:false}));if(zone===6||zone===8)for(const e of enemies){e.hp=e.max=e.knight==='melee'?440:380;}zoneStates[region().id]=enemies;}
function enterZone(next,side){if(net.role==='guest'&&!net.applying){toast('El anfitriÃ³n dirige los cambios de zona');return false;}if(next<0||next>=REGIONS.length)return false;if(!hospitalGate(next))return false;endGhost();if(next!==zone&&window.OmniCooking?.active)OmniCooking.leave();zoneStates[region().id]=enemies;civilStates[region().id]=citizens;const previousZone=zone;player.wolfDash=player.wolfGrab=null;zone=next;enemies=zoneStates[region().id]||[];if(!zoneStates[region().id]&&(zone!==1||quest.state!=='new'))spawnEnemies();for(const e of enemies){e.kind=e.voidEnemy?'void':e.hexBoss?'hex':e.guard?'guard':e.ghostBoss?'ghostboss':e.chapter2?'chapter2':e.wolfBoss?'wolfboss':e.sea?'sea':e.robotBoss?'robot':e.majorBoss?'boss':'enemy';if(!Number.isFinite(e.rcd))e.rcd=2;}
 ensureCitizens();officers=[];law.spawn=1;player.x=side==='left'?region().minX+65:side==='right'?region().maxX-65:540;player.y=region().exitY;if(side==='top'||side==='bottom'){player.x=region().portalX||800;player.y=side==='top'?floorBounds(player.x).top+40:region().bottom-40;}if(next===3&&previousZone===12){player.x=1110;player.y=600;}player.jump=0;player.inv=Math.max(player.inv,.7);player.leap=null;player.motion=null;projectiles.length=0;hostileShots.length=0;effects.length=0;particles.length=0;numbers.length=0;gateLock=1.5;transition=.8;resetInput();
 ensureBoss();ensureRobot();ensureWolf();ensureHex();enteredHospital(previousZone);if(!discovered.includes(region().id))discovered.push(region().id);cam.x=clamp(player.x-W*.48/sceneZoom(),0,cameraMaxX());cam.y=clamp(player.y-H*.64/sceneZoom(),0,cameraMaxY());toast(region().name+' Â· '+region().subtitle);hud();save();return true;}
function checkGate(vx,vy=0){if(gateLock>0)return false;const r=region(),l=r.links;
 if(false&&vy<0&&Math.abs(player.x-1110)<64&&player.y<=r.top+14)return enterZone(12,'bottom');
 if(Math.abs(player.x-r.portalX)<64){if(vy<0&&l.up!==undefined&&player.y<=floorBounds(player.x).top+14)return enterZone(l.up,'bottom');if(vy>0&&l.down!==undefined&&player.y>=r.bottom-14)return enterZone(l.down,'top');}
 if(Math.abs(player.y-r.exitY)>57)return false;if(vx<0&&l.left!==undefined&&player.x<=r.minX+16)return enterZone(l.left,'right');if(vx>0&&l.right!==undefined&&player.x>=r.maxX-16)return enterZone(l.right,'left');return false;}

function damageEnemy(e,dmg){if(e.voidEnemy){damageVoid(e,dmg);return;}if(!e.alive||e.guard)return;if(e.hexBoss){damageHex(e,dmg);return;}if(e.ghostBoss){ghostBossDamage(e,dmg);return;}if(e.chapter2){damageChapter2(e,dmg);return;}if(e.wolfBoss){if(dmg>0)e.recovering=false;e.hp-=Math.round(dmg);e.hit=.18;popup(e.x,e.y-160,String(Math.round(dmg)));if(e.hp<=0)wolfReward(e);return;}if(e.sea){e.hp-=Math.round(dmg);e.hit=.18;popup(e.x,e.y-100,String(Math.round(dmg)));if(e.hp<=0)seaDeath(e);return;}if(e.robotBoss){e.hp-=Math.round(dmg);e.hit=.17;popup(e.x,e.y-180,''+Math.round(dmg));if(e.hp<=0)defeatRobot(e);return;}if(e.majorBoss){e.hp-=Math.round(dmg);e.hit=.16;popup(e.x,e.y-155,''+Math.round(dmg));if(e.hp<=0)bossReward(e);return;}e.hp-=Math.round(dmg);e.hit=.16;popup(e.x,e.y-95,''+Math.round(dmg));burst(e.x,e.y-40,7,player.alien?alien().color:'#ffc073');if(e.hp<=0){e.alive=false;e.respawn=40+e.id*5;burst(e.x,e.y-40,18,'#ba94d9');if(e.knight){knightKill();if(net.peer)lanSend({type:'knightKill'});}xp(e.knight?28:e.boss?24:10);if(zone===1&&net.peer&&e.maxRobot71)lanSend({type:'reward',kill:true});if(quest.state==='active'&&zone===1&&e.maxRobot71){quest.kills++;if(quest.kills>=7){quest.kills=7;quest.state='return';toast('Â¡Claro despejado! Regresa con Max.');}}tone(180,.14,'triangle');save();}}
function nearest(range=550){let target=null,best=range;for(const e of [...enemies,...(law.timer>0?officers:[])])if(e.alive){const d=dist(player,e);if(d<best&&lineClear(player.x,player.y,e.x,e.y)){best=d;target=e;}}if(target)return target;
 for(const c of [...citizens,...remoteTargets()])if(c.alive){const d=dist(player,c),facing=((c.x-player.x)*player.dx+(c.y-player.y)*player.dy)/Math.max(1,d);if(d<best&&facing>.2&&lineClear(player.x,player.y,c.x,c.y)){best=d;target=c;}}return target;}
function damageTarget(t,dmg,stun=0){if(dmg>0)window.OmniSound?.play('hit');if(t.kind==='remote'){lanSend({type:'hurt',damage:Math.round(dmg),zone,to:t.id});popup(t.x,t.y-120,'âˆ’'+Math.round(dmg),'#9ddfff');return;}if(net.role==='guest'&&!net.applying){lanSend({type:'damage',id:t.id,kind:t.kind,damage:dmg,stun,zone,seq:++net.seq});popup(t.x,t.y-110,''+Math.round(dmg));return;}if(t.kind==='civil')damageCitizen(t,dmg,'player');else if(t.kind==='police')damageOfficer(t,dmg);else{damageEnemy(t,dmg);t.stun=Math.max(t.stun||0,stun);}}
function areaHit(x,y,r,dmg,stun=0){for(const t of combatants())if(t.alive&&Math.hypot(t.x-x,t.y-y)<r&&lineClear(x,y,t.x,t.y))damageTarget(t,dmg,stun);}

function slide(){if(!started||paused||!player.alien||player.activeAlien!=='diamond'||player.slideCool>0||player.motion||player.leap)return;const len=Math.hypot(player.dx,player.dy)||1;player.motion={type:'slide',t:.7,max:.7,dx:player.dx/len,dy:player.dy/len,hits:[]};player.slideCool=5;player.attack=.7;burst(player.x,player.y-5,12,'#b1ffea');tone(650,.14,'triangle');}
function speedAttack(i,s,a){const damage=s.damage*multiplier();player.attackFrame=i===0?3:i===1?4:i===2?5:6;
 if(i===0){player.attack=.32;effects.push({type:'flurry',x:player.x,y:player.y,a,t:.3,max:.3,tick:0,pulses:0,damage,r:108});}
 if(i===1){player.attack=1.95;effects.push({type:'tornado',x:player.x,y:player.y,t:1.95,max:1.95,tick:0,pulses:0,damage,r:110});}
 if(i>=2){const duration=i===2?.7:.6;player.attack=duration;player.motion={type:i===2?'zigzag':'sonicdash',t:duration,max:duration,dx:Math.cos(a),dy:Math.sin(a),hits:[],damage};}tone(1100,.15,'triangle');}
function updateMotion(dt){const m=player.motion;if(!m)return;const prev=m.max-m.t;m.t=Math.max(0,m.t-dt);const elapsed=m.max-m.t,travel=Math.min(dt,m.max-prev),speed=m.type==='slide'?470:m.type==='beastcharge'?435:m.type==='zigzag'?570:690;
 let dx=m.dx*speed*travel,dy=m.dy*speed*travel*.75;if(m.type==='zigzag'){const wave=38*(Math.sin(elapsed/m.max*Math.PI*4)-Math.sin(prev/m.max*Math.PI*4));dx-=m.dy*wave;dy+=m.dx*wave;}
 moveActor(player,dx,dy);player.face=m.dx>=0?1:-1;player.moving=false;
 effects.push({type:'speedtrail',x:player.x,y:player.y-20,t:.2,max:.2,r:20,color:m.type==='beastcharge'?'#c8ef8b':m.type==='slide'?'#a5ffe3':'#79dfff',a:Math.atan2(m.dy,m.dx)});
 if(m.damage)for(const target of combatants())if(target.alive&&!m.hits.includes(target)&&dist(player,target)<76&&lineClear(player.x,player.y,target.x,target.y)){m.hits.push(target);damageTarget(target,m.damage,.25);burst(target.x,target.y-35,8,'#98e9ff');}
 if(m.t<=0){if(m.type==='sonicdash')effects.push({type:'sonic',x:player.x,y:player.y-30,a:Math.atan2(m.dy,m.dx),t:.35,max:.35,r:125});player.motion=null;player.attack=.16;player.attackFrame=m.type==='slide'?3:7;}
}
function selectSkin(index){if(!SKINS[index])return;player.skin=index;try{localStorage.setItem('omni-skin',String(index));}catch(e){}save();skinMenu();}
function skinMenu(){if(race==='osmo'){toast('Esta raza usa su propia apariencia y formas de absorciÃ³n');return;}showDialog('APARIENCIA Â· PROGRESO COMPARTIDO','Selecciona tu personaje','<div data-no-i18n><p>'+words97('Las apariencias conservan tu vida, velocidad y ataques. Cambiar de personaje conserva nivel, aliens, maestrÃ­as y misiones.','Appearances preserve your health, speed and attacks. Changing characters keeps your level, aliens, masteries and quests.','As aparÃªncias preservam sua vida, velocidade e ataques. Trocar de personagem mantÃ©m nÃ­vel, aliens, maestrias e missÃµes.','GÃ¶rÃ¼nÃ¼mler canÄ±nÄ±, hÄ±zÄ±nÄ± ve saldÄ±rÄ±larÄ±nÄ± korur. Karakter deÄŸiÅŸtirmek seviyeni, uzaylÄ±larÄ±nÄ±, ustalÄ±klarÄ±nÄ± ve gÃ¶revlerini korur.')+'</p></div><div class="skincards">'+SKINS.map((skin,i)=>'<button data-skin="'+i+'" class="skincard '+(player.skin===i?'active':'')+'"><canvas width="150" height="170"></canvas><strong>'+skin.name+'</strong><small>'+(player.skin===i?'SELECCIONADO':'ELEGIR')+'</small></button>').join('')+'</div>',[['LISTO',closeDialog]]);document.querySelectorAll('[data-skin]').forEach(b=>{const i=+b.dataset.skin,{table,sheet}=spriteInfo(SKINS[i].row),f=table[0],c=b.querySelector('canvas').getContext('2d'),h=148,w=f[2]/f[3]*h;c.imageSmoothingEnabled=false;c.drawImage(sheet,...f,(150-w)/2,14,w,h);b.onclick=()=>selectSkin(i);});}

function attackBase14(i){if(ultraForm()){ultraAttack(i);return;}if(greyForm()){greyAttack(i);return;}if(interference()){toast('Sigilo: evita a los guardias');return;}if(!cinematic&&!paused)player.watchOpen=false;if(!started||paused||player.leap||player.motion||player.wolfDash||player.wolfGrab||player.cool[i]>0)return;if(ghostForm()){ghostAttack(i);return;}if(extinguished()){coldAttack(i);return;}if(player.alien&&player.activeAlien==='wolf'){wolfAttack(i);return;}if(race==='osmo'){osmoAttack(i);return;}if(player.alien&&player.activeAlien==='aquatic'){aquaticAttack(i);return;}if(player.alien&&player.activeAlien==='insect'){insectAttack(i);return;}if(i>=4){if(player.alien)extraAttack(i);else toast('TransfÃ³rmate para usar este ataque');return;}if(!player.alien&&i!==0){toast('TransfÃ³rmate para usar las habilidades del alien');return;}const s=currentSkills()[i];if(player.alien&&mastery()<s.unlock){toast(s.name+': requiere '+s.unlock+'% de maestrÃ­a');return;}
 player.cool[i]=player.alien?s.cd:.55;player.attack=.35;player.attackFrame=3;if(player.alien&&['heatblast','diamond'].includes(player.activeAlien))beginCast(player.activeAlien,i);else window.OmniSound?.play('punch');const target=nearest(player.alien?480:88);let a=target?Math.atan2(target.y-player.y,target.x-player.x):Math.atan2(player.dy,player.dx);player.face=Math.cos(a)>=0?1:-1;const attackId=nextAttackId++;
 if(!player.alien){tone(160,.09,'triangle');effects.push({type:'punch',x:player.x+Math.cos(a)*45,y:player.y-35,t:.18,max:.18,r:28});if(target)damageTarget(target,10*multiplier());return;}
 if(player.activeAlien==='bestia'){bestiaAttack(i,true);return;}if(player.activeAlien==='xlr8'){speedAttack(i,s,a);return;}
 const diamond=player.activeAlien==='diamond',four=player.activeAlien==='fourarms';tone(four?150:diamond?760+i*80:400-i*75,.16,four?'triangle':diamond?'triangle':'sawtooth',.025);
 if(four){musicalAttack(i);if(i===0){effects.push({type:'sonic',x:player.x,y:player.y-30,a,t:.45,max:.45,r:190});for(const t of combatants())if(t.alive&&dist(player,t)<200&&lineClear(player.x,player.y,t.x,t.y)){let angle=Math.atan2(t.y-player.y,t.x-player.x),diff=Math.atan2(Math.sin(angle-a),Math.cos(angle-a));if(Math.abs(diff)<1.05)damageTarget(t,s.damage*multiplier(),.25);}}
 if(i===1){let d=target?Math.min(dist(player,target),180):145,dest=walkable(player.x+Math.cos(a)*d,player.y+Math.sin(a)*d);player.leap={t:1,max:1,startX:player.x,startY:player.y,x:dest.x,y:dest.y,damage:s.damage*multiplier()};player.attackFrame=4;}
 if(i===2){player.attackFrame=6;projectiles.push({type:'boulder',x:player.x,y:player.y-45,dx:Math.cos(a)*310,dy:Math.sin(a)*310,t:1.7,r:23,damage:s.damage*multiplier(),attackId});}
 if(i===3){player.attackFrame=7;player.attack=1.4;effects.push({type:'quake',x:player.x,y:player.y,t:1.5,max:1.5,r:180,tick:.15,pulses:0,damage:s.damage*multiplier()});}return;}
 const fire=(angle)=>projectiles.push({type:diamond?'crystal':'fire',x:player.x,y:player.y-35,dx:Math.cos(angle)*(diamond?510:440),dy:Math.sin(angle)*(diamond?510:440),t:1.25,damage:s.damage*multiplier(),r:diamond?9:10,attackId});
 if(i===0)fire(a);if(i===1){if(diamond){player.shield=80;player.shieldTime=10;burst(player.x,player.y-50,25,'#bdfff1');toast('Escudo: 80 resistencia Â· 10 s');}else{fire(a-.17);fire(a);fire(a+.17);}}
 if(i===2){if(diamond){const aim=target?{x:target.x,y:target.y}:{x:player.x+Math.cos(a)*100,y:player.y+Math.sin(a)*60};effects.push({type:'field',x:aim.x,y:aim.y,t:5,max:5,r:125,tick:0,damage:s.damage*multiplier()});}else{effects.push({type:'ring',x:player.x,y:player.y-20,t:.6,max:.6,r:150});areaHit(player.x,player.y,160,s.damage*multiplier());shake=.18;}}
 if(i===3){let aim=target?{x:target.x,y:target.y}:{x:clamp(player.x+Math.cos(a)*200,region().minX+20,region().maxX-20),y:clamp(player.y+Math.sin(a)*90,region().top+20,region().bottom-20)};effects.push({type:diamond?'skycrystal':'meteor',x:aim.x,y:aim.y,t:1.05,max:1.05,r:140,hit:false,damage:s.damage*multiplier()});}
}
function showDialog(eyebrow,title,html,buttons){$('#dialogbody').scrollTop=0;if(cinematic)return;$('.dialog').classList.remove('map-dialog');paused=true;dialogOpen=true;held=-1;resetInput();$('#dialogeyebrow').textContent=eyebrow;$('#dialogtitle').textContent=title;$('#dialogbody').innerHTML=html;$('#dialogbuttons').replaceChildren();buttons.forEach(([text,fn])=>{let b=document.createElement('button');b.textContent=text;b.onclick=fn;$('#dialogbuttons').append(b);});$('#modal').classList.remove('hidden');save();}
function closeDialog(){if(cinematic)return;net.away=false;paused=false;dialogOpen=false;last=performance.now();$('#modal').classList.add('hidden');}
function startMission(){if(net.role==='guest'){toast('El anfitriÃ³n debe aceptar o repetir la patrulla con Max');closeDialog();return;}quest.state='active';quest.kills=0;spawnEnemies();if(net.peer)lanSend({type:'mission'});closeDialog();toast('MisiÃ³n de Max Â· Derrota a 6 drones y un comandante del refugio');save();}
function claimMission(){if(quest.state!=='return')return;quest.state='done';quest.completions=(quest.completions||0)+1;player.hp=maxHP();law.karma=Math.min(0,law.karma+8);player.coins+=10;xp(80);closeDialog();toast('MisiÃ³n completada Â· +80 EXP Â· 10 monedas Â· Karma +8 Â· Puedes repetirla');save();}
function talk(){if(!started||!npcHere()||dist(player,npc)>130)return;
 if(quest.state==='new')showDialog('MAX Â· EL REFUGIO','Robots de Vilgax entre los pinos','<p>Â«Esas criaturas han tomado el claro. Ten cuidado: lanzan energÃ­a verde. Prueba las formas de tu Omnitrix y despeja la zona.Â»</p><p>Derrota a los <b>6 drones y un comandante del Refugio</b>, con un comandante adicional, y vuelve conmigo. Los enemigos de otras zonas no cuentan.</p><p class="reward">80 EXP Â· 10 monedas Â· CuraciÃ³n completa Â· Recupera 8 de karma<br>MisiÃ³n repetible al cobrar.</p>',[['ACEPTAR MISIÃ“N',startMission],['AHORA NO',closeDialog]]);
 else if(quest.state==='return')showDialog('MAX Â· OBJETIVO COMPLETADO','El camino vuelve a estar libre','<p>Â«Buen trabajo. Si esas criaturas regresan, volverÃ© a necesitarte. TambiÃ©n puedes explorar la ciudad y sus nuevos distritos.Â»</p><p class="reward">+80 EXP Â· 10 monedas Â· Vida restaurada Â· Karma +8</p>',[['COBRAR RECOMPENSA',claimMission]]);
 else if(quest.state==='active')showDialog('MAX Â· EL REFUGIO','TodavÃ­a quedan robots','<p>Has derrotado a <b>'+quest.kills+' de 7</b>. Sigue hacia el este de este mismo refugio. Sus proyectiles verdes se pueden esquivar.</p>',[['VOLVER AL BOSQUE',closeDialog]]);
 else showDialog('MAX Â· MISIÃ“N REPETIBLE','Â¿Una nueva patrulla?','<p>Â«Descansa un momento. Si quieres, podemos volver a patrullar el claro.Â»</p><p>Patrullas completadas: <b>'+(quest.completions||1)+'</b>.</p><p class="reward">Otra ronda: 6 drones y un comandante Â· 80 EXP Â· 10 monedas Â· Karma +8</p>',[['REPETIR MISIÃ“N',startMission],['DESCANSAR',()=>{player.hp=maxHP();closeDialog();save();}]]);
}

function pauseMenu(){if(!started)return;showDialog('PARTIDA GUARDADA Â· VERSIÃ“N 0.15','Descansa un momento','<p>Nivel '+player.level+' / 150 Â· DaÃ±o Ã—'+multiplier().toFixed(2)+'<br>Heatblast: '+Math.floor(player.masteries.heatblast)+'% Â· Diamante: '+Math.floor(player.masteries.diamond)+'% Â· Cuatro Brazos: '+Math.floor(player.masteries.fourarms)+'% Â· XLR8: '+Math.floor(player.masteries.xlr8)+'%</p><p>Zona: <b>'+region().name+'</b><br>Ambiente: <b>'+dayMode+'</b> Â· Sonido: <b>'+(sound?'activado':'desactivado')+'</b>. El juego y los temporizadores se detienen al pausar.</p>',[['CONTINUAR',closeDialog],['MINIJUEGOS / TRABAJOS',jobsMenu],['MULTIJUGADOR Wi-Fi',lanMenu],['MAPA',()=>showWorldMap()],['GUÃA / ATAQUES',()=>guide()],['PERSONAJE / SKIN',skinMenu],['SKINS DE ALIENS',alienSkinMenu],['RAZAS',raceMenu],['ÃRBOL',skillTree],['CONFIGURACIÃ“N',settings15],['DÃA / NOCHE',()=>{dayMode=dayMode==='noche'?'dÃ­a':dayMode==='dÃ­a'?'ciclo':'noche';pauseMenu();}],['SONIDO',()=>{sound=!sound;pauseMenu();}]]);}
function defeat(){if(zone>=20&&zone<=22){hospitalCheckpoint('Has caÃ­do');return;}if(zone===17)recoverWolf();player.watchOpen=false;player.wolfDash=player.wolfGrab=null;if(race==='osmo'){player.form='human';player.fireCharge=0;refreshOsmo();}const arrested=law.timer>0&&officers.some(o=>o.alive&&dist(o,player)<180);law.timer=0;law.heat=0;officers=[];player.leap=null;player.motion=null;player.alien=false;player.hp=humanHP();player.oxygen=45;player.waterGuard=0;player.shield=0;player.shieldTime=0;if(net.role==='guest'){player.x=region().minX+80;player.y=region().exitY;}else{const wet=underwater();enterZone(wet?5:1,'center');player.x=wet?850:540;player.y=wet?740:627;}player.inv=3;player.lock=0;for(const e of enemies){e.x=e.homeX;e.y=e.homeY;e.wind=0;e.cd=2;}burst(player.x,player.y-40,30,'#beff87');showDialog(arrested?'POLICÃA Â· DETENIDO':'MAX Â· REFUGIO',arrested?'La persecuciÃ³n terminÃ³':'TodavÃ­a puedes intentarlo','<p>Has recuperado la vida. Conservas experiencia, las cuatro maestrÃ­as, cofres y progreso de misiÃ³n.</p>',[['VOLVER A INTENTAR',closeDialog]]);save();}
function hitPlayer(amount){if(cinematic||player.ghostPhase>0||player.possession)return;if((player.jump>.17&&player.jump<.57)||player.inv>0||(player.leap&&player.leap.t>.2&&player.leap.t<.85))return;player.regenWait=12;if(underwater()&&race==='omni'&&player.alien&&player.activeAlien==='aquatic'&&player.masteries.aquatic>=40)amount=Math.round(amount*.9);if(player.waterGuard>0)amount=Math.round(amount*.65);if(player.shield>0&&player.shieldTime>0){const absorbed=Math.min(player.shield,amount);player.shield-=absorbed;amount-=absorbed;popup(player.x,player.y-125,'ESCUDO âˆ’'+absorbed,'#a4ffeb');burst(player.x,player.y-40,9,'#acffed');if(player.shield<=0){player.shieldTime=0;toast(T80('Â¡Barrera rota!','Barrier broken!','Barreira quebrada!','Bariyer kÄ±rÄ±ldÄ±!'));burst(player.x,player.y-40,35,'#d3fff6');}if(amount<=0){player.inv=.32;return;}}
 player.hp-=amount;player.inv=.65;shake=.17;popup(player.x,player.y-110,'âˆ’'+amount,'#ff9c91');tone(75,.16,'square',.025);if(player.hp<=0)defeat();}

function interact(){if(hospital()&&started&&!paused){hauntAction();return;}if(talkExtra())return;if(npcHere()&&dist(player,npc)<130){talk();return;}const chest=region().chest;if(chest&&dist(player,chest)<100&&!opened.includes(region().id)){opened.push(region().id);xp(15);player.hp=Math.min(maxHP(),player.hp+30);burst(chest.x,chest.y-20,25,'#ffe8a0');toast('Cofre encontrado Â· +15 EXP Â· +30 vida');tone(960,.25);save();}}
function drawScene(c,z,day){let im=art.night,sx=0,sy=0,sw=im.width,sh=im.height;if(z===1){im=day?art.day:art.night;sw=im.width;sh=im.height;}else if(z===0||z===2){im=art.regions;sw=Math.floor(im.width/2);sh=Math.floor(im.height/2);sx=day?0:sw;sy=z===0?0:sh;}else if(z===3){im=art.city;sw=im.width;sh=Math.floor(im.height/2);sy=day?0:sh;}else if(z>=24){im=art.void15;sw=im.width/2;sh=im.height/2;sx=(z-24)%2*sw;sy=Math.floor((z-24)/2)*sh;}else if(z===23){im=art.school14;sw=im.width;sh=im.height;}else if(z>=19&&z<=22){im=art.hospital13;sw=im.width/2;sh=im.height/2;sx=(z-19)%2*sw;sy=Math.floor((z-19)/2)*sh;}else if(z===18){im=art.lab12;sw=im.width;sh=im.height;}else if(z===17){im=art.forest11;sw=im.width;sh=im.height;}else if(z>=13){im=art.seaPlaces10;sw=im.width/2;sh=im.height/2;sx=(z-13)%2*sw;sy=Math.floor((z-13)/2)*sh;}else if(z===12){im=art.bellwood9;sw=im.width;sh=im.height;}else if(z>=10){im=art.places8;sw=Math.floor(im.width/2);sh=Math.floor(im.height/2);sx=day?sw:0;sy=z===10?0:sh;}else if(z>=8){im=art.places7;sw=Math.floor(im.width/2);sh=Math.floor(im.height/2);sx=day?sw:0;sy=z===8?0:sh;}else if(z>=6){im=art.places6;sw=Math.floor(im.width/2);sh=Math.floor(im.height/2);sx=day?0:sw;sy=z===6?0:sh;}else{im=art.districts;sw=Math.floor(im.width/2);sh=Math.floor(im.height/2);sx=day?0:sw;sy=z===4?0:sh;}
 c.drawImage(im,sx,sy,sw,sh,0,0,WW,WH);if(z>=6)c.drawImage(im,sx,sy+Math.floor(sh*.9),sw,Math.floor(sh*.1),0,WH,WW,140);}
function mapPaint(c,z,w,h,detail=false){c.clearRect(0,0,w,h);c.save();c.scale(w/WW,h/WH);drawScene(c,z,false);c.fillStyle='#06122166';c.fillRect(0,0,WW,WH);c.fillStyle='#a1b3ba55';for(const b of REGIONS[z].colliders)c.fillRect(b.x,b.y,b.w,b.h);
 const dot=(x,y,color,size=18)=>{c.fillStyle='#071019';c.fillRect(x-size-5,y-size-5,size*2+10,size*2+10);c.fillStyle=color;c.fillRect(x-size,y-size,size*2,size*2);};
 const r=REGIONS[z];if(r.links.left!==undefined)dot(r.minX+15,r.exitY,'#8de5f3',15);if(r.links.right!==undefined)dot(r.maxX-15,r.exitY,'#8de5f3',15);if(r.links.up!==undefined)dot(r.portalX,r.top+10,'#8de5f3',18);if(r.links.down!==undefined)dot(r.portalX,r.bottom-10,'#8de5f3',18);
 if(z===1)dot(npc.x,npc.y,'#ffcf76',18);if(z===6)dot(questKnight.x,questKnight.y,'#ffcf76',18);if(z===9)dot(ten.x,ten.y,'#ffcf76',18);if(z===10)dot(kim.x,kim.y,'#ffcf76',18);if(z===12)dot(neko.x,neko.y,'#ffcf76',18);if(false)dot(1110,560,'#8de5f3',18);const chest=REGIONS[z].chest;if(chest&&!opened.includes(REGIONS[z].id))dot(chest.x,chest.y,'#f7e097',14);
 for(const e of (z===zone?enemies:zoneStates[REGIONS[z].id]||[]))if(e.alive)dot(e.x,e.y,'#ff878b',10);if(z===zone){for(const c of [...citizens,...remoteTargets()])if(c.alive)dot(c.x,c.y,'#8aeadb',9);for(const o of officers)if(o.alive)dot(o.x,o.y,'#83baff',12);}if(z===zone)dot(player.x,player.y,'#c9ff89',22);c.restore();}
function drawMiniMap(){if(started&&clock-mini151<.35)return;mini151=clock;if(zone===CITY21&&started&&clock-miniTick21<.25)return;if(zone===CITY21)miniTick21=clock;if(quality17==='low'&&started&&clock-hudTick17<.25)return;hudTick17=clock;mapPaint($('#minimap').getContext('2d'),zone,110,62);if(race==='omni')return;const c=$('#dialportrait').getContext('2d'),id=player.alien?player.activeAlien:player.selected,{table,sheet}=spriteInfo(race==='omni'&&id==='heatblast'&&player.alienSkins.heatblast==='pink'?75:race==='omni'&&id==='ghost'&&player.alienSkins.ghost==='lady'?74:extinguished()?41:ALIENS[id].row),f=table[extinguished()&&hasPinkSkin()?10:0];c.clearRect(0,0,52,52);c.imageSmoothingEnabled=false;const h=Math.min(48,48*f[3]/f[2]),w=f[2]/f[3]*h;c.drawImage(sheet,...f,(52-w)/2,2,w,h);}

function showWorldMap(selected=zone){if(!!REGIONS[selected]?.void!==inVoid())selected=zone;showDialog('ATLAS Â· '+REGIONS.filter((r,i)=>i!==ANUR38&&i!==MIND39&&!!r.void===inVoid()&&discovered.includes(r.id)).length+' / '+(inVoid()?4:REGIONS.filter((r,i)=>i!==ANUR38&&i!==MIND39&&!r.void).length)+' ZONAS VISITADAS',inVoid()?'VacÃ­o Nulo Â· Atlas dimensional':'Del pinar a Ciudad BahÃ­a','<div class="zonecards">'+REGIONS.map((r,i)=>[r,i]).filter(([r,i])=>i!==ANUR38&&i!==MIND39&&!!r.void===inVoid()).map(([r,i])=>'<button class="zonecard '+(i===selected?'active':'')+'" data-zone="'+i+'"><canvas width="144" height="70"></canvas><b>'+(i+1)+'. '+r.name+'</b><small>'+(i===zone?'ESTÃS AQUÃ':discovered.includes(r.id)?'EXPLORADO':'POR EXPLORAR')+'</small></button>').join('')+'</div><canvas id="areamap" width="690" height="180"></canvas><div class="map-legend"><span style="color:#c9ff89">â–  TÃº</span><span style="color:#ffcf76">â–  NPC / cofres</span><span style="color:#ff878b">â–  Enemigos</span><span style="color:#8de5f3">â–  Salidas</span><span style="color:#8aeadb">â–  Civiles</span><span style="color:#83baff">â–  PolicÃ­a</span><span>â–§ ObstÃ¡culos</span></div><p>'+ (inVoid()?'Explora los cuatro sectores conectados por los lados. Usa Portal Gun para volver al punto original.':'Toca una zona, compra su portal si ya la visitaste o camina hasta las seÃ±ales. Consulta la guÃ­a para las rutas y misiones.')+' '+REGIONS[selected].subtitle+'.</p>',[...(warpAllowedDestination(selected)?[['PORTAL Â· '+(player.warps.includes(selected)?'VIAJAR':'50 MONEDAS'),()=>warpMenu(selected)]]:[]),['VOLVER AL JUEGO',closeDialog]]);$('.dialog').classList.add('map-dialog');document.querySelectorAll('[data-zone]').forEach(b=>{const i=+b.dataset.zone;queueMap151(b,i);b.onclick=()=>{const scroll=$('#dialogbody').scrollTop;showWorldMap(i);$('#dialogbody').scrollTop=scroll;};});mapPaint($('#areamap').getContext('2d'),selected,690,180,true);}
function resetInput(){keys={};stick.x=0;stick.y=0;stick.id=null;held=-1;$('#stick').style.transform='';}
function floorBounds(x){return {top:zone===1?510+Math.max(0,540-x)*.1+Math.max(0,x-1150)*.035:region().top,bottom:region().bottom};}
function isSolid(x,y,r=13){return region().colliders.some(b=>x>b.x-r&&x<b.x+b.w+r&&y>b.y-r&&y<b.y+b.h+r);}
function lineClear(ax,ay,bx,by){const n=Math.max(1,Math.ceil(Math.hypot(bx-ax,by-ay)/15));for(let i=1;i<=n;i++)if(isSolid(ax+(bx-ax)*i/n,ay+(by-ay)*i/n,2))return false;return true;}
function walkable(x,y){const bounds=floorBounds(x);return {x:clamp(x,region().minX,region().maxX),y:clamp(y,bounds.top,bounds.bottom)};}
function moveActor(o,dx,dy){if(o===player&&player.ghostPhase>0&&!interference()){const p=walkable(o.x+dx,o.y+dy);o.x=p.x;o.y=p.y;return;}if(o.slow>0){dx*=.6;dy*=.6;}const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/6));for(let i=0;i<steps;i++){let p=walkable(o.x+dx/steps,o.y);if(!isSolid(p.x,p.y))o.x=p.x;p=walkable(o.x,o.y+dy/steps);if(!isSolid(p.x,p.y))o.y=p.y;}}

function ensureCitizens(){if(!isCity()){citizens=[];return;}const id=region().id;citizens=civilStates[id]||[540,1120].map((x,i)=>({kind:'civil',id:i,row:6+i,x,y:region().exitY+25,homeX:x,homeY:region().exitY+25,hp:70,max:70,alive:true,respawn:0,face:i? -1:1,anim:0,moving:false,fear:0,inv:0,wait:i+1,tx:x,ty:region().exitY+25}));civilStates[id]=citizens;}
function crime(penalty=5){if(net.source==='guest'){lanSend({type:'crime',penalty});law.heat=Math.min(100,law.heat+penalty*2);law.timer=Math.max(law.timer,40);return;}law.karma=Math.max(-100,law.karma-penalty);law.heat=Math.min(100,law.heat+penalty*2);law.timer=Math.min(60,35+law.heat*.25);if(law.notice<=0){toast('DaÃ±o a ciudadanos Â· Karma '+law.karma+' Â· PolicÃ­a alertada');law.notice=3;}save();}
function damageCitizen(c,damage,source){if(!c.alive||c.inv>0)return;c.hp-=Math.round(damage);c.inv=.22;c.fear=6;c.wait=0;popup(c.x,c.y-112,'âˆ’'+Math.round(damage),'#ffb7bb');if(source==='player')crime(5);if(c.hp<=0){c.alive=false;c.respawn=60;if(source==='player')crime(15);burst(c.x,c.y-35,12,'#87c7d2');}save();}
function damageOfficer(o,damage){if(!o.alive)return;o.hp-=Math.round(damage);o.hit=.2;popup(o.x,o.y-110,''+Math.round(damage),'#c7dcff');crime(2);if(o.hp<=0){o.alive=false;burst(o.x,o.y-35,14,'#9bb8e3');}}
function updateCitizens(dt){if(net.role==='guest')return;for(const c of citizens){c.inv=Math.max(0,c.inv-dt);c.fear=Math.max(0,c.fear-dt);c.moving=false;if(!c.alive){c.respawn-=dt;if(c.respawn<=0){c.alive=true;c.hp=c.max;c.x=c.homeX;c.y=c.homeY;c.inv=2;}continue;}c.wait-=dt;if(c.wait<=0){let threat=[...enemies.filter(e=>e.alive),...(c.fear>0?[player]:[])].sort((a,b)=>dist(a,c)-dist(b,c))[0];let flee=threat&&dist(c,threat)<240;let d=threat?Math.max(1,dist(c,threat)):1;let dest=walkable(c.x+(flee?(c.x-threat.x)/d*170:(Math.random()-.5)*260),c.y+(flee?(c.y-threat.y)/d*95:(Math.random()-.5)*100));if(!isSolid(dest.x,dest.y)){c.tx=dest.x;c.ty=dest.y;}c.wait=flee?.7:2+Math.random()*2;if(flee)c.fear=Math.max(c.fear,1);}
 const d=Math.hypot(c.tx-c.x,c.ty-c.y);if(d>8){let ox=c.x,oy=c.y,speed=c.fear>0?108:40;moveActor(c,(c.tx-c.x)/d*speed*dt,(c.ty-c.y)/d*speed*dt);c.moving=Math.hypot(c.x-ox,c.y-oy)>.1;if(Math.abs(c.tx-c.x)>2)c.face=c.tx>c.x?1:-1;c.anim+=dt*(c.fear>0?10:5);}}}
function updateLaw(dt){if(net.role==='guest')return;law.notice=Math.max(0,law.notice-dt);if(law.timer<=0)return;const seen=isCity()&&officers.some(o=>o.alive&&dist(o,player)<330&&lineClear(o.x,o.y,player.x,player.y));if(!seen)law.timer=Math.max(0,law.timer-dt);if(law.timer<=0){officers=[];law.heat=0;toast('Has perdido a la policÃ­a Â· El karma se conserva');save();return;}if(!isCity())return;
 law.spawn-=dt;if(law.spawn<=0&&officers.filter(o=>o.alive).length<1+wantedLevel()){law.spawn=3;let x=clamp(player.x+(player.x>800?-450:450),region().minX+35,region().maxX-35),y=region().exitY;for(let i=0;i<20&&isSolid(x,y);i++)x=clamp(x-25,60,1540);if(!isSolid(x,y))officers.push({id:'police'+(++nextAttackId),kind:'police',x,y,hp:100,max:100,alive:true,face:1,anim:0,moving:false,cd:1,hit:0});}
 for(const o of officers){if(!o.alive||player.ghostInvisible>0)continue;o.hit=Math.max(0,o.hit-dt);o.cd-=dt;let d=dist(o,player);o.face=player.x>=o.x?1:-1;o.moving=d>65;if(o.moving){moveActor(o,(player.x-o.x)/Math.max(1,d)*108*dt,(player.y-o.y)/Math.max(1,d)*108*dt);o.anim+=dt*8;}if(o.cd<=0&&d<330&&lineClear(o.x,o.y,player.x,player.y)){o.cd=2.8;const a=Math.atan2(player.y-o.y,player.x-o.x);hostileShots.push({type:'stun',x:o.x,y:o.y-35,dx:Math.cos(a)*300,dy:Math.sin(a)*300,t:1.3,damage:8,r:8});}}}
function updateEnemies(dt){if(net.role==='guest')return;for(const e of enemies){if(e.petro137||e.mob78||e.story80)continue;if(e.voidEnemy){updateVoidEnemy(e,dt);continue;}if(e.bigTick56||e.tickNode56||e.vilgax53||e.corrodium39||e.mental39||e.ultradron38||e.vilgax35||e.kevin31||e.mineMummy25||e.clancy21||e.wasp21||e.carnivore19||e.hexBoss||e.guard||e.ghostBoss||e.possessedTime>0||e.chapter2||e.majorBoss||e.robotBoss||e.wolfBoss)continue;if(e.sea){updateSeaEnemy(e,dt);continue;}if(e.knight){updateKnight(e,dt);continue;}e.hit=Math.max(0,e.hit-dt);e.cast=Math.max(0,(e.cast||0)-dt);e.stun=Math.max(0,(e.stun||0)-dt);e.moving=false;if(!e.alive){if(!e.maxRobot71&&!e.ambient71&&(zone!==1||quest.state==='done')){e.respawn-=dt;if(e.respawn<=0){e.alive=true;e.hp=e.max;e.x=e.homeX;e.y=e.homeY;e.cd=2;e.rcd=2;}}continue;}e.cd=Math.max(0,e.cd-dt);e.rcd=Math.max(0,e.rcd-dt);if(e.stun>0)continue;
 let targets=[...cloneTargets47(),...remoteClones47(),...(zone!==1||player.x>650?[player]:[]),...remoteTargets(),...citizens.filter(c=>c.alive)].filter(o=>!(o.ghostInvisible>0));targets.sort((a,b)=>dist(e,a)-dist(e,b));let t=targets[0];if(!t)continue;let d=dist(e,t);e.face=t.x>e.x?1:-1;if(e.wind>0){e.wind-=dt;if(e.wind<=0&&d<66&&lineClear(e.x,e.y,t.x,t.y)){if(t.kind==='civil')damageCitizen(t,e.boss?15:10,'enemy');else hurtTeam(t,e.boss?18:10);}if(paused)return;continue;}
 if(d<420&&e.rcd<=0&&lineClear(e.x,e.y,t.x,t.y)){e.rcd=4;e.cast=.4;let a=Math.atan2(t.y-e.y,t.x-e.x);hostileShots.push({type:'green',x:e.x,y:e.y-35,dx:Math.cos(a)*230,dy:Math.sin(a)*230,t:2.2,damage:e.boss?12:9,r:8});}
 if(d<350){if(d>52){let slow=effects.some(f=>f.type==='field'&&f.t>0&&dist(e,f)<f.r)?.55:1,speed=(e.boss?58:69)*slow;moveActor(e,(t.x-e.x)/d*speed*dt,(t.y-e.y)/d*speed*dt);e.anim+=dt*7;e.moving=true;}else if(e.cd<=0&&lineClear(e.x,e.y,t.x,t.y)){e.wind=.55;e.cd=e.boss?1.8:2.3;}}}}

function update(dt){if(cinematic)return;player.watchTurn=Math.max(0,(player.watchTurn||0)-dt);clock+=dt;gateLock=Math.max(0,gateLock-dt);transition=Math.max(0,transition-dt);player.inv=Math.max(0,player.inv-dt);player.attack=Math.max(0,player.attack-dt);player.lock=player.emptyLock=0;player.slideCool=Math.max(0,player.slideCool-dt);
 if(updateOcean(dt))return;for(const id of Object.keys(ALIENS))player.cooldowns[id]=player.cooldowns[id].map(v=>Math.max(0,v-dt));player.cool=player.cooldowns[race==='osmo'&&player.form==='acid'?'acid':race==='osmo'&&player.form==='ghost'?'ghost':player.activeAlien];
 if(player.shield>0){player.shieldTime=Math.max(0,player.shieldTime-dt);if(player.shieldTime<=0)player.shield=0;}
 if(!newRace26()&&(player.alien||(race==='osmo'&&player.form!=='human'))){const id=race==='osmo'&&player.form==='acid'?'acid':race==='osmo'&&player.form==='ghost'?'ghost':player.activeAlien,prev=mastery();player.masteries[id]=Math.min(['swampfire115','echoecho118','humungousaur129','jetray136','spidermonkey136','goop139','bigchill139','chromastone141','benghostaf141','system148','cerebron154'].includes(id)?200:100,prev+dt*.2);for(const s of currentSkills())if(prev<s.unlock&&mastery()>=s.unlock){toast('Â¡'+alien().name+': '+s.name+' desbloqueado!');tone(900,.25);}player.battery=Math.max(0,player.battery-dt*(recal115()?200/180:100/120));if(player.battery<.000001)revert(true);}else if(!newRace26())player.battery=interference()?0:Math.min(omniCap53(),player.battery+dt*omniCap53()/(recal115()?60:40));
 let vx=stick.x+(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),vy=stick.y+(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);let len=Math.hypot(vx,vy);if(len>1){vx/=len;vy/=len;}player.moving=len>.12&&!player.leap&&!player.motion;if(player.moving){const dir64=direction64(vx,vy);if(dir64)player.walkDir64=dir64;}if(player.moving)player.watchOpen=false;
 if(player.motion){updateMotion(dt);}
 else if(player.leap){const l=player.leap;l.t=Math.max(0,l.t-dt);const progress=1-l.t;moveActor(player,l.startX+(l.x-l.startX)*progress-player.x,l.startY+(l.y-l.startY)*progress-player.y);player.attackFrame=4;player.attack=.15;if(l.t<=0){areaHit(player.x,player.y,145,l.damage,.6);effects.push({type:'slam',x:player.x,y:player.y,r:145,t:.65,max:.65});burst(player.x,player.y-5,25,'#d3bba0');shake=.25;player.leap=null;player.motion=null;player.attackFrame=5;player.attack=.4;}}
 else if(player.moving&&!player.wolfDash&&!player.wolfGrab){player.anim+=dt*9;player.dx=vx;player.dy=vy;if(Math.abs(vx)>.05)player.face=vx>0?1:-1;let speed=moveSpeed()*(player.crouching?.6:1)*(effects.some(f=>f.type==='tornado'&&f.t>0)?.6:1);moveActor(player,vx*speed*dt,vy*speed*(underwater()||inSpace134()?1:.75)*dt);if(checkGate(vx,vy))return;}else player.anim=0;
 if(held>=0)attack(held);
 updateCitizens(dt);updateLaw(dt);const beforeZone=zone;updateEnemies(dt);if(zone!==beforeZone)return;
 if(net.role!=='guest')for(let i=0;i<enemies.length;i++)for(let j=i+1;j<enemies.length;j++){const a=enemies[i],b=enemies[j];if(!a.alive||!b.alive)continue;const d=dist(a,b);if(d>0&&d<38){const push=(38-d)*Math.min(.5,dt*4),dx=(a.x-b.x)/d*push,dy=(a.y-b.y)/d*push;moveActor(a,dx,dy);moveActor(b,-dx,-dy);}}
 for(const p of projectiles){let nx=p.x+p.dx*dt,ny=p.y+p.dy*dt;p.t-=dt;if(!lineClear(p.x,p.y+35,nx,ny+35)){p.t=0;burst(p.x,p.y,5,'#c6d7b2');continue;}p.x=nx;p.y=ny;for(const t of combatants())if(t.alive&&Math.hypot(t.x-p.x,t.y-36-p.y)<(t.chapter2==='hog'&&t.growth>0?48:30)+p.r){if(p.type==='boulder'){areaHit(t.x,t.y,85,p.damage,.4);effects.push({type:'slam',x:t.x,y:t.y,r:85,t:.4,max:.4});}else {damageTarget(t,p.damage);if(p.type==='goo')applyStatus(t,'slow',3);if(p.type==='toxin')applyStatus(t,'poison',5,p.poisonDamage);}p.t=0;break;}if(Math.random()<.25)burst(p.x,p.y,1,['water','waterlance'].includes(p.type)?'#a1eefa':p.type==='plasma16'?'#aaff44':p.type==='crystal'?'#9dfadf':p.type==='boulder'?'#c6b9a1':p.pink?'#ff83de':'#ff9c3b');}
 for(const p of hostileShots){if(p.t<=0)continue;if(eatProjectile106(p,dt))continue;let nx=p.x+p.dx*dt,ny=p.y+p.dy*dt;p.t-=dt;if(!lineClear(p.x,p.y+35,nx,ny+35)){p.t=0;continue;}p.x=nx;p.y=ny;if(eatProjectile106(p,dt))continue;for(const t of [...teamTargets(),...(p.type==='green'?citizens.filter(c=>c.alive):[])])if(Math.hypot(t.x-p.x,t.y-35-p.y)<29+p.r){if(t.kind==='civil')damageCitizen(t,p.damage,'enemy');else{hurtTeam(t,p.damage);if(p.wasp21)applyStatus(t,'poison',4,3);}p.t=0;break;}if(zone!==beforeZone)return;}
 for(const fx of effects){fx.t-=dt;
 if(fx.type==='flurry'||fx.type==='tornado'){fx.x=player.x;fx.y=player.y;fx.tick-=dt;const count=fx.type==='flurry'?3:6;if(fx.tick<=0&&fx.pulses<count){fx.tick+=fx.type==='flurry'?.09:.32;fx.pulses++;if(fx.type==='tornado')areaHit(fx.x,fx.y,fx.r,fx.damage,.1);else for(const t of combatants())if(t.alive&&dist(player,t)<fx.r&&lineClear(player.x,player.y,t.x,t.y)){const a=Math.atan2(t.y-player.y,t.x-player.x);if(Math.abs(Math.atan2(Math.sin(a-fx.a),Math.cos(a-fx.a)))<1.15)damageTarget(t,fx.damage,.05);}}}
if((fx.type==='meteor'||fx.type==='skycrystal')&&!fx.hit&&fx.t<.37){fx.hit=true;shake=.32;burst(fx.x,fx.y-30,40,fx.type==='skycrystal'?'#b8ffed':fx.pink?'#ff91e8':'#ffc24b');areaHit(fx.x,fx.y,fx.r,fx.damage);tone(fx.type==='skycrystal'?180:70,.35,'sawtooth');}
 if(fx.type==='field'||fx.type==='quake'){fx.tick-=dt;if(fx.tick<=0&&(fx.type!=='quake'||fx.pulses<3)){fx.tick+=fx.type==='quake'?.5:.75;fx.pulses=(fx.pulses||0)+1;areaHit(fx.x,fx.y,fx.r,fx.damage,fx.type==='quake'?.3:0);if(fx.type==='quake'){shake=.12;burst(fx.x,fx.y,12,'#dcccb0');}}}}
 for(const p of particles){p.x+=p.dx*dt;p.y+=p.dy*dt;p.dy+=70*dt;p.t-=dt;}for(const n of numbers){n.y-=25*dt;n.t-=dt;}for(const ar of [particles,projectiles,hostileShots,numbers,effects])for(let i=ar.length-1;i>=0;i--)if(ar[i].t<=0)ar.splice(i,1);
 updateExpansion(dt);while(particles.length>230)particles.shift();shake=Math.max(0,shake-dt);flash=Math.max(0,flash-dt);toastTime-=dt;if(toastTime<=0)$('#toast').classList.remove('show');saveClock+=dt;if(saveClock>4){saveClock=0;save();}
 cam.x+=(clamp(player.x-W*.48/sceneZoom(),0,cameraMaxX())-cam.x)*Math.min(1,dt*5);cam.y+=((zone===CITY21?cityCameraY22():clamp(player.y-H*.61/sceneZoom(),0,cameraMaxY()))-cam.y)*Math.min(1,dt*4);hud();
}

function hud(){const p=player,id=p.alien?p.activeAlien:p.selected,def=ALIENS[id];$('#form').textContent=p.alien?def.name.toUpperCase():'HUMANO';$('#level').textContent='NV. '+p.level;$('#hpfill').style.width=clamp(p.hp/maxHP()*100,0,100)+'%';$('#hptext').textContent=Math.ceil(p.hp)+' / '+maxHP();$('#xpfill').style.width=(p.level===100?100:p.xp/xpNeed()*100)+'%';$('#xptext').textContent=p.level===100?'NIVEL MÃXIMO':p.xp+' / '+xpNeed()+' EXP';$('#batteryfill').style.width=p.battery+'%';$('#batterytext').textContent=Math.floor(p.battery)+'%';$('#batteryhint').textContent=p.alien?'Transformado Â· '+Math.ceil(p.battery*1.2)+' s de energÃ­a':p.battery<100?'Carga completa en '+Math.ceil((100-p.battery)*.4)+' s Â· Ya puedes usarla':'Listo para transformar';$('#masteryfill').style.width=mastery()+'%';$('#masterytext').textContent=Math.floor(mastery())+'%';$('#masterylabel').textContent='MAESTRÃA '+def.name.toUpperCase();$('#masteryfill').style.background=def.color;
 $('#transformlabel').textContent=p.alien?'VOLVER A HUMANO':'TRANSFORMAR';$('#transformhint').textContent=p.battery<=0?'RECARGANDO':def.name.toUpperCase();$('#transform').classList.toggle('unavailable',!p.alien&&p.battery<=0);$('#dialname').textContent=def.name.toUpperCase();$('#dialmastery').textContent='MAESTRÃA '+Math.floor(mastery())+'%';$('#dialprev').disabled=p.alien;$('#dialnext').disabled=p.alien;
 const nearNpc=npcHere()&&dist(player,npc)<=130,nearChest=region().chest&&!opened.includes(region().id)&&dist(player,region().chest)<100;$('#talk').classList.toggle('hidden',!nearNpc&&!nearChest);$('#talk').textContent=nearNpc?'â—† HABLAR':'â—† ABRIR COFRE';
 document.querySelectorAll('.attack').forEach((b,i)=>{const skill=def.skills[i],locked=(!p.alien&&i!==0)||(p.alien&&mastery()<skill.unlock);b.classList.toggle('locked',locked);b.classList.toggle('cooldown',p.cool[i]>0);b.classList.toggle('diamond',id==='diamond');b.classList.toggle('fourarms',id==='fourarms');b.classList.toggle('xlr8',id==='xlr8');b.querySelector('span').textContent=i===0&&!p.alien?'PUÃ‘O':skill.short;b.querySelector('small').textContent=locked?'M '+skill.unlock:p.cool[i]>.1?p.cool[i].toFixed(1)+' s':'LISTO';});
 $('#questtext').textContent=quest.state==='new'?'Habla con Max':quest.state==='active'?'Robots de Vilgax Â· '+quest.kills+' / 7':quest.state==='return'?'Regresa con Max':'Patrullas completadas Â· '+(quest.completions||1);$('#questsub').textContent=zone!==1?'Max estÃ¡ en el Refugio Â· Ver mapa':quest.state==='active'?'Robots al este â†’':quest.state==='done'?'Habla con Max para repetir':quest.state==='return'?'â† Cobra tu recompensa':'AcÃ©rcate a Max â—†';$('#clock').textContent=region().name.toUpperCase();$('#shieldstatus').classList.toggle('hidden',p.shield<=0);$('#shieldstatus').textContent='ESCUDO '+Math.ceil(p.shield)+' / '+(greyForm()?90*healthFactor():80)+' Â· '+Math.ceil(p.shieldTime)+' s';$('#slide').classList.toggle('hidden',!p.alien||p.activeAlien!=='diamond');$('#slide').classList.toggle('cooldown',p.slideCool>0);$('#slide small').textContent=p.slideCool>0?p.slideCool.toFixed(1)+' s':'LISTO Â· F';$('#lawstatus').textContent='KARMA '+law.karma+' Â· '+(wantedLevel()?'â˜…'.repeat(wantedLevel())+' BÃšSQUEDA Â· '+Math.ceil(law.timer)+' s fuera de vista':'SIN BÃšSQUEDA');$('#lawstatus').classList.toggle('wanted',wantedLevel()>0);drawMiniMap();hudExpansion();hudV8();hudV9();hudV10();hudV11();hudV12();hudV13();hudV14();hudV15();hudV16();
}
function spriteInfo(row){if(row===90)return {table:OMNI_V16_FRAMES.ultra16,sheet:art.ultra16};if(row>=80&&row<=84){const k=row===80?'grey15':'voidmobs15';return {table:OMNI_V15_FRAMES[k].slice(row===80?0:(row-81)*6,row===80?12:(row-80)*6),sheet:art[k]};}if(row>=74&&row<=76){const k=['ghostlady14','pinkfire14','hex14'][row-74];return {table:OMNI_V14_FRAMES[k],sheet:art[k]};}if(row===70||row===71)return {table:OMNI_V13_FRAMES.ghost13.slice((row-70)*8,(row-69)*8),sheet:art.ghost13};if(row===72)return {table:OMNI_V13_FRAMES.ghostboss13,sheet:art.ghostboss13};if(row===73)return {table:OMNI_V13_FRAMES.guards13,sheet:art.guards13};if(row>=50&&row<=52){const k=['animo12','frog12','hog12'][row-50];return {table:OMNI_V12_FRAMES[k],sheet:art[k]};}if(row>=60&&row<=62)return {table:OMNI_V12_FRAMES.activate12.slice((row-60)*4,(row-59)*4),sheet:art.activate12};if(row===40)return {table:OMNI_V11_FRAMES.wolf,sheet:art.wolf11};if(row>=41&&row<=48)return {table:OMNI_V11_FRAMES['swim'+(row-41)],sheet:row<45?art.swimA11:art.swimB11};if(row>=30&&row<=38){const keys={30:'aquaticLand',31:'aquaticTail',32:'osmoWater',33:'swim0',34:'swim1',35:'swim2',36:'swim3',37:'manta',38:'predator'},k=keys[row];return {table:OMNI_V10_FRAMES[k],sheet:art[row>=33&&row<=36?'humanSwim10':row>=37?'seaEnemies10':k+'10']};}if(row===29)return {table:OMNI_V9_FRAMES.neko,sheet:art.neko9};if(row===26)return {table:OMNI_V8_FRAMES.fourconcert,sheet:art.fourconcert8};if(row===27)return {table:OMNI_V8_FRAMES.kim,sheet:art.kim8};if(row===28)return {table:OMNI_V8_FRAMES.robot,sheet:art.robot8};if(row===21)return {table:OMNI_V7_FRAMES.insect,sheet:art.insect7,anchors:OMNI_V7_FRAMES.anchors.insect,base:220};if(row===22||row===23)return {table:OMNI_V7_FRAMES.npcs[row-22],sheet:art.npcs7};if(row===24)return {table:OMNI_V7_FRAMES.osmo,sheet:art.osmo7,anchors:OMNI_V7_FRAMES.anchors.osmo,base:320};if(row===25)return {table:OMNI_V7_FRAMES.combat,sheet:art.combat7,anchors:OMNI_V7_FRAMES.anchors.combat,base:270};if(row===16)return {table:window.OMNI_V6_FRAMES.bestia,sheet:art.bestia6};if(row===17||row===18)return {table:window.OMNI_V6_FRAMES.knights[row-17],sheet:art.knights6};if(row===19)return {table:window.OMNI_V6_FRAMES.full,sheet:art.full6};if(row===20)return {table:window.OMNI_V6_FRAMES.jump,sheet:art.jump6};if(row===13)return {table:window.OMNI_V5_FRAMES.boss,sheet:art.boss};if(row===14||row===15)return {table:window.OMNI_V5_FRAMES.osmo[row-14],sheet:art.osmo};if(row===9||row===10)return {table:window.OMNI_V6_FRAMES.skins[row-9],sheet:art.skins6};if(row===11)return {table:window.OMNI_V4_FRAMES.xlr8,sheet:art.speed};if(row===12)return {table:window.OMNI_V4_FRAMES.slide,sheet:art.slide};if(row===5)return {table:window.OMNI_V3_FRAMES.four,sheet:art.four};if(row===2||row>=6)return {table:window.OMNI_V3_FRAMES.actors[row===2?0:row-5],sheet:art.actors};if(row===3||row===4)return {table:newFrames[row-3],sheet:art.expansion};return {table:frames[row],sheet:art.characters};}
function sprite(row,frame,x,y,height,face=1,alpha=1){const {table,sheet,anchors,base}=spriteInfo(row),f=table[frame]||table[0],anchor=anchors?.[frame],scale=height/(base|| (row===20?table[1][3]:row===12?table[3][3]:table[0][3])),dw=f[2]*scale,dh=f[3]*scale;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(face*(row===16&&[0,1,2,8,10,11].includes(frame)?-1:1),1);ctx.globalAlpha=alpha;ctx.drawImage(sheet,...f,Math.round(anchor?(f[0]-anchor[0])*scale:-dw*.5),Math.round(anchor?(f[1]-anchor[1])*scale:-dh),Math.round(dw),Math.round(dh));ctx.restore();}

function txt(text,x,y,size=11,color='#fff',align='center'){ctx.font='bold '+size+'px Arial';ctx.textAlign=align;ctx.fillStyle='#080c19';ctx.fillText(text,Math.round(x+1),Math.round(y+2));ctx.fillStyle=color;ctx.fillText(text,Math.round(x),Math.round(y));}

function crystal(x,y,w,h,angle=0){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle='#63cdaa';ctx.beginPath();ctx.moveTo(0,-h/2);ctx.lineTo(w/2,-h*.13);ctx.lineTo(w*.3,h*.3);ctx.lineTo(0,h/2);ctx.lineTo(-w*.4,h*.2);ctx.lineTo(-w/2,-h*.1);ctx.closePath();ctx.fill();ctx.strokeStyle='#193d3c';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#c5ffed';ctx.beginPath();ctx.moveTo(0,-h/2);ctx.lineTo(w/2,-h*.13);ctx.lineTo(0,h/2);ctx.lineTo(-w*.1,0);ctx.closePath();ctx.fill();ctx.strokeStyle='#f3fff8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-h*.4);ctx.lineTo(-w*.3,-h*.07);ctx.stroke();ctx.restore();}
function drawGate(x,to,left){const y=region().exitY;ctx.fillStyle='#0a111c88';ctx.fillRect(x-40,y-5,80,8);ctx.fillStyle='#594b3c';ctx.fillRect(x-3,y-67,6,67);ctx.fillStyle='#233e3e';ctx.fillRect(x-42,y-82,84,27);ctx.strokeStyle='#abc5aa';ctx.strokeRect(x-42,y-82,84,27);txt((left?'â† ':'')+to+(left?'':' â†’'),x,y-64,8,'#dbf0c8');ctx.fillStyle='#9adbbe';ctx.globalAlpha=.4+Math.sin(clock*3)*.15;ctx.fillRect(x-20,y+5,40,3);ctx.globalAlpha=1;}
function draw(){if(window.OmniRhythm?.active||window.OmniCooking?.active)return;ctx.imageSmoothingEnabled=false;ctx.fillStyle='#080e1d';ctx.fillRect(0,0,W,H);if(!ready)return;ctx.save();let cx=started||zone===CITY21?cam.x:140,cy=started||zone===CITY21?cam.y:205;const zoom=started?sceneZoom():1;ctx.scale(zoom,zoom);ctx.translate(-Math.round(cx)+(shake?Math.random()*6-3:0),-Math.round(cy)+(shake?Math.random()*4-2:0));drawScene(ctx,zone,false);
 let daylight=zone===ANUR38||zone===CENIZAL38||zone===FOREST35||zone===CITY21||inAF133()||inSpace134()||inPetro137()?0:dayMode==='dÃ­a'?1:dayMode==='ciclo'?(1-Math.cos(clock/90*Math.PI))/2:0;if(daylight>0){ctx.globalAlpha=daylight;drawScene(ctx,zone,true);ctx.globalAlpha=1;}
 if(zone<3)for(let i=0;i<22;i++){let x=180+(i*137)%1250+Math.sin(clock*.4+i)*20,y=455+(i*97)%280+Math.cos(clock*.6+i)*8;ctx.globalAlpha=.3+Math.sin(clock*2+i)*.2;ctx.fillStyle='#b8e8a4';ctx.fillRect(x,y,2,2);}ctx.globalAlpha=1;
 if(started){const labels=['RUINAS','REFUGIO','RIBERA','ESCUELA','PARQUE','TORRE','FORTALEZA','BARRIO','SALÃ“N','TEN','CONCIERTO','DEVASTACIÃ“N','BELLWOOD','ARRECIFE','ALGAS','NAUFRAGIO','ABISMO','BOSQUE LUNAR','LABORATORIO','HOSPITAL','SEGURIDAD','ECTOPLASMA','CONTENCIÃ“N','ESCUELA ARCANA','UMBRAL','ARCOS','PUENTES','ASTEROIDE','CASINO','CENTRAL','ADMISIÃ“N','CONTENCIÃ“N','REACTOR','PANTANO','BELLWOOD','MINA'],l=region().links;if(l.left!==undefined)drawGate(region().minX+35,labels[l.left]||REGIONS[l.left]?.name,true);if(l.right!==undefined)drawGate(region().maxX-35,labels[l.right]||REGIONS[l.right]?.name,false);drawVerticalGates();drawBellwoodGate();
 const ch=region().chest;if(ch){ctx.fillStyle='#12252b88';ctx.fillRect(ch.x-22,ch.y-3,44,7);ctx.fillStyle=opened.includes(region().id)?'#5d635b':'#735a30';ctx.fillRect(ch.x-21,ch.y-25,42,24);ctx.fillStyle=opened.includes(region().id)?'#23383c':'#d4ba70';ctx.fillRect(ch.x-21,ch.y-25,42,6);ctx.fillStyle='#ead98b';ctx.fillRect(ch.x-3,ch.y-20,6,8);if(!opened.includes(region().id))txt('â—†',ch.x,ch.y-38+Math.sin(clock*3)*3,14,'#ffdf91');}}
 for(const fx of effects){if(['meteor','skycrystal','field'].includes(fx.type)){ctx.strokeStyle=fx.type==='meteor'?(fx.pink?'#ff76de':'#ff914b'):'#99f3d4';ctx.lineWidth=2;ctx.setLineDash([6,7]);ctx.beginPath();ctx.ellipse(fx.x,fx.y,fx.r,fx.r*.4,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);if(fx.type==='field'){ctx.fillStyle='#75e5bc22';ctx.fill();for(let i=0;i<12;i++){let a=i*2.399,rr=30+(i%4)*24;crystal(fx.x+Math.cos(a)*rr,fx.y+Math.sin(a)*rr*.4-15,13+(i%3)*4,28+(i%3)*11,Math.cos(a)*.3);}}}}
 drawCompanions113();drawFusionFX107();drawUpWorld106();drawStoryProps106();drawHospitalFloor();drawCars21();drawExpansion();drawV6Effects();drawV7Effects();drawV8Effects();drawOceanEffects();drawV11Effects();drawNetworkEffects();const actors=(started?[...cityActors163(),...(zone===NIGHT155?[{kind:'tenNPC158',y:TEN158.y,e:TEN158}]:zone===ALLEY158?[{kind:'monkeyNPC158',y:MONKEY158.y,e:MONKEY158}]:[]),...(zone===NIGHT155?[{kind:'nightNPC155',y:NPC155.y,e:NPC155}]:[]),...(npcHere()?[{kind:'npc',y:npc.y}]:[]),...(extraNPC()?[{kind:'questnpc',y:extraNPC().y,e:extraNPC()}]:[]),...[...enemies,...citizens,...officers,...remoteTargets()].filter(e=>e.alive&&(zone!==CITY21||visible21(e,220))).map(e=>({kind:e.kind||'enemy',y:e.y,e})),...[...cloneTargets47(),...remoteClones47()].map(e=>({kind:'dittoClone47',y:e.y,e})),...(pakmarVisible105()?[{kind:'pakmar105',y:pakmar105.y,e:pakmar105}]:[]),...desertActors72(),...stormActors47(),...(zone===ANUR38?anurActors38():[]),...afActors133(),{kind:'player',y:player.y}]:[]).sort((a,b)=>a.y-b.y);
 for(const a of actors){if(a.kind==='cityProp163'){drawProp163(a.e);continue;}if(a.e?.swallowed106>clock)continue;if(a.kind==='afprop133'){paintAF133(ctx,a.e);continue;}if(a.kind==='desertProp72'){drawDesertProp72(ctx,a);continue;}if(a.kind==='questnpc'&&a.e?.venue68)continue;if(a.kind==='player'&&player.possession)continue;let o=a.kind==='npc'?npc:a.kind==='player'?player:a.e;ctx.fillStyle='#01051180';ctx.beginPath();ctx.ellipse(o.x,o.y-2,a.kind==='player'&&player.alien?28:22,7,0,0,Math.PI*2);ctx.fill();
 if(a.kind==='tenNPC158'||a.kind==='monkeyNPC158'){drawNPC158(a.kind==='monkeyNPC158');}else if(a.kind==='nightNPC155'){tile155(ctx,informantArt155,4,2,0,Math.floor(clock*4)%4,o.x,o.y,150,155);txt(T155('npc'),o.x,o.y-165,11,'#b9ef92');txt('90â€“120',o.x,o.y-180,10,'#9bcfff');}
 else if(a.kind==='pakmar105'){sprite(604,dist(player,o)<145?3:Math.floor(clock*2)%2,o.x,o.y,115,1);txt('Pakmar',o.x,o.y-130,11,'#dcf9dc');}
 else if((a.kind==='player'||a.kind==='remote')&&drawShipActor134(o)){}
 else if(a.kind==='dittoClone47'){drawClone47(o); }
 else if((a.kind==='player'||a.kind==='remote')&&drawDown112(o)){}
 else if((a.kind==='player'||a.kind==='remote')&&drawMounted113(o)){}
 else if((a.kind==='player'||a.kind==='remote')&&drawSuit80(o)){}
 else if(a.kind==='player'&&drawNew87(o)){}
 else if(a.kind==='player'&&drawAttack78(o)){}
 else if(a.kind==='remote'&&drawNew87(o)){}
 else if(a.kind==='remote'&&drawAttack78(o)){}
 else if(a.kind==='player'&&drawDirectional64(o)){}
 else if(a.kind==='player'&&dittoForm47(o)){drawDitto47(o); }
 else if(a.kind==='remote'&&dittoForm47(o)){drawDitto47(o); }
 else if(a.e?.stormProp47){propDraw47(ctx,a.e); }
 else if(a.e?.orderEnemy93||a.e?.orderNPC93){drawOrderActor93(a.e);}
 else if(a.e?.petro137){drawTetrax137(a.e);}
 else if(a.e?.season121){drawSeasonActor121(a.e);}
 else if(a.e?.spark106){drawStoryActor106(a.e);}
 else if(a.e?.exp104){drawExpActor104(a.e);}
 else if(a.e?.arena102){drawArenaActor102(a.e);}
 else if(a.e?.halloween87){drawEnemy87(a.e);}
 else if(a.e?.story80){drawEnemy80(o);}
 else if(a.e?.mob78){drawMob78(o);}
 else if(a.e?.maxRobot71){drawRobot71(o);}
 else if(a.e?.worship58){drawWorship58(o);}
 else if(a.e?.bigTick56||a.e?.tickNode56){drawTick56(o);}
 else if(a.e?.vilgax53){drawBoss53(o);}
 else if(a.kind==='player'&&zone===SHIP53&&player.vilgax53?.state==='captive'){sprite(avatarRow53(),3,o.x,o.y,115,1);}
 else if(a.e?.techBoss62){drawTechEnemy62(a.e); }
 else if(a.e?.fullArmored51){}
 else if(a.e?.storm47){drawStormEnemy47(o); }
 else if(a.kind==='castlenpc45'){drawCastleNPC45(o); }
 else if(a.kind==='player'&&corForm45(o)){drawCorrosion45(o); }
 else if(a.kind==='remote'&&corForm45(o)){drawCorrosion45(o); }
 else if(a.kind==='player'&&drawCorruption39(o)){}
 else if(a.kind==='remote'&&drawCorruption39(o)){}
 else if(a.kind==='player'&&benForm38()){drawBen38(o); }
 else if(a.kind==='remote'&&benForm38(o)){drawBen38(o); }
 else if(a.kind==='npc'){sprite(3,dist(player,npc)<130&&Math.floor(clock)%5===0?3:0,o.x,o.y,103,player.x>=npc.x?1:-1);txt('MAX',o.x,o.y-115,10,'#dcdfc8');txt(quest.state==='new'?'â—†':quest.state==='return'?'!':'Â·',o.x,o.y-132,18,'#e3d99a');}
 else if(a.kind==='questnpc'&&o===animo103){sprite(600,dist(player,o)<140?3:0,o.x,o.y,140,1);txt(o.name,o.x,o.y-154,11,'#d9efbe');txt(words97('EXPEDICIÃ“N Â· 50 RONDAS','EXPEDITION Â· 50 ROUNDS','EXPEDIÃ‡ÃƒO Â· 50 RODADAS','KEÅžÄ°F Â· 50 TUR'),o.x,o.y-173,9,'#c8f484');}
 else if(a.kind==='questnpc'&&o===phill25){sprite(111,dist(player,o)<140?1:0,o.x,o.y,110,o.face);txt('PHILL Â· NV.30',o.x,o.y-128,10,'#e0e8dc');txt(player.phill25.state==='return'?'! Â· COBRAR':'PATRULLA DEL VACÃO',o.x,o.y-145,9,'#e2d499');}
 else if(a.kind==='questnpc'&&(o===bouman28||o===kai28)){sprite(o.row,dist(player,o)<145?1:0,o.x,o.y,115,o.face);txt(o.name,o.x,o.y-130,11,'#c9f7be');}
 else if(a.kind==='questnpc'&&o===kevinNPC31){}
 else if(a.kind==='questnpc'&&(o===maxAF58||o===keeper58)){}
 else if(a.kind==='questnpc'&&o.roomDoor51){if(!inRoom51())txt(o.name,o.x,o.y-25,12,'#bdfb9d','center');}
 else if(a.kind==='questnpc'){sprite(o.row,dist(player,o)<140?3:0,o.x,o.y,110,o.face);txt(o.name,o.x,o.y-122,10,'#ffe0a0');txt(o===agent38?'MISIÃ“N Â· 1000 EXP':o===agent35?'MISIÃ“N Â· 650 EXP':o===neko?'COCINA Â· +10 MONEDAS':o===kim?'â™ª BATALLA DE BAILE':o===ten?'HISTORIA Â· CLANCY NV.35':player.knightQuest.state==='return'?'!':'â—† NV. 13',o.x,o.y-139,9,'#e7d997');}
 else if(a.kind==='anurprop38'){drawAnurProp38(o); }
 else if(a.kind==='anurnpc38'){drawAnurLocal38(o); }
 else if(a.e?.corrodium39||a.e?.mental39){drawNative39(o); }
 else if(a.e?.ultradron38){drawUltra38(o); }
 else if(a.e?.vilgax35){drawVilgax35(a.e); }
 else if(a.e?.carnivore19){drawCarnivore19(a.e); }
 else if(a.e?.clancy21){drawClancy21(a.e); }
 else if(a.e?.wasp21){drawWasp21(a.e); }
 else if(a.e?.city21){drawCityPerson21(a.e); }
 else if(a.e?.mineMummy25||a.e?.mineGuard25){drawMineEnemy25(a.e); }
 else if(a.e?.kevin31){drawKevin31(a.e); }
 else if(a.kind==='guard'){drawGuard(a.e);}
 else if(a.kind==='ghostboss'){drawGhostBoss(a.e);}
 else if(a.kind==='void'){drawVoidEnemy(a.e);}
 else if(a.kind==='hex'){drawHex(a.e);}
 else if(a.kind==='chapter2'){drawChapter2(a.e);}
 else if(a.kind==='wolfboss'){drawWolf(a.e);}
 else if(a.kind==='sea'){drawSeaEnemy(a.e);}
 else if(a.kind==='player'&&race==='omni'&&(scan17||fieldScan18||mineScanning25())){drawScanPose18(o.x,o.y); }
 else if(a.kind==='player'&&race==='omni'&&!player.alien&&suitOn28()){drawOmni29(player); }
 else if(a.kind==='player'&&sys148()){drawSystem148(player); }
 else if(a.kind==='player'&&suitOn28()){drawSuit28(o); }
 else if(a.kind==='player'&&player.solarCast28){sprite(176,Math.min(5,Math.floor((1-player.solarCast28.t/player.solarCast28.max)*6)),o.x,o.y,145,player.face); }
 else if(a.kind==='player'&&underwater()&&race==='omni'&&!player.alien&&!player.watchOpen){drawUnderwaterHuman(player,o.x,o.y,player.face);}
 else if(a.kind==='robot'){drawRobot(a.e);}
 else if(a.kind==='boss'){const e=a.e,f=e.cast>0?e.frame:e.moving?1+Math.floor(e.anim)%2:0;sprite(13,f,e.x,e.y,155,e.face,e.hit>0?.5:1);txt('JEFE ÃGNEO Â· NV. 10',e.x,e.y-171,10,'#ffbd84');ctx.fillStyle='#281720';ctx.fillRect(e.x-50,e.y-163,100,6);ctx.fillStyle='#ff9c60';ctx.fillRect(e.x-50,e.y-163,100*Math.max(0,e.hp/e.max),6);}
 else if(a.kind==='remote'){drawRemote(a.e);}
 else if(a.kind==='player'&&sys148()){drawSystem148(player); }
 else if(a.kind==='player'&&newRace26()){drawRace26(player); }
 else if(a.kind==='player'&&race==='osmo'){drawOsmo(player.attack>0?3:player.moving?1+walkFrame166(player,2,Math.floor(player.anim)%2):0,o.x,o.y-jumpHeight(),player.face);}
 else if(a.kind==='player'){let f=player.attack>0?(player.alien&&['fourarms','xlr8','bestia'].includes(player.activeAlien)?player.attackFrame:3):player.moving?(walkFrame166(player,2,Math.floor(player.anim)%2))+1:0,bob=player.moving?Math.sin(player.anim*Math.PI)*1.5:Math.sin(clock*2)*.6;if(player.alien){ctx.fillStyle=player.activeAlien==='diamond'?'#7affe01a':player.activeAlien==='xlr8'?'#62dfff22':'#ff842017';ctx.beginPath();ctx.ellipse(o.x,o.y-3,51,17,0,0,Math.PI*2);ctx.fill();if(!paused&&!underwater()&&player.activeAlien==='heatblast'&&Math.random()<.2)particles.push({x:o.x+(Math.random()-.5)*22,y:o.y-100,dx:0,dy:-30,t:.5,color:'#ffca59',size:2});}
 let row=player.alien?alien().row:SKINS[player.skin].row;if(player.jump>0&&!player.alien){if(player.skin===0){row=20;f=player.jump>.65?0:player.jump>.35?1:player.jump>.1?2:3;}else f=player.jump>.1?4:5;}if(player.motion&&player.motion.type==='slide'){row=12;const t=player.motion.max-player.motion.t;f=t<.12?0:player.motion.t<.12?3:1+(Math.floor(t*12)%2);}const pose=combatPose(player,row,f);sprite(pose.row,pose.f,o.x,o.y+bob-pose.lift-jumpHeight()-(player.leap?Math.sin((1-player.leap.t)*Math.PI)*140:0),player.alien?(player.activeAlien==='ultra'?ultraHeight(player):player.activeAlien==='grey'?52:underwater()&&player.activeAlien!=='aquatic'?(player.activeAlien==='fourarms'?92:76):player.activeAlien==='fourarms'?144:player.activeAlien==='bestia'?92:player.activeAlien==='benmomia'?165:123):98,player.face,player.ghostInvisible>0?.25:player.ghostPhase>0?.55:player.inv>0&&Math.floor(clock*12)%2===0?.45:1);
 if(player.shield>0){ctx.save();ctx.translate(o.x,o.y-55);ctx.fillStyle='#8ae9cf22';ctx.strokeStyle=player.shield<25?'#f7ffdd':'#b6ffe7';ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<6;i++){let a=Math.PI/3*i-Math.PI/2,x=Math.cos(a)*51,y=Math.sin(a)*66;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fill();ctx.stroke();if(player.shield<40){ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-25,-30);ctx.lineTo(-8,-10);ctx.lineTo(-17,0);ctx.lineTo(2,25);ctx.stroke();}ctx.restore();}}
 else if(a.kind==='civil'||a.kind==='police'){const e=a.e,f=e.fear>0?3:e.moving?(Math.floor(e.anim)%2)+1:0;sprite(a.kind==='police'?8:e.row,f,e.x,e.y,108,e.face,e.hit>0||e.inv>0?.65:1);txt(a.kind==='police'?'POLICÃA':'CIVIL',e.x,e.y-120,8,a.kind==='police'?'#a3caff':'#a6e2db');if(e.hp<e.max){ctx.fillStyle='#14212b';ctx.fillRect(e.x-22,e.y-115,44,4);ctx.fillStyle=a.kind==='police'?'#7faaf2':'#8bccb1';ctx.fillRect(e.x-22,e.y-115,44*Math.max(0,e.hp/e.max),4);}}
 else if(a.e?.quest170){drawEnemy170(a.e);}else if(a.e?.quest158){drawEnemy158(a.e);}else if(a.e?.quest155){drawParasite155(a.e);}else if(a.e?.gate151){drawMonster151(a.e);}else if(a.e?.igris149){drawIgris149(a.e);}else{const e=a.e;let f=e.wind>0||e.cast>0?3:e.moving?(Math.floor(e.anim)%2)+1:0;sprite(e.knight==='melee'?17:e.knight==='ranged'?18:2,f,e.x,e.y,e.knight?119:e.boss?113:98,e.face,e.hit>0?.5:1);let barY=e.y-(e.knight?134:e.boss?126:111);if(e.knight)txt('CABALLERO Â· NV. 15',e.x,barY-7,8,'#b8beec');ctx.fillStyle='#101522';ctx.fillRect(e.x-24,barY,48,5);ctx.fillStyle=e.boss?'#e7b070':'#b07c9a';ctx.fillRect(e.x-24,barY,48*Math.max(0,e.hp/e.max),5);if(e.boss)txt('CABECILLA',e.x,barY-6,8,'#ffcc96');if(e.wind>0){ctx.strokeStyle='#ff786d';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(e.x,e.y,43,16,0,0,Math.PI*2);ctx.stroke();txt('!',e.x,e.y-127,18,'#ffaaa0');}}if(o.corrosionMark45>0)drawCorMark45(o);}
 for(const p of hostileShots){if(drawProjectile28(ctx,p))continue;if(p.wasp21){drawSting21(ctx,p);continue;}ctx.fillStyle=p.type==='hexbolt'?'#a442db':p.type==='green'?'#46a744':p.type==='bossfire'?'#ff742a':'#427dd6';ctx.fillRect(p.x-11,p.y-8,22,16);ctx.fillStyle=p.type==='hexbolt'?'#f0bdff':p.type==='green'?'#b5ff74':p.type==='bossfire'?'#ffe396':'#c4eeff';ctx.fillRect(p.x-6,p.y-4,12,8);}
 for(const p of projectiles){if(drawProjectile28(ctx,p))continue;if(p.type==='plasma16'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.dy,p.dx));ctx.fillStyle='#7aed28';ctx.fillRect(-22,-8,36,16);ctx.fillStyle='#edffb6';ctx.fillRect(-8,-4,22,8);ctx.restore();continue;}if(p.type==='water'||p.type==='waterlance'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.dy,p.dx));ctx.fillStyle='#68d6ff';ctx.fillRect(-24,-7,42,14);ctx.fillStyle='#d6ffff';ctx.fillRect(-14,-3,33,6);ctx.restore();continue;}if(p.type==='goo'||p.type==='toxin'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.dy,p.dx));ctx.fillStyle=p.type==='toxin'?'#9972d6':'#508b24';ctx.fillRect(-16,-8,29,16);ctx.fillStyle='#bbfa61';ctx.fillRect(-9,-5,19,10);ctx.fillStyle='#efff9f';ctx.fillRect(1,-3,6,4);ctx.fillStyle='#7dc634';ctx.fillRect(-25,-4,6,6);ctx.restore();}else if(p.type==='wood'||p.type==='electric'){ctx.fillStyle=p.type==='wood'?'#c08c51':'#a3f6ff';ctx.fillRect(p.x-17,p.y-4,34,8);ctx.fillRect(p.x-7,p.y-9,14,18);}else if(p.type==='boulder'){ctx.fillStyle='#68655e';ctx.beginPath();for(let i=0;i<7;i++){let a=i*Math.PI*2/7+clock*3;i?ctx.lineTo(p.x+Math.cos(a)*25,p.y+Math.sin(a)*22):ctx.moveTo(p.x+Math.cos(a)*25,p.y+Math.sin(a)*22);}ctx.closePath();ctx.fill();ctx.fillStyle='#b0a78c';ctx.fillRect(p.x-12,p.y-12,20,9);}else if(p.type==='crystal')crystal(p.x,p.y,12,30,Math.atan2(p.dy,p.dx)+Math.PI/2);else{ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.dy,p.dx));ctx.fillStyle=p.pink?'#df258e':'#ee6028';ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(6,-9);ctx.lineTo(-8,-11);ctx.lineTo(-24-Math.sin(clock*27)*7,-5);ctx.lineTo(-17,0);ctx.lineTo(-29,7);ctx.lineTo(-5,10);ctx.lineTo(7,7);ctx.closePath();ctx.fill();ctx.fillStyle=p.pink?'#ff88e9':'#ffca58';ctx.fillRect(-9,-6,16,12);ctx.fillStyle=p.pink?'#fff0fb':'#fff3b1';ctx.fillRect(0,-3,8,6);ctx.restore();}}
 for(const fx of effects){let progress=1-fx.t/fx.max;ctx.globalAlpha=Math.min(1,fx.t*4);if(fx.type==='tornado'){ctx.strokeStyle=fx.costume20==='ultraskin20'?'#beff62':fx.xlrLime19?'#b1ff51':'#a1edff';ctx.lineWidth=3;for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(fx.x,fx.y-15-i*17,60-i*6,10,Math.sin(clock*13+i)*.12,clock*10+i,clock*10+i+Math.PI*1.6);ctx.stroke();}}if(fx.type==='flurry'){ctx.strokeStyle=fx.costume20==='ultraskin20'?'#beff62':fx.xlrLime19?'#d5ff8a':'#d4faff';ctx.lineWidth=3;for(let i=0;i<3;i++){const x=fx.x+Math.cos(fx.a)*(35+progress*55),y=fx.y-38+i*7;ctx.beginPath();ctx.moveTo(x-player.face*20,y);ctx.lineTo(x+player.face*14,y);ctx.stroke();}}if(fx.type==='speedtrail'){ctx.strokeStyle=fx.color;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(fx.x-Math.cos(fx.a)*35,fx.y-Math.sin(fx.a)*20);ctx.lineTo(fx.x,fx.y);ctx.stroke();}if(fx.type==='sonic'){ctx.strokeStyle=fx.pink?'#ff8be8':'#e6eeee';ctx.lineWidth=4;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(fx.x,fx.y,Math.max(1,fx.r*progress-i*22),fx.a-.9,fx.a+.9);ctx.stroke();}}if(fx.type==='slam'||fx.type==='quake'){ctx.strokeStyle='#dac6a2';ctx.lineWidth=4;ctx.beginPath();let r=fx.r*(fx.type==='quake'?((progress*3)%1):progress);ctx.ellipse(fx.x,fx.y,r,r*.38,0,0,Math.PI*2);ctx.stroke();for(let i=0;i<8;i++){let a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(fx.x+Math.cos(a)*30,fx.y+Math.sin(a)*15);ctx.lineTo(fx.x+Math.cos(a+.1)*r*.7,fx.y+Math.sin(a+.1)*r*.3);ctx.lineTo(fx.x+Math.cos(a)*r,fx.y+Math.sin(a)*r*.4);ctx.stroke();}}if(fx.type==='ring'){ctx.strokeStyle=fx.pink?'#ff8be8':'#ffd570';ctx.lineWidth=9*(1-progress)+2;ctx.beginPath();ctx.ellipse(fx.x,fx.y,fx.r*progress,fx.r*progress*.6,0,0,Math.PI*2);ctx.stroke();}if(fx.type==='punch'){ctx.strokeStyle='#e7deb7';ctx.lineWidth=5;ctx.beginPath();ctx.arc(fx.x,fx.y,fx.r*progress,0,Math.PI*2);ctx.stroke();}if(fx.type==='meteor'||fx.type==='skycrystal'){let drop=clamp(progress/.65,0,1),y=fx.y-330*(1-drop)-45;
 if(fx.type==='skycrystal')crystal(fx.x,y,65,130,0);else{ctx.fillStyle=fx.pink?'#dd2397':'#f97824';ctx.fillRect(fx.x-17,y-10,34,48);ctx.fillStyle=fx.pink?'#ffd3f7':'#ffe084';ctx.fillRect(fx.x-10,y,20,31);}if(fx.hit){ctx.strokeStyle=fx.type==='skycrystal'?'#c8ffed':fx.pink?'#ffd3f7':'#ffda8b';ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(fx.x,fx.y,fx.r*(1-fx.t/.5),fx.r*.4*(1-fx.t/.5),0,0,Math.PI*2);ctx.stroke();}}ctx.globalAlpha=1;}
 for(const p of particles){ctx.globalAlpha=Math.min(1,p.t*3);ctx.fillStyle=p.color;ctx.fillRect(Math.round(p.x),Math.round(p.y),p.size,p.size);}ctx.globalAlpha=1;for(const n of numbers){ctx.globalAlpha=Math.min(1,n.t*3);txt(n.text,n.x,n.y,15,n.color);}ctx.globalAlpha=1;
 if(!started){sprite(newRace26()?raceRow26():race==='osmo'?14:SKINS[player.skin].row,Math.floor(clock*2)%2,765,660,158,1);sprite(4,0,1010,675,205,-1);}
 drawSensory();drawV13Effects();drawV15();for(const f of effects)drawUltraEffect16(f);cityLights21();ctx.restore();if(flash>0){ctx.fillStyle='rgba(178,255,122,'+(flash*.8)+')';ctx.fillRect(0,0,W,H);}if(transition>0){ctx.fillStyle='rgba(4,10,20,'+Math.min(.75,transition)+')';ctx.fillRect(0,0,W,H);txt(region().name,W/2,H/2,24,'#d7eec5');}
}

function loop(now){requestAnimationFrame(loop);const elapsed=Math.max(0,(now-last)/1000||0);last=now;countPlay56(elapsed);if(!ready)return;const begin=performance.now();window.OmniSound?.ambient(started&&!paused&&!net.remoteAway&&!net.waiting&&!document.hidden,sound,zone,dayMode);netUpdate(Math.min(.1,elapsed));updateCinema(elapsed);if(started&&!paused&&!net.remoteAway&&!net.waiting){simulate75(elapsed);}else if(!started)clock+=Math.min(.04,elapsed);const render=frameControl75.render(now,quality17);if(render){draw();drawCinema();}frameControl75.sample(elapsed*1000,performance.now()-begin,started&&!paused&&!cinematic&&!document.hidden&&window.omniMode61!==null);}
function resize(){const scale=Math.min(innerWidth/W,innerHeight/H);$('#game').style.transform='translate(-50%,-50%) scale('+scale+')';}
function point(e){const r=$('#joystick').getBoundingClientRect(),scale=r.width/154;let x=(e.clientX-r.left)/scale-77,y=(e.clientY-r.top)/scale-77,len=Math.hypot(x,y);if(len>50){x*=50/len;y*=50/len;}stick.x=x/50;stick.y=y/50;$('#stick').style.transform='translate('+x+'px,'+y+'px)';}
$('#joystick').addEventListener('pointerdown',e=>{if(paused)return;e.preventDefault();stick.id=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);point(e);});$('#joystick').addEventListener('pointermove',e=>{if(e.pointerId===stick.id)point(e);});for(const ev of ['pointerup','pointercancel','lostpointercapture'])$('#joystick').addEventListener(ev,e=>{if(e.pointerId===stick.id){stick.id=null;stick.x=stick.y=0;$('#stick').style.transform='';}});
document.querySelectorAll('[data-skill]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);held=+b.dataset.skill;attack(held);});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>held=-1);});
$('#ultrabasic').onclick=ultraBasic;$('#jobsbtn').onclick=jobsMenu;$('#alienskins').onclick=alienSkinMenu;$('#jump').onclick=jump;$('#lanbtn').onclick=lanMenu;$('#racebtn').onclick=raceMenu;$('#treebtn').onclick=skillTree;$('#moreattacks').onclick=()=>{attackPage=1-attackPage;held=-1;hud();};$('#musicbtn').onclick=settings15;$('#skins').onclick=skinMenu;$('#slide').onclick=slide;$('#transform').onclick=transform;$('#talk').onclick=interact;$('#dialprev').onclick=()=>selectAlien(-1);$('#dialnext').onclick=()=>selectAlien(1);$('#mapbtn').onclick=()=>showWorldMap();$('#pause').onclick=pauseMenu;$('#mission').onclick=()=>{if(hospital()){hauntDialog();return;}if(zone===23){story3Talk();return;}if(zone===12){if(dist(player,neko)<=145)nekoTalk();else toast('AcÃ©rcate a Maid Neko');return;}if(zone===9){tenHub();return;}if(zone===11){storyTalk();return;}if(zone===10){if(dist(player,kim)<=145)danceMenu();else toast('AcÃ©rcate a Kim Taehyung en el centro del concierto');return;}if(zone===6||zone===8){knightTalk();return;}if(npcHere()&&dist(player,npc)<=130)talk();else showDialog('DIARIO Â· SOMBRAS ENTRE LOS PINOS','Un camino seguro','<p>'+$('#questtext').textContent+'.</p><p>'+ (quest.state==='active'?'Encuentra a los seis drones y un comandante en la parte derecha del Refugio de Max. Los enemigos de otras zonas no cuentan para esta misiÃ³n. Al derrotar a los siete, vuelve al guardabosques, en la izquierda.':quest.state==='done'?'Habla con Max para repetir la misiÃ³n. Cada alien tiene maestrÃ­a independiente.':'Max estÃ¡ en la zona Refugio, cerca del inicio. Usa el MAPA para orientarte. AcÃ©rcate a Ã©l y pulsa HABLAR.')+'</p>',[['CONTINUAR',closeDialog]]);};
$('#play').onclick=()=>{if(!ready)return;started=true;paused=false;$('#menu').classList.add('hidden');$('#hud').classList.remove('hidden');cam.x=clamp(player.x-W*.48/sceneZoom(),0,cameraMaxX());cam.y=clamp(player.y-H*.64/sceneZoom(),0,cameraMaxY());tone(460,.12);hud();if(migrated)toast('Partida actualizada Â· Nivel y maestrÃ­a conservados');else if(quest.state==='new')toast('Habla con Max Â· Usa el dial para elegir tu alien');save();};
document.addEventListener('keydown',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(k))e.preventDefault();keys[k]=true;if(e.repeat)return;if(k==='Escape'){dialogOpen?closeDialog():pauseMenu();}if(k==='t')transform();if(k==='j')jump();if(k==='f')slide();if(k==='k')skillTree();if(k==='v'){attackPage=1-attackPage;hud();}if(k==='e')interact();if(k==='q')selectAlien(-1);if(k==='r')selectAlien(1);if(k==='m')showWorldMap();if(k===' '){held=0;attack(0);}if('1234'.includes(k)&&k.length===1){held=+k-1;attack(held);}});document.addEventListener('keyup',e=>{keys[e.key.length===1?e.key.toLowerCase():e.key]=false;if('1234 '.includes(e.key))held=-1;});
document.addEventListener('visibilitychange',()=>{if(document.hidden){suspendCinema();save();resetInput();if(started&&!paused)pauseMenu();}});window.addEventListener('blur',resetInput);window.addEventListener('pagehide',save);window.addEventListener('resize',resize);window.pauseFromAndroid=()=>{if(cinematic){suspendCinema();save();return;}if(window.OmniCooking?.active){OmniCooking.pause();save();return;}if(window.OmniRhythm?.active){OmniRhythm.pause();save();return;}net.away=true;if(net.peer)netUpdate(.2);save();resetInput();if(started&&!paused)pauseMenu();};window.backFromAndroid=()=>{if(cinematic){suspendCinema();return;}if(window.OmniCooking?.active){OmniCooking.pause();return;}if(window.OmniRhythm?.active){OmniRhythm.pause();return;}if(dialogOpen)closeDialog();else pauseMenu();};
// v0.12: watch confirmation, protected transformation, recovery and Chapter 2.
let cinematic=null;
function initV12(){player.story2=Object.assign({state:'new',kills:[],reward:0},player.story2||{});player.story2.kills=[...new Set(player.story2.kills.filter(k=>['animo','frog','hog'].includes(k)))];player.watchOpen=false;player.watchTurn=0;}
function recoverWolf(){if(net.role==='guest'){lanSend({type:'wolfRecovery',zone});return;}const pool=zone===17?enemies:zoneStates.moonforest||[];const b=pool.find(e=>e.wolfBoss&&e.alive);if(b){b.recovering=true;b.wind=0;b.cast=0;}}
function updateRecovery(dt){if(net.role==='guest')return;const pool=zone===17?enemies:zoneStates.moonforest||[];for(const b of pool)if(b.wolfBoss&&b.alive&&b.recovering){b.hp=Math.min(b.max,b.hp+b.max*.02*dt);if(b.hp>=b.max)b.recovering=false;}}
function transform(){if(cinematic)return;if(interference()){toast('Interferencia magnÃ©tica Â· sin formas');return;}if(race==='osmo'&&player.form==='ghost'){endGhost();revert(false);return;}if(race==='osmo'||player.alien){player.watchOpen=false;commitTransform();return;}if(!started||paused||player.jump>0||player.motion||player.leap)return;if(!player.watchOpen){player.watchOpen=true;player.watchTurn=.4;resetInput();toast('Elige con â—€ / â–¶ y pulsa ACTIVAR');hud();return;}if(player.battery<=0){toast('Espera a recuperar algo de baterÃ­a');return;}if(player.selected==='wolf'&&!wolfUnlocked()){toast('Blitztwolfer requiere nivel 30 y su ADN');return;}if(player.selected==='ghost'&&(!player.ghostDNA||player.level<20)){toast('FantasmÃ¡tico requiere completar el hospital Â· nivel 20');return;}if(!cinemaEnabled){player.watchOpen=false;commitTransform();hud();return;}cinematic={mode:'press',time:0,id:player.selected,hold:false};paused=true;resetInput();window.OmniSound?.stopSample('dial');hud();if(net.peer)netUpdate(.2);}
function suspendCinema(){if(!cinematic)return;cinematic.hold=true;OmniSound.stopSample('heatblast',false);$('#cinemaresume').classList.remove('hidden');}
function resumeCinema(){if(!cinematic)return;cinematic.hold=false;net.away=false;$('#cinemaresume').classList.add('hidden');if(cinematic.mode==='movie')OmniSound.sample('heatblast',false);}
function updateCinema(dt){if(!cinematic||cinematic.hold||document.hidden)return;cinematic.time+=dt;if(cinematic.mode==='press'&&cinematic.time>=.7){if(['heatblast','grey','ultra'].includes(cinematic.id)||CINE13[cinematic.id]){cinematic.mode='movie';cinematic.time=0;document.body.classList.add('cinema');OmniSound.sample('heatblast');window.OmniMusic?.pauseForEvent();}else finishCinema();}else if(cinematic.mode==='movie'&&cinematic.time>=16.065306)finishCinema();}
function finishCinema(){if(!cinematic)return;const osmoCinema=!!cinematic.osmo;if(!osmoCinema)player.selected=cinematic.id;cinematic=null;player.watchOpen=false;document.body.classList.remove('cinema');$('#cinemaresume').classList.add('hidden');OmniSound.stopSample('heatblast');paused=false;net.away=false;if(!osmoCinema)commitTransform();resetInput();hud();if(net.peer)netUpdate(.2);}
function drawCinemaLegacy(){if(!cinematic||cinematic.mode!=='movie')return;const t=cinematic.time,map=CINE13[cinematic.id],ix=Math.min(5,Math.floor(Math.max(0,t-1)/2.45)),im=map?art[map[0]]:t<1?art.cineStart12:art.cine12,f=map?OMNI_V13_FRAMES[map[0]][map[1]+ix]:t<1?[0,0,im.width,im.height]:OMNI_V12_FRAMES.cine12[ix];ctx.save();ctx.fillStyle='#030508';ctx.fillRect(0,0,W,H);const scale=Math.min(W/f[2],H/f[3])*(1+.025*Math.sin(t*1.5)),w=f[2]*scale,h=f[3]*scale;ctx.drawImage(im,...f,(W-w)/2,(H-h)/2,w,h);for(let i=0;i<22;i++){ctx.fillStyle=(ALIENS[cinematic.id]?.color||'#c6ffa4')+'66';ctx.fillRect((i*127+t*110)%W,(i*71-t*45+H*4)%H,3+i%4,3+i%4);}ctx.fillStyle='#07140caa';ctx.fillRect(0,H-44,W,44);txt((ALIENS[cinematic.id]?.name||'TRANSFORMACIÃ“N').toUpperCase(),W/2,H-25,15,'#eaffcc');txt('DOBLE TOQUE PARA SALTAR',W/2,H-9,10,'#c9d6c2');ctx.fillStyle='#b7ff89';ctx.fillRect(0,H-3,W*t/16.065306,3);ctx.restore();}
function chaptersMenu(){showDialog('TEN Â· MODO HISTORIA','CapÃ­tulos de tu aventura','<p>Las misiones y recompensas se guardan por separado para cada raza.</p>',[['01 Â· ROBOT DE VILGAX',storyTalk],['02 Â· DR. ÃNIMO Â· NV.20',story2Talk],['03 Â· HEX Â· NV.30',story3Talk],['VOLVER',closeDialog]]);}
function canStartStory2(){return player.level>=20&&player.story.completions>=1&&player.story2.state==='new'&&zone===9&&dist(player,ten)<140;}
function startStory2(){if(!canStartStory2())return false;player.story2={state:'active',kills:[],reward:Math.round(xpNeed()*.9)};delete zoneStates.animoLab;closeDialog();toast('CapÃ­tulo 2 aceptado Â· Laboratorio al este de la Zona devastada');save();return true;}
function story2Kill(id){const q=player.story2;if(player.level<20||q.state!=='active'||!['animo','frog','hog'].includes(id)||q.kills.includes(id))return;q.kills.push(id);if(q.kills.length===3){q.state='return';toast('Â¡Laboratorio liberado! Regresa con Ten');}save();}
function claimStory2(){const q=player.story2;if(q.state!=='return'||zone!==9||dist(player,ten)>140)return false;const reward=q.reward;q.state='complete';q.reward=0;player.coins+=10;xp(reward);save();closeDialog();toast('CapÃ­tulo 2 completado Â· '+reward+' EXP Â· 10 monedas');return true;}
function story2Talk(){const q=player.story2,near=zone===9&&dist(player,ten)<140;let text=q.state==='complete'?'Â«Detuviste a Ãnimo y a sus mutantes. A nivel 30 puedo contarte lo que ocurre con Hex en la Escuela Arcana.Â»':q.state==='return'?'Â«Â¡Buen trabajo! La ciudad vuelve a estar a salvo.Â»':q.state==='active'?'Â«Entra al laboratorio al este de la Zona devastada, al sur del Barrio. DetÃ©n a Ãnimo y sus dos criaturas.Â»':'Â«Ãnimo estÃ¡ creando mutantes. Necesito tu ayuda para detener su pistola de Ã¡cido, su rana y su bestia. Â¿Aceptas?Â»';showDialog('TEN Â· HISTORIA 02 Â· NIVEL 20','El laboratorio de Dr. Ãnimo','<p>'+text+'</p><p>Nivel mÃ­nimo 20 Â· Completa al menos una victoria del capÃ­tulo 1 Â· Una sola recompensa por raza.</p>'+(q.state==='active'?'<p>Derrotados: '+q.kills.length+' / 3. Sus ataques se anuncian antes de golpear.</p>':'')+(q.state==='complete'?'':'<p class="reward">'+(q.reward||Math.round(xpNeed()*.9))+' EXP + 10 monedas al volver con Ten.</p>'),[...(q.state==='new'&&canStartStory2()?[['ACEPTAR',startStory2]]:[]),...(q.state==='return'&&near?[['COBRAR',claimStory2]]:[]),['VOLVER',closeDialog]]);}
function ensureAnimo(){if(zone!==18||net.role==='guest'||enemies.some(e=>e.chapter2))return;for(const [i,id] of ['animo','frog','hog'].entries()){const hp=[1400,900,1100][i],x=[1200,890,650][i],y=[650,725,680][i];enemies.push({id:'c2-'+id,kind:'chapter2',chapter2:id,level:20,x,y,homeX:x,homeY:y,hp,max:hp,alive:true,face:-1,anim:0,moving:false,hit:0,stun:0,wind:0,frame:0,cd:2+i,altCD:5+i,growCD:12,growth:0,castData:null});}zoneStates.animoLab=enemies;}
function damageChapter2(e,damage){e.hp-=Math.round(damage);e.hit=.18;popup(e.x,e.y-135,String(Math.round(damage)));if(e.hp<=0){e.alive=false;e.hp=0;e.castData=null;story2Kill(e.chapter2);if(net.peer)lanSend({type:'story2Kill',id:e.chapter2,zone:18});burst(e.x,e.y-45,35,'#c4ef85');save();}}
function chapterCast(e,type,t,r,damage,cd){const target=teamTargets().sort((a,b)=>dist(a,e)-dist(b,e))[0]||player;e.castData={type,t,max:t,r,damage,a:Math.atan2(target.y-e.y,target.x-e.x),x:target.x,y:target.y,hit:false};if(type==='grow')e.growCD=cd;else if(['acidfan','leap','charge'].includes(type))e.altCD=cd;else e.cd=cd;}
function updateChapter2(dt){if(net.role==='guest')return;ensureAnimo();if(zone!==18)return;for(const e of enemies){if(!e.chapter2||!e.alive||e.possessedTime>0)continue;e.hit=Math.max(0,e.hit-dt);e.stun=Math.max(0,e.stun-dt);e.cd=Math.max(0,e.cd-dt);e.altCD=Math.max(0,e.altCD-dt);e.growCD=Math.max(0,e.growCD-dt);e.growth=Math.max(0,e.growth-dt);e.moving=false;
 const f=e.castData;if(f){f.t-=dt;if(f.type==='leap'&&f.t<.6&&!f.hit)moveActor(e,(f.x-e.x)*Math.min(1,dt*8),(f.y-e.y)*Math.min(1,dt*8));if(f.type==='charge'&&f.t<.65&&f.t>.25)moveActor(e,Math.cos(f.a)*350*dt,Math.sin(f.a)*350*dt);if(!f.hit&&f.t<=.25){f.hit=true;if(f.type==='grow'){e.growth=8;burst(e.x,e.y-70,25,'#a1fa76');}else if(f.type.startsWith('acid')){for(const offset of f.type==='acidfan'?[-.18,0,.18]:[0])hostileShots.push({type:'green',x:e.x,y:e.y-35,dx:Math.cos(f.a+offset)*250,dy:Math.sin(f.a+offset)*250,t:2.7,r:9,damage:f.damage});}else for(const target of teamTargets()){const d=dist(e,target),a=Math.atan2(target.y-e.y,target.x-e.x),angle=Math.abs(Math.atan2(Math.sin(a-f.a),Math.cos(a-f.a)));if(d<f.r&&lineClear(e.x,e.y,target.x,target.y)&&(f.type==='leap'||angle<(f.type==='tongue'?.2:1)))hurtTeam(target,Math.round(f.damage*(e.growth>0?1.35:1)));if(paused||zone!==18)return;}OmniSound.play(f.type.startsWith('acid')?'spit':'hit');}if(f.t<=0)e.castData=null;continue;}if(e.stun>0)continue;const target=teamTargets().sort((a,b)=>dist(a,e)-dist(b,e))[0]||player,d=dist(e,target);e.face=target.x>=e.x?1:-1;if(d>850)continue;
 if(e.chapter2==='animo'){if(e.altCD<=0&&d<570)chapterCast(e,'acidfan',1.25,570,10,8);else if(e.cd<=0&&d<600)chapterCast(e,'acid',.95,600,14,4);}else if(e.chapter2==='frog'){if(e.altCD<=0&&d<450)chapterCast(e,'leap',1.5,105,18,7);else if(e.cd<=0&&d<300)chapterCast(e,'tongue',1.05,300,14,4);}else{if(e.growCD<=0)chapterCast(e,'grow',1.35,0,0,20);else if(e.altCD<=0&&d<370)chapterCast(e,'charge',1.4,115,18,7);else if(e.cd<=0&&d<115)chapterCast(e,'bite',.9,115,14,3);}
 if(!e.castData&&d>(e.chapter2==='animo'?250:90)){const speed=e.chapter2==='animo'?98:e.chapter2==='frog'?100:115;moveActor(e,(target.x-e.x)/d*speed*dt,(target.y-e.y)/d*speed*dt);e.anim+=dt*6;e.moving=true;}}
}
function drawChapter2(e){const f=e.castData,id=e.chapter2,h=id==='animo'?135:id==='frog'?105:e.growth>0?158:118;let frame=e.moving?1+Math.floor(e.anim)%2:0,lift=0;if(f){if(id==='animo')frame=f.type==='acidfan'?5:f.hit?4:3;else if(id==='frog'){frame=f.type==='tongue'?(f.hit?7:6):f.t>.6?3:f.hit?5:4;if(f.type==='leap'&&f.t<=.6&&!f.hit)lift=Math.sin((.6-f.t)/.6*Math.PI)*100;}else frame=f.type==='grow'?5:f.type==='charge'?4:3;}else if(e.hit>0&&id==='animo')frame=6;else if(e.growth>0&&!e.moving)frame=6;sprite({animo:50,frog:51,hog:52}[id],frame,e.x,e.y-lift,h,e.face,e.hit>0?.65:1);txt(({animo:'DR. ÃNIMO',frog:'RANA MUTANTE',hog:'BESTIA MUTANTE'})[id]+' Â· NV.20',e.x,e.y-h-18,9,'#dcf7b1');ctx.fillStyle='#172419';ctx.fillRect(e.x-55,e.y-h-10,110,5);ctx.fillStyle='#b6e57e';ctx.fillRect(e.x-55,e.y-h-10,110*Math.max(0,e.hp/e.max),5);
 if(f){ctx.save();ctx.strokeStyle=f.hit?'#d6ff8a':'#ffa277';ctx.fillStyle='#b4f25725';ctx.lineWidth=f.hit?5:2;ctx.beginPath();if(f.type==='leap'){ctx.ellipse(f.x,f.y,105,37,0,0,Math.PI*2);}else if(f.type==='grow'){ctx.ellipse(e.x,e.y,75,25,0,0,Math.PI*2);}else{ctx.moveTo(e.x,e.y);ctx.arc(e.x,e.y,f.r,f.a-(f.type==='tongue'?.12:.23),f.a+(f.type==='tongue'?.12:.23));ctx.closePath();}ctx.fill();ctx.stroke();if(f.type==='tongue'&&f.hit){ctx.strokeStyle='#ef8496';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(e.x,e.y-35);ctx.lineTo(e.x+Math.cos(f.a)*f.r,e.y+Math.sin(f.a)*f.r-25);ctx.stroke();}ctx.restore();}}
function hudV12(){if(race==='omni'&&!player.alien){$('#transformlabel').textContent=player.watchOpen?'ACTIVAR':'ABRIR RELOJ';$('#transformhint').textContent=player.watchOpen?alien().name.toUpperCase():'ELIGE TU ALIEN';}if(zone===18){$('#mission .tiny').textContent='HISTORIA 02 Â· DR. ÃNIMO';$('#questtext').textContent=player.story2.state==='active'?'DetÃ©n a los mutantes Â· '+player.story2.kills.length+' / 3':player.story2.state==='return'?'Regresa con Ten':player.story2.state==='complete'?'CapÃ­tulo 2 completado':'Ten Â· Requiere nivel 20';$('#questsub').textContent='Laboratorio Â· Salida al oeste';}if(zone===17&&enemies.some(e=>e.wolfBoss&&e.alive&&e.recovering))$('#wolfbar').textContent+=' Â· RECUPERANDO';}

// OMNI 0.13 - spectral expedition, per-race portals and cinematic controls.
let cinemaEnabled=localStorage.getItem('omni-cinematics')!=='0',lastCinemaTap=0,cinemaTapPos=null;
const CINE13={diamond:['cineA13',0],fourarms:['cineA13',6],xlr8:['cineB13',0],bestia:['cineB13',6],insect:['cineC13',0],aquatic:['cineC13',6],wolf:['cineD13',0],ghost:['cineD13',6]};
const GHOST_SKILLS=[makeSkill('Intangibilidad','FASE',0,12,0),makeSkill('Invisibilidad','INVISIBLE',0,15,15),makeSkill('PosesiÃ³n','POSEER',14,14,40),makeSkill('TentÃ¡culos retrÃ¡ctiles','TENTÃCULOS',24,.85,0),{...makeSkill('Pulso espectral','PULSO',52,9),points:3},{...makeSkill('Lamento del vacÃ­o','LAMENTO',20,12),points:3}];
ALIENS.ghost={name:'FantasmÃ¡tico',hp:350,row:70,color:'#d7afff',skills:GHOST_SKILLS};CORE_ALIENS.push('ghost');SPEEDS.ghost=220;OSMO_FORMS.ghost={name:'Osmosiano espectral',hp:350,color:'#c9a7f2'};OSMO_SKILLS.ghost=GHOST_SKILLS;
const SWITCHES=[{x:385,y:555},{x:850,y:810},{x:1385,y:565}],LAMPS=[{x:310,y:660},{x:1280,y:660}];
const ECTO=[{x:470,y:560,w:240,h:175},{x:1015,y:650,w:220,h:180}];
const FRAGILE=[{x:710,y:600,w:90,h:100},{x:800,y:600,w:90,h:100},{x:890,y:600,w:90,h:100}];
let hauntWorld={switches:[false,false,false],tiles:[0,0,0],lamps:[0,0]},hauntClock=0;
const ghostForm=(o=player)=>o===player?race==='osmo'?o.form==='ghost':o.alien&&o.activeAlien==='ghost':o.race==='osmo'?o.form==='ghost':o.alien&&o.activeAlien==='ghost';
const fireForm=o=>o===player?race==='osmo'?o.form==='fire':o.alien&&o.activeAlien==='heatblast':o.race==='osmo'?o.form==='fire':o.alien&&o.activeAlien==='heatblast';
const hospital=()=>zone>=19&&zone<=22;
const interference=()=>zone===20;
const inRect=(o,r)=>o.x>=r.x&&o.x<=r.x+r.w&&o.y>=r.y&&o.y<=r.y+r.h;
function initV13(){player.warps=Array.isArray(player.warps)?[...new Set(player.warps.filter(n=>Number.isInteger(n)&&n>=0&&n<REGIONS.length&&![20,21,22].includes(n)))]:[];player.haunt=Object.assign({phase:0,switches:[false,false,false],complete:false},player.haunt||{});player.haunt.switches=[0,1,2].map(i=>!!player.haunt.switches[i]);player.ghostDNA=!!player.ghostDNA;player.ghostCorrupt=clamp(Number(player.ghostCorrupt)||0,0,100);player.ghostLock=Math.max(0,Number(player.ghostLock)||0);player.ghostPhase=player.ghostInvisible=player.ghostPulse=player.detection=0;player.possession=null;player.crouching=false;player.safeGhost={x:player.x,y:player.y};player.hauntHazard=0;hauntWorld={switches:[...player.haunt.switches],tiles:[0,0,0],lamps:[0,0]};if(interference()){player.alien=false;player.form='human';player.battery=0;}}
function toggleCinema(){cinemaEnabled=!cinemaEnabled;localStorage.setItem('omni-cinematics',cinemaEnabled?'1':'0');OmniSound.stopSample('dial');OmniSound.stopSample('heatblast');toast(cinemaEnabled?'Animaciones y sonidos de transformaciÃ³n activados':'TransformaciÃ³n directa Â· animaciones y sonidos desactivados');hud();}
function skipCinema(){if(cinematic?.mode!=='movie')return false;finishCinema();return true;}
function cinemaDoubleTap(e){if(!cinematic||cinematic.mode!=='movie'||e.target!==canvas&&e.target!==$('#cinemaworld'))return;const now=performance.now(),p={x:e.clientX,y:e.clientY};if(lastCinemaTap&&now-lastCinemaTap<340&&cinemaTapPos&&dist(p,cinemaTapPos)<85){lastCinemaTap=0;skipCinema();return;}lastCinemaTap=now;cinemaTapPos=p;}
function toggleWatchOff(){player.watchOpen=false;player.watchTurn=0;OmniSound.stopSample('dial');hud();}
function ghostPose(o){if(hasGhostLady(o))return {row:74,f:underwater()?(o.moving?10+walkFrame166(o,2,Math.floor(o.anim)%2):10):o.possession?6:o.attack>0?o.ghostFrame||3:o.ghostPhase>0?4:o.ghostInvisible>0?5:o.moving?1+walkFrame166(o,2,Math.floor(o.anim)%2):0,lift:8+Math.sin(clock*3)*4};return {row:o.race==='osmo'||o===player&&race==='osmo'?71:70,f:o.possession?6:o.attack>0?o.ghostFrame||3:o.ghostPhase>0?4:o.ghostInvisible>0?5:o.moving?1+walkFrame166(o,2,Math.floor(o.anim)%2):0,lift:8+Math.sin(clock*3)*4};}
function endGhost(){if(player.possession)endPossession();if(isSolid(player.x,player.y)){player.x=player.safeGhost?.x||region().minX+65;player.y=player.safeGhost?.y||region().exitY;}player.ghostPhase=player.ghostInvisible=player.ghostPulse=0;}
function ghostAttack(i){const s=GHOST_SKILLS[i];if(!unlockedSkill('ghost',i)){toast(i>=4?'Aprende esta habilidad por 3 puntos':'Requiere maestrÃ­a '+s.unlock);return;}player.cool[i]=s.cd;player.attack=.65;player.ghostFrame=hasGhostLady()?[4,5,6,7,8,9][i]:[4,5,6,7,4,7][i];const d=s.damage*multiplier(),t=nearest(i===2?260:330);if(i===0){player.ghostPhase=3;player.safeGhost={x:player.x,y:player.y};}else if(i===1)player.ghostInvisible=5;else if(i===2){if(!t){player.cool[i]=1;toast('AcÃ©rcate a un enemigo');return;}if(t.guard||t.hexBoss&&t.shield>0||t.ghostBoss&&t.immune){player.cool[i]=1;toast(t.guard?'Interferencia: el guardia no puede ser poseÃ­do':t.hexBoss?'Espera a que caiga el escudo':'Primero ilumina al espectro');return;}if(t.possessedBy){player.cool[i]=1;toast('Este enemigo ya estÃ¡ poseÃ­do');return;}player.possession={id:t.id,t:(t.hexBoss||t.majorBoss||t.wolfBoss||t.robotBoss||t.chapter2||t.ghostBoss)?2:4,tick:0,damage:d,origin:{x:player.x,y:player.y}};player.x=t.x;player.y=t.y;t.possessedBy=net.role==='guest'?'guest':'host';t.possessedTime=player.possession.t+.3;if(net.role==='guest')lanSend({type:'possess',id:t.id,zone,seq:++net.seq});}else if(i===3){player.ghostInvisible=0;const a=t?Math.atan2(t.y-player.y,t.x-player.x):Math.atan2(player.dy,player.dx);effects.push({type:'ghostlash',x:player.x,y:player.y,a,r:190,t:.5,max:.5});for(const e of combatants())if(e.alive&&dist(e,player)<190&&lineClear(player.x,player.y,e.x,e.y))damageTarget(e,d,.1);}else if(i===4){areaHit(player.x,player.y,180,d,.4);effects.push({type:'ghostpulse',x:player.x,y:player.y,r:180,t:.7,max:.7});}else{player.ghostPulse=1.5;player.ghostPulseTick=0;}}
function endPossession(){const p=player.possession;if(!p)return;const e=enemies.find(e=>e.id===p.id);if(e&&net.role!=='guest'){e.possessedTime=0;e.possessedBy=null;}player.x=p.origin.x;player.y=p.origin.y;player.possession=null;if(net.role==='guest')lanSend({type:'releasePossession',id:p.id,zone});}
function absorbGhost(){if(race!=='osmo'||!player.ghostDNA||player.level<20){toast('Completa la misiÃ³n del hospital (nivel 20) para obtener ADN');return false;}if(interference()||player.battery<=0||player.ghostLock>0){toast(player.ghostLock>0?'ADN inestable Â· '+Math.ceil(player.ghostLock)+' s':'La interferencia impide absorber');return false;}if(player.form==='ghost'){closeDialog();return true;}const ratio=player.hp/maxHP();endGhost();player.form='ghost';refreshOsmo();player.hp=clamp(ratio*maxHP(),1,maxHP());player.cool=player.cooldowns.ghost;closeDialog();if(cinemaEnabled){cinematic={mode:'movie',id:'ghost',time:0,hold:false,osmo:true};paused=true;document.body.classList.add('cinema');OmniSound.sample('heatblast');resetInput();}save();return true;}
function updateGhost13(dt){player.ghostLock=Math.max(0,player.ghostLock-dt);player.ghostInvisible=Math.max(0,player.ghostInvisible-dt);const phase=player.ghostPhase;player.ghostPhase=Math.max(0,phase-dt);if(phase>0&&!player.ghostPhase&&isSolid(player.x,player.y)){player.x=player.safeGhost.x;player.y=player.safeGhost.y;}if(!isSolid(player.x,player.y))player.safeGhost={x:player.x,y:player.y};if(!ghostForm()){if(player.possession)endPossession();player.ghostPhase=player.ghostInvisible=0;player.ghostCorrupt=Math.max(0,player.ghostCorrupt-dt*3);}else if(race==='osmo'){const old=player.ghostCorrupt;player.ghostCorrupt=Math.min(100,old+dt*2);if(old<70&&player.ghostCorrupt>=70)toast('Â¡ALERTA! Este poder te controla. Vuelve a tu forma base.');if(player.ghostCorrupt>=70){player.regenWait=12;player.hp=Math.max(1,player.hp-maxHP()*.012*dt);}if(player.ghostCorrupt>=100){player.ghostLock=150;endGhost();revert(false);toast('CORRUPCIÃ“N TOTAL Â· ADN bloqueado 150 segundos');save();}}
 const p=player.possession;if(p){p.t-=dt;const e=enemies.find(e=>e.id===p.id);if(!e?.alive||p.t<=0){endPossession();}else{e.x=player.x;e.y=player.y;e.moving=player.moving;e.anim=player.anim;p.tick-=dt;if(p.tick<=0){p.tick+=1;damageTarget(e,p.damage,.3);for(const o of enemies)if(o!==e&&o.alive&&dist(o,e)<130)damageTarget(o,p.damage,.3);}}}if(net.role!=='guest')for(const e of enemies)if(e.possessedTime>0){e.possessedTime=Math.max(0,e.possessedTime-dt);const owner=net.members[e.possessedPeer];if(e.possessedBy==='guest'&&owner?.possession?.id===e.id){moveActor(e,owner.x-e.x,owner.y-e.y);e.moving=owner.moving;e.anim=owner.anim;}if(!e.possessedTime)e.possessedBy=null;}
 if(player.ghostPulse>0){player.ghostPulse-=dt;player.ghostPulseTick-=dt;if(player.ghostPulseTick<=0){player.ghostPulseTick+=.5;areaHit(player.x,player.y,205,20*multiplier(),.15);effects.push({type:'ghostpulse',x:player.x,y:player.y,r:205,t:.5,max:.5});}}
}
function warpAllowedDestination(n){if(inVoid()||n>=24)return false;return Number.isInteger(n)&&n>=0&&n<REGIONS.length&&![20,21,22].includes(n);}
function buyWarp(n){if(!warpAllowedDestination(n)||player.warps.includes(n)||player.coins<50||!discovered.includes(REGIONS[n].id))return false;player.coins-=50;player.warps.push(n);save();return true;}
function travelWarp(n){if(!player.warps.includes(n)||!warpAllowedDestination(n))return false;if(cinematic||player.regenWait>0||law.timer>0||[20,21,22].includes(zone)||player.possession){toast('Sal del combate o de la misiÃ³n del hospital antes de viajar');return false;}if(net.role==='guest'){lanSend({type:'warpRequest',zone,n});closeDialog();toast('Teletransporte solicitado al anfitriÃ³n');return true;}if(net.peer&&(Object.values(net.members).some(o=>o.regenWait>0)||net.remoteAway)){toast('Tu compaÃ±ero debe salir del combate y cerrar sus menÃºs');return false;}closeDialog();enterZone(n,'center');player.inv=2;if(net.peer)netUpdate(.2);return true;}
function warpMenu(n){if([20,21,22].includes(n)){showDialog('HOSPITAL Â· SIN PORTALES','Solo entrada exterior','<p>No se compran portales al interior. Viaja al exterior y entra caminando para realizar las fases de la misiÃ³n.</p>',[['ENTRADA DEL HOSPITAL',()=>showWorldMap(19)],['VOLVER',closeDialog]]);return;}showDialog('PORTAL Â· '+REGIONS[n].name,'Teletransporte del mapa','<p>Desbloquear este destino cuesta <b>50 monedas una sola vez por raza</b>. DespuÃ©s, viajar es gratis. Debes haber visitado la zona. En Wi-Fi, viaja todo el grupo; puede solicitarlo cualquiera con el destino comprado.</p><p>No permite saltarse las fases del hospital ni escapar durante un combate.</p><p>Monedas: '+player.coins+' Â· '+(player.warps.includes(n)?'PORTAL DESBLOQUEADO':discovered.includes(REGIONS[n].id)?'ZONA VISITADA':'PRIMERO EXPLORA ESTA ZONA')+'</p>',[...(warpAllowedDestination(n)?player.warps.includes(n)?[['VIAJAR',()=>travelWarp(n)]]:discovered.includes(REGIONS[n].id)?[['DESBLOQUEAR Â· 50',()=>{if(buyWarp(n))warpMenu(n);else toast('Necesitas 50 monedas');}]]:[]:[]),['VOLVER AL MAPA',()=>showWorldMap(n)]]);}
function hauntDialog(){const q=player.haunt;showDialog('EXPEDICIÃ“N ESPECTRAL Â· NIVEL 20','El hospital abandonado','<p>Una interferencia magnÃ©tica oculta un laboratorio bajo el hospital.</p><p><b>1. Sigilo:</b> sin transformaciones ni baterÃ­a. EscÃ³ndete detrÃ¡s de cajas/pilares y espera a que pasen los guardias. Si te detectan, vuelves al inicio del pasillo.</p><p><b>2. Sabotaje:</b> activa tres interruptores. El ectoplasma daÃ±a y las baldosas agrietadas ceden. XLR8 o Insecotide ayudan; tambiÃ©n existe un recorrido a pie.</p><p><b>3. ContenciÃ³n:</b> ilumina a FantasmÃ¡tico con fuego o las lÃ¡mparas para volverlo sÃ³lido. Sus ataques de 30â€“40 se pueden esquivar.</p><p>'+ (q.complete?(player.ghostDNA?'ADN desbloqueado con esta raza.':'MisiÃ³n completada. Repite el jefe y escanea su ADN (20 %).'):q.phase?'Fase actual: '+q.phase:'Recompensa: ADN espectral: Omnitrix requiere escanear (20 %); Osmosiano conserva la recompensa de absorciÃ³n.')+'</p>',[...(zone===19&&!q.phase&&player.level>=20?[['INICIAR MISIÃ“N',()=>{player.haunt.phase=1;save();closeDialog();toast('Entra por el norte Â· nivel 20');}]]:[]),['CONTINUAR',closeDialog]]);}
function hospitalGate(next){if(net.applying)return true;if(next>=20&&next<=22){if(player.level<20||player.haunt.phase<1){toast('Acepta la expediciÃ³n en el exterior del hospital Â· Nivel 20');return false;}if(next===22&&player.haunt.phase<3){toast('Primero apaga los tres interruptores del laboratorio');return false;}if(next===21&&zone===20){player.haunt.phase=Math.max(2,player.haunt.phase);player.crouching=false;save();}}return true;}
function enteredHospital(previous){player.watchOpen=false;player.detection=0;player.hauntHazard=0;if(zone===20){if(previous!==20)player.storedBattery=player.battery;endGhost();if(player.alien||race==='osmo'&&player.form!=='human')revert(false);player.battery=0;player.crouching=false;}else if(previous===20){player.battery=Math.max(35,Math.min(100,player.storedBattery||0));if(zone===21&&player.level>=20&&player.haunt.phase>0)player.haunt.phase=Math.max(2,player.haunt.phase);}if(zone===21&&net.role!=='guest'){hauntWorld.switches=[...player.haunt.switches];hauntWorld.tiles=[0,0,0];}if(zone===22&&player.haunt.phase>=3)ensureGhostBoss();if(hospital())hud();}
function hospitalCheckpoint(reason){endGhost();player.detection=0;player.crouching=false;player.hp=maxHP();player.regenWait=12;player.inv=2;player.x=zone===22?180:125;player.y=zone===20?815:790;player.leap=player.motion=null;player.jump=0;projectiles.length=hostileShots.length=effects.length=0;resetInput();if(zone===22&&net.role!=='guest'){const b=enemies.find(e=>e.ghostBoss&&e.alive);if(b){b.hp=b.max;b.castData=null;b.cd=3;b.altCD=6;b.blastCD=9;}}toast(reason+' Â· Reintenta desde este punto');save();}
function seedGuards(){if(zone!==20||net.role==='guest')return;enemies=[0,1,2].map((i)=>({id:'guard'+i,kind:'guard',guard:true,x:[540,950,1330][i],y:[585,750,610][i],homeX:[540,950,1330][i],homeY:[585,750,610][i],hp:9999,max:9999,alive:true,face:i%2?1:-1,anim:0,moving:true,hit:0,stun:0,patrol:0}));zoneStates[region().id]=enemies;}
function guardSees(e,o){const d=dist(e,o);if(d<45)return true;const a=Math.atan2(o.y-e.y,o.x-e.x),f=e.face>0?0:Math.PI;return d<(o.crouching?170:260)&&Math.abs(Math.atan2(Math.sin(a-f),Math.cos(a-f)))<.48&&lineClear(e.x,e.y,o.x,o.y);}
function triggerSwitch(i){if(zone!==21||player.haunt.phase<2||dist(player,SWITCHES[i]||{x:-999,y:-999})>95)return false;if(net.role==='guest'){lanSend({type:'hauntSwitch',i,zone});return true;}hauntWorld.switches[i]=true;syncHauntProgress();if(net.peer)netUpdate(.2);return true;}
function syncHauntProgress(){if(player.level<20||player.haunt.phase<1)return;player.haunt.switches=[...hauntWorld.switches];if(hauntWorld.switches.every(Boolean)){player.haunt.phase=Math.max(3,player.haunt.phase);toast('MÃ¡quinas apagadas Â· La sombra espera al este');}save();}
function hauntAction(){if(zone===19){hauntDialog();return;}if(zone===20){player.crouching=!player.crouching;hud();return;}if(zone===21){let i=SWITCHES.findIndex(s=>dist(player,s)<95);if(i>=0)triggerSwitch(i);else toast('AcÃ©rcate a un interruptor');return;}if(zone===22){let i=LAMPS.findIndex(s=>dist(player,s)<120);if(i>=0){if(net.role==='guest')lanSend({type:'hauntLamp',i,zone});else hauntWorld.lamps[i]=12;toast('LÃ¡mpara encendida Â· 12 s');}else toast('AcÃ©rcate a una lÃ¡mpara para iluminar al espectro');}}
function ensureGhostBoss(){if(zone!==22||net.role==='guest'||enemies.some(e=>e.ghostBoss))return;enemies.push({id:'ghost-boss',kind:'ghostboss',ghostBoss:true,level:20,x:1080,y:690,homeX:1080,homeY:690,hp:2600,max:2600,alive:true,face:-1,anim:0,moving:false,hit:0,stun:0,immune:false,cycle:0,lit:0,cd:3,altCD:6,blastCD:9,castData:null});zoneStates[region().id]=enemies;}
function ghostVictory(){if(player.haunt.phase<3||player.haunt.complete||player.level<20)return;player.haunt.complete=true;player.ghostDNA=true;xp(650);player.coins+=10;save();toast(race==='omni'?'Â¡ADN DE FANTASMÃTICO! SelecciÃ³nalo en tu reloj':'Â¡ADN ESPECTRAL! Nueva absorciÃ³n Â· cuidado con la corrupciÃ³n');}
function ghostBossDamage(e,d){const fire=net.source==='guest'?fireForm(net.remote):fireForm(player);if(e.immune&&!fire){popup(e.x,e.y-150,'INTANGIBLE','#cca4ff');return;}if(fire){e.lit=4;e.immune=false;}e.hp-=Math.round(d);e.hit=.17;popup(e.x,e.y-160,String(Math.round(d)));if(e.hp<=0&&e.alive){e.hp=0;e.alive=false;e.respawn=60;e.castData=null;const owner=net.source;net.source=null;ghostVictory();net.source=owner;if(net.peer)lanSend({type:'ghostVictory',zone});rollGhostSkin();burst(e.x,e.y-75,45,'#dfb9ff');save();}}
function ghostBossCast(b,type,t,r,damage,cd){const target=teamTargets().sort((a,c)=>dist(a,b)-dist(c,b))[0];b.castData={type,t,max:t,r,damage,a:Math.atan2(target.y-b.y,target.x-b.x),x:target.x,y:target.y,hit:false};b[type==='lash'?'cd':type==='orb'?'altCD':'blastCD']=cd;}
function updateGhostBoss(dt){if(net.role==='guest'||zone!==22)return;ensureGhostBoss();const dead=enemies.find(e=>e.ghostBoss&&!e.alive);if(dead){dead.respawn=Math.max(0,(dead.respawn??60)-dt);if(dead.respawn===0){enemies.splice(enemies.indexOf(dead),1);ensureGhostBoss();}}const b=enemies.find(e=>e.ghostBoss&&e.alive);if(!b||b.possessedTime>0)return;for(const k of ['cd','altCD','blastCD','hit','stun','lit'])b[k]=Math.max(0,(b[k]||0)-dt);b.cycle+=dt;const lit=[player,...remoteTargets()].some(o=>fireForm(o)&&dist(o,b)<320)||LAMPS.some((l,i)=>hauntWorld.lamps[i]>0&&dist(l,b)<650);if(lit)b.lit=1;b.immune=b.cycle%10>6&&b.lit<=0;b.moving=false;const f=b.castData;if(f){f.t-=dt;if(!f.hit&&f.t<=.25){f.hit=true;if(f.type==='orb')hostileShots.push({type:'ghostorb',x:b.x,y:b.y-35,dx:Math.cos(f.a)*230,dy:Math.sin(f.a)*230,r:12,t:3,damage:35});else for(const t of teamTargets()){const a=Math.atan2(t.y-b.y,t.x-b.x),angle=Math.abs(Math.atan2(Math.sin(a-f.a),Math.cos(a-f.a)));if(dist(t,b)<f.r&&(f.type==='burst'||angle<.7)&&lineClear(b.x,b.y,t.x,t.y))hurtTeam(t,f.damage);}if(zone!==22)return;OmniSound.play('crystal');}if(f.t<=0)b.castData=null;return;}if(b.stun>0)return;const target=teamTargets().sort((a,c)=>dist(a,b)-dist(c,b))[0],d=dist(target,b);b.face=target.x>b.x?1:-1;if(d>800)return;if(d<190&&b.cd<=0)ghostBossCast(b,'lash',1,210,30,4);else if(d<260&&b.blastCD<=0)ghostBossCast(b,'burst',1.4,260,40,9);else if(d<600&&b.altCD<=0)ghostBossCast(b,'orb',1.1,600,35,6);else if(d>140){moveActor(b,(target.x-b.x)/d*135*dt,(target.y-b.y)/d*135*dt);b.moving=true;b.anim+=dt*6;}}
function updateHospital(dt){if(!hospital())return;hauntClock+=dt;if(zone===20){player.battery=0;player.alien=false;if(race==='osmo'&&player.form!=='human'){player.form='human';refreshOsmo();player.hp=Math.min(player.hp,maxHP());}if(net.role!=='guest')for(const e of enemies){e.patrol+=dt;e.face=Math.sin(e.patrol*.42+Number(e.id.slice(-1))*2)>0?1:-1;moveActor(e,e.face*48*dt,0);e.x=clamp(e.x,e.homeX-165,e.homeX+165);e.anim+=dt*5;}const spotted=enemies.some(e=>e.guard&&guardSees(e,player));player.detection=clamp(player.detection+dt*(spotted?player.crouching?.9:1.5:-1.7),0,1);if(player.detection>=1){hospitalCheckpoint('Guardia: eliminado');return;}}if(zone===21){const flying=player.alien&&player.activeAlien==='insect'&&player.flight>0||player.jump>0||player.ghostPhase>0;player.hauntHazard=Math.max(0,player.hauntHazard-dt);if(!flying&&ECTO.some(r=>inRect(player,r))&&player.hauntHazard<=0){player.hauntHazard=1;hitPlayer(8);}if(net.role!=='guest'){for(let i=0;i<3;i++){if(hauntWorld.tiles[i]>0){hauntWorld.tiles[i]+=dt;if(hauntWorld.tiles[i]>7)hauntWorld.tiles[i]=0;}else if([player,...remoteTargets()].some(o=>inRect(o,FRAGILE[i])&&!(o.alien&&o.activeAlien==='insect'&&o.flight>0)&&!(o.jump>0)))hauntWorld.tiles[i]=.001;}}if(!flying&&FRAGILE.some((r,i)=>hauntWorld.tiles[i]>1.1&&hauntWorld.tiles[i]<6&&inRect(player,r))){player.x=130;player.y=800;player.hp=Math.max(1,player.hp-maxHP()*.15);player.regenWait=12;toast('El suelo cediÃ³ Â· vuelve a intentarlo');}if(player.haunt.phase>=2&&hauntWorld.switches.some((v,i)=>v!==player.haunt.switches[i]))syncHauntProgress();}if(net.role!=='guest')hauntWorld.lamps=hauntWorld.lamps.map(v=>Math.max(0,v-dt));updateGhostBoss(dt);}
function drawGuard(e){sprite(73,player.detection>.4?5:1+Math.floor(e.anim)%2,e.x,e.y,110,e.face);ctx.save();ctx.fillStyle=player.detection>.5?'#ff535344':'#ffeb9225';ctx.strokeStyle='#f6e29b55';ctx.beginPath();ctx.moveTo(e.x,e.y);const a=e.face>0?0:Math.PI;ctx.arc(e.x,e.y,260,a-.48,a+.48);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
function drawGhostBoss(b){const f=b.castData,frame=b.immune?5:b.lit>0&&b.hit>0?6:f?f.type==='lash'?(f.hit?4:3):7:b.moving?1+Math.floor(b.anim)%2:0;sprite(72,frame,b.x,b.y+Math.sin(clock*3)*5,175,b.face,b.immune?.45:1);txt('FANTASMÃTICO Â· NV.20',b.x,b.y-197,11,'#ead0ff');txt(b.immune?'INTANGIBLE Â· ILUMÃNALO':'SÃ“LIDO',b.x,b.y-213,9,b.immune?'#c89aff':'#ffe698');ctx.fillStyle='#25172f';ctx.fillRect(b.x-75,b.y-190,150,7);ctx.fillStyle='#c9a4ed';ctx.fillRect(b.x-75,b.y-190,150*b.hp/b.max,7);if(f){ctx.fillStyle=f.hit?'#d49aff77':'#be79ee22';ctx.strokeStyle='#e9b9ff';ctx.lineWidth=f.hit?6:2;ctx.beginPath();if(f.type==='burst')ctx.ellipse(b.x,b.y,f.r,f.r*.5,0,0,Math.PI*2);else{ctx.moveTo(b.x,b.y);ctx.arc(b.x,b.y,f.r,f.a-.35,f.a+.35);ctx.closePath();}ctx.fill();ctx.stroke();}}
function drawHospitalFloor(){if(zone===20){for(const b of region().colliders.filter(b=>b.y>500)){ctx.fillStyle='#242132';ctx.fillRect(b.x,b.y-38,b.w,b.h+38);ctx.strokeStyle='#a19799';ctx.strokeRect(b.x,b.y-38,b.w,b.h+38);ctx.beginPath();ctx.moveTo(b.x,b.y-38);ctx.lineTo(b.x+b.w,b.y+b.h);ctx.moveTo(b.x+b.w,b.y-38);ctx.lineTo(b.x,b.y+b.h);ctx.stroke();}txt('SALIDA AL LABORATORIO â†’',1370,535,12,'#9df4bd');}if(zone===21){for(const r of ECTO){ctx.fillStyle='#753ba4bb';ctx.fillRect(r.x,r.y,r.w,r.h);for(let i=0;i<15;i++){ctx.fillStyle='#ce7cde88';ctx.fillRect(r.x+(i*51)%r.w,r.y+(i*23)%r.h+Math.sin(clock*3+i)*5,14,6);}}FRAGILE.forEach((r,i)=>{ctx.fillStyle=hauntWorld.tiles[i]>1.1&&hauntWorld.tiles[i]<6?'#090713':hauntWorld.tiles[i]>0?'#af6574':'#676475';ctx.fillRect(r.x+2,r.y+2,r.w-4,r.h-4);ctx.strokeStyle='#211c30';ctx.beginPath();ctx.moveTo(r.x+10,r.y+8);ctx.lineTo(r.x+50,r.y+55);ctx.lineTo(r.x+22,r.y+90);ctx.stroke();});SWITCHES.forEach((o,i)=>{ctx.fillStyle='#252f3e';ctx.fillRect(o.x-23,o.y-35,46,35);ctx.fillStyle=hauntWorld.switches[i]?'#99ef95':'#ef8c9c';ctx.fillRect(o.x-12,o.y-27,24,16);txt('INTERRUPTOR '+(i+1),o.x,o.y-46,10,'#dbdaf5');});}if(zone===22)LAMPS.forEach((o,i)=>{ctx.fillStyle=hauntWorld.lamps[i]>0?'#fff1ad':'#777188';ctx.fillRect(o.x-10,o.y-70,20,33);ctx.fillStyle='#59586a';ctx.fillRect(o.x-4,o.y-37,8,37);txt('LUZ Â· E',o.x,o.y-85,10,'#ecd6a2');});}
function drawV13Effects(){for(const f of effects)if(f.type==='ghostlash'||f.type==='ghostpulse'){ctx.save();ctx.strokeStyle='#d7a7f4';ctx.lineWidth=5;if(f.type==='ghostlash'){for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(f.x,f.y-50);ctx.quadraticCurveTo(f.x+Math.cos(f.a)*80,f.y-80+i*25,f.x+Math.cos(f.a)*f.r,f.y+Math.sin(f.a)*f.r-60+i*20);ctx.stroke();}}else{ctx.beginPath();ctx.ellipse(f.x,f.y,Math.max(1,f.r*(1-f.t/f.max)),Math.max(1,f.r*.4*(1-f.t/f.max)),0,0,Math.PI*2);ctx.stroke();}ctx.restore();}for(const e of enemies)if(e.possessedTime>0){ctx.strokeStyle='#cda4ff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(e.x,e.y-35,60,65,0,0,Math.PI*2);ctx.stroke();txt('POSEÃDO',e.x,e.y-125,10,'#e8cbff');}if(zone===19){ctx.strokeStyle='#a7bedf66';ctx.lineWidth=1;for(let i=0;i<100;i++){const x=(i*149+clock*110)%WW,y=(i*77+clock*430)%WH;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-10,y+30);ctx.stroke();}if(Math.sin(clock*1.4)>.996){ctx.fillStyle='#c5d8ff55';ctx.fillRect(0,0,WW,WH);}}if(zone===22){const glow=fireForm(player)?310:145,g=ctx.createRadialGradient(player.x,player.y-45,60,player.x,player.y-45,glow);g.addColorStop(0,'#03010a00');g.addColorStop(1,'#03010a99');ctx.fillStyle=g;ctx.fillRect(0,0,WW,WH+140);}if(race==='osmo'&&ghostForm()&&player.ghostCorrupt>=70){ctx.fillStyle='rgba(23,0,35,'+((player.ghostCorrupt-70)/30*.72)+')';ctx.fillRect(0,0,WW,WH+140);}}
function hudV13(){if(player.watchOpen&&race==='omni')$('#talk').classList.add('hidden');const toggle=$('#cinematoggle');toggle.classList.toggle('hidden',race!=='omni'||player.alien||!player.watchOpen);toggle.textContent=cinemaEnabled?'DESACTIVAR ANIMACIÃ“N / SONIDO':'ACTIVAR ANIMACIÃ“N / SONIDO';$('#watchclose').classList.toggle('hidden',race!=='omni'||player.alien||!player.watchOpen);$('#hauntaction').classList.toggle('hidden',!hospital());$('#hauntaction').textContent=zone===19?'MISIÃ“N Â· HOSPITAL':zone===20?player.crouching?'LEVANTARSE':'AGACHARSE':zone===21?'INTERRUPTOR Â· E':'ENCENDER LUZ Â· E';$('#spectralbar').classList.toggle('hidden',!(race==='osmo'&&(ghostForm()||player.ghostLock>0))&&!hospital());if(hospital()){$('#mission .tiny').textContent='HOSPITAL Â· EXPEDICIÃ“N ESPECTRAL';$('#questtext').textContent=player.haunt.complete?(player.ghostDNA?'ADN obtenido':'Derrota y escanea Â· ADN 20 %'):zone===20?'SIGILO Â· Evita a los guardias':zone===21?'Interruptores '+hauntWorld.switches.filter(Boolean).length+' / 3':zone===22?'Ilumina al espectro':'MisiÃ³n disponible Â· Nivel 20';$('#questsub').textContent=zone===20?'Cajas y pilares bloquean su visiÃ³n':zone===21?'Ectoplasma y suelo frÃ¡gil':zone===22?'Fuego o lÃ¡mparas â†’ forma sÃ³lida':'Hospital al norte de las Ruinas';$('#spectralbar').textContent=zone===20?'DETECCIÃ“N '+Math.round(player.detection*100)+'% Â· '+(player.crouching?'AGACHADO':'DE PIE'):zone===21?'FASE 2 Â· APAGA LAS 3 MÃQUINAS':zone===22?'FASE 3 Â· ADN PARA AMBAS RAZAS':'INTERFERENCIA MAGNÃ‰TICA EN EL INTERIOR';}if(interference()){$('#batteryfill').style.background=Math.floor(clock*5)%2?'#fa414a':'#701521';$('#batterytext').textContent='0%';$('#batteryhint').textContent='INTERFERENCIA Â· SIN FORMAS';}else $('#batteryfill').style.background='';if(race==='omni'&&!player.alien&&player.selected==='ghost'&&(!player.ghostDNA||player.level<20)){$('#transformhint').textContent='BLOQUEADO Â· MISIÃ“N HOSPITAL';$('#dialmastery').textContent='ADN ESPECTRAL PENDIENTE';}if(race==='osmo'&&(ghostForm()||player.ghostLock>0)){$('#spectralbar').textContent=player.ghostLock>0?'ADN EN RECARGA Â· '+Math.ceil(player.ghostLock)+' s':'CORRUPCIÃ“N '+Math.floor(player.ghostCorrupt)+'%'+(player.ghostCorrupt>=70?' Â· Â¡ALERTA! VUELVE A BASE':'');$('#spectralbar').style.background=player.ghostCorrupt>=70?'#762b54':'#372c53';if(ghostForm()){$('#transformlabel').textContent='VOLVER A BASE';$('#transformhint').textContent='CONTROLAR CORRUPCIÃ“N';$('#masterylabel').textContent='MAESTRÃA ESPECTRAL';}}}
function v13Receive(m){if(m.type==='warpRequest'&&net.role==='host'){if(m.zone===zone&&warpAllowedDestination(m.n)&&net.remote?.warps?.includes(m.n)&&!cinematic&&![20,21,22].includes(zone)&&player.regenWait<=0&&law.timer<=0&&!Object.values(net.members).some(o=>o.regenWait>0)){closeDialog();enterZone(m.n,'center');netUpdate(.2);}else lanSend({type:'warpDenied'});return true;}if(m.type==='warpDenied'){toast('Teletransporte no disponible: cierra menÃºs y sal del combate');return true;}if(m.type==='hauntSwitch'&&net.role==='host'&&zone===21&&m.zone===21&&[0,1,2].includes(m.i)&&net.remote?.hauntPhase>=2&&dist(net.remote,SWITCHES[m.i])<100){hauntWorld.switches[m.i]=true;syncHauntProgress();netUpdate(.2);return true;}if(m.type==='hauntLamp'&&net.role==='host'&&zone===22&&m.zone===22&&[0,1].includes(m.i)&&dist(net.remote,LAMPS[m.i])<125){hauntWorld.lamps[m.i]=12;return true;}if(m.type==='ghostVictory'&&net.role==='guest'&&zone===22){ghostVictory();return true;}if(m.type==='possess'&&net.role==='host'&&m.zone===zone&&m.seq>net.seen&&ghostForm(net.remote)){net.seen=m.seq;const e=enemies.find(e=>e.id===m.id);if(e?.alive&&!e.guard&&!e.possessedBy&&!(e.hexBoss&&e.shield>0)&&!(e.ghostBoss&&e.immune)&&dist(e,net.remote)<290){e.possessedBy='guest';e.possessedPeer=net.sourcePeer;e.possessedTime=(e.hexBoss||e.majorBoss||e.wolfBoss||e.robotBoss||e.chapter2||e.ghostBoss)?2.3:4.3;}return true;}if(m.type==='releasePossession'&&net.role==='host'){const e=enemies.find(e=>e.id===m.id&&e.possessedBy==='guest'&&e.possessedPeer===net.sourcePeer);if(e){e.possessedBy=null;e.possessedTime=0;}return true;}return false;}
$('#cinematoggle').onclick=toggleCinema;$('#watchclose').onclick=toggleWatchOff;$('#hauntaction').onclick=hauntAction;canvas.addEventListener('pointerup',cinemaDoubleTap);$('#cinemaworld').addEventListener('pointerup',cinemaDoubleTap);document.body.append($('#cinemaresume'));

initProgress();
$('#cinemaresume').onclick=resumeCinema;
// OMNI 0.16. Stable save identifiers; all new content is additive.
ALIENS.grey={name:'Materia Gris',row:80,hp:150,color:'#a9e5d7',skills:[
{name:'Intelecto superior',short:'INTELECTO',damage:0,cd:65,unlock:0,cost:0},
{name:'Portal Gun',short:'PORTAL',damage:0,cd:8,unlock:15,cost:0},
{name:'Pulso neuronal',short:'PULSO',damage:34,cd:5,unlock:40,cost:0},
{name:'Escudo calculado',short:'BARRERA',damage:0,cd:16,unlock:75,cost:0},
{name:'Sobrecarga tecnolÃ³gica',short:'SOBRECARGA',damage:58,cd:10,unlock:0,cost:0,points:3},
{name:'Singularidad tÃ¡ctica',short:'SINGULARIDAD',damage:22,cd:14,unlock:0,cost:0,points:3}]};
CORE_ALIENS.push('grey');SPEEDS.grey=205;
const VOID_NAMES=['Umbral del VacÃ­o','Arcos del VacÃ­o','Puentes suspendidos','CorazÃ³n de asteroide'];
for(let i=0;i<4;i++)REGIONS.push({id:'null'+i,name:VOID_NAMES[i],subtitle:'VacÃ­o Nulo Â· enemigos de nivel 40',minX:40,maxX:1560,top:i===2?620:i===3?575:565,bottom:i>=2?740:855,exitY:i>=2?690:735,portalX:800,color:'#da95ff',city:false,void:true,links:{...(i?{left:23+i}:{}),...(i<3?{right:25+i}:{})},colliders:[{x:0,y:0,w:1600,h:520}],spawns:[[720,i>=2?685:710],[1080,i>=2?700:785],[1380,i>=2?675:630]]});
const inVoid=()=>!!region().void;
function initV15(){player.intellect=Math.max(0,Math.min(50,Number(player.intellect)||0));player.greyFrame=0;player.portalCast=null;player.greyPunchCD=0;if(!player.voidReturn||!Number.isInteger(player.voidReturn.zone)||player.voidReturn.zone<0||player.voidReturn.zone>=24||[20,21,22].includes(player.voidReturn.zone))player.voidReturn={zone:1,x:540,y:627};}
function greyForm(o=player){return (o===player?race:o.race)==='omni'&&o.alien&&o.activeAlien==='grey';}
function greyPose(o){return {row:80,f:o.attack>0?(o.greyFrame||3):underwater()?11:o.jump>0?10:o.moving?1+walkFrame166(o,2,Math.floor(o.anim)%2):0,lift:0};}
function greyAttack(i){if(!started||paused||cinematic||!greyForm()||player.cool[i]>0||player.portalCast)return false;const s=ALIENS.grey.skills[i];if(!unlockedSkill('grey',i)){toast(i<4?'Necesitas mÃ¡s maestrÃ­a':'Aprende esta habilidad en el Ã¡rbol');return false;}if(i===1&&(interference()||hospital()||law.timer>0)){toast('No puedes abrir el portal durante esta misiÃ³n o persecuciÃ³n');return false;}player.cool[i]=s.cd;player.attack=.65;player.greyFrame=[5,6,8,9,8,7][i];const target=nearest(450),a=target?Math.atan2(target.y-player.y,target.x-player.x):Math.atan2(player.dy,player.dx);player.face=Math.cos(a)>=0?1:-1;
 if(i===0){const ratio=player.hp/maxHP();player.intellect=50;player.hp=Math.max(1,ratio*maxHP());burst(player.x,player.y-35,24,'#bbff96');toast('Intelecto superior Â· +20% vida durante 50 s');}
 if(i===1){player.portalCast={t:.95};player.attack=1;player.greyFrame=7;effects.push({type:'greyportal',x:player.x+player.face*55,y:player.y-22,r:52,t:1,max:1});}
 if(i===2){shoot('electric',a,s.damage*multiplier(),520);effects.push({type:'sonic',a,x:player.x,y:player.y-22,r:120,t:.4,max:.4});}
 if(i===3){player.shield=90*healthFactor();player.shieldTime=8;burst(player.x,player.y-25,24,'#acfff2');}
 if(i===4){castArea('ring',player.x,player.y,180,s.damage*multiplier(),.75,'#b7f9f0');for(const e of enemies)if(e.alive&&dist(e,player)<180)applyStatus(e,'slow',3);}
 if(i===5){const t=target||{x:player.x+player.face*150,y:player.y};effects.push({type:'greywell',x:t.x,y:t.y,r:140,t:3,max:3,tick:0,pulses:0,damage:s.damage*multiplier()});}
 tone(i===1?600:850,.18,'triangle');return true;}
function greyPunch(){if(!started||paused||!greyForm()||player.greyPunchCD>0||player.portalCast)return;player.greyPunchCD=.55;player.attack=.32;player.greyFrame=player.anim%2?3:4;const t=nearest(100);if(t){player.face=t.x>=player.x?1:-1;damageTarget(t,12*multiplier());}effects.push({type:'punch',x:player.x+player.face*32,y:player.y-23,r:20,t:.22,max:.22});window.OmniSound?.play('punch');}
function requestVoid(){if(net.role==='guest'){lanSend({type:'voidRequest',zone,seq:++net.seq});return true;}return travelVoid();}
function travelVoid(){if(interference()||hospital())return false;const returning=inVoid(),dest=returning?player.voidReturn:{zone:24,x:180,y:735};if(!returning)player.voidReturn={zone,x:player.x,y:player.y};const returnPoint=cleanClone(player.voidReturn);if(!enterZone(dest.zone,'center'))return false;Object.assign(player,{x:dest.x,y:dest.y,inv:2});cam.x=clamp(player.x-W*.48,0,cameraMaxX());cam.y=clamp(player.y-H*.61,0,cameraMaxY());if(net.peer)lanSend({type:'voidTravel',dest,returnPoint});save();return true;}
function v15Receive(m){if(m.type==='voidRequest'&&net.role==='host'&&m.zone===zone&&net.remote?.activeAlien==='grey'&&net.remote?.alien&&m.seq>net.seen){net.seen=m.seq;travelVoid();return true;}if(m.type==='voidTravel'&&net.role==='guest'&&m.dest&&Number.isInteger(m.dest.zone)&&REGIONS[m.dest.zone]&&![20,21,22].includes(m.dest.zone)){player.voidReturn=cleanClone(m.returnPoint);net.applying=true;enterZone(m.dest.zone,'center');player.x=clamp(m.dest.x+45*net.id,region().minX+20,region().maxX-20);player.y=clamp(m.dest.y,region().top,region().bottom);player.inv=2;net.applying=false;save();return true;}return false;}
function seedVoid(){enemies=region().spawns.map(([x,y],i)=>{const t=(zone-24+i)%4,hp=[1900,1550,2200,2700][t];return {id:'void'+zone+'_'+i,kind:'void',voidEnemy:true,voidType:t,level:40,x,y,homeX:x,homeY:y,hp,max:hp,damage:[64,58,74,82][t],reward:[760,700,900,1080][t],alive:true,face:-1,anim:0,moving:false,hit:0,stun:0,cd:2+i,wind:0,cast:0,respawn:0};});zoneStates[region().id]=enemies;}
function damageVoid(e,dmg){if(!e.alive)return;e.hp=Math.max(0,e.hp-Math.round(dmg));e.hit=.2;popup(e.x,e.y-145,String(Math.round(dmg)));if(!e.hp){e.alive=false;e.wind=0;e.respawn=60;const amount=net.source==='guest'?0:voidReward41();if(net.source!=='guest'&&amount)xp(amount);popup(e.x,e.y-165,'+'+amount+' EXP','#cfff94');burst(e.x,e.y-45,25,'#b889ec');save();}}
function updateVoidEnemy(e,dt){e.hit=Math.max(0,e.hit-dt);e.stun=Math.max(0,e.stun-dt);e.cd=Math.max(0,e.cd-dt);e.cast=Math.max(0,e.cast-dt);e.moving=false;if(!e.alive){e.respawn-=dt;if(e.respawn<=0)Object.assign(e,{alive:true,hp:e.max,x:e.homeX,y:e.homeY,cd:3,wind:0});return;}if(e.possessedTime>0||e.stun>0)return;const t=teamTargets().sort((a,b)=>dist(a,e)-dist(b,e))[0],d=dist(e,t);e.face=t.x>=e.x?1:-1;if(e.wind>0){e.wind-=dt;if(e.wind<=0){e.cast=.45;if(e.voidType<2)hostileShots.push({type:e.voidType===0?'bossfire':'hexbolt',x:e.x,y:e.y-35,dx:Math.cos(e.aim)*310,dy:Math.sin(e.aim)*310,t:2.2,r:14,damage:e.damage});else {for(const target of teamTargets())if(dist(e,target)<(e.voidType===3?170:135)&&lineClear(e.x,e.y,target.x,target.y))hurtTeam(target,e.damage);effects.push({type:'slam',x:e.x,y:e.y,r:170,t:.65,max:.65});}}return;}if(d>700)return;const range=e.voidType<2?400:e.voidType===3?155:120;if(d<range&&e.cd<=0&&lineClear(e.x,e.y,t.x,t.y)){e.aim=Math.atan2(t.y-e.y,t.x-e.x);e.wind=e.voidType===3?1.3:.95;e.cd=[4.5,4,3.7,5.5][e.voidType];}else if(d>range*.72){const speed=[125,155,185,110][e.voidType];moveActor(e,(t.x-e.x)/Math.max(1,d)*speed*dt,(t.y-e.y)/Math.max(1,d)*speed*dt);e.anim+=dt*6;e.moving=true;}}
function drawVoidEnemy(e){const f=e.hit>0?5:e.wind>0?3:e.cast>0?4:e.moving?1+Math.floor(e.anim)%2:0,h=[140,130,115,155][e.voidType];sprite(81+e.voidType,f,e.x,e.y-(e.voidType===1?15+Math.sin(clock*4)*6:0),h,e.face,e.hit>0?.6:1);txt(['CARCELERO ÃGNEO','VIGÃA ALADO','DEVORADOR','TITÃN DEL VACÃO'][e.voidType]+' Â· NV.40',e.x,e.y-h-20,9,'#e1b3ff');ctx.fillStyle='#201329';ctx.fillRect(e.x-40,e.y-h-13,80,5);ctx.fillStyle='#d496ec';ctx.fillRect(e.x-40,e.y-h-13,80*e.hp/e.max,5);if(e.wind>0){txt('!',e.x,e.y-h-36,20,'#ffbe95');ctx.strokeStyle='#ff9b84';ctx.beginPath();ctx.ellipse(e.x,e.y,e.voidType===3?170:70,30,0,0,Math.PI*2);ctx.stroke();}}
function updateV15(dt){player.greyPunchCD=Math.max(0,(player.greyPunchCD||0)-dt);if(player.intellect>0){const prev=maxHP();player.intellect=Math.max(0,player.intellect-dt);if(!player.intellect&&greyForm())player.hp=Math.max(1,Math.min(maxHP(),player.hp/prev*maxHP()));}if(player.portalCast){player.portalCast.t-=dt;if(player.portalCast.t<=0){player.portalCast=null;requestVoid();}}for(const e of effects)if(e.type==='greywell'){e.tick-=dt;if(e.tick<=0&&e.pulses<4){e.tick+=.75;e.pulses++;areaHit(e.x,e.y,e.r,e.damage,.15);for(const t of enemies)if(t.alive&&dist(t,e)<e.r&&!t.majorBoss&&!t.hexBoss&&!t.ghostBoss)moveActor(t,(e.x-t.x)*.13,(e.y-t.y)*.13);}}}
function drawV15(){for(const f of effects)if(['greyportal','greywell'].includes(f.type)){ctx.save();ctx.strokeStyle=f.type==='greyportal'?'#9affed':'#dc9cff';ctx.lineWidth=4;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(f.x,f.y,Math.max(4,f.r-i*8),f.type==='greyportal'?f.r*1.1:f.r*.4,0,clock*5+i,clock*5+i+4.7);ctx.stroke();}ctx.restore();}if(greyForm()&&player.intellect>0){ctx.strokeStyle='#c7ff93';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(player.x,player.y-51,23,7,0,0,Math.PI*2);ctx.stroke();}}
function hudV15(){const b=$('#greypunch');b.classList.toggle('hidden',!greyForm());b.textContent='PUÃ‘O Â· '+((player.greyPunchCD||0)>0?player.greyPunchCD.toFixed(1)+'s':'LISTO');if(greyForm()&&player.intellect>0)$('#regen').textContent+=' Â· INTELECTO '+Math.ceil(player.intellect)+'s';if(inVoid()){$('#mission .tiny').textContent='VACÃO NULO Â· NIVEL 40';$('#questtext').textContent='Cuatro sectores Â· enemigos de Ã©lite';$('#questsub').textContent='Portal Gun: volver al punto original';}}
function installScroll15(){const d=$('.dialog'),body=$('#dialogbody');d.classList.add('scroll15');let start=null,moved=false;body.addEventListener('pointerdown',e=>{if(e.target.closest('input,select,textarea'))return;start={id:e.pointerId,y:e.clientY,scroll:body.scrollTop};moved=false;});body.addEventListener('pointermove',e=>{if(!start||start.id!==e.pointerId)return;const scale=$('#game').getBoundingClientRect().width/960,dy=(e.clientY-start.y)/scale;if(Math.abs(dy)>6){moved=true;body.scrollTop=start.scroll-dy;}});body.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false;}},true);document.addEventListener('pointerup',()=>{start=null;});body.addEventListener('pointercancel',()=>start=null);const nav=document.createElement('div');nav.id='scrollnav';nav.innerHTML='<button aria-label="Scroll up">â–²</button><span>DESLIZAR</span><button aria-label="Scroll down">â–¼</button>';d.insertBefore(nav,$('#dialogbuttons'));nav.firstElementChild.onclick=()=>body.scrollBy({top:-200,behavior:'smooth'});nav.lastElementChild.onclick=()=>body.scrollBy({top:200,behavior:'smooth'});}

function settings15(){showDialog('OMNI Â· CONFIGURACIÃ“N','ConfiguraciÃ³n','<p>Idioma</p><div class="language15" data-no-i18n>'+[['es','EspaÃ±ol'],['en','English'],['pt','PortuguÃªs'],['tr','TÃ¼rkÃ§e']].map(([id,label])=>'<button data-language="'+id+'" class="inlinebtn '+(OmniI18n.lang===id?'active':'')+'">'+label+'</button>').join('')+'</div>',[['GUÃA COMPLETA',()=>guide()],['MÃšSICA / SONIDO',()=>OmniMusic.open()],['VOLVER',closeDialog]]);document.querySelectorAll('[data-language]').forEach(b=>b.onclick=()=>{OmniI18n.set(b.dataset.language);settings15();});}
function guide(section=0){const pages=OMNI_GUIDE15[OmniI18n.lang]||OMNI_GUIDE15.es;showDialog('OMNI Â· 0.15','GuÃ­a completa','<div class="guide15" data-no-i18n><nav>'+pages.map(([title],i)=>'<button class="inlinebtn" data-guide="'+i+'">'+(i+1)+'. '+title+'</button>').join('')+'</nav><h3>'+pages[section][0]+'</h3><p>'+pages[section][1]+'</p></div>',[['VOLVER',closeDialog]]);document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>guide(+b.dataset.guide));}

ALIENS.ultra={name:'Ultra T',row:90,hp:350,color:'#9eff38',skills:[
 {name:'Deslizamiento lÃ­quido',short:'CHARCO',damage:30,cd:3.8,unlock:0,cost:0},
 {name:'Rayo Ã³ptico',short:'RAYO',damage:44,cd:5,unlock:15,cost:0},
 {name:'Armadura robÃ³tica',short:'ROBOT',damage:48,cd:22,unlock:40,cost:0},
 {name:'Tanque de plasma',short:'TANQUE',damage:55,cd:26,unlock:75,cost:0},
 {name:'Pulso de nanocircuitos',short:'PULSO',damage:65,cd:14,unlock:0,cost:0,points:3}]};
CORE_ALIENS.push('ultra');SPEEDS.ultra=210;
function ultraForm(o=player){return (o===player?race:o.race)==='omni'&&o.alien&&o.activeAlien==='ultra';}
function initV16(){player.ultraMode='base';player.ultraTime=0;player.ultraFrame=0;player.ultraSlide=null;player.ultraBasicCD=0;}
function ultraHeight(o){return o.ultraMode==='robot'?172:o.ultraMode==='tank'?170:132;}
function ultraPose(o){let f=0;if(o.ultraMode==='robot')f=o.attack>0?11:o.moving?9+walkFrame166(o,2,Math.floor(o.anim)%2):8;else if(o.ultraMode==='tank')f=o.attack>0?14:o.moving?12+walkFrame166(o,2,Math.floor(o.anim)%2):12;else f=o.attack>0?(o.ultraFrame||3):o.moving?1+walkFrame166(o,2,Math.floor(o.anim)%2):0;return {row:90,f,lift:0};}
function ultraBasic(){if(!started||paused||cinematic||!ultraForm()||player.ultraBasicCD>0||player.ultraSlide)return;const mode=player.ultraMode;player.ultraBasicCD=mode==='tank'?1.6:mode==='robot'?1.05:.7;player.attack=.48;player.ultraFrame=3;const t=nearest(mode==='tank'?480:150),a=t?Math.atan2(t.y-player.y,t.x-player.x):Math.atan2(player.dy,player.dx);player.face=Math.cos(a)>=0?1:-1;
 if(mode==='tank'){shoot('plasma16',a,55*multiplier(),430);effects.push({type:'ultraflash',x:player.x+player.face*70,y:player.y-35,r:30,t:.3,max:.3});}
 else{if(t&&dist(t,player)<(mode==='robot'?155:105)&&lineClear(player.x,player.y,t.x,t.y))damageTarget(t,(mode==='robot'?48:19)*multiplier(),mode==='robot'?.35:.1);effects.push({type:'punch',x:player.x+player.face*45,y:player.y-45,r:mode==='robot'?45:25,t:.35,max:.35});}window.OmniSound?.play('punch');}
function ultraAttack(i){if(!started||paused||cinematic||!ultraForm()||player.ultraSlide||player.cool[i]>0)return false;const s=ALIENS.ultra.skills[i];if(!s||!unlockedSkill('ultra',i)){toast(i===4?'Aprende esta habilidad en el Ã¡rbol':'Necesitas mÃ¡s maestrÃ­a');return false;}player.cool[i]=s.cd;player.attack=.65;const t=nearest(500),a=t?Math.atan2(t.y-player.y,t.x-player.x):Math.atan2(player.dy,player.dx),d=s.damage*multiplier();player.face=Math.cos(a)>=0?1:-1;
 if(i===0){player.ultraMode='base';player.ultraTime=0;player.ultraFrame=4;player.attack=.9;player.ultraSlide={t:.85,max:.85,a,hit:[]};}
 if(i===1){player.ultraFrame=7;effects.push({type:'ultrabeam',x:player.x,y:player.y-60,a,r:460,t:.65,max:.65});for(const e of combatants()){const angle=Math.atan2(e.y-player.y,e.x-player.x),delta=Math.atan2(Math.sin(angle-a),Math.cos(angle-a));if(e.alive!==false&&dist(e,player)<460&&Math.abs(delta)<.16&&lineClear(player.x,player.y,e.x,e.y))damageTarget(e,d,.3);}}
 if(i===2||i===3){player.ultraMode=i===2?'robot':'tank';player.ultraTime=12;player.attack=.55;burst(player.x,player.y-50,28,'#a9ff42');effects.push({type:'ultraemp',x:player.x,y:player.y-20,r:100,t:.7,max:.7});ultraBasic();}
 if(i===4){player.ultraMode='base';player.ultraTime=0;player.ultraFrame=15;castArea('ultraemp',player.x,player.y,210,d,.5,'#aaff45');for(const e of enemies)if(e.alive&&dist(e,player)<210)applyStatus(e,'slow',2.5);}
 tone(i===1?900:340,.15,'sawtooth');return true;}
function updateV16(dt){player.ultraBasicCD=Math.max(0,(player.ultraBasicCD||0)-dt);if(!ultraForm()){player.ultraSlide=null;player.ultraMode='base';player.ultraTime=0;return;}if(player.ultraTime>0){player.ultraTime=Math.max(0,player.ultraTime-dt);if(!player.ultraTime){player.ultraMode='base';burst(player.x,player.y-35,12,'#aaff45');}}
 const m=player.ultraSlide;if(m){m.t-=dt;player.attack=Math.max(.12,m.t);player.ultraFrame=m.t>.67?4:m.t<.15?6:5;moveActor(player,Math.cos(m.a)*350*dt,Math.sin(m.a)*350*dt);player.moving=true;for(const e of combatants())if(e.alive!==false&&!m.hit.includes(e.kind+':'+e.id)&&dist(e,player)<100&&lineClear(player.x,player.y,e.x,e.y)){m.hit.push(e.kind+':'+e.id);damageTarget(e,30*multiplier(),.3);}if(m.t<=0)player.ultraSlide=null;}
}
function drawUltraEffect16(f){if(!['ultrabeam','ultraemp','ultraflash'].includes(f.type))return false;ctx.save();ctx.globalAlpha=Math.min(1,f.t*4);ctx.strokeStyle='#81ff25';ctx.lineWidth=10;ctx.shadowColor='#88ff33';ctx.shadowBlur=12;
 if(f.type==='ultrabeam'){ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(f.x+Math.cos(f.a)*f.r,f.y+Math.sin(f.a)*f.r);ctx.stroke();ctx.strokeStyle='#eeffd2';ctx.lineWidth=3;ctx.stroke();}
 else{const r=Math.max(5,f.r*(1-f.t/f.max));ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(f.x,f.y,r,r*.5,0,0,Math.PI*2);ctx.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.fillStyle='#b5ff66';ctx.fillRect(f.x+Math.cos(a)*r-3,f.y+Math.sin(a)*r*.5-3,6,6);}}
 ctx.restore();return true;}
function hudV16(){const b=$('#ultrabasic');b.classList.toggle('hidden',!ultraForm());if(ultraForm()){b.textContent=(player.ultraMode==='tank'?'DISPARAR':player.ultraMode==='robot'?'PUÃ‘O ROBOT':'PUÃ‘O')+' Â· '+(player.ultraBasicCD>0?player.ultraBasicCD.toFixed(1)+'s':'LISTO');if(player.ultraTime>0)$('#regen').textContent+=' Â· '+player.ultraMode.toUpperCase()+' '+Math.ceil(player.ultraTime)+'s';$('#moreattacks').textContent=attackPage?'â† ATAQUES Iâ€“IV':'ATAQUE V â†’';}}

// v16 room state is keyed by native-assigned peer ID; host is always 0.
Object.assign(net,{id:0,members:{},sequences:{},peerTimes:{},peerVisuals:{},sourcePeer:null});
function clearRoom16(){net.members={};net.sequences={};net.peerTimes={};net.peerVisuals={};net.sourcePeer=null;net.remote=null;net.peer=false;net.remoteAway=false;net.visuals=null;net.guestVisuals=null;net.room=null;}
function partyPaused16(){return Object.values(net.members).some(p=>p.paused);}
function lanReceive(m,from=0){
 if(!m||m.v!==16||!net.role)return;
 const now=performance.now();net.last=now;
 if(net.role==='host'){
  if(!Number.isInteger(from)||from<1||from>2147483647)return;net.peerTimes[from]=now;
  if((m.type==='hello'||m.type==='avatar')&&m.avatar){const a=m.avatar;if(!Number.isFinite(a.x)||!Number.isFinite(a.y)||!ALIENS[a.activeAlien]||!SKINS[a.skin])return;net.members[from]={...a,id:from,kind:'remote',paused:!!m.paused};net.peer=true;net.waiting=false;net.remote=net.members[from];net.remoteAway=partyPaused16();if(m.type==='hello')lanSend(worldPacket());return;}
  if(!net.members[from])return;
  if(m.type==='visual'){net.peerVisuals[from]={projectiles:(m.projectiles||[]).slice(0,60),effects:(m.effects||[]).slice(0,35)};return;}
  if(m.type==='hurt'||m.type==='statusSelf'){
   const target=Number(m.to),source=net.members[from],t=target===0?player:net.members[target];
   if(target===from||!t||m.zone!==zone||source.zone!==zone||dist(source,t)>850)return;
   if(m.type==='hurt'&&(!Number.isFinite(m.damage)||m.damage<=0||m.damage>600))return;
   if(target===0)lanReceiveLegacy(m);else lanSend({...m,to:target});return;
  }
  const oldRemote=net.remote,oldSeen=net.seen;net.remote=net.members[from];net.seen=net.sequences[from]||0;net.sourcePeer=from;
  try{lanReceiveLegacy(m);}finally{net.sequences[from]=net.seen;net.seen=oldSeen;net.sourcePeer=null;net.source=null;net.remote=oldRemote||net.members[from];net.remoteAway=partyPaused16();}
 }else{
  if(from!==0||m.to!==undefined&&Number(m.to)!==net.id)return;
  if(m.type==='world'){
   net.members={};for(const a of (m.avatars||[]))if(a.id!==net.id)net.members[a.id]={...a,kind:'remote'};
   net.peerVisuals=m.peerVisuals||{};
  }
  lanReceiveLegacy(m);
  if(m.type==='world'){net.remote=net.members[0]||net.remote;net.remoteAway=!!m.paused;}
 }
}
function lanSend(m){if(!window.OmniLAN)return;let to=m.to;
 if(net.role==='host'&&to===undefined&&['reward','crime','wolfDNA','warpDenied','ghostSkin'].includes(m.type)&&net.sourcePeer!=null)to=net.sourcePeer;
 const data={...m,v:16,...(to!==undefined?{to}:{})};
 try{window.OmniLAN.send('@'+(net.role==='host'&&to!==undefined?to:'*')+'\n'+JSON.stringify(data));}catch(e){toast('No se pudo enviar a la sala');}
}
window.omniLanEvent=function(kind,data){
 if(kind==='data'){try{const env=JSON.parse(data);lanReceive(env.packet,env._from);}catch(e){console.warn('LAN packet rejected',e.message);}return;}
 if(kind==='hosting'){clearRoom16();net.id=0;net.role='host';net.info='SALA '+data+' Â· ESPERANDO';net.room=data;net.last=performance.now();toast('Sala '+data+' creada. Comparte tu IP y cÃ³digo.');return;}
 if(kind==='connected'){clearRoom16();net.id=Number(data);net.role='guest';net.peer=true;net.waiting=false;net.last=performance.now();lanSend({type:'hello',avatar:avatarPacket(),paused:paused||net.away});return;}
 if(kind==='peer'){net.peer=true;net.last=performance.now();net.peerTimes[Number(data)]=net.last;lanSend(worldPacket());toast('Jugador conectado Â· Fuego amigo activo');return;}
 if(kind==='peerLeft'){const id=Number(data);delete net.members[id];delete net.peerTimes[id];delete net.sequences[id];delete net.peerVisuals[id];net.peer=Object.keys(net.members).length>0;net.remote=Object.values(net.members)[0]||null;net.remoteAway=partyPaused16();for(const e of enemies)if(e.possessedPeer===id){e.possessedBy=null;e.possessedTime=0;}toast('Un jugador saliÃ³; la sala sigue abierta');return;}
 if(kind==='disconnected'||kind==='error'){clearRoom16();net.role=null;net.waiting=false;net.away=false;save();toast(kind==='error'?data:'El anfitriÃ³n cerrÃ³ la sala');}
};
function netUpdate(dt){if(!net.role||!window.OmniLAN)return;net.tick+=dt;if(net.tick<.1)return;net.tick=0;
 if(net.role==='host'){net.remoteAway=partyPaused16();if(net.peer)lanSend(worldPacket());}
 else if(net.peer){lanSend({type:'avatar',avatar:avatarPacket(),paused:paused||net.away});lanSend({type:'visual',projectiles,effects:effects.slice(0,35)});if(net.last&&performance.now()-net.last>16000){window.OmniLAN.stop();window.omniLanEvent('disconnected','');}}
}
function withPeerSource16(id,fn){const before={remote:net.remote,source:net.source,sourcePeer:net.sourcePeer};if(id!=null&&net.members[id]){net.remote=net.members[id];net.source='guest';net.sourcePeer=id;}else{net.source=null;net.sourcePeer=null;}try{return fn();}finally{Object.assign(net,before);}}

async function boot(){try{await Promise.all([['suit73_0','assets/suit73_0.webp'],['suit73_1','assets/suit73_1.webp'],['suit73_2','assets/suit73_2.webp'],['noWatch73_0','assets/noWatch73_0.webp'],['noWatch73_1','assets/noWatch73_1.webp'],['noWatch73_2','assets/noWatch73_2.webp'],['desertTown72','assets/desert-town72.webp'],['desertProps72','assets/desert-props72.webp'],['desertSand72','assets/desert-sand72.webp'],['robot71','assets/robot71.webp'],['robotFX71','assets/robot-fx71.webp'],['pinarBurn70','assets/pinar-burn70.webp'],['cenizalBurn70','assets/cenizal-burn70.webp'],['capsule70','assets/capsule70.webp'],['moonForest69','assets/moon-forest69.webp'],['smoothieInterior69','assets/smoothie-interior69.webp'],['swamp69','assets/swamp69.webp'],['aquariumBuilding69','assets/aquarium-building69.webp'],['school68','assets/school68.webp'],['parkDay68','assets/park-day68.webp'],['parkNight68','assets/park-night68.webp'],['tower68','assets/tower68.webp'],['concertBuilding68','assets/concert-building68.webp'],['casinoBuilding68','assets/casino-building68.webp'],['foodBuilding68','assets/food-building68.webp'],['ruinsForest67','assets/ruins-forest67.webp'],['riverForest67','assets/river-forest67.webp'],['campForest66','assets/camp-forest66.webp'],['osmoUltra62','assets/osmoUltra62.webp'],['eyeGuy62','assets/eyeGuy62.webp'],['vfx62','assets/vfx62.webp'],['district62','assets/district62.webp'],['maxAF58','assets/maxAF58.webp'],['worshipLeader58','assets/worshipLeader58.webp'],['worshipEnforcer58','assets/worshipEnforcer58.webp'],['worshipSmall58','assets/worshipSmall58.webp'],['dittoFemale58','assets/dittoFemale58.webp'],['tick56','assets/tick56.webp'],['crater56','assets/crater56.webp'],['interior56','assets/interior56.webp'],['diamond53','assets/diamond53.webp'],['diamondFX53','assets/diamondFX53.webp'],['vilgax53','assets/vilgax53.webp'],['meadow53','assets/meadow53.webp'],['ship53','assets/ship53.webp'],['roofs53','assets/roofs53.webp'],['shuttle53','assets/shuttle53.webp'],['rvCockpit52','assets/rvCockpit52.webp'],['rvKitchen52','assets/rvKitchen52.webp'],['rvRear52','assets/rvRear52.webp'],['arcadeHall52','assets/arcadeHall52.webp'],['diamondOsmo51','assets/diamondOsmo51.webp'],['gwen51','assets/gwen51.webp'],['interiors51','assets/interiors51.webp'],['stormProps47','assets/stormProps47.webp'],['ditto47','assets/ditto47.webp'],['dittoVFX47','assets/dittoVFX47.webp'],['viktor47','assets/viktor47.webp'],['corrosion45','assets/corrosion45.webp'],['mummy45','assets/mummy45.webp'],['castleNPC45','assets/castleNPC45.webp'],['corCinema45','assets/corCinema45.webp'],['corVFX45','assets/corVFX45.webp'],['locals44','assets/locals44.webp'],['citizens44','assets/citizens44.webp'],['houses44','assets/houses44.webp'],['castle44','assets/castle44.webp'],['houses42','assets/houses42.webp'],['anur42','assets/anur42.webp'],['texture40','assets/texture40.webp'],['ben39','assets/ben39.webp'],['locals39','assets/locals39.webp'],['ghouls39','assets/ghouls39.webp'],['terrain39','assets/terrain39.webp'],['sky39','assets/sky39.webp'],['texture39','assets/texture39.webp'],['ultra38','assets/ultra38.webp'],['npc38','assets/npc38.webp'],['ben38','assets/ben38.webp'],['citizens38','assets/citizens38.webp'],['anur38','assets/anur38.webp'],['planet38','assets/planet88.svg'],['burn38','assets/burn38.webp'],['osmoSuit37','assets/osmo-suit37.webp'],['agent35','assets/agent35.webp'],['mecha35','assets/mecha35.webp'],['laser35','assets/laser35.webp'],['suit35','assets/suit35.webp'],['forest35','assets/forest35.webp'],['kevin31','assets/kevin31.webp'],['mutant31','assets/mutant31.webp'],['tetra31','assets/tetra31.webp'],['lucky31','assets/lucky31.webp'],['omni29','assets/omni29.webp'],['helmet29','assets/helmet29.webp'],['anodite29','assets/anodite29.webp'],['lucky29','assets/lucky29.webp'],['anoditeSuit29','assets/anoditeSuit29.webp'],['npcs29','assets/npcs29.webp'],['props28','assets/props28.webp'],['npcs28','assets/npcs28.webp'],['omnisuits28','assets/omnisuits28.webp'],['racesuits28','assets/racesuits28.webp'],['vfx28','assets/vfx28.webp'],['mummyCinema28','assets/mummyCinema28.webp'],['bendy26','assets/bendy26.webp'],['inkBeast26','assets/inkBeast26.webp'],['anodite26','assets/anodite26.webp'],['anoditePower26','assets/anoditePower26.webp'],['mineGuard25','assets/mineGuard25.webp'],['benmomia25','assets/benmomia25.webp'],['phill25','assets/phill25.webp'],['cannonCinema25','assets/cannonCinema25.webp'],['mineTiles25','assets/mineTiles25.webp'],['cannonbolt23','assets/cannonbolt23.webp'],['cityExtra22','assets/cityExtra22.webp'],['smoothy22','assets/smoothy22.webp'],['clancy21','assets/clancy21.webp'],['wasp21','assets/wasp21.webp'],['buildings21','assets/buildings21.webp'],['cityPeople21','assets/cityPeople21.webp'],['cityProps21','assets/cityProps21.webp'],['watchFront20','assets/watch-front20.webp'],['watchBadge20','assets/watch-badge20.webp'],['swamp20','assets/swamp20.webp'],['wildskin20','assets/wildskin20.webp'],['ultraskin20','assets/ultraskin20.webp'],['wildvine19','assets/wildvine19.webp'],['carnivore19','assets/carnivore19.webp'],['xlrskin19','assets/xlrskin19.webp'],['ultraClean19','assets/ultra-clean19.webp'],['scanPoses18','assets/scan-poses18.webp'],['casinoNPC18','assets/casino-npc18.webp'],['acidCinema18','assets/acid-cinema18.webp'],['acid17','assets/acid-atlas17.webp'],['casino17','assets/casino17.webp'],['nuclear17','assets/nuclear17.webp'],['osmoFireCinema17','assets/osmo-fire-cinema17.webp'],['ultra16','assets/ultra16.webp'],['greycin16','assets/greycin16.webp'],['beastcin16','assets/beastcin16.webp'],['ultracin16','assets/ultracin16.webp'],['insectcin16','assets/insectcin16.webp'],['greycine15','assets/greycine15.webp'],['grey15','assets/grey15.webp'],['voidmobs15','assets/voidmobs15.webp'],['void15','assets/void15.webp'],['fourfix15','assets/fourfix15.webp'],['diamond14','assets/diamond14.webp'],['fourarms14','assets/fourarms14.webp'],['ghostlady14','assets/ghostlady14.webp'],['pinkfire14','assets/pinkfire14.webp'],['hex14','assets/hex14.webp'],['school14','assets/school14.webp'],['ghost13','assets/ghost13.webp'],['ghostboss13','assets/ghostboss13.webp'],['hospital13','assets/hospital13.webp'],['guards13','assets/guards13.webp'],['cineA13','assets/cineA13.webp'],['cineB13','assets/cineB13.webp'],['cineC13','assets/cineC13.webp'],['cineD13','assets/cineD13.webp'],['animo12','assets/animo12.webp'],['frog12','assets/frog12.webp'],['hog12','assets/hog12.webp'],['activate12','assets/activate12.webp'],['lab12','assets/lab12.webp'],['cine12','assets/cine12.webp'],['cineStart12','assets/cine-start12.webp'],['wolf11','assets/wolf-v11.webp'],['swimA11','assets/swim-a-v11.webp'],['swimB11','assets/swim-b-v11.webp'],['forest11','assets/forest-v11.webp'],['aquaticLand10','assets/aquatic-land-v10.webp'],['aquaticTail10','assets/aquatic-tail-v10.webp'],['osmoWater10','assets/osmo-water-v10.webp'],['humanSwim10','assets/human-swim-v10.webp'],['seaEnemies10','assets/sea-enemies-v10.webp'],['seaPlaces10','assets/sea-places-v10.webp'],['bellwood9','assets/bellwood-v9.webp'],['neko9','assets/neko-v9.webp'],['food9','assets/food-v9.webp'],['characters','assets/characters.webp'],['night','assets/forest-night.webp'],['day','assets/forest-day.webp'],['expansion','assets/expansion-characters.webp'],['regions','assets/forest-regions.webp'],['city','assets/city.webp'],['actors','assets/actors-v3.webp'],['four','assets/four-arms.webp'],['districts','assets/city-districts.webp'],['skins','assets/skins-v4.webp'],['speed','assets/speed-alien-v4.webp'],['slide','assets/diamond-slide-v4.webp'],['walk','assets/walk-v5.webp'],['boss','assets/boss-v5.webp'],['osmo','assets/osmo-v5.webp'],['skins6','assets/skins-v6.webp'],['bestia6','assets/bestia-v6.webp'],['knights6','assets/knights-v6.webp'],['full6','assets/full-fire-v6.webp'],['places6','assets/places-v6.webp'],['jump6','assets/jump-v6.webp'],['insect7','assets/insect-v7.webp'],['osmo7','assets/osmo-v7.webp'],['combat7','assets/combat-v7.webp'],['places7','assets/places-v7.webp'],['npcs7','assets/npcs-v7.webp'],['fourconcert8','assets/fourconcert-v8.webp'],['kim8','assets/kim-v8.webp'],['robot8','assets/robot-v8.webp'],['places8','assets/places-v8.webp']].map(([name,url])=>new Promise((resolve,reject)=>{let im=new Image();im.onload=()=>{art[name]=im;resolve();};im.onerror=()=>{reject(new Error(url));};im.src=url;})));ready=true;load();initProgress();ensureBoss();ensureRobot();ensureWolf();try{const raw=localStorage.getItem('omni-skin'),skin=Number(raw);if(raw!==null&&SKINS[skin]&&!localStorage.getItem(STORE))player.skin=skin;}catch(e){}$('#loading').textContent='Listo Â· Tu aventura se guarda automÃ¡ticamente';draw();readyLog23();}catch(e){console.error('Boot:',e);$('#loading').textContent='No se pudo cargar el bosque. Cierra y vuelve a abrir el juego.';}}
// Test hooks exist only with an explicit local QA query; the APK does not enable them.
if(location.search.includes('qa=1'))window.__game={ultraAttack,ultraBasic,ultraForm,ultraPose,updateV16,remoteTargets,teamTargets,hurtTeam,clearRoom16,greyAttack,greyPunch,greyForm,initV15,travelVoid,requestVoid,seedVoid,damageVoid,updateVoidEnemy,updateV15,settings15,inVoid,initV14,hasPinkSkin,hasGhostLady,buyPinkSkin,ghostSkinReward,rollGhostSkin,canStartStory3,startStory3,story3Kill,claimStory3,story3Talk,ensureHex,damageHex,hexCast,updateHex,drawCinema,warpAllowedDestination,ghostForm,ghostAttack,ghostPose,endGhost,absorbGhost,updateGhost13,endPossession,initV13,ghostVictory,ghostBossDamage,ensureGhostBoss,updateGhostBoss,ghostBossCast,guardSees,updateHospital,hospitalCheckpoint,hauntDialog,hauntAction,triggerSwitch,SWITCHES,LAMPS,ECTO,FRAGILE,get hauntWorld(){return hauntWorld},warpMenu,buyWarp,travelWarp,toggleCinema,skipCinema,get cinemaEnabled(){return cinemaEnabled},initV12,recoverWolf,updateRecovery,commitTransform,updateCinema,finishCinema,suspendCinema,resumeCinema,get cinematic(){return cinematic},canStartStory2,startStory2,story2Kill,claimStory2,story2Talk,chaptersMenu,ensureAnimo,updateChapter2,chapterCast,wolfUnlocked,scaledSeaXP,extinguished,coldAttack,swimAlienPose,wolfPose,wolfAttack,ensureWolf,grantWolfDNA,wolfReward,updateWolfBoss,updateV11,performThrow,underwater,healthFactor,humanHP,initV10,tenHub,canTrain,buyVitality,vitalityMenu,canBreathe,regenRate,updateVitality,updateOcean,aquaticAttack,waterOsmoAttack,seedSeaEnemies,seaDeath,updateSeaEnemy,defeat,neko,nekoTalk,nekoStory,jobsMenu,travelToJob,startCooking,kitchenProgress,initV9,initV8,hasMusicSkin,selectAlienSkin,alienSkinMenu,musicalAttack,kim,danceMenu,startDance,danceReward,startStory,claimStory,storyTalk,ensureRobot,defeatRobot,robotQuestKill,updateRobot,robotCast,beginKnightQuest,claimKnightQuest,knightKill,knightTalk,talkExtra,insectAttack,applyStatus,updateStatus,updateV7,combatPose,castFrame,hud,questKnight,ten,setDayMode:v=>dayMode=v,jump,jumpHeight,updateV6,bestiaAttack,updateKnight,net,lanMenu,lanReceive,lanSend,netUpdate,worldPacket,avatarPacket,damageTarget,combatants,draw,drawScene,get citizens(){return citizens},get officers(){return officers},get hostileShots(){return hostileShots},get law(){return law},damageCitizen,damageOfficer,updateEnemies,updateLaw,ensureCitizens,startMission,claimMission,get player(){return player},get quest(){return quest},get enemies(){return enemies},get zone(){return zone},get zoneStates(){return zoneStates},get opened(){return opened},get discovered(){return discovered},get gateLock(){return gateLock},get race(){return race},get profiles(){return profiles},get bossTimer(){return bossTimer},chooseRace,profileSnapshot,skillTree,buySkill,refundSkills,unlockAbsorption,absorb,materials,ensureBoss,bossReward,updateBoss,updateExpansion,initProgress,persistGame,sprite,SKINS,SPEEDS,moveSpeed,skinMenu,selectSkin,slide,REGIONS,ALIENS,update,transform,revert,attack,damageEnemy,xp,talk,interact,closeDialog,spawnEnemies,save,guide,enterZone,selectAlien,isSolid,lineClear,moveActor,checkGate,showWorldMap,hitPlayer,get projectiles(){return projectiles},get effects(){return effects},setStarted:()=>{started=true;paused=false;},setQuest:s=>quest={state:s,kills:0},setPaused:p=>paused=p,setKeys:k=>keys=k,maxHP,xpNeed,multiplier,mastery,get paused(){return paused}};
// OMNI 0.17 â€” inserted inside the original game closure by tools/build_web.py.
// Original region indices and save profiles are retained.
const V17={casino:28,plant:29,intake:30,spill:31,core:32};
const makeRegion17=(id,name,subtitle,links,extra={})=>({id,name,subtitle,minX:35,maxX:1565,top:550,bottom:850,exitY:710,portalX:800,color:'#82ddae',city:false,colliders:[],spawns:[],links,...extra});
REGIONS.push(
 makeRegion17('casino17','Casino de Bellwood','Fichas Â· azar Â· mesas con NPC',{down:3},{top:480}),
 makeRegion17('nuclearOutside17','Central nuclear Â· Periferia','Fuera de la ciudad Â· misiÃ³n osmosiana Â· nivel 10',{left:2,up:30},{top:650,exitY:750,bottom:880}),
 makeRegion17('nuclearIntake17','Central Â· AdmisiÃ³n','Encuentra el componente energÃ©tico',{down:29,right:31},{top:625}),
 makeRegion17('nuclearSpill17','Central Â· ContenciÃ³n','Fuga corrosiva Â· absorbe para sobrevivir',{left:30,right:32},{top:500,bottom:585,exitY:550}),
 makeRegion17('nuclearCore17','Central Â· Reactor','Corroe el cerrojo y detÃ©n la fuga',{left:31,down:29},{top:610})
);
REGIONS[2].links.up=V17.plant;REGIONS[2].portalX=850;
OSMO_FORMS.acid={name:'MutaciÃ³n Ã¡cida',hp:350,color:'#9cff43'};
OSMO_SKILLS.acid=[makeSkill('PuÃ±o corrosivo','CORROSIÃ“N',26,.85),makeSkill('Lanza tÃ³xica','LANZA',36,4,15),makeSkill('Marea de Ã¡cido','MAREA',18,9,40),makeSkill('Estallido mutante','MUTACIÃ“N',78,13,75),{...makeSkill('GÃ©iser cÃ¡ustico','GÃ‰ISER',64,10),points:3},{...makeSkill('CaparazÃ³n reactivo','CORAZA',42,16),points:3}];
ALIENS.acid={name:'MutaciÃ³n Ã¡cida',row:14,hp:350,color:'#9cff43',skills:OSMO_SKILLS.acid};
const initBase17=initProgress;
initProgress=function(){initBase17();player.nuclear=Object.assign({stage:0,acid:false,gate:false,complete:false},player.nuclear||{});player.scans=player.scans||{};player.casino=Object.assign({chips:0,day:'',bought:0,staked:0,rounds:0,net:0,last:null},player.casino||{});player.casino.chips=Math.max(0,Math.floor(Number(player.casino.chips)||0));player.masteries.acid=clamp(player.masteries.acid||0,0,100);player.learned.acid=player.learned.acid||[false,false];player.cooldowns.acid=player.cooldowns.acid||[0,0,0,0,0,0];player.scanTarget17=null;applyTheme17();};
const skillIdBase17=skillId;
skillId=function(){return race==='osmo'&&player.form==='acid'?'acid':skillIdBase17();};
let quality17='normal';try{quality17=localStorage.getItem('omni-quality17')||'normal';}catch(e){}
if(!['normal','low'].includes(quality17))quality17='normal';
let visual17=null,scan17=null,absorbHold17=0,holdingAcid17=false,hazard17=0,hudTick17=0;
const scanCorpses17=[];
const points17={casinoDoor:{x:1060,y:660},cashier:{x:320,y:510},slots:{x:720,y:500},roulette:{x:1150,y:550},dice:{x:1480,y:735},component:{x:1290,y:650},acid:{x:640,y:550},gate:{x:740,y:705},console:{x:1400,y:695}};
const baseHud17=hud;
hud=function(){baseHud17();hud17();};
function applyTheme17(){document.body.classList.toggle('osmo17',race==='osmo');document.body.classList.toggle('quality-low17',quality17==='low');}
function hud17(){applyTheme17();const scan=nearestScan17();$('#scan17').classList.toggle('hidden',!scan&&!scan17);$('#scan17').textContent=scan17?'ESCANEANDOâ€¦':scan?'ESCANEAR Â· '+Math.ceil(scan.ttl)+' s':'ESCANEAR';$('#acidhold17').classList.toggle('hidden',!(zone===V17.spill&&race==='osmo'&&!player.nuclear.acid&&player.nuclear.stage>=2&&dist(player,points17.acid)<120));$('#acidhold17').textContent=absorbHold17>0?'ASIMILANDO '+Math.floor(absorbHold17/2.2*100)+'%':'MANTÃ‰N Â· ABSORBER';
 const hint=interaction17();if(hint){$('#talk').classList.remove('hidden');$('#talk').textContent=hint.label;}
 if(zone>=V17.plant&&zone<=V17.core){$('#questtext').textContent=player.nuclear.complete?'Central estabilizada':['Central nuclear Â· nivel 10','Busca el componente energÃ©tico','Absorbe el Ã¡cido Â· mantÃ©n pulsado','Cruza el pasillo tÃ³xico','Derrite el cerrojo y corta la fuga','Central estabilizada'][player.nuclear.stage]||'Explora la central';$('#questsub').textContent=race!=='osmo'?'MisiÃ³n exclusiva de la raza osmosiana':player.nuclear.acid?'Ãcido desbloqueado Â· 350 vida base Â· mejoras con Ten':'La radiaciÃ³n causa daÃ±o sin forma Ã¡cida';}
 if(zone===V17.casino){$('#questtext').textContent='Casino de Bellwood Â· '+player.casino.chips+' fichas';$('#questsub').textContent='Habla con Vera Â· cambia monedas Â· elige una mesa';}
 if(race==='osmo'&&player.form==='acid'){$('#masterylabel').textContent='MAESTRÃA ÃCIDA';$('#masteryfill').style.width=player.masteries.acid+'%';$('#masterytext').textContent=Math.floor(player.masteries.acid)+'%';}
}
function interaction17(){if(!started)return null;
 if(false&&dist(player,points17.casinoDoor)<100)return {label:'ENTRAR AL CASINO',action:()=>travelCasino17()};
 if(zone===V17.casino){for(const [key,label,action] of [['cashier','VERA Â· CAMBIAR FICHAS',cashier17],['slots','TRAGAPERRAS',()=>casinoTable17('slots')],['roulette','RULETA Â· LÃA',()=>casinoTable17('roulette')],['dice','DADOS Â· NPC',()=>casinoTable17('dice')]])if(dist(player,points17[key])<120)return {label,action};}
 if(zone===V17.plant)return {label:'MISIÃ“N Â· CENTRAL NUCLEAR',action:nuclearBrief17};
 if(zone===V17.intake&&dist(player,points17.component)<125)return {label:player.nuclear.stage<2?'RECOGER COMPONENTE':'EXAMINAR TUBERÃA',action:triggerSpill17};
 if(zone===V17.core&&dist(player,points17.gate)<120&&!player.nuclear.gate)return {label:'CORROER CERROJO',action:()=>{if(race!=='osmo'||player.form!=='acid'){toast('Necesitas tu cuerpo corrosivo');return;}player.nuclear.gate=true;player.nuclear.stage=4;burst(points17.gate.x,points17.gate.y-50,24,'#aaff47');shake=.2;save();toast('Cerrojo disuelto Â· desactiva la fuga al otro lado');}};
 if(zone===V17.core&&dist(player,points17.console)<115)return {label:'ESTABILIZAR REACTOR',action:completeNuclear17};return null;
}
const interactBase17=interact;
interact=function(){if(!started||paused)return;if(nearestScan17()){startScan17();return;}const q=interaction17();if(q){q.action();return;}interactBase17();};
const enterBase17=enterZone;
enterZone=function(next,side){if(!REGIONS[next])return false;if(next>=V17.plant&&next<=V17.core&&net.role){toast('La misiÃ³n nuclear se juega en modo individual');return false;}if(next>=V17.intake&&next<=V17.core&&(race!=='osmo'||player.level<10||!player.nuclear?.stage)){toast('Acepta la misiÃ³n en la periferia Â· Osmosiano nivel 10');return false;}if(zone===V17.intake&&next===V17.plant&&player.nuclear.stage>=2&&!player.nuclear.complete){toast('La tuberÃ­a bloquea el regreso Â· avanza a ContenciÃ³n');return false;}if(next===V17.spill&&player.nuclear.stage<2){toast('Primero recoge el componente energÃ©tico');return false;}if(next===V17.core&&!player.nuclear.acid){toast('Asimila el Ã¡cido antes de avanzar');return false;}if(zone===V17.core&&next===V17.plant&&!player.nuclear.complete){toast('Estabiliza el reactor para abrir la salida de emergencia');return false;}const ok=enterBase17(next,side);if(ok){scan17=null;absorbHold17=0;holdingAcid17=false;if(next===V17.spill&&side!=='right')player.x=260;if(next===V17.core&&side!=='right')player.x=160;for(let i=scanCorpses17.length-1;i>=0;i--)if(scanCorpses17[i].zone!==zone)scanCorpses17.splice(i,1);applyTheme17();}return ok;};
const gateBase17=checkGate;
checkGate=function(vx,vy){if(false&&vy<0&&Math.abs(player.x-points17.casinoDoor.x)<56&&player.y<570&&gateLock<=0)return travelCasino17();return gateBase17(vx,vy);};
function travelCasino17(){if(net.role){toast('El casino se juega en modo individual');return false;}closeDialog();if(!started)$('#play').click();if(!enterZone(V17.casino,'center'))return false;player.x=400;player.y=710;save();return true;}
const jobsBase17=jobsMenu;
jobsMenu=function(){jobsBase17();if(!ready)return;$('#dialogeyebrow').textContent='VIAJE DIRECTO Â· TRES ACTIVIDADES';const b=document.createElement('button');b.className='job17';b.innerHTML='<strong>CASINO DE BELLWOOD</strong><p>Tragaperras, ruleta y dados con NPC.</p><small>Solo monedas del juego Â· probabilidades visibles</small>';b.onclick=travelCasino17;$('.jobcards').append(b);};
function dayCasino17(){const c=player.casino,d=new Date().toISOString().slice(0,10);if(c.day!==d){c.day=d;c.bought=0;c.staked=0;}return c;}
function cashChange17(n){const c=dayCasino17();if(!Number.isSafeInteger(n)||!n)return false;if(n>0){if(player.coins<n||c.bought+n>300){toast('Saldo insuficiente o lÃ­mite diario de 300 fichas');return false;}player.coins-=n;c.chips+=n;c.bought+=n;}else{if(c.chips<-n)return false;c.chips+=n;player.coins-=n;}persistGame();return true;}
function cashier17(){const c=dayCasino17();showDialog('VERA Â· CAJA DEL CASINO','Monedas por fichas','<p>Â«Una moneda, una ficha. Puedes canjear tus fichas de vuelta cuando quieras.Â»</p><div class="bank17"><b>'+player.coins+' monedas</b><b>'+c.chips+' fichas</b></div><p>Compra diaria: '+c.bought+'/300. Apuestas diarias: '+c.staked+'/500. MÃ¡ximo 50 fichas por ronda. Sin compras con dinero real.</p><p>El azar tambiÃ©n produce pÃ©rdidas. NingÃºn NPC ni dificultad cambia las probabilidades anunciadas.</p>',[['COMPRAR 10',()=>{cashChange17(10);cashier17();}],['COMPRAR 50',()=>{cashChange17(50);cashier17();}],['CANJEAR 10',()=>{cashChange17(-10);cashier17();}],['CANJEAR TODO',()=>{cashChange17(-c.chips);cashier17();}],['MESAS',casinoLobby17],['CERRAR',closeDialog]]);}
const casinoModes17=[{name:'PrÃ¡ctica Â· sin fichas',bet:0,npc:'Nico'},{name:'Tranquilo Â· 10 fichas',bet:10,npc:'LÃ­a'},{name:'Normal Â· 20 fichas',bet:20,npc:'Bruno'},{name:'Alto Â· 50 fichas',bet:50,npc:'Vega'}];
let casinoMode17=1,casinoBusy17=false,casinoTimer17=null;
function random17(){if(window.crypto?.getRandomValues){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]/4294967296;}return Math.random();}
function casinoOutcome17(game,choice,rng=random17){if(game==='slots'){const r=rng();const mult=r<.45?0:r<.75?1:r<.93?2:r<.99?3:8;return {mult,text:mult===8?'777 Â· JACKPOT':mult===3?'â˜… â˜… â˜…':mult===2?'â—† â—† â—†':mult===1?'â— â— â€”':'â— â—† â˜…'};}if(game==='roulette'){const n=Math.floor(rng()*37),red=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n);return {mult:choice==='7'?(n===7?36:0):(n!==0&&(choice==='red'?red:!red)?2:0),text:n+' Â· '+(n===0?'VERDE':red?'ROJO':'NEGRO')};}const a=1+Math.floor(rng()*6),b=1+Math.floor(rng()*6),c=1+Math.floor(rng()*6),d=1+Math.floor(rng()*6);return {mult:a+b===c+d?1:a+b>c+d?1.9:0,text:'TÃº: '+a+' + '+b+' Â· NPC: '+c+' + '+d};}
function casinoSettle17(game,choice,bet,rng=random17){const c=dayCasino17();if(!['slots','roulette','dice'].includes(game)||![0,10,20,50].includes(bet)||game==='roulette'&&!['red','black','7'].includes(choice))return null;if(c.chips<bet||c.staked+bet>500)return null;const out=casinoOutcome17(game,choice,rng),paid=Math.floor(bet*out.mult);c.chips+=paid-bet;c.staked+=bet;c.rounds++;c.net+=paid-bet;c.last={game,text:out.text,bet,paid,practice:bet===0};persistGame();return c.last;}
function casinoLobby17(){showDialog('BAHÃA Â· CLUB DE LA SUERTE','Elige tu mesa','<p>Prueba sin fichas o elige apuestas de 10, 20 o 50. Las dificultades cambian la apuesta y el rival, no tu suerte.</p>',[['TRAGAPERRAS',()=>casinoTable17('slots')],['RULETA CON LÃA',()=>casinoTable17('roulette')],['DADOS CONTRA NPC',()=>casinoTable17('dice')],['CAJA Â· VERA',cashier17],['CERRAR',closeDialog]]);}
function casinoTable17(game){if(casinoBusy17)return;const c=dayCasino17(),rules=game==='slots'?'<b>Pagos totales:</b> 0Ã— (45 %), 1Ã— (30 %), 2Ã— (18 %), 3Ã— (6 %), 8Ã— (1 %). Retorno medio: 92 %.':game==='roulette'?'<b>37 casillas equiprobables.</b> Rojo/negro: 18/37, pago total 2Ã—. NÃºmero 7: 1/37, pago total 36Ã—. El cero pierde las apuestas de color. Retorno: 97,30 %.':'<b>Dos dados justos por persona.</b> Mayor suma gana: 44,37 %, pago 1,9Ã—. Empate: 11,27 %, devoluciÃ³n. Derrota: 44,37 %. Retorno: 95,56 %.';const last=c.last;showDialog('CASINO Â· '+c.chips+' FICHAS',game==='slots'?'Tragaperras Â· NeÃ³n':game==='roulette'?'Ruleta Â· LÃ­a':'Dados Â· '+casinoModes17[casinoMode17].npc,'<div class="casino-screen17" id="casinoscreen17">'+(last?.game===game?last.text:'â—†  â˜…  7')+'</div><p id="casinoresult17">'+(last?.game===game?(last.practice?'PrÃ¡ctica':last.paid+' fichas devueltas Â· resultado neto '+(last.paid-last.bet)):'Todos los resultados dependen del azar.')+'</p><div class="casino-modes17">'+casinoModes17.map((m,i)=>'<button data-mode17="'+i+'" class="'+(i===casinoMode17?'active':'')+'">'+m.name+'</button>').join('')+'</div><p>'+rules+'</p><p>Los pagos incluyen la apuesta. Quedan '+(500-c.staked)+' fichas de apuestas hoy.</p>',[...(game==='roulette'?[['ROJO',()=>casinoPlay17(game,'red')],['NEGRO',()=>casinoPlay17(game,'black')],['NÃšMERO 7',()=>casinoPlay17(game,'7')]]:[['JUGAR Â· '+casinoModes17[casinoMode17].bet+' FICHAS',()=>casinoPlay17(game,'')]]),['OTRA MESA',casinoLobby17],['CAJA',cashier17],['SALIR',closeDialog]]);document.querySelectorAll('[data-mode17]').forEach(b=>b.onclick=()=>{casinoMode17=Number(b.dataset.mode17);casinoTable17(game);});}
function casinoPlay17(game,choice){if(casinoBusy17||zone!==V17.casino||net.role)return;const result=casinoSettle17(game,choice,casinoModes17[casinoMode17].bet);if(!result){toast('Fichas insuficientes o lÃ­mite diario alcanzado');return;}casinoBusy17=true;const screen=$('#casinoscreen17');screen?.classList.add('spinning17');if(screen)screen.textContent='7 â—† â˜…';document.querySelectorAll('#dialogbuttons button,[data-mode17]').forEach(b=>b.disabled=true);casinoTimer17=setTimeout(()=>{casinoBusy17=false;casinoTimer17=null;if(dialogOpen&&zone===V17.casino)casinoTable17(game);},850);}
function nuclearBrief17(){showDialog('PERIFERIA Â· OSMOSIANO Â· NIVEL 10','El componente energÃ©tico','<p>Un componente de la central podrÃ­a estabilizar tus absorciones. Entra por AdmisiÃ³n, recÃ³gelo y busca una salida.</p><p>Estado: '+(player.nuclear.complete?'Central estabilizada. AbsorciÃ³n Ã¡cida permanente.':player.nuclear.stage?'MisiÃ³n en curso; puedes retomar tu avance.':'Pendiente')+'</p><p>Recompensa: forma Ã¡cida, 350 de vida base, seis tÃ©cnicas entre maestrÃ­a y Ã¡rbol; las mejoras de vitalidad de Ten tambiÃ©n se aplican.</p>',[...(race==='osmo'&&player.level>=10?[['ENTRAR',()=>{player.nuclear.stage=Math.max(1,player.nuclear.stage);persistGame();closeDialog();enterZone(V17.intake,'center');}]]:[]),['CERRAR',closeDialog]]);}
function triggerSpill17(){if(race!=='osmo'||player.level<10||player.nuclear.stage<1)return;if(player.nuclear.stage>=2){toast('El retorno estÃ¡ bloqueado. Avanza por la derecha.');return;}player.nuclear.stage=2;shake=.6;burst(1000,500,50,'#b8ff43');persistGame();showDialog('ALARMA Â· FALLO DE CONTENCIÃ“N','La tuberÃ­a estalla','<p>Consigues el componente, pero una tuberÃ­a revienta. La compuerta de regreso se cierra y el Ã¡cido inunda ContenciÃ³n.</p><p>Al este hay una plataforma segura y un robot de mantenimiento corroÃ­do. TendrÃ¡s que aprender a resistir el lÃ­quido.</p>',[['BUSCAR SALIDA',()=>{closeDialog();enterZone(V17.spill,'left');}]]);}
function unlockAcid17(){if(race!=='osmo'||player.level<10||zone!==V17.spill||player.nuclear.stage<2)return false;player.nuclear.acid=true;player.nuclear.stage=Math.max(3,player.nuclear.stage);player.absorbUnlocks.acid=true;absorbHold17=0;holdingAcid17=false;player.battery=Math.max(35,player.battery);absorbAcid17();visual17={kind:'acid',t:0,max:2.4};save();toast('Â¡ÃCIDO ASIMILADO! Ya puedes cruzar el lÃ­quido verde');return true;}
function absorbAcid17(){if(race!=='osmo'||!player.nuclear.acid||player.level<10){toast('Completa la absorciÃ³n en la central Â· nivel 10');return false;}if(interference()||player.battery<=0){toast('Necesitas energÃ­a y una zona sin interferencia');return false;}const ratio=player.hp/maxHP();endGhost();player.form='acid';player.fireCharge=0;player.alien=false;player.activeAlien=player.selected='osmo';refreshOsmo();player.cool=player.cooldowns.acid;player.hp=clamp(ratio*maxHP(),1,maxHP());closeDialog();burst(player.x,player.y-60,24,'#b2ff43');save();return true;}
const absorbBase17=absorb;
absorb=function(form){if(form==='acid')return absorbAcid17();const changed=player.form!==form,ok=absorbBase17(form);if(ok&&form==='fire'&&changed&&cinemaEnabled){cinematic={mode:'movie',id:'osmofire17',time:0,hold:false,osmo:true};paused=true;document.body.classList.add('cinema');window.OmniSound?.sample('heatblast');window.OmniMusic?.pauseForEvent();resetInput();}return ok;};
const absorptionBase17=absorptionMenu;
absorptionMenu=function(){absorptionBase17();const b=document.createElement('button');b.textContent=player.nuclear.acid?'FORMA ÃCIDA Â· 350 VIDA':'ÃCIDO Â· MISIÃ“N CENTRAL NV.10';b.onclick=()=>absorb('acid');$('#dialogbuttons').prepend(b);};
function completeNuclear17(){const q=player.nuclear;if(race!=='osmo'||player.level<10||!q.acid||!q.gate||q.complete)return;if(player.form!=='acid'){toast('Usa tu cuerpo Ã¡cido para sabotear los circuitos');return;}q.complete=true;q.stage=5;player.coins+=25;xp(300);save();showDialog('MISIÃ“N COMPLETADA','ContenciÃ³n restablecida','<p>Disuelves los circuitos de emergencia, detienes la fuga y abres la salida. Conservas permanentemente la absorciÃ³n de Ã¡cido.</p><p>+300 EXP Â· +25 monedas. Visita a Ten para mejorar tu vitalidad; entrena esta forma para abrir sus cuatro tÃ©cnicas y compra dos adicionales en el Ã¡rbol.</p>',[['SALIR A LA PERIFERIA',()=>{closeDialog();enterZone(V17.plant,'center');}],['EXPLORAR',closeDialog]]);}
const solidBase17=isSolid;
isSolid=function(x,y,...args){if(zone===V17.core&&!player.nuclear?.gate&&x>690&&x<790)return true;return solidBase17(x,y,...args);};
const osmoAttackBase17=osmoAttack;
osmoAttack=function(i){if(player.form!=='acid')return osmoAttackBase17(i);if(!unlockedSkill('acid',i)){toast(i<4?'Requiere maestrÃ­a Ã¡cida '+OSMO_SKILLS.acid[i].unlock:'Aprende esta tÃ©cnica en el Ã¡rbol');return;}const s=OSMO_SKILLS.acid[i],t=nearest(450),a=t?Math.atan2(t.y-player.y,t.x-player.x):Math.atan2(player.dy,player.dx),d=s.damage*multiplier();player.cool[i]=s.cd;player.attack=[.55,.7,.8,1.1,.85,.9][i];player.acidCast17={i,t:player.attack,max:player.attack};player.acidPose=i;player.face=Math.cos(a)>=0?1:-1;const x=t?.x??player.x+player.face*140,y=t?.y??player.y;
 if(i===0){effects.push({type:'acidSlash17',x:player.x+player.face*45,y:player.y-40,r:95,t:.5,max:.5});areaHit(player.x+player.face*50,player.y,100,d,.2);}
 if(i===1){shoot('goo',a,d,440);effects.push({type:'acidLance17',x:player.x,y:player.y-60,a,r:150,t:.45,max:.45});}
 if(i===2)effects.push({type:'acidPool17',x,y,r:145,t:4,max:4,tick:0,damage:d});
 if(i===3){effects.push({type:'acidBurst17',x:player.x,y:player.y,r:210,t:1,max:1});areaHit(player.x,player.y,210,d,.5);shake=.25;}
 if(i===4){effects.push({type:'acidGeyser17',x,y,r:120,t:.9,max:.9});areaHit(x,y,125,d,.5);}
 if(i===5){player.shield=110*healthFactor();player.shieldTime=7;effects.push({type:'acidArmor17',x:player.x,y:player.y,r:100,t:1,max:1});areaHit(player.x,player.y,110,d,.3);}tone(220+i*55,.13,'triangle');};
// Scanning is a separate, single attempt after victory; no rerolls on reload.
const wolfRewardBase17=wolfReward,ghostVictoryBase17=ghostVictory;
wolfReward=function(b,roll){if(net.role)return wolfRewardBase17(b,roll);if(!b.alive)return;b.alive=false;b.hp=0;player.wolfTimer=60;if(player.level>=30)xp(900);else toast('Blitztwolfer Â· recompensas desde nivel 30');if(race==='omni'&&player.level>=30)addScan17('wolf',b);burst(b.x,b.y-55,25,'#d5e9ff');save();};
ghostVictory=function(){if(net.role||race==='osmo')return ghostVictoryBase17();if(player.level<20||player.haunt.phase<3)return;if(!player.haunt.complete){player.haunt.complete=true;xp(650);player.coins+=10;}const b=enemies.find(e=>e.ghostBoss);if(b)addScan17('ghost',b);save();};
function addScan17(id,b){const existing=scanCorpses17.find(s=>s.id===id&&s.zone===zone);if(existing)scanCorpses17.splice(scanCorpses17.indexOf(existing),1);scanCorpses17.push({id,x:b.x,y:b.y,face:b.face,zone,ttl:12,used:false});toast(ALIENS[id].name+' debilitado Â· acÃ©rcate y ESCANEA en 12 s Â· ADN 20 %');}
function nearestScan17(){return race==='omni'&&!net.role?scanCorpses17.find(s=>!s.used&&s.zone===zone&&s.ttl>0&&dist(player,s)<260&&lineClear(player.x,player.y,s.x,s.y)):null;}
function startScan17(){if(!started||paused||scan17||cinematic)return false;const s=nearestScan17();if(!s||player.level<(s.id==='wolf'?30:20))return false;if(player.alien)revert(false);s.used=true;const success=(s.id==='ghost'&&(player.scans.ghost?.attempts||0)>=14)||random17()<.2;player.scans[s.id]={attempts:(player.scans[s.id]?.attempts||0)+1,lastSuccess:success};if(success){if(s.id==='wolf')player.wolfDNA=true;else player.ghostDNA=true;}scan17={...s,t:0,max:2.1,success};player.face=s.x>=player.x?1:-1;player.watchOpen=false;resetInput();cam.x=clamp((player.x+s.x)/2-W*.5/sceneZoom(),0,cameraMaxX());cam.y=clamp(player.y-H*.64/sceneZoom(),0,cameraMaxY());hud();persistGame();return true;}
function scanUpdate17(dt){for(let i=scanCorpses17.length-1;i>=0;i--){const c=scanCorpses17[i];c.ttl-=dt;if(c.ttl<=0)scanCorpses17.splice(i,1);}if(scan17){scan17.t+=dt;player.moving=false;player.inv=Math.max(.2,player.inv);if(scan17.t>=scan17.max){toast(scan17.success?'Â¡ADN DE '+ALIENS[scan17.id].name.toUpperCase()+' OBTENIDO!':'Escaneo completado Â· ADN incompatible esta vez (20 %) Â· vuelve a derrotar al jefe');scan17=null;save();}}}
function omnipedia17(){const book=race==='omni'?player:profiles.omni?.player||playerTemplate,ids=CORE_ALIENS.filter(id=>id!=='osmo'&&id!=='acid'),owned=id=>id==='wolf'?!!book.wolfDNA:id==='ghost'?!!book.ghostDNA:true;showDialog('OMNIPEDIA Â· ARCHIVO DE ADN','Tu colecciÃ³n de aliens','<p>'+ids.filter(owned).length+' / '+ids.length+' recolectados por el portador. Los registros de escaneo se conservan aunque falle la extracciÃ³n.</p><div class="pedia17">'+ids.map(id=>'<button data-pedia17="'+id+'" class="'+(owned(id)?'owned17':'missing17')+'"><canvas width="60" height="74"></canvas><b>'+ALIENS[id].name+'</b><small>'+(owned(id)?'RECOLECTADO':book.scans?.[id]?'ESCANEADO Â· ADN PENDIENTE':'POR DESCUBRIR')+'</small></button>').join('')+'</div>'+(race==='osmo'?'<p>Tu raza usa absorciones. El archivo del Omnitrix conserva su propia colecciÃ³n al cambiar de raza.</p>':''),[['CERRAR',closeDialog]]);for(const b of document.querySelectorAll('[data-pedia17]')){const id=b.dataset.pedia17,{sheet,table}=spriteInfo(ALIENS[id].row),f=table[0],c=b.querySelector('canvas').getContext('2d');c.imageSmoothingEnabled=false;const h=68,w=h*f[2]/f[3];c.drawImage(sheet,...f,(60-w)/2,3,w,h);if(!owned(id)){c.globalCompositeOperation='source-atop';c.fillStyle='#152433';c.fillRect(0,0,60,74);c.globalCompositeOperation='source-over';}b.onclick=()=>showDialog('OMNIPEDIA Â· '+(owned(id)?'RECOLECTADO':'PENDIENTE'),ALIENS[id].name,'<p>Vida base: '+ALIENS[id].hp+'. MaestrÃ­a: '+Math.floor(book.masteries[id]||0)+' %.</p><p>'+(id==='wolf'?'Derrota a Blitztwolfer (nivel 30), acÃ©rcate y escanÃ©alo antes de 12 s. ADN: 20 %.':id==='ghost'?'Completa el hospital (nivel 20), derrota a FantasmÃ¡tico y escanÃ©alo. ADN: 20 %. Reaparece tras 60 s.':'ADN disponible en el Omnitrix.')+'</p><p>Escaneos: '+(book.scans?.[id]?.attempts||0)+'</p><p>'+ALIENS[id].skills.filter(s=>s.unlock<=100).map(s=>s.name).join(' Â· ')+'</p>',[['VOLVER AL LIBRO',omnipedia17]]);}}
const settingsBase17=settings15;
settings15=function(){settingsBase17();const b=document.createElement('button');b.textContent='GRÃFICOS Â· '+(quality17==='low'?'LIGEROS Â· 30 FPS':'NORMALES Â· 60 FPS');b.onclick=()=>{quality17=quality17==='low'?'normal':'low';try{localStorage.setItem('omni-quality17',quality17);}catch(e){}applyTheme17();settings15();};$('#dialogbuttons').prepend(b);};
const pauseBase17=pauseMenu;
pauseMenu=function(){pauseBase17();$('#dialogeyebrow').textContent='PARTIDA GUARDADA Â· VERSIÃ“N 0.17';const b=document.createElement('button');b.textContent='OMNIPEDIA';b.onclick=omnipedia17;$('#dialogbuttons').prepend(b);};
const burstBase17=burst;
burst=function(x,y,n,color){burstBase17(x,y,quality17==='low'?Math.min(6,Math.ceil(n*.25)):n,color);};
const updateBase17=update;
update=function(dt){if(scan17){clock+=dt;scanUpdate17(dt);hud17();return;}updateBase17(dt);if(!started||paused||cinematic)return;scanUpdate17(dt);if(visual17){visual17.t+=dt;if(visual17.t>visual17.max)visual17=null;}
 if(player.acidCast17){player.acidCast17.t=Math.max(0,player.acidCast17.t-dt);if(!player.acidCast17.t||player.form!=='acid')player.acidCast17=null;}player.acidHurt17=Math.max(0,(player.acidHurt17||0)-dt);
 if(zone===V17.spill&&race==='osmo'&&player.nuclear.stage>=2){if(!player.nuclear.acid&&dist(player,points17.acid)<120&&(holdingAcid17||keys.e||keys.E)){absorbHold17+=dt;player.moving=false;if(absorbHold17>=2.2)unlockAcid17();}else absorbHold17=0;}
 if(zone===V17.core&&!player.nuclear.gate&&player.x>690)player.x=675;
 if((zone===V17.spill&&player.x>710||zone===V17.intake&&player.nuclear.stage>=2&&player.x<280)&&!player.nuclear.complete){if(race==='osmo'&&player.form==='acid'){if(player.battery<10)player.battery=10;}else {hazard17-=dt;if(hazard17<=0){hazard17=.4;hitPlayer(16);}}}
 for(const f of effects)if(f.type==='acidPool17'){f.tick-=dt;if(f.tick<=0){f.tick+=.8;areaHit(f.x,f.y,f.r,f.damage,.1);}}
 if(quality17==='low'){if(particles.length>60)particles.splice(0,particles.length-60);shake=0;}
};
// Native pixel art: cached environments and an animated, independently drawn mutant.
const sceneCache17=new Map();
function scene17(z){if(sceneCache17.has(z))return sceneCache17.get(z);const c=document.createElement('canvas');c.width=400;c.height=260;const g=c.getContext('2d');const rect=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x,y,w,h);};const text=(s,x,y,size,color)=>{g.fillStyle=color;g.font='bold '+size+'px monospace';g.textAlign='center';g.fillText(s,x,y);};rect(0,0,400,260,'#0c1823');
 if(z===V17.casino){rect(0,0,400,131,'#1d1430');for(let x=8;x<400;x+=22){rect(x,20,12,90,'#37253b');rect(x,20,2,90,'#876250');}rect(0,101,400,25,'#171225');rect(0,124,400,8,'#ad7941');for(let y=132;y<260;y+=10)for(let x=0;x<400;x+=10)rect(x,y,10,10,(Math.floor(x/10)+Math.floor(y/10))%2?'#261c34':'#30233c');rect(145,15,112,36,'#080f23');rect(148,18,106,30,'#302442');text('BAHÃA',200,33,13,'#ffe59c');text('C A S I N O',200,44,7,'#e7a7f9');for(const x of [35,100,298,365]){rect(x,0,3,39,'#c4a569');rect(x-9,36,21,5,'#ffdf89');rect(x-5,41,13,7,'#ffeab4');}rect(35,123,65,22,'#75503a');rect(35,123,65,4,'#eac581');text('CAJA',68,119,7,'#ffe3a0');for(const x of [128,157,186]){rect(x,90,24,52,'#141729');rect(x+2,92,20,4,'#df82ca');rect(x+3,100,18,18,'#647fac');rect(x+4,105,5,9,'#ffc362');rect(x+10,105,5,9,'#faf5c3');rect(x+16,105,4,9,'#adfbb0');rect(x+4,123,16,10,'#492941');rect(x+20,126,3,4,'#f9de82');}rect(235,125,50,23,'#997443');rect(238,127,44,19,'#245e52');g.strokeStyle='#d7b572';g.strokeRect(242,130,19,13);rect(265,131,10,10,'#a66048');rect(295,171,59,26,'#997443');rect(298,173,53,21,'#245e52');text('DADOS',325,186,7,'#eddfa8');rect(182,214,38,46,'#875b50');for(let y=217;y<260;y+=10)rect(184,y,34,2,'#c3956a');}
 else if(z===V17.plant){rect(0,0,400,155,'#192a35');for(let x=0;x<400;x+=24)rect(x,85-(x%3)*9,20,65,'#243d3d');for(const x of [40,292]){g.fillStyle='#65767b';g.beginPath();g.moveTo(x,133);g.lineTo(x+15,47);g.lineTo(x+8,26);g.lineTo(x+60,26);g.lineTo(x+53,47);g.lineTo(x+70,133);g.fill();rect(x+8,25,52,5,'#9eaa99');for(let y=42;y<125;y+=9)rect(x+20-(y/20|0),y,34+(y/12|0),2,'#465c62');}rect(122,92,151,48,'#697878');rect(127,97,141,14,'#344952');rect(181,115,36,25,'#162934');text('CENTRAL NUCLEAR',200,106,8,'#bde79e');for(let y=140;y<260;y+=12)for(let x=0;x<400;x+=16)rect(x,y,16,12,(Math.floor(x/16)+Math.floor(y/12))%2?'#3b514a':'#40584f');rect(181,142,36,118,'#69716b');for(let y=150;y<260;y+=20)rect(197,y,4,10,'#d0cda1');for(let x=0;x<400;x+=18){rect(x,127,2,27,'#879588');rect(x,133,18,2,'#879588');}rect(180,125,39,32,'#69716b');text('ZONA RESTRINGIDA',78,166,6,'#e8d295');}
 else {rect(0,0,400,136,'#273b42');for(let x=0;x<400;x+=40){rect(x,0,3,136,'#47595c');rect(x+4,48,34,3,'#40535a');}for(let y=136;y<260;y+=12)for(let x=0;x<400;x+=16){rect(x,y,16,12,(Math.floor(x/16)+Math.floor(y/12))%2?'#435555':'#4b5e5c');rect(x,y,16,1,'#2c3d42');}rect(0,135,400,4,'#a7a45b');for(let x=0;x<400;x+=14)rect(x,135,6,4,'#202d35');rect(20,52,356,9,'#748185');rect(20,55,356,2,'#bac4b1');for(let x=40;x<380;x+=65)rect(x,49,6,15,'#3b4d57');for(let x=45;x<360;x+=100){rect(x,23,47,5,'#bfe6b4');rect(x-3,28,53,2,'#73998a');}if(z===V17.intake){for(let x=25;x<340;x+=76){rect(x,82,40,48,'#3b555c');rect(x+4,86,32,17,'#8cc185');rect(x+8,109,7,4,'#e9d065');rect(x+22,109,7,4,'#c38871');}rect(277,137,27,16,'#977e4b');rect(284,132,14,8,'#caff77');text('ADMISIÃ“N / ENERGÃA',200,78,8,'#d4efb7');}if(z===V17.spill){rect(0,139,400,14,'#13252d');rect(0,198,400,62,'#13252d');rect(132,153,225,45,'#386923');for(let y=153;y<198;y+=7)for(let x=132;x<357;x+=11)rect(x,y,7,2,'#70bf39');rect(23,173,15,5,'#9cafac');rect(40,171,8,10,'#6b8589');rect(24,169,6,5,'#c2cfd0');text('CONTENCIÃ“N / FUGA',200,84,8,'#cdcc8d');text('ROBOT CORROÃDO',66,161,5,'#d6e5bd');}if(z===V17.core){rect(247,46,79,85,'#405d63');rect(253,51,67,71,'#1a302d');rect(263,55,47,66,'#668c40');rect(280,56,13,62,'#b2df62');rect(254,120,65,10,'#7c9768');rect(295,140,29,17,'#668584');rect(299,142,21,8,'#b9d77f');for(let y=145;y<230;y+=18)rect(180,y,14,4,'#192e34');text('REACTOR 04',285,41,9,'#e5e0ab');}}
 sceneCache17.set(z,c);return c;}
const drawSceneBase17=drawScene;
drawScene=function(c,z,day){if(z>=V17.casino){c.imageSmoothingEnabled=false;const im=z===V17.casino?art.casino17:art.nuclear17;if(im){const n=z-V17.plant,sx=z===V17.casino?0:n%2*im.width/2,sy=z===V17.casino?0:Math.floor(n/2)*im.height/2,sw=z===V17.casino?im.width:im.width/2,sh=z===V17.casino?im.height:im.height/2;c.drawImage(im,sx,sy,sw,sh,0,0,1600,900);c.drawImage(im,sx,sy+sh*.9,sw,sh*.1,0,900,1600,140);}else c.drawImage(scene17(z),0,0,400,260,0,0,1600,1040);return;}drawSceneBase17(c,z,day);};
const acidSequences17=[[5,6,7],[8,9,10],[11,12,0],[13,14,0],[15,16,0],[17,18,18]];
function acidFrame17(avatar){if(avatar.acidHurt17>0)return 20;if(avatar.jump>0)return avatar.jump>.25?22:23;if(visual17?.kind==='acid'&&avatar===player&&visual17.t<1.3)return 19;if(avatar.acidCast17?.t>0){const cast=avatar.acidCast17,sequence=acidSequences17[cast.i];return sequence[Math.min(2,Math.floor((1-cast.t/cast.max)*3))];}return avatar.moving?[1,2,3,4][Math.floor(avatar.anim)%4]:0;}
function drawAcid17(c,x,y,face,avatar,scale=1){const im=art.acid17;if(!im)return;const frame=acidFrame17(avatar),cell=im.width/4,pixelScale=176/254*scale,h=cell*pixelScale,w=cell*pixelScale;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(x),Math.round(y));c.scale(face,1);c.globalAlpha=avatar.inv>0&&Math.floor(clock*12)%2===0?.65:1;c.drawImage(im,(frame%4)*cell,Math.floor(frame/4)*cell,cell,cell,-192*pixelScale,-360*pixelScale,w,h);if(avatar.shield>0){c.strokeStyle='#c5ff7399';c.lineWidth=2;c.beginPath();c.ellipse(0,-h*.46,w*.49,h*.51,0,0,Math.PI*2);c.stroke();}c.restore();}
const materialsBase17=materials;materials=function(){return zone>=V17.casino&&zone<=V17.core?[]:materialsBase17();};
const hurtBase17=hitPlayer;
hitPlayer=function(damage){const hp=player.hp;hurtBase17(damage);if(player.form==='acid'&&player.hp<hp)player.acidHurt17=.3;};
const osmoDrawBase17=drawOsmo;
drawOsmo=function(frame,x,y,face,avatar=player){if(avatar.form==='acid'){drawAcid17(ctx,x,y,face,avatar);return;}osmoDrawBase17(frame,x,y,face,avatar);};
const drawExpansionBase17=drawExpansion;
drawExpansion=function(){drawExpansionBase17();drawWorld17();};
function drawWorld17(){if(!started)return;
 if(false){ctx.fillStyle='#26172deb';ctx.fillRect(1015,542,100,46);ctx.strokeStyle='#e8c27d';ctx.strokeRect(1015,542,100,46);txt('CASINO',1065,563,13,'#ffdf93');txt('â—† ENTRAR',1065,580,9,'#edacf1');}
 if(zone===V17.casino)drawCasinoNPC18();
 if(zone===V17.spill){if(!player.nuclear.acid){txt('MANTÃ‰N E / ABSORBER',640,385,12,'#d7ff94');txt('Â«Si asimilo su estructura, resistirÃ© el Ã¡cidoâ€¦Â»',720,410,11,'#e0eccc');}if(absorbHold17){ctx.fillStyle='#b8ff60';ctx.fillRect(player.x-45,player.y-170,90*absorbHold17/2.2,6);}if(!player.nuclear.complete&&quality17!=='low')for(let i=0;i<14;i++){ctx.fillStyle='#abef5588';ctx.fillRect(735+(i*67)%810,530+(i*17)%25-Math.sin(clock*2+i)*6,6,4);}}
 if(zone===V17.core&&!player.nuclear.gate){ctx.fillStyle='#172b32';ctx.fillRect(708,520,64,270);for(let y=526;y<790;y+=15){ctx.fillStyle='#72898a';ctx.fillRect(712,y,56,11);}ctx.fillStyle='#d9b762';ctx.fillRect(719,684,15,24);txt('CERROJO Â· ÃCIDO',740,500,11,'#cced9d');}
 for(const c of scanCorpses17)if(c.zone===zone){ctx.save();ctx.globalAlpha=.65;sprite(c.id==='wolf'?40:72,0,c.x,c.y,c.id==='wolf'?135:142,c.face);ctx.restore();txt(c.used?'ADN ANALIZADO':'ESCANEAR Â· '+Math.ceil(c.ttl)+' s',c.x,c.y-158,12,'#ffe885');}
 drawScanner18();
 for(const f of effects)if(f.type.startsWith('acid')){const p=1-f.t/f.max;ctx.save();ctx.strokeStyle='#b9ff64';ctx.fillStyle='#73c82966';ctx.lineWidth=5;if(f.type==='acidPool17'){ctx.beginPath();ctx.ellipse(f.x,f.y,f.r,f.r*.3,0,0,Math.PI*2);ctx.fill();ctx.stroke();}else if(f.type==='acidGeyser17'){for(let i=0;i<7;i++){ctx.fillStyle=i%2?'#caff79':'#7dce35';ctx.fillRect(f.x-70+i*20,f.y-150*Math.sin(p*Math.PI),12,150*Math.sin(p*Math.PI));}}else if(f.type==='acidLance17'){ctx.translate(f.x,f.y);ctx.rotate(f.a);ctx.fillRect(0,-7,f.r*p,14);}else if(f.type==='acidSlash17'){ctx.beginPath();ctx.arc(f.x,f.y,f.r*p,-1.2,1.2);ctx.stroke();}else{ctx.beginPath();ctx.ellipse(f.x,f.y-20,Math.max(2,f.r*p),Math.max(2,f.r*p*.5),0,0,Math.PI*2);ctx.stroke();}ctx.restore();}
 if(visual17){ctx.fillStyle='#aaff6644';ctx.fillRect(player.x-60,player.y-175,120,175);if(quality17!=='low')shake=.12;}
}
const cinemaDrawBase17=drawCinema;
drawCinema=function(){if(cinematic?.id!=='osmofire17')return cinemaDrawBase17();const screen=$('#cinemaworld'),w=innerWidth,h=innerHeight,dpr=quality17==='low'?1:Math.min(2,devicePixelRatio||1);if(screen.width!==Math.round(w*dpr)||screen.height!==Math.round(h*dpr)){screen.width=Math.round(w*dpr);screen.height=Math.round(h*dpr);}const c=screen.getContext('2d'),t=cinematic.time,progress=clamp(t/6,0,1);c.setTransform(dpr,0,0,dpr,0,0);c.imageSmoothingEnabled=false;c.fillStyle='#160e18';c.fillRect(0,0,w,h);const movie=art.osmoFireCinema17;if(movie){const ix=Math.min(5,Math.floor(t)),fw=movie.width/3,fh=movie.height/2,local=t%1,factor=Math.min(w/fw,h/fh)*(1+.015*Math.sin(local*Math.PI)),dw=fw*factor,dh=fh*factor;c.drawImage(movie,(ix%3)*fw,Math.floor(ix/3)*fh,fw,fh,(w-dw)/2,(h-dh)/2,dw,dh);c.textAlign='center';c.font='bold 12px monospace';c.fillStyle='#ffe3a7';c.fillText('DOBLE TOQUE PARA SALTAR',w/2,h-18);c.fillStyle='#ffb25d';c.fillRect(0,h-4,w*progress,4);return;}for(let i=0;i<24;i++){const x=(i*97+t*14)%w,y=h-(i*43+t*140)%(h+150);c.fillStyle=i%2?'#ff963f':'#ffdb80';c.fillRect(x,y,6+i%4*4,12+i%3*8);}const row=t<1.4?14:t<3.5?15:19,{sheet,table}=spriteInfo(row),f=table[t<1.4?0:t<3.5?3:0],height=h*(t<1.4?.6:.77),width=height*f[2]/f[3];c.drawImage(sheet,...f,w/2-width/2,h*.91-height,width,height);c.fillStyle='#ffab3922';if(t>1&&t<4)c.fillRect(w*.26,h*.1,w*.48,h*.82);c.textAlign='center';c.font='bold '+Math.max(14,h*.044)+'px monospace';c.fillStyle='#ffe3a7';c.fillText(t<1.4?'ADN ÃGNEO':t<3.5?'ASIMILACIÃ“N MOLECULAR':'OSMOSIANO Â· FUEGO',w/2,h*.12);c.font='12px monospace';c.fillText('DOBLE TOQUE PARA SALTAR',w/2,h-18);c.fillStyle='#fba351';c.fillRect(0,h-4,w*progress,4);};
const cinemaUpdateBase17=updateCinema;
updateCinema=function(dt){if(cinematic?.id==='osmofire17'){if(!cinematic.hold&&!document.hidden){cinematic.time+=dt;if(cinematic.time>=6)finishCinema();}return;}cinemaUpdateBase17(dt);};
// Touch-first controls; all new actions also work with keyboard.
for(const [id,text,cls,fn] of [['scan17','ESCANEAR','scan-button17',startScan17],['acidhold17','MANTÃ‰N Â· ABSORBER','acid-button17',null]]){const b=document.createElement('button');b.id=id;b.textContent=text;b.className=cls+' hidden';$('#hud').append(b);if(fn)b.onclick=fn;}
const holdButton17=$('#acidhold17');holdButton17.addEventListener('pointerdown',e=>{e.preventDefault();holdingAcid17=true;holdButton17.setPointerCapture?.(e.pointerId);});for(const ev of ['pointerup','pointercancel','lostpointercapture'])holdButton17.addEventListener(ev,()=>holdingAcid17=false);
document.addEventListener('keydown',e=>{if(e.code==='KeyC'&&!e.repeat)startScan17();});window.addEventListener('blur',()=>{holdingAcid17=false;absorbHold17=0;});
const pediaButton17=document.createElement('button');pediaButton17.id='omnipediabtn17';pediaButton17.textContent='OMNIPEDIA Â· LIBRO DE ADN';pediaButton17.onclick=()=>{if(ready)omnipedia17();};$('#jobsbtn').after(pediaButton17);
const drawBase17=draw;
draw=function(){drawBase17();};
const missionBase17=$('#mission').onclick;
$('#mission').onclick=()=>zone>=V17.plant&&zone<=V17.core?nuclearBrief17():zone===V17.casino?casinoLobby17():missionBase17();
if(window.__game)Object.assign(window.__game,{hitPlayer,materials,isSolid,initProgress,skillId,enterZone,update,draw,drawScene,hud,interact,absorb,wolfReward,ghostVictory,jobsMenu,pauseMenu,settings15,drawCinema,updateCinema,osmoAttack});
if(location.search.includes('qa=1'))window.__v17={V17,points17,casinoOutcome17,casinoSettle17,cashChange17,dayCasino17,travelCasino17,casinoTable17,cashier17,triggerSpill17,nuclearBrief17,unlockAcid17,absorbAcid17,completeNuclear17,startScan17,addScan17,scanUpdate17,omnipedia17,drawAcid17,acidFrame17,acidSequences17,scene17,get scans(){return scanCorpses17},get scan(){return scan17},get quality(){return quality17},setQuality:q=>quality17=q};

// 0.18: three collections, field scanner, dedicated sprites and responsive movies.
let fieldScan18=null;
const BESTIARY18={
 bandit:['Invasor encapuchado',2,'ENEMIGO','Un atacante que patrulla los caminos.','Se aproxima con su garrote. Observa la seÃ±al de ataque y retrocede antes del golpe.'],
 leader:['Cabecilla',2,'ENEMIGO','Dirige a los invasores del refugio.','Tiene mÃ¡s resistencia que un invasor comÃºn. Despeja primero el grupo para luchar con espacio.'],
 knight:['Caballero cuerpo a cuerpo',17,'ENEMIGO','Guerrero de la orden con armadura.','Su alcance corto exige acercarse; esquiva su preparaciÃ³n y ataca durante la recuperaciÃ³n.'],
 archer:['Caballero tirador',18,'ENEMIGO','Vigila la fortaleza a distancia.','Usa los obstÃ¡culos del escenario para cortar su lÃ­nea de tiro.'],
 fire:['Jefe Ã­gneo',13,'JEFE','Una criatura que domina el fuego.','Encuentro de nivel 10. Sus ataques anuncian la zona de peligro. El osmosiano puede conseguir su ADN de fuego segÃºn las reglas del jefe.'],
 robot:['Robot de devastaciÃ³n',28,'JEFE','Una mÃ¡quina de combate pesada.','MantÃ©n distancia durante sus ataques de Ã¡rea y aprovecha los periodos de recuperaciÃ³n.'],
 wolf:['Blitztwolfer',40,'JEFE','Un depredador lunar de poderoso aullido.','Nivel 30. Alterna garras, salto y ondas sÃ³nicas. Para intentar obtener su ADN, derrÃ³talo y usa ESCANEAR ADN antes de 12 segundos: probabilidad 20 %. El registro de esta ficha no concede ADN.'],
 ghost:['FantasmÃ¡tico',72,'JEFE','Un espectro capaz de volverse intangible.','Nivel 20. La luz y el fuego interrumpen su intangibilidad. Tras derrotarlo, el Omnitrix puede intentar extraer su ADN en 12 segundos: 20 %. Registrar la ficha no concede ADN.'],
 animo:['Dr. Ãnimo',50,'JEFE','Un cientÃ­fico que utiliza mutantes.','En su laboratorio lanza Ã¡cido y ataques en abanico. Evita sus proyectiles mientras controlas a sus criaturas.'],
 frog:['Rana mutante',51,'ENEMIGO','Un mutante de lengua larga y gran salto.','Observa la preparaciÃ³n de su salto y sal de la zona donde caerÃ¡.'],
 hog:['Bestia mutante',52,'ENEMIGO','Una bestia que puede aumentar su tamaÃ±o.','Su crecimiento aumenta su presencia en combate. Esquiva la carga y evita quedarte cerca de su mordida.'],
 hex:['Hex',76,'JEFE','Un hechicero protegido por magia.','En la Escuela Arcana combina runas y proyectiles. Espera a que desaparezca su escudo para daÃ±arlo.'],
 guard:['Guardia del hospital',73,'ENEMIGO','Vigila los pasillos de seguridad.','Evita su campo de visiÃ³n. Sus sistemas interfieren con algunos poderes espectrales.'],
 manta:['Manta abisal',37,'ENEMIGO','Una criatura que patrulla bajo el agua.','El combate submarino exige controlar el oxÃ­geno y alcanzar el nivel de los enemigos para recibir toda la experiencia.'],
 predator:['Depredador marino',38,'ENEMIGO','Un cazador de las profundidades.','MÃ¡s resistente que la manta. Utiliza movimientos acuÃ¡ticos para conservar distancia.'],
 void0:['Carcelero Ã­gneo',81,'ENEMIGO','Custodia el Null Void con fuego.','Nivel 40. Lanza proyectiles a distancia; interrumpe la lÃ­nea de tiro con obstÃ¡culos.'],
 void1:['VigÃ­a alado',82,'ENEMIGO','Un centinela volador del vacÃ­o.','Nivel 40. Se mueve y dispara con rapidez. No permanezcas quieto frente a Ã©l.'],
 void2:['Devorador',83,'ENEMIGO','Un cazador veloz del Null Void.','Nivel 40. Busca el combate cercano. Retrocede durante la preparaciÃ³n de su ataque.'],
 void3:['TitÃ¡n del vacÃ­o',84,'ENEMIGO','Una enorme criatura del Null Void.','Nivel 40. Su golpe de Ã¡rea es amplio y tarda en prepararse: abandona la zona marcada.']
};
function enemyKey18(e){return e.wolfBoss?'wolf':e.ghostBoss?'ghost':e.hexBoss?'hex':e.majorBoss?'fire':e.robotBoss?'robot':e.chapter2|| (e.voidEnemy?'void'+e.voidType:e.guard?'guard':e.sea?e.seaType:e.knight==='melee'?'knight':e.knight==='ranged'?'archer':e.boss?'leader':'bandit');}
const progressBase18=initProgress;
initProgress=function(){progressBase18();player.bestiary=player.bestiary||{};player.formRecords=Object.assign({human:true},player.formRecords||{});if(race==='osmo')player.formRecords[player.form]=true;fieldScan18=null;};
function knownEnemy18(id){return !!(player.bestiary?.[id]||Object.values(profiles).some(p=>p?.player?.bestiary?.[id]));}
function nearestEnemy18(){if(net.role)return null;return enemies.filter(e=>e.alive&&BESTIARY18[enemyKey18(e)]&&!knownEnemy18(enemyKey18(e))&&dist(player,e)<280&&lineClear(player.x,player.y,e.x,e.y)).sort((a,b)=>dist(player,a)-dist(player,b))[0]||null;}
function startEnemyScan18(){if(!started||paused||cinematic||scan17||fieldScan18)return false;const e=nearestEnemy18();if(!e)return false;if(race==='omni'&&player.alien)revert(false);transition=0;fieldScan18={id:enemyKey18(e),target:e,x:e.x,y:e.y,t:0,max:1.8,zone};player.face=e.x>=player.x?1:-1;player.watchOpen=false;resetInput();return true;}
function recordEnemy18(id,e){player.bestiary=player.bestiary||{};if(!BESTIARY18[id]||player.bestiary[id])return false;player.bestiary[id]={level:e?.level||(['knight','archer'].includes(id)?15:id==='fire'?10:['robot','ghost','animo','frog','hog','guard'].includes(id)?20:id==='wolf'||id==='hex'?30:id.startsWith('void')?40:1),hp:e?.max||100,zone};persistGame();return true;}
const startDnaBase18=startScan17;
startScan17=function(){if(fieldScan18)return false;const ok=startDnaBase18();if(ok){transition=0;recordEnemy18(scan17.id,{level:scan17.id==='wolf'?30:20,max:scan17.id==='wolf'?3600:2600});}return ok;};
$('#scan17').onclick=startScan17;
const hudBase18=hud17;
hud17=function(){hudBase18();const e=nearestEnemy18();$('#enemyscan18').classList.toggle('hidden',!!scan17||!!nearestScan17()||(!e&&!fieldScan18));$('#enemyscan18').textContent=fieldScan18?'REGISTRANDO '+Math.floor(fieldScan18.t/fieldScan18.max*100)+'%':e?'ESCANEAR '+BESTIARY18[enemyKey18(e)][2]:'ESCANEAR ENEMIGO';if(!scan17&&nearestScan17())$('#scan17').textContent='ESCANEAR ADN Â· '+Math.ceil(nearestScan17().ttl)+' s';};
const updateBase18=update;
update=function(dt){if(fieldScan18){if(paused||cinematic||!started||document.hidden)return;clock+=dt;scanUpdate17(dt);const s=fieldScan18;s.t+=dt;player.moving=false;if(s.zone!==zone||!s.target.alive){fieldScan18=null;return;}if(s.t>=s.max){recordEnemy18(s.id,s.target);fieldScan18=null;toast('OMNIPEDIA Â· '+BESTIARY18[s.id][0]+' registrado');save();}hud17();return;}updateBase18(dt);};
const enterBase18=enterZone;
enterZone=function(...args){const ok=enterBase18(...args);if(ok)fieldScan18=null;return ok;};
const absorbAcidBase18=absorbAcid17;
absorbAcid17=function(){const changed=player.form!=='acid',ok=absorbAcidBase18();if(ok){player.formRecords=player.formRecords||{};player.formRecords.acid=true;persistGame();if(changed&&cinemaEnabled){cinematic={mode:'movie',id:'osmoacid18',time:0,hold:false,osmo:true};paused=true;document.body.classList.add('cinema');resetInput();window.OmniMusic?.pauseForEvent();}}return ok;};
const absorbRecord18=absorb;
absorb=function(form){const ok=absorbRecord18(form);if(ok){player.formRecords=player.formRecords||{};player.formRecords[form]=true;persistGame();}return ok;};
const cinemaDraw18=drawCinema;
drawCinema=function(){if(cinematic?.id!=='osmoacid18'&&cinematic?.id!=='osmofire17')return cinemaDraw18();const acid=cinematic.id==='osmoacid18',screen=$('#cinemaworld'),w=innerWidth,h=innerHeight,dpr=quality17==='low'?1:Math.min(2,devicePixelRatio||1);if(screen.width!==Math.round(w*dpr)||screen.height!==Math.round(h*dpr)){screen.width=Math.round(w*dpr);screen.height=Math.round(h*dpr);}const c=screen.getContext('2d'),t=cinematic.time,im=acid?art.acidCinema18:art.osmoFireCinema17,ix=Math.min(5,Math.floor(t));c.setTransform(dpr,0,0,dpr,0,0);c.imageSmoothingEnabled=false;c.fillStyle=acid?'#173219':'#38170d';c.fillRect(0,0,w,h);if(im){const cols=acid?1:3,rows=acid?6:2,fw=im.width/cols,fh=im.height/rows,factor=Math.max(w/fw,h/fh)*(1+.025*Math.sin((t%1)*Math.PI));c.drawImage(im,(ix%cols)*fw,Math.floor(ix/cols)*fh,fw,fh,(w-fw*factor)/2,(h-fh*factor)/2,fw*factor,fh*factor);}if(t%1<.10&&ix>0){c.fillStyle=acid?'#caff8b33':'#ffdaa633';c.fillRect(0,0,w,h);}if(quality17!=='low')for(let i=0;i<16;i++){c.fillStyle=acid?'#b8ff7866':'#ffd27e66';c.fillRect((i*139+t*32)%w,(i*83-t*45+h*20)%h,4,4);}c.textAlign='center';c.font='bold '+Math.max(12,Math.min(20,h*.04))+'px monospace';c.lineWidth=4;c.strokeStyle='#05130d';c.fillStyle='#f4ffe6';const label=t<2?'ASIMILACIÃ“N MOLECULAR':t<4?'MUTACIÃ“N '+(acid?'CORROSIVA':'ÃGNEA'):'OSMOSIANO Â· '+(acid?'ÃCIDO':'FUEGO');c.strokeText(label,w/2,Math.max(25,h*.07));c.fillText(label,w/2,Math.max(25,h*.07));c.font='bold 12px monospace';c.strokeText('DOBLE TOQUE PARA SALTAR',w/2,h-20);c.fillText('DOBLE TOQUE PARA SALTAR',w/2,h-20);c.fillStyle=acid?'#adff62':'#ffb359';c.fillRect(0,h-4,w*clamp(t/6,0,1),4);};
const cinemaUpdate18=updateCinema;
updateCinema=function(dt){if(cinematic?.id==='osmoacid18'){if(!cinematic.hold&&!document.hidden){cinematic.time+=dt;if(cinematic.time>=6)finishCinema();}return;}cinemaUpdate18(dt);};
function atlasSprite18(c,im,index,cols,rows,x,y,height,face=1){if(!im)return;const fw=im.width/cols,fh=im.height/rows,scale=height/fh;c.save();c.translate(Math.round(x),Math.round(y));c.scale(face,1);c.imageSmoothingEnabled=false;c.drawImage(im,index%cols*fw,Math.floor(index/cols)*fh,fw,fh,-fw*scale/2,-height,fw*scale,height);c.restore();}
function drawScanPose18(x,y){if(suitOn28()){drawSuit28(player);return;}const s=scan17||fieldScan18;if(!s)return;const f=s.t<.3?0:1+Math.floor((s.t-.3)*8)%2;atlasSprite18(ctx,art.scanPoses18,player.skin*3+f,3,3,x,y,118,player.face);}
function drawScanner18(){const s=scan17||fieldScan18;if(!s)return;const sx=player.x+player.face*35,sy=player.y-65,height=s.id==='wolf'?160:s.id==='ghost'?145:130;ctx.fillStyle='#ffe65524';ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(s.x,s.y-height);ctx.lineTo(s.x,s.y);ctx.closePath();ctx.fill();ctx.strokeStyle='#ffe958';ctx.lineWidth=2;const sweep=s.y-height+((s.t*90)%height);ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(s.x,sweep);ctx.stroke();ctx.strokeRect(s.x-44,s.y-height,88,height);ctx.fillStyle='#fffdb0';ctx.fillRect(sx-4,sy-4,8,8);ctx.fillRect(s.x-42,sweep,84,2);txt((scan17?'ANALIZANDO ADN ':'REGISTRANDO FICHA ')+Math.floor(s.t/s.max*100)+'%',s.x,s.y-height-18,11,'#fff5ab');}
function drawCasinoNPC18(){const actors=[['cashier','VERA Â· CAJA',0],['roulette','LÃA Â· RULETA',1],['dice','BRUNO Â· DADOS',4],['vega','VEGA',2],['nico','NICO',3]];for(const [key,name,col] of actors){const p=points17[key]||{x:key==='vega'?1100:770,y:key==='vega'?775:735};atlasSprite18(ctx,art.casinoNPC18,col+5*(Math.floor(clock*1.5)%2),5,2,p.x,p.y,122,player.x>=p.x?1:-1);txt(name,p.x,p.y-118,10,'#ffe5aa');}txt('TRAGAPERRAS',670,470,12,'#ffdfa9');}
const formFacts18={human:['Tu cuerpo original.','Forma base del osmosiano.'],wood:['Un cuerpo de madera.','AcÃ©rcate a la madera marcada y absorbe su estructura.'],stone:['Un cuerpo de concreto.','AcÃ©rcate al concreto marcado para adoptar una forma resistente.'],electric:['EnergÃ­a elÃ©ctrica asimilada.','Requiere maestrÃ­a 30, tres puntos y un generador cercano.'],water:['Un cuerpo de agua.','Absorbe agua dentro del mundo submarino. Conserva sus tÃ©cnicas acuÃ¡ticas.'],fire:['ADN Ã­gneo asimilado.','Requiere ADN del jefe Ã­gneo, maestrÃ­a 60 y tres puntos en el Ã¡rbol.'],ghost:['Una absorciÃ³n espectral.','Completa el encuentro del hospital con la raza osmosiana y conserva sus poderes espectrales.'],acid:['Una mutaciÃ³n tÃ³xica verde.','MisiÃ³n nuclear exclusiva del osmosiano desde nivel 10. Vida base 350. Inmune al charco de la misiÃ³n y capaz de disolver los pestillos de seguridad. Cuatro tÃ©cnicas de maestrÃ­a y dos del Ã¡rbol.']};
function pediaTabs18(tab){return '<div class="pedia-tabs18">'+[['aliens','ALIENS'],['forms','ABSORCIONES'],['enemies','ENEMIGOS / JEFES']].map(([id,label])=>'<button data-book18="'+id+'" class="'+(id===tab?'active':'')+'">'+label+'</button>').join('')+'</div>';}
function pediaIcon18(canvas,row,known,form){const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;if(form==='acid'){atlasSprite18(c,art.acid17,0,4,6,40,86,120);}else{const {sheet,table}=spriteInfo(row),f=table[0],h=80,w=h*f[2]/f[3];c.drawImage(sheet,...f,40-w/2,85-h,w,h);if(form&&['wood','stone','electric'].includes(form)){c.globalCompositeOperation='source-atop';c.fillStyle=form==='wood'?'#ac713c99':form==='stone'?'#adb2bd99':'#80e8ff66';c.fillRect(0,0,80,90);}}if(!known){c.globalCompositeOperation='source-atop';c.fillStyle='#172a3d';c.fillRect(0,0,80,90);}c.globalCompositeOperation='source-over';}
omnipedia17=function(tab='aliens'){if(typeof tab!=='string')tab='aliens';const omni=race==='omni'?player:profiles.omni?.player||playerTemplate,osmo=race==='osmo'?player:profiles.osmo?.player||{},best=Object.assign({},profiles.omni?.player?.bestiary,profiles.osmo?.player?.bestiary,profiles.bendy?.player?.bestiary,profiles.anodite?.player?.bestiary,profiles.system148?.player?.bestiary,player.bestiary),forms=Object.keys(formFacts18),hasForm=id=>id==='prototype87'?!!osmo.prototype87?.unlocked:id==='tech62'?(!!osmo.techQuest62?.unlocked||!!best.techSentinel62):id==='crystal51'?!!osmo.diamondQuest51?.unlocked:id==='tetramand31'?!!osmo.absorbUnlocks?.tetramand31:id==='human'||id==='acid'?id==='human'||!!osmo.nuclear?.acid:id==='fire'||id==='electric'?!!osmo.absorbUnlocks?.[id]:id==='ghost'?!!osmo.ghostDNA:!!osmo.formRecords?.[id],ids=tab==='forms'?forms:tab==='enemies'?Object.keys(BESTIARY18):CORE_ALIENS.filter(id=>id!=='osmo'&&id!=='acid'),owned=id=>tab==='forms'?hasForm(id):tab==='enemies'?!!best[id]:id==='cerebron154'?(Number(omni.level)>=150&&(omni.equippedWatch73==='recalibrated115'||omni.ownedWatches73?.includes('recalibrated115'))):id==='waybig130'?!!omni.wayDNA130:id==='humungousaur129'?(CREATOR116&&!!omni.seenHum130):id==='diamondchuck128'?(omni.fusion121?.tier>=4&&!!omni.fusion121?.seen128):id==='fourstink125'?(Number(omni.fusion121?.tier)>=3||!!omni.fusion121?.seen125):id===FIRE121?(omni.fusion121?.tier>=2&&!!omni.fusion121?.seen):id==='benghostaf141'?(recalKnown120(omni)&&prototypeGhostProfile142(omni)):['swampfire115','echoecho118','jetray136','spidermonkey136','goop139','bigchill139','chromastone141'].includes(id)?recalKnown120(omni):id==='materia107'?!!omni.screwdriver107?.seen||Object.values(profiles).some(p=>p?.player?.screwdriver107?.seen):id==='upchuck106'?!!omni.upchuckDNA106||Object.values(profiles).some(p=>p?.player?.upchuckDNA106):id==='nullguardian104'?!!omni.nullGuardianDNA104||Object.values(profiles).some(p=>p?.player?.nullGuardianDNA104):id==='eyeguy62'?!!omni.eyeQuest62?.unlocked:id==='ditto'?!!omni.dittoDNA47:id==='corrosion'?!!omni.corrosionDNA45:id==='benvictor'?!!omni.benvictorDNA38:id==='benmomia'?!!omni.mummyDNA25:id==='cannonbolt'?!!omni.cannonDNA:id==='wildvine'?!!omni.wildDNA:id==='wolf'?!!omni.wolfDNA:id==='ghost'?!!omni.ghostDNA:true,name=id=>tab==='forms'?(OSMO_FORMS[id]?.name||'Espectral'):tab==='enemies'?BESTIARY18[id][0]:ALIENS[id].name;showDialog('OMNIPEDIA Â· ARCHIVOS DE CAMPO',tab==='forms'?'Absorciones osmosianas':tab==='enemies'?'Enemigos y jefes':'Aliens del Omnitrix',pediaTabs18(tab)+'<p>'+ids.filter(owned).length+' / '+ids.length+' '+(tab==='enemies'?'fichas registradas. AcÃ©rcate a una presencia nueva y pulsa ESCANEAR ENEMIGO o JEFE. Registrar no concede ADN.':tab==='forms'?'formas conocidas. Las absorciones se conservan en el perfil osmosiano.':'aliens recolectados. El escaneo de ADN mantiene sus requisitos y probabilidades.')+'</p><div class="pedia17">'+ids.map(id=>'<button data-entry18="'+id+'" class="'+(owned(id)?'owned17':'missing17')+'"><canvas width="80" height="90"></canvas><b>'+name(id)+'</b><small>'+(owned(id)?tab==='enemies'?BESTIARY18[id][2]:'CONOCIDO':'POR DESCUBRIR')+'</small></button>').join('')+'</div>',[['CERRAR',closeDialog]]);document.querySelectorAll('[data-book18]').forEach(b=>b.onclick=()=>omnipedia17(b.dataset.book18));for(const b of document.querySelectorAll('[data-entry18]')){const id=b.dataset.entry18,row=tab==='forms'?id==='prototype87'?382:id==='tech62'?300:id==='tetramand31'?192:id==='water'?32:id==='ghost'?70:id==='fire'?19:14:tab==='enemies'?BESTIARY18[id][1]:ALIENS[id].row;pediaIcon18(b.querySelector('canvas'),row,owned(id),tab==='forms'?id:null);b.onclick=()=>{const info=tab==='enemies'?BESTIARY18[id]:null,visible=owned(id),html=tab==='enemies'?visible?'<p>'+info[3]+'</p><details open><summary>Informe de campo</summary><p>'+info[4]+'</p><p>Nivel observado: '+best[id].level+' Â· Vida observada: '+best[id].hp+'</p></details>':'<p>AcÃ©rcate a este enemigo y escanÃ©alo para revelar su informe.</p>':tab==='forms'?'<p>'+formFacts18[id][0]+'</p><p>'+formFacts18[id][1]+'</p><p>'+(id==='acid'?'Vida base: 350 Â· MaestrÃ­a: '+Math.floor(osmo.masteries?.acid||0)+' %.':OSMO_FORMS[id]?'Vida base: '+OSMO_FORMS[id].hp+'.':'Poderes espectrales.')+'</p>':'<p>Vida base: '+ALIENS[id].hp+' Â· MaestrÃ­a: '+Math.floor(omni.masteries?.[id]||0)+' %.</p><p>'+(id==='nullguardian104'?'Completa la ronda 25 de la ExpediciÃ³n al VacÃ­o Nulo.':id==='eyeguy62'?'Max Tennyson Alien Force Â· Omnitrix nivel 50 Â· El mapa de los ojos. ADN garantizado.':id==='wildvine'?'CarnÃ­voro de la Ribera Â· ADN 10 % por victoria Â· sin requisito de nivel. Vida 300, regeneraciÃ³n automÃ¡tica y tÃ©cnicas vegetales.':id==='wolf'?'Nivel 30 Â· derrota a Blitztwolfer y escanea su ADN en 12 segundos Â· 20 %.':id==='ghost'?'Nivel 20 Â· completa el hospital, derrota a FantasmÃ¡tico y escanea su ADN en 12 segundos Â· 20 %.':'ADN disponible en el Omnitrix.')+'</p><p>'+ALIENS[id].skills.filter(s=>s.unlock<=100).map(s=>s.name).join(' Â· ')+'</p>';showDialog('OMNIPEDIA Â· '+(visible?'REGISTRO CONOCIDO':'PENDIENTE'),name(id),html,[['VOLVER',()=>omnipedia17(tab)]]);};}};
const b18=document.createElement('button');b18.id='enemyscan18';b18.className='scan-button17 hidden';b18.textContent='ESCANEAR ENEMIGO';b18.onclick=startEnemyScan18;$('#hud').append(b18);
document.addEventListener('keydown',e=>{if(e.code==='KeyV'&&!e.repeat)startEnemyScan18();});
$('#omnipediabtn17').textContent='OMNIPEDIA Â· ALIENS / FORMAS / ENEMIGOS';
const style18=document.createElement('style');style18.textContent='.pedia-tabs18{display:flex;gap:6px;margin-bottom:12px}.pedia-tabs18 button{flex:1;padding:12px 5px;font-size:11px;background:#24374a;border:1px solid #426079}.pedia-tabs18 .active{background:#376484;border-color:#abdfff}#enemyscan18,#scan17{left:auto;right:25%;bottom:22%;width:175px;max-width:175px;min-height:40px;font-size:10px;opacity:.94}.pedia17 canvas{width:80px!important;height:90px!important;max-width:80px}.pedia17 button{min-width:0}details{padding:10px;background:#192b3d}details summary{cursor:pointer;color:#abdfff}@media(max-width:600px){.pedia17{grid-template-columns:repeat(3,1fr)}.pedia-tabs18 button{font-size:9px;padding:10px 3px}#enemyscan18,#scan17{left:auto;right:24%;bottom:21%;width:140px;max-width:140px;font-size:9px}}';document.head.append(style18);
const pauseBase18=pauseMenu;pauseMenu=function(){pauseBase18();$('#dialogeyebrow').textContent='PARTIDA GUARDADA Â· VERSIÃ“N 0.18';};
if(window.__game)Object.assign(window.__game,{initProgress,enterZone,update,drawCinema,updateCinema,absorb,pauseMenu});
if(location.search.includes('qa=1'))window.__v18={BESTIARY18,enemyKey18,nearestEnemy18,startEnemyScan18,recordEnemy18,omnipedia:omnipedia17,absorbAcid17,startScan17,drawScanPose18,drawCasinoNPC18,get scan(){return fieldScan18},get art(){return art}};

const FRAMES19={"wildvine19": {"table": [[0, 0, 512, 512], [512, 0, 512, 512], [1024, 0, 512, 512], [1536, 0, 512, 512], [0, 512, 512, 512], [512, 512, 512, 512], [1024, 512, 512, 512], [1536, 512, 512, 512], [0, 1024, 512, 512], [512, 1024, 512, 512], [1024, 1024, 512, 512], [1536, 1024, 512, 512], [0, 1536, 512, 512], [512, 1536, 512, 512], [1024, 1536, 512, 512], [1536, 1536, 512, 512], [0, 2048, 512, 512], [512, 2048, 512, 512], [1024, 2048, 512, 512], [1536, 2048, 512, 512], [0, 2560, 512, 512], [512, 2560, 512, 512], [1024, 2560, 512, 512], [1536, 2560, 512, 512]], "anchors": [[256.07438016528926, 500.0], [768.2148760330579, 500.0], [1280.0413223140497, 500.0], [1791.5619834710744, 500.0], [255.85950413223142, 1012.0], [767.9173553719008, 1012.0], [1228.297520661157, 1012.0], [1791.685950413223, 1012.0], [255.53719008264463, 1524.0], [767.5867768595042, 1524.0], [1280.4793388429753, 1524.0], [1792.1818181818182, 1524.0], [246.5206611570248, 2036.0], [767.8760330578513, 2036.0], [1279.7603305785124, 2036.0], [1792.3305785123966, 2036.0], [255.76859504132233, 2548.0], [768.0247933884298, 2548.0], [1279.8595041322315, 2548.0], [1792.01652892562, 2548.0], [256.2314049586777, 3060.0], [767.8925619834711, 3060.0], [1280.0661157024792, 3060.0], [1792.280991735537, 3060.0]], "base": 320}, "carnivore19": {"table": [[0, 0, 640, 640], [640, 0, 640, 640], [1280, 0, 640, 640], [1920, 0, 640, 640], [0, 640, 640, 640], [640, 640, 640, 640], [1280, 640, 640, 640], [1920, 640, 640, 640], [0, 1280, 640, 640], [640, 1280, 640, 640], [1280, 1280, 640, 640], [1920, 1280, 640, 640], [0, 1920, 640, 640], [640, 1920, 640, 640], [1280, 1920, 640, 640], [1920, 1920, 640, 640]], "anchors": [[319.9657794676806, 628.0], [960.3954372623574, 628.0], [1599.828897338403, 628.0], [2240.433460076046, 628.0], [319.9163498098859, 1268.0], [960.4182509505704, 1268.0], [1600.125475285171, 1268.0], [2240.4410646387832, 1268.0], [320.3574144486692, 1908.0], [881.615969581749, 1908.0], [1599.5817490494296, 1908.0], [2239.574144486692, 1908.0], [319.8174904942966, 2548.0], [960.0266159695817, 2548.0], [1600.4714828897338, 2548.0], [2240.0266159695816, 2548.0]], "base": 320}, "xlrskin19": {"table": [[0, 0, 512, 512], [512, 0, 512, 512], [1024, 0, 512, 512], [1536, 0, 512, 512], [0, 512, 512, 512], [512, 512, 512, 512], [1024, 512, 512, 512], [1536, 512, 512, 512], [0, 1024, 512, 512], [512, 1024, 512, 512], [1024, 1024, 512, 512], [1536, 1024, 512, 512]], "anchors": [[255.59766763848395, 500.0], [767.7055393586006, 500.0], [1280.201166180758, 500.0], [1791.600583090379, 500.0], [255.8804664723032, 1012.0], [767.7288629737609, 1012.0], [1279.7725947521867, 1012.0], [1791.7492711370262, 1012.0], [255.7405247813411, 1524.0], [768.0116618075801, 1524.0], [1255.0816326530612, 1524.0], [1791.740524781341, 1524.0]], "base": 320}, "ultraClean19": {"table": [[0, 0, 512, 512], [512, 0, 512, 512], [1024, 0, 512, 512], [1536, 0, 512, 512], [0, 512, 512, 512], [512, 512, 512, 512], [1024, 512, 512, 512], [1536, 512, 512, 512], [0, 1024, 512, 512], [512, 1024, 512, 512], [1024, 1024, 512, 512], [1536, 1024, 512, 512], [0, 1536, 512, 512], [512, 1536, 512, 512], [1024, 1536, 512, 512], [1536, 1536, 512, 512]], "anchors": [[256.5, 480], [768.5, 480], [1280.0, 480], [1767.0, 480], [255.5, 992], [768.5, 992], [1279.5, 992], [1792.0, 992], [255.5, 1504], [768.5, 1504], [1279.5, 1504], [1792.0, 1504], [256.5, 2016], [768.0, 2016], [1280.0, 2016], [1791.5, 2016]], "base": 279}};
// OMNI 0.19 â€” native-style watch, plant encounter and original sprite atlases.
ALIENS.wildvine={name:'Wildvine',row:100,hp:300,color:'#9cdc56',skills:[makeSkill('Enredadera espinosa','ENREDAR',30,1),makeSkill('Bombas de semillas','BOMBAS',48,6,15),makeSkill('Abrazo de raÃ­ces','ATRAER',66,9,40),makeSkill('RegeneraciÃ³n (pasiva)','REGENERAR',0,60),{...makeSkill('Columpiada Â· activar/desactivar','COLUMPIAR',0,0),points:3},{...makeSkill('Bosque de espinas','ESPINAS',84,12),points:3}]};
CORE_ALIENS.push('wildvine');REGIONS[2].subtitle+=' Â· CarnÃ­voro Â· NV.20 recomendado';SPEEDS.wildvine=215;
const wildFX19=[];let watchLast19=null,watchPrev19=null;
const initBase19=initProgress;
initProgress=function(){initBase19();player.wildDNA=!!player.wildDNA;player.carnivoreTimer=Math.max(0,Number(player.carnivoreTimer)||0);player.wildRegenCD=Math.max(0,Number(player.wildRegenCD)||0);player.wildRegen19=null;player.wildCast19=null;player.wildSwing19=false;player.alienSkins.xlr8=player.alienSkins.xlr8==='nocturne'&&player.unlockedAlienSkins.xlrNocturne?'nocturne':'classic';};
function wildForm19(o=player){return (o===player?race:o.race)==='omni'&&o.alien&&o.activeAlien==='wildvine';}
function xlrSkin19(o=player){return (o===player?race:o.race)==='omni'&&o.alien&&o.activeAlien==='xlr8'&&o.alienSkins?.xlr8==='nocturne';}
function alienOwned19(id){return id==='wildvine'?player.wildDNA:id==='wolf'?player.wolfDNA&&player.level>=30:id==='ghost'?player.ghostDNA&&player.level>=20:true;}
const commitBase19=commitTransform;
commitTransform=function(){if(race==='omni'&&!player.alien&&player.selected==='wildvine'&&!player.wildDNA){toast('Wildvine Â· consigue su ADN: CarnÃ­voro Â· 10 % por victoria');return false;}return commitBase19();};
const transformBase19=transform;
transform=function(){if(race==='omni'&&!player.alien&&player.watchOpen&&player.selected==='wildvine'){if(!alienOwned19('wildvine')){toast('ADN pendiente Â· CarnÃ­voro Â· 10 %');return false;}if(cinematic||paused||!started)return false;player.watchOpen=false;commitTransform();burst(player.x,player.y-65,25,'#a6e969');hud();return true;}return transformBase19();};
$('#transform').onclick=transform;
const revertBase19=revert;revert=function(...args){player.wildSwing19=false;player.wildCast19=null;player.wildRegen19=null;return revertBase19(...args);};
const spriteInfoBase19=spriteInfo;
spriteInfo=function(row){const key={100:'wildvine19',101:'xlrskin19',102:'carnivore19',90:'ultraClean19'}[row];return key?{...FRAMES19[key],sheet:art[key]}:spriteInfoBase19(row);};
function wildFrame19(o=player){if(o.wildRegen19){const p=1-o.wildRegen19.t/o.wildRegen19.max;return p<.28?20:p<.56?21:p<.84?22:23;}if(o.wildCast19){const seq=[[5,6,7],[8,9,10],[11,12,13,14],[],[17,18,19],[15,16,16]][o.wildCast19.i];return seq[Math.min(seq.length-1,Math.floor((1-o.wildCast19.t/o.wildCast19.max)*seq.length))]||0;}if(o.wildSwing19&&o.moving)return 18+Math.floor(clock*6)%2;return o.moving?1+Math.floor(o.anim)%4:0;}
const combatPoseBase19=combatPose;
combatPose=function(o,row,f){if(wildForm19(o))return {row:100,f:wildFrame19(o),lift:o.wildSwing19&&o.moving?24+Math.sin(clock*8)*8:0};if(xlrSkin19(o)){const af={3:5,4:8,5:6,6:10}[f]??5;return {row:101,f:o.attack>0?af:o.moving?1+Math.floor(o.anim)%4:0,lift:0};}return combatPoseBase19(o,row,f);};
const spriteBase19=sprite;
sprite=function(row,f,x,y,h,face=1,alpha=1){if(row===11&&xlrSkin19()){row=101;f=[0,1,2,5,8,6,10][f]??0;}return spriteBase19(row,f,x,y,h,face,alpha);};
const remoteBase19=drawRemote;
drawRemote=function(single){for(const o of single?[single]:remoteTargets()){if(wildForm19(o)||xlrSkin19(o)){const pose=combatPose(o,wildForm19(o)?100:101,o.attackFrame||0);spriteBase19(pose.row,pose.f,o.x,o.y-pose.lift,123,o.face||1);txt('J'+(Number(o.id)+1),o.x,o.y-145,9,'#bde590');}else remoteBase19(o);}};
const avatarBase19=avatarPacket;avatarPacket=function(){return {...avatarBase19(),wildSwing19:player.wildSwing19,wildCast19:player.wildCast19,wildRegen19:player.wildRegen19};};
function enemyAim19(range){return enemies.filter(e=>e.alive&&dist(player,e)<range&&lineClear(player.x,player.y,e.x,e.y)).sort((a,b)=>dist(player,a)-dist(player,b))[0];}
function wildHitArea19(x,y,r,d,stun=.3){for(const e of enemies)if(e.alive&&dist(e,{x,y})<r&&lineClear(x,y,e.x,e.y))damageTarget(e,d,stun);}
function wildAttack19(i){if(!started||paused||cinematic||!wildForm19()||player.wildRegen19||player.motion||player.leap||player.cool[i]>0||interference())return false;if(!unlockedSkill('wildvine',i)){toast(i<4?'Requiere maestrÃ­a '+ALIENS.wildvine.skills[i].unlock:'Aprende esta tÃ©cnica por 3 puntos');return false;}if(i===3){toast('Pasiva automÃ¡tica Â· vida â‰¤25 % Â· cura 50 % Â· recarga '+Math.ceil(player.wildRegenCD)+' s');return false;}if(i===4){player.wildSwing19=!player.wildSwing19;player.wildCast19={i,t:.45,max:.45};toast(player.wildSwing19?'Columpiada activada Â· velocidad 620':'Columpiada desactivada');save();return true;}const skill=ALIENS.wildvine.skills[i],target=enemyAim19(i===2?430:350),a=target?Math.atan2(target.y-player.y,target.x-player.x):Math.atan2(player.dy,player.dx),damage=skill.damage*multiplier();player.face=Math.cos(a)>=0?1:-1;player.watchOpen=false;player.cool[i]=skill.cd;player.attack=[.55,.7,.95,0,.45,.8][i];player.wildCast19={i,t:player.attack,max:player.attack};const aim=target||{x:player.x+Math.cos(a)*220,y:player.y+Math.sin(a)*110};
 if(i===0){wildFX19.push({kind:'bind',x:player.x,y:player.y,target,t:.55,max:.55,zone});if(target)damageTarget(target,damage,.7);}
 if(i===1)for(let n=-1;n<=1;n++)wildFX19.push({kind:'bomb',x:player.x,y:player.y-65,tx:aim.x+n*58,ty:aim.y+n*20,t:1.25,max:1.25,damage:damage/3,exploded:false,zone});
 if(i===2){const targets=enemies.filter(e=>e.alive&&dist(player,e)<430&&lineClear(player.x,player.y,e.x,e.y));for(const e of targets){wildFX19.push({kind:'pull',x:player.x,y:player.y,target:e,t:.95,max:.95,damage,hit:false,zone});damageTarget(e,0,.9);}}
 if(i===5){wildFX19.push({kind:'spikes',x:aim.x,y:aim.y,t:1.05,max:1.05,zone});wildHitArea19(aim.x,aim.y,155,damage,.65);}
 window.OmniSound?.play('punch');return true;}
const attackBase19=attack;
attack=function(i){if(wildForm19())return wildAttack19(i);const fx=effects.length,pt=particles.length,old=player.cool[i];const result=attackBase19(i);if(xlrSkin19()&&player.cool[i]>old){for(const f of effects.slice(fx)){f.xlrLime19=true;f.color='#a7ff52';}for(const p of particles.slice(pt))p.color='#a7ff52';wildFX19.push({kind:'speed',x:player.x,y:player.y,i,t:.7,max:.7,zone});}return result;};
function triggerWildRegen19(){if(!wildForm19()||player.hp<=0||player.hp>maxHP()*.25||player.wildRegenCD>0||player.wildRegen19)return false;player.wildRegenCD=60;player.wildRegen19={t:1.8,max:1.8,heal:maxHP()*.5};player.inv=Math.max(player.inv,1.8);player.regenWait=12;player.wildSwing19=false;player.wildCast19=null;burst(player.x,player.y-65,24,'#beff6d');persistGame();toast('REGENERACIÃ“N Â· recuperando 50 % de vida mÃ¡xima');return true;}
const hitBase19=hitPlayer;
hitPlayer=function(amount){const before=player.hp;hitBase19(amount);if(player.hp<before)triggerWildRegen19();};
function ensureCarnivore19(){if(zone!==SWAMP20||net.role==='guest')return null;let b=enemies.find(e=>e.carnivore19);if(b?.alive||player.carnivoreTimer>0)return b;let spawn={x:1050,y:650};for(let x=1050;x>900&&isSolid(spawn.x,spawn.y);x-=40)spawn={x,y:650};const state={id:'carnivore19',kind:'enemy',carnivore19:true,level:20,x:spawn.x,y:spawn.y,homeX:spawn.x,homeY:spawn.y,hp:2400,max:2400,alive:true,face:-1,anim:0,moving:false,hit:0,stun:0,cds:[2,5,7,10],cast19:null};if(b)Object.assign(b,state);else{b=state;enemies.push(b);}zoneStates[region().id]=enemies;return b;}
function defeatCarnivore19(b,rng=random17){if(!b?.alive)return false;b.alive=false;b.hp=0;b.cast19=null;b.respawn=60;player.carnivoreTimer=60;const success=race==='omni'&&rng()<.10;if(success)player.wildDNA=true;xp(550);player.coins+=20;player.carnivoreDrops19=(player.carnivoreDrops19||0)+1;burst(b.x,b.y-70,35,'#a3d56b');persistGame();toast(success?'Â¡ADN DE WILDVINE OBTENIDO! Â· 10 %':'CarnÃ­voro derrotado Â· +550 EXP Â· +20 monedas Â· ADN Wildvine 10 % por victoria');return success;}
const damageEnemyBase19=damageEnemy;
damageEnemy=function(e,d){if(!e.carnivore19)return damageEnemyBase19(e,d);if(!e.alive)return;e.hp-=Math.round(d);e.hit=.18;popup(e.x,e.y-185,String(Math.round(d)));if(e.hp<=0)defeatCarnivore19(e);};
function updateCarnivore19(dt){if(net.role==='guest')return;player.carnivoreTimer=Math.max(0,player.carnivoreTimer-dt);if(zone!==SWAMP20)return;const b=ensureCarnivore19();if(!b||!b.alive){if(b)b.respawn=player.carnivoreTimer;return;}b.hit=Math.max(0,b.hit-dt);b.stun=Math.max(0,b.stun-dt);b.cds=b.cds.map(cd=>Math.max(0,cd-dt));b.moving=false;const target=teamTargets().filter(t=>t.alive!==false).sort((a,c)=>dist(a,b)-dist(c,b))[0]||player;b.face=target.x>=b.x?1:-1;if(b.cast19){const c=b.cast19;c.t-=dt;if(!c.hit&&c.t<.15){c.hit=true;if(c.i===2){for(let n=-1;n<=1;n++)hostileShots.push({type:'green',x:b.x,y:b.y-70,dx:Math.cos(c.a+n*.2)*260,dy:Math.sin(c.a+n*.2)*260,r:11,t:2.4,damage:24});}else for(const o of teamTargets())if(dist(o,b)<[160,260,0,210][c.i]&&lineClear(b.x,b.y,o.x,o.y))hurtTeam(o,[34,27,0,46][c.i]);if(c.i===3){effects.push({type:'slam',x:b.x,y:b.y,r:210,t:.65,max:.65});shake=.2;}}if(c.t<=0)b.cast19=null;return;}if(b.stun>0||b.possessedTime>0)return;const d=dist(target,b);if(d>680)return;let i=d<165&&b.cds[0]<=0?0:d<270&&b.cds[1]<=0?1:d<550&&b.cds[2]<=0?2:d<240&&b.cds[3]<=0?3:-1;if(i>=0){b.cds[i]=[3,6,8,11][i];b.cast19={i,t:[.9,1.1,1.25,1.4][i],max:[.9,1.1,1.25,1.4][i],hit:false,a:Math.atan2(target.y-b.y,target.x-b.x)};return;}if(d>145){moveActor(b,(target.x-b.x)/d*72*dt,(target.y-b.y)/d*72*dt);b.moving=true;b.anim+=dt*5;}}
function drawCarnivore19(b){let f=!b.alive?15:b.cast19?b.cast19.i===0?(b.cast19.t>.5?4:5):b.cast19.i===1?(b.cast19.t>.55?8:9):b.cast19.i===2?(b.cast19.t>.5?12:13):14:b.moving?1+Math.floor(b.anim)%2:0;spriteBase19(102,f,b.x,b.y,185,b.face,b.hit>0?.6:1);if(b.cast19){ctx.strokeStyle='#ffaf72';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(b.x,b.y,b.cast19.i===1?260:b.cast19.i===3?210:160,36,0,0,Math.PI*2);ctx.stroke();txt('!',b.x,b.y-217,20,'#ffcb7d');}txt('CARNÃVORO Â· RECOMENDADO NV.20',b.x,b.y-202,10,'#d8ef98');ctx.fillStyle='#17351f';ctx.fillRect(b.x-65,b.y-195,130,6);ctx.fillStyle='#a8d764';ctx.fillRect(b.x-65,b.y-195,130*Math.max(0,b.hp/b.max),6);}
const enemyKeyBase19=enemyKey18;enemyKey18=function(e){return e.carnivore19?'carnivore':enemyKeyBase19(e);};BESTIARY18.carnivore=['CarnÃ­voro',102,'JEFE','Una planta carnÃ­vora de la Ribera.','Nivel recomendado 20, sin bloqueo de nivel. Prepara mordida, lÃ¡tigo de espinas, semillas y golpe de raÃ­ces. Reaparece 60 segundos despuÃ©s de cada derrota. ADN Wildvine: 10 % por victoria para el Omnitrix, sin requisito de nivel.'];
const enterBase19=enterZone;enterZone=function(...args){const result=enterBase19(...args);if(result){wildFX19.length=0;ensureCarnivore19();}return result;};
const updateBase19=update;
update=function(dt){if(started&&!paused&&!cinematic&&!scan17&&!fieldScan18){player.wildRegenCD=Math.max(0,player.wildRegenCD-dt);if(player.wildCast19){player.wildCast19.t-=dt;if(player.wildCast19.t<=0)player.wildCast19=null;}if(player.wildRegen19&&wildForm19()){const r=player.wildRegen19;player.hp=Math.min(maxHP(),player.hp+r.heal/r.max*Math.min(dt,r.t));r.t=Math.max(0,r.t-dt);if(r.t<=0)player.wildRegen19=null;}if(!wildForm19())player.wildSwing19=false;updateCarnivore19(dt);for(let i=wildFX19.length-1;i>=0;i--){const f=wildFX19[i];f.t-=dt;if(f.zone!==zone||f.t<=0){wildFX19.splice(i,1);continue;}if(f.kind==='bomb'&&!f.exploded&&f.max-f.t>=.65){f.exploded=true;wildHitArea19(f.tx,f.ty,110,f.damage);burst(f.tx,f.ty-18,18,'#77dded');}if(f.kind==='pull'&&f.target?.alive){if(!f.target.carnivore19&&!f.target.majorBoss&&!f.target.wolfBoss&&!f.target.ghostBoss&&!f.target.hexBoss&&!f.target.robotBoss)moveActor(f.target,(player.x-f.target.x)*Math.min(.16,dt*4),(player.y-f.target.y)*Math.min(.16,dt*4));if(!f.hit&&f.t<.25){f.hit=true;damageTarget(f.target,f.damage,.5);}}}}updateBase19(dt);if(started&&!paused&&!cinematic){triggerWildRegen19();if(xlrSkin19()&&player.moving&&quality17!=='low'&&Math.random()<.35)particles.push({x:player.x-player.face*35,y:player.y-20,dx:-player.face*15,dy:0,t:.25,color:'#b8ff63',size:4});}};
const expansionBase19=drawExpansion;
drawExpansion=function(){expansionBase19();for(const f of wildFX19){const p=1-f.t/f.max;ctx.save();ctx.globalAlpha=Math.min(1,f.t*5);if(f.kind==='bind'||f.kind==='pull'){const t=f.target||{x:f.x+player.face*150,y:f.y};ctx.strokeStyle=f.moon20?'#d456df':'#72ba41';ctx.lineWidth=f.kind==='pull'?6:4;ctx.beginPath();ctx.moveTo(f.x,f.y-68);ctx.quadraticCurveTo((f.x+t.x)/2,f.y-110-Math.sin(p*12)*15,t.x,t.y-50);ctx.stroke();for(let n=0;n<5;n++){const x=f.x+(t.x-f.x)*n/5,y=f.y-68+(t.y-f.y+18)*n/5;ctx.fillStyle='#dfec9c';ctx.fillRect(x,y-7,4,10);}ctx.strokeStyle=f.moon20?'#ffabed':'#b3e87a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(t.x,t.y-45,35+Math.sin(p*8)*4,23,0,0,Math.PI*2);ctx.stroke();}if(f.kind==='bomb'){const flight=clamp((f.max-f.t)/.65,0,1),x=f.x+(f.tx-f.x)*flight,y=f.y+(f.ty-f.y)*flight-Math.sin(flight*Math.PI)*75;if(!f.exploded){ctx.fillStyle='#12333b';ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#6ce5ea';ctx.fillRect(x-5,y-7,8,8);}else{ctx.strokeStyle='#8cecfa';ctx.lineWidth=6*(f.t/.6)+1;ctx.beginPath();ctx.ellipse(f.tx,f.ty-20,(.6-f.t)*180,Math.max(1,(.6-f.t)*110),0,0,Math.PI*2);ctx.stroke();}}if(f.kind==='spikes'){for(let i=0;i<9;i++){const x=f.x+Math.cos(i*2.4)*((i%3+1)*40),y=f.y+Math.sin(i*2.4)*35,h=60*Math.sin(Math.min(1,p*2)*Math.PI);ctx.fillStyle='#769544';ctx.beginPath();ctx.moveTo(x-12,y);ctx.lineTo(x,y-h);ctx.lineTo(x+12,y);ctx.closePath();ctx.fill();ctx.fillStyle='#c4dd81';ctx.fillRect(x-2,y-h+5,3,h*.5);}}if(f.kind==='speed'){ctx.strokeStyle='#b1ff51';ctx.lineWidth=3;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(f.x,f.y-30,35+p*100+i*8,15+p*20,0,p*8+i,p*8+i+Math.PI);ctx.stroke();}}ctx.restore();}if(wildForm19()&&player.wildSwing19&&player.moving){ctx.strokeStyle='#5e9e34';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(player.x+player.face*20,player.y-120);ctx.lineTo(player.x+player.face*130,player.y-380);ctx.stroke();}};
function buyXlrSkin19(){if(race!=='omni'||player.unlockedAlienSkins.xlrNocturne||player.coins<1000)return false;player.coins-=1000;player.unlockedAlienSkins.xlrNocturne=true;player.alienSkins.xlr8='nocturne';persistGame();return true;}
const selectSkinBase19=selectAlienSkin;
selectAlienSkin=function(id,alienId='fourarms'){if(alienId!=='xlr8')return selectSkinBase19(id,alienId);if(race!=='omni'||!['classic','nocturne'].includes(id)||id==='nocturne'&&!player.unlockedAlienSkins.xlrNocturne)return false;player.alienSkins.xlr8=id;persistGame();return true;};
const alienSkinMenuBase19=alienSkinMenu;
alienSkinMenu=function(selected='fourarms'){if(typeof selected!=='string')selected='fourarms';if(race!=='omni'){toast('Skins exclusivas del Omnitrix');return;}if(selected!=='xlr8'){alienSkinMenuBase19(selected);const b=document.createElement('button');b.textContent='XLR8';b.onclick=()=>alienSkinMenu('xlr8');$('.skin-tabs')?.append(b);return;}showDialog('SKINS Â· COSMÃ‰TICAS Â· '+player.coins+' MONEDAS','XLR8 Â· Nocturno','<div class="skin-tabs">'+['fourarms','ghost','heatblast','xlr8'].map(id=>'<button data-skin-tab19="'+id+'">'+ALIENS[id].name+'</button>').join('')+'</div><p>1000 monedas Â· diseÃ±o negro con bordes verdes, cola, ruedas y estelas lima. Mismos daÃ±os, vida, velocidad, maestrÃ­a, cooldowns y seis tÃ©cnicas.</p><div class="alien-skin-cards">'+[['classic','ClÃ¡sico',11,true],['nocturne','Nocturno',101,player.unlockedAlienSkins.xlrNocturne]].map(([id,name,row,owned])=>'<button data-xl19="'+id+'" data-row19="'+row+'" class="'+(player.alienSkins.xlr8===id?'active':'')+'"><canvas width="150" height="170"></canvas><b>'+name+'</b><small>'+(owned?player.alienSkins.xlr8===id?'EQUIPADA':'EQUIPAR':'COMPRAR Â· 1000')+'</small></button>').join('')+'</div>',[['LISTO',closeDialog]]);document.querySelectorAll('[data-skin-tab19]').forEach(b=>b.onclick=()=>alienSkinMenu(b.dataset.skinTab19));for(const b of document.querySelectorAll('[data-xl19]')){const {sheet,table,anchors,base}=spriteInfo(Number(b.dataset.row19)),f=table[0],c=b.querySelector('canvas').getContext('2d');c.imageSmoothingEnabled=false;if(base){const scale=125/base,anchor=anchors[0];c.drawImage(sheet,...f,75+(f[0]-anchor[0])*scale,150+(f[1]-anchor[1])*scale,f[2]*scale,f[3]*scale);}else{const h=130,w=f[2]/f[3]*h;c.drawImage(sheet,...f,75-w/2,150-h,w,h);}b.onclick=()=>{if(b.dataset.xl19==='nocturne'&&!player.unlockedAlienSkins.xlrNocturne){showDialog('COMPRA ÃšNICA Â· SKIN XLR8','Nocturno Â· 1000 monedas','<p>Saldo: '+player.coins+'. La apariencia y los efectos cambian; el poder se conserva.</p>',[['COMPRAR',()=>{if(buyXlrSkin19())alienSkinMenu('xlr8');else toast('Necesitas 1000 monedas');}],['VOLVER',()=>alienSkinMenu('xlr8')]]);}else if(selectAlienSkin(b.dataset.xl19,'xlr8'))alienSkinMenu('xlr8');};}};
$('#alienskins').onclick=()=>alienSkinMenu();
const watchCanvas19=document.createElement('canvas');watchCanvas19.width=196;watchCanvas19.height=196;watchCanvas19.className='watch-button19';$('#transform').append(watchCanvas19);
$('#dialportrait').width=200;$('#dialportrait').height=200;$('#dialportrait').onclick=()=>transform();$('#dialportrait').setAttribute('role','button');$('#dialportrait').tabIndex=0;$('#dialportrait').addEventListener('keydown',e=>{if(e.code==='Enter'||e.code==='Space'){e.preventDefault();transform();}});
const silhouettes19=new Map();
function silhouette19(id,frame){const key=id+':'+frame;if(silhouettes19.has(key))return silhouettes19.get(key);const c=document.createElement('canvas');c.width=110;c.height=130;const g=c.getContext('2d'),{table,sheet}=spriteInfo(ALIENS[id].row),f=table[frame]||table[0];g.imageSmoothingEnabled=false;let h=112,w=h*f[2]/f[3];if(w>90){h*=90/w;w=90;}if(ALIENS[id].row===100||ALIENS[id].row===90){const def=spriteInfo(ALIENS[id].row),anchor=def.anchors[frame]||def.anchors[0],scale=110/def.base;g.drawImage(sheet,...f,55+(f[0]-anchor[0])*scale,123+(f[1]-anchor[1])*scale,f[2]*scale,f[3]*scale);}else g.drawImage(sheet,...f,55-w/2,122-h,w,h);g.globalCompositeOperation='source-in';g.fillStyle='#000';g.fillRect(0,0,110,130);silhouettes19.set(key,c);return c;}
function watchFace19(c,open,id){const w=c.canvas.width,h=c.canvas.height;c.clearRect(0,0,w,h);c.imageSmoothingEnabled=false;c.save();c.translate(w/2,h/2);const scale=w/196;c.scale(scale,scale);if(!open){c.fillStyle='#252c29';c.strokeStyle='#080d0c';c.lineWidth=5;c.fillRect(-88,-64,176,128);c.strokeRect(-88,-64,176,128);for(const [x,y,a] of [[-58,-60,-.5],[58,-60,.5],[-58,60,.5],[58,60,-.5]]){c.save();c.translate(x,y);c.rotate(a);c.fillStyle='#dce2d9';c.fillRect(-9,-25,18,50);c.strokeRect(-9,-25,18,50);c.restore();}}c.fillStyle='#090e0d';c.strokeStyle='#020403';c.lineWidth=4;c.beginPath();c.arc(0,0,77,0,Math.PI*2);c.fill();c.stroke();c.strokeStyle='#707a72';c.lineWidth=10;c.beginPath();c.arc(0,0,67,0,Math.PI*2);c.stroke();c.fillStyle=open?'#b5f03a':'#879887';c.beginPath();c.arc(0,0,59,0,Math.PI*2);c.fill();if(open){c.fillStyle='#030802';c.beginPath();c.moveTo(0,-60);c.lineTo(51,0);c.lineTo(0,60);c.lineTo(-51,0);c.closePath();c.fill();c.fillStyle='#b1ed2c';c.beginPath();c.moveTo(0,-54);c.lineTo(42,0);c.lineTo(0,54);c.lineTo(-42,0);c.closePath();c.fill();c.save();c.beginPath();c.moveTo(0,-53);c.lineTo(41,0);c.lineTo(0,53);c.lineTo(-41,0);c.closePath();c.clip();const frame=Math.floor(clock*3)%3;c.globalAlpha=1;c.drawImage(silhouette19(id,frame),-34,-45+Math.sin(clock*3)*1.5,68,87);c.restore();}else{c.fillStyle='#b2e967';c.beginPath();c.moveTo(-27,-38);c.lineTo(27,-38);c.lineTo(10,0);c.lineTo(27,38);c.lineTo(-27,38);c.lineTo(-10,0);c.closePath();c.fill();c.strokeStyle='#111914';c.lineWidth=7;c.stroke();}c.save();c.rotate(open?(player.watchTurn||0)*1.2:0);for(let i=0;i<4;i++){const a=i*Math.PI/2,x=Math.cos(a)*73,y=Math.sin(a)*73;c.fillStyle='#121c16';c.beginPath();c.arc(x,y,10,0,Math.PI*2);c.fill();c.fillStyle='#a3dc45';c.beginPath();c.arc(x,y,6+Math.sin(clock*4+i)*.6,0,Math.PI*2);c.fill();c.fillStyle='#defcb0';c.fillRect(x-3,y-4,3,3);}c.restore();if(open&&!alienOwned19(id)){c.fillStyle='#16240eef';c.fillRect(19,28,29,25);c.strokeStyle='#d1eaba';c.lineWidth=4;c.beginPath();c.arc(33,28,9,Math.PI,Math.PI*2);c.stroke();c.fillStyle='#eaffce';c.fillRect(31,36,4,8);}c.restore();}
const hudBase19=hud;
hud=function(){hudBase19();const omni=race==='omni',open=omni&&!player.alien&&player.watchOpen;document.body.classList.toggle('omni-watch19',omni);document.body.classList.toggle('watch-select19',open);if(omni){$('#transform').setAttribute('aria-label',player.alien?'Volver a humano':'Abrir Omnitrix');const id=player.alien?player.activeAlien:player.selected;if(id!==watchLast19){watchPrev19=watchLast19;watchLast19=id;}watchFace19(watchCanvas19.getContext('2d'),false,id);watchFace19($('#dialportrait').getContext('2d'),true,id);$('#dialportrait').setAttribute('aria-label',alienOwned19(id)?'Activar '+ALIENS[id].name:'Bloqueado: '+ALIENS[id].name);if(!alienOwned19(id))$('#dialmastery').textContent=id==='wildvine'?'CANDADO Â· CARNÃVORO Â· ADN 10 %':id==='wolf'?'CANDADO Â· NV.30 + ADN 20 %':'CANDADO Â· HOSPITAL NV.20 + ADN';}const b=enemies.find(e=>e.carnivore19);$('#carnivorebar19').classList.toggle('hidden',zone!==2||!b);if(zone===2&&b){$('#carnivorebar19').textContent=b.alive?'CARNÃVORO Â· NV.20 recomendado Â· '+Math.ceil(b.hp)+' / '+b.max:'CARNÃVORO Â· REAPARECE EN '+Math.ceil(player.carnivoreTimer)+' s';$('#questsub').textContent='Wildvine: ADN 10 % por victoria Â· sin requisito de nivel';}if(wildForm19()){const buttons=document.querySelectorAll('.attack');if(attackPage===0){buttons[3].classList.remove('locked');buttons[3].querySelector('small').textContent=player.wildRegen19?'REGENERANDO':player.wildRegenCD>0?Math.ceil(player.wildRegenCD)+' s':'PASIVA Â· â‰¤25 %';}else{buttons[0].querySelector('span').textContent=player.wildSwing19?'DETENER':'COLUMPIAR';buttons[0].querySelector('small').textContent=unlockedSkill('wildvine',4)?player.wildSwing19?'ACTIVA':'LISTO':'3 PUNTOS';}$('#regen').textContent=player.wildRegen19?'REGENERACIÃ“N Â· +50 % VIDA':player.wildSwing19?'COLUMPIADA Â· VELOCIDAD 620':$('#regen').textContent;}};
const bar19=document.createElement('div');bar19.id='carnivorebar19';bar19.className='hidden';$('#hud').append(bar19);
const css19=document.createElement('style');css19.textContent='body.omni-watch19 #hud #transform{background:none!important;border:0!important;box-shadow:none!important;border-radius:0!important;padding:0!important;width:13%;height:auto;aspect-ratio:1;left:19%;bottom:4%;filter:none!important;overflow:visible}body.omni-watch19 #hud #transform:before,body.omni-watch19 #hud #transform:after{display:none!important}body.omni-watch19 #hud #transform>img,body.omni-watch19 #hud #transform>strong,body.omni-watch19 #hud #transform>small{display:none!important}.watch-button19{display:none}body.omni-watch19 .watch-button19{display:block;width:100%;height:100%;image-rendering:pixelated;pointer-events:none}body.omni-watch19 #hud #dial{display:none}body.watch-select19 #hud #transform{visibility:hidden}body.watch-select19 #hud #dial{display:block;position:absolute;left:20%;bottom:3%;width:31%;height:31%;border:0!important;background:none!important;box-shadow:none!important;padding:0;overflow:visible}body.watch-select19 #hud #dialportrait{position:absolute;left:50%;top:0;transform:translateX(-50%);width:auto;height:87%;aspect-ratio:1;image-rendering:pixelated;cursor:pointer;filter:drop-shadow(0 0 6px #8dc93b55)}body.watch-select19 #hud #dialprev,body.watch-select19 #hud #dialnext{position:absolute;top:29%;width:36px;height:38px;padding:0;background:#142214c9;border:1px solid #a4d851;z-index:2}body.watch-select19 #hud #dialprev{left:0}body.watch-select19 #hud #dialnext{right:0}body.watch-select19 #hud #dialname{position:absolute;bottom:4%;width:100%;text-align:center;left:0;font-size:11px;text-shadow:0 1px 3px black}body.watch-select19 #hud #dialmastery{position:absolute;bottom:-7%;width:100%;text-align:center;left:0;font-size:8px;background:none}body.watch-select19 #hud #watchclose{left:43%;bottom:29%;width:12%;height:30px;font-size:9px}body.watch-select19 #hud #cinematoggle{left:19%;bottom:30%;width:12%;font-size:8px}body.omni-watch19 #hud #transform:active{transform:scale(.94)}#carnivorebar19{position:absolute;left:35%;top:24%;width:32%;padding:7px;background:#213317e8;border:1px solid #bad478;color:#e7f8bd;font-size:10px;text-align:center;pointer-events:none}@media(max-height:400px){body.watch-select19 #hud #dial{bottom:4%;height:34%}body.watch-select19 #hud #dialportrait{height:88%}body.watch-select19 #hud #dialname{font-size:9px}body.watch-select19 #hud #dialprev,body.watch-select19 #hud #dialnext{height:30px;width:28px}}';document.head.append(css19);
const pauseBase19=pauseMenu;pauseMenu=function(){pauseBase19();$('#dialogeyebrow').textContent='PARTIDA GUARDADA Â· VERSIÃ“N 0.19';};
if(window.__game)Object.assign(window.__game,{spriteInfo,sprite,combatPose,avatarPacket,drawRemote,initProgress,commitTransform,transform,revert,attack,hitPlayer,damageEnemy,update,enterZone,hud,alienSkinMenu,selectAlienSkin,pauseMenu});
if(location.search.includes('qa=1'))window.__v19={FRAMES19,wildAttack19,wildFrame19,triggerWildRegen19,ensureCarnivore19,updateCarnivore19,defeatCarnivore19,drawCarnivore19,buyXlrSkin19,alienOwned19,watchFace19,silhouette19,get fx(){return wildFX19}};

const FRAMES20={"wildskin20": {"table": [[0, 0, 640, 640], [640, 0, 640, 640], [1280, 0, 640, 640], [1920, 0, 640, 640], [0, 640, 640, 640], [640, 640, 640, 640], [1280, 640, 640, 640], [1920, 640, 640, 640], [0, 1280, 640, 640], [640, 1280, 640, 640], [1280, 1280, 640, 640], [1920, 1280, 640, 640], [0, 1920, 640, 640], [640, 1920, 640, 640], [1280, 1920, 640, 640], [1920, 1920, 640, 640], [0, 2560, 640, 640], [640, 2560, 640, 640], [1280, 2560, 640, 640], [1920, 2560, 640, 640], [0, 3200, 640, 640], [640, 3200, 640, 640], [1280, 3200, 640, 640], [1920, 3200, 640, 640]], "anchors": [[319.9024390243902, 628.0], [960.0081300813008, 628.0], [1600.4065040650407, 628.0], [2239.7642276422766, 628.0], [319.520325203252, 1268.0], [960.3170731707316, 1268.0], [1599.6178861788617, 1268.0], [2240.048780487805, 1268.0], [320.3577235772358, 1908.0], [960.4308943089432, 1908.0], [1599.6829268292684, 1908.0], [2239.723577235772, 1908.0], [319.8211382113821, 2548.0], [959.6666666666666, 2548.0], [1599.560975609756, 2548.0], [2240.040650406504, 2548.0], [320.349593495935, 3188.0], [960.0975609756098, 3188.0], [1599.6747967479675, 3188.0], [2240.1056910569105, 3188.0], [319.7723577235772, 3828.0], [960.439024390244, 3828.0], [1599.9674796747968, 3828.0], [2239.967479674797, 3828.0]], "base": 320}, "ultraskin20": {"table": [[0, 0, 640, 640], [640, 0, 640, 640], [1280, 0, 640, 640], [1920, 0, 640, 640], [0, 640, 640, 640], [640, 640, 640, 640], [1280, 640, 640, 640], [1920, 640, 640, 640], [0, 1280, 640, 640], [640, 1280, 640, 640], [1280, 1280, 640, 640], [1920, 1280, 640, 640], [0, 1920, 640, 640], [640, 1920, 640, 640], [1280, 1920, 640, 640], [1920, 1920, 640, 640]], "anchors": [[319.7343173431734, 628.0], [960.3136531365313, 628.0], [1599.8081180811807, 628.0], [2240.132841328413, 628.0], [319.6014760147601, 1268.0], [960.4944649446495, 1268.0], [1599.9409594095941, 1268.0], [2240.4723247232473, 1268.0], [305.64944649446494, 1908.0], [959.9298892988929, 1908.0], [1599.771217712177, 1908.0], [2240.3468634686346, 1908.0], [319.760147601476, 2548.0], [960.3325830258302, 2548.0], [1599.638376383764, 2548.0], [2239.5571955719556, 2548.0]], "base": 320}};
// OMNI 0.20: swamp, slow selection, bounded loot and cosmetic progression.
const SWAMP20=REGIONS.length;
REGIONS[2].subtitle=REGIONS[2].subtitle.replace(' Â· CarnÃ­voro Â· NV.20 recomendado','');
REGIONS[2].links.down=SWAMP20;
REGIONS.push(makeRegion17('swamp20','Pantano de LuciÃ©rnagas','CarnÃ­voro Â· nivel 20 recomendado',{up:2},{top:390,bottom:850,exitY:620,portalX:850,colliders:[{x:40,y:380,w:210,h:470},{x:1380,y:380,w:180,h:470}]}));
const drawSceneBase20=drawScene;drawScene=function(c,z,day){if(z!==SWAMP20)return drawSceneBase20(c,z,day);c.imageSmoothingEnabled=false;c.drawImage(art.swamp20,0,0,1600,900);c.drawImage(art.swamp20,0,art.swamp20.height*.94,art.swamp20.width,art.swamp20.height*.06,0,900,1600,140);};
let ultraSeconds20=0,ultraSave20=0,uiClock20=0;
try{ultraSeconds20=Math.max(0,Math.min(1800,Number(localStorage.getItem('omni-ultra-seconds20'))||0));}catch(e){}
function pityState20(key){player.pity20=player.pity20||{};return player.pity20[key]=Object.assign({attempts:0,failures:0,obtained:false},player.pity20[key]||{});}
function rollPity20(key,chance,rng=random17){const s=pityState20(key);if(s.obtained)return false;s.attempts++;const win=s.failures>=14||rng()<chance;if(win){s.obtained=true;s.failures=0;}else s.failures=Math.min(14,s.failures+1);return win;}
function pityLabel20(key,owned){const s=pityState20(key);return owned||s.obtained?'OBTENIDO':Math.min(15,s.failures)+'/15 Â· siguiente '+Math.min(15,s.failures+1)+'/15';}
const initBase20=initProgress;initProgress=function(){initBase20();player.pity20=player.pity20||{};for(const [key,id] of [['wolf','wolf'],['ghost','ghost']]){const s=pityState20(key);if(player[id+'DNA'])s.obtained=true;else if(!s.attempts){s.attempts=player.scans[id]?.attempts||0;s.failures=Math.min(14,s.attempts);}}for(const [key,owned] of [['wild',player.wildDNA],['wildSkin',player.unlockedAlienSkins.wildMoon],['ghostSkin',player.unlockedAlienSkins.ghostLady]])if(owned)pityState20(key).obtained=true;for(const id of ['wildvine','ultra'])player.alienSkins[id]=player.alienSkins[id]||'classic';if(!player.unlockedAlienSkins.wildMoon)player.alienSkins.wildvine='classic';if(ultraSeconds20>=1800)player.unlockedAlienSkins.ultraAnime=true;if(!player.unlockedAlienSkins.ultraAnime)player.alienSkins.ultra='classic';for(const r of REGIONS)if(r.id!=='swamp20'&&zoneStates[r.id]){const list=zoneStates[r.id];for(let i=list.length-1;i>=0;i--)if(list[i].carnivore19)list.splice(i,1);}};
defeatCarnivore19=function(b,rng=random17){if(!b?.alive)return false;b.alive=false;b.hp=0;b.cast19=null;b.respawn=60;player.carnivoreTimer=60;let dna=false,skin=false;if(race==='omni'){if(!player.wildDNA)dna=rollPity20('wild',.10,rng);if(dna)player.wildDNA=true;if(!player.unlockedAlienSkins.wildMoon)skin=rollPity20('wildSkin',.05,rng);if(skin)player.unlockedAlienSkins.wildMoon=true;}xp(550);player.coins+=20;player.carnivoreDrops19=(player.carnivoreDrops19||0)+1;burst(b.x,b.y-70,35,'#a3d56b');persistGame();toast(dna?'Â¡ADN WILDVINE!':skin?'Â¡SKIN WILDVINE LUNAR!':'CarnÃ­voro derrotado Â· ADN '+pityLabel20('wild',player.wildDNA)+' Â· skin '+pityLabel20('wildSkin',player.unlockedAlienSkins.wildMoon));return dna;};
startScan17=function(){if(!started||paused||scan17||cinematic)return false;const s=nearestScan17();if(!s||player.level<(s.id==='wolf'?30:20))return false;if(player.alien)revert(false);s.used=true;const owned=!!player[s.id+'DNA'],success=owned||rollPity20(s.id,.20);player.scans[s.id]={attempts:(player.scans[s.id]?.attempts||0)+1,lastSuccess:success};if(success)player[s.id+'DNA']=true;scan17={...s,t:0,max:2.1,success};player.face=s.x>=player.x?1:-1;player.watchOpen=false;resetInput();cam.x=clamp((player.x+s.x)/2-W*.5/sceneZoom(),0,cameraMaxX());cam.y=clamp(player.y-H*.64/sceneZoom(),0,cameraMaxY());hud();persistGame();return true;};
const ghostRewardBase20=ghostSkinReward;ghostSkinReward=function(token,won){if(race!=='omni'||player.level<20||player.ghostDropReceipts.includes(token))return false;const success=player.unlockedAlienSkins.ghostLady?won:rollPity20('ghostSkin',0,()=>1)||won;if(success)pityState20('ghostSkin').obtained=true;return ghostRewardBase20(token,success);};
function costume20(o=player){if((o===player?race:o.race)!=='omni'||!o.alien)return null;return o.activeAlien==='wildvine'&&o.alienSkins?.wildvine==='moon'?'wildskin20':o.activeAlien==='ultra'&&o.alienSkins?.ultra==='anime'?'ultraskin20':null;}
const spriteInfoBase20=spriteInfo;spriteInfo=function(row){const key={103:'wildskin20',104:'ultraskin20'}[row];return key?{...FRAMES20[key],sheet:art[key]}:spriteInfoBase20(row);};
const poseBase20=combatPose;combatPose=function(o,row,f){const key=costume20(o);if(key==='wildskin20'){const p=poseBase20(o,row,f);return {...p,row:103};}if(key==='ultraskin20'){return {row:104,f:o.attack>0?o.ultraMode==='robot'?15:o.ultraMode==='tank'?13:({3:5,4:9,5:10,6:12,7:14}[o.ultraFrame]??5):o.moving?1+Math.floor(o.anim)%3:0,lift:0};}return poseBase20(o,row,f);};
const spriteBase20=sprite;sprite=function(row,f,x,y,h,face=1,alpha=1){if(row===100&&costume20()==='wildskin20')row=103;if(row===90&&costume20()==='ultraskin20'){row=104;f=f%16;}return spriteBase20(row,f,x,y,h,face,alpha);};
const drawRemoteBase20=drawRemote;drawRemote=function(single){for(const o of single?[single]:remoteTargets()){if(costume20(o)){const p=combatPose(o,0,0);spriteBase19(p.row,p.f,o.x,o.y-p.lift,123,o.face||1);txt('J'+(Number(o.id)+1),o.x,o.y-145,9,'#bde590');}else drawRemoteBase20(o);}};
function costumeSound20(){if(!sound)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const t=audioCtx.currentTime,g=audioCtx.createGain(),o=audioCtx.createOscillator(),f=audioCtx.createBiquadFilter();f.type='bandpass';f.frequency.value=1300;f.Q.value=.9;o.type='sawtooth';o.frequency.setValueAtTime(420,t);o.frequency.exponentialRampToValueAtTime(730,t+.07);o.frequency.exponentialRampToValueAtTime(330,t+.2);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.045,t+.025);g.gain.exponentialRampToValueAtTime(.001,t+.22);o.connect(f);f.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+.23);}catch(e){}}
const attackBase20=attack;attack=function(i){const key=costume20(),before=player.cool[i],n=effects.length,part=particles.length,fx=wildFX19.length;const result=attackBase20(i);if(key&&(player.cool[i]>before||i===4&&wildForm19())){for(const p of particles.slice(part))p.color=key==='wildskin20'?'#ed79e6':'#b4ff62';for(const f of effects.slice(n)){f.costume20=key;f.color=key==='wildskin20'?'#ed79e6':'#b4ff62';}for(const f of wildFX19.slice(fx))f.moon20=key==='wildskin20';burst(player.x,player.y-65,8,key==='wildskin20'?'#ed79e6':'#b4ff62');if(key==='ultraskin20')costumeSound20();}return result;};
function saveUsage20(){try{localStorage.setItem('omni-ultra-seconds20',String(ultraSeconds20));}catch(e){}ultraSave20=0;}
const persistBase20=persistGame;persistGame=function(){saveUsage20();return persistBase20();};
const updateBase20=update;update=function(dt){const active=started&&!paused&&!cinematic&&!document.hidden;uiClock20+=dt;if(active&&race==='omni'&&player.alien&&player.activeAlien==='ultra'&&player.hp>0&&ultraSeconds20<1800){ultraSeconds20=Math.min(1800,ultraSeconds20+dt);ultraSave20+=dt;if(ultraSeconds20>=1800){player.unlockedAlienSkins.ultraAnime=true;persistGame();toast('Â¡SKIN ULTRA T Â· TECNO CHICA DESBLOQUEADA!');}else if(ultraSave20>=5)saveUsage20();}const slow=active&&race==='omni'&&!player.alien&&player.watchOpen&&!scan17&&!fieldScan18;updateBase20(slow?dt*.08:dt);if(slow)player.watchTurn=Math.max(0,player.watchTurn-dt*.92);};
window.addEventListener('pagehide',saveUsage20);document.addEventListener('visibilitychange',()=>{if(document.hidden)saveUsage20();});
const watchFaceBase20=watchFace19;watchFace19=function(c,open,id){if(open)return watchFaceBase20(c,open,id);c.clearRect(0,0,c.canvas.width,c.canvas.height);c.imageSmoothingEnabled=false;const im=player.alien?art.watchBadge20:art.watchFront20;if(im)c.drawImage(im,0,0,c.canvas.width,c.canvas.height);};
function buyWildSkin20(){if(race!=='omni'||player.unlockedAlienSkins.wildMoon||player.coins<2000)return false;player.coins-=2000;player.unlockedAlienSkins.wildMoon=true;pityState20('wildSkin').obtained=true;player.alienSkins.wildvine='moon';persistGame();return true;}
const selectSkinBase20=selectAlienSkin;selectAlienSkin=function(id,alienId='fourarms'){if(!['wildvine','ultra'].includes(alienId))return selectSkinBase20(id,alienId);const special=alienId==='wildvine'?'moon':'anime',owned=alienId==='wildvine'?player.unlockedAlienSkins.wildMoon:player.unlockedAlienSkins.ultraAnime;if(race!=='omni'||id!=='classic'&&(id!==special||!owned))return false;player.alienSkins[alienId]=id;persistGame();return true;};
const skinMenuBase20=alienSkinMenu;
alienSkinMenu=function(selected='fourarms'){if(typeof selected!=='string')selected='fourarms';if(race!=='omni')return skinMenuBase20(selected);if(!['wildvine','ultra'].includes(selected)){skinMenuBase20(selected);for(const id of ['wildvine','ultra']){const b=document.createElement('button');b.textContent=ALIENS[id].name;b.onclick=()=>alienSkinMenu(id);$('.skin-tabs')?.append(b);}if(selected==='ghost')$('#dialogbody').querySelector('p').textContent='Ghost Lady Â· drop 10 % Â· garantizada como mÃ¡ximo al intento 15. Pity: '+pityLabel20('ghostSkin',player.unlockedAlienSkins.ghostLady);return;}
 const wild=selected==='wildvine',special=wild?'moon':'anime',owned=wild?player.unlockedAlienSkins.wildMoon:player.unlockedAlienSkins.ultraAnime,left=Math.max(0,Math.ceil(1800-ultraSeconds20)),time=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');showDialog('SKINS Â· MISMO PODER',ALIENS[selected].name,wild?'<p>Lunar: drop 5 % de CarnÃ­voro o compra por 2000 monedas. Pity '+pityLabel20('wildSkin',owned)+'. Efectos magenta y animaciones propias; mismas habilidades.</p>':'<p>Tecno chica: utiliza Ultra T durante 30 minutos activos acumulados. Faltan '+time+'. El tiempo se conserva al salir, cambiar de alien o raza. Mismos ataques, efectos y poses exclusivos, voz electrÃ³nica sintÃ©tica.</p>',[['LISTO',closeDialog]]);
 const body=$('#dialogbody'),tabs=document.createElement('div');tabs.className='skin-tabs';for(const id of ['fourarms','ghost','heatblast','xlr8','wildvine','ultra']){const b=document.createElement('button');b.textContent=ALIENS[id].name;b.onclick=()=>alienSkinMenu(id);tabs.append(b);}body.prepend(tabs);const cards=document.createElement('div');cards.className='alien-skin-cards';body.append(cards);for(const [id,row,name] of [['classic',ALIENS[selected].row,'ClÃ¡sico'],[special,wild?103:104,wild?'Lunar':'Tecno chica']]){const b=document.createElement('button');b.innerHTML='<canvas width="150" height="170"></canvas><b>'+name+'</b><small>'+(id==='classic'||owned?player.alienSkins[selected]===id?'EQUIPADA':'EQUIPAR':wild?'COMPRAR Â· 2000 / DROP 5 %':'FALTAN '+time)+'</small>';cards.append(b);const {table,sheet,anchors,base}=spriteInfo(row),f=table[0],c=b.querySelector('canvas').getContext('2d');c.imageSmoothingEnabled=false;if(base){const scale=125/base,a=anchors[0];c.drawImage(sheet,...f,75+(f[0]-a[0])*scale,150+(f[1]-a[1])*scale,f[2]*scale,f[3]*scale);}else c.drawImage(sheet,...f,25,10,100,145);b.onclick=()=>{if(id!== 'classic'&&!owned){if(wild)showDialog('COMPRA ÃšNICA','Wildvine Lunar Â· 2000 monedas','<p>Saldo: '+player.coins+'.</p>',[['COMPRAR',()=>{if(buyWildSkin20())alienSkinMenu(selected);else toast('Necesitas 2000 monedas');}],['VOLVER',()=>alienSkinMenu(selected)]]);else toast('Faltan '+time+' usando Ultra T');}else if(selectAlienSkin(id,selected))alienSkinMenu(selected);};}}
const pityBar20=document.createElement('div');pityBar20.id='pitybar20';pityBar20.className='hidden';$('#hud').append(pityBar20);const slowTag20=document.createElement('div');slowTag20.id='slowtag20';slowTag20.textContent='TIEMPO LENTO Â· 8 %';slowTag20.className='hidden';$('#hud').append(slowTag20);
const hudBase20=hud;hud=function(){hudBase20();$('#carnivorebar19').classList.toggle('hidden',zone!==SWAMP20||!enemies.some(e=>e.carnivore19));if(zone===SWAMP20){const b=enemies.find(e=>e.carnivore19);if(b)$('#carnivorebar19').textContent=b.alive?'CARNÃVORO Â· NV.20 recomendado Â· '+Math.ceil(b.hp)+' / '+b.max:'CARNÃVORO Â· REAPARECE EN '+Math.ceil(player.carnivoreTimer)+' s';$('#questsub').textContent='ADN Wildvine 10 % Â· garantÃ­a 15 Â· skin 5 %';}const b=enemies.find(e=>(e.carnivore19||e.wolfBoss||e.ghostBoss)&&dist(player,e)<680),s=scanCorpses17.find(s=>s.zone===zone&&s.ttl>0&&dist(player,s)<680);pityBar20.classList.toggle('hidden',race!=='omni'||!b&&!s);if(b||s){const key=b?.carnivore19?'wild':b?.wolfBoss?'wolf':b?.ghostBoss?'ghost':s.id;pityBar20.textContent='ADN '+(key==='wild'?'Wildvine':ALIENS[key].name)+' Â· PITY '+pityLabel20(key,player[key==='wild'?'wildDNA':key+'DNA'])+(key==='wild'?' Â· SKIN '+pityLabel20('wildSkin',player.unlockedAlienSkins.wildMoon):key==='ghost'?' Â· SKIN '+pityLabel20('ghostSkin',player.unlockedAlienSkins.ghostLady):'');}slowTag20.classList.toggle('hidden',race!=='omni'||player.alien||!player.watchOpen);};
const css20=document.createElement('style');css20.textContent='#pitybar20{position:absolute;top:31%;left:25%;width:50%;text-align:center;color:#eff9c4;background:#102d28e8;border:1px solid #91b964;padding:6px;font-size:10px;pointer-events:none}#slowtag20{position:absolute;bottom:37%;left:23%;font-size:10px;color:#bdff68;text-shadow:0 2px 2px #000;pointer-events:none}';document.head.append(css20);
const pauseBase20=pauseMenu;pauseMenu=function(){pauseBase20();$('#dialogeyebrow').textContent='PARTIDA GUARDADA Â· VERSIÃ“N 0.20';};
BESTIARY18.carnivore[3]='Una planta carnÃ­vora del Pantano de LuciÃ©rnagas.';BESTIARY18.carnivore[4]+=' ADN garantizado al intento 15; skin Lunar 5 %, garantÃ­a 15, o 2000 monedas.';
if(window.__game)Object.assign(__game,{update,hud,drawScene,initProgress,persistGame,attack,combatPose,spriteInfo,sprite,drawRemote,alienSkinMenu,selectAlienSkin,pauseMenu,ghostSkinReward});
if(location.search.includes('qa=1'))window.__v20={SWAMP20,FRAMES20,pityState20,rollPity20,pityLabel20,startScan17,addScan17,defeatCarnivore19,buyWildSkin20,costume20,get ultraSeconds(){return ultraSeconds20},setUltraSeconds:s=>{ultraSeconds20=s;},get scan(){return scan17},get slowFactor(){return race==='omni'&&!player.alien&&player.watchOpen ? .08 : 1}};

const FRAMES21={"clancy21": {"table": [[0, 0, 384, 384], [384, 0, 384, 384], [768, 0, 384, 384], [1152, 0, 384, 384], [0, 384, 384, 384], [384, 384, 384, 384], [768, 384, 384, 384], [1152, 384, 384, 384], [0, 768, 384, 384], [384, 768, 384, 384], [768, 768, 384, 384], [1152, 768, 384, 384]], "anchors": [[192.0, 372], [576.0, 372], [960.0, 372], [1344.0, 372], [192.0, 756], [576.0, 756], [960.0, 756], [1344.0, 756], [192.0, 1140], [576.0, 1140], [960.0, 1140], [1344.0, 1140]], "base": 192}, "wasp21": {"table": [[0, 0, 384, 384], [384, 0, 384, 384], [768, 0, 384, 384], [1152, 0, 384, 384], [0, 384, 384, 384], [384, 384, 384, 384], [768, 384, 384, 384], [1152, 384, 384, 384], [0, 768, 384, 384], [384, 768, 384, 384], [768, 768, 384, 384], [1152, 768, 384, 384]], "anchors": [[192.0, 372], [576.0, 372], [960.0, 372], [1344.0, 372], [192.0, 756], [576.0, 756], [960.0, 756], [1344.0, 756], [192.0, 1140], [576.0, 1140], [960.0, 1140], [1344.0, 1140]], "base": 192}, "buildings21": {"table": [[12, 84, 360, 288], [396, 78, 360, 294], [780, 98, 360, 274], [1164, 67, 360, 305], [12, 467, 360, 289], [396, 463, 360, 293], [780, 464, 360, 292], [1164, 462, 360, 294], [12, 836, 360, 304], [396, 848, 360, 292], [780, 851, 360, 289], [1164, 837, 360, 303], [12, 1246, 360, 278], [396, 1239, 360, 285], [780, 1236, 360, 288], [1164, 1239, 360, 285]]}, "cityPeople21": {"table": [[21, 12, 149, 168], [206, 12, 164, 168], [411, 12, 138, 168], [619, 12, 105, 168], [12, 204, 168, 168], [204, 204, 168, 168], [407, 204, 145, 168], [625, 204, 93, 168], [30, 396, 131, 168], [204, 396, 168, 168], [411, 396, 137, 168], [625, 396, 94, 168], [12, 588, 168, 168], [204, 588, 168, 168], [396, 588, 168, 168], [625, 588, 94, 168], [59, 780, 73, 168], [204, 780, 168, 168], [396, 780, 168, 168], [613, 780, 117, 168], [54, 972, 84, 168], [204, 985, 168, 155], [396, 988, 168, 152], [621, 972, 101, 168]]}, "cityProps21": {"table": [[12, 22, 232, 222], [268, 36, 232, 208], [524, 33, 232, 211], [780, 23, 232, 221], [21, 268, 213, 232], [268, 274, 232, 226], [524, 272, 232, 228], [795, 268, 202, 232], [12, 537, 232, 219], [268, 537, 232, 219], [524, 533, 232, 223], [780, 556, 232, 200]]}};
// OMNI 0.23 â€” continuous Bellwood, authoritative swarm encounter and story replays.
const CITY21=REGIONS.length,CITY_W21=6400,CITY_H21=3600;
const districtNames21=['Barrio del rÃ­o','Apartamentos antiguos','Centro cÃ­vico','Torres del centro','Entrada de Bellwood','Parque vecinal','Mercado urbano','Mr. Smoothy','Avenida comercial','Distrito industrial'];
const buildings21=[],districts21=[];
for(let row=0;row<2;row++)for(let col=0;col<5;col++){const i=row*5+col,x=200+col*1200,y=220+row*1500;districts21.push({id:i,name:districtNames21[i],x,y,w:1200,h:1500});for(let n=0;n<4;n++){let frame=(i*3+n)%16;if(i===7&&n===0)frame=8;if(i===1&&n===2)frame=10;const b={id:i*4+n,frame,x:x+230+(n%2)*430,y:y+250+Math.floor(n/2)*620,w:350,h:frame<4?520:frame===8?350:430};buildings21.push(b);}}
REGIONS.push({id:'bellwoodOpen21',name:'Ciudad Bellwood',subtitle:'Diez sectores continuos Â· calles, trÃ¡fico y Clancy',minX:40,maxX:6360,top:40,bottom:3560,exitY:1720,portalX:6200,color:'#b2e6be',city:true,colliders:buildings21.map(b=>({x:b.x,y:b.y,w:b.w,h:b.h})),spawns:[],links:{right:0},worldW:CITY_W21,worldH:CITY_H21});REGIONS[0].links.left=CITY21;
let cars21=[],intro21=null,cityTime21=8*3600,miniTick21=-100;
function cityBounds21(){WW=zone===CITY21?CITY_W21:1600;WH=zone===CITY21?CITY_H21:900;}
function nearParty21(o,r=1400){return teamTargets().some(p=>p.alive!==false&&Math.hypot(p.x-o.x,p.y-o.y)<r);}
function visible21(o,pad=220){return o.x+(o.w||0)>cam.x-pad&&o.x<cam.x+W/sceneZoom()+pad&&o.y+(o.h||0)>cam.y-pad&&o.y<cam.y+H/sceneZoom()+pad;}
function drawCityFrame21(c,key,frame,x,y,w,h,face=1){const d=FRAMES21[key],f=d.table[frame%d.table.length],im=art[key];c.save();c.translate(x+w/2,y+h);c.scale(face,1);c.drawImage(im,...f,-w/2,-h,w,h);c.restore();}
const spriteInfoBase21=spriteInfo;spriteInfo=function(row){const key={105:'clancy21',106:'wasp21'}[row];return key?{...FRAMES21[key],sheet:art[key]}:spriteInfoBase21(row);};
function drawCityScene21(c,preview=false){const bx=preview?0:Math.max(0,cam.x-120),by=preview?0:Math.max(0,cam.y-120),bw=preview?CITY_W21:W/sceneZoom()+240,bh=preview?CITY_H21:H/sceneZoom()+240;
 c.fillStyle='#677b58';c.fillRect(0,0,CITY_W21,CITY_H21);c.fillStyle='#aeb6aa';for(const d of districts21){if(!preview&&!visible21(d,80))continue;c.fillRect(d.x+125,d.y+125,950,1250);c.fillStyle=d.id===5?'#6c925b':'#c2c4b5';c.fillRect(d.x+155,d.y+155,890,1190);c.fillStyle='#aeb6aa';}
 for(let i=0;i<6;i++){const x=200+i*1200;if(x<bx-150||x>bx+bw+150)continue;c.fillStyle='#343d45';c.fillRect(x-105,40,210,3520);c.fillStyle='#d4d9ca';c.fillRect(x-112,40,7,3520);c.fillRect(x+105,40,7,3520);c.fillStyle='#dab85c';for(let y=Math.floor(by/90)*90;y<by+bh;y+=90)c.fillRect(x-2,y,4,42);}
 for(let i=0;i<3;i++){const y=220+i*1500;if(y<by-150||y>by+bh+150)continue;c.fillStyle='#343d45';c.fillRect(40,y-105,6320,210);c.fillStyle='#d4d9ca';c.fillRect(40,y-112,6320,7);c.fillRect(40,y+105,6320,7);c.fillStyle='#dab85c';for(let x=Math.floor(bx/90)*90;x<bx+bw;x+=90)c.fillRect(x,y-2,42,4);}
 for(let i=0;i<6;i++)for(let j=0;j<3;j++){const x=200+i*1200,y=220+j*1500;if(!preview&&!visible21({x:x-140,y:y-140,w:280,h:280},0))continue;c.fillStyle='#343d45';c.fillRect(x-105,y-105,210,210);c.fillStyle='#d9ddd1';for(let n=0;n<7;n++){c.fillRect(x-83+n*25,y-135,12,28);c.fillRect(x-83+n*25,y+107,12,28);c.fillRect(x-135,y-83+n*25,28,12);c.fillRect(x+107,y-83+n*25,28,12);}}
 for(const b of buildings21)if(preview||visible21(b,0)){c.fillStyle='#16252940';c.fillRect(b.x+12,b.y+12,b.w,b.h);drawCityFrame21(c,b.bouman28?'props28':b.smoothy22?'smoothy22':'buildings21',b.bouman28?1:b.smoothy22?0:b.frame,b.x,b.y,b.w,b.h);}
 for(const d of districts21){if(!preview&&!visible21(d,0))continue;for(const n of [0,1,2]){const x=d.x+160+n*410,y=d.y+145;drawCityFrame21(c,'cityProps21',10,x-24,y-65,48,70);}for(const side of [0,1])drawCityFrame21(c,'cityProps21',9,d.x+105+side*950,d.y+70,32,90);if(d.id===5)drawCityFrame21(c,'cityProps21',11,d.x+720,d.y+1050,145,80);if(d.id===5)for(let n=0;n<5;n++)drawCityFrame21(c,'cityProps21',10,d.x+170+n*160,d.y+700,100,125);}
 if(preview||visible21({x:5940,y:1450,w:200,h:170},0))drawCityFrame21(c,'cityProps21',8,5940,1450,200,170);
 c.fillStyle='#52664b';c.fillRect(0,0,CITY_W21,32);c.fillRect(0,0,32,CITY_H21);c.fillRect(0,CITY_H21-32,CITY_W21,32);c.fillRect(CITY_W21-32,0,32,CITY_H21);
}
const drawSceneBase21=drawScene;drawScene=function(c,z,day){if(z===CITY21)return drawCityScene21(c,c!==ctx);return drawSceneBase21(c,z,day);};
const mapPaintBase21=mapPaint;mapPaint=function(c,z,w,h,detail=false){if(z!==CITY21){const ow=WW,oh=WH;WW=1600;WH=900;try{return mapPaintBase21(c,z,w,h,detail);}finally{WW=ow;WH=oh;}}c.clearRect(0,0,w,h);c.save();c.scale(w/CITY_W21,h/CITY_H21);drawCityScene21(c,true);c.fillStyle='#d6edc3';for(const d of districts21){c.font='bold 55px monospace';c.textAlign='center';c.fillText(String(d.id+1),d.x+600,d.y+150);}c.fillStyle='#ff756e';c.beginPath();c.arc(3800,1720,60,0,Math.PI*2);c.fill();if(zone===CITY21){c.fillStyle='#caff71';c.beginPath();c.arc(player.x,player.y,55,0,Math.PI*2);c.fill();}c.restore();};
function clockLabel21(){const t=Math.floor(cityTime21)%86400;return String(Math.floor(t/3600)).padStart(2,'0')+':'+String(Math.floor(t%3600/60)).padStart(2,'0');}
function nightPower21(){const h=cityTime21/3600%24;if(h>=8&&h<17)return 0;if(h>=17&&h<20)return (h-17)/3;if(h>=5&&h<8)return (8-h)/3;return 1;}
function cityLights21(){if(zone!==CITY21)return;const n=nightPower21();if(n<=0)return;ctx.fillStyle='rgba(7,16,44,'+(n*.65)+')';ctx.fillRect(cam.x-20,cam.y-20,W/sceneZoom()+40,H/sceneZoom()+40);for(const d of districts21)for(const side of [0,1]){const x=d.x+120+side*950,y=d.y+145;if(!visible21({x:x-120,y:y-90,w:240,h:160},0))continue;const g=ctx.createRadialGradient(x,y,5,x,y,120);g.addColorStop(0,'rgba(255,228,149,'+n*.28+')');g.addColorStop(1,'rgba(255,228,149,0)');ctx.fillStyle=g;ctx.fillRect(x-120,y-120,240,240);}for(const b of buildings21)if(visible21(b,0)){ctx.fillStyle='rgba(255,220,126,'+n*.18+')';for(let k=0;k<3;k++)ctx.fillRect(b.x+40+k*95,b.y+b.h*.55,25,35);}}
function cityPersonFrame21(c){return c.person21*4+(Math.floor(c.anim||0)%4);}
function drawCityPerson21(c){drawCityFrame21(ctx,'cityPeople21',cityPersonFrame21(c),c.x-33,c.y-98,66,98,c.face||1);}
function seedPeople21(){if(zone!==CITY21||net.role==='guest')return;const saved=civilStates.bellwoodOpen21||[];if(saved.length===40&&saved.every(c=>c.population22===2)){citizens=saved;return;}const old=new Map(saved.map(c=>[c.id,c]));citizens=[];for(const d of districts21)for(let n=0;n<8;n+=2){const route=[[d.x+150,d.y+150],[d.x+1050,d.y+150],[d.x+1050,d.y+1350],[d.x+150,d.y+1350]],lengths=[900,1200,900,1200];let phase=(n/8+d.id*.017)%1*4200,way=0;while(phase>lengths[way]){phase-=lengths[way];way++;}const start=route[way],end=route[(way+1)%4],ratio=phase/lengths[way],x=start[0]+(end[0]-start[0])*ratio,y=start[1]+(end[1]-start[1])*ratio,id='citizen21-'+d.id+'-'+n,person=(d.id*5+n)%12,prior=old.get(id);citizens.push({id,kind:'civil',city21:true,population22:2,person21:person,route21:route,way21:(way+1)%4,x,y,homeX:x,homeY:y,hp:prior?.hp??70,max:70,alive:prior?.alive??true,face:end[0]<start[0]?-1:1,anim:0,step22:0,moving:false,inv:0,fear:0,wait:0,respawn:prior?.respawn??0,height22:person>=10?86:96});}civilStates.bellwoodOpen21=citizens;}

const citizensBase21=ensureCitizens;ensureCitizens=function(){if(zone===CITY21){seedPeople21();return;}return citizensBase21();};
const updateCitizensBase21=updateCitizens;updateCitizens=function(dt){if(zone!==CITY21)return updateCitizensBase21(dt);if(net.role==='guest')return;for(const c of citizens){c.moving=false;if(!nearParty21(c,1250))continue;c.inv=Math.max(0,c.inv-dt);c.fear=Math.max(0,c.fear-dt);if(!c.alive){c.respawn-=dt;if(c.respawn<=0){c.alive=true;c.hp=c.max;c.x=c.homeX;c.y=c.homeY;}continue;}const p=c.route21[c.way21],d=Math.hypot(p[0]-c.x,p[1]-c.y);if(d<3){c.x=p[0];c.y=p[1];c.way21=(c.way21+1)%4;continue;}const oldX=c.x,oldY=c.y,speed=c.fear>0?85:40+(c.person21%4)*2,step=Math.min(d,speed*dt);if(Math.abs(p[0]-c.x)>2){const dx=Math.sign(p[0]-c.x)*Math.min(step,Math.abs(p[0]-c.x));moveActor(c,dx,0);c.face=dx>=0?1:-1;}else moveActor(c,0,Math.sign(p[1]-c.y)*Math.min(step,Math.abs(p[1]-c.y)));const walked=Math.hypot(c.x-oldX,c.y-oldY);c.moving=walked>.005;c.step22=(c.step22||0)+walked;c.anim=c.step22/10;}}

function seedCars21(){if(cars21.length)return;for(const d of districts21)for(let n=0;n<2;n++){const r=[[d.x+40,d.y+45],[d.x+1160,d.y+45],[d.x+1160,d.y+1455],[d.x+40,d.y+1455]],p=r[(d.id+n)%4];cars21.push({id:'car21-'+d.id+'-'+n,frame:(d.id+n)%4*2,x:p[0],y:p[1],angle:0,route:r,way:((d.id+n)%4+1)%4,speed:82+n*13,wait:0});}}
function updateCars21(dt){if(net.role==='guest')return;seedCars21();for(const c of cars21){if(!nearParty21(c,1400))continue;if(c.wait>0){c.wait-=dt;continue;}const p=c.route[c.way],d=Math.hypot(p[0]-c.x,p[1]-c.y);if(d<12){c.way=(c.way+1)%4;c.wait=.8;continue;}if(teamTargets().some(t=>dist(c,t)<80))continue;c.angle=Math.atan2(p[1]-c.y,p[0]-c.x);const step=Math.min(d,c.speed*dt);c.x+=Math.cos(c.angle)*step;c.y+=Math.sin(c.angle)*step;c.wheel22=(c.wheel22||0)+step*.14;}}
function drawCars21(){if(zone!==CITY21)return;for(const c of cars21){if(!visible21({x:c.x-70,y:c.y-70,w:140,h:140},0))continue;const vertical=Math.abs(Math.sin(c.angle))>.7;ctx.save();ctx.translate(c.x,c.y);ctx.fillStyle='#06132044';ctx.fillRect(vertical?-26:-50,vertical?-52:-22,vertical?52:100,vertical?104:44);if(vertical){if(Math.sin(c.angle)>0)ctx.rotate(Math.PI);drawCityFrame21(ctx,'cityProps21',c.frame+1,-28,-54,56,108);}else drawCityFrame21(ctx,'cityProps21',c.frame,-55,-30,110,60,Math.cos(c.angle)<0?-1:1);ctx.restore();if(nightPower21()>.3){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.angle);ctx.fillStyle='#ffeaa84a';ctx.beginPath();ctx.moveTo(47,-18);ctx.lineTo(120,-35);ctx.lineTo(120,35);ctx.lineTo(47,18);ctx.closePath();ctx.fill();ctx.restore();}}}

const initBase21=initProgress;initProgress=function(){cityBounds21();initBase21();player.clancy21=Object.assign({state:'new',completions:0,rewarded:false,run:null,receipts:[]},player.clancy21||{});player.clancy21.receipts=player.clancy21.receipts||[];for(const [id,q] of [['story',player.story],['story2',player.story2],['story3',player.story3]]){q.rewarded21=q.rewarded21===true||(id==='story'?q.completions>0:q.state==='complete');q.completions21=Math.max(q.completions21||0,q.rewarded21?1:0);if(q.rewarded21)q.reward=0;}cityTime21=Number.isFinite(player.cityTime21)?player.cityTime21:8*3600;intro21=null;cars21=[];if(zone===CITY21){seedPeople21();seedCars21();}cityBounds21();};
const enterBase21=enterZone;enterZone=function(next,side){const ow=WW,oh=WH;WW=next===CITY21?CITY_W21:1600;WH=next===CITY21?CITY_H21:900;const ok=enterBase21(next,side);if(!ok){WW=ow;WH=oh;return false;}cityBounds21();intro21=null;if(next===CITY21){seedPeople21();seedCars21();ensureClancy21();}return ok;};
const persistBase21=persistGame;persistGame=function(){player.cityTime21=cityTime21;return persistBase21();};
function activeClancy21(){const list=[];if(player.clancy21?.state==='active'&&player.level>=35)list.push({id:0,x:player.x,y:player.y,run:player.clancy21.run});for(const o of remoteTargets())if(o.level>=35&&o.clancyState21==='active')list.push({id:Number(o.id),x:o.x,y:o.y,run:o.clancyRun21});return list;}
function ensureClancy21(){if(zone!==CITY21||net.role==='guest')return null;const party=activeClancy21();if(!party.length)return enemies.find(e=>e.clancy21)||null;let b=enemies.find(e=>e.clancy21);if(b?.alive){for(const p of party)b.participants21[p.id]=p.run;return b;}if(b&&!party.some(p=>b.participants21?.[p.id]!==p.run))return b;for(let i=enemies.length-1;i>=0;i--)if(enemies[i].clancy21||enemies[i].wasp21)enemies.splice(i,1);b={id:'clancy21',kind:'enemy',clancy21:true,majorBoss:true,x:3800,y:1720,homeX:3800,homeY:1720,hp:4000,max:4000,alive:true,face:-1,anim:0,hit:0,stun:0,moving:false,pushCD21:2,summonCD21:0,cast21:null,wave21:0,waveAlive21:false,introDone21:false,participants21:Object.fromEntries(party.map(p=>[p.id,p.run])),token21:String(Date.now())+'-'+Math.floor(random17()*1e9)};enemies.push(b);zoneStates.bellwoodOpen21=enemies;return b;}
function summonWasps21(b){if(!b.alive||enemies.some(e=>e.wasp21&&e.alive))return;for(let i=enemies.length-1;i>=0;i--)if(enemies[i].wasp21)enemies.splice(i,1);b.wave21++;const points=[[-120,-30],[-80,80],[0,110],[80,80],[120,-30],[0,-110]];for(const [i,p] of points.entries())enemies.push({id:'wasp21-'+b.wave21+'-'+i,kind:'enemy',wasp21:true,x:b.x+p[0],y:b.y+p[1],homeX:b.x+p[0],homeY:b.y+p[1],hp:500,max:500,alive:true,face:1,anim:i,hit:0,stun:0,moving:true,shotCD21:2+i*.4,sting21:null,biteCD21:2+i*.2});b.waveAlive21=true;b.summonCD21=0;burst(b.x,b.y-65,30,'#b9df67');save();}
function pushAvatar21(t,b){const dx=t.x-b.x,dy=t.y-b.y,d=Math.max(1,Math.hypot(dx,dy));if(t.kind==='remote'){lanSend({type:'push21',to:t.id,zone:CITY21,x:b.x,y:b.y,damage:18});return;}moveActor(player,dx/d*230,dy/d*230);hitPlayer(18);}
function clancyVictory21(token){const q=player.clancy21;if(q.state!=='active'||q.receipts.includes(token))return false;q.receipts.push(token);q.receipts=q.receipts.slice(-10);q.state='return';persistGame();toast('Clancy derrotado Â· regresa con Ten');return true;}
const damageEnemyBase21=damageEnemy;damageEnemy=function(e,d){if(!e.clancy21&&!e.wasp21)return damageEnemyBase21(e,d);if(!e.alive)return;e.hp=Math.max(0,e.hp-Math.round(d));e.hit=.18;popup(e.x,e.y-(e.clancy21?140:85),String(Math.round(d)));if(e.hp>0)return;e.alive=false;e.cast21=null;e.sting21=null;if(e.clancy21){for(const w of enemies)if(w.wasp21)w.alive=false;intro21=null;clancyVictory21(e.token21);if(net.role==='host')lanSend({type:'clancyVictory21',zone:CITY21,token:e.token21});burst(e.x,e.y-65,40,'#c6e6a3');}save();};
function updateClancy21(dt){if(zone!==CITY21||net.role==='guest')return;const b=ensureClancy21();if(!b?.alive)return;b.hit=Math.max(0,b.hit-dt);b.stun=Math.max(0,b.stun-dt);b.pushCD21=Math.max(0,b.pushCD21-dt);if(b.waveAlive21&&!enemies.some(e=>e.wasp21&&e.alive)){b.waveAlive21=false;b.summonCD21=30;}if(!b.waveAlive21)b.summonCD21=Math.max(0,b.summonCD21-dt);const t=teamTargets().filter(p=>p.alive!==false).sort((a,c)=>dist(a,b)-dist(c,b))[0]||player,d=dist(t,b);b.face=t.x>=b.x?1:-1;if(b.cast21){const f=b.cast21;f.t-=dt;if(!f.hit&&f.t<=.25){f.hit=true;if(f.kind==='summon')summonWasps21(b);else for(const p of teamTargets())if(dist(p,b)<190&&lineClear(b.x,b.y,p.x,p.y))pushAvatar21(p,b);}if(f.t<=0)b.cast21=null;}else if(d<180&&b.pushCD21<=0){b.pushCD21=4;b.cast21={kind:'push',t:.8,max:.8,hit:false};}else if(d<900&&!b.waveAlive21&&b.summonCD21<=0){b.cast21={kind:'summon',t:1.8,max:1.8,hit:false};}
 for(const w of enemies){if(!w.wasp21||!w.alive||!nearParty21(w,1100))continue;w.hit=Math.max(0,w.hit-dt);w.stun=Math.max(0,w.stun-dt);w.shotCD21=Math.max(0,w.shotCD21-dt);w.biteCD21=Math.max(0,w.biteCD21-dt);w.anim+=dt*12;const p=teamTargets().filter(t=>t.alive!==false).sort((a,b)=>dist(a,w)-dist(b,w))[0]||player,dd=dist(p,w);w.face=p.x>=w.x?1:-1;w.moving=false;if(w.sting21){w.sting21.t-=dt;if(!w.sting21.hit&&w.sting21.t<.12){w.sting21.hit=true;hostileShots.push({type:'green',wasp21:true,x:w.x,y:w.y-35,dx:Math.cos(w.sting21.a)*300,dy:Math.sin(w.sting21.a)*300,t:2.5,r:7,damage:22});}if(w.sting21.t<=0)w.sting21=null;continue;}if(w.stun>0)continue;if(dd<480&&w.shotCD21<=0&&lineClear(w.x,w.y,p.x,p.y)){w.shotCD21=4.5;w.sting21={t:.7,max:.7,a:Math.atan2(p.y-w.y,p.x-w.x),hit:false};}else if(dd<80&&w.biteCD21<=0){w.biteCD21=3;hurtTeam(p,16);}else if(dd>155){moveActor(w,(p.x-w.x)/Math.max(1,dd)*135*dt,(p.y-w.y)/Math.max(1,dd)*135*dt);w.moving=true;}}
}
function drawClancy21(b){const frame=b.cast21?(b.cast21.kind==='push'?(b.cast21.hit?9:8):4+Math.min(3,Math.floor((1-b.cast21.t/b.cast21.max)*4))):0;sprite(105,frame,b.x,b.y,125,b.face,b.hit>0?.6:1);txt('CLANCY Â· NV.35',b.x,b.y-152,11,'#d2e49d');ctx.fillStyle='#203128';ctx.fillRect(b.x-75,b.y-145,150,6);ctx.fillStyle='#b5d986';ctx.fillRect(b.x-75,b.y-145,150*b.hp/b.max,6);if(b.cast21){ctx.strokeStyle='#e7d97c';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(b.x,b.y,b.cast21.kind==='push'?190:120,45,0,0,Math.PI*2);ctx.stroke();txt(b.cast21.kind==='push'?'Â¡EMPÃšJE!':'INVOCANDO AVISPAS',b.x,b.y-175,10,'#ffe38c');}}
function drawWasp21(w){const f=w.sting21?(w.sting21.hit?6:4+Math.min(1,Math.floor((1-w.sting21.t/w.sting21.max)*2))):Math.floor(w.anim)%4;sprite(106,f,w.x,w.y-12-Math.sin(clock*8+w.anim)*4,83,w.face,w.hit>0?.55:1);if(w.hp<w.max){ctx.fillStyle='#182b25';ctx.fillRect(w.x-25,w.y-105,50,4);ctx.fillStyle='#c6da70';ctx.fillRect(w.x-25,w.y-105,50*w.hp/w.max,4);}if(w.sting21&&!w.sting21.hit)txt('!',w.x,w.y-110,14,'#ffe086');}
function drawSting21(c,p){c.save();c.translate(p.x,p.y);c.rotate(Math.atan2(p.dy,p.dx));c.fillStyle='#759d3d';c.beginPath();c.moveTo(18,0);c.lineTo(-10,-5);c.lineTo(-7,0);c.lineTo(-10,5);c.closePath();c.fill();c.fillStyle='#e4ff84';c.fillRect(-8,-1,18,2);c.restore();}
function introStart21(b){intro21={t:5,max:5,x:b.x,y:b.y,startX:cam.x,startY:cam.y};b.introDone21=true;resetInput();}
function introUpdate21(dt){if(!intro21)return false;if(net.role!=='guest')intro21.t=Math.max(0,intro21.t-dt);else intro21.t=Math.max(0,intro21.t-dt);const p=1-intro21.t/intro21.max,targetX=clamp(intro21.x-W/sceneZoom()*.5,0,cameraMaxX()),targetY=clamp(intro21.y-H/sceneZoom()*.55,0,cameraMaxY());cam.x+=(targetX-cam.x)*Math.min(1,dt*3);cam.y+=(targetY-cam.y)*Math.min(1,dt*3);resetInput();player.moving=false;hud();if(intro21.t<=0){intro21=null;cam.x=clamp(player.x-W*.48/sceneZoom(),0,cameraMaxX());cam.y=(zone===CITY21?cityCameraY22():clamp(player.y-H*.61/sceneZoom(),0,cameraMaxY()));}return true;}
const updateBase21=update;update=function(dt){if(zone===CITY21&&started&&!paused&&!cinematic&&!document.hidden){if(introUpdate21(dt))return;const b=ensureClancy21();if(b?.alive&&!b.introDone21&&activeClancy21().some(p=>dist(p,b)<650)){introStart21(b);return;}if(net.role!=='guest'){cityTime21=(cityTime21+dt*144)%86400;updateCars21(dt);}const scaled=race==='omni'&&!player.alien&&player.watchOpen?dt*.08:dt;updateClancy21(scaled);}updateBase21(dt);};
const drawBase21=draw;draw=function(){drawBase21();if(intro21){ctx.save();ctx.fillStyle='#030708e6';ctx.fillRect(0,0,W,65);ctx.fillRect(0,H-80,W,80);txt('CLANCY Â· EL CONTROLADOR DE INSECTOS',W/2,34,18,'#d3ef9d');txt(intro21.t>2.5?'Â«Nos quieren echar de nuestra casa... Bellwood pagarÃ¡.Â»':'Seis avispas protegen a Clancy. AlÃ©jate cuando prepare el empuje.',W/2,H-46,12,'#e3e8ca');txt('DOBLE TOQUE PARA SALTAR',W/2,H-18,9,'#a5c39c');ctx.restore();}};
let lastIntroTap21=0;canvas.addEventListener('pointerdown',()=>{if(!intro21)return;const now=performance.now();if(now-lastIntroTap21<400){if(net.role==='guest')lanSend({type:'skipClancy21',zone:CITY21});else intro21.t=0;}lastIntroTap21=now;});
function nearTen21(){return zone===9&&dist(player,ten)<140;}
function startClancy21(){const q=player.clancy21;if(!nearTen21()||player.level<35||q.completions>=2||['active','return'].includes(q.state))return false;q.state='active';q.run=String(Date.now())+'-'+Math.floor(random17()*1e9);q.intro=false;if(net.role==='guest')lanSend({type:'clancyStart21',zone:9,run:q.run});closeDialog();persistGame();toast('Clancy Â· entra a Bellwood desde las Ruinas del Pilar Â· busca la avenida central');return true;}
function claimClancy21(){const q=player.clancy21;if(!nearTen21()||q.state!=='return'||q.completions>=2)return false;const gain=q.rewarded?0:Math.max(0,Math.min(2,40-player.level));if(gain){const ratio=player.xp/xpNeed();player.level+=gain;player.points+=gain;player.xp=player.level===100?0:Math.floor(ratio*xpNeed());burst(player.x,player.y-40,35,'#c3ff8a');tone(880,.25);}q.rewarded=true;q.completions++;q.state=q.completions>=2?'complete':'done';closeDialog();persistGame();toast(gain?'Clancy completado Â· +'+gain+' niveles': 'RepeticiÃ³n completada Â· sin EXP');return true;}
function clancyTalk21(){const q=player.clancy21;showDialog('TEN Â· HISTORIA 04 Â· NIVEL 35','El enjambre de Bellwood','<p>Â«Clancy controla insectos y ha tomado la avenida central. La demoliciÃ³n de su edificio lo enfureciÃ³. Sus avispas mutantes atacan a los vecinos. Necesito que lo detengas.Â»</p><p>Clancy: 4000 vida Â· seis avispas de 500 vida. Lanzan aguijones venenosos. El empuje de Clancy impide quedarse pegado a Ã©l. Tras eliminar las seis, tarda 30 segundos en invocar otra oleada.</p><p>Entrada: al oeste de las Ruinas del Pilar. Busca la intersecciÃ³n del centro de Bellwood.</p><p>'+(q.state==='return'?'Victoria confirmada Â· cobra con Ten.':q.state==='active'?'MisiÃ³n activa Â· puedes volver a intentarlo si caes.':q.completions>=2?'Primera victoria y Ãºnica repeticiÃ³n completadas.':q.rewarded?'Una repeticiÃ³n disponible Â· sin experiencia.':'+2 niveles y +2 puntos al cobrar por primera vez, hasta el mÃ¡ximo de nivel 40.')+'</p>',[...(q.state==='return'&&nearTen21()?[['COBRAR',claimClancy21]]:[]),...(nearTen21()&&player.level>=35&&q.completions<2&&!['active','return'].includes(q.state)?[['ACEPTAR',startClancy21]]:[]),['VOLVER',chaptersMenu]]);}
function storyObject21(id){return player[['story','story2','story3'][id]];}
function canReplayChapter21(id){const q=storyObject21(id);return nearTen21()&&!['active','return'].includes(q.state)&&player.level>=[1,20,30][id]&&(id===0||id===1&&player.story.rewarded21||id===2&&player.story2.rewarded21);}
function resetChapterWorld21(id){const regionId=['devastated','animoLab','magicSchool'][id];if(id===0){player.robotTimer=0;for(const pool of Object.values(zoneStates))for(let i=pool.length-1;i>=0;i--)if(pool[i].robotBoss)pool.splice(i,1);}else delete zoneStates[regionId];}
function startChapter21(id){if(!canReplayChapter21(id))return false;const q=storyObject21(id);q.state='active';q.repeat21=!!q.rewarded21;q.reward=q.repeat21?0:Math.round(xpNeed()*(id===2?.5:.9));if(id===1)q.kills=[];if(net.role==='guest')lanSend({type:'chapterStart21',chapter:id,zone:9});else resetChapterWorld21(id);closeDialog();persistGame();toast('CapÃ­tulo '+(id+1)+' aceptado'+(q.repeat21?' Â· repeticiÃ³n sin EXP':''));return true;}
function claimChapter2ßMvÓ]›Ê×¬¢h­µç[œÝÙ^OTÝš[™Ê\X\˜[˜ÙM
ÊJNÜ™]\›ˆØ[Ð]\ÌM–ÚÙ^WOÚÙ^N›[ßB™[˜Ý[ÛˆØ[Ñ\ŒMŠËÙ^J^ÚYŠÙ^KœÝ\ÕÚ]
	ÜÞ\ÉÊJ^ØÛÛœÝS[X™\‹š\Ñš[š]JË™
OÛË™ŠË™˜XÙ_JKO[Ë™_Ü™]\›ˆX]˜XœÊJO“X]˜XœÊ
OÙOÉØ˜XÚÉÎ‰Ùœ›Û	Î™ÉÛY	Î‰ÜšYÚ	Îß\™]\›ˆËØ[Ñ\OOIØ˜XÚÉÏÉØ˜XÚÉÎ›ËØ[Ñ\OOIÙœ›Û	ÏÉÙœ›Û	Î–ÉÙÝÛ“Y	Ë	ÙÝÛ”šYÚ	×Kš[˜ÛY\ÊËØ[Ñ\
OÉÙXYÛÛ˜[	Î›Ë™˜XÙOÉÛY	Î‰ÜšYÚ	ÎßB™[˜Ý[ÛˆØ[Ô[ŒMŠËÙ^J^ØÛÛœÝO]Ø[Ð]\ÌM–ÚÙ^WK\]Ø[Ñ\ŒMŠËÙ^JK\ÝXK™\œÖÙ\—_K™\œÖÙ\OOIÛY	ÏÉÜšYÚ	Î™\OOIÙXYÛÛ˜[	ÏÉÙœ›Û	Î™\—NÚYŠ[\Ý
\™]\›ˆ[ØÛÛœÝ[\Ý›[™ÝÝ\X˜\ÙQ›Ü›LMŠÊOÝØ[Ñœ˜[YLMŠË‹X]™›ÛÜŠ
Ë˜[š[_
JŒKJI[ŠN“X]™›ÛÜŠ
Ë˜[š[_
JŒKJI[ŽØÛÛœÝÜ]XKœÜ]	‰Š\OOIÙœ›Û	ß\OOIØ˜XÚÉÊKÝÙ\\Ü]Û\ÝÜÝ\	L—N›\ÝÜÝ\NÜ™]\›ˆØK\‹Ý\Ü›\ÝÜÝ\KÝÙ\‹Z\œ›Ü“YÜÎœÜ]	‰œÝ\L‹›\˜K›Z\œ›Ü”šYÚÙ\OOIÜšYÚ	Î™\OOIÛY	ßËØ[Ñ\OOIÙÝÛ“Y	ßNßB™[˜Ý[ÛˆZ[Ø[ÌMŠÏ\^Y\Š^ÚYŠY^[™YØ[ÌMŸ[Ë›[Ýš[™ßÜXÚX[ÜÙM
Ê_ËœÞ\Ý[LMË˜[š[X][ÛŸËœÞ\Ý[LMË˜›ÝÏŒËœÞ\Ý[LMËœÝYÙOOOM
\™]\›ˆ˜[ÙNØÛÛœÝÙ^O]Ø[ÒÙ^LMŠÊK[O]Ø[Ò[XYÙ\ÌM‹™Ù]
Ù^JNÚYŠZ[OËœ™XYLMŠ\™]\›ˆ˜[ÙNØÛÛœÝ]Ø[Ô[ŒMŠËÙ^JNÚYŠ\
\™]\›ˆ˜[ÙNØÛÛœÝZÙ^KœÝ\ÕÚ]
	ÜÞ\ÉÊOÌLLŽšZYÚ
[X™\ŠÙ^JKÊKØØ[OZÜ˜KšZYÚÂˆÛÛœÝ[OJK™Y›XÝY˜[ÙJOOžØÛÛœÝ\˜K™œ˜[Y\ÖÚWNØÝœØ]™J
NÚYŠ™Y›XÝ
XÝœØØ[JLKJNØÝ™˜]Ò[XYÙJ[K‹‹™‹œ‹Y‹˜[˜ÚÜŠœØØ[KY‹™›ÛÝ
œØØ[K‹œ–Ì—JœØØ[K‹œ–Ì×JœØØ[JNØÝœ™\ÝÜ™J
NßNÂˆÝœØ]™J
NØÝ˜[œÛ]JËžËžJNØÝœØØ[J™›\ËLNŒKJNØÝš[XYÙTÛ[ÛÝ[™Ñ[˜X›YY˜[ÙNØÝ™ÛØ˜[[O[Ëš[Œ	‰“X]™›ÛÜŠÛØÚÊŒLŠILOOLËŽŒNÂˆYŠ›Z\œ›Ü“YÜß›ÝÙ\ˆOO\Ü
^ØÛÛœÝÝ]KZ
ŠKJÙ^OOOIÌML‰ÏËÍœ˜K˜Ý]
JKYÕÏZ
ŠÙ^OOOIÌML	ÏËŒMŽšÙ^OOOIÌML‰ÏËŒN‹ŒŒÊNØÝœØ]™J
NØÝ˜™YÚ[”]

NØÝœ™XÝ
Z
Œ‹Z
Œ‹


NØÝœ™XÝ
[YÕËÝ]YÕÊŒ‹
ŒÊNØÝ˜Û\
	Ù]™[›Ù	ÊNÝ[JÜ
NØÝœ™\ÝÜ™J
NØÝœØ]™J
NØÝ˜™YÚ[”]

NØÝœ™XÝ
[YÕËÝ]YÕÊŒ‹
ŒÊNØÝ˜Û\

NÝ[J›ÝÙ\‹›Z\œ›Ü“YÜÊNØÝœ™\ÝÜ™J
NßY[ÙH[JÜ
NÂˆÝœ™\ÝÜ™J
NÚYŠËœÚY[Œ
^ØÝœØ]™J
NØÝœÝ›ÚÙTÝ[OIÈØ™™™MÉÎØÝ™š[Ý[OIÈÎYNXÙŒŒ‰ÎØÝ›[™UÚYLÎØÝ˜™YÚ[”]

NØÝ™[\ÙJËžËžKZ
‹KL‹‹X]”JŒŠNØÝ™š[

NØÝœÝ›ÚÙJ
NØÝœ™\ÝÜ™J
Nß\™]\›ˆYNßB˜ÛÛœÝ\™XÝ[Û”Z[™Y›Ü™LMY˜]Ñ\™XÝ[Û˜[Ù˜]Ñ\™XÝ[Û˜[Y[˜Ý[ÛŠÏ\^Y\Š^Ü™]\›ˆ\™XÝ[Û˜[[˜X›Y	‰œZ[Ø[ÌMŠÊ_\™XÝ[Û”Z[™Y›Ü™LMŠÊNßNÂ˜ÛÛœÝÞ\Ý[TZ[™Y›Ü™LMY˜]ÔÞ\Ý[LMÙ˜]ÔÞ\Ý[LMY[˜Ý[ÛŠÏ\^Y\Š^ÚYŠ\Z[Ø[ÌMŠÊJ\™]\›ˆÞ\Ý[TZ[™Y›Ü™LMŠÊNßNÂ˜ÛÛœÝÙ][™ÜÔZ[™Y›Ü™LM\Ù][™ÜÌMNÜÙ][™ÜÌMOY[˜Ý[ÛŠ‹‹˜\™ÜÊ^ØÛÛœÝ\Ù][™ÜÔZ[™Y›Ü™LMŠ‹‹˜\™ÜÊNØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	Ø]Û‰ÊNØ‹^ÛÛ[SM
	ÐÐSRSUHSTPQIË	ÑVS‘QÐSÈS’SPUSÓ‰Ë	ÐÐSRS’QHSTPQIË	ÑÑS1,1g•1,±,q,1gˆpç°çpç1g‰ÊJÉÈ0­È	ÊÊ^[™YØ[ÌMÓM
	ÐPÕUQIË	ÓÓ‰Ë	ÐUUQIË	ÐpáÒRÉÊN“M
	ÑTÐPÕUQIË	ÓÑ‘‰Ë	ÑTÐUUQIË	ÒÐTSIÊJNØ‹›Û˜ÛXÚÏJ
OOžÙ^[™YØ[ÌMHY^[™YØ[ÌMŽÛØØ[ÝÜ˜YÙKœÙ]][J	ÛÛ[šKY^[™Y]Ø[ÌM‰Ë^[™YØ[ÌMÉÛÛ‰Î‰ÛÙ™‰ÊNÜÙ][™ÜÌMJ
NßNÉ
	ÈÙX[ÙØ]ÛœÉÊKœ™\[™
ŠNÜ™]\›ˆŽßNÂ‚˜ÛÛœÝÙÐ™Y›Ü™LM]\]SÙÌŒÎÝ\]SÙÌŒÏY[˜Ý[ÛŠ‹‹˜\™ÜÊ^ÛÙÐ™Y›Ü™LMŠ‹‹˜\™ÜÊNØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	ÜÙXÝ[Û‰ÊNØ‹š[›™\’SIÏÏŒKŒÚÏ‰ÊÓM
	ÐØ[Z[˜]H[\XYH\˜H\ÈÚ[˜ÛÈ˜^˜\È˜\ÙHHX]›\ÝÛ0è\ÚXÛËˆ\ÛÜÈ[\››ÜÈÚ[ˆ[™\\ˆ[™[Ú‹š][ÈÜˆ\Ý[˜ÚXHH\™XØÚpìÛˆ™\XØ[[Ú\Ý[XHÛÜœ™YÚYKˆHYX˜HÑXÝX[^˜H[Üš]H\ÝHÌ™XÙ\ÈÜˆÙYÝ[™ËˆYY\È›Û™\ˆHHØ[Z[˜]H[\š[Üˆ[ˆÛÛ™šYÝ\˜XÚpìÛ‹‰Ë	Ñ^[™YØ[Ú[™È›ÜˆHš]™H˜\ÙH˜XÙ\È[™Û\ÜÚXÈX]›\Ýˆ[\›˜][™ÈÝ\ÈÚ]Ý]Z\œ›Üš[™ÈHØ]Ú\Ý[˜ÙKX˜\ÙYXÚ[™È[™ÛÜœ™XÝY™\XØ[Þ\Ý[H\™XÝ[Û‹ˆHÑšX[™Yœ™\Ú\ÈHÜš]H\ÈÌ[Y\È\ˆÙXÛÛ™ˆ[ÝHØ[ˆ™\ÝÜ™HH™]š[Ý\ÈØ[È[ˆÙ][™ÜË‰Ë	ÐØ[Z[šYH[\XYH\˜H\ÈÚ[˜ÛÈ˜péØ\È˜\ÙHHX]›\ÝÛ0è\ÜÚXÛËˆ\ÜÛÜÈ[\›˜YÜÈÙ[H[™\\ˆÈ™[0ìÙÚ[Ëš][ÈÜˆ\Ý0è›˜ÚXHH\™péðèÛÈ™\XØ[ÈÚ\Ý[XHÛÜœšYÚYKˆÈ\ÝHÑ]X[^˜HÈÜš]H]0êHÌ™^™\ÈÜˆÙYÝ[™ËˆHØ[Z[šYH[\š[ÜˆÙHÙ\ˆ™\Ý]\˜YH˜\ÈÛÛ™šYÝ\˜péðíY\Ë‰Ë	Ð™qgÈ[Y[1,\šÈ™HÛ\ÚZÈX]›\ÝpéÚ[ˆÙ[qgÝ\š[ZqgÈpï°ïpï1gËˆØX]\œÈ0éÙ]œš[YY[ˆq'ÚqgÙ[ˆY1,[[\‹Y\ØY™^YHðíœ™H[\È™H0ï™[[ZqgÈZÙ^HÚ\Ý[Hpí›°ïˆÑ[™[Y\ÚHØ\˜ZÝ\šHØ[š^YYH[ˆ˜^›HÌÙ^ˆY[š[\‹ˆ0å›˜ÙZÚHpï°ïpï1gÙH^X\›\ˆ0ï™\š[™[ˆ0í›™Xš[\œÚ[‹‰ÊJÉÏÜ‰ÎÉ
	ÈÙX[ÙÝ^	ÊKœ™\[™
ŠNßNÂšYŠØØ][Û‹œÙX\˜Úš[˜ÛY\Ê	ÜXOLIÊJ]Ú[™ÝË—×ÝŒM^Ù]˜[œÏO™]˜[
Ê_NÂ‚‹ËÈÜšYÚ[˜[KŒÎˆ\ÛÛ]YÚ^›Ùš[NÈ›È˜[œÙ›Ü›X][ÛœË‚˜ÛÛœÝÐRLMÏIÜØZ^X[ŒMÉËÐRWÖ“Ó‘TÌMÏSØš™XÝ™œ™Y^™JÔ‘QÒSÓ”Ë›[™Ý‘QÒSÓ”Ë›[™Ý
ÌK‘QÒSÓ”Ë›[™Ý
Ì‹‘QÒSÓ”Ë›[™Ý
ÌË‘QÒSÓ”Ë›[™Ý
ÍJNÂ˜ÛÛœÝÐRWÓSQTÌMÏVÖÉÒØ[YHÝ\ÙIË	ÒØ[YHÝ\ÙIË	ÒØ[YHÝ\ÙIË	ÒØ[YHÝ\ÙI×KÉÔ˜Y\˜H[°ë[ÉË	Ôš]™\ˆYXYÝÉË	Ô˜Y\šXHÈš[ÉË	Ó™Z\ˆ0éØ^q,\±,I×KÉÕ˜[HH\ÈY\Ù]\ÉË	ÓY\ØH˜[^IË	Õ˜[H\ÈY\Ù]\ÉË	ÓY\ØH˜Y\ÚI×KÉÑÚ›ÈHH[ÛpìXIË	Ó[Ý[Z[ˆÚ›ÉË	ÑÚ›ÈH[Û[šIË	Ñq'ÈÚ›ÜÝI×KÉÐÜ°è]\ˆ[[›ÉË	Ð[[™HÜ˜]\‰Ë	ÐÜ˜]\˜H[[˜IË	Ð[Ü˜]\šI×WNÂ™›ÜŠ]OLÚONÚJÊÊT‘QÒSÓ”Ëœ\Ú
Ë‹‹˜ÛX[ÛÛ™J‘QÒSÓ”ÖÌWJKY‰ÜØZLMËIÊÚK˜[YN”ÐRWÓSQTÌMÖÚWVÌKÜ]ÛœÎ–×KÚ\Ý›[^]NÍŒÚYŒMŒZYÚŒLJNÂ˜ÛÛœÝØZLMÏJ
OOœ˜XÙOOOTÐRLMËØZV›Û™LMÏ^O”ÐRWÖ“Ó‘TÌMËš[˜ÛY\ÊŠ_HT‘QÒSÓ”ÖÞ—OË›Ý\ŒMÌŸHT‘QÒSÓ”ÖÞ—OËœØYØLMÌËØZSX\MÏJ
OO”‘QÒSÓ”ÖÞ›Û™WOËœØYØLMÌÏËLN“X]›X^
ÐRWÖ“Ó‘TÌMËš[™^ÙŠ›Û™JJNÂ™[˜Ý[ÛˆØZTÝ]LMÊ\^Y\Š^ØÛÛœÝ\œØZ^X[ŒMßßNØÛÛœÝ[OJ‹Z[‹X^
OO“[X™\‹š\Ñš[š]JŠOØÛ[\
‹Z[‹X^
N™ÓØš™XÝ˜\ÜÚYÛŠ‹ÜÝÙ\Ž›[J‹œÝÙ\‹LLYLLŠKÚN›[J‹šÚKLŒ
K›ÙN›[J‹˜›ÙKL
Kœ™X]›[J‹˜œ™X]L
K˜Z[š[™Î›[J‹˜Z[š[™ËL
K›ÜÚN“X]™›ÛÜŠ[J‹œ›ÜÚKÊJK\ÜÛÛŽ›[J‹›\ÜÛÛ‹Œ
KØ[YNˆH[‹šØ[YKÚP›\ÝˆH[‹šÚP›\Ý™[šØZN“X]™›ÛÜŠ[J‹ž™[šØZKŒ
JK™[šØZT™XYNˆH[‹ž™[šØZT™XYK\Ý™[šØZN›[J‹›\Ý™[šØZKL
KÜ\•Ú[œÎ“X]™›ÛÜŠ[J‹œÜ\•Ú[œËL
JKÜ\‘[XYÙN›[J‹œÜ\‘[XYÙKL
_JNÜœØZ^X[ŒMÏ[ŽÜ™]\›ˆŽßB™[˜Ý[ÛˆØZRMÊ
^ØÛÛœÝ\ØZTÝ]LMÊ
NÜ™]\›ˆX]œ›Ý[™
LŒ
ÓX]œÜ\
‹œÝÙ\‹LL
JJÛ‹˜›ÙJŒŠNßB™[˜Ý[ÛˆØZRÚSX^MÊ
^Ü™]\›ˆL
ÜØZTÝ]LMÊ
K˜œ™X]ßB™[˜Ý[ÛˆØZQ[XYÙLMÊ˜\ÙJ^Ü™]\›ˆ˜\ÙJŠJÓX]›ÙÌŠØZTÝ]LMÊ
KœÝÙ\‹ÌL
J‹ŒÍJNßB›]ØZT[ŒMÏ^Ü\ÙNŒÛÛÛ–ÌKXÝ[ÛŽ›[Ú\™Ú[™Î™˜[ÙKÚÝ–×K™X[N›[˜Z[š[™ÎŒØ]™NŒÛÛX›ÎŒ\™Ù]ŒÌÜ\Ž›[Ø\ÝŒNÂ˜ÛÛœÝØZP]\ÌMÏ[™]È[XYÙJ
KØZSX\ÌMÏ[™]È[XYÙJ
KØZSY\ØLMÏ[™]È[XYÙJ
NÜØZP]\ÌMËœÜ˜ÏIÜØZLMËØXÝÜœËÙXœ	ÎÜØZSX\ÌMËœÜ˜ÏIÜØZLMËÛX\ËÙXœ	ÎÜØZSY\ØLMËœÜ˜ÏIÜØZLMËÛY\ØKÙXœ	ÎÂ˜ÛÛœÝØZSY]LMÏVÖÖÍÍ‹LŒ‹LÌ×KÌL‹ËLÌWKÍLËŒËLÌKÍMŽL‹ÌLÌWKÍÌÎKLËŒËLÌKÎLKL‹LÌWKÌLÍ‹L‹Œ‹LÌWKÌLËL‹Œ‹LÌWWKÖÍŽKMLKŒ‹LŽWKÌŒÎMËŒKLÍ×KÍËML‹‹LŽKÍMËML‹‹LŽKÍÍMLKŒËLŽWKÎLKMËKLÍ×KÌLÌ‹MLKKLŽWKÌLŒÎKML‹Œ‹LŽWKÖÍMËŽË‹MKÌŒKŽËËMKÌÎ‹ŽMËLÎWKÍMŒŽLKMKÍÌŽKMKÎKŽ‹ËMWKÌLNŽËM‹MKÌLŒŽŽKLKLÍ×WKÖÍKÍLÎKÌÍÍKLÎKÌÎNKÍLKLÎKÍMKÌËMLÎWKÍÌÍËÍ‹LÍ×KÎNKÍ‹LÎKÌL‹ÍL‹LÎKÌLŒÍËÌËKLÎWKÖÌŒ‹N‹LLÌKÌN‹MÌ‹MNMKÌÍMÌ‹LÍKMKÍLÌËNËLL‹LŽKÍÌMËNM‹LŽKÎNKMÌ‹LŽKMKÌLÍKMÌ‹LLKMKÌLŒLNKL‹LÌWWKÖÌMKÌL‹L×KÌMÍËÌËMËLKÌÍÌ‹MÌKLWKÍLMKÌŽMÌ‹LŒ×KÍŽËÌËMÌ‹LKÎNKÌËMÌKLKÌLÌÌŽMÌ‹LÌWKÌLŒ‹ÍLKMKŒ×WKÖÍL‹NKM‹LÌKÌŒŒ‹NKMKLÌKÌÎËNKLLÌ—KÍMMNKL‹M×KÍÌKŒKLKLŽWKÎLKŒKNLŽWKÌLNKLLÌ—KÌLŒÌNKMKLÌWKÖÍLKNLÌ—KÌŒËL‹LLÌWKÌÍMËLËLKLÌ×KÍLNL‹LËLÍWKÍŒLKLKML‹L×KÍÍŒËLËMLËLÍKÎLM‹LMËLÌWKÌLLKLM‹LÌWWWNÂ™[˜Ý[ÛˆØZTÜš]LMÊ›ÝËœ˜[YKKLL›\Y˜[ÙJ^Ü™]\›ˆ˜\ÙTZ[MÌÊ›ÝËœ˜[YKK›\
NßB‚™[˜Ý[ÛˆØZPÛX\ŒMÊ
^Ù[™[ZY\ÏV×NØÚ]^™[œÏV×NÛÙ™šXÙ\œÏV×NÜ›Ú™XÝ[\Ë›[™ÝZÜÝ[TÚÝË›[™ÝYY™™XÝË›[™Ý\\XÛ\Ë›[™Ý[[X™\œË›[™ÝLÜ^Y\‹˜[Y[Y˜[ÙNÜ^Y\‹™›Ü›OIÚ[X[‰ÎÜ^Y\‹œ˜XÙTÝÙ\ŒY˜[ÙNÜ^Y\‹™ÝÙ[‘›Ü›MLOY˜[ÙNÜ^Y\‹š][]OLÜ^Y\‹›]™[LNÜ^Y\‹žLÜ^Y\‹œÚ[ÏLÜ^Y\‹Ø]ÚÜ[Y˜[ÙNÜ^Y\‹›[Ý[Û\^Y\‹›X\[[Ü^Y\‹˜]XÚÏLÛ]Ï^ÚØ\›XNŒX]Œ[Y\ŽŒÜ]ÛŽŒK›ÝXÙNŒNÜØZT[ŒMÏ^Ü\ÙNŒÛÛÛ–ÌKXÝ[ÛŽ›[Ú\™Ú[™Î™˜[ÙKÚÝ–×K™X[N›[˜Z[š[™ÎŒØ]™NŒÛÛX›ÎŒ\™Ù]ŒÌÜ\Ž›[Ø\ÝŒNßB™[˜Ý[ÛˆØZU˜]™[MÊ[™^[š]X[Y˜[ÙJ^ÚYŠ\ØZLMÊ
_S[X™\‹š\Ò[YÙ\Š[™^
_[™^[™^
Z[š]X[	‰ŠØZT[ŒMËœÜ\ŸØZT[ŒMË˜XÝ[ÛŠJJ\™]\›ˆ˜[ÙNÞ›Û™OTÐRWÖ“Ó‘TÌMÖÚ[™^NÜØZPÛX\ŒMÊ
NÞ›Û™TÝ]\ÖÜ™YÚ[ÛŠ
KšYOV×NØÚ]š[Ý]\ÖÜ™YÚ[ÛŠ
KšYOV×NÜ^Y\‹žZ[™^OOLÍŽLŽÜ^Y\‹žOMÍŒÜ^Y\‹™LNÜ^Y\‹™OLÜ^Y\‹™˜XÙOLNÜ^Y\‹Ø[Ñ\IÙœ›Û	ÎØØ[KžXØ[KžOLÚYŠY\ØÛÝ™\™Yš[˜ÛY\Ê™YÚ[ÛŠ
KšY
JY\ØÛÝ™\™Yœ\Ú
™YÚ[ÛŠ
KšY
NØÛÜÙQX[ÙÊ
NÚY

NÚYŠZ[š]X[
\\œÚ\ÝØ[YJ
NÜ™]\›ˆYNßB˜ÛÛœÝ[š]™Y›Ü™LMÏZ[š]›ÙÜ™\ÜÎÚ[š]›ÙÜ™\ÜÏY[˜Ý[ÛŠ
^ØÛÛœÝÝ]Z[š]™Y›Ü™LMÊ
NÚYŠØZLMÊ
J^ÜØZTÝ]LMÊ
NÜ^Y\‹›]™[LNÜ^Y\‹žLÜ^Y\‹œÚ[ÏLÜ^Y\‹š][]OLÜ^Y\‹˜[Y[Y˜[ÙNÜ^Y\‹™›Ü›OIÚ[X[‰ÎÚYŠ\ØZV›Û™LMÊ›Û™JJ^›Û™OTÐRWÖ“Ó‘TÌMÖÌNÜ^Y\‹šXÛ[\
[X™\Š^Y\‹š
_ØZRMÊ
KKØZRMÊ
JNß\™]\›ˆÝ]ßNÂ˜ÛÛœÝ™Y›Ü™LMÏ[X^ÛX^Y[˜Ý[ÛŠ
^Ü™]\›ˆØZLMÊ
OÜØZRMÊ
Nš™Y›Ü™LMÊ
NßNÂ˜ÛÛœÝ™Y›Ü™LMÏ^ÞY[˜Ý[ÛŠ‹‹˜J^ÚYŠØZLMÊ
J\™]\›ˆÜ™]\›ˆ™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝÚÛÜÙP™Y›Ü™LMÏXÚÛÜÙT˜XÙNØÚÛÜÙT˜XÙOY[˜Ý[ÛŠY
^ÚYŠYOOTÐRLMÉ‰ˆ\ØZLMÊ
J\™]\›ˆÚÛÜÙP™Y›Ü™LMÊY
NÚYŠVÉÛÛ[šIË	ÛÜÛ[ÉË	Ø[›Ù]IË	Ø™[™IËÖTÕSLMÐRLM×Kš[˜ÛY\ÊY
J\™]\›ˆ˜[ÙNÚYŠ™]œ›Û_ÝÛŒMKš›Ú[™YØZT[ŒMËœÜ\ŸÝ\Y	‰Š^Y\‹œ™YÙ[•ØZ]Œ]Ë[Y\Œ
J\™]\›ˆ˜[ÙNÚYŠYOO\˜XÙJ^Ü˜XÙSY[J	Û][IÊNÜ™]\›ˆYNß\›Ùš[\ÖÜ˜XÙWO\›Ùš[TÛ˜\ÚÝ

NÜ˜XÙOZYÛ]Û˜\\›Ùš[\ÖÚY_œ™\Ú›Ùš[J
NÚYŠYOOTÐRLMÊ^ÜÛ˜\XÛX[ÛÛ™JÛ˜\
NÜÛ˜\ž›Û™O\ØZV›Û™LMÊÛ˜\ž›Û™JOÜÛ˜\ž›Û™N”ÐRWÖ“Ó‘TÌMÖÌNÜÛ˜\ž›Û™TÝ]\Ï^ßNÜÛ˜\˜Ú]š[Ý]\Ï^ßNÜÛ˜\œ^Y\‹œÙ[XÝY\Û˜\œ^Y\‹˜XÝ]™P[Y[IÚX]›\Ý	ÎÜÛ˜\œ^Y\‹›]™[LNÜÛ˜\œ^Y\‹˜[Y[Y˜[ÙNÜÛ˜\œ^Y\‹š][]OLÜØZTÝ]LMÊÛ˜\œ^Y\ŠNßX\T›Ùš[JÛ˜\
NÚYŠØZLMÊ
J^ÜØZPÛX\ŒMÊ
NÜ^Y\‹šSX]›Z[Š^Y\‹šØZRMÊ
JNÚYŠ\›Ùš[\ÖÚYJ\^Y\‹š\ØZRMÊ
NÚYŠT‘QÒSÓ”ÖÞ›Û™WOË›Ý\ŒMÌ‰‰ˆT‘QÒSÓ”ÖÞ›Û™WOËœØYØLMÌÉ‰Š^Y\‹žO^Y\‹žOŽML
J^Ü^Y\‹žMŽLÜ^Y\‹žOMÍŒß_YØÝ[Y[˜›ÙK˜Û\ÜÓ\ÝÙÙÛJ	ÜØZLMÉËØZLMÊ
JNØÛÜÙTÛ™LLJ
NÚY

NÜ\œÚ\ÝØ[YJ
NÜ˜XÙSY[J	Û][IÊNÜ™]\›ˆYNßNÂ˜ÛÛœÝØY™Y›Ü™LMÏ[ØYÛØYY[˜Ý[ÛŠ
^ØÛÛœÝÝ][ØY™Y›Ü™LMÊ
NÚYŠØZLMÊ
J^ÚYŠ\ØZV›Û™LMÊ›Û™JJ^›Û™OTÐRWÖ“Ó‘TÌMÖÌNÜØZPÛX\ŒMÊ
NÜØZTÝ]LMÊ
NÚYŠT‘QÒSÓ”ÖÞ›Û™WOË›Ý\ŒMÌ‰‰ˆT‘QÒSÓ”ÖÞ›Û™WOËœØYØLMÌÊ^Ü^Y\‹žXÛ[\
^Y\‹žNM
NÜ^Y\‹žOXÛ[\
^Y\‹žKLŒLÌ
Nß_YØÝ[Y[˜›ÙK˜Û\ÜÓ\ÝÙÙÛJ	ÜØZLMÉËØZLMÊ
JNÜ™]\›ˆÝ]ßNÂ˜ÛÛœÝ[\™Y›Ü™LMÏY[\–›Û™NÙ[\–›Û™OY[˜Ý[ÛŠ™^‹‹˜J^ÚYŠØZLMÊ
J\™]\›ˆØZV›Û™LMÊ™^
OÜØZU˜]™[MÊÐRWÖ“Ó‘TÌMËš[™^ÙŠ™^
JN™˜[ÙNÚYŠØZV›Û™LMÊ™^
J\™]\›ˆ˜[ÙNÜ™]\›ˆ[\™Y›Ü™LMÊ™^‹‹˜JNßNÂ˜ÛÛœÝÜ]Û™Y›Ü™LMÏ\Ü]Û‘[™[ZY\ÎÜÜ]Û‘[™[ZY\ÏY[˜Ý[ÛŠ‹‹˜J^ÚYŠØZLMÊ
_ØZV›Û™LMÊ›Û™JJ^Ù[™[ZY\ÏV×NÜ™]\›Žß\™]\›ˆÜ]Û™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝÚ]^™[œÐ™Y›Ü™LMÏY[œÝ\™PÚ]^™[œÎÙ[œÝ\™PÚ]^™[œÏY[˜Ý[ÛŠ‹‹˜J^ÚYŠØZLMÊ
_ØZV›Û™LMÊ›Û™JJ^ØÚ]^™[œÏV×NÜ™]\›Žß\™]\›ˆÚ]^™[œÐ™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝ›ÜÜÐ™Y›Ü™LMÏY[œÝ\™P›ÜÜÎÙ[œÝ\™P›ÜÜÏY[˜Ý[ÛŠ‹‹˜J^ÚYŠØZLMÊ
_ØZV›Û™LMÊ›Û™JJ\™]\›ŽÜ™]\›ˆ›ÜÜÐ™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝš][]P™Y›Ü™LMÏX^Uš][]NØ^Uš][]OY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÙ˜[ÙNš][]P™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝÛ™P™Y›Ü™LMÏ[Ü[”Û™LLNÛÜ[”Û™LLOY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÙ˜[ÙNœÛ™P™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝØØ[™Y›Ü™LMÏ\Ý\[™[^TØØ[ŒNÜÝ\[™[^TØØ[ŒNY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÙ˜[ÙNœØØ[™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝØØ[‘LMÏ\Ý\ØØ[ŒMÎÜÝ\ØØ[ŒMÏY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÙ˜[ÙNœØØ[‘LMÊ‹‹˜JNßNÂ˜ÛÛœÝ˜[œÙ›Ü›P™Y›Ü™LMÏ]˜[œÙ›Ü›NÝ˜[œÙ›Ü›OY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÙ˜[ÙN˜[œÙ›Ü›P™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝÙ[XÝ™Y›Ü™LMÏ\Ù[XÝ[Y[ŽÜÙ[XÝ[Y[Y[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÙ˜[ÙNœÙ[XÝ™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝ[\™Y›Ü™LMÏZ[\Ú[\Y[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÙ˜[ÙNš[\™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝÛYP™Y›Ü™LMÏ\ÛYNÜÛYOY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÙ˜[ÙNœÛYP™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝ™YP™Y›Ü™LMÏ\ÚÚ[™YNÜÚÚ[™YOY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÜØZSY[LMÊ	ÝXÚ	ÊN™YP™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝÛÜ›™Y›Ü™LMÏ\ÚÝÕÛÜ›X\ÜÚÝÕÛÜ›X\Y[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÜØZSY[LMÊ	ÛX\	ÊNÛÜ›™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝ]\ÙP™Y›Ü™LMÏ\]\ÙSY[NÜ]\ÙSY[OY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÜØZSY[LMÊ
Nœ]\ÙP™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝ^P™Y›Ü™LMÏI
	ÈÜ^IÊK›Û˜ÛXÚÎÉ
	ÈÜ^IÊK›Û˜ÛXÚÏY[˜Ý[ÛŠ‹‹˜J^ÚYŠ\ØZLMÊ
J\™]\›ˆ^P™Y›Ü™LMË˜\J\ËJNÚYŠ\™XYJ\™]\›ŽÜÝ\Y]YNÜ]\ÙYY˜[ÙNØÚ[™[X]XÏ[[É
	ÈÛY[IÊK˜Û\ÜÓ\Ý˜Y
	ÚY[‰ÊNÉ
	ÈÚY	ÊK˜Û\ÜÓ\Ýœ™[[Ý™J	ÚY[‰ÊNØÛÜÙQX[ÙÊ
NÙØÝ[Y[˜›ÙK˜Û\ÜÓ\Ý˜Y
	ÜØZLMÉÊNÜØZPÛX\ŒMÊ
NÚY

NÜ\œÚ\ÝØ[YJ
NßNÂ™[˜Ý[ÛˆØZU˜Z[ŒMÊ
^ØÛÛœÝ\ØZTÝ]LMÊ
NÛ‹˜Z[š[™ÊÏYÛ‹œÝÙ\SX]›Z[ŠYLL‹‹œÝÙ\ŠÙ
‹ŒL‹ÊJÛ‹œÝÙ\‹ÌÌ
JNÛ‹˜›ÙOSX]›Z[ŠL‹˜›ÙJÙ
‹Œ
NÛ‹˜œ™X]SX]›Z[ŠL‹˜œ™X]
Ù
‹ŒŠNßB™[˜Ý[ÛˆØZPÚ\™ÙLMÊÛŠ^ÚYŠ\ØZLMÊ
J\™]\›ŽÜØZT[ŒMË˜Ú\™Ú[™ÏHH[ÛŽÚYŠ[Û‰‰œØZT[ŒMË˜XÝ[ÛË\OOOIØÚ\™ÙIÊ\ØZT[ŒMË˜XÝ[Û[[ßB™[˜Ý[ÛˆØZS\ÜÛÛŒMÊ
^ØÛÛœÝ\ØZTÝ]LMÊ
NÚYŠ\ØZLMÊ
_ØZSX\MÊ
HOOLX]š\Ý
^Y\‹žMÌ^Y\‹žKMŒŒ
OŒMÌ
\™]\›ˆ˜[ÙNÚYŠ[‹œ›ÜÚJ^Û‹œ›ÜÚOLNÛ‹›\ÜÛÛLßXÛÜÙQX[ÙÊ
NÜ\œÚ\ÝØ[YJ
NÜ™]\›ˆYNßB™[˜Ý[ÛˆØZT›ÜÚLMÊ
^ØÛÛœÝ\ØZTÝ]LMÊ
KSM
	ÓX[0ê[ˆÐT‘ÐTˆÒH\˜[HŒÙYÝ[™ÜÈÙ\˜ØHH›ÜÚNÈYYÛÈ\ØHØ[YZ[YZH\˜H[[ÜÝ˜\ˆH0êXÛšXØK‰Ë	ÒÛÒT‘ÑHÒH›ÜˆŒÙXÛÛ™È™X\ˆ›ÜÚNÈ[ˆ\ÙHØ[YZ[YZHÈ[[ÛœÝ˜]HHXÚš\]YK‰Ë	ÔÙYÝ\™HÐT”‘QÐTˆÒHÜˆŒÙYÝ[™ÜÈ\ÈH›ÜÚNÈ\Ú\È\ÙHØ[YZ[YZH\˜H[[ÛœÝ˜\ˆH0êXÛšXØK‰Ë	Ô›ÜÚHXZñ,[±,[™HŒØ[š^YHÒHÓTˆ0ï1'ÛY\Ú[šH]ÈÛÛœ˜HØ[YZ[YZHZÛšq'Ú[šHðíœÝ\‹‰ÊNÜÚÝÑX[ÙÊ	ÒÐSQHÕTÑIË	ÓXY\Ý›È›ÜÚIË	Ï]ˆ]K[›ËZLNˆÛ\ÜÏHœØZKYX[ÙÌMÈ‰ÊÝ
ÉÏÜ‰ÊÓX]™›ÛÜŠ‹›\ÜÛÛŠJÉÈÈŒÈ0­È	ÊÊ‹šØ[YOÓM
	ÒØ[YZ[YZH\™[™YÉË	ÒØ[YZ[YZHX\›™Y	Ë	ÒØ[YZ[YZH\™[™YÉË	ÒØ[YZ[YZH0í±'Ü™[š[IÊN“M
	Ñ[™[˜[ZY[ÈHÛÛ›ÛHÚIË	ÒÚHÛÛ›Û˜Z[š[™ÉË	Õ™Z[›ÈHÛÛ›ÛHHÚIË	ÒÚHÛÛ›Ûq'Ú][ZIÊJJÉÏÜÙ]‰ËÖÓM
	ÑS•‘ST‰Ë	ÕRS‰Ë	Õ‘RST‰Ë	Ñq'±,1,IÊKØZS\ÜÛÛŒM×KÓM
	ÑTÐÐS”ÐT‰Ë	Ô‘TÕ	Ë	ÑTÐÐS”ÐT‰Ë	Ñ1,“S‰ÊK

OOžÜØZT™\ÝMÊ
NØÛÜÙQX[ÙÊ
NßWKÓM
	ÐÑT”T‰Ë	ÐÓÔÑIË	Ñ‘PÒT‰Ë	ÒÐTU	ÊKÛÜÙQX[Ù×WJNßB™[˜Ý[ÛˆØZT™\ÝMÊ
^ØÛÛœÝ\ØZTÝ]LMÊ
NÚYŠØZT[ŒMËœÜ\ŸØZSX\MÊ
HOOL
\™]\›ˆ˜[ÙNÚYŠ‹ž™[šØZT™XYI‰›‹˜Z[š[™Ë[‹›\Ý™[šØZOMŒ	‰›‹ž™[šØZOŒ
^Û‹œÝÙ\SX]›Z[ŠYLL‹‹œÝÙ\ŠŒKŒJNÛ‹ž™[šØZJÊÎÛ‹›\Ý™[šØZO[‹˜Z[š[™ÎÛ‹ž™[šØZT™XYOY˜[ÙNß\^Y\‹š\ØZRMÊ
NÛ‹šÚO\ØZRÚSX^MÊ
NÜ\œÚ\ÝØ[YJ
NÜ™]\›ˆYNßB™[˜Ý[ÛˆØZTÜ\ŒMÊ
^ÚYŠ\ØZLMÊ
_ØZSX\MÊ
OOOLØZT[ŒMËœÜ\Š\™]\›ˆ˜[ÙNØÛÛœÝ\ØZTÝ]LMÊ
NÜØZT[ŒMËœÜ\^ÚœØZRMÊ
JŒKŽX^œØZRMÊ
JŒKŽŒLLNÌÚ[™ŒÙŒ‹X\›™YŒNÛ‹œÜ\‘[XYÙOLØÛÜÙQX[ÙÊ
NÜ™]\›ˆYNßB™[˜Ý[ÛˆØZR]\™Ù]MÊ
^ØÛÛœÝ\ØZTÝ]LMÊ
KÏ\ØZT[ŒMËœÜ\ŽÚYŠÊ^ØÛÛœÝXÝX[SX]›Z[ŠËš
NÜËšOYÜË™X\›™Y
ÏXXÝX[Û‹œÜ\‘[XYÙJÏXXÝX[ÚYŠËšL
^Û‹œÜ\•Ú[œÊÊÎÛ‹œÝÙ\SX]›Z[ŠYLL‹‹œÝÙ\ŠÓX]›Z[ŠKJÛ‹œÝÙ\Š‹ŒJJNÜØZT[ŒMËœÜ\[[Ü\œÚ\ÝØ[YJ
Nß_Y[Ù^ÜØZT[ŒMË\™Ù]OYÚYŠØZT[ŒMË\™Ù]L
^ÜØZT[ŒMË\™Ù]LÌÜØZU˜Z[ŒMÊŠNß__B™[˜Ý[ÛˆØZP]XÚÌMÊJ^ÚYŠ\ØZLMÊ
_\Ý\Y]\ÙYÚ[™[X]XßØZT[ŒMË˜ÛÛÛÚWOŒØZT[ŒMË˜XÝ[ÛË\OOOIÚØ[YIÊ\™]\›ˆ˜[ÙNØÛÛœÝ\ØZTÝ]LMÊ
NÚYŠOOOLŠ^ÜØZT[ŒMË˜Ú\™Ú[™Ï]YNÜ™]\›ˆYNßZYŠOOOLI‰ˆ[‹šÚP›\ÝOOOLÉ‰ˆ[‹šØ[YI‰›‹œ›ÜÚOŠ\™]\›ˆ˜[ÙNØÛÛœÝÛÜÝZOOOLOÎšOOOLÏÌÍNŒÚYŠ‹šÚOÛÜÝ
\™]\›ˆ˜[ÙNÛ‹šÚKOXÛÜÝÜØZT[ŒMË˜Ú\™Ú[™ÏY˜[ÙNÜØZT[ŒMË˜ÛÛÛÚWOVËKŒ‹×VÚWNØÛÛœÝ\™Ù]\ØZT[ŒMËœÜ\ŸØZU\™Ù]MŽ

NÛ]\^Y\‹™^Y\‹™˜XÙ_KO\^Y\‹™_ØÛÛœÝ[SX]š\Ý
J_NÙÏ[[ŽÙKÏ[[ŽÂšYŠOOOL
^ÜØZT[ŒMË˜ÛÛX›ÏJØZT[ŒMË˜ÛÛX›ÊÌJILÎÜØZT[ŒMË˜XÝ[Û^Ý\N‰Ü[˜Ú	ËŒX^‹ŒÍNÚYŠX]š\Ý
^Y\‹ž]\™Ù]ž^Y\‹žK]\™Ù]žJOML
\ØZR]\™Ù]MÊØZQ[XYÙLMÊM
ÜØZT[ŒMË˜ÛÛX›ÊŒÊJNßBšYŠOOOLJ^ÜØZT[ŒMË˜XÝ[Û^Ý\N‰Ø›\Ý	ËŒX^‹ŒßNÜØZT[ŒMËœÚÝœ\Ú
Þœ^Y\‹žNœ^Y\‹žKMK™
LŒN™JLŒŒKŒßJNßBšYŠOOOLÊ^ÜØZT[ŒMË˜XÝ[Û^Ý\N‰ÚØ[YIËŒX^ŒKËKš\™Y™˜[Ù_NßBœ™]\›ˆYNßB˜ÛÛœÝ]XÚÐ™Y›Ü™LMÏX]XÚÎØ]XÚÏY[˜Ý[ÛŠK‹‹˜J^Ü™]\›ˆØZLMÊ
OÜØZP]XÚÌMÊJN˜]XÚÐ™Y›Ü™LMÊK‹‹˜JNßNÂ˜ÛÛœÝ[\˜XÝ™Y›Ü™LMÏZ[\˜XÝÚ[\˜XÝY[˜Ý[ÛŠ‹‹˜J^ÚYŠ\ØZLMÊ
J\™]\›ˆ[\˜XÝ™Y›Ü™LMÊ‹‹˜JNÚYŠØZSX\MÊ
OOOL	‰“X]š\Ý
^Y\‹žMÌ^Y\‹žKMŒŒ
OMÌ
\™]\›ˆØZT›ÜÚLMÊ
NÜØZSY[LMÊØZSX\MÊ
OOOLÉÝXÚ	Î‰Ý˜Z[‰ÊNßNÂ™[˜Ý[ÛˆØZRYMÊ
^ÙØÝ[Y[˜›ÙK˜Û\ÜÓ\ÝÙÙÛJ	ÜØZLMÉËØZLMÊ
JNÙ›ÜŠÛÛœÝYÙˆÉÚ›ØœØ‰Ë	Û[˜‰Ë	ÜÚÚ[œÉË	Ø[Y[œÚÚ[œÉ×J^ØÛÛœÝ[YØÝ[Y[™Ù][[Y[žRY
Y
NÚYŠ[
Y[œÝ[K™\Ü^O\ØZLMÊ
OÉÛ›Û™IÎ‰ÉÎßXÛÛœÝ›ÞYØÝ[Y[™Ù][[Y[žRY
	ÜØZKZYMÉÊNÚYŠX›Þ
\™]\›ŽØ›ÞšY[H\ØZLMÊ
_\Ý\YÚYŠ\ØZLMÊ
J\™]\›ŽØÛÛœÝ\ØZTÝ]LMÊ
NÉ
	ÈÜØZK\ÝÙ\ŒMÉÊK^ÛÛ[IÔÕÑTˆU‘S	ÊÓX]™›ÛÜŠ‹œÝÙ\ŠKÓØØ[TÝš[™Ê
NÉ
	ÈÜØZKZX[MÉÊK^ÛÛ[SX]˜ÙZ[
^Y\‹š
JÉÈÈ	ÊÜØZRMÊ
NÉ
	ÈÜØZKZX[˜\ŒMÉÊKœÝ[KÚYXÛ[\
^Y\‹šÜØZRMÊ
JŒLL
JÉÉIÎÉ
	ÈÜØZKZÚLMÉÊK^ÛÛ[IÒÒH	ÊÓX]™›ÛÜŠ‹šÚJJÉÈÈ	ÊÓX]™›ÛÜŠØZRÚSX^MÊ
JNÉ
	ÈÜØZKZÚX˜\ŒMÉÊKœÝ[KÚYXÛ[\
‹šÚKÜØZRÚSX^MÊ
JŒLL
JÉÉIÎÉ
	ÈÜØZK\XÙLMÉÊK^ÛÛ[SM
‹‹ŠÐRWÓSQTÌMÖÜØZSX\MÊ
W_ÐQÐWÓSQTÌMÌÊJNÉ
	ÈÜØZK[Øš™XÝ]™LMÉÊK^ÛÛ[[‹šØ[YOÓM
	Ñ[™[˜HHÛZ[˜HHÚIË	Õ˜Z[ˆ[™X\Ý\ˆ[Ý\ˆÚIË	Õ™Z[™HHÛZ[™HÙ]HÚIË	Ñq'Ú][™HÚHðïðï°ïÙ[qgÝ\‰ÊN›‹œ›ÜÚOOOLÓM
	Ñ[]Y\Ý˜H[Ø[YZ[YZIË	Ñ[[ÛœÝ˜]HØ[YZ[YZIË	Ñ[[ÛœÝ™HÈØ[YZ[YZIË	ÒØ[YZ[YZHZÛšq'Ú[šHðíœÝ\‰ÊN›‹œ›ÜÚOOOLOÓM
	ÐØ\™ØHÚH[ÈH›ÜÚIË	ÐÚ\™ÙHÚH™X\ˆ›ÜÚIË	ÐØ\œ™YÝYHÚH\ÈH›ÜÚIË	Ô›ÜÚHX[±,[™HÚHÛ\‰ÊJÉÈ	ÊÓX]™›ÛÜŠ‹›\ÜÛÛŠJÉËÌŒÉÎ“M
	ÒX›HÛÛˆ›ÜÚH[ˆØ[YHÝ\ÙIË	Õ[ÈÈ›ÜÚH]Ø[YHÝ\ÙIË	Ñ˜[HÛÛH›ÜÚH[HØ[YHÝ\ÙIË	ÒØ[YHÝ\ÙHpéÚ[™H›ÜÚH[HÛÛqgÉÊNÚYŠØZT[ŒMË˜Z[š[™ÏŒ
I
	ÈÜØZK[Øš™XÝ]™LMÉÊK^ÛÛ[SM
	Ñ[™[˜[™ÉË	Õ˜Z[š[™ÉË	Õ™Z[˜[™ÉË	Ñq'Ú][IÊJÉÈ	ÊÓX]˜ÙZ[
ØZT[ŒMË˜Z[š[™ÊJÉÜÉÎÉ
	ÈÜØZK\[˜ÚMÉÊK™\ØX›YY˜[ÙNÉ
	ÈÜØZKZØ[YLMÉÊK™\ØX›YH[‹šØ[YI‰›‹œ›ÜÚOŽÉ
	ÈÜØZKX›\ÝMÉÊK™\ØX›YH[‹šÚP›\ÝÉ
	ÈÜØZK][ÌMÉÊKšY[\ØZSX\MÊ
HOOLX]š\Ý
^Y\‹žMÌ^Y\‹žKMŒŒ
OŒMÌßB˜ÛÛœÝY™Y›Ü™LMÏZYÚYY[˜Ý[ÛŠ
^ÚYŠØZLMÊ
J^ÜØZRYMÊ
NÜ™]\›ŽßXÛÛœÝÝ]ZY™Y›Ü™LMÊ
NÜØZRYMÊ
NÜ™]\›ˆÝ]ßNÂ™[˜Ý[ÛˆØZP›ØÚÙYMÊJ^ÚYŠL_ŒMÍ_OLOŽLÍJ\™]\›ˆYNØÛÛœÝO\ØZSX\MÊ
NÚYŠOOOL
^Ü™]\›ˆŒLÌŒŒLL	‰žOŽŒŒ	‰žOŒßZYŠOOOLJ\™]\›ˆŒLL	‰žOŒŒÚYŠOOOLÊ\™]\›ˆOŒ	‰ŠÍLŒLÌ
NÚYŠOOOM
\™]\›ˆL	‰žLÍÌ	‰žOL	‰žOÌNÜ™]\›ˆ˜[ÙNßB™[˜Ý[ÛˆØZU\]LMÊ
^ÚYŠ\Ý\Y]\ÙYÚ[™[X]XßØÝ[Y[šY[Š\™]\›ŽÙXÛ[\
ŒJNØÛØÚÊÏYÝÝ[^TÙXÛÛ™ÍMŠÏYØÛÛœÝ\ØZTÝ]LMÊ
K\ØZT[ŒMÎÚYŠ\ØZV›Û™LMÊ›Û™JJ\ØZU˜]™[MÊYJNÙ[™[ZY\ÏV×NØÚ]^™[œÏV×NÛÙ™šXÙ\œÏV×NÜ‹˜ÛÛÛ\‹˜ÛÛÛ›X\
O“X]›X^
‹Y
JNÜ^Y\‹œ™YÙ[•ØZ]SX]›X^

^Y\‹œ™YÙ[•ØZ]
KY
NÜ‹˜Ú\™Ú[™ÏHHJ‹˜Ú\™Ú[™ßÙ^\Ë˜ß[OOLŠNÛ]ž\ÝXÚËž
ÊÙ^\Ë\œ›ÝÔšYÚÙ^\Ë™ÌNŒ
KJÙ^\Ë\œ›ÝÓYÙ^\Ë˜OÌNŒ
KžO\ÝXÚËžJÊÙ^\Ë\œ›ÝÑÝÛŸÙ^\ËœÏÌNŒ
KJÙ^\Ë\œ›ÝÕ\Ù^\ËÏÌNŒ
K[SX]š\Ý
žžJNÚYŠ[ŒJ^ÝžÏ[[ŽÝžKÏ[[Žß\^Y\‹›[Ýš[™Ï[[‹ŒL‰‰œ‹˜XÝ[ÛË\HOOIÚØ[YIÉ‰ˆ[Ý\”[ŒMÌ‹™Ù[šÚNÚYŠ^Y\‹›[Ýš[™Ê^ØÛÛœÝÜYY\ØZTÜYYMÌŠ
NØÛÛœÝž\^Y\‹ž
Ýž
œÜYY
™žO\^Y\‹žJÝžJœÜYY
‹ÍJ™ÚYŠ\ØZP›ØÚÙYMÊž^Y\‹žJJ\^Y\‹ž[žÚYŠ\ØZP›ØÚÙYMÊ^Y\‹žžJJ\^Y\‹žO[žNÜ^Y\‹™]žÜ^Y\‹™O]žNÜ^Y\‹™˜XÙO]žËLNžŒÌNœ^Y\‹™˜XÙNÜ^Y\‹Ø[Ñ\SX]˜XœÊžJO“X]˜XœÊž
OÝžOÉØ˜XÚÉÎ‰Ùœ›Û	ÎžÉÛY	Î‰ÜšYÚ	ÎÜ‹œ\ÙJÏY
Š‹˜Ú\™Ú[™ÏÍN›Ý\”[ŒMÌ‹œ[ŸÙ^\Ë”ÚYÌMÎŒLJNßY[ÙH‹œ\ÙOLÂšYŠ‹˜Ú\™Ú[™É‰œ‹˜XÝ[ÛË\HOOIÚØ[YIÊ^Û‹šÚOSX]›Z[ŠØZRÚSX^MÊ
K‹šÚJÙ
ŒŒ
NÚYŠØZSX\MÊ
OOOL	‰“X]š\Ý
^Y\‹žMÌ^Y\‹žKMŒŒ
OMÌ	‰›‹œ›ÜÚOOOLJ^Û‹›\ÜÛÛSX]›Z[ŠŒ‹›\ÜÛÛŠÙ
NÚYŠ‹›\ÜÛÛLŒ
^Û‹œ›ÜÚOLŽÜ\œÚ\ÝØ[YJ
Nß__Y[ÙH‹šÚOSX]›Z[ŠØZRÚSX^MÊ
K‹šÚJÙ
ŒŠNÂšYŠ[L	‰š[OOLŠ\ØZP]XÚÌMÊ[
NÚYŠ‹˜XÝ[ÛŠ^Ü‹˜XÝ[Û‹
ÏYØÛÛœÝO\‹˜XÝ[ÛŽÚYŠK\OOOIÚØ[YIÉ‰˜KKŽI‰ˆXK™š\™Y
^ØK™š\™Y]YNÜ‹˜™X[O^Þœ^Y\‹ž
ØK™
LNœ^Y\‹žKMŒ
ØK™JL˜K™N˜K™K‹ßNØÛÛœÝ\™Ù]\‹œÜ\ŸØZU\™Ù]MŽ

K]\™Ù]ž\^Y\‹žO]\™Ù]žK\^Y\‹žK›ÜØ\™]
˜K™
ÝJ˜K™KXÜ›ÜÜÏSX]˜XœÊ
˜K™K]J˜K™
NÚYŠ›ÜØ\™L	‰™›ÜØ\™	‰˜XÜ›ÜÜÏL
\ØZR]\™Ù]MÊØZQ[XYÙLMÊÍJJNÚYŠØZSX\MÊ
OOOL	‰›‹œ›ÜÚOOOL‰‰“X]š\Ý
^Y\‹žMÌ^Y\‹žKMŒŒ
ONL
^Û‹šØ[YO]YNÛ‹šÚP›\Ý]YNÛ‹œ›ÜÚOLÎÜ\œÚ\ÝØ[YJ
Nß_ZYŠKXK›X^
\‹˜XÝ[Û[[ßB™›ÜŠÛÛœÝÈÙˆ‹œÚÝ
^ÜËOYÜËž
Ï\Ë™
™ÜËžJÏ\Ë™J™ØÛÛœÝ\‹œÜ\ŸØZU\™Ù]MŽ

NÚYŠX]š\Ý
Ëž]žËžKJžKMJJOÌ	‰œËŒ
^ÜØZR]\™Ù]MÊØZQ[XYÙLMÊŒ
JNÜËLß_\‹œÚÝ\‹œÚÝ™š[\ŠÏOœËŒ
NÚYŠ‹˜™X[J^Ü‹˜™X[KOYÚYŠ‹˜™X[KL
\‹˜™X[O[[ßB˜ÛÛœÝÜ\\‹œÜ\ŽÚYŠÜ\Š^ÜÜ\‹˜ÙOYÚYŠÜ\‹Ú[™Œ
^ÜÜ\‹Ú[™OYÚYŠÜ\‹Ú[™L
^ÚYŠX]š\Ý
^Y\‹ž\Ü\‹ž^Y\‹žK\Ü\‹žJOMÌ
^Ü^Y\‹šO\ØZRMÊ
J‹ŒLŽÜ^Y\‹œ™YÙ[•ØZ]LÎß\Ü\‹˜ÙL‹Žß_Y[ÙHYŠÜ\‹˜ÙL
\Ü\‹Ú[™KŽÚYŠ^Y\‹šŒ	‰œ^Y\‹š\ØZRMÊ
J‹Œ‰‰›‹œÜ\‘[XYÙO\Ü\‹›X^
‹ŒJ[‹ž™[šØZT™XYO]YNÚYŠ^Y\‹šL
^Ü‹œÜ\[[Û‹ž™[šØZT™XYOY˜[ÙNÜØZQX]MÌŠ˜[ÙJNÜ™]\›Žß_BœØZT™YÙ[ŒMŽJ
NÚYŠ‹˜Z[š[™ÏŒ	‰ˆ\^Y\‹›[Ýš[™É‰ˆ\‹œÜ\Š^Ü‹˜Z[š[™ËOYÜØZU˜Z[ŒMÊ
Nß\‹œØ]™JÏYÚYŠ‹œØ]™OM
^Ü‹œØ]™OLÜ\œÚ\ÝØ[YJ
Nß\ØZRYMÊ
NßB˜ÛÛœÝ\]P™Y›Ü™LMÏ]\]NÝ\]OY[˜Ý[ÛŠ
^Ü™]\›ˆØZLMÊ
OÜØZU\]LMÊ
N\]P™Y›Ü™LMÊ
NßNÂ™[˜Ý[ÛˆØZQ˜]ÌMÊ
^ØÝš[XYÙTÛ[ÛÝ[™Ñ[˜X›YY˜[ÙNØÝ™š[Ý[OIÈÌMLØLØ‰ÎØÝ™š[™XÝ
Ë
NØÛÛœÝ›ÛÛOSX]›X^
ËÌMŒÌL
KÞXÛ[\
^Y\‹žUËÊŠž›ÛÛJKX]›X^
MŒUËÞ›ÛÛJJKÞOXÛ[\
^Y\‹žKRÊŠž›ÛÛJKX]›X^
LRÞ›ÛÛJJNØÝœØ]™J
NØÝœØØ[J›ÛÛK›ÛÛJNØÝ˜[œÛ]JXÞXÞJNØÛÛœÝX\\ØZSX\MÊ
K[O[X\OOLÜØZSY\ØLMÎœØZSX\ÌMÎÚYŠ[K˜ÛÛ\]I‰š[K›˜]\˜[ÚY
^ÚYŠX\OOLŠXÝ™˜]Ò[XYÙJ[KMŒL
NÙ[Ù^ØÛÛœÝÙ[VÌK‹×VÛX\KÝÏZ[KÚYÌ‹ÚZ[KšZYÚÌŽØÝ™˜]Ò[XYÙJ[K
Ù[	LŠJœÝËX]™›ÛÜŠÙ[ÌŠJœÚÝËÚMŒL
Nß_XÝ™›ÛIØ›ÛN[Û›ÜÜXÙIÎØÝ^[YÛIØÙ[\‰ÎØÝ›[™UÚYMÂšYŠX\OOL
^ÜØZTÜš]LMÊËX]™›ÛÜŠÛØÚÊŒŠINÌŒŒL
NØÝœÝ›ÚÙTÝ[OIÈÌMLÎ	ÎØÝ™š[Ý[OIÈÙ™™XÉÎØÝœÝ›ÚÙU^
	ÓXY\Ý›È›ÜÚIËÌL
NØÝ™š[^
	ÓXY\Ý›È›ÜÚIËÌL
NßB˜ÛÛœÝ\ØZT[ŒMË\‹œÜ\ŸÞŒLLŒNÍNÚYŠX\OOM
^ØÝ™š[Ý[OIÈÎN˜IÎØÝ™š[™XÝ
žNKžKMÌNÌ
NØÝ™š[Ý[OIÈÙØŒÌ	ÎØÝ™š[™XÝ
žLÍKžKNÌŠNØÝ™š[™XÝ
žMLžKMLL
NØÝ™š[Ý[OIÈÙ™™XÍIÎØÝ™š[^
‹œÜ\ÓM
	ÐÓÓPUHH°àPÕPÐIË	ÔÔT”’S‘ÉË	ÐÓÓPUHH‘RS“ÉË	ÐS•‘S“PSˆ0å•°ç1g°ç	ÊN“M
	ÑS•‘SSRQS•ÉË	ÕRS’S‘ÉË	Õ‘RS“ÉË	Ñq'±,1,IÊKžžKLL
NÚYŠ‹œÜ\Š^ØÝ™š[Ý[OIÈÌŒYL˜IÎØÝ™š[™XÝ
žMŒžKNM‹LŒ
NØÝ™š[Ý[OIÈÙŒÍŒÍÉÎØÝ™š[™XÝ
žMŒžKNM‹LŒ
˜Û[\
šÝ›X^JK
NÚYŠÚ[™Œ
^ØÝœÝ›ÚÙTÝ[OIÈÙ™XM	ÎØÝ˜™YÚ[”]

NØÝ™[\ÙJžžKMÌLX]”JŒŠNØÝœÝ›ÚÙJ
Nß__B˜ÛÛœÝO\‹˜XÝ[ÛŽÛ]›ÝÏ\^Y\‹Ø[Ñ\OOIØ˜XÚÉÏÌNœ^Y\‹Ø[Ñ\OOIÜšYÚ	ÏÌŽœ^Y\‹Ø[Ñ\OOIÛY	ÏÌÎŒœ˜[YO\^Y\‹›[Ýš[™ÏÓX]™›ÛÜŠ‹œ\ÙJINŒ›\Y˜[ÙNÚYŠOË\OOOIÜ[˜Ú	Ê^Ü›ÝÏMÙœ˜[YOSX]›Z[ŠËX]™›ÛÜŠKØK›X^
Ž
JNÙ›\\^Y\‹™˜XÙOßY[ÙHYŠOË\OOOIÚØ[YIÊ^Ü›ÝÏMNÙœ˜[YOSX]›Z[ŠX]™›ÛÜŠKËŽJJJNÙ›\XK™ßY[ÙHYŠ‹˜Ú\™Ú[™É‰ˆ\^Y\‹›[Ýš[™Ê^Ü›ÝÏMŽÙœ˜[YOSX]™›ÛÜŠÛØÚÊŽ
INßB˜Ý™š[Ý[OIÈÌŒXM‰ÎØÝ˜™YÚ[”]

NØÝ™[\ÙJ^Y\‹ž^Y\‹žKLËÌ‹LX]”JŒŠNØÝ™š[

NÚYŠ‹˜Ú\™Ú[™Ê^ØÝœÝ›ÚÙTÝ[OIÈÎ™™‰ÎÙ›ÜŠ]OLÚOŽÚJÊÊ^ØÛÛœÝ[™ÏXÛØÚÊŒŠÚJ“X]”KÌÎØÝ˜™YÚ[”]

NØÝ›[Ý™UÊ^Y\‹ž
ÓX]˜ÛÜÊ[™ÊJ^Y\‹žKLÌ
ÓX]œÚ[Š[™ÊJŒÍJNØÝ›[™UÊ^Y\‹ž
ÓX]˜ÛÜÊ[™ÊJŽ^Y\‹žKM
ÓX]œÚ[Š[™ÊJMJNØÝœÝ›ÚÙJ
Nß_\ØZTÜš]LMÊ›ÝËœ˜[YK^Y\‹ž^Y\‹žKLŒ›\
NÂ™›ÜŠÛÛœÝÈÙˆ‹œÚÝ
^ØÝ™š[Ý[OIÈØÍ˜Y™‰ÎØÝ˜™YÚ[”]

NØÝ˜\˜ÊËžËžKL‹X]”JŒŠNØÝ™š[

NßZYŠ‹˜™X[J^ØÛÛœÝ\‹˜™X[NØÝ›[™PØ\IÜ›Ý[™	ÎØÝœÝ›ÚÙTÝ[OIÈÌÍ˜˜Y™ŽNIÎØÝ›[™UÚYMNØÝ˜™YÚ[”]

NØÝ›[Ý™UÊ‹ž‹žJNØÝ›[™UÊ‹ž
Ø‹™
Ž‹žJØ‹™JŽ
NØÝœÝ›ÚÙJ
NØÝœÝ›ÚÙTÝ[OIÈÙLY™™™‰ÎØÝ›[™UÚYLÎØÝœÝ›ÚÙJ
NßXÝœ™\ÝÜ™J
NßB˜ÛÛœÝ˜]Ð™Y›Ü™LMÏY˜]ÎÙ˜]ÏY[˜Ý[ÛŠ
^Ü™]\›ˆØZLMÊ
I‰œÝ\YÜØZQ˜]ÌMÊ
N™˜]Ð™Y›Ü™LMÊ
NßNÂ™[˜Ý[ÛˆØZSY[LMÊYÙOIÜÝ]IÊ^ØÛÛœÝ\ØZTÝ]LMÊ
NÚYŠ\ØZLMÊ
J\™]\›ˆ˜[ÙNØÛÛœÝÛÜÙOSM
	ÐÓÓ•S•PT‰Ë	ÐÓÓ•S•QIË	ÐÓÓ•S•PT‰Ë	ÑUSIÊK˜XÚÏSM
	Õ“Ó‘T‰Ë	ÐPÒÉË	Õ“ÓT‰Ë	ÑÑT±,	ÊNÛ]›ÙOIÏ]ˆÛ\ÜÏHœØZKYX[ÙÌMÈˆ]K[›ËZLNÝ›Û™Ï”ÕÑTˆU‘S	ÊÓX]™›ÛÜŠ‹œÝÙ\ŠJÉÏÜÝ›Û™Ï‰ÊÓM
	ÕšYIË	ÒX[	Ë	ÕšYIË	ÐØ[‰ÊJÉÈ	ÊÓX]˜ÙZ[
^Y\‹š
JÉÈÈ	ÊÜØZRMÊ
JÉÈ0­ÈÒH	ÊÓX]™›ÛÜŠ‹šÚJJÉÈÈ	ÊÓX]™›ÛÜŠØZRÚSX^MÊ
JJÉÏÜ‰ÊÓM
	Ô™YÙ[™\˜XÚpìÛ‰Ë	Ô™YÙ[™\˜][Û‰Ë	Ô™YÙ[™\˜péðèÛÉË	ÖY[š[[›YIÊJÉÈ
ÉÊÜØZT™YÙ[”˜]LMŽJ
KÑš^Y
JJÉÈÜÈ0­È	ÊÓM
	Õ˜\ÈÈÈÚ[ˆpì[ÎÈŒ	H[ˆÛÛX˜]HÛÛˆ˜Y]‹‰Ë	ÐY\ˆÈÈÚ]Ý][XYÙNÈŒ	H\š[™È˜Y]ˆÛÛX˜]‰Ë	Ð\0ìÜÈÈÈÙ[H[›ÎÈŒ	H[HÛÛX˜]HÛÛH˜Y]‹‰Ë	Ò\Ø\œñ,^ˆÈÛˆÛÛœ˜NÈ˜Y]ˆ0í°ï1gðï™H	LŒ‰ÊJÉÏÜ‰ÎÛ]]ÛœÏV×NÂšYŠYÙOOOIÛX\	Ê^Ø›ÙJÏIÏ‰ÊÓM
	Ó][™ÈØZ^X[ˆ0­È]\È^Û\Ú]˜\ÉË	ÔØZ^X[ˆÛÜ›0­È^Û\Ú]™H›Ý]\ÉË	Ó][™ÈØZ^X[ˆ0­È›Ý\È^Û\Ú]˜\ÉË	ÔØZ^X[ˆ0ïžX\ñ,H0­È0íž™[›Ý[\‰ÊJÉÏÜ‰ÎØ]ÛœÏTÐRWÓSQTÌMË›X\

˜[YKJOO–ÓM
‹‹›˜[YJK

OOœØZU˜]™[MÊJWJNßB™[ÙHYŠYÙOOOIÝXÚ	Ê^Ø›ÙJÏIÏ¸¤h	ÊÓM
	ÐÛÛX›ÈHpì[ÜÈH]Y\ÉË	Ô[˜Ú[™ÚXÚÈÛÛX›ÉË	ÐÛÛX›ÈHÛØÛÜÈHÚ]\ÉË	Ö][\ZÈ™HZÛYHÛÛX›ÜÝIÊJÉÏÜ¸¤hH	ÊÓM
	Ô°èY˜YØHHÚIË	ÒÚH›\Ý	Ë	Ô˜Z˜YHHÚIË	ÒÚH]1,qgñ,IÊJÉÈ0­È	ÊÊ‹šÚP›\ÝÉø§$ÉÎ‰Ô›ÜÚIÊJÉÏÜ¸¤hˆ	ÊÓM
	ÐØ\™Ø\ˆÚIË	ÐÚ\™ÙHÚIË	ÐØ\œ™YØ\ˆÚIË	ÒÚHÛ\‰ÊJÉÏÜ¸¤hÈØ[YZ[YZH0­È	ÊÊ‹šØ[YOÉø§$ÉÎ“X]™›ÛÜŠ‹›\ÜÛÛŠJÉËÌŒÈ0­È›ÜÚIÊJÉÏÜ‰ÊÓM
	Ð\™[™HÛÛ›ÛHÚHÛÛˆ›ÜÚH[ˆØ[YHÝ\ÙK‰Ë	ÓX\›ˆÚHÛÛ›ÛÚ]›ÜÚH]Ø[YHÝ\ÙK‰Ë	Ð\™[™HÛÛ›ÛHHÚHÛÛH›ÜÚH[HØ[YHÝ\ÙK‰Ë	ÒØ[YHÝ\ÙHpéÚ[™H›ÜÚH[HÚHÛÛ›Û0ï°ï0í±'Ü™[‹‰ÊJÉÏÜ‰ÎßB™[ÙHYŠYÙOOOIÝ˜Z[‰Ê^Ø›ÙJÏIÏ‰ÊÓM
	Ñ[[™[˜[ZY[È°ë\ÚXÛÈ][Y[HÝÙ\ˆ]™[™\Ú\Ý[˜ÚXHHØ\XÚYYHÚKˆ›È\ØHVšHš]™[\Ë‰Ë	Ô\ÚXØ[˜Z[š[™È˜Z\Ù\ÈÝÙ\ˆ]™[[™\˜[˜ÙH[™ÚHØ\XÚ]Kˆ›ÈVÜˆ]™[Ë‰Ë	ÓÈ™Z[›È°ë\ÚXÛÈ][Y[HÝÙ\ˆ]™[™\Ú\Ý0ê›˜ÚXHHØ\XÚYYHHÚKˆÙ[HVÝH°ë]™Z\Ë‰Ë	Ñš^šZÜÙ[q'Ú][HÝÙ\ˆ]™[^X[±,ZÛ1,[1,ZÈ™HÚHØ\\Ú]\Ú[šH\1,\±,\‹ˆV™^XHÙ]š^YH[ÚË‰ÊJÉÏÜ‰ÎØ]ÛœÏVÖÓM
	ÑS•‘STˆÌÉË	ÕRSˆÌÉË	Õ‘RSTˆÌÉË	ÌÌÛˆq'±,1,IÊK

OOžÜØZT[ŒMË˜Z[š[™ÏLÌØÛÜÙQX[ÙÊ
NßWKÓM
	ÐÓÓPUHH°àPÕPÐIË	ÔÔT”’S‘ÉË	ÐÓÓPUHH‘RS“ÉË	ÐS•‘S“PSˆ0å•°ç1g°ç	ÊKØZTÜ\ŒM×WNßB™[Ù^Ø›ÙJÏIÏ‰ÊÓM
	ÑÝY\œ™\›ÈØZ^XZš[ˆ0­È›ÙÜ™\ÛÈ[™\[™Y[IË	ÔØZ^X[ˆØ\œš[Üˆ0­È[™\[™[›ÙÜ™\ÜÉË	ÑÝY\œ™Z\›ÈØZ^XZš[ˆ0­È›ÙÜ™\ÜÛÈ[™\[™[IË	ÔØZ^X[ˆØ]˜qgðéñ,\ñ,H0­È˜q'ñ,[\ñ,^ˆ[\›[YIÊJÉÏÜ–™[šØZH	ÊÛ‹ž™[šØZJÉËÌŒ0­È	ÊÓM
	ÐÛÛX˜]\ÉË	ÔÜ\œÉË	ÐÛÛX˜]\ÉË	Ñ0í°ï1gÛ\‰ÊJÉÈ	ÊÛ‹œÜ\•Ú[œÊÉÏÜ‰ÎØ]ÛœÏVÖÓM
	Õ0âPÓ’PÐTÉË	ÕPÒ’TUQTÉË	Õ0âPÓ’PÐTÉË	ÕRÓ±,ÓT‰ÊK

OOœØZSY[LMÊ	ÝXÚ	ÊWKÓM
	ÑS•‘SSRQS•ÉË	ÕRS’S‘ÉË	Õ‘RS“ÉË	Ñq'±,1,IÊK

OOœØZSY[LMÊ	Ý˜Z[‰ÊWKÓM
	Õ’PRT‰Ë	ÕU‘S	Ë	Õ’PRT‰Ë	ÔÑVPRU	ÊK

OOœØZSY[LMÊ	ÛX\	ÊWKÉÓÓS’TQPIË

OO›Û[š\YXLMÊ
WKÓM
	ÔVTÉË	ÔPÑTÉË	ÔpáÐTÉË	ÒT’ÓT‰ÊK

OOœ˜XÙSY[J	Û][IÊWKÓM
	ÑÕPT‘TˆSˆ•P‘IË	ÐÓÕQÐU‘IË	ÔÐSTˆH•U‘SIË	Ð•SUHÐVQU	ÊK

OOœÞ[˜Ô™XÛÝ™\žMMJYJWKÓM
	ÐÓÓ‘’QÕTPÒpäÓ‰Ë	ÔÑUS‘ÔÉË	ÐÓÓ‘’QÕTpáðåQTÉË	ÐVPT“T‰ÊKÙ][™ÜÌMWWNßB˜›ÙJÏIÏÙ]‰ÎÚYŠYÙHOOIÜÝ]IÊX]ÛœËœ\Ú
Ø˜XÚË

OOœØZSY[LMÊ
WJNØ]ÛœËœ\Ú
ØÛÜÙKÛÜÙQX[Ù×JNÜÚÝÑX[ÙÊ	ÔÐRVPSˆ0­ÈÓS’P“V–‰ËYÙOOOIÛX\	ÏÓM
	ÓUS‘ÈÐRVPS‰Ë	ÔÐRVPSˆÓÔ“	Ë	ÓUS‘ÈÐRVPS‰Ë	ÔÐRVPSˆ0ç–PTÒIÊN‰ÔÕÑTˆU‘S	Ë›ÙK]ÛœÊNÜ™]\›ˆYNßB˜ÛÛœÝYXP™Y›Ü™LMÏ[Û[š\YXLMÎÛÛ[š\YXLMÏY[˜Ý[ÛŠ‹‹˜J^ÜYXP™Y›Ü™LMÊ‹‹˜JNØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	Ø]Û‰ÊNØ‹^ÛÛ[IÑ˜YÛÛˆ˜[0­ÈØZ^X[‰ÎØ‹›Û˜ÛXÚÏJ
OOœÚÝÑX[ÙÊ	ÓÓS’TQPIË	ÔØZ^X[ˆ0­ÈXY\Ý›È›ÜÚIË	Ï]ˆ]K[›ËZLN‰ÊÓM
	ÔØZ^X[ŽˆÝY\œ™\›ÈHÚKˆ›ÙÜ™\ÚpìÛˆ[™\[™Y[HYYX[HÝÙ\ˆ]™[H[™[˜[ZY[Ë‰Ë	ÔØZ^X[ŽˆÚHØ\œš[Ü‹ˆ[™\[™[›ÙÜ™\ÜÚ[Ûˆ›ÝYÚÝÙ\ˆ]™[[™˜Z[š[™Ë‰Ë	ÔØZ^X[ŽˆÝY\œ™Z\›ÈHÚKˆ›ÙÜ™\ÜðèÛÈ[™\[™[HÜˆÝÙ\ˆ]™[H™Z[›Ë‰Ë	ÔØZ^X[ŽˆÚHØ]˜qgðéñ,\ñ,KˆÝÙ\ˆ]™[™Hq'Ú][H[H˜q'ñ,[\ñ,^ˆ[\›[YK‰ÊJÉÏÜ‰ÊÓM
	ÓXY\Ý›È›ÜÚNˆXY\Ý›ÈHØ[YHÝ\ÙNÈ[œÙpìXHÛÛ›ÛHÚHHØ[YZ[YZK‰Ë	ÓX\Ý\ˆ›ÜÚNˆØ[YHÝ\ÙHX\Ý\ŽÈXXÚ\ÈÚHÛÛ›Û[™Ø[YZ[YZK‰Ë	ÓY\Ý™H›ÜÚNˆY\Ý™HHØ[YHÝ\ÙNÈ[œÚ[˜HÛÛ›ÛHHÚHHØ[YZ[YZK‰Ë	Õ\ÝH›ÜÚNˆØ[YHÝ\ÙH\Ý\ñ,NÈÚHÛÛ›Û0ï™HØ[YZ[YZH0í±'Ü™]\‹‰ÊJÉÏÜ‰ÊÓM
	Ñ\Øðè[™\ˆ›È\ÜÛšX›H\˜H\ÝH˜^˜K‰Ë	ÔØØ[›™\ˆ[˜]˜Z[X›H›Üˆ\È˜XÙK‰Ë	ÔØØ[›™\ˆ[™\ÜÛ°ë]™[\˜H\ÝH˜péØK‰Ë	ÐH1,\šÝH\˜^q,Xñ,HÝ[[±,[[X^‹‰ÊJÉÏÜÙ]‰ËÖÓM
	Õ“Ó‘T‰Ë	ÐPÒÉË	Õ“ÓT‰Ë	ÑÑT±,	ÊK

OO›Û[š\YXLMÊ
WWJNÉ
	ÈÙX[ÙØ]ÛœÉÊKœ™\[™
ŠNßNÂœ˜XÙSX™[ÌMM–ÔÐRLM×OVÉÔØZ^X[‰Ë	ÔØZ^X[‰Ë	ÔØZ^X[‰Ë	ÔØZ^X[‰×NØÛÛœÝ˜XÙT›ÝÜÐ™Y›Ü™LMÏ\˜XÙT›ÝÜÌMMNÜ˜XÙT›ÝÜÌMMOY[˜Ý[ÛŠØ]YÛÜžJ^Ü™]\›ˆØ]YÛÜžOOOIÛ][IÏÖÉØ™[™IËÖTÕSLMÐRLM×Nœ˜XÙT›ÝÜÐ™Y›Ü™LMÊØ]YÛÜžJNßNÂ˜ÛÛœÝ˜XÙP\™Y›Ü™LMÏ\Z[˜XÙP\MMŽÜZ[˜XÙP\MMY[˜Ý[ÛŠ
^Ü˜XÙP\™Y›Ü™LMÊ
NØÛÛœÝÏYØÝ[Y[œ]Y\žTÙ[XÝÜŠ	ÖÙ]KX\MMH‰ÊÔÐRLMÊÉÈ—IÊNÚYŠÉ‰œØZP]\ÌMË˜ÛÛ\]I‰œØZP]\ÌMË›˜]\˜[ÚY
^ØËÚYMLLŽØËšZYÚMØÛÛœÝØÏXË™Ù]ÛÛ^
	Ì™	ÊK\ØZSY]LMÖÌVÌNØØË˜ÛX\”™XÝ
LL‹
NØØËš[XYÙTÛ[ÛÝ[™Ñ[˜X›YY˜[ÙNØØË™˜]Ò[XYÙJØZP]\ÌMË‹‹™‹LÌŒL‹
Nß_NÂ˜ÛÛœÝ˜XÙSY[P™Y›Ü™LMÏ\˜XÙSY[NÜ˜XÙSY[OY[˜Ý[ÛŠØ]YÛÜžO\˜XÙPØ]YÛÜžLMMJ^Ü˜XÙSY[P™Y›Ü™LMÊØ]YÛÜžJNØÛÛœÝØ\™YØÝ[Y[œ]Y\žTÙ[XÝÜŠ	Ëœ˜XÙKIÊÔÐRLMÊNÚYŠØ\™
^ØÛÛœÝ\ØZTÝ]LMÊ˜XÙOOOTÐRLMÏÜ^Y\ŽŠ›Ùš[\ÖÔÐRLM×OËœ^Y\ŸßJJNØØ\™œ]Y\žTÙ[XÝÜŠ	Ëœ˜XÙKY\ØÌMM‰ÊK^ÛÛ[SM
	ÑÝY\œ™\›ÈØZ^XZš[‰Ë	ÔØZ^X[ˆØ\œš[Ü‰Ë	ÑÝY\œ™Z\›ÈØZ^XZš[‰Ë	ÔØZ^X[ˆØ]˜qgðéñ,\ñ,IÊNØØ\™œ]Y\žTÙ[XÝÜŠ	Ëœ˜XÙK[]™[MM‰ÊK^ÛÛ[IÔÕÑTˆU‘S	ÊÓX]™›ÛÜŠ‹œÝÙ\ŠNØØ\™œ]Y\žTÙ[XÝÜŠ	Ëœ˜XÙK\›ÙÜ™\ÜÌMM‰ÊKœ™[[Ý™J
NßXÛÛœÝÝX]OYØÝ[Y[œ]Y\žTÙ[XÝÜŠ	Ëœ˜XÙK\[™[MMˆXY\ˆ	ÊNÚYŠÝX]J\ÝX]K^ÛÛ[SM
	ÔÙZ\È˜^˜\È0­È›ÙÜ™\ÛÜÈ[™\[™Y[\ÉË	ÔÚ^˜XÙ\È0­È[™\[™[›ÙÜ™\ÜÉË	ÔÙZ\È˜péØ\È0­È›ÙÜ™\ÜÛÜÈ[™\[™[\ÉË	Ð[1,H1,\šÈ0­È˜q'ñ,[\ñ,^ˆ[\›[YIÊNßNÂ˜ÛÛœÝØZPÜÜÌMÏYØÝ[Y[˜Ü™X]Q[[Y[
	ÜÝ[IÊNÜØZPÜÜÌMË^ÛÛ[X›ÙKœØZLMÈÚYŠŽ››Ý
Ú›Þ\ÝXÚÊN››Ý
ÝØ\Ý
^Ù\Ü^N››Û™HZ[\Ü[X›ÙKœØZLMÈÜÛ™KX]ÛŒLK›ÙKœØZLMÈÜÛ™LL^Ù\Ü^N››Û™HZ[\Ü[HÜØZKZYMÖÚY[—^Ù\Ü^N››Û™HZ[\Ü[HÜØZKZYMÞÜÜÚ][ÛŽ˜XœÛÛ]NÚ[œÙ]ŒÜÚ[\‹Y]™[Î››Û™NØÛÛÜŽˆÙ™™Ù›Û˜›ÛÛ[\
LK]ËN
H[Û›ÜÜXÙNÞ‹Z[™^ŒMŸHÜØZKZYMÈ]ÛžÜÚ[\‹Y]™[Î˜]]ÎØÛÛÜŽˆÙ™™Ø˜XÚÙÜ›Ý[™›[™X\‹YÜ˜YY[
MYYËÌMÌÌÍÌÌXŒ™JNØ›Ü™\ŽŒœÛÛYÙNNMÍŽØ›Ü™\‹\˜Y]\ÎŒLœÜY[™ÎŽ\MÙ›Ûš[š\š]ÛZ[‹ZZYÚÝÝXÚXXÝ[ÛŽ››Û™_HÜØZKZYMÈ]ÛŽ™\ØX›YÛÜXÚ]N‹HÜØZK]š][ÌMÞÜÜÚ][ÛŽ˜XœÛÛ]NÝÜŒÉNÛYŒÉNÝÚYŒÌ‰NÜY[™ÎŒLœØ˜XÚÙÜ›Ý[™ˆÌŒYŒÍNØ›Ü™\‹[Y\ÛÛYÙ™ŽLL™NØ›Ü™\‹\˜Y]\ÎœNHÜØZK]š][ÌMÈÝ›Û™ÞÙ\Ü^N˜›ØÚÎØÛÛÜŽˆÙ™˜ŒMŽÙ›Û\Ú^™NŒKŒY[_HÜØZK]š][ÌMÈ›Y]\ŒMÞÚZYÚŽ\Ø˜XÚÙÜ›Ý[™ˆÌLŒŒÍØ›Ü™\‹\˜Y]\ÎœÛX\™Ú[ŽœÛÝ™\™›ÝÎšY[ŸHÜØZK]š][ÌMÈ^Ù\Ü^N˜›ØÚÎÚZYÚŒL	NØ˜XÚÙÜ›Ý[™›[™X\‹YÜ˜YY[
LYËÙÍŒ™Ù™˜™MJ_HÜØZK]š][ÌMÈÜØZKZÚX˜\ŒMÞØ˜XÚÙÜ›Ý[™›[™X\‹YÜ˜YY[
LYËÌMÍYL‹ÍØ™MÙ™Š_HÜØZK[Y[LMÞÜÜÚ][ÛŽ˜XœÛÛ]NÜšYÚŒÉNÝÜŒÉ_HÜØZK\XÙLMÞÜÜÚ][ÛŽ˜XœÛÛ]NÝÜINÛY	NÝ^\ÚYÝÎŒœœÌLXÌ˜_HÜØZK[Øš™XÝ]™LMÞÜÜÚ][ÛŽ˜XœÛÛ]NÝÜŒL‰NÛY	NÛX^]ÚYŒÎ	NØÛÛÜŽˆÙ™™LØMNÝ^\ÚYÝÎŒœœÌLXÌ˜_HÜØZKXXÝ[ÛœÌMÞÜÜÚ][ÛŽ˜XœÛÛ]NØ›ÝÛN	NÜšYÚŒÉNÙ\Ü^N™ÜšYÙÜšY][\]KXÛÛ[[œÎœ™\X]
‹Z[›X^
MYœŠJNÙØ\ŽÝÚYŒÌ	_HÜØZKXXÝ[ÛœÌMÈ]ÛžÛZ[‹ZZYÚMœHÜØZK][ÌMÞÜÜÚ][ÛŽ˜XœÛÛ]NÛYÉNØ›ÝÛN	_KœØZKYX[ÙÌMÞØÛÛÜŽˆÙ™™LØŒNÛ[™KZZYÚŒKßKœ˜XÙK\ØZ^X[ŒMÞËK\˜XÙKXÛÛÜŽˆÙŒM™ÌˆZ[\Ü[Ø›Ü™\‹XÛÛÜŽˆÙ™ŽMHZ[\Ü[Kœ˜XÙK\ØZ^X[ŒMÈØ[˜\ÞØ˜XÚÙÜ›Ý[™œ˜YX[YÜ˜YY[
[\ÙKÎXÌÍÌXËÌNLŒNJ_Kœ˜XÙKXØ\™ÌMM‹›][LMMžÙÜšY][\]KXÛÛ[[œÎœ™\X]
ËZ[›X^
YœŠJHZ[\Ü[X›ÙKœØZLMÈÚ›Þ\ÝXÚÞÙš[\ŽšYK\›Ý]JMYYÊ_PYYXJX^]ÚYL
^ÈÜØZK]š][ÌMÞÝÚYŒÍ‰NÜY[™ÎÜHÜØZKXXÝ[ÛœÌMÞÝÚYŒÍ	NÙØ\\HÜØZKZYMÈ]ÛžÜY[™ÎÜÙ›Û\Ú^™NŒLHÜØZK[Øš™XÝ]™LMÞÙ›Û\Ú^™NŒL_XÙØÝ[Y[šXY˜\[™
ØZPÜÜÌMÊNÂ˜ÛÛœÝØZRY›ÞMÏYØÝ[Y[˜Ü™X]Q[[Y[
	ÜÙXÝ[Û‰ÊNÜØZRY›ÞMËšYIÜØZKZYMÉÎÜØZRY›ÞMËšY[]YNÜØZRY›ÞMËœÙ]]šX]J	Ù]K[›ËZLN‰Ë	ÉÊNÜØZRY›ÞMËš[›™\’SIÏ]ˆYHœØZK]š][ÌMÈÝ›Û™ÈYHœØZK\ÝÙ\ŒMÈÜÝ›Û™ÏÜ[ˆYHœØZKZX[MÈÜÜ[]ˆÛ\ÜÏH›Y]\ŒMÈHYHœØZKZX[˜\ŒMÈÚOÙ]Ü[ˆYHœØZKZÚLMÈÜÜ[]ˆÛ\ÜÏH›Y]\ŒMÈHYHœØZKZÚX˜\ŒMÈÚOÙ]Ù]]ÛˆYHœØZK[Y[LMÈ¸¦,QS•OØ]ÛÜ[ˆYHœØZK\XÙLMÈÜÜ[YHœØZK[Øš™XÝ]™LMÈÜ]ˆYHœØZKXXÝ[ÛœÌMÈ]ÛˆYHœØZK\[˜ÚMÈ‰ÊÓM
	ÑÓÓTÉË	ÐÓÓP“ÉË	ÑÓÓTÉË	ÒÓÓP“ÉÊJÉÏØ]Û]ÛˆYHœØZKX›\ÝMÈ’ÒOØ]Û]ÛˆYHœØZKXÚ\™ÙLMÈ‰ÊÓM
	ÐÐT‘ÐTˆÒIË	ÐÒT‘ÑHÒIË	ÐÐT”‘QÐTˆÒIË	ÒÒHÓT‰ÊJÉÏØ]Û]ÛˆYHœØZKZØ[YLMÈ’ÐSQRSQROØ]ÛÙ]]ÛˆYHœØZK][ÌMÈ”“ÔÒH8¥áØ]Û‰ÎÉ
	ÈÙØ[YIÊK˜\[™
ØZRY›ÞMÊNÉ
	ÈÜØZK[Y[LMÉÊK›Û˜ÛXÚÏJ
OOœØZSY[LMÊ
NÉ
	ÈÜØZK][ÌMÉÊK›Û˜ÛXÚÏ\ØZT›ÜÚLMÎÂ™›ÜŠÛÛœÝÚYW[ÙˆÖÉÜØZK\[˜ÚMÉËKÉÜØZKX›\ÝMÉËWKÉÜØZKZØ[YLMÉË×WJ^ØÛÛœÝI
	ÈÉÊÚY
NØ‹›ÛœÚ[\™ÝÛYOOžÙKœ™]™[Y˜][

NÜØZP]XÚÌMÊJNßNßB˜ÛÛœÝÚ\™ÙP]ÛŒMÏI
	ÈÜØZKXÚ\™ÙLMÉÊNØÚ\™ÙP]ÛŒMË›ÛœÚ[\™ÝÛYOOžÙKœ™]™[Y˜][

NØÚ\™ÙP]ÛŒMËœÙ]Ú[\Ø\\™OËŠKœÚ[\’Y
NÜØZPÚ\™ÙLMÊYJNßNÙ›ÜŠÛÛœÝ]ˆÙˆÉÜÚ[\\	Ë	ÜÚ[\˜Ø[˜Ù[	Ë	ÛÜÝÚ[\˜Ø\\™I×JXÚ\™ÙP]ÛŒMË˜Y]™[\Ý[™\Š]‹

OOœØZPÚ\™ÙLMÊ˜[ÙJJNÙØÝ[Y[˜Y]™[\Ý[™\Š	ÚÙ^]\	ËOOžÚYŠKšÙ^KÓÝÙ\Ø\ÙJ
OOOIØÉßKšÙ^OOOIÌÉÊ\ØZPÚ\™ÙLMÊ˜[ÙJNßJNÝÚ[™ÝË˜Y]™[\Ý[™\Š	Ø›\‰Ë

OOœØZPÚ\™ÙLMÊ˜[ÙJJNÂ‹ËÈ™\œÚ[Û™YÛÛ\]Xš[]H[™[ÜNˆH^\Ý[™Èš]™K\›Ùš[HÙ\™\ˆÙY\È]ÈØÚ[XK‚‹ËÈHÚ^›Ùš[H˜]™[È[XÝ\È[ˆ^[œÚ[Ûˆ[™\È™\šYšYYžHH™XY˜XÚË‚™[˜Ý[ÛˆÛÝYXÚÌMÊØ]™J^ÚYŠ\Ø]™OËœ›Ùš[\ÏË–ÔÐRLM×I‰œØ]™OËœ˜XÙHOOTÐRLMÊ\™]\›ˆØ]™NØÛÛœÝÚ\™OXÛX[ÛÛ™JØ]™JKÚ^\Ø]™Kœ˜XÙOOOTÐRLMÏÞË‹‹œØ]™Kœ›Ùš[\ÖÔÐRLM×K^Y\ŽœØ]™Kœ^Y\‹]Y\ÝœØ]™Kœ]Y\Ý›Û™NœØ]™Kž›Û™K›Û™TÝ]\ÎœØ]™Kž›Û™TÝ]\ËÚ]š[Ý]\ÎœØ]™K˜Ú]š[Ý]\Ë]ÎœØ]™K›]Ë\ØÛÝ™\™YœØ]™K™\ØÛÝ™\™YÜ[™YœØ]™K›Ü[™Y›ÜÜÕ[Y\ŽœØ]™K˜›ÜÜÕ[Y\ŸNœØ]™Kœ›Ùš[\ÖÔÐRLM×NÝÚ\™K™^[œÚ[ÛŒMÏ^ÜØÚ[XNŒKXÝ]™NœØ]™Kœ˜XÙOOOTÐRLMË›Ùš[N˜ÛX[ÛÛ™JÚ^
_NÙ[]HÚ\™Kœ›Ùš[\ÖÔÐRLM×NÚYŠØ]™Kœ˜XÙOOOTÐRLMÊ^ØÛÛœÝ˜\ÙO]Ú\™Kœ›Ùš[\Ë›Û[š_œ™\Ú›Ùš[J
NÙ›ÜŠÛÛœÝÈÙˆÉÜ^Y\‰Ë	Ü]Y\Ý	Ë	Þ›Û™IË	Þ›Û™TÝ]\ÉË	ØÚ]š[Ý]\ÉË	Û]ÉË	Ù\ØÛÝ™\™Y	Ë	ÛÜ[™Y	Ë	Ø›ÜÜÕ[Y\‰×J]Ú\™VÚ×OXÛX[ÛÛ™J˜\ÙVÚ×OÏÊÏOOIØ›ÜÜÕ[Y\‰ÏÌšÏOOIØÚ]š[Ý]\ÉÏÞßN˜˜\ÙVÚ×JJNÝÚ\™Kœ˜XÙOIÛÛ[šIÎß\™]\›ˆÚ\™NßB™[˜Ý[ÛˆÛÝY[œXÚÌMÊÚ\™J^ÚYŠ]Ú\™OË™^[œÚ[ÛŒMÊ\™]\›ˆÚ\™NØÛÛœÝ^]Ú\™K™^[œÚ[ÛŒMËY^œ›Ùš[NÚYŠ^œØÚ[XHOOL_\Ëœ^Y\ËœØZ^X[ŒMßS[X™\‹š\Ñš[š]Jœ^Y\‹œØZ^X[ŒMËœÝÙ\Š_\ØZV›Û™LMÊž›Û™JJ]›ÝÈ\œ›ÜŠM
	Ñ[\™š[ØZ^X[ˆ[™\Ü[È\Ý0èH[˜ÛÛ\]Ë‰Ë	ÕHÛÝYØZ^X[ˆ›Ùš[H\È[˜ÛÛ\]K‰Ë	ÓÈ\™š[ØZ^X[ˆÈ˜XÚÝ\\Ý0èH[˜ÛÛ\]Ë‰Ë	Ð[]ZÚHØZ^X[ˆ›Ùš[HZÜÚZË‰ÊJNØÛÛœÝØ]™OXÛX[ÛÛ™JÚ\™JNÙ[]HØ]™K™^[œÚ[ÛŒMÎÜØ]™Kœ›Ùš[\ÖÔÐRLM×OXÛX[ÛÛ™J
NÚYŠ^˜XÝ]™J^Ù›ÜŠÛÛœÝÈÙˆÉÜ^Y\‰Ë	Ü]Y\Ý	Ë	Þ›Û™IË	Þ›Û™TÝ]\ÉË	ØÚ]š[Ý]\ÉË	Û]ÉË	Ù\ØÛÝ™\™Y	Ë	ÛÜ[™Y	Ë	Ø›ÜÜÕ[Y\‰×J\Ø]™VÚ×OXÛX[ÛÛ™JÚ×OÏÊÏOOIØ›ÜÜÕ[Y\‰ÏÌžßJJNÜØ]™Kœ˜XÙOTÐRLMÎß\™]\›ˆØ]™NßB˜ÛÛœÝ™\]Y\Ý™Y›Ü™LMÏ\™\]Y\Ý™XÛÝ™\žMMNÜ™\]Y\Ý™XÛÝ™\žMMOX\Þ[˜È[˜Ý[ÛŠÛÙK›ÙK™]š[Ý\ÏY˜[ÙJ^ØÛÛœÝXÚÙYX›ÙOËœØ]™OØÛÝYXÚÌMÊ›ÙKœØ]™JN›[™\Ý[X]ØZ]™\]Y\Ý™Y›Ü™LMÊÛÙKXÚÙYÞË‹‹˜›ÙKØ]™NœXÚÙYN˜›ÙK™]š[Ý\ÊNÚYŠXÚÙYË™^[œÚ[ÛŒMÊ^ØÛÛœÝÚXÚÏX]ØZ]™\]Y\Ý™Y›Ü™LMÊÛÙK[™Yš[™Y˜[ÙJNÚYŠÚXÚËœ™]š\Ú[ÛˆOO\™\Ý[œ™]š\Ú[ÛŸ”ÓÓ‹œÝš[™ÚYžJÚXÚËœØ]™OË™^[œÚ[ÛŒMÊHOOR”ÓÓ‹œÝš[™ÚYžJXÚÙY™^[œÚ[ÛŒMÊJ]›ÝÈ\œ›ÜŠM
	Ó›ÈÙHÛÛ™š\›pìÈ[™\Ü[ÈØZ^X[‹ˆH\YHØØ[\›X[™XÙHÝX\™YK‰Ë	ÕHØZ^X[ˆÛÝY˜XÚÝ\Ø\È›ÝÛÛ™š\›YYˆHØØ[Ø]™H\È™\Ù\™Y‰Ë	ÓÈ˜XÚÝ\ØZ^X[ˆ°èÛÈ›ÚHÛÛ™š\›XYËˆÈØ]™HØØ[›ÚH™\Ù\˜YË‰Ë	ÔØZ^X[ˆ[]YYq'ÚHñ'Ü[[›XY1,KˆY\™[Ø^q,]ÛÜ[™K‰ÊJNßZYŠ™\Ý[œØ]™J\™\Ý[œØ]™OXÛÝY[œXÚÌMÊ™\Ý[œØ]™JNÜ™]\›ˆ™\Ý[ßNÂ‚˜ÛÛœÝÛÛY™Y›Ü™LMÏZ\ÔÛÛYÚ\ÔÛÛYY[˜Ý[ÛŠK‹‹˜J^Ü™]\›ˆØZLMÊ
OÜØZP›ØÚÙYMÊJNœÛÛY™Y›Ü™LMÊK‹‹˜JNßNÂ˜ÛÛœÝÚÚ[œÐ™Y›Ü™LMÏ\ÚÚ[“Y[NÜÚÚ[“Y[OY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÜØZSY[LMÊ
NœÚÚ[œÐ™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝ›ØœÐ™Y›Ü™LMÏZ›ØœÓY[NÚ›ØœÓY[OY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÙ˜[ÙNš›ØœÐ™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝ[™Y›Ü™LMÏ[[“Y[NÛ[“Y[OY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÙ˜[ÙN›[™Y›Ü™LMÊ‹‹˜JNßNÂ˜ÛÛœÝšX[™Y›Ü™LMÏ\Ý\šX[MNÜÝ\šX[MOY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØZLMÊ
OÙ˜[ÙNšX[™Y›Ü™LMÊ‹‹˜JNßNÂ™[˜Ý[ÛˆØZTÝ[[X\žLMÊØ]™J^Ü™]\›ˆÉÛÛ[šIË	ÛÜÛ[ÉË	Ø[›Ù]IË	Ø™[™IËÖTÕSLMÐRLM×K›X\
YOžØÛÛœÝZYOO\Ø]™Kœ˜XÙOÜØ]™Kœ^Y\ŽœØ]™Kœ›Ùš[\ÖÚYOËœ^Y\ŽÚYŠYOOTÐRLMÊ\™]\›ˆ	ÔØZ^X[ˆ0­ÈÕÑTˆU‘S	ÊÓX]™›ÛÜŠËœØZ^X[ŒMÏËœÝÙ\ŸL
NÜ™]\›ˆM
‹‹œ˜XÙSX™[ÌMM–ÚYJJÉÈ0­È	ÊÓM
	Óš]™[	Ë	Ó]™[	Ë	Ó°ë]™[	Ë	ÔÙ]š^YIÊJÉÈ	ÊÊË›]™[JNßJKš›Ú[Š	Ïœ‰ÊNßB™š[™™\ÝÜ™MŒÏX\Þ[˜È[˜Ý[ÛŠ™]š[Ý\Ê^ØÛÛœÝÛÙO[›Ü›X[^™PÛÙMMJ	
	ÈÜ™XÛÝ™\š[œ]MIÊK˜[YJNÚYŠK×–ÐKQŒNW^ÌÌŸIË\Ý
ÛÙJJ^É
	ÈÜ™XÛÝ™\™\œ›ÜMIÊK^ÛÛ[SM
	ÐÛÛ\YX˜H[ðìÙYÛÈÛÛ\]Ë‰Ë	ÐÚXÚÈH[ÛÙK‰Ë	ÐÛÛ™š\˜HÈðìÙYÛÈÛÛ\]Ë‰Ë	Õ[HÛÙHÛÛ›Û]‰ÊNÜ™]\›Žß]ž^ØÛÛœÝ]OX]ØZ]™\]Y\Ý™XÛÝ™\žMMJÛÙK[™Yš[™Y™]š[Ý\ÊNÚYŠ]˜[YØ]™MMJ]KœØ]™JJ]›ÝÈ\œ›ÜŠM
	Ñ[™\Ü[È›È\ÈÛÛ\]X›K‰Ë	ÕH˜XÚÝ\\È[˜ÛÛ\]X›K‰Ë	ÓÈ˜XÚÝ\0êH[˜ÛÛ\]0ë]™[‰Ë	ÖYYZÈ^][\Ý^‹‰ÊJNÜÚÝÑX[ÙÊ	ÓÓS’P“V–‰ËM
	ÐÛÛ™š\›X\ˆ™\Ý]\˜XÚpìÛ‰Ë	ÐÛÛ™š\›H™\ÝÜ™IË	ÐÛÛ™š\›X\ˆ™\Ý]\˜péðèÛÉË	ÑÙ\šHpïÛ[Y^ZHÛ˜^[IÊK	Ï]ˆ]K[›ËZLN‰ÊÜØZTÝ[[X\žLMÊ]KœØ]™JJÉÏÜ‰ÊØÛÝY]MÍÊ]K\]Y]
JÉÏÜ‰ÊÓM
	ÔÙH™\Ý]\˜[ˆÜÈ\™š[\È[™\Ü[ËˆÙHÛÛœÙ\˜H[˜HÛÜXHØØ[[\ÈH™Y[\^˜\ˆH\YK‰Ë	ÕH˜XÚÝ\›Ùš[\ÈÚ[™H™\ÝÜ™YˆHØØ[ÛÜH\ÈÙ\™Y›Ü™H™\XÚ[™ÈHØ]™K‰Ë	ÓÜÈ\™š\ÈÈ˜XÚÝ\Ù\°èÛÈ™\Ý]\˜YÜËˆ[XHðìÜXHØØ[0êHX[YH[\ÈHÝXœÝ]ZpéðèÛË‰Ë	ÖYYZÈ›Ùš[\šHÙ\šHpïÛ[™XÙZËˆØ^q,]q'ÚqgÝ\š[YY[ˆ0í›˜ÙHY\™[š\ˆÛÜXH][\‹‰ÊJÉÏÜÙ]‰ËÖÓM
	Ô‘TÕUTTˆH‘RS’PÒPT‰Ë	Ô‘TÕÔ‘HS‘‘TÕT•	Ë	Ô‘TÕUTTˆH‘RS’PÒPT‰Ë	ÑÑT±,pçÓH‘HQS±,Sˆqg“U	ÊK

OO˜\T™\ÝÜ™MŒÊ]KÛÙJWKÓM
	ÐÐSÑST‰Ë	ÐÐSÑS	Ë	ÐÐSÑST‰Ë	ñ,S	ÊKÛÜÙQX[Ù×WJNßXØ]Ú
\œ›ÜŠ^É
	ÈÜ™XÛÝ™\™\œ›ÜMIÊK^ÛÛ[Y\œ›Ü‹›Y\ÜØYÙNß_NÂ˜ÛÛœÝ™\ÝÜ™SY[P™Y›Ü™LMÏ\™XÛÝ™\“Y[MMNÜ™XÛÝ™\“Y[MMOY[˜Ý[ÛŠ
^Ü™\ÝÜ™SY[P™Y›Ü™LMÊ
NØÛÛœÝI
	ÈÙX[ÙØ›ÙIÊKœ]Y\žTÙ[XÝÜŠ	Ü	ÊNÚYŠ
\^ÛÛ[SM
	Ò\ÝHÙZ\È\™š[\È[™\[™Y[\ËˆØZ^X[ˆÛÛœÙ\˜HÝHÝÙ\ˆ]™[H0êXÛšXØ\ËˆÛÛ\YX˜H[ÛÛ[šYÈHH™XÚH[\ÈH™\Ý]\˜\‹‰Ë	Õ\ÈÚ^[™\[™[›Ùš[\ËˆØZ^X[ˆÙY\È]ÈÝÙ\ˆ]™[[™XÚš\]Y\ËˆÚXÚÈHÛÛ[È[™]H™Y›Ü™H™\ÝÜš[™Ë‰Ë	Ð]0êHÙZ\È\™š\È[™\[™[\ËˆØZ^X[ˆX[0ê[HÝÙ\ˆ]™[H0êXÛšXØ\ËˆÛÛ™š\˜HÈÛÛpî™ÈHH]H[\ÈH™\Ý]\˜\‹‰Ë	Ñ[ˆ˜^›H[1,H˜q'ñ,[\ñ,^ˆ›Ùš[ˆØZ^X[ˆÝÙ\ˆ]™[™HZÛšZÛ\š[šHÛÜ\‹ˆÙ\šHpïÛ[YY[ˆ0í›˜ÙHpéÙ\šZÈ™H\šZHÛÛ›Û]‰ÊNßNÂ˜ÛÛœÝ™]ÜÐ™Y›Ü™LMÏ]\]SÙÌŒÎÝ\]SÙÌŒÏY[˜Ý[ÛŠ‹‹˜J^Û™]ÜÐ™Y›Ü™LMÊ‹‹˜JNÉ
	ÈÙX[ÙÙ^YXœ›ÝÉÊK^ÛÛ[IÓÓS’P“V–ˆÔ’QÒSS0­ÈKŒÉÎØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	ÜÙXÝ[Û‰ÊNØ‹œÙ]]šX]J	Ù]K[›ËZLN‰Ë	ÉÊNØ‹š[›™\’SIÏÏ”ÐRVPSˆ0­ÈÕÑTˆU‘SÚÏ‰ÊÓM
	ÔÙ^H˜^˜HÛÛˆ›ÙÜ™\ÛÈ›Ü[ËÚ[˜ÛÈ\ØÙ[˜\š[ÜÈ^Û\Ú]›ÜËY]›ÈY[°î‹ÚHH[™[˜[ZY[Ëˆ›ÜÚH[œÙpìXHØ[YZ[YZH[ˆØ[YHÝ\ÙKˆ›Ü›XH˜\ÙH0î›šXØ[Y[KÚ[ˆÝ\\ˆØZ^X[‹‰Ë	ÔÚ^˜XÙHÚ][™\[™[›ÙÜ™\ÜËš]™H^Û\Ú]™HX\Ë™]ÈY[KÚH[™˜Z[š[™Ëˆ›ÜÚHXXÚ\ÈØ[YZ[YZH]Ø[YHÝ\ÙKˆ˜\ÙH›Ü›HÛ›K›ÈÝ\\ˆØZ^X[‹‰Ë	ÔÙ^H˜péØHÛÛH›ÙÜ™\ÜÛÈ°ìÜš[ËÚ[˜ÛÈX\\È^Û\Ú]›ÜË›Ý›ÈY[KÚHH™Z[›Ëˆ›ÜÚH[œÚ[˜HØ[YZ[YZH[HØ[YHÝ\ÙKˆ\[˜\È›Ü›XH˜\ÙKÙ[HÝ\\ˆØZ^X[‹‰Ë	Ð˜q'ñ,[\ñ,^ˆ[\›[YK™qgÈ0íž™[\š]KY[šHY[°ïÚH™Hq'Ú][H[H[1,[˜ñ,H1,\šËˆ›ÜÚHØ[YHÝ\ÙHpéÚ[™HØ[YZ[YZH0í±'Ü™]\‹ˆX[±,^˜ØH[Y[›Ü›KÝ\\ˆØZ^X[ˆ[ÚË‰ÊJÉÏÜ‰ÎÉ
	ÈÙX[ÙØ›ÙIÊKœ™\[™
ŠNßNÂ˜ÛÛœÝÛ™XYSÙÌMÏ\™XYSÙÌŒÎÜ™XYSÙÌŒÏY[˜Ý[ÛŠ
^ÚYŠÙÑš\œÝŒß\™XYJ\™]\›ŽÛÙÑš\œÝŒÏ]YNÚYŠØØ[ÝÜ˜YÙK™Ù]][J	ÛÛ[šK\ÙY[‹]\]IÊHOOIÌKŒÉÊ^Ý\]SÙÌŒÊ
NÛØØ[ÝÜ˜YÙKœÙ]][J	ÛÛ[šK\ÙY[‹]\]IË	ÌKŒÉÊNß_NÂ‹ËÈ]™\žH]Y]YYÛÝYÝXØÙ\ÜÈ›ÝÈ™Y™\œÈÈH™X[XÝ]™HÝÙ\ˆ]™[‚˜ÛÛœÝÞ[˜Ð™Y›Ü™LMÏ\Þ[˜Ô™XÛÝ™\žMMNÜÞ[˜Ô™XÛÝ™\žMMOX\Þ[˜È[˜Ý[ÛŠ‹‹˜J^ØÛÛœÝÚÏX]ØZ]Þ[˜Ð™Y›Ü™LMÊ‹‹˜JNÚYŠÚÉ‰œØZLMÊ
J\™XÛÝ™\žTÝ]\ÍMJM
	Ô‘TÔSÈÕPT‘QÉË	ÐPÒÕTÐU‘Q	Ë	ÐPÒÕTÐS“ÉË	ÖQQRÈÐVQQ1,1,	ÊJÉÈ0­ÈØZ^X[ˆ0­ÈÕÑTˆU‘S	ÊÓX]™›ÛÜŠØZTÝ]LMÊ
KœÝÙ\ŠJNÜ™]\›ˆÚÎßNÂœØZP]\ÌMË›Û›ØYJ
OOœZ[˜XÙP\MMŠ
NÂ‚šYŠØØ][Û‹œÙX\˜Úš[˜ÛY\Ê	ÜXOLIÊJ]Ú[™ÝË—×ÝŒMÏ^Ù]˜[œÏO™]˜[
ÊKØZTÝ]LMËØZU˜]™[MËØZP]XÚÌMËØZU\]LMËØZT™\ÝMËØZTÜ\ŒMËØZS\ÜÛÛŒMËØZP›ØÚÙYMËØZRMËØZRÚSX^MßNÂ‚‹ËÈÜšYÚ[˜[KˆÛÛ›™XÝYØZ^X[ˆÛÜ›˜Z[š[™È]È[™˜Y]ˆÚ\\‹‚˜ÛÛœÝQU—ÔÕÑTŒMŽMLQU—ÒMŽLÌÂ›]˜Y]ŒMŽ[[›Ý]SØÚÌMŽLÝÙ\•Ø\ÝMŽL˜Y]”ÝÜžLMŽKLNÂ™[˜Ý[Ûˆ˜Y]”›ÙÜ™\ÜÌMŽ

^ØÛÛœÝ\ØZTÝ]LMÊ
NÛ][‹œ˜Y]ŒMŽÚYŠ\\[ÙˆOOIÛØš™XÝ	Ê\^ßNÛ‹œ˜Y]ŒMŽ^ÜÙY[ŽˆH\œÙY[‹Y™X]YˆH\™Y™X]YÛZ[YYˆH\˜ÛZ[YY“[X™\‹š\Ñš[š]Jš
OØÛ[\
šQU—ÒMŽ
N”QU—ÒMŽÚ[œÎ“X]›X^
X]™›ÛÜŠ[X™\ŠÚ[œÊ_
J_NÜ™]\›ˆ‹œ˜Y]ŒMŽßB™[˜Ý[Ûˆ˜Y]’\™LMŽ

^Ü™]\›ˆØZLMÊ
I‰œØZSX\MÊ
OOOMßB™[˜Ý[Ûˆ˜Y]”ÙYYMŽ

^ÚYŠ\˜Y]’\™LMŽ

J^Ü˜Y]ŒMŽ[[Ü™]\›ˆ[ßXÛÛœÝ\˜Y]”›ÙÜ™\ÜÌMŽ

NÚYŠ™Y™X]Y	‰ˆ\˜Y]”™\X]MÌÊ^Ü˜Y]ŒMŽ[[Ü™]\›ˆ[ßZYŠ\˜Y]ŒMŽ
\˜Y]ŒMŽ^ÞŒLLNÎLœšQU—ÒMŽX^”QU—ÒMŽXÝ]™NœœÙY[‹\ÙNŒÙŒ‹Ú[™ŒXÝ[ÛŽ›[ÚÝÎ–×K]ÎŒX[Œ›\ÚŒNÜ™]\›ˆ˜Y]ŒMŽßB™[˜Ý[ÛˆØZU\™Ù]MŽ

^ÚYŠØZSX\MÊ
OOOM
\™]\›ˆ˜Y]”ÙYYMŽ

OË˜XÝ]™OÜ˜Y]ŒMŽžÞ‹NNNNKN‹NNNN_NÜ™]\›žÞŒLLŒNÍNßB™[˜Ý[Ûˆ˜Y]“][\Y\ŒMŽ
Ý]ÛÚ[™ÏY˜[ÙJ^ØÛÛœÝÝÙ\SX]›X^
LØZTÝ]LMÊ
KœÝÙ\ŠNÜ™]\›ˆÝ]ÛÚ[™ÏØÛ[\
ÝÙ\‹ÔQU—ÔÕÑTŒMŽŒKŠNœØZTÝÙ\‘Ø\MŽJQU—ÔÕÑTŒMŽÝÙ\ŠNßB˜ÛÛœÝ]™Y›Ü™LMŽ\ØZR]\™Ù]MÎÜØZR]\™Ù]MÏY[˜Ý[ÛŠ
^ÚYŠ\ØZLMÊ
_S[X™\‹š\Ñš[š]J
_L
\™]\›ˆ˜[ÙNÚYŠ˜Y]’\™LMŽ

J^ØÛÛœÝ\˜Y]”ÙYYMŽ

NÚYŠXË˜XÝ]™_‹šL
\™]\›ˆ˜[ÙNØÛÛœÝ[XYÙOY
œ˜Y]“][\Y\ŒMŽ
YJNØ‹šSX]›X^
‹šY[XYÙJNØ‹™X[
ÏY[XYÙNØ‹™›\ÚKŒMÜ˜Y]”›ÙÜ™\ÜÌMŽ

KšX‹šÚYŠ‹šL
^ØÛÛœÝ\˜Y]”›ÙÜ™\ÜÌMŽ

NÜ™Y™X]Y]YNÜšLÜÚ[œÊÊÎØÛÛœÝ™]Ø\™MÌÏ\˜ÛZ[YYÌŒLÜ˜ÛZ[YY]YNÜØZTÝ]LMÊ
KœÝÙ\SX]›Z[ŠYLL‹ØZTÝ]LMÊ
KœÝÙ\ŠÜ™]Ø\™MÌÊNÜ˜Y]”™\X]MÌÏY˜[ÙNØ‹˜XÝ]™OY˜[ÙNÜ\œÚ\ÝØ[YJ
NÝØ\Ý
	ÔQUˆ0­È
ÉÊÜ™]Ø\™MÌÊÉÈÕÑTˆU‘S	ÊNß\™]\›ˆYNßXÛÛœÝ\ØZTÝ]LMÊ
NÛ‹œÝÙ\SX]›Z[ŠYLL‹‹œÝÙ\ŠÌŒ
NÜÝÙ\•Ø\ÝMŽLKŒNÚYŠØZT[ŒMËœÜ\ŠZ]™Y›Ü™LMŽ

NÙ[Ù^ÜØZT[ŒMË\™Ù]OYÚYŠØZT[ŒMË\™Ù]L
\ØZT[ŒMË\™Ù]LÌß\\œÚ\ÝØ[YJ
NÜ™]\›ˆYNßNÂ˜ÛÛœÝ›Ý]\ÌMŽ^Ì–ÞÞŒLŽNŽÎŒK]–ÌŒÌÍŒK^\Î‰Þ	ËÚYÛŽŒKX™[Œ_WKN–ÞÞŒMLNÍŒÎŒ]–ÌLNLK^\Î‰Þ	ËÚYÛŽ‹LKX™[ŒKÞŒMNÍŒÎŒ‹]–ÌŒŒÍŒK^\Î‰Þ	ËÚYÛŽŒKX™[ŒŸKÞŽNLMKÎŒË]–ÎK^\Î‰ÞIËÚYÛŽ‹LKX™[ŒßKÞŽNŽLŒÎ]–ÌÍLK^\Î‰ÞIËÚYÛŽŒKX™[WKŽ–ÞÞŒMKNÍŒÎŒK]–ÌLÍÍŒK^\Î‰Þ	ËÚYÛŽ‹LKX™[Œ_WKÎ–ÞÞŽNŽLŒÎŒK]–ÎNLK^\Î‰ÞIËÚYÛŽŒKX™[Œ_WK–ÞÞŒMMKNŽŒÎŒK]–ÎK^\Î‰Þ	ËÚYÛŽ‹LKX™[Œ_W_NÂ˜ÛÛœÝ˜]™[™Y›Ü™LMŽ\ØZU˜]™[MÎÜØZU˜]™[MÏY[˜Ý[ÛŠ[™^[š]X[Y˜[ÙJ^ØÛÛœÝ™]š[Ý\Ï^›Û™NÚYŠ˜Y]ŒMŽ	‰œ˜Y]’\™LMŽ

J\˜Y]”›ÙÜ™\ÜÌMŽ

Kš\˜Y]ŒMŽšØÛÛœÝÝ]]˜]™[™Y›Ü™LMŽ
[™^[š]X[
NÚYŠÝ]
^ÚYŠ›Û™HOO\™]š[Ý\Ê\˜Y]ŒMŽ[[Ü›Ý]SØÚÌMŽLKŒÎÚYŠ[™^OOM
^Ü^Y\‹žLÍLÜ^Y\‹žONÜ˜Y]”ÙYYMŽ

Nß\™]\›ˆYNß\™]\›ˆÝ]ßNÂ™[˜Ý[ÛˆØZT›Ý]LMŽ

^ÚYŠ›Ý]SØÚÌMŽŒ\^Y\‹›[Ýš[™ßØZT[ŒMË˜XÝ[ÛË\OOOIÚØ[YIÊ\™]\›ˆ˜[ÙNØÛÛœÝÏJ›Ý]\ÌMŽÜØZSX\MÊ
W_×JK™š[™
ÏO“X]š\Ý
^Y\‹žYËž^Y\‹žKYËžJOI‰ŠË˜^\ÏOOIÞ	ÏÜ^Y\‹™œ^Y\‹™JJ™ËœÚYÛ‹ŒŠNÚYŠYÊ\™]\›ˆ˜[ÙNÚYŠØZU˜]™[MÊËÊJ^Ü^Y\‹žYË˜]ÌNÜ^Y\‹žOYË˜]ÌWNÜ\œÚ\ÝØ[YJ
NÜ™]\›ˆYNß\™]\›ˆ˜[ÙNßB˜ÛÛœÝØ\™MŽ[™]È[XYÙJ
NØØ\™MŽœÜ˜ÏIÜØZLMŽÛY[K\™Y™\™[˜ÙKœ™ÉÎØÛÛœÝØ\™™Y›Ü™LMŽ\Z[˜XÙP\MMŽÜZ[˜XÙP\MMY[˜Ý[ÛŠ
^ØØ\™™Y›Ü™LMŽ

NØÛÛœÝÏYØÝ[Y[œ]Y\žTÙ[XÝÜŠ	ÖÙ]KX\MMH‰ÊÔÐRLMÊÉÈ—IÊNÚYŠXßXØ\™MŽ˜ÛÛ\]_XØ\™MŽ›˜]\˜[ÚY
\™]\›ŽØËÚYMLLŽØËšZYÚLØÛÛœÝØÏXË™Ù]ÛÛ^
	Ì™	ÊNØØËš[XYÙTÛ[ÛÝ[™Ñ[˜X›Y]YNØØË˜ÛX\”™XÝ
LL‹
NØØË™˜]Ò[XYÙJØ\™MŽNMLÍMÍËLL‹
NßNØØ\™MŽ›Û›ØYJ
OOœZ[˜XÙP\MMŠ
NÂ˜ÛÛœÝÜÜÌMŽYØÝ[Y[˜Ü™X]Q[[Y[
	ÜÝ[IÊNØÜÜÌMŽ^ÛÛ[IËœ˜XÙK\ØZ^X[ŒMÈØ[˜\ÞÛØš™XÝYš]˜ÛÝ™\ˆZ[\Ü[Ø˜XÚÙÜ›Ý[™ˆÌÍŒŒÈZ[\Ü[Kœ˜XÙK\ØZ^X[ŒMÈœ˜XÙKY\ØÌMMžØÛÛÜŽˆÙYŒÍHZ[\Ü[Kœ˜XÙK\ØZ^X[ŒMÏ˜]ÛžØÛÛÜŽˆÙ™™˜ÍˆZ[\Ü[Ø›Ü™\‹XÛÛÜŽˆÙŒÍZ[\Ü[Ø˜XÚÙÜ›Ý[™›[™X\‹YÜ˜YY[
ÍŽ™˜KÌLMLN
HZ[\Ü[Kœ˜Y]‹\ØÙ[™LMŽÝÚYŒL	NÚZYÚŒŒLÚ[XYÙK\™[™\š[™Îœ^[]YÙ\Ü^N˜›ØÚÎØ›Ü™\ŽŒ\ÛÛYÙXMMNÛX\™Ú[ŽŽKœØZKYX[ÙÌMÈœ˜Y]‹]Ø\›š[™ÌMŽØÛÛÜŽˆÙ™˜YNIÎÙØÝ[Y[šXY˜\[™
ÜÜÌMŽ
NÂ˜ÛÛœÝ˜Y]\MŽ[™]È[XYÙJ
K˜Y]Ú[™[XLMŽ[™]È[XYÙJ
NÜ˜Y]\MŽœÜ˜ÏIÜØZLMŽÜ˜Y]‹ÙXœ	ÎÜ˜Y]Ú[™[XLMŽœÜ˜ÏIÜØZLMŽÜÝÜžKÙXœ	ÎØÛÛœÝ˜Y]‘œ˜[Y\ÌMŽVÖÖÌÌ‹ËLMËMÌËMËŽKÌŒLK‹LNMÍLKLKÌÎLËËLM‹MÌËŽLÌ×KÍMÍKËLMËMÌËLÌÌWKÍÍMKËLNMÌËK×KÎLÍ‹ËLMËMÍKŒŒÌ—KÌLLNËLMËMÍLŒÎWKÌLŽN‹LNMÍKŽL—WKÖÌÌKNLNKMÌËMËLÍ—KÌŒL‹NËLNKMÌ‹MŒM—KÌÎL‹NLNKMÌËËÌWKÍMÌËNLNKMÌËŒKŽLÌ×KÍÍMKNLNMÌËM‹ÍWKÎLÍ‹NËLŒMÍËMKÌLLMËNLŒMÌËM‹MÎWKÌLŽNNKLNKMÌ‹LËŒÎWKÖÌŒKÍËLKMÌËŽKLÎWKÌŒKÍËLŽMÌËÌKŒWKÌÎÍËLÍMÍKŽKŽKÍMŒ‹ÍËLŽMÌËŽŒŒMWKÍÍKÍŽLŒ‹MÌKMWKÎLËÍ‹LÍKMÌ‹ËŽŒ—KÌLL‹ÍŽLŽKMÌ‹ËÎL×KÌLŽËÍËLÌMÌËËÌÎWKÖÌMËMLLÍËMÌKÌËŒWKÌNNMMŒKMÌË‹Œ—KÌÎ‹MMLÌËM‹Ë×KÍML‹MLÌKMÌ‹ÎKŒÍ—KÍÍ‹MLMŒËMÌKŽKÍÍKÎLKMKMMËMÌ‹LKŒÌWKÌLLMLLÍ‹MÌ‹ÌËÌ—KÌLŽMLÍKMÍÌ×WKÖÌŒ‹ÌÌ‹ML‹MÌ‹ËŒMÍKÌŒÌÌKMMKMÌ‹ŽKÌÎ‹ÌŽKMNKMÍËŒNWKÍMŒËÌŽKMMÍ‹M—KÍÍÌÌKMKMÌ‹ÌKWKÎLKÌÌ‹NMÌKËŒŒMKÌLL‹ÌÌ‹MŒKMÌKËŒÌM×KÌLŽËÌŽKLÌKMÍÌ‹ŽMŒ—WKÖÌÌ‹LKLM‹MÌKM‹ÌMKÌŒLKLKLNMÌKNKŽMKÌÎLËLKLNMÌKNNWKÍMÍKLKLM‹MÌKMËŒÎKÍÍMKLKLMËMÌKNÍÌ—KÎLÍ‹LKLNMÌKNŒLWKÌLLNLKLM‹MÌKMËM×KÌLŽMËLKLNKMÌKNKŒMWWNÂ™[˜Ý[Ûˆ˜Y]”Z[MŽ
›ÝËœ˜[YKKLMMK›\Y˜[ÙJ^ÚYŠ\˜Y]\MŽ˜ÛÛ\]_\˜Y]\MŽ›˜]\˜[ÚY
\™]\›ŽØÛÛœÝ\˜Y]‘œ˜[Y\ÌMŽÜ›Ý×VÓX]™›ÛÜŠœ˜[YJINKØØ[OZÌŒØÝœØ]™J
NØÝ˜[œÛ]JJNÚYŠ›\
XÝœØØ[JLKJNØÝ™˜]Ò[XYÙJ˜Y]\MŽ–ÌK–ÌWK–Ì—K–Ì×KY–ÍJœØØ[KY–Ì×JœØØ[K–Ì—JœØØ[K–Ì×JœØØ[JNØÝœ™\ÝÜ™J
NßB˜ÛÛœÝÝÜžS[™\ÌMŽVÖÉÕ[˜Hðè\Ý[HØYH[ˆHY\œ˜Kˆ˜Y]ˆ\ØØHHÝH\›X[›È\™YË‰Ë	ÐHÜXÙHÙ[™ÈÛˆX\ˆ˜Y]ˆÙX\˜Ú\È›Üˆ\ÈÜÝœ›Ý\‹‰Ë	Õ[XHðè\Ý[HØZH˜H\œ˜Kˆ˜Y]ˆ›ØÝ\˜HÈ\›pèÛÈ\™YË‰Ë	Ðš\ˆ^˜^HØ\ðï0ï0ïžXx &^XH[™\‹ˆ˜Y]ˆØ^q,\Ø\™qgÚ[šH\˜\‹‰×KÉÑ[ˆØ[YHÝ\ÙK˜Y]ˆ™]™[H]YHÛÚÝH\È[ˆØZ^XZš[ˆ[XYÈØZØ\›ÝˆÛÚÝH™XÚ^˜H[š\œÙHH0ê[‰Ë	Ð]Ø[YHÝ\ÙK˜Y]ˆ™]™X[È]ÛÚÝH\ÈHØZ^X[ˆ˜[YYØZØ\›ÝˆÛÚÝH™Y\Ù\ÈÈ›Ú[ˆ[K‰Ë	Ñ[HØ[YHÝ\ÙK˜Y]ˆ™]™[H]YHÛÚÝH0êH[HØZ^XZš[ˆÚ[XYÈØZØ\›ÝˆÛÚÝHÙH™XÝ\ØHHXÛÛ\[š0èK[Ë‰Ë	ÒØ[YHÝ\Ùx &YH˜Y]‹ÛÚÝx &[[ˆØZØ\›ÝY1,Hš\ˆØZ^X[ˆÛq'Ý[Hpéñ,ZÛ\‹ˆÛÚÝHÛ˜HØ]1,[X^q,H™YY\‹‰×KÉÔ˜Y]ˆÙH]˜HHÛÚ[ˆ\˜HØ›YØ\ˆHÛÚÝHHØ™YXÙ\‹ˆÛÚÝH\H\˜H™\ØØ]\ˆHÝHZ›Ë‰Ë	Ô˜Y]ˆÚY˜\ÈÛÚ[ˆÈ›Ü˜ÙHÛÚÝHÈØ™^KˆÛÚÝHÙ]ÈÝ]È™\ØÝYH\ÈÛÛ‹‰Ë	Ô˜Y]ˆ]˜HÛÚ[ˆ\˜HØœšYØ\ˆÛÚÝHHØ™YXÙ\‹ˆÛÚÝH\H\˜H™\ÙØ]\ˆÈš[Ë‰Ë	Ô˜Y]‹ÛÚÝx &^]H›Ü›[XZÈpéÚ[ˆÛÚ[¸ &q,HØpéñ,\±,\‹ˆÛÚÝHñ'Û[HÝ\\›XZÈpéÚ[ˆ[ÛH0éñ,ZØ\‹‰×KÉÑ[ˆ[Ü°è]\‹˜Y]ˆÙH[\œÛ™KˆÕÑTˆU‘SKŒˆ™\0è\˜]H\˜HÝ\ÈÛÛ\ÈHÝHØ›H°èY˜YØHHÚK‰Ë	Ð]HÜ˜]\‹˜Y]ˆ›ØÚÜÈHØ^KˆÕÑTˆU‘SKˆ™\\™H›Üˆ\ÈY[YH]XÚÜÈ[™ÝX›HÚH›\Ý‰Ë	Ó˜HÜ˜]\˜K˜Y]ˆ›Ü]YZXHÈØ[Z[šËˆÕÑTˆU‘SKŒˆ™\\™K\ÙH\˜HÜÈÛÛ\ÈHH˜Z˜YH\HHÚK‰Ë	ÒÜ˜]\™H˜Y]ˆ[ÛHÙ\Ù\‹ˆÕÑTˆU‘SKŒˆ\˜™[\š[™H™H0éÚYÚHØ[1,\±,\ñ,[˜H^±,\›[‹‰×WNÂ™[˜Ý[Ûˆ˜Y]”ÝÜžTÝ\MŽ
[™[L
^ÚYŠ\˜Y]’\™LMŽ

J\™]\›ˆ˜[ÙNØÛÛœÝ\˜Y]”ÙYYMŽ

NÚYŠXŠ\™]\›ˆ˜[ÙNØ‹˜XÝ]™OY˜[ÙNÜ˜Y]”ÝÜžLMŽXÛ[\
[™[ÊNÜÚÝÑX[ÙÊ	ÑQÓÓˆSˆ0­È	ÊÓM
	ÓHQÐQHHQU‰Ë	ÔQUˆT”’U‘TÉË	ÐHÒQÐQHHQU‰Ë	ÔQUˆÑS1,SÔ‰ÊKM
	Ô™\ØØ]\ˆHÛÚ[‰Ë	Ô™\ØÝYHÛÚ[‰Ë	Ô™\ÙØ]\ˆÛÚ[‰Ë	ÑÛÚ[¸ &q,HÝ\\‰ÊK	Ï]ˆ]K[›ËZLNØ[˜\ÈÛ\ÜÏHœ˜Y]‹\ØÙ[™LMŽˆYHœ˜Y]‹\ØÙ[™LMŽˆÚYHÍŽˆZYÚHLLˆØØ[˜\Ï‰ÊÓM
‹‹œÝÜžS[™\ÌMŽÜ˜Y]”ÝÜžLMŽJJÉÏÜ”ÕÑTˆU‘S0­È˜Y]ˆKŒÈÛÚÝH	ÊÓX]™›ÛÜŠØZTÝ]LMÊ
KœÝÙ\ŠJÉÏÜÙ]‰ËÖÜ˜Y]”ÝÜžLMŽOOLÏÓM
	ÐÓÓQS–TˆÓÓPUIË	ÔÕT•UIË	ÒS’PÒPTˆÓÓPUIË	ÔÐUqg’Hqg“U	ÊN“M
	ÔÒQÕRQS•IË	Ó‘V	Ë	Ô°äÖSSÉË	ÔÓÓ”Rñ,	ÊK

OOœ˜Y]”ÝÜžLMŽOOLÏÜ˜Y]”ÝÜžQš[š\ÚMŽ

Nœ˜Y]”ÝÜžTÝ\MŽ
˜Y]”ÝÜžLMŽ
ÌJWKÓM
	ÔÐSTˆS•“ÑPÐÒpäÓ‰Ë	ÔÒÒTS•“ÉË	ÔSTˆS•“ÑpáðàÓÉË	Ññ,±,1g±,UIÊK˜Y]”ÝÜžQš[š\ÚMŽWJNØÛÛœÝZ[J
OOžØÛÛœÝÏYØÝ[Y[™Ù][[Y[žRY
	Ü˜Y]‹\ØÙ[™LMŽ	ÊNÚYŠXß\˜Y]Ú[™[XLMŽ˜ÛÛ\]_\˜Y]Ú[™[XLMŽ›˜]\˜[ÚY
\™]\›ŽØÛÛœÝØÏXË™Ù]ÛÛ^
	Ì™	ÊKÏ\˜Y]Ú[™[XLMŽÚYÌ‹\˜Y]Ú[™[XLMŽšZYÚÌŽØØËš[XYÙTÛ[ÛÝ[™Ñ[˜X›YY˜[ÙNØØË™˜]Ò[XYÙJ˜Y]Ú[™[XLMŽ
˜Y]”ÝÜžLMŽ	LŠJËX]™›ÛÜŠ˜Y]”ÝÜžLMŽÌŠJšËÍŽLLŠNßNÜZ[

NÜ˜Y]Ú[™[XLMŽ›Û›ØY\Z[Ü™]\›ˆYNßB™[˜Ý[Ûˆ˜Y]”ÝÜžQš[š\ÚMŽ

^ÚYŠ\˜Y]’\™LMŽ

J\™]\›ˆ˜[ÙNÜ˜Y]”›ÙÜ™\ÜÌMŽ

KœÙY[]YNÜ˜Y]”ÝÜžLMŽKLNØÛÜÙQX[ÙÊ
NØÛÛœÝ\˜Y]”ÙYYMŽ

NÚYŠŠ^Ø‹˜XÝ]™O]YNØ‹˜ÙLŽß\\œÚ\ÝØ[YJ
NÜ™]\›ˆYNßB™[˜Ý[Ûˆ˜Y]’\MŽ
˜\ÙJ^ØÛÛœÝ\˜Y]ŒMŽÚYŠXË˜XÝ]™_^Y\‹šLS[X™\‹š\Ñš[š]J˜\ÙJ_˜\ÙOLÛØÚÏ
‹š\[[MŽ_
J\™]\›ŽØ‹š\[[MŽOXÛØÚÊËNÜ^Y\‹šSX]›X^
^Y\‹š\˜Y]‘[XYÙLMŽJ˜\ÙJJNÜ^Y\‹œ™YÙ[•ØZ]LÎØ‹š]ÊÊÎÚYŠ^Y\‹šŒ	‰œ^Y\‹š\ØZRMÊ
J‹Œ‰‰˜‹™X[TQU—ÒMŽ
‹ŒJ\ØZTÝ]LMÊ
Kž™[šØZT™XYO]YNÚYŠ^Y\‹šL
^Ü˜Y]”›ÙÜ™\ÜÌMŽ

KšTQU—ÒMŽÜØZQX]MÌŠ˜[ÙJNß_B™[˜Ý[Ûˆ˜Y]•\]LMŽ

^ØÛÛœÝ\˜Y]”ÙYYMŽ

NÚYŠXŠ\™]\›ŽÚYŠX‹˜XÝ]™J^ÚYŠ\˜Y]”›ÙÜ™\ÜÌMŽ

KœÙY[‰‰œ˜Y]”ÝÜžLMŽ	‰“X]š\Ý
^Y\‹žX‹ž^Y\‹žKX‹žJO
\˜Y]”ÝÜžTÝ\MŽ

NÜ™]\›ŽßX‹™›\ÚSX]›X^
‹™›\ÚY
NØ‹˜ÙOYÚYŠ‹˜XÝ[ÛŠ^Ø‹˜XÝ[Û‹
ÏYÚYŠ‹˜XÝ[Û‹X‹˜XÝ[Û‹›X^
X‹˜XÝ[Û[[ßZYŠ‹Ú[™Œ
^Ø‹Ú[™OYÚYŠ‹Ú[™L
^ØÛÛœÝÚ[™X‹›™^Ø‹˜XÝ[Û^Ý\NšÚ[™ŒX^šÚ[™OOIÚÚIÏÌKŒN‹_NÚYŠÚ[™OOIÛY[YIÊ^ÚYŠX]š\Ý
^Y\‹žX‹ž^Y\‹žKX‹žJONJ\˜Y]’\MŽ
ÍŠNßY[Ù^ØÛÛœÝZ[OSX]˜][ŒŠ^Y\‹žKX‹žK^Y\‹žX‹ž
NÙ›ÜŠÛÛœÝÜ™XYÙˆËKŒLËŒL×JX‹œÚÝËœ\Ú
Þ˜‹žN˜‹žKMMK“X]˜ÛÜÊZ[JÜÜ™XY
JŒÍŒN“X]œÚ[ŠZ[JÜÜ™XY
JŒÍŒŒ‹ßJNßX‹œ\ÙJÊÎØ‹˜ÙL‹ŒNß_Y[ÙHYŠ‹˜ÙL
^Ø‹›™^X‹œ\ÙILÏOOLÉÚÚIÎ‰ÛY[YIÎØ‹Ú[™X‹›™^OOIÚÚIÏÌKŒMN‹ŽØ‹˜Z[O^Þœ^Y\‹žNœ^Y\‹ž_NßY[ÙHYŠX]š\Ý
^Y\‹žX‹ž^Y\‹žKX‹žJOŒMI‰ˆX‹˜XÝ[ÛŠ^ØÛÛœÝ\^Y\‹žX‹žO\^Y\‹žKX‹žK[SX]š\Ý
J_KžX‹ž
ÙÛ[ŠŒLJ™žOX‹žJÙKÛ[ŠŽ
™ÚYŠ\ØZP›ØÚÙYMÊžžJJ^Ø‹ž[žØ‹žO[žNß_B™›ÜŠÛÛœÝÈÙˆ‹œÚÝÊ^ÜËž
Ï\Ë™
™ÜËžJÏ\Ë™J™ÜËOYÚYŠËŒ	‰“X]š\Ý
^Y\‹ž\Ëž^Y\‹žKMK\ËžJOÍ
^ÜËLÜ˜Y]’\MŽ

Nß_X‹œÚÝÏX‹œÚÝË™š[\ŠÏOœËŒ
NßB˜ÛÛœÝ\]P™Y›Ü™LMŽ\ØZU\]LMÎÜØZU\]LMÏY[˜Ý[ÛŠ
^ÚYŠ\ØZLMÊ
_\Ý\Y]\ÙYÚ[™[X]XßØÝ[Y[šY[Š\™]\›ˆ\]P™Y›Ü™LMŽ

NØÛÛœÝÝ\XÛ[\
ŒJNÝ\]P™Y›Ü™LMŽ
Ý\
NÚYŠØ\Ý[YOŒ
^ÝØ\Ý[YKO\Ý\ÚYŠØ\Ý[YOL
I
	ÈÝØ\Ý	ÊK˜Û\ÜÓ\Ýœ™[[Ý™J	ÜÚÝÉÊNß\›Ý]SØÚÌMŽSX]›X^
›Ý]SØÚÌMŽ\Ý\
NÜÝÙ\•Ø\ÝMŽSX]›X^
ÝÙ\•Ø\ÝMŽ\Ý\
NÚYŠØZT›Ý]LMŽ

J\™]\›ŽÚYŠ˜Y]’\™LMŽ

J\˜Y]•\]LMŽ
Ý\
NÙ[Ù^Ü˜Y]ŒMŽ[[Ü˜Y]”ÝÜžLMŽKLNß_NÂ˜ÛÛœÝ˜]Ð™Y›Ü™LMŽ\ØZQ˜]ÌMÎÜØZQ˜]ÌMÏY[˜Ý[ÛŠ
^Ù˜]Ð™Y›Ü™LMŽ

NØÛÛœÝ›ÛÛOSX]›X^
ËÌMŒÌL
KÞXÛ[\
^Y\‹žUËÊŠž›ÛÛJKX]›X^
MŒUËÞ›ÛÛJJKÞOXÛ[\
^Y\‹žKRÊŠž›ÛÛJKX]›X^
LRÞ›ÛÛJJNØÝœØ]™J
NØÝœØØ[J›ÛÛK›ÛÛJNØÝ˜[œÛ]JXÞXÞJNØÝ™›ÛIØ›ÛN[Û›ÜÜXÙIÎØÝ^[YÛIØÙ[\‰ÎÙ›ÜŠÛÛœÝÈÙˆ›Ý]\ÌMŽÜØZSX\MÊ
W_×J^ØÝœÝ›ÚÙTÝ[OIÈÙ™™MØL‰ÎØÝ™š[Ý[OIÈÌÌ™LØ™	ÎØÝ›[™UÚYLÎØÝ™š[™XÝ
ËžMËžKLŒLŽ
NØÝœÝ›ÚÙT™XÝ
ËžMËžKLŒLŽ
NØÝ™š[Ý[OIÈÙ™™ŒX	ÎØÝ™š[^

Ë˜^\ÏOOIÞIÏÙËœÚYÛÉø¡¤H	Î‰ø¡¤È	Î™ËœÚYÛÉø¡¤	Î‰ø¡¤ˆ	ÊJÓM
‹‹”ÐRWÓSQTÌMÖÙË›X™[JKËžËžKLŽ
NßZYŠÝÙ\•Ø\ÝMŽŒ
^ØÝ™š[Ý[OIÈÙ™™MÍÙ	ÎØÝ™š[^
	ÊÌŒÕÑTˆU‘S	Ë^Y\‹ž^Y\‹žKLMJNßBšYŠ˜Y]’\™LMŽ

J^ØÛÛœÝ\˜Y]”ÙYYMŽ

NÚYŠŠ^Û]›ÝÏX‹˜XÝ[ÛË\OOOIÚÚIÏÍ˜‹˜XÝ[ÛÌÎ˜‹Ú[™ŒÍN“X]š\Ý
^Y\‹žX‹ž^Y\‹žKX‹žJOŒMOÌŽKœ˜[YOX‹˜XÝ[ÛÓX]›Z[ŠËX]™›ÛÜŠ‹˜XÝ[Û‹Ø‹˜XÝ[Û‹›X^
Ž
JN“X]™›ÛÜŠÛØÚÊŠ›ÝÏOOLÌLJJINØÝ™ÛØ˜[[OX‹™›\ÚŒËŽŒNÜ˜Y]”Z[MŽ
›ÝËœ˜[YK‹ž‹žKMK›ÝÏL‰‰œ^Y\‹ž‹ž
NØÝ™ÛØ˜[[OLNØÝ™š[Ý[OIÈÙ™™ŒXIÎØÝ™š[^
	ÔQUˆ0­ÈÕÑTˆU‘SKŒ	Ë‹ž‹žKLN
NÚYŠ‹Ú[™Œ
^ØÝœÝ›ÚÙTÝ[OX‹›™^OOIÚÚIÏÉÈÙÎ™™‰Î‰ÈÙ™ÎMMIÎØÝ›[™UÚYMØÝ˜™YÚ[”]

NØÝ™[\ÙJ‹ž‹žKNKLKX]”JŒŠNØÝœÝ›ÚÙJ
NÚYŠ‹›™^OOIÚÚIÊ^ØÝ˜™YÚ[”]

NØÝ›[Ý™UÊ‹ž‹žKMMJNØÝ›[™UÊ‹˜Z[Kž‹˜Z[KžKMJNØÝœÝ›ÚÙJ
Nß_Y›ÜŠÛÛœÝÈÙˆ‹œÚÝÊ^ØÝ™š[Ý[OIÈØÙØY™‰ÎØÝ˜™YÚ[”]

NØÝ˜\˜ÊËžËžKNX]”JŒŠNØÝ™š[

NØÝ™š[Ý[OIÈÙ™™Œ™‰ÎØÝ˜™YÚ[”]

NØÝ˜\˜ÊËžËžKX]”JŒŠNØÝ™š[

Nß__XÝœ™\ÝÜ™J
NÚYŠ˜Y]’\™LMŽ

I‰œ˜Y]ŒMŽ
^ØÛÛœÝ\˜Y]ŒMŽØÝ™š[Ý[OIÈÌMÌŒ™ÉÎØÝ™š[™XÝ
Ê‹ŒË
‹Œ‹Ê‹ÍJNØÝ™š[Ý[OIÈØYLIÎØÝ™š[™XÝ
Ê‹ŒÊÌË
‹ŒŠÌŒ
Ê‹MŠJ˜‹šÔQU—ÒMŽJNØÝ™š[Ý[OIÈÙ™™Œ™‰ÎØÝ™›ÛIØ›ÛLœ[Û›ÜÜXÙIÎØÝ^[YÛIØÙ[\‰ÎØÝ™š[^
	ÔQUˆ0­ÈKŒ0­È	ÊÓX]˜ÙZ[
‹š
JÉÈÈ	ÊÔQU—ÒMŽÊ‹K
‹ŒŠÌM
Nß_NÂ˜ÛÛœÝY[P™Y›Ü™LMŽ\ØZSY[LMÎÜØZSY[LMÏY[˜Ý[ÛŠYÙOIÜÝ]IÊ^ØÛÛœÝÝ][Y[P™Y›Ü™LMŽ
YÙJNÚYŠYÙOOOIÛX\	Ê^ØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	Ü	ÊNÜœÙ]]šX]J	Ù]K[›ËZLN‰Ë	ÉÊNÜ^ÛÛ[SM
	Õ[Xšpê[ˆYY\ÈØ[Z[˜\ˆÜˆ\ÈØ[Y\ÈÙpìX[^˜Y\Ëˆ˜Y\˜H[°ë[ÈÛÛ™XÝHÜÈØ[Z[›ÜË‰Ë	Ö[ÝHØ[ˆ[ÛÈØ[È›ÝYÚX\šÙY^]Ëˆš]™\ˆYXYÝÈÛÛ›™XÝÈH›Ý]\Ë‰Ë	Õ›Øðêˆ[X°ê[HÙHØ[Z[š\ˆ[\ÈØpëY\Ëˆ˜Y\šXHÈš[ÈÛÛ™XÝH\È›Ý\Ë‰Ë	ñ,1gØ\™]H0éñ,Zñ,qgÛ\™[ˆpï°ïYXš[\œÚ[‹ˆ™Z\ˆ0éØ^q,\±,H[Û\±,H˜q'Û\‹‰ÊNÉ
	ÈÙX[ÙØ›ÙIÊK˜\[™

Nß\™]\›ˆÝ]ßNÂ˜ÛÛœÝ[\˜XÝ™Y›Ü™LMŽZ[\˜XÝÚ[\˜XÝY[˜Ý[ÛŠ‹‹˜J^ÚYŠ˜Y]’\™LMŽ

I‰œ˜Y]”ÙYYMŽ

I‰ˆ\˜Y]ŒMŽ˜XÝ]™J\™]\›ˆ˜Y]”ÝÜžTÝ\MŽ

NÜ™]\›ˆ[\˜XÝ™Y›Ü™LMŽ
‹‹˜JNßNÂ˜ÛÛœÝ™]ÜÐ™Y›Ü™LMŽ]\]SÙÌŒÎÝ\]SÙÌŒÏY[˜Ý[ÛŠ‹‹˜J^Û™]ÜÐ™Y›Ü™LMŽ
‹‹˜JNÉ
	ÈÙX[ÙÙ^YXœ›ÝÉÊK^ÛÛ[IÓÓS’P“V–ˆÔ’QÒSS0­ÈK	ÎØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	Ü	ÊNÜœÙ]]šX]J	Ù]K[›ËZLN‰Ë	ÉÊNÜ^ÛÛ[SM
	Ó]pìYXÛÜÎˆ
ÌŒÝÙ\ˆ]™[Üˆ[\XÝÈ™X[ˆ™]˜]ÈØZ^X[ˆHH™Y™\™[˜ÚXKˆØ[Z[›ÜÈÛÛ™XÝYÜÈ\ÙH˜Y\˜H[°ë[Ëˆ˜Y]‹ÝÙ\ˆ]™[KŒ\ÝÜšXH[\Ý˜YHH]\]Y\ÈÝY\œÈHÝY\œÈHHÚH[ˆ[Ü°è]\‹‰Ë	Ñ[[ZY\Îˆ
ÌŒÝÙ\ˆ]™[\ˆXÝX[]ˆ™Y™\™[˜ÙHØZ^X[ˆÜ˜Z]ˆÛÛ›™XÝY›Ý]\Èœ›ÛHš]™\ˆYXYÝËˆ˜Y]‹ÝÙ\ˆ]™[K[\Ý˜]YÝÜžH[™Y[YKÚÚH]XÚÜÈ]HÜ˜]\‹‰Ë	Ð›Û™XÛÜÎˆ
ÌŒÝÙ\ˆ]™[ÜˆXÙ\È™X[ˆ™]˜]ÈØZ^X[ˆH™Y™\°ê›˜ÚXKˆ›Ý\ÈÛÛ™XÝY\È[H˜Y\šXHÈš[Ëˆ˜Y]‹ÝÙ\ˆ]™[KŒ\Ý0ìÜšXH[\Ý˜YHH]\]Y\ÈHÚH˜HÜ˜]\˜K‰Ë	ÒÝZÛ[\Žˆ\ˆÙ\°éÙZÈ\ØX™]H
ÌŒÝÙ\ˆ]™[ˆ™Y™\˜[œÝZÚHØZ^X[ˆÜ™\ÚKˆ™Z\ˆ0éØ^q,\±,[™[ˆ˜q'Û1,H[Û\‹ˆÜ˜]\™HÝÙ\ˆ]™[KŒ˜Y]‹™\Ú[[HZðèžYH™HÚHØ[1,\±,[\±,K‰ÊNÉ
	ÈÙX[ÙØ›ÙIÊKœ™\[™

NßNÂœ™XYSÙÌŒÏY[˜Ý[ÛŠ
^ÚYŠÙÑš\œÝŒß\™XYJ\™]\›ŽÛÙÑš\œÝŒÏ]YNÚYŠØØ[ÝÜ˜YÙK™Ù]][J	ÛÛ[šK\ÙY[‹]\]IÊHOOIÌK	Ê^Ý\]SÙÌŒÊ
NÛØØ[ÝÜ˜YÙKœÙ]][J	ÛÛ[šK\ÙY[‹]\]IË	ÌK	ÊNß_NÂ‹ËÈÜšYÚ[˜[KNˆ™[]]™HØZ^X[ˆ\˜Xš[]H[™ÝÙ\ˆ]™[™YÙ[™\˜][Û‹‚™[˜Ý[ÛˆØZTÝÙ\‘Ø\MŽJ]XÚÙ\‹Y™[™\Š^ØÛÛœÝØY™O]O“[X™\‹š\Ñš[š]JŠI‰ŒÝŽŒLÜ™]\›ˆÛ[\
X]œÜ\
ØY™J]XÚÙ\ŠKÜØY™JY™[™\ŠJKŒÍKL
NßB™[˜Ý[Ûˆ˜Y]‘[XYÙLMŽJ˜\ÙJ^Ü™]\›ˆØZRMÊ
JŠ˜\ÙKÌÌ
Jœ˜Y]“][\Y\ŒMŽ
˜[ÙJNßB™[˜Ý[ÛˆØZT™YÙ[”˜]LMŽJ
^Ü™]\›ˆKJËŒMŠ“X]œÜ\
X]›X^
ØZTÝ]LMÊ
KœÝÙ\‹LL
JNßB™[˜Ý[ÛˆØZT™YÙ[ŒMŽJ
^ÚYŠS[X™\‹š\Ñš[š]J
_L^Y\‹šL^Y\‹œ™YÙ[•ØZ]ŒØZT[ŒMËœÜ\Š\™]\›ŽØÛÛœÝ˜]O\ØZT™YÙ[”˜]LMŽJ
JŠ˜Y]ŒMŽË˜XÝ]™HÈŒˆˆJNÜ^Y\‹šSX]›Z[ŠØZRMÊ
K^Y\‹š
ÓX]›Z[ŠŒJJœ˜]JNßB˜ÛÛœÝ™]ÜÐ™Y›Ü™LMŽO]\]SÙÌŒÎÝ\]SÙÌŒÏY[˜Ý[ÛŠ‹‹˜J^Û™]ÜÐ™Y›Ü™LMŽJ‹‹˜JNÉ
	ÈÙX[ÙÙ^YXœ›ÝÉÊK^ÛÛ[IÓÓS’P“V–ˆÔ’QÒSS0­ÈKIÎØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	Ü	ÊNÜœÙ]]šX]J	Ù]K[›ËZLN‰Ë	ÉÊNÜ^ÛÛ[SM
	ÓH™YÙ[™\˜XÚpìÛˆHšYH][Y[HÛÛˆ[ÝÙ\ˆ]™[ˆ˜Y]ˆØ[Ý[H[pì[ÈÙYðî›ˆH›ÜÜ˜ÚpìÛˆHÙ\ˆHHšYHpè^[XKˆÛÛˆšYH[˜HHKŒœ™[HHKŒ™\Ú\Ý\È˜\š[ÜÈ[\XÝÜËˆ›ÝXØÚpìÛˆœ™]™H[™HÛÛ\È\˜H]š]\ˆpì[ÈØ›H[œÝ[0è[™[Ë‰Ë	ÒX[™YÙ[™\˜][Ûˆ[˜Ü™X\Ù\ÈÚ]ÝÙ\ˆ]™[ˆ˜Y]ˆ[XYÙH\Ù\ÈHÝÙ\ˆ˜][È[™[Ý\ˆX^[][HX[ˆ][X[KYØZ[œÝKÚ]Ý[™ÈÙ]™\˜[]ËˆœšYYˆ]›ÝXÝ[Ûˆ™]™[È[œÝ[ÝX›H[XYÙK‰Ë	ÐH™YÙ[™\˜péðèÛÈ][Y[HÛÛHÈÝÙ\ˆ]™[ˆÈ[›ÈH˜Y]ˆ\ØHH›ÜÜ°éðèÛÈHÙ\ˆHÝXHšYHpè^[XKˆÛÛHšYHÚZXKKŒÛÛ˜HKŒ™\Ú\ÝHH°è\š[ÜÈÛÛ\Ëˆ›ÝpéðèÛÈœ™]™H]š]H[›È\È[œÝ[0è›™[Ë‰Ë	ÐØ[ˆY[š[[›Y\ÚHÝÙ\ˆ]™[[H\\‹ˆ˜Y]ˆ\Ø\±,Hðï0éÈÜ˜[±,[˜H™H^˜[ZHØ[˜H˜q'Û1,Y1,\‹ˆ[HØ[›HKŒðï0éËKŒðïÙHØ\±gñ,Hš\šØpéÈ\˜™^YH^X[±,\‹ˆñ,\ØHÛÜ[XH[›1,ZÈ0éÚY\Ø\±,H0í››\‹‰ÊNÉ
	ÈÙX[ÙØ›ÙIÊKœ™\[™

NßNÂœ™XYSÙÌŒÏY[˜Ý[ÛŠ
^ÚYŠÙÑš\œÝŒß\™XYJ\™]\›ŽÛÙÑš\œÝŒÏ]YNÚYŠØØ[ÝÜ˜YÙK™Ù]][J	ÛÛ[šK\ÙY[‹]\]IÊHOOIÌKIÊ^Ý\]SÙÌŒÊ
NÛØØ[ÝÜ˜YÙKœÙ]][J	ÛÛ[šK\ÙY[‹]\]IË	ÌKIÊNß_NÂšYŠØØ][Û‹œÙX\˜Úš[˜ÛY\Ê	ÜXOLIÊJ]Ú[™ÝË—×ÝŒMŽ^Ù]˜[œÏO™]˜[
Ê_NÂ‚˜ÛÛœÝÛÜÙP™Y›Ü™LMŽXÛÜÙQX[ÙÎØÛÜÙQX[ÙÏY[˜Ý[ÛŠ
^ÚYŠ˜Y]”ÝÜžLMŽL	‰œ˜Y]’\™LMŽ

J^Ü˜Y]”›ÙÜ™\ÜÌMŽ

KœÙY[]YNÜ˜Y]”ÝÜžLMŽKLNØÛÛœÝ\˜Y]”ÙYYMŽ

NÚYŠŠ^Ø‹˜XÝ]™O]YNØ‹˜ÙLŽß_\™]\›ˆÛÜÙP™Y›Ü™LMŽ

NßNÂ˜ÛÛœÝÚÛÜÙP™Y›Ü™LMŽXÚÛÜÙT˜XÙNØÚÛÜÙT˜XÙOY[˜Ý[ÛŠ‹‹˜J^ØÛÛœÝÛ\˜XÙNØÛÛœÝÝ]XÚÛÜÙP™Y›Ü™LMŽ
‹‹˜JNÚYŠ˜XÙHOO[Û
^Ü˜Y]ŒMŽ[[Ü˜Y]”ÝÜžLMŽKLNß\™]\›ˆÝ]ßNÂ˜ÛÛœÝØY™Y›Ü™LMŽ[ØYÛØYY[˜Ý[ÛŠ‹‹˜J^Ü˜Y]ŒMŽ[[Ü˜Y]”ÝÜžLMŽKLNÜ™]\›ˆØY™Y›Ü™LMŽ
‹‹˜JNßNÂ‚‹ËÈÜšYÚ[˜[KˆÈ™]š\Ú[ÛŒMÌˆ[ˆQˆ\‹[™\[™[\‹\›Ùš[HÝ]K‚˜ÛÛœÝÕÔ–LMÌT‘QÒSÓ”Ë›[™ÝQÒ”‘QQMÌLMÌÂ˜ÛÛœÝ^MÌ^Âˆ]N–ÉÐ™[ˆL™YÜ™\ØH0­È\H‰Ë	Ð™[ˆL™]\›œÈ0­È\‰Ë	Ð™[ˆL™]Ü›˜H0­È\H‰Ë	Ð™[ˆL0í›°ï[Üˆ0­È°í›0ïH‰×Kˆ›Û™N–ÉÐ˜\ÙHÙXÜ™]HYÚœ™YY	Ë	ÒYÚœ™YYÙXÜ™]˜\ÙIË	Ð˜\ÙHÙXÜ™]HYÚœ™YY	Ë	ÒYÚœ™YYÚ^›H0ïÜðï	×KˆÛÜÙN–ÉÐÑT”T‰Ë	ÐÓÔÑIË	Ñ‘PÒT‰Ë	ÒÐTU	×K˜XÚÎ–ÉÕ“Ó‘T‰Ë	ÐPÒÉË	Õ“ÓT‰Ë	ÑÑT±,	×K™^–ÉÔÒQÕRQS•IË	Ó‘V	Ë	Ô°äÖSSÉË	ÔÓÓ”Rñ,	×Kˆ™\N–ÉÔ™\]ZY\™Hš]™[H[ÙÈ[™]šYX[ˆHÚ[™[pè]XØHYYH™\œÙHHÝX[]ZY\ˆš]™[‰Ë	Ô™\]Z\™\È]™[[™ÛÛÈ[ÙKˆHÚ[™[X]XÈ\È]˜Z[X›H][žH]™[‰Ë	Ô™\]Y\ˆ°ë]™[H[ÙÈ[™]šYX[ˆHÚ[™[pè]XØHÙHÙ\ˆš\ÝH[H]X[]Y\ˆ°ë]™[‰Ë	ÎˆÙ]š^YH™HZÈÚqgÚ[ZÈ[ÙÙ\™ZÚ\‹ˆÚ[™[X]ZÈ\ˆÙ]š^YYH^›[™Xš[\‹‰×KˆØš™XÝ]™\Î–ÖÉÒX›HÛÛˆ[ˆQˆ\˜HÛÛY[ž˜\‹‰Ë	Õ[ÈÈ[ˆQˆÈ™YÚ[‹‰Ë	Ñ˜[HÛÛH[ˆQˆ\˜HÛÛYpéØ\‹‰Ë	Ð˜qgÛ[XZÈpéÚ[ˆ[ˆQˆ[HÛÛqgË‰×KÉÑ[˜ÝY[˜HHpè\ØØ\˜H[ÝX\™XH[ˆH[˜YHHHZ[˜K‰Ë	Ñš[™HÝX\™X\ÚÈ]HZ[™H[˜[˜ÙK‰Ë	Ñ[˜ÛÛ™HHpè\ØØ\˜HÈÝX\™H˜H[˜YHHZ[˜K‰Ë	ÓXY[ˆÚ\šqgÚ[™H]ZY±,^ˆX\ÚÙ\Ú[šH[‰×KÉÑ\œ›ÝHHÜÈ™\È[Y[œÈHH˜]™K‰Ë	ÑY™X]H™YH[Y[œÈX›Ø\™HÚ\‰Ë	Ñ\œ›ÝHÜÈ°êœÈ[Y[œÈH˜]™K‰Ë	ÑÙ[ZYZÚH0ï0éÈ[Y[¸ &ZHY[‹‰×KÉÑ\ØXÝ]˜HÜÈÜÈ\0ìÜÚ]ÜÈH\›X\Ë‰Ë	Ñ\ØX›H›ÝÙX\ÛˆØXÚ\Ë‰Ë	Ñ\Ø]]™HÜÈÚ\È\0ìÜÚ]ÜÈH\›X\Ë‰Ë	ñ,ÚHÚ[Z\ÜÝ[H]œ™H1,qgñ,H±,\˜ZË‰×KÉÑ\œ›ÝH[ÛÛX[™[HYÚœ™YYˆ\Ü]Z]˜HÝ\È]\]Y\ÈÙpìX[YÜË‰Ë	ÑY™X]HYÚœ™YYÛÛ[X[™\‹ˆÙÙHHX\šÙY]XÚÜË‰Ë	Ñ\œ›ÝHÈÛÛX[™[HYÚœ™YYˆ\ÝšYHÜÈ]\]Y\ÈX\˜ØYÜË‰Ë	ÒYÚœ™YYÛÛ]][±,[±,HY[‹ˆ1,1gØ\™]HØ[1,\±,[\™[ˆØpéË‰×KÉÑ\ØXÝ]˜H[ØpìpìÛˆ[\ÈH]YH[Y[˜XÙHHÚ]YY‰Ë	Ñ\ØX›HHØ[››Ûˆ™Y›Ü™H]™X][œÈHÚ]K‰Ë	Ñ\Ø]]™HÈØ[š0èÛÈ[\È]YH[YXXÙHHÚYYK‰Ë	ñg™ZšHZ]]YY[ˆÜH]œ™H1,qgñ,H±,\˜ZË‰×KÉÔ™YÜ™\ØHÛÛˆ[ˆQˆ\˜HÙ\œ˜\ˆ[Ø\0ë][Ë‰Ë	Ô™]\›ˆÈ[ˆQˆÈš[š\ÚHÚ\\‹‰Ë	Õ›ÛHH[ˆQˆ\˜H[˜Ù\œ˜\ˆÈØ\0ë][Ë‰Ë	Ð°í›0ïpïš]\›YZÈpéÚ[ˆ[ˆQ¸ &^YH0í›‹‰×KÉÐØ\0ë][ÈÛÛ\]YËˆYY\È›Û™\ˆH™\ˆÝHÚ[™[pè]XØK‰Ë	ÐÚ\\ˆÛÛ\]Yˆ[ÝHØ[ˆ™\^H]ÈÚ[™[X]XË‰Ë	ÐØ\0ë][ÈÛÛ˜ÛpëYËˆ›ØðêˆÙH™]™\ˆHÚ[™[pè]XØK‰Ë	Ð°í›0ïH[X[[[™1,KˆÚ[™[X]q'ÚHY[šY[ˆ^›^YXš[\œÚ[‹‰×WKˆš[\Î–ÖÉÑXÚÈXÚÈ]Y[™H[˜YðìÛ‹ˆ[\]Z\ÈÛÛ[°î˜H˜\È[°èYšXÛÈH\›X\Ë‰Ë	ÑXÚÈXÚÈÝÜÈH˜YÛÛ‹ˆHX[H\œÝY\ÈHÙX\Ûˆ˜Z[‰Ë	ÑXÚÈXÚÈ]0ê[HÈ˜YðèÛËˆH\]Z\HÙYÝYHH\ÝH\È\›X\Ë‰Ë	ÑXÚÈXÚÈZ™\š^q,H\™\\‹ˆZÚ\Ú[Z\±,[ˆ^š[šHðï™\‹‰×KÉÓXœšYØYKˆÝH0î›[XHZ\ÚpìÛˆ]YYH[ˆX[›ÜÈH™[‹ÝÙ[ˆHÙ]š[‹‰Ë	ÓXœšY˜[Ëˆ\Èš[˜[Z\ÜÚ[Ûˆ™\ÝÈÚ]™[‹ÝÙ[ˆ[™Ù]š[‹‰Ë	ÓXœšYØZKˆÝXH0î›[XHZ\ÜðèÛÈšXØHÛÛH™[‹ÝÙ[ˆHÙ]š[‹‰Ë	ÓXœšY0ï1gÙ\‹ˆÛÛˆðíœ™]šH™[‹ÝÙ[ˆ™HÙ]š[ˆ]œ˜[1,\‹‰×KÉÕ[˜Hpè\ØØ\˜H\›Z]HH[™š[˜XÚpìÛ‹ˆHZ[˜HØÝ[H[˜H˜]™NÈX^XH›È\Ý0èH[0ëK‰Ë	ÐHX\ÚÈ[˜X›\È[™š[˜][Û‹ˆHZ[™HY\ÈHÚ\ÈX^\ÈÛÛ™K‰Ë	Õ[XHpè\ØØ\˜H\›Z]HH[™š[˜péðèÛËˆHZ[˜H\ØÛÛ™H[XH˜]™NÈX^°èHØZ]K‰Ë	ÓX\ÚÙHñ,^›X^q,HØq'Û\‹ˆXY[™HÚ^›HÙ[ZH˜\™1,\ŽÈX^Ü˜YHq'Ú[\‹‰×KÉÑ[\œÙ[˜[]YYH[][^˜YËˆ[][™ÛÝ\Ø]\ˆ›ÝYÙH[\]Z\ÈHÜÈ[Y[œË‰Ë	ÕH\œÙ[˜[\È\ØX›Yˆ[][™ÛÝ\Ø]\ˆ›ÝXÝÈHX[Hœ›ÛH[Y[œË‰Ë	ÓÈ\œÙ[˜[0êH\Ø]]˜YËˆ[][™ÛÝ\Ø]\ˆ›ÝYÙHH\]Z\HÜÈ[Y[œË‰Ë	ÐÙ\[™[ZÈ]Ú\Ú^™\‹ˆ[][™ÛÝ\Ø]\ˆZÚXšH[Y[œø &][ˆÛÜ\‹‰×KÉÑ[ÛÛX[™[H›Ü]YXHHØ[YKˆÝÙ[ˆHÙ]š[ˆÙH™]\˜[ŽÈ[][™ÛÝ\Ø]\ˆ™\Ú\ÝK‰Ë	ÕHÛÛ[X[™\ˆ›ØÚÜÈH^]ˆÝÙ[ˆ[™Ù]š[ˆ™]™X]È[][™ÛÝ\Ø]\ˆÛË‰Ë	ÓÈÛÛX[™[H›Ü]YZXHHØpëYKˆÝÙ[ˆHÙ]š[ˆ™XÝX[NÈ[][™ÛÝ\Ø]\ˆ™\Ú\ÝK‰Ë	ÒÛÛ]][ˆ0éñ,Zñ,qgñ,HØ\]1,\‹ˆÝÙ[ˆ™HÙ]š[ˆ0éÙZÚ[\ŽÈ[][™ÛÝ\Ø]\ˆ\™[š\‹‰×KÉÑ[ØpìpìÛˆÙH\YØHÛØœ™HHÚ]YYˆH˜]™HØYHZ›ÜÎÈÜÈ™\È›Ü›X[ˆ[ˆ\]Z\Ë‰Ë	ÕHØ[››ÛˆÚ]ÈÝÛˆÝ™\ˆHÚ]KˆHÚ\˜[ÈÛX\ŽÈ™YH\›Ù\È[š]K‰Ë	ÓÈØ[š0èÛÈ\˜HÛØœ™HHÚYYKˆH˜]™HØZHÛ™ÙNÈÜÈ°êœÈÙH[™[K‰Ë	ñg™Z\ˆ0ïÝ0ï™ZÚHÜÝ\Ø\‹ˆÙ[ZH^˜q'ØH0ï1gÙ\ŽÈ0ï0éÈØZ˜[X[ˆš\›qgÚ\‹‰×WBŸNÂ˜ÛÛœÝMÌZÏO“M
‹‹^MÌÚ×JNÂ”‘QÒSÓ”Ëœ\Ú
XZÙT™YÚ[ÛŒMÊ	ØY”™]\›”\ŒMÌ	ËMÌ
	Þ›Û™IÊKMÌ
	Ý]IÊKßKÝÛÜ›ÎŒŒŒÛÜ›ŒLLZ[–ŒÍKX^ŒŒMKÜŽ›ÝÛNŒL^]NŽLÜ[ŒLLÚ]N™˜[Ù_JJNÂ˜ÛÛœÝ\MÌ^ßNÙ›ÜŠÛÛœÝÈÙˆÉÛX\	Ë	ØÚ[™[XIË	ØÛÛ[X[™\‰×J^Ø\MÌÚ×O[™]È[XYÙJ
NØ\MÌÚ×KœÜ˜ÏIÜÞ\Ý[LMÌÉÊÚÊÉËÙXœ	ÎßB™[˜Ý[ÛˆÝÜžLMÌ

^Û]O\^Y\‹œÝÜžPQŒMÌÚYŠ\_\[ÙˆHOOIÛØš™XÝ	ß\œ˜^Kš\Ð\œ˜^JJJ\O^ßNÜK˜ÛZ[YY\K˜ÛZ[YYOO]YNÜKœÝYÙO\K˜ÛZ[YYÍÎ˜Û[\
X]™›ÛÜŠ[X™\ŠKœÝYÙJ_
KŠNÜKšÚ[ÏVË‹‹›™]ÈÙ]

\œ˜^Kš\Ð\œ˜^JKšÚ[ÊOÜKšÚ[Î–×JK™š[\ŠO“[X™\‹š\Ò[YÙ\ŠŠI‰›L	‰›
JWNÜK˜ØXÚ\ÏVË‹‹›™]ÈÙ]

\œ˜^Kš\Ð\œ˜^JK˜ØXÚ\ÊOÜK˜ØXÚ\Î–×JK™š[\ŠO›OOLOOLJJWNÜKšP\œ˜^K™œ›ÛJÛ[™ÝK
ËJOOœKšÚ[Ëš[˜ÛY\ÊJOÌ“[X™\‹š\Ñš[š]JKšË–ÚWJOØÛ[\
KšÚWKKL
NL
NÜ^Y\‹œÝÜžPQŒMÌ\NÜ™]\›ˆNßB™[˜Ý[ÛˆØ[”ÝÜžLMÌ

^Ü™]\›ˆÛÛÌMN

I‰ˆ\ØZLMÊ
I‰œ^Y\‹›]™[NßB™[˜Ý[ÛˆXZÙQ[™[^LMÌ
J^ØÛÛœÝO\ÝÜžLMÌ

NÜ™]\›žÚYŒMÌ
ÚK]Y\ÝMÌYK[™^MÌšKÚ[™‰Ù[™[^IË›ÝÎšOOOLÏÒQÒ”‘QQMÌMŠÚK[™[^RÙ^LMLŽšOOOLÏÉÚYÚœ™YYMÌ	Î‰Ù˜\Ú\MÌIÊÚK˜[YNšOOOLÏÓM
	ÐÛÛX[™[HYÚœ™YY	Ë	ÒYÚœ™YYÛÛ[X[™\‰Ë	ÐÛÛX[™[HYÚœ™YY	Ë	ÒYÚœ™YYÛÛ]][±,IÊN“M
	Ñ[Y[ˆHH˜]™IË	ÔÚ\[Y[‰Ë	Ñ[Y[ˆH˜]™IË	ÑÙ[ZH[Y[¸ &ZIÊK]™[ŽX^LœKšÚWK[XYÙN[]™NYK–ÍÍLLLMNLVÚWKNŽŒ
ÚILŠŽ˜XÙN‹LK[š[NŒÙŒŠÚJ‹ŒKÝ[ŽŒÚ[™Œ[]PÚXÚÙYMÎYK[]NMÎ™˜[Ù_NßB™[˜Ý[ÛˆÙYYMÌ

^ÚYŠ›Û™HOOTÕÔ–LMÌ
\™]\›ŽØÛÛœÝO\ÝÜžLMÌ

KYÏ\KœÝYÙOOOLÖÌK—NœKœÝYÙOOOMÖÌ×N–×NÙ[™[ZY\ÏY[™[ZY\Ë™š[\ŠOO™Kœ]Y\ÝMÌ	‰šYËš[˜ÛY\ÊKš[™^MÌ
I‰™K˜[]™I‰ˆ\KšÚ[Ëš[˜ÛY\ÊKš[™^MÌ
JNÙ›ÜŠÛÛœÝHÙˆYÊZYŠ\KšÚ[Ëš[˜ÛY\ÊJI‰ˆY[™[ZY\ËœÛÛYJOO™Kš[™^MÌOOZJJY[™[ZY\Ëœ\Ú
XZÙQ[™[^LMÌ
JJNÞ›Û™TÝ]\ÖÜ™YÚ[ÛŠ
KšYOY[™[ZY\ÎßB™[˜Ý[Ûˆš[LMÌ
OLÛ™O][’XŒMÌ
^ÚOXÛ[\
X]™›ÛÜŠJKJNÜÚÝÑX[ÙÊ	ÕSˆQˆ0­È‹Ì‰ËMÌ
	Ý]IÊK	Ï]ˆ]K[›ËZLN]ˆÛ\ÜÏH™š[KYœ˜[YLMÌØ[˜\ÈYH™š[LMÌˆÚYHÍŽˆZYÚHLLˆØØ[˜\ÏÙ]‰ÊÓM
‹‹^MÌ™š[\ÖÚWJJÉÏÜÛX[‰ÊÓM
	ÐY\XÚpìÛˆ[\Ý˜YH[\\ÛÙ[Ëˆ›È\Ø›Ü]YXH[Y[œÈšHØ[XšXHH˜^˜K‰Ë	Ò[\Ý˜]Y\\ÛÙHY\][Û‹ˆ]Ù\È›Ý[›ØÚÈ[Y[œÈÜˆÚ[™ÙH[Ý\ˆ˜XÙK‰Ë	ÐY\péðèÛÈ[\Ý˜YHÈ\\ðìÙ[Ëˆ°èÛÈ\Ø›Ü]YZXH[Y[œÈ™[H]YHÝXH˜péØK‰Ë	Ð°í›0ïpïˆ™\Ú[[H^X\›[X\ñ,Kˆ^˜^[1,HpéÛX^ˆ™H1,\šñ,[±,Hq'ÚqgÝ\›Y^‹‰ÊJÉÈ0­È	ÊÊJÌJJÉËÍÜÛX[Ù]‰ËÖÚOOÕMÌ
	Û™^	ÊN“M
	Ñ’SSVT‰Ë	Ñ’S’TÒ	Ë	ÐÓÓÓRT‰Ë	Ð±,1,‰ÊK

OOšOOÙš[LMÌ
JÌKÛ™JN™Û™J
WKÓM
	ÔÐSTˆÒS‘SpàUPÐIË	ÔÒÒTÒS‘SPUPÉË	ÔSTˆÒS‘SpàUPÐIË	Ôñ,‘SPU1,1'±,UIÊKÛ™WWJNØÛÛœÝZ[J
OOžØÛÛœÝÏYØÝ[Y[™Ù][[Y[žRY
	Ùš[LMÌ	ÊNÚYŠXßX\MÌ˜Ú[™[XK˜ÛÛ\]_X\MÌ˜Ú[™[XK›˜]\˜[ÚY
\™]\›ŽØÛÛœÝØÏXË™Ù]ÛÛ^
	Ì™	ÊKÏX\MÌ˜Ú[™[XKÚYÌËX\MÌ˜Ú[™[XKšZYÚÌŽØØËš[XYÙTÛ[ÛÝ[™Ñ[˜X›YY˜[ÙNØØË™˜]Ò[XYÙJ\MÌ˜Ú[™[XKILÊËX]™›ÛÜŠKÌÊJšËÍŽLLŠNßNÜZ[

NØ\MÌ˜Ú[™[XK›Û›ØY\Z[Ü™]\›ˆYNßB™[˜Ý[ÛˆÝ\ÝÜžLMÌ

^ÚYŠ›Û™HOOS’QÒMM_XØ[”ÝÜžLMÌ

J\™]\›ˆ˜[ÙNØÛÛœÝO\ÝÜžLMÌ

NÚYŠK˜ÛZ[YY
\™]\›ˆ˜[ÙNÚYŠKœÝYÙOOOMŠ\™]\›ˆ˜[ÙNÚYŠ\KœÝYÙJ\KœÝYÙOLNØÛÜÙQX[ÙÊ
NÚYŠ\\œÛÛ˜[[\ÊÕÔ–LMÌŒÌL
J\™]\›ˆ˜[ÙNÜÙYYMÌ

NÜØ]™J
NÚYŠKœÝYÙOOOLJYš[LMÌ
ÛÜÙQX[ÙÊNÜ™]\›ˆYNßB™[˜Ý[Ûˆ^]ÝÜžLMÌ

^ÚYŠ›Û™HOOTÕÔ–LMÌ
\™]\›ˆ˜[ÙNØÛÜÙQX[ÙÊ
NÜ\œÛÛ˜[[\Ê’QÒMMKSŒMNž
ÌLŒSŒMNžJNÜØ]™J
NÜ™]\›ˆYNßB™[˜Ý[ÛˆÛZ[TÝÜžLMÌ

^ØÛÛœÝO\ÝÜžLMÌ

NÚYŠ›Û™HOOS’QÒMM_XØ[”ÝÜžLMÌ

_KœÝYÙHOOMŸK˜ÛZ[YY
\™]\›ˆ˜[ÙNÜK˜ÛZ[YY]YNÜKœÝYÙOMÎÛ]LÝÚ[JÉ‰œ^Y\‹›]™[ML
^Þ
X]›X^
K™YY

K\^Y\‹ž
JNÛŠÊÎß\Ø]™J
NÜ™]\›ˆŽßB™[˜Ý[ÛˆÚ\\“Y[LMÌ

^ØÛÛœÝO\ÝÜžLMÌ

NÜÚÝÑX[ÙÊ	ÕSˆQˆ0­È‹Ì‰ËMÌ
	Ý]IÊK	Ï]ˆ]K[›ËZLN‰ÊÕMÌ
	Ü™\IÊJÉÏÜ‰ÊÓM
‹‹^MÌ›Øš™XÝ]™\ÖÜKœÝYÙWJJÉÏÜ‰ÊÓM
	Ñ[™[ZYÛÜÎˆLŒHšYHHHpì[ÈÜˆ[\XÝËˆ™XÛÛ\[œØH0î›šXØNˆÈš]™[\Ë\ÝHMLˆYY\È[\^˜\ˆÚ[ˆÛÛ\]\ˆH\HK‰Ë	Ñ[™[ZY\ÎˆLX[[™[XYÙH\ˆ]ˆÛ™K][YH™]Ø\™ˆÈ]™[ËØ\Y]MLˆ\HÛÛ\][Ûˆ\È›Ý™\]Z\™Y‰Ë	Ò[š[ZYÛÜÎˆLŒHšYHHH[›ÈÜˆXÙ\Ëˆ™XÛÛ\[œØH0î›šXØNˆÈ°ë]™Z\Ë]0êHMLˆ°èÛÈ^YÙHÛÛ˜ÛZ\ˆH\HK‰Ë	Ñ0ï1gÛX[›\ŽˆLŒØ[ˆ™H\ØX™]˜qgñ,[˜H\Ø\‹ˆZÈ0í™0ïˆMLñ,[±,\±,[˜HØY\ˆÈÙ]š^YKˆ°í›0ïHH›Ü[›Hq'Ú[\‹‰ÊJÉÏÜÙ]‰ËË‹‹Š\K˜ÛZ[YYÖÖÜKœÝYÙOOOMÓM
	Ô‘PÒP’Tˆ‘PÓÓTS”ÐIË	ÐÓRSH‘UÐT‘	Ë	Ô‘PÑP‘Tˆ‘PÓÓTS”ÐIË	ðå‘0ç0çS	ÊNœKœÝYÙOÓM
	Ô‘PS•QTˆRTÒpäÓ‰Ë	Ô‘TÕSQHRTÔÒSÓ‰Ë	Ô‘UÓPTˆRTÔðàÓÉË	Ñðå”‘U‘HUSIÊN“M
	ÒS’PÒPTˆRTÒpäÓˆ0­È•‹Ž	Ë	ÔÕT•RTÔÒSÓˆ0­È‹Ž	Ë	ÒS’PÒPTˆRTÔðàÓÈ0­È•‹Ž	Ë	Ñðå”‘U±,qg“U0­ÈÕ‹Ž	ÊK

OOžÚYŠKœÝYÙOOOMŠ^ÚYŠÛZ[TÝÜžLMÌ

HOOY˜[ÙJXÚ\\“Y[LMÌ

NÙ[ÙHØ\Ý
MÌ
	Ü™\IÊJNßY[ÙHYŠ\Ý\ÝÜžLMÌ

J]Ø\Ý
MÌ
	Ü™\IÊJNßWWN–×JKÓM
	Õ‘TˆÒS‘SpàUPÐIË	ÕÐUÒÒS‘SPUPÉË	Õ‘TˆÒS‘SpàUPÐIË	Ôñ,‘SPU1,1'±,1,“IÊK

OO™š[LMÌ
Ú\\“Y[LMÌ
WKÕMÌ
	Ø˜XÚÉÊK[’XŒMÌKÕMÌ
	ØÛÜÙIÊKÛÜÙQX[Ù×WJNßB˜ÛÛœÝ[”\LMÌ][“Y[LMNÙ[˜Ý[Ûˆ[’XŒMÌ

^ÜÚÝÑX[ÙÊ	ÕSˆQ‰ËM
	ÐØ\0ë][ÜÈ[Y[ˆ›Ü˜ÙIË	Ð[Y[ˆ›Ü˜ÙHÚ\\œÉË	ÐØ\0ë][ÜÈ[Y[ˆ›Ü˜ÙIË	Ð[Y[ˆ›Ü˜ÙH°í›0ï[\šIÊK	Ï]K[›ËZLN‰ÊÓM
	Ñ[YÙH[˜HZ\ÚpìÛˆÈZ\˜HÝHÚ[™[pè]XØKˆØYH˜^˜HÛÛœÙ\˜HÝ\ÈØš™]]›ÜÈH™XÛÛ\[œØ\Ë‰Ë	ÐÚÛÜÙHHZ\ÜÚ[ÛˆÜˆØ]Ú]ÈÚ[™[X]XËˆXXÚ˜XÙHÙY\È]ÈØš™XÝ]™\È[™™]Ø\™Ë‰Ë	Ñ\ØÛÛH[XHZ\ÜðèÛÈÝH™Z˜HÝXHÚ[™[pè]XØKˆØYH˜péØHÛÛœÙ\˜HØš™]]›ÜÈH™XÛÛ\[œØ\Ë‰Ë	Ñðíœ™]ˆÙpéÈXHHÚ[™[X]q'ÚH^›Kˆ\ˆ1,\šÈYYˆ™H0í™0ï\š[šHÛÜ\‹‰ÊJÉÏÜ‰ËÖÓM
	ÔT•HH0­È•‹ŽIË	ÔT•H0­È‹ŽIË	ÔT•HH0­È•‹ŽIË	Ð°å“0çHH0­ÈÕ‹ŽIÊK[”\LMÌKÓM
	ÔT•Hˆ0­È•‹Ž	Ë	ÔT•ˆ0­È‹Ž	Ë	ÔT•Hˆ0­È•‹Ž	Ë	Ð°å“0çHˆ0­ÈÕ‹Ž	ÊKÚ\\“Y[LMÌKÓM
	ÐÒS‘SpàUPÐH0­ÈT•H‰Ë	ÐÒS‘SPUPÈ0­ÈT•‰Ë	ÐÒS‘SpàUPÐH0­ÈT•H‰Ë	Ôñ,‘SPU1,È0­È°å“0çH‰ÊK

OO™š[LMÌ
[’XŒMÌ
WKÕMÌ
	ØÛÜÙIÊKÛÜÙQX[Ù×WJNß][“Y[LMN][’XŒMÌÂ™[˜Ý[Ûˆ\™Ù]ÌMÌ

^ØÛÛœÝO\ÝÜžLMÌ

NÚYŠKœÝYÙOOOLJ\™]\›–ÞÞLNŽLX™[“M
	ÓpàTÐÐTIË	ÓPTÒÉË	ÓpàTÐÐTIË	ÓPTÒÑIÊ_WNÚYŠKœÝYÙOOOLÊ\™]\›–ÌLMLMK›X\

Y
OOŠÞNŽLYX™[“M
	ÐT“PSQS•ÉË	ÕÑPTÓ”ÉË	ÐT“PSQS•ÉË	Ôñ,RT‰Ê_JJK™š[\ŠOˆ\K˜ØXÚ\Ëš[˜ÛY\ÊšY
JNÚYŠKœÝYÙOOOMJ\™]\›–ÞÞŒŒLNŽLX™[“M
	ÐÐpäpäÓ‰Ë	ÐÐS““Ó‰Ë	ÐÐS’0àÓÉË	ÕÔ	Ê_WNÜ™]\›–×NßB™[˜Ý[Ûˆ[\˜XÝÝÜžLMÌ

^ÚYŠ›Û™HOOTÕÔ–LMÌ
\™]\›ˆ˜[ÙNØÛÛœÝO\ÝÜžLMÌ

K]\™Ù]ÌMÌ

K™š[™
O™\Ý
^Y\‹
OM
NÚYŠ
^ÚYŠKœÝYÙOOOLJ^ÜKœÝYÙOLŽÜÙYYMÌ

NÙš[LMÌ
‹ÛÜÙQX[ÙÊNßY[ÙHYŠKœÝYÙOOOLÊ^ÜK˜ØXÚ\Ëœ\Ú
šY
NÚYŠK˜ØXÚ\Ë›[™ÝOOLŠ^ÜKœÝYÙOMÜÙYYMÌ

NÙš[LMÌ
ÛÜÙQX[ÙÊNß_Y[ÙHYŠKœÝYÙOOOMJ^ÜKœÝYÙOMŽÙš[LMÌ
K^]ÝÜžLMÌ
Nß\Ø]™J
NÜ™]\›ˆYNßZYŠ\Ý
^Y\‹ÞŒMÌNŽMŒJOML
\™]\›ˆ^]ÝÜžLMÌ

NÜ™]\›ˆ˜[ÙNßB˜ÛÛœÝ[XYÙP™Y›Ü™LMÌY[XYÙQ[™[^NÙ[XYÙQ[™[^OY[˜Ý[ÛŠK‹‹˜J^ÚYŠYOËœ]Y\ÝMÌ
\™]\›ˆ[XYÙP™Y›Ü™LMÌ
K‹‹˜JNÚYŠ›Û™HOOTÕÔ–LMÌXØ[”ÝÜžLMÌ

_YK˜[]™_S[X™\‹š\Ñš[š]J
_L
\™]\›ŽØÛÛœÝO\ÝÜžLMÌ

NÚYŠJKœÝYÙOOOL‰‰™Kš[™^MÌßKœÝYÙOOOM	‰™Kš[™^MÌOOLÊ_KšÚ[Ëš[˜ÛY\ÊKš[™^MÌ
J\™]\›ŽÙKšSX]›X^
KšSX]œ›Ý[™

JNÙKš]KŒMŽÜKšÙKš[™^MÌOYKšÜÜ\
KžKžKLMK	ÉÊÓX]œ›Ý[™

JNÚYŠKšL
^ÙK˜[]™OY˜[ÙNÜKšÚ[Ëœ\Ú
Kš[™^MÌ
NÚYŠKš[™^MÌOOLÊ^ÜKœÝYÙOMNßY[ÙHYŠÌK—K™]™\žJOOœKšÚ[Ëš[˜ÛY\ÊJJJ^ÜKœÝYÙOLÎÙš[LMÌ
ËÛÜÙQX[ÙÊNß_\Ø]™J
NßNÂ™[˜Ý[Ûˆ\]Q[™[ZY\ÌMÌ

^ÚYŠ›Û™HOOTÕÔ–LMÌXØ[”ÝÜžLMÌ

J\™]\›ŽÙ›ÜŠÛÛœÝHÙˆ[™[ZY\Ë™š[\ŠOO™Kœ]Y\ÝMÌ	‰™K˜[]™JJ^ÙK˜[š[JÏY
ŒLŽÙKš]SX]›X^

Kš]
KY
NÙK˜ÙSX]›X^
K˜ÙY
NÙKœÝ[SX]›X^
KœÝ[‹Y
NÙK›[Ýš[™ÏY˜[ÙNÚYŠKœÝ[Œ
^ÙKÚ[™LØÛÛ[YNßZYŠKÚ[™Œ
^ÙKÚ[™SX]›X^
KÚ[™Y
NÚYŠYKÚ[™
^Ù›ÜŠÛÛœÝÙˆX[U\™Ù]Ê
JZYŠ
OO\^Y\ŸšŒ
I‰™\Ý
Þ™K˜Z[VMÌN™K˜Z[VLMÌJO
Kš[™^MÌOOLÏÌMLŒL
JZ\X[J
NÙK˜ÙYKš[™^MÌOOLÏÌ‹ŽŒ‹ßXÛÛ[YNßXÛÛœÝ]X[U\™Ù]Ê
K™š[\ŠOŠOO\^Y\ŸšŒ
I‰™\Ý
K
OÍL
KœÛÜ

KŠOO™\Ý
KJKY\Ý
KŠJVÌNÚYŠ]
XÛÛ[YNÙK™˜XÙO]žKžËLNŒNØÛÛœÝY\Ý
K
NÚYŠŠKš[™^MÌOOLÏÌLNŽJJ^ØÛÛœÝÏSX]›Z[Š
Kš[™^MÌOOLÏÎMNŒLL
J™
KÓX]›X^
K
NÛ[Ý™PXÝÜŠK
žYKž
JšË
žKYKžJJšÊNÙK›[Ýš[™Ï]YNßY[ÙHYŠK˜ÙL
^ÙKÚ[™YKš[™^MÌOOLÏÌN‹ÍNÙK˜Z[VMÌ]žÙK˜Z[VLMÌ]žNß__B˜ÛÛœÝ[™[ZY\Ð™Y›Ü™LMÌ]\]Q[™[ZY\ÎÝ\]Q[™[ZY\ÏY[˜Ý[ÛŠ
^ØÛÛœÝ[Y[™[ZY\ÎÚYŠX[œÛÛYJOO™Kœ]Y\ÝMÌ
J\™]\›ˆ[™[ZY\Ð™Y›Ü™LMÌ

NÛ]ŽÙ[™[ZY\ÏX[™š[\ŠOOˆYKœ]Y\ÝMÌ
NÝž^ÜY[™[ZY\Ð™Y›Ü™LMÌ

NßYš[˜[^Ù[™[ZY\ÏX[ßZYŠ\]\ÙY	‰ˆXÚ[™[X]XÊ]\]Q[™[ZY\ÌMÌ

NÜ™]\›ˆŽßNÂ™[˜Ý[Ûˆ˜]Ñ[™[^LMÌ
J^ÚYŠKš[™^MÌOOLÊ^ØÛÛœÝ›ÝÏYKÚ[™ŒÌŽ™K›[Ýš[™É‰œ^Y\‹žOKžOÌNŒØÝœØ]™J
NØÝ˜[œÛ]JKžKžJNØÝœØØ[JK™˜XÙOËLNŒKJNÝ[LMMJÝ\MÌ˜ÛÛ[X[™\‹›ÝËX]™›ÛÜŠK˜[š[JINNŒÌ
NØÝœ™\ÝÜ™J
NßY[Ù^ØÝœØ]™J
NØÝ˜[œÛ]JKžKžJNØÝœØØ[JK™˜XÙOËLNŒKJNÝ[LMMJÝ\MN™[™[ZY\ËKš[™^MÌ
ŒŠÊKÚ[™ŒÌNŒ
KX]™›ÛÜŠK˜[š[JINMŒMMJNØÝœ™\ÝÜ™J
NßXÛÛœÝ˜\–OYKžKJKš[™^MÌOOLÏÌLŒMJNØÝ™š[Ý[OIÈÌMLŒÌÍÉÎØÝ™š[™XÝ
KžML˜\–KLŠNØÝ™š[Ý[OIÈÙŒ˜X‰ÎØÝ™š[™XÝ
KžML˜\–KL
™KšÍLŠNÝ
K›˜[YKKž˜\–KLLLK	ÈÙ™™XŒ	ÊNÚYŠKÚ[™Œ
^ØÝœÝ›ÚÙTÝ[OIÈÙ™Ž˜‰ÎØÝ›[™UÚYLÎØÝ˜™YÚ[”]

NØÝ™[\ÙJK˜Z[VMÌK˜Z[VLMÌKš[™^MÌOOLÏÌMLŒLKX]”JŒŠNØÝœÝ›ÚÙJ
Nß_B˜ÛÛœÝÙ^P™Y›Ü™LMÌY[™[^RÙ^LNÙ[™[^RÙ^LNYOO™OËœ]Y\ÝMÌÊKš[™^MÌOOLÏÉÚYÚœ™YYMÌ	Î‰Ù˜\Ú\MÌIÊÙKš[™^MÌ
NšÙ^P™Y›Ü™LMÌ
JNÂ˜ÛÛœÝÜš]P™Y›Ü™LMÌ\Üš]R[™›ÎÜÜš]R[™›ÏY[˜Ý[ÛŠ›ÝÊ^ÚYŠ›ÝÏOORQÒ”‘QQMÌ
^ØÛÛœÝÏX\MÌ˜ÛÛ[X[™\‹ÚYÎX\MÌ˜ÛÛ[X[™\‹šZYÚÍÜ™]\›žÜÚY]˜\MÌ˜ÛÛ[X[™\‹X›N–ÌK‹K›X\
OO–ÚJËËJ_Nß\™]\›ˆÜš]P™Y›Ü™LMÌ
›ÝÊNßNÂ˜ÛÛœÝYXP™Y›Ü™LMÌ\YXRXÛÛŒNÜYXRXÛÛŒNY[˜Ý[ÛŠË›ÝËÛ›ÝÛ‹‹‹˜J^ÚYŠ›ÝÈOORQÒ”‘QQMÌ
\™]\›ˆYXP™Y›Ü™LMÌ
Ë›ÝËÛ›ÝÛ‹‹‹˜JNØÛÛœÝ[OX\MÌ˜ÛÛ[X[™\ŽÚYŠZ[K˜ÛÛ\]_Z[K›˜]\˜[ÚY
^Ú[K˜Y]™[\Ý[™\Š	ÛØY	Ë

OOœYXRXÛÛŒN
Ë›ÝËÛ›ÝÛ‹‹‹˜JKÛÛ˜ÙNY_JNÜ™]\›ŽßXÛÛœÝØÏXË™Ù]ÛÛ^
	Ì™	ÊKÏZ[KÚYÎZ[KšZYÚÍNÏY
ËÚØØË˜ÛX\”™XÝ
ËÚYËšZYÚ
NØØËš[XYÙTÛ[ÛÝ[™Ñ[˜X›YY˜[ÙNØØË™˜]Ò[XYÙJ[KËËÚYÌ‹YËÌ‹ËšZYÚYË
NÚYŠZÛ›ÝÛŠ^ØØË™ÛØ˜[ÛÛ\ÜÚ]SÜ\˜][ÛIÜÛÝ\˜ÙKX]Ü	ÎØØË™š[Ý[OIÈÌMÍ	ÎØØË™š[™XÝ
ËÚYËšZYÚ
NØØË™ÛØ˜[ÛÛ\ÜÚ]SÜ\˜][ÛIÜÛÝ\˜ÙK[Ý™\‰Îß\™]\›ˆYNßNÂ™[˜Ý[Ûˆ™Yœ™\Ú™\ÝMÌ

^Ð‘TÕPT–LNšYÚœ™YYMÌVÓM
	ÐÛÛX[™[HYÚœ™YY	Ë	ÒYÚœ™YYÛÛ[X[™\‰Ë	ÐÛÛX[™[HYÚœ™YY	Ë	ÒYÚœ™YYÛÛ]][±,IÊKQÒ”‘QQMÌ	ÕSˆQˆ0­È‹Ì‰Ë	ÍL0­È	ËM
	Ô›ÝYÙHH˜]™KˆÝ\ÈÛÛ\ÈY[™[ˆ[ˆ]š\ÛÈH[ˆÙYÝ[™Ë‰Ë	ÑÝX\™ÈHÚ\ˆ]È]XÚÜÈ]™HHÛ™K\ÙXÛÛ™Ø\›š[™Ë‰Ë	Ô›ÝYÙHH˜]™KˆÜÈÛÛ\È0ê›H]š\ÛÈH[HÙYÝ[™Ë‰Ë	ÑÙ[Z^ZHÛÜ\‹ˆØ[1,\±,[\±,[™[ˆš\ˆØ[š^YH0í›˜ÙH^X\±,H™\š\‹‰ÊWNÙ›ÜŠ]OLÚOÎÚJÊÊP‘TÕPT–LNÉÙ˜\Ú\MÌIÊÚWOVÓM
	Ñ[Y[ˆHH˜]™IË	ÔÚ\[Y[‰Ë	Ñ[Y[ˆH˜]™IË	ÑÙ[ZH[Y[¸ &ZIÊKMŠÚK	ÕSˆQˆ0­È‹Ì‰Ë	ÍL0­È	ËM
	ÑÝX\™XH[\œÙ[˜[È\Ü]Z]˜HH›Û˜HX\˜ØYK‰Ë	Ð\œÙ[˜[ÝX\™ÈÙÙHHX\šÙY›Û™K‰Ë	ÑÝX\™HÈ\œÙ[˜[È\ÝšYHH0è\™XHX\˜ØYK‰Ë	ÐÙ\[™[ZÈ]ZY±,^±,NÈqgØ\™]H[[™[ˆØpéË‰ÊWNß\™Yœ™\Ú™\ÝMÌ

NÂ˜ÛÛœÝØÙ[™P™Y›Ü™LMÌY˜]ÔØÙ[™NÙ˜]ÔØÙ[™OY[˜Ý[ÛŠË‹‹‹˜J^ÚYŠˆOOTÕÔ–LMÌ
\™]\›ˆØÙ[™P™Y›Ü™LMÌ
Ë‹‹‹˜JNØË™š[Ý[OIÈÌŒMÌŒÉÎØË™š[™XÝ
ŒŒLL
NÚYŠ\MÌ›X\˜ÛÛ\]I‰˜\MÌ›X\›˜]\˜[ÚY
XË™˜]Ò[XYÙJ\MÌ›X\ŒŒLL
NßNÂ˜ÛÛœÝ›Ý[™Ð™Y›Ü™LMÌXÚ]P›Ý[™ÌŒNØÚ]P›Ý[™ÌŒOY[˜Ý[ÛŠ
^Ø›Ý[™Ð™Y›Ü™LMÌ

NÚYŠ›Û™OOOTÕÔ–LMÌ
^ÕÕÏLŒŒÕÒLLLß_NÂ˜ÛÛœÝÜ]Û™Y›Ü™LMÌ\Ü]Û‘[™[ZY\ÎÜÜ]Û‘[™[ZY\ÏY[˜Ý[ÛŠ
^ÚYŠ›Û™HOOTÕÔ–LMÌ
\™]\›ˆÜ]Û™Y›Ü™LMÌ

NÙ[™[ZY\ÏV×NÜÙYYMÌ

NßNÂ˜ÛÛœÝ[\™Y›Ü™LMÌY[\–›Û™NÙ[\–›Û™OY[˜Ý[ÛŠ‹‹‹˜J^ÚYŠOOTÕÔ–LMÌ	‰ŠXØ[”ÝÜžLMÌ

_\ÝÜžLMÌ

KœÝYÙ_ÝÜžLMÌ

K˜ÛZ[YY
J\™]\›ˆ˜[ÙNØÛÛœÝY[\™Y›Ü™LMÌ
‹‹‹˜JNÚYŠ‰‰ž›Û™OOOTÕÔ–LMÌ
^ÜÙYYMÌ

NØÚ]P›Ý[™ÌŒJ
Nß\™]\›ˆŽßNÂ˜ÛÛœÝØ]P™Y›Ü™LMÌ\ØY™QØ]V›Û™LMLNÜØY™QØ]V›Û™LMLOJ
OOž›Û™HOOTÕÔ–LMÌ	‰™Ø]P™Y›Ü™LMÌ

NÂ˜ÛÛœÝ[\˜XÝ™Y›Ü™LMÌZ[\˜XÝÚ[\˜XÝY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆ›Û™OOOTÕÔ–LMÌÚ[\˜XÝÝÜžLMÌ

Nš[\˜XÝ™Y›Ü™LMÌ
‹‹˜JNßNÂ˜ÛÛœÝY™Y›Ü™LMÌZYÚYY[˜Ý[ÛŠ‹‹˜J^Ü™Yœ™\Ú™\ÝMÌ

NÔ‘QÒSÓ”ÖÔÕÔ–LMÌK›˜[YOUMÌ
	Þ›Û™IÊNØÛÛœÝZY™Y›Ü™LMÌ
‹‹˜JNÚYŠÝ\Y	‰ž›Û™OOOTÕÔ–LMÌ
^ØÛÛœÝO\ÝÜžLMÌ

NÉ
	ÈÛZ\ÜÚ[Ûˆ[žIÊK^ÛÛ[IÕSˆQˆ0­È‹Ìˆ0­È	ÊÓM
	Ó•‹Ž	Ë	Ó‹Ž	Ë	Ó•‹Ž	Ë	ÔÕ‹Ž	ÊNÉ
	ÈÜ]Y\Ý^	ÊK^ÛÛ[UMÌ
	Ý]IÊNÉ
	ÈÜ]Y\ÝÝX‰ÊK^ÛÛ[SM
‹‹^MÌ›Øš™XÝ]™\ÖÜKœÝYÙWJNÚYŠ\™Ù]ÌMÌ

KœÛÛYJO™\Ý
^Y\‹
OM
_\Ý
^Y\‹ÞŒMÌNŽMŒJOML
^É
	ÈÝ[ÉÊK˜Û\ÜÓ\Ýœ™[[Ý™J	ÚY[‰ÊNÉ
	ÈÝ[ÉÊK^ÛÛ[SM
	ÒS•TPÕPT‰Ë	ÒS•TPÕ	Ë	ÒS•TQÒT‰Ë	ÑUñ,qg±,IÊNß_\™]\›ˆŽßNÂ˜ÛÛœÝ˜]Ð™Y›Ü™LMÌY˜]ÎÙ˜]ÏY[˜Ý[ÛŠ‹‹˜J^ØÛÛœÝY˜]Ð™Y›Ü™LMÌ
‹‹˜JNÚYŠ\Ý\YÚ[™[X]XÊ\™]\›ˆŽØÝœØ]™J
NØÝœØØ[JØÙ[™V›ÛÛJ
KØÙ[™V›ÛÛJ
JNØÝ˜[œÛ]JXØ[KžXØ[KžJNÚYŠ›Û™OOOTÕÔ–LMÌ
^ØÛÛœÝÏ]\™Ù]ÌMÌ

NÙ›ÜŠÛÛœÝÙˆÊ^ØÝœÝ›ÚÙTÝ[OIÈØNYXÍŽ	ÎØÝ›[™UÚYLÎØÝœÝ›ÚÙT™XÝ
žLKžKLÌLÌ
NÝ
	ø¥áˆ	ÊÜ›X™[žžKMMKL‹	ÈØÍÙ™ŽXÉÊNß]
M
	ÔÐSTˆÈ‘PS•QTˆÓÓˆSˆQ‰Ë	ÑVUÈ‘TÕSQHÒUSˆQ‰Ë	ÔÐRTˆÈ‘UÓPTˆÓÓHSˆQ‰Ë	ðáÒRÈÈSˆQˆ1,HUSHU	ÊKMÌML	ÈØÙ™™‰ÊNØÛÛœÝ\™Ù]\ÖÌ_[™[ZY\Ë™š[™
OO™Kœ]Y\ÝMÌ	‰™K˜[]™JNÚYŠ\™Ù]
^ØÛÛœÝOSX]˜][ŒŠ\™Ù]žK\^Y\‹žK\™Ù]ž\^Y\‹ž
NÝ
	ø¥á‰Ë^Y\‹ž
ÓX]˜ÛÜÊJJŽL^Y\‹žJÓX]œÚ[ŠJJMKLÌŒ	ÈØ™™™Í‰ÊNß_ZYŠ›Û™OOOS’QÒMMJY›ÜŠÛÛœÝHÙˆ[™[ZY\Ë™š[\ŠOO™Kœ]Y\ÝMMI‰™K˜[]™I‰™KÚ[™Œ
J^ØÝœÝ›ÚÙTÝ[OIÈÙ™˜M	ÎØÝ˜™YÚ[”]

NØÝ™[\ÙJK˜Z[VMÌK˜Z[VLMÌKÌ‹X]”JŒŠNØÝœÝ›ÚÙJ
NßXÝœ™\ÝÜ™J
NÜ™]\›ˆŽßNÂ˜ÛÛœÝ[š]™Y›Ü™LMÌZ[š]›ÙÜ™\ÜÎÚ[š]›ÙÜ™\ÜÏY[˜Ý[ÛŠ‹‹˜J^ØÛÛœÝZ[š]™Y›Ü™LMÌ
‹‹˜JNÜÝÜžLMÌ

NÚYŠ›Û™OOOTÕÔ–LMÌ
^ÜÙYYMÌ

NØÚ]P›Ý[™ÌŒJ
Nß\™]\›ˆŽßNÂ˜ÛÛœÝY™X]™Y›Ü™LMÌYY™X]ÙY™X]Y[˜Ý[ÛŠ‹‹˜J^ÚYŠ›Û™HOOTÕÔ–LMÌ\ÛÛÌMN

J\™]\›ˆY™X]™Y›Ü™LMÌ
‹‹˜JNØÛX\”\œÛÛ˜[LLŠ
NÜ^Y\‹š[X^

NÜ^Y\‹š[MÜ^Y\‹žLŒÌÜ^Y\‹žONLÜØ]™J
NÜ™]\›ˆYNßNÂ›Z\ÜÚ[ÛœÌMŒKœ\Ú
ÚY‰Ý[Qœ\ŒMÌ	Ë˜[YN–ÉÕ[ˆQˆ0­È[™YÜ™\ÛË\H‰Ë	Õ[ˆQˆ0­ÈH™]\›‹\‰Ë	Õ[ˆQˆ0­ÈÈ™]Ü››Ë\H‰Ë	Õ[ˆQˆ0­È0í›°ï1gË°í›0ïH‰×K›Û™N“’QÒMMK•SŒMNžN•SŒMNžK]™[Ž˜[™ÙN‰Î
ÉËœšYYŽ–ÉÔ\Hˆ[™\[™Y[H\ÙHš]™[ˆZ[˜K˜]™HHÛÛX[™[NˆLŒÈpì[Ëˆ™\Èš]™[\È[˜H™^ˆÜˆ˜^˜KˆÚ[™[pè]XØHXœ™Kˆ]Nˆ›ÜÜ]YHHH[˜H8¡¤ˆ\™XÚH8¡¤ˆ[ˆQˆ[È[[™›Ü›X[K‰Ë	Ò[™\[™[\ˆœ›ÛH]™[ˆZ[™KÚ\[™ÛÛ[X[™\ŽˆLÈ[XYÙKˆ™YH]™[ÈÛ˜ÙH\ˆ˜XÙKˆœ™YHÚ[™[X]XËˆ›Ý]Nˆ[ÛÛˆ›Ü™\Ý8¡¤ˆšYÚ8¡¤ˆ[ˆQˆ™\ÚYHH[™›Ü›X[‰Ë	Ô\Hˆ[™\[™[H›È°ë]™[ˆZ[˜K˜]™HHÛÛX[™[NˆLŒÈ[›Ëˆ°êœÈ°ë]™Z\È[XH™^ˆÜˆ˜péØKˆÚ[™[pè]XØH]œ™Kˆ›ÝNˆ›Ü™\ÝHHXH8¡¤ˆ\™Z]H8¡¤ˆ[ˆQˆ[È[È[™›Ü›X[K‰Ë	ÎˆÙ]š^YY[ˆ˜q'ñ,[\ñ,^ˆ°í›0ïH‹ˆXY[‹Ù[ZH™HÛÛ]][ŽˆLŒØ[ˆÍ\Ø\‹ˆ\šÈ˜qgñ,[˜Hš\ˆÙ^ˆ0ï0éÈÙ]š^YKˆÚ[™[X]ZÈÙ\˜™\Ýˆ[Ûˆ^HÜ›X[±,H8¡¤ˆØq'È8¡¤ˆ]Zš\ˆX[±,[™ZÚH[ˆQ‹‰×_JNÂ˜ÛÛœÝÝ[LMÌYØÝ[Y[˜Ü™X]Q[[Y[
	ÜÝ[IÊNÜÝ[LMÌ^ÛÛ[IË™š[KYœ˜[YLMÌÜÜÚ][ÛŽœ™[]]™NÛÝ™\™›ÝÎšY[ŽØ\ÜXÝ\˜][ÎŒËÌŽÛX^ZZYÚšØ˜XÚÙÜ›Ý[™ˆÌŒLLXßK™š[KYœ˜[YLMÌØ[˜\ÞÝÚYŒL	NÚZYÚŒL	NÚ[XYÙK\™[™\š[™Îœ^[]YØ[š[X][ÛŽ™š[T[ÙLMÌ\ÈX\ÙKZ[‹[Ý][™š[š]H[\›˜]_PÙ^Yœ˜[Y\Èš[T[ÙLMÌÙœ›Û^Ý˜[œÙ›Ü›NœØØ[JJ_]ÞÝ˜[œÙ›Ü›NœØØ[JKŒÍJ__PYYXJ™Y™\œË\™YXÙY[[Ý[ÛŽœ™YXÙJ^Ë™š[KYœ˜[YLMÌØ[˜\ÞØ[š[X][ÛŽ››Û™__IÎÙØÝ[Y[šXY˜\[™Ú[
Ý[LMÌ
NÂ˜ÛÛœÝ™]ÜÐ™Y›Ü™LMÌ]\]SÙÌŒÎÝ\]SÙÌŒÏY[˜Ý[ÛŠ‹‹˜J^Û™]ÜÐ™Y›Ü™LMÌ
‹‹˜JNÉ
	ÈÙX[ÙÙ^YXœ›ÝÉÊK^ÛÛ[IÓÓS’P“V–ˆÔ’QÒSS0­ÈK‰ÎØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	Ü	ÊNÜœÙ]]šX]J	Ù]K[›ËZLN‰Ë	ÉÊNÜ^ÛÛ[SM
	ÐÝX]›Èœ˜^›ÜÈ[œÙXÝÚYH\›X[™XÙHÛÛ›ØÚYÈ˜\ÈYZ›Ü˜\ˆH\ÚpìÛ‹ˆ[›ØÚ]ÜÈpè\È[ÜÈHÛÛˆ]š\ÛÈ[\ÈHY\š\œÙKˆ[ˆQŽˆ\Hˆ\ÙHš]™[ÙZ\È\ØÙ[˜\È^[\\ÜÛšX›\ÈHÝX[]ZY\ˆš]™[H[™[ZYÛÜÈHLŒÈpì[Ë‰Ë	Ñ›Ý\ˆÝ[šÙ›H™[XZ[œÈÛ›ÝÛˆY\ˆ\Ú[Ûˆ\Ü˜Y\ËˆÛÝÙ\ˆ[›ØÚ]\ÈØ\›ˆ™Y›Ü™H]XÚ[™Ëˆ[ˆQŽˆ\ˆ]]™[Ú^^[X\ØÙ[™\È]˜Z[X›H][žH]™[[™[™[ZY\ÈÚ]LÈ[XYÙK‰Ë	Ñ›Ý\ˆÝ[šÙ›HÛÛ[XHÛÛšXÚYÈ\0ìÜÈY[Ü˜\ˆH\ðèÛËˆ[›ØÚ]\ÈXZ\È[ÜÈ]š\Ø[H[\ÈHY\š\‹ˆ[ˆQŽˆ\Hˆ›È°ë]™[ÙZ\ÈÙ[˜\È^[\[H]X[]Y\ˆ°ë]™[H[š[ZYÛÜÈÛÛHLŒÈ[›Ë‰Ë	Ñ›Ý\ˆÝ[šÙ›H°ïž[ÛˆpïÜÙ[Y\Ú[™[ˆÛÛœ˜HØ^q,]1,HØ[1,\‹ˆX]˜qgÛ^X[ˆ[›ØÚ][\ˆ][›XY[ˆ0í›˜ÙH^X\±,\‹ˆ[ˆQŽˆ°í›0ïHˆÙ]š^YNÈ\ˆÙ]š^YYH[1,HZÜÙ[ØZ™KLŒØ[ˆÍ\Ø\›1,H0ï1gÛX[›\‹‰ÊNÉ
	ÈÙX[ÙØ›ÙIÊKœ™\[™

NßNÂœ™XYSÙÌŒÏY[˜Ý[ÛŠ
^ÚYŠÙÑš\œÝŒß\™XYJ\™]\›ŽÛÙÑš\œÝŒÏ]YNÚYŠØØ[ÝÜ˜YÙK™Ù]][J	ÛÛ[šK\ÙY[‹]\]IÊHOOIÌK‰Ê^Ý\]SÙÌŒÊ
NÛØØ[ÝÜ˜YÙKœÙ]][J	ÛÛ[šK\ÙY[‹]\]IË	ÌK‰ÊNß_NÂ‹ËÈÜšYÚ[˜[KÈÌMÌNˆ[ÛšÙ^HLŒ8¡¤ŒML[™ÛX\ˆÚY]Ø[ÈXÙ[Y[‚˜ÛÛœÝY™Y›Ü™LMÌOZYÚYY[˜Ý[ÛŠ‹‹˜J^ØÛÛœÝZY™Y›Ü™LMÌJ‹‹˜JNÚYŠÝ\Y	‰ž›Û™OOOPSVLMN	‰œ^Y\‹›]™[LML
I
	ÈÜ]Y\ÝÝX‰ÊK^ÛÛ[SM
	Ó’U‘SpàVSSÌML0­ÈÒSˆVT’QSÒPIË	ÓPVU‘SML0­È“ÈVT’QSÑIË	Ó°ãU‘SpàVSSÌML0­ÈÑSHVT’pâ“ÒPIË	ÐVSq,ÑU±,QLML0­ÈS‘Vq,HSÒÉÊNÜ™]\›ˆŽßNÂ˜ÛÛœÝ™]ÜÐ™Y›Ü™LMÌO]\]SÙÌŒÎÝ\]SÙÌŒÏY[˜Ý[ÛŠ‹‹˜J^Û™]ÜÐ™Y›Ü™LMÌJ‹‹˜JNÉ
	ÈÙX[ÙÙ^YXœ›ÝÉÊK^ÛÛ[IÓÓS’P“V–ˆÔ’QÒSS0­ÈKÉÎØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	Ü	ÊNÜœÙ]]šX]J	Ù]K[›ËZLN‰Ë	ÉÊNÜ^ÛÛ[SM
	Ñ[Y[ˆ[ÛšÙ^Nˆ™\È[™YØ\ÈÜˆš]™[\ÙLLŒ\ÝLMLˆ[[Ø[ž˜\ŒMLHZ\ÚpìÛˆYYH™\]\œÙHÚ[ˆ^\šY[˜ÚXKˆ[ÛšÙ^H\Ý0èHZÜ˜H[ˆHXÙ\˜H\ÜZ˜YKZ›ÜÈHH\ØØ[\˜HH\ÈØZ˜\Ë‰Ë	Ñ[Y[ˆ[ÛšÙ^Nˆ™YH\›‹Z[œÈ\ˆ]™[œ›ÛLLŒÌMLˆ]MLHZ\ÜÚ[Ûˆ™[XZ[œÈ™\X]X›HÚ]Ý]ˆ[ÛšÙ^H›ÝÈÝ[™ÈÛˆHÛX\ˆÚY]Ø[Ë]Ø^Hœ›ÛHHÝZ\œÈ[™Ü˜]\Ë‰Ë	Ñ[Y[ˆ[ÛšÙ^Nˆ°êœÈ[™YØ\ÈÜˆ°ë]™[LLŒ]0êLMLˆ›ÌMLHZ\ÜðèÛÈÙHÙ\ˆ™\]YHÙ[HVˆ[ÛšÙ^HYÛÜ˜HšXØH˜HØ[0éØYH]œ™KÛ™ÙHH\ØØYHH\ÈØZ^\Ë‰Ë	Ñ[Y[ˆ[ÛšÙ^NŒLŒ8 &Y[ŒML8 &^YHÙ]š^YH˜qgñ,[˜H0ï0éÈ\Û[KŒML8 &YHðíœ™]ˆ[™^Z[\Ú^ˆZÜ˜\›[˜Xš[\‹ˆ[ÛšÙ^H\1,ZÈY\™]™[ˆ™HØ[™1,ZÛ\™[ˆ^˜ZÈpéñ,ZÈØ[1,\±,[YK‰ÊNÉ
	ÈÙX[ÙØ›ÙIÊKœ™\[™

NßNÂœ™XYSÙÌŒÏY[˜Ý[ÛŠ
^ÚYŠÙÑš\œÝŒß\™XYJ\™]\›ŽÛÙÑš\œÝŒÏ]YNÚYŠØØ[ÝÜ˜YÙK™Ù]][J	ÛÛ[šK\ÙY[‹]\]IÊHOOIÌKÉÊ^Ý\]SÙÌŒÊ
NÛØØ[ÝÜ˜YÙKœÙ]][J	ÛÛ[šK\ÙY[‹]\]IË	ÌKÉÊNß_NÂšYŠØØ][Û‹œÙX\˜Úš[˜ÛY\Ê	ÜXOLIÊJ]Ú[™ÝË—×ÝŒMÌ^Ù]˜[œÏO™]˜[
Ê_NÂ‚‹ËÈÜšYÚ[˜[KŽˆØZ^X[ˆY\›Y™KØ[[™\ˆ[™ØZH˜Z[š[™Ëˆ\›X[™[Ø˜\ÙHÝÙ\ˆ™]™\ˆ[˜ÛY\ÈØZ[ÚÙ[‹‚˜ÛÛœÝÕT—Ö“Ó‘TÌMÌVÔ‘QÒSÓ”Ë›[™Ý‘QÒSÓ”Ë›[™Ý
ÌK‘QÒSÓ”Ë›[™Ý
Ì‹‘QÒSÓ”Ë›[™Ý
Ì×NÂ˜ÛÛœÝÕT—ÓSQTÌMÌVÖÉÔ[XÚ[ÈH[›XIË	ÖY[[XH[XÙIË	Ô[0èXÚ[ÈH[›XIË	ÖY[[XHØ\˜^q,I×KÉÓÙšXÚ[˜HH[›XIË	ÖY[[XHÙ™šXÙIË	Ñ\ØÜš]0ìÜš[ÈH[›XIË	ÖY[[XHÙš\ÚI×KÉÐØ[Z[›ÈHHÙ\œY[IË	ÔÛ˜ZÙHØ^IË	ÐØ[Z[šÈHÙ\œ[IË	Öq,[[ˆ[ÛI×KÉÔ[™]HHØZ[Ë\Ø[XIË	ÒÚ[™ÈØZH[™]	Ë	Ô[™]HÈÙ[šÜˆØZ[ÉË	ÒÜ˜[ØZHÙ^™YÙ[šI×WNÂ™›ÜŠ]OLÚOÚJÊÊT‘QÒSÓ”Ëœ\Ú
Ë‹‹˜ÛX[ÛÛ™J‘QÒSÓ”ÖÔÐRWÖ“Ó‘TÌMÖÌWJKY‰ÛÝ\ŒMÌ‹IÊÚK˜[YN“ÕT—ÓSQTÌMÌ–ÚWVÌKÝ\ŒMÌŽYKÚYšOOOLÌMŒMŒZYÚŒLÜ]ÛœÎ–×_JNÂ˜ÛÛœÝÝ\’\™LMÌJ
OOœØZLMÊ
I‰“ÕT—Ö“Ó‘TÌMÌ‹š[˜ÛY\Ê›Û™JKÝ\“X\MÌJ
OO“ÕT—Ö“Ó‘TÌMÌ‹š[™^ÙŠ›Û™JNÂ›]Ý\”[ŒMÌ^Ü[Ž™˜[ÙK›N™˜[ÙKØZNŒÝ˜Z[ŽŒ™\ÝŒÙ[šÚN›[›ÛXŽ›[ÛÛÛŒX˜›\ÎžÞŒLLŒNÍLŒKØ]™NŒ˜[ŒÚ[™[XN‹LKÚ[™[XUÚÙ[ŽŒNÂ™[˜Ý[ÛˆÝ\”Ý]LMÌŠ\^Y\Š^ØÛÛœÝ\ØZTÝ]LMÊ
KÏ[‹›Ý\ŒMÌŸßK[OJ‹Z[‹X^
OO“[X™\‹š\Ñš[š]JŠOØÛ[\
‹Z[‹X^
N™ÓØš™XÝ˜\ÜÚYÛŠËÜÙXÛÛ™Î›[JËœÙXÛÛ™ËŒ
KXYˆH[Ë™XYXÙN“X]™›ÛÜŠ[JËœXÙKÊJK˜Y]Y\ŽˆH[Ëœ˜Y]Y\‹[™[™ÎˆH[Ëœ[™[™ËÝYÙN“X]™›ÛÜŠ[JËœÝYÙK
JKÚ\ÙN›[JË˜Ú\ÙKL
KØ]Ú[YN›[JË˜Ø]Ú[YKKŒŠKX\Ý\žN›[JË›X\Ý\žKN
KÙ[šÚNˆH[Ë™Ù[šÚK\œš]˜[ˆH[Ë˜\œš]˜[\œš]˜[YX\Ž“X]™›ÛÜŠ[JË˜\œš]˜[YX\‹L
JK™]\›“X\“X]™›ÛÜŠ[JËœ™]\›“X\
JKX]Î“X]™›ÛÜŠ[JË™X]ËL
J_JNÛ‹›Ý\ŒMÌ[ÎÜ™]\›ˆÎßB™[˜Ý[ÛˆØZVYX\ŒMÌŠ
^Ü™]\›ˆÍŒJÓX]™›ÛÜŠÝ\”Ý]LMÌŠ
KœÙXÛÛ™ËÍŒ
NßB™[˜Ý[ÛˆØZS[X™\ŒMÌŠŠ^ÚYŠS[X™\‹š\Ñš[š]JŠJ\™]\›ˆ	Ì	ÎÚYŠL
\™]\›ˆX]™›ÛÜŠŠKÓØØ[TÝš[™Ê
NÚYŠYNJ\™]\›ˆ
‹ÌYMŠKÑš^Y
ŠJÉÈIÎÚYŠYLLŠ\™]\›ˆ
‹ÌYNJKÑš^Y
ŠJÉÈ‰ÎÜ™]\›ˆ‹Ñ^Û™[X[
ŠNßB™[˜Ý[ÛˆØZSX^MÌŠ
^ØÛÛœÝÏ[Ý\”Ý]LMÌŠ
NÜ™]\›ˆËœÝYÙOÌ›Ë›X\Ý\žOLMÌLÌŒ›Ë›X\Ý\žONLÌL›Ë›X\Ý\žOLÌÍŒŽßB™[˜Ý[ÛˆY™™XÝ]™TÝÙ\ŒMÌŠ
^Ü™]\›ˆØZTÝ]LMÊ
KœÝÙ\Š“X]›X^
KÝ\”[ŒMÌ‹šØZJNßB™[˜Ý[ÛˆØZTÙ]MÌŠ][
^ÚYŠ\ØZLMÊ
_\Ý\YÝ\”[ŒMÌ‹™Ù[šÚ_S[X™\‹š\Ò[YÙ\Š][
_][][šØZSX^MÌŠ
_Ý\”[ŒMÌ‹œ™\ÝŒØZT[ŒMËœÜ\Š\™]\›ˆ˜[ÙNÚYŠ][	‰ŠVÌ‹LŒKš[˜ÛY\Ê][
_ØZTÝ]LMÊ
KšÚOMJJ\™]\›ˆ˜[ÙNÚYŠ][OO[Ý\”[ŒMÌ‹šØZJ^ØÛÜÙQX[ÙÊ
NÜ™]\›ˆYNßZYŠ][	‰›Ý\”[ŒMÌ‹šØZJ^ÛÝ\”[ŒMÌ‹šØZOLÛÝ\”[ŒMÌ‹œ™\ÝNØÛÜÙQX[ÙÊ
NÜ™]\›ˆ˜[ÙNß[Ý\”[ŒMÌ‹šØZO[][ÚYŠ[][
[Ý\”[ŒMÌ‹œ™\ÝNÛÝ\”[ŒMÌ‹œÝ˜Z[LØÛÜÙQX[ÙÊ
NÚY

NÜ™]\›ˆYNßB™[˜Ý[ÛˆØZTÜYYMÌŠ
^Ü™]\›ˆØZT[ŒMË˜Ú\™Ú[™ÏÍÌ›Ý\”[ŒMÌ‹™›OÍ›Ý\”[ŒMÌ‹œ[ŸÙ^\Ë”ÚYÌÌŒŒŒßB˜ÛÛœÝ[XYÙP™Y›Ü™LMÌ\ØZQ[XYÙLMÎÜØZQ[XYÙLMÏY[˜Ý[ÛŠ˜\ÙJ^Ü™]\›ˆ[XYÙP™Y›Ü™LMÌŠ˜\ÙJJ“X]›X^
KÝ\”[ŒMÌ‹šØZJNßNÂ™[˜Ý[ÛˆÝ\‘[\ŒMÌŠ[™^Ø]™O]YJ^ÚYŠ\ØZLMÊ
_S[X™\‹š\Ò[YÙ\Š[™^
_[™^[™^Œß[Ý\”Ý]LMÌŠ
K™XY
\™]\›ˆ˜[ÙNØÛÛœÝÏ[Ý\”Ý]LMÌŠ
NÚYŠ[™^OOLÉ‰›ËœÝYÙOJ\™]\›ˆ˜[ÙNÞ›Û™OSÕT—Ö“Ó‘TÌMÌ–Ú[™^NÛËœXÙOZ[™^ÜØZPÛX\ŒMÊ
NÜ˜Y]ŒMŽ[[Ü˜Y]”ÝÜžLMŽKLNÛÝ\”[ŒMÌ‹™Ù[šÚO[Ý\”[ŒMÌ‹˜›ÛX[[ÛÝ\”[ŒMÌ‹™›OY˜[ÙNÛÝ\”[ŒMÌ‹šØZOLÛÝ\”[ŒMÌ‹˜X˜›\Ï^ÞŒLLŒNÍLŒNÜ^Y\‹žZ[™^OOLÌŒÌš[™^OOLÏÌÌLŽÜ^Y\‹žOZ[™^OOLÜÛ˜ZÙVLMÌŠŒÌ
NŽLÜ^Y\‹š\ØZRMÊ
NÜØZTÝ]LMÊ
KšÚO\ØZRÚSX^MÊ
NØØ[KžXØ[KžOLÞ›Û™TÝ]\ÖÜ™YÚ[ÛŠ
KšYOV×NØÚ]š[Ý]\ÖÜ™YÚ[ÛŠ
KšYOV×NØÛÜÙQX[ÙÊ
NÚY

NÚYŠØ]™J\\œÚ\ÝØ[YJ
NÜ™]\›ˆYNßB™[˜Ý[ÛˆØZQX]MÌŠÝÜžOY˜[ÙJ^ÚYŠ\ØZLMÊ
J\™]\›ˆ˜[ÙNØÛÛœÝÏ[Ý\”Ý]LMÌŠ
NÚYŠË™XY
\™]\›ˆ˜[ÙNÛËœ™]\›“X\TÐRWÖ“Ó‘TÌMËš[˜ÛY\Ê›Û™JOÜØZSX\MÊ
NŒÛË™XY]YNÛË™X]ÊÊÎÛËœ[™[™Ï\ÝÜžNÚYŠÝÜžJ^ÛËœ˜Y]Y\]YNÚYŠ[Ë˜\œš]˜[YX\Š[Ë˜\œš]˜[YX\\ØZVYX\ŒMÌŠ
JÌNß\ØZTÝ]LMÊ
Kž™[šØZT™XYOY˜[ÙNÛÝ\”[ŒMÌ‹šØZOLÛÝ\”[ŒMÌ‹™›OY˜[ÙNÛÝ\‘[\ŒMÌŠ˜[ÙJNÜ\œÚ\ÝØ[YJ
NÚYŠÝÜžJ[Ý\Ú[™[XLMÌŠ
NÙ[ÙHØ\Ý
M
	Ò\ÈYØYÈ[Ý›È][™Ëˆ[˜H[[XÚ[ÈHX›HÛÛˆ[›XH\˜H™]š]š\‹‰Ë	Ö[ÝH™XXÚYÝ\ˆÛÜ›ˆ[\ˆH[XÙH[™\ÚÈY[[XHÈ™]š]™H[ÝK‰Ë	Õ›ØðêˆÚYÛÝH[ÈÝ]›È][™Ëˆ[™H›È[0èXÚ[ÈH˜[HÛÛH[›XH\˜H™]š]™\‹‰Ë	ðåZÚH0ïžXx &^XHÙ[[‹ˆØ\˜^XHÚ\š\Ø[›[›XZÈpéÚ[ˆY[[XH[HÛÛqgË‰ÊJNÜ™]\›ˆYNßB˜ÛÛœÝ]™Y›Ü™LMÌ\ØZR]\™Ù]MÎÜØZR]\™Ù]MÏY[˜Ý[ÛŠ
^ÚYŠÝ\’\™LMÌŠ
J\™]\›ˆ˜[ÙNØÛÛœÝÝ]Z]™Y›Ü™LMÌŠ
NÚYŠ˜Y]’\™LMŽ

I‰œ˜Y]”›ÙÜ™\ÜÌMŽ

K™Y™X]Y	‰ˆ[Ý\”Ý]LMÌŠ
Kœ˜Y]Y\Š\ØZQX]MÌŠYJNÜ™]\›ˆÝ]ßNÂ˜ÛÛœÝ˜]™[™Y›Ü™LMÌ\ØZU˜]™[MÎÜØZU˜]™[MÏY[˜Ý[ÛŠK[š]X[Y˜[ÙJ^ÚYŠØZLMÊ
I‰›Ý\”Ý]LMÌŠ
K™XY
\™]\›ˆ˜[ÙNÜ™]\›ˆ˜]™[™Y›Ü™LMÌŠK[š]X[
NßNÂ™[˜Ý[ÛˆÝ\”™]š]™LMÌŠ
^ÚYŠ[Ý\’\™LMÌŠ
_Ý\“X\MÌŠ
HOOL_X]š\Ý
^Y\‹žN^Y\‹žKMMÌ
OŒ
\™]\›ˆ˜[ÙNØÛÛœÝÏ[Ý\”Ý]LMÌŠ
NÛË™XYY˜[ÙNÛËœ[™[™ÏY˜[ÙNÛÝ\”[ŒMÌ‹šØZOLÛÝ\”[ŒMÌ‹™›OY˜[ÙNÜØZU˜]™[MÊËœ™]\›“X\OOMÌ›Ëœ™]\›“X\YJNÜ^Y\‹š\ØZRMÊ
NÜØZTÝ]LMÊ
KšÚO\ØZRÚSX^MÊ
NÜ\œÚ\ÝØ[YJ
NÝØ\Ý
M
	Ñ[›XHH\›Z]H™YÜ™\Ø\ˆHHY\œ˜KˆÛÛœÙ\˜\ÈH[™[˜[ZY[Ë‰Ë	ÖY[[XH]È[ÝH™]\›ˆÈX\ˆ[Ý\ˆ˜Z[š[™È\È™\Ù\™Y‰Ë	Ñ[›XH\›Z]H›Û\ˆ0è\œ˜KˆÙ]H™Z[›È›ÚHX[YË‰Ë	ÖY[[XH0ïžXx &^XH0í››Y[™H^š[ˆ™\™Kˆq'Ú][Z[ˆÛÜ[™K‰ÊJNÜ™]\›ˆYNßB™[˜Ý[ÛˆÝ\•[ÌMÌŠ
^ÚYŠ[Ý\’\™LMÌŠ
J\™]\›ˆ[\˜XÝ

NØÛÛœÝO[Ý\“X\MÌŠ
KÏ[Ý\”Ý]LMÌŠ
NÚYŠOOOL
^ÚYŠX]š\Ý
^Y\‹žN^Y\‹žKMLL
ONL
\™]\›ˆÝ\‘[\ŒMÌŠJNÚYŠ^Y\‹žŒLÌÌ
\™]\›ˆÝ\‘[\ŒMÌŠŠNÜ™]\›ˆÝ\‘ÝZYLMÌŠ
NßZYŠOOOLJ^ÚYŠX]š\Ý
^Y\‹žN^Y\‹žKMMÌ
OŒ
\™]\›ˆÝ\‘ÝZYLMÌŠ
NÜ™]\›ˆÚÝÑX[ÙÊ	ÓÕTˆÓÔ“	Ë	ÑS“PHÈQSSPIË	Ï]ˆ]K[›ËZLN‰ÊÓM
	ÐÛÛœÙ\˜\ÈHÝY\œÈ\˜H[™[˜\‹ˆ[Ø[Z[›ÈHHÙ\œY[HÛÛ™XÙHHØZ[Ë\Ø[XKˆ[Xšpê[ˆYYÈ\›Z]\H›Û™\ˆHHY\œ˜K‰Ë	Ö[ÝHÙY\[Ý\ˆ›ÙHÈ˜Z[‹ˆÛ˜ZÙHØ^HXYÈÈÚ[™ÈØZKˆHØ[ˆ[ÛÈ][ÝH™]\›ˆÈX\‰Ë	Õ›ØðêˆX[0ê[HÙ]HÛÜœÈ\˜H™Z[˜\‹ˆÈØ[Z[šÈHÙ\œ[H]˜H[ÈÙ[šÜˆØZ[Ëˆ[X°ê[HÜÜÛÈZ^0èK[È›Û\ˆ0è\œ˜K‰Ë	Ñq'Ú][HpéÚ[ˆ™Y[š[šHÛÜ^[ÜœÝ[‹ˆq,[[ˆ[ÛHÜ˜[ØZx &^YHÚY\‹ˆ0ïžXx &^XH0í››Y[™HH^š[ˆ™\™Xš[\š[K‰ÊJÉÏÜ‰ÊÓM
	ÐY\XÚpìÛˆ[YYÛÎˆ[›XH\›Z]H™]š]š\ŽÈ[ˆH\ÝÜšXHÜšYÚ[˜[ÛÚÝH\È™\ÝXÚ]YÈÛÛˆ\È\Ù™\˜\È[˜YðìÛ‹‰Ë	ÑØ[YHY\][ÛŽˆY[[XH™]š]™\È[ÝNÈ[ˆHÜšYÚ[˜[ÝÜžHÛÚÝH\È™]š]™YÚ]H˜YÛÛˆ˜[Ë‰Ë	ÐY\péðèÛÈÈ›ÙÛÎˆ[›XH™]š]™H›ØðêŽÈ˜H\Ý0ìÜšXHÜšYÚ[˜[ÛÚÝH›ÛHÛÛH\È\Ù™\˜\ÈÈ˜YðèÛË‰Ë	ÓÞ][ˆ^X\›[X\ñ,NˆY[[XHØ[›[™1,\±,\ŽÈ\ñ,[ZðèžYYHÛÚÝHZ™\ˆÜ\±,H[H\š[\‹‰ÊJÉÏÜÙ]‰ËÖÓM
	Ô‘U’U’T‰Ë	Ô‘U’U‘IË	Ô‘U’U‘T‰Ë	ÐÐS“S‰ÊKÝ\”™]š]™LMÌ—KÓM
	ÐÐSRS“ÈHHÑT”QS•IË	ÔÓRÑHÐVIË	ÐÐSRS’ÈHÑT”S•IË	ÖRSSˆSÓIÊK

OO›Ý\‘[\ŒMÌŠŠWKÓM
	ÐÑT”T‰Ë	ÐÓÔÑIË	Ñ‘PÒT‰Ë	ÒÐTU	ÊKÛÜÙQX[Ù×WJNßZYŠOOOLÉ‰“X]š\Ý
^Y\‹žMÌŒ^Y\‹žKMŒL
OŒ
\™]\›ˆØZU[ÌMÌŠ
NÜ™]\›ˆÝ\‘ÝZYLMÌŠ
NßB™[˜Ý[ÛˆÝ\‘ÝZYLMÌŠ
^ÜÚÝÑX[ÙÊ	ÓÕTˆÓÔ“	ËM
	ÕšXZ™HH[™[˜[ZY[ÉË	Ò›Ý\›™^H[™˜Z[š[™ÉË	Ò›Ü›˜YHH™Z[›ÉË	Ö[ÛÝ[ZÈ™Hq'Ú][IÊK	Ï]ˆ]K[›ËZLN‰ÊÓM
	Ô[XÚ[ÎˆY\HÙ[˜[8¡¤ˆ[›XNÈØ[YH\™XÚH8¡¤ˆØ[Z[›ÈHHÙ\œY[Kˆ[ˆ[Ø[Z[›ÈÚYÝYHHœ˜[š˜H^[\ÝH[[™]KˆÚHØY\È[ˆ\ÈX™\ËY[™\È[[šXÚ[ÎÈ[Xšpê[ˆ[›Û\‹ˆ[ˆ[[™]HXðê\˜Ø]HHØZ[Ë\Ø[XHH[ØHP“T‹‰Ë	Ô[XÙNˆÙ[\ˆÛÜˆ8¡¤ˆY[[XNÈšYÚ^]8¡¤ˆÛ˜ZÙHØ^Kˆ›ÛÝÈH›YH›ØYÈH[™]ˆ˜[[™È[ÈÛÝYÈ™\Ù]ÈH›Ý]K[˜ÛY[™È[ˆ›YÚˆÛˆH[™]\›ØXÚÚ[™ÈØZH[™™\ÜÈSË‰Ë	Ô[0èXÚ[ÎˆÜHÙ[˜[8¡¤ˆ[›XNÈØpëYH\™Z]H8¡¤ˆØ[Z[šÈHÙ\œ[KˆÚYØHH˜Z^H^[[È[™]KˆØZ\ˆ˜\È]™[œÈ™Z[šXÚXHH›ÝK[˜Û\Ú]™H›Ø[™Ëˆ\›Þ[YK\ÙHÈÙ[šÜˆØZ[ÈHÜ]YHST‹‰Ë	ÔØ\˜^NˆÜHØ\1,H8¡¤ˆY[[XNÈØq'È0éñ,Zñ,qgÈ8¡¤ˆq,[[ˆ[ÛKˆX]šH[ÛHÙ^™YÙ[™HØY\ˆ^›Kˆ[]\˜H0ï1gÛYZÈpéØ\šÙ[ˆH˜qgØH0í›™0ï°ï‹ˆÙ^™YÙ[™HÜ˜[ØZx &^YHXZÛqgÈ™HÓÓ•qgˆ0ï1'ÛY\Ú[™H˜\Ë‰ÊJÉÏÜÙ]‰ËÖÓM
	Õ“Ó‘TˆSSPÒSÉË	Ô‘UT“ˆÈSPÑIË	Õ“ÓTˆSÈS0àPÒSÉË	ÔÐTVPH0å“‰ÊK

OO›Ý\‘[\ŒMÌŠ
WKÓM
	ÐÓÓ•S•PT‰Ë	ÐÓÓ•S•QIË	ÐÓÓ•S•PT‰Ë	ÑUSIÊKÛÜÙQX[Ù×WJNßB™[˜Ý[ÛˆÛ˜ZÙVLMÌŠ
^Ü™]\›ˆLL
ÌNJ“X]œÚ[Š
LŒÌ
KÍŒŒ
JÍÍJ“X]œÚ[Š
LŒÌ
KÌÌ
NßB™[˜Ý[ÛˆÛ˜ZÙR[œÚYLMÌŠJ^Ü™]\›ˆLL	‰žLLÎL	‰“X]˜XœÊK\Û˜ZÙVLMÌŠ
JOLŽßB™[˜Ý[ÛˆÛ˜ZÙT™\Ù]MÌŠ
^Ü^Y\‹žLŒÌÜ^Y\‹žO\Û˜ZÙVLMÌŠŒÌ
NÛÝ\”[ŒMÌ‹™›OY˜[ÙNÛÝ\”[ŒMÌ‹™˜[LNÝØ\Ý
M
	ÐØpë\ÝH[ˆ\ÈX™\È0­ÈY[™HH[\^˜\‰Ë	Ö[ÝH™[[ÈHÛÝYÈ0­ÈÝ\YØZ[‰Ë	Õ›ØðêˆØZ]H˜\È]™[œÈ0­È™XÛÛYXÙIË	Ð[]\˜H0ï1gÝ0ïˆ0­È˜qgÝ[ˆ˜qgÛIÊJNÜ\œÚ\ÝØ[YJ
NßB™[˜Ý[ÛˆØZR›ÚÙLMÌŠ
^ØÛÛœÝÏ[Ý\”Ý]LMÌŠ
NÚYŠ[Ý\’\™LMÌŠ
_Ý\“X\MÌŠ
HOOLßËœÝYÙHOOL_X]š\Ý
^Y\‹žMÌŒ^Y\‹žKMŒL
OŒŒ
\™]\›ˆ˜[ÙNÛËœÝYÙOLŽÜ\œÚ\ÝØ[YJ
NÜÚÝÑX[ÙÊ	ÒÐRSËTÐSPIËM
	ð¨R˜K˜K˜HIË	ÒKKHIË	ÒKKHIË	ÒKKHIÊK	Ï]ˆ]K[›ËZLN‰ÊÓM
	ÑÛÚÝNˆ0ªð¯Ô]pêHXÙH[ˆØZ^XZš[ˆ[ˆ[˜H[˜Y\°ëXOÈ0¨P\ØØ\ˆ[ˆHÙ\ˆp®ÈØZ[Ë\Ø[XHÙH°ëYKˆZÜ˜H]˜\HHX˜›\ÎˆÛÜœ™H˜\È0ê[HX[[HHÝHYÈ\˜[H[ˆÙYÝ[™ËˆHY\\°è\ÈHHÜ˜]™YYZY[˜\ÈÈ\œÚYÝY\Ë‰Ë	ÑÛÚÝNˆ8 'ÚHYHØZ^X[ˆš\Ú]H˜ZÙ\žOÈÈ˜Z\ÙH\ÈÝÙ\ˆØYˆx 'HÚ[™ÈØZH]YÚËˆ›ÝÈØ]ÚX˜›\Îˆ[ˆY\ˆ[H[™Ý^H™\ÚYH[H›ÜˆÛ™HÙXÛÛ™ˆHÚ\ÙH[È[ÝHY\ÈÜ˜]š]K‰Ë	ÑÛÚÝNˆ0ªÔÜˆ]YHÈØZ^XZš[ˆ›ÚH0èY\šXOÈ\˜H][Y[\ˆÙ]H0èÛÈHÙ\ˆp®ÈØZ[ÈšKˆYÛÜ˜HYÝYHX˜›\ÎˆÛÜœ˜H]°è\È[HHš\]YH[ÈYÈÜˆ[HÙYÝ[™ËˆH\œÙYÝZpéðèÛÈZYHHÙHY\\ˆ0èÜ˜]šYYK‰Ë	ÑÛÚÝNˆ8 'ØZ^X[ˆ™Y[ˆ±,\±,[˜HÚ]OÈðï0éÛ0ïš\ˆZÛYZÈpéÚ[ˆx 'HÜ˜[ØZHðï\‹ˆ1gš[YHX˜›\ø &q,HXZØ[NˆqgÚ[™[ˆÛñgÝ\X[±,[™Hš\ˆØ[š^YHØ[ˆÛÝ˜[\šÙ[ˆY\ˆ0éÙZÚ[Z[™H[1,qgØXØZÜñ,[‹‰ÊJÉÏÜÙ]‰ËÖÓM
	ÐUTTˆH•P“TÉË	ÐÐUÒ•P“TÉË	ÔQÐTˆ•P“TÉË	Ð•P“Tø &RHPRÐSIÊKÛÜÙQX[Ù×WJNÜ™]\›ˆYNßB™[˜Ý[ÛˆØZUXXÚMÌŠ
^ØÛÛœÝÏ[Ý\”Ý]LMÌŠ
NÚYŠ[Ý\’\™LMÌŠ
_Ý\“X\MÌŠ
HOOLßËœÝYÙHOOLßX]š\Ý
^Y\‹žMÌŒ^Y\‹žKMŒL
OŒŒ
\™]\›ˆ˜[ÙNÛËœÝYÙOMÛË™Ù[šÚO]YNÛË›X\Ý\žOLÜØZTÝ]LMÊ
KœÝÙ\SX]›Z[ŠYLL‹ØZTÝ]LMÊ
KœÝÙ\ŠÌL
NÜ\œÚ\ÝØ[YJ
NÚØZU[ÌMÌŠ
NÜ™]\›ˆYNßB™[˜Ý[ÛˆØZU[ÌMÌŠ
^ØÛÛœÝÏ[Ý\”Ý]LMÌŠ
NÚYŠ[Ý\’\™LMÌŠ
_Ý\“X\MÌŠ
HOOLÊ\™]\›ˆ˜[ÙNÚYŠËœÝYÙOOOL
[ËœÝYÙOLNÛ]^]ÛœÏV×NÚYŠËœÝYÙOOOLJ^Ý^SM
	Ð[\ÈH[™[˜\K0¨Z^›YH™pë\ˆÛÛˆ[ˆÚ\ÝHIË	Ð™Y›Ü™HH˜Z[ˆ[ÝKXZÙHYH]YÚÚ]H›ÚÙHIË	Ð[\ÈÈ™Z[›Ë˜péØK[YHš\ˆÛÛH[XHXYHIË	Ñq'Ú][Y[ˆ0í›˜ÙHš\ˆ1gØZØ^[H™[šHðï0ïˆIÊNØ]ÛœËœ\Ú
ÓM
	ÐÓÓ•TˆSˆÒTÕIË	ÕSH“ÒÑIË	ÐÓÓ•TˆPQIË	ñgRÐHPT	ÊKØZR›ÚÙLMÌ—JNßY[ÙHYŠËœÝYÙOOOLŠ]^SM
	ð¨P]˜\HHX˜›\ÈHHÜ˜]™YY\ÈY^ˆ™XÙ\ÈHHHY\œ˜KˆÛÜœ™NÈHY\XÚpìÛˆ][Y[H\˜[HH\œÙXÝXÚpìÛ‹‰Ë	ÐØ]ÚX˜›\ÈHÜ˜]š]H\È[ˆ[Y\ÈX\8 &\Ëˆ[ŽÈ[Ý\ˆY\][ÛˆÜ›ÝÜÈ\š[™ÈHÚ\ÙK‰Ë	ÔYÝYHX˜›\ÈHHÜ˜]šYYH0êH^ˆ™^™\ÈHH\œ˜KˆÛÜœ˜NÈÝXHY\péðèÛÈÜ™\ØÙH˜H\œÙYÝZpéðèÛË‰Ë	ÐX˜›\ø &q,HXZØ[HHY\ˆ0éÙZÚ[ZH0ïžXx &[±,[ˆÛˆØ]1,KˆÛñgÎÈÛÝ˜[\šÙ[ˆ^][][ˆ\\‹‰ÊNÙ[ÙHYŠËœÝYÙOOOLÊ^Ý^SM
	ð¨SÈ]˜\\ÝHHXHYY\È\™[™\ˆØZ[ÚÙ[ˆHÙ[šÚY[XKˆ[[™[˜[ZY[È[šXÚX[[Xšpê[ˆHH
ÌKŒÝÙ\ˆ]™[˜\ÙK[˜HÛÛH™^‹‰Ë	Ö[ÝHØ]YÚ[HH[ÝHØ[ˆ›ÝÈX\›ˆØZ[ÚÙ[ˆ[™Ü\š]›ÛX‹ˆ[š]X[˜Z[š[™È[ÛÈÜ˜[È
ÌK˜\ÙHÝÙ\ˆ]™[Û˜ÙK‰Ë	Õ›ØðêˆYÛÝHHYÛÜ˜HÙH\™[™\ˆØZ[ÚÙ[ˆHÙ[šÚY[XKˆÈ™Z[›È[šXÚX[[X°ê[H0èH
ÌKŒÝÙ\ˆ]™[˜\ÙH[XH™^‹‰Ë	ÖXZØ[Y1,[ˆHØZ[ÚÙ[ˆ™HZ›ÛX˜\ñ,H0í±'Ü™[™Xš[\œÚ[‹ˆ1,Èq'Ú][Hš\ˆÙ^ˆ
ÌKŒ[Y[ÝÙ\ˆ]™[™\š\‹‰ÊNØ]ÛœËœ\Ú
ÓM
	ÐT‘S‘Tˆ0âPÓ’PÐTÉË	ÓPT“ˆPÒ’TUQTÉË	ÐT‘S‘Tˆ0âPÓ’PÐTÉË	ÕRÓ±,ÓT±,0å±'”‘S‰ÊKØZUXXÚMÌ—JNßY[Ù^Ý^SM
	ÑÛZ[˜HØZ[ÚÙ[ˆZY[˜\ÈÈ\Ø\ÈXÝ]˜[Y[KˆHXY\Ý°ëXHXœ™Hˆ[\™[™\‹HÜÌÌËLHÜÎLÈHŒHÜÌMÌLÈH°èXÝXØHXÝ]˜Kˆ[Ý™\KØ\™Ø\ˆÚHÈÛÛX\ˆÝY[NÈ]YY\œÙH]ZY]È›ËˆÜÈ][\XØYÜ™\È[ÜÈYÛÝ[ˆ[ÚHH^YÙ[ˆ\ØØ[œÛËˆHÙ[šÚY[XH™pî›™H[™\™ðëXHÛÛˆÜÈœ˜^›ÜÈ\œšX˜HHÙH[ž˜HÜˆÙ\\˜YË‰Ë	ÓX\Ý\ˆØZ[ÚÙ[ˆ›ÝYÚXÝ]™H\ÙKˆX\Ý\žH[›ØÚÜÈˆÛˆX\›š[™Ë]ÌËL]LÈ[™Œ]MÌLÈÙˆXÝ]™H˜XÝXÙKˆ[Ýš[™ËÚ\™Ú[™ÈÚHÜˆ]XÚÚ[™ÈÛÝ[ÎÈY[™ÈÙ\È›ÝˆYÚ][\Y\œÈ˜Z[ˆÚH[™™\]Z\™H™\ÝˆÜ\š]›ÛXˆØ]\œÈ[™\™ÞHÚ]˜Z\ÙY\›\Ë[ˆ\È›ÝÛˆÙ\\˜][K‰Ë	ÑÛZ[™HØZ[ÚÙ[ˆ\Ø[™Ë[È]]˜[Y[KˆHXY\ÝšXHXœ™Hˆ[È\™[™\‹[LÌËL[NLÈHŒ[LMÌLÈH°è]XØH]]˜Kˆ[Ý™\‹Ø\œ™YØ\ˆÚHÝH]XØ\ˆÛÛNÈšXØ\ˆ\˜YÈ°èÛËˆ][\XØYÜ™\È[ÜÈ™[˜[HÚHH^YÙ[H\ØØ[œÛËˆÙ[šÚY[XH™pî›™H[™\™ÚXHHœ˜péÛÜÈ\™ÝZYÜÈH0êH[°éØYHÙ\\˜Y[Y[K‰Ë	ÒØZ[ÚÙ[¸ &ZHZÝYˆÝ[[˜\˜ZÈÙ[qgÝ\‹ˆZÝYˆ0éØ[1,qgÛXH[Hˆ0í±'Ü™[š[˜ÙKÌÛ‹LLÛ‹ŒMÌLÛˆÛÛœ˜Hpéñ,[1,\‹ˆ\™ZÙ]ÚHÛ\›XH™^XHØ[1,\±,HØ^q,[1,\ŽÈ™ZÛ[YZÈØ^q,[X^‹ˆpïÜÙZÈ0éØ\œ[›\ˆÚH0ïÙ]\ˆ™H[›[›YHÙ\™ZÝ\š\‹ˆZ›ÛX˜\ñ,HÛÛ\ˆ]ZØ\±,YH[™\ššHÜ\‹ÛÛœ˜H^\±,XØH]1,[1,\‹‰ÊNØ]ÛœËœ\Ú
ÉÒÐRSÒÑS‰ËØZSY[LMÌ—JNß]^
ÏIÏœœ‰ÊÓM
	ÑÜÈØZ^XZš[œÈÙH\›Þ[X[‹ˆH]š\Ø\°êHÝX[™ÈYÝYH[pì[È™]š\ÝÎÈ™YÜ™\ØHHHY\œ˜HHXœ™HÐQÐHÐRVPSˆ[ˆ[Y[°î‹‰Ë	ÕÛÈØZ^X[œÈ\™H\›ØXÚ[™ËˆHÚ[Ø\›ˆ[ÝH[ˆH^XÝYYX\ŽÈ™]\›ˆÈX\[™Ü[ˆÐRVPSˆÐQÐH[ˆHY[K‰Ë	ÑÚ\ÈØZ^XZš[œÈÙH\›Þ[X[Kˆ]š\Ø\™ZH›È[›È™]š\ÝÎÈ›ÛH0è\œ˜HHXœ˜HÐQÐHÐRVPSˆ›ÈY[K‰Ë	ñ,ÚHØZ^X[ˆXZÛqgñ,^[Ü‹ˆ™ZÛ[™[ˆq,[HX™\ˆ™\™XÙq'Ú[NÈ0ïžXx &^XH0í›ˆ™HY[°ï[ˆÐRVPSˆTÕS’HpéË‰ÊNØ]ÛœËœ\Ú
ÓM
	ÐÓÓ•S•PT‰Ë	ÐÓÓ•S•QIË	ÐÓÓ•S•PT‰Ë	ÑUSIÊKÛÜÙQX[Ù×JNÜ\œÚ\ÝØ[YJ
NÜÚÝÑX[ÙÊ	Ó“Ô•ÐRIË	ÒÐRSËTÐSPIË	Ï]ˆ]K[›ËZLN‰ÊÝ^
ÉÏÜÙ]‰Ë]ÛœÊNÜ™]\›ˆYNßB™[˜Ý[ÛˆØZSY[LMÌŠ
^ØÛÛœÝÏ[Ý\”Ý]LMÌŠ
KX^ZØZSX^MÌŠ
K[Ý\”[ŒMÌŽÚYŠ\ØZLMÊ
J\™]\›ŽØÛÛœÝ]ÛœÏVÖÓM
	ÑTÐPÕUT‰Ë	ÕT“ˆÑ‘‰Ë	ÑTÐUUT‰Ë	ÒÐTU	ÊK

OOšØZTÙ]MÌŠ
WWNÙ›ÜŠÛÛœÝHÙˆÌ‹LŒK™š[\ŠO[X^
JX]ÛœËœ\Ú
ÉÒÐRSÒÑSˆ	ÊÚK

OOšØZTÙ]MÌŠJWJNØ]ÛœËœ\Ú
ÓM
	Õ“Ó‘T‰Ë	ÐPÒÉË	Õ“ÓT‰Ë	ÑÑT±,	ÊK

OOœØZSY[LMÊ	ÝXÚ	ÊWJNÜÚÝÑX[ÙÊ	ÒÐRSÒÑS‰ËM
	ÓXY\Ý°ëXIË	ÓX\Ý\žIË	ÓXY\ÝšXIË	Õ\Ý[1,ZÉÊJÉÈ	ÊÓX]™›ÛÜŠË›X\Ý\žJJÉÈÈMÌLÉË	Ï]ˆ]K[›ËZLN‰ÊÓM
	Ð˜\ÙIË	Ð˜\ÙIË	Ð˜\ÙIË	Õ[Y[	ÊJÉÈ	ÊÜØZS[X™\ŒMÌŠØZTÝ]LMÊ
KœÝÙ\ŠJÉÈ8¡¤ˆ	ÊÓM
	ÑY™XÝ]›ÉË	ÑY™™XÝ]™IË	ÑY™]]›ÉË	Ñ]Ú[‰ÊJÉÈ	ÊÜØZS[X™\ŒMÌŠY™™XÝ]™TÝÙ\ŒMÌŠ
JJÉÏÜ‰ÊÓM
	ÔÛÛÈ][\XØHpì[ÈHÝÙ\ˆ]™[Y™XÝ]›ÎÈ›ÈšYHšH™YÙ[™\˜XÚpìÛ‹ˆ[ÙÜÎˆ‹LHŒ‰Ë	ÓÛ›H][\Y\È[XYÙH[™Y™™XÝ]™HÝÙ\ˆ]™[È›ÝX[Üˆ™YÙ[™\˜][Û‹ˆ[Ù\Îˆ‹L[™Œ‰Ë	Ó][\XØH\[˜\È[›ÈHÝÙ\ˆ]™[Y™]]›ÎÈ°èÛÈšYHÝH™YÙ[™\˜péðèÛËˆ[ÙÜÎˆ‹LHŒ‰Ë	ÖX[±,^˜ØH\Ø\±,H™H]Ú[ˆÝÙ\ˆ]™[q'Ù\š[šH0éØ\œ\ŽÈØ[±,H™^XHY[š[[›Y^ZH\1,\›X^‹ˆÚ\\Žˆ‹L™HŒ‰ÊJÉÏÜ‰ÊÓM
	ÐÛÛœÝ[[ÉË	Ñ˜Z[‰Ë	ÐÛÛœÝ[[ÉË	Õ0ïÙ][IÊJÉÎˆˆ
Èˆ0åÈÒKÜÈ0­È	ÊÓM
	Ó0ë[Z]HH\ÙY\ž›ÉË	ÔÝ˜Z[ˆ[Z]	Ë	Ó[Z]HH\Ù›Ü°éÛÉË	Ö›Ü›[›XHñ,[±,\±,IÊJÉÎˆÈÈ0­È	ÊÓM
	Ñ\ØØ[œÛÉË	Ô™\Ý	Ë	Ñ\ØØ[œÛÉË	Ñ[›[›YIÊJÉÎˆÏÜ‰ÊÓM
	Ñ\ØØ[œÛÈ™\Ý[IË	Ô™\Ý™[XZ[š[™ÉË	Ñ\ØØ[œÛÈ™\Ý[IË	ÒØ[[ˆ[›[›YIÊJÉÎˆ	ÊÓX]˜ÙZ[
‹œ™\Ý
JÉÜÏÜÙ]‰Ë]ÛœÊNßB™[˜Ý[ÛˆÙ[šÚTÝ\MÌŠ
^ØÛÛœÝ[Ý\”[ŒMÌŽÚYŠ\ØZLMÊ
_\Ý\Y]\ÙYÚ[™[X]Xß[Ý\”Ý]LMÌŠ
K™Ù[šÚ_‹˜ÛÛÛŒ‹˜›ÛXŸØZT[ŒMË˜XÝ[ÛŸØZT[ŒMËœÜ\Š\™]\›ˆ˜[ÙNÚYŠ‹™Ù[šÚJ\™]\›ˆÙ[šÚU›ÝÌMÌŠ
NÚYŠØZTÝ]LMÊ
KšÚOÍJ\™]\›ˆ˜[ÙNÜØZTÝ]LMÊ
KšÚKOLÍNÜ‹šØZOLÜ‹™›OY˜[ÙNÜØZT[ŒMË˜Ú\™Ú[™ÏY˜[ÙNÜ‹™Ù[šÚO^ÝŒNÜ™]\›ˆYNßB™[˜Ý[ÛˆÙ[šÚU›ÝÌMÌŠ
^ØÛÛœÝ[Ý\”[ŒMÌ‹Ï\‹™Ù[šÚNÚYŠYßËŠ\™]\›ˆ˜[ÙNÛ]\^Y\‹™^Y\‹™˜XÙ_KO\^Y\‹™_SX]š\Ý
J_NÙÏ[ÙKÏ[Ü‹˜›ÛX^Þœ^Y\‹žNœ^Y\‹žKLMK™
ŒÍN™JŒÍŒËYÙNŒÚ\™ÙN™Ë]™˜[ÙK\œÝŒNÜ‹™Ù[šÚO[[Ü‹˜ÛÛÛLNÜØZT[ŒMË˜XÝ[Û^Ý\N‰ÙÙ[šÚLMÌ‰ËŒX^‹ŽNÜ™]\›ˆYNßB™[˜Ý[Ûˆ[Øš[]LMÌŠÚ[™
^ÚYŠ\ØZLMÊ
_\Ý\Y]\ÙYÚ[™[X]XßÝ\”[ŒMÌ‹™Ù[šÚJ\™]\›ˆ˜[ÙNÚYŠÚ[™OOIÜ[‰Ê[Ý\”[ŒMÌ‹œ[H[Ý\”[ŒMÌ‹œ[ŽÙ[ÙHYŠØZTÝ]LMÊ
KšÚOM_Ý\”[ŒMÌ‹™›J[Ý\”[ŒMÌ‹™›OH[Ý\”[ŒMÌ‹™›NÚY

NÜ™]\›ˆYNßB™[˜Ý[ÛˆÝ\•XÚÌMÌŠ
^ØÛÛœÝÏ[Ý\”Ý]LMÌŠ
K[Ý\”[ŒMÌ‹\ØZTÝ]LMÊ
NÛËœÙXÛÛ™ÊÏYÜ‹œ™\ÝSX]›X^
‹œ™\ÝY
NÜ‹˜ÛÛÛSX]›X^
‹˜ÛÛÛY
NÜ‹™˜[SX]›X^
‹™˜[Y
NÚYŠ‹šØZOšØZSX^MÌŠ
_‹šØZI‰ˆVÌ‹LŒKš[˜ÛY\Ê‹šØZJJ\‹šØZOLÚYŠ‹šØZJ^ØÛÛœÝXÝ]™O\^Y\‹›[Ýš[™ßØZT[ŒMË˜Ú\™Ú[™ßH\ØZT[ŒMË˜XÝ[ÛŽÚYŠXÝ]™J[Ë›X\Ý\žOSX]›Z[ŠMÌLË›X\Ý\žJÙ
NÛ‹šÚOSX]›X^
‹šÚKY
ŠŠËŠœ‹šØZJJNÜ‹œÝ˜Z[ŠÏY
œ‹šØZNÚYŠ‹šÚOL‹œÝ˜Z[N
^Ü‹šØZOLÜ‹œ™\ÝNÜ‹œÝ˜Z[LÝØ\Ý
M
	ÒØZ[ÚÙ[ˆYÛÝYÈ0­È\ØØ[œØHÉË	ÒØZ[ÚÙ[ˆ^]\ÝY0­È™\ÝÉË	ÒØZ[ÚÙ[ˆ\ÙÛÝYÈ0­È\ØØ[œÙHÉË	ÒØZ[ÚÙ[ˆ0ïÙ[™H0­ÈÛˆ[›[‰ÊJNß_ZYŠ‹™›J^Û‹šÚOSX]›X^
‹šÚKY
Ž
NÚYŠ‹šÚOL
\‹™›OY˜[ÙNßZYŠ‹™Ù[šÚJ^Ü‹™Ù[šÚKSX]›Z[Š‹‹™Ù[šÚK
Ù
NÚYŠ‹™Ù[šÚKMŠYÙ[šÚU›ÝÌMÌŠ
NßZYŠ‹˜›ÛXŠ^ØÛÛœÝ\‹˜›ÛXŽØ‹OYØ‹˜YÙJÏYÚYŠ‹˜\œÝŒ
X‹˜\œÝOYÙ[ÙHYŠX‹š]
^Ø‹ž
ÏX‹™
™Ø‹žJÏX‹™J™ØÛÛœÝ\™Ù]\ØZU\™Ù]MŽ

NÚYŠ[Ý\’\™LMÌŠ
I‰“X]š\Ý
‹ž]\™Ù]ž‹žKJ\™Ù]žKMJJOL
^Ø‹š]]YNØ‹˜\œÝKŽÜØZR]\™Ù]MÊ[XYÙP™Y›Ü™LMÌŠLŒ
Ø‹˜Ú\™ÙJŒJJNß_ZYŠ‹L‹š]	‰˜‹˜\œÝL
\‹˜›ÛX[[ßZYŠËœ˜Y]Y\‰‰ˆ[Ë˜\œš]˜[	‰œØZVYX\ŒMÌŠ
O[Ë˜\œš]˜[YX\Š^ÛË˜\œš]˜[]YNÜ\œÚ\ÝØ[YJ
NÝØ\Ý
M
	ÒØZ[Ë\Ø[XNˆ0¨[\ÈÙpìX[\ÈØZ^XZš[ˆÙHXÙ\˜Ø[ˆHY[™HHHY\œ˜HHXœ™HØYØHØZ^X[‹‰Ë	ÒÚ[™ÈØZNˆØZ^X[ˆÚYÛ˜[È\™H\›ØXÚ[™ÈH™]\›ˆÈX\[™Ü[ˆØZ^X[ˆØYØK‰Ë	ÔÙ[šÜˆØZ[ÎˆÚ[˜Z\ÈØZ^XZš[œÈÙH\›Þ[X[HH›ÛH0è\œ˜HHXœ˜HØYØHØZ^X[‹‰Ë	ÒÜ˜[ØZNˆØZ^X[ˆÚ[žX[\šHXZÛqgñ,^[ÜˆH0ïžXx &^XH0í›ˆ™HØZ^X[ˆ\Ý[±,HpéË‰ÊJNß_B™[˜Ý[ÛˆÝ\•\]LMÌŠ
^ÙXÛ[\
ŒJNØÛØÚÊÏYÝÝ[^TÙXÛÛ™ÍMŠÏYØÛÛœÝ[Ý\”[ŒMÌ‹\ØZTÝ]LMÊ
KÏ[Ý\”Ý]LMÌŠ
KO[Ý\“X\MÌŠ
NÙ[™[ZY\ÏV×NØÚ]^™[œÏV×NÛÙ™šXÙ\œÏV×NÜØZT[ŒMË˜ÛÛÛ\ØZT[ŒMË˜ÛÛÛ›X\
O“X]›X^
‹Y
JNÜ^Y\‹œ™YÙ[•ØZ]SX]›X^

^Y\‹œ™YÙ[•ØZ]
KY
NÛ]ž\ÝXÚËž
ÊÙ^\Ë\œ›ÝÔšYÚÙ^\Ë™ÌNŒ
KJÙ^\Ë\œ›ÝÓYÙ^\Ë˜OÌNŒ
KžO\ÝXÚËžJÊÙ^\Ë\œ›ÝÑÝÛŸÙ^\ËœÏÌNŒ
KJÙ^\Ë\œ›ÝÕ\Ù^\ËÏÌNŒ
K[SX]š\Ý
žžJNÚYŠ[ŒJ^ÝžÏ[[ŽÝžKÏ[[Žß\ØZT[ŒMË˜Ú\™Ú[™ÏHHJØZT[ŒMË˜Ú\™Ú[™ßÙ^\Ë˜ß[OOLŠNÜ^Y\‹›[Ýš[™Ï[[‹ŒL‰‰ˆ\‹™Ù[šÚNÚYŠ^Y\‹›[Ýš[™Ê^Û]ÜYY\ØZTÜYYMÌŠ
NÚYŠOOOLÉ‰›ËœÝYÙOOOLŠ^ÛË˜Ú\ÙOSX]›Z[ŠLË˜Ú\ÙJÙ
NÜÜYY
KMJËJ›Ë˜Ú\ÙKÎLßXÛÛœÝž\^Y\‹ž
Ýž
œÜYY
™žO\^Y\‹žJÝžJœÜYY
‹ÍJ™ÚYŠOOOLŠ^Ü^Y\‹ž[žÜ^Y\‹žO[žNßY[Ù^ÚYŠ[Ý\›ØÚÙYMÌŠž^Y\‹žJJ\^Y\‹ž[žÚYŠ[Ý\›ØÚÙYMÌŠ^Y\‹žžJJ\^Y\‹žO[žNß\^Y\‹™]žÜ^Y\‹™O]žNÜ^Y\‹™˜XÙO]žËLNžŒÌNœ^Y\‹™˜XÙNÜ^Y\‹Ø[Ñ\SX]˜XœÊžJO“X]˜XœÊž
OÝžOÉØ˜XÚÉÎ‰Ùœ›Û	ÎžÉÛY	Î‰ÜšYÚ	ÎÜØZT[ŒMËœ\ÙJÏY
Š‹œ[ÌMÎŒLJNßY[ÙHØZT[ŒMËœ\ÙOLÚYŠ\‹™Ù[šÚJ[‹šÚOSX]›Z[ŠØZRÚSX^MÊ
K‹šÚJÙ
ŠØZT[ŒMË˜Ú\™Ú[™ÏÌŒŒŠJNÚYŠØZT[ŒMË˜XÝ[ÛŠ^ÜØZT[ŒMË˜XÝ[Û‹
ÏYÚYŠØZT[ŒMË˜XÝ[Û‹\ØZT[ŒMË˜XÝ[Û‹›X^
\ØZT[ŒMË˜XÝ[Û[[ß\ØZT™YÙ[ŒMŽJ
NÚYŠØZT[ŒMË˜Z[š[™ÏŒ	‰ˆ\^Y\‹›[Ýš[™Ê^ÜØZT[ŒMË˜Z[š[™ËOYÜØZU˜Z[ŒMÊ
Nß[Ý\•XÚÌMÌŠ
NÚYŠOOOLŠ^ÚYŠ\Û˜ZÙR[œÚYLMÌŠ^Y\‹ž^Y\‹žJJ\Û˜ZÙT™\Ù]MÌŠ
NÙ[ÙHYŠ^Y\‹žŒLÍL
^ÛËœÝYÙOSX]›X^
KËœÝYÙJNÛÝ\‘[\ŒMÌŠÊNÜ™]\›Žß_Y[ÙHYŠOOOL
^ÚYŠ^Y\‹žŒMÌ
^ÛÝ\‘[\ŒMÌŠŠNÜ™]\›ŽßZYŠ^Y\‹žOMŒ	‰“X]˜XœÊ^Y\‹žN
OML
^ÛÝ\‘[\ŒMÌŠJNÜ™]\›Žß_Y[ÙHYŠOOOLI‰œ^Y\‹žOŽLŒ
^ÛÝ\‘[\ŒMÌŠ
NÜ™]\›ŽßY[ÙHYŠOOOLÊ^ØÛÛœÝ\‹˜X˜›\ÎØ‹
ÏYØÛÛœÝNL
ÌÎ
“X]˜ÛÜÊ‹
‹
KOMÍŒ
ÌL
“X]œÚ[Š‹
‹ŽMŠNØÛÛœÝ]X‹žO]KX‹žKSX]š\Ý
J_NØ‹ž
ÏYÛ
“X]›Z[ŠŒJ™
NØ‹žJÏYKÛ
“X]›Z[ŠŒJ™
NÚYŠËœÝYÙOOOLŠ^ÚYŠË˜Ú\ÙOLŒ	‰œ^Y\‹›[Ýš[™É‰ˆ\‹™›I‰“X]š\Ý
^Y\‹žX‹ž^Y\‹žKX‹žJOJ[Ë˜Ø]Ú[YJÏYÙ[ÙHË˜Ø]Ú[YOSX]›X^
Ë˜Ø]Ú[YKY
‹ŒÊNÚYŠË˜Ø]Ú[YOLKŒŠ^ÛËœÝYÙOLÎÛË˜Ø]Ú[YOLÜ\œÚ\ÝØ[YJ
NÝØ\Ý
M
	ð¨PX˜›\È]˜\YÈHX›HÛÛˆØZ[Ë\Ø[XK‰Ë	ÐX˜›\ÈØ]YÚH[ÈÈÚ[™ÈØZK‰Ë	ÐX˜›\ÈØ\\˜YÈH˜[HÛÛHÈÙ[šÜˆØZ[Ë‰Ë	ÐX˜›\ÈXZØ[[™1,HHÜ˜[ØZH[HÛÛqgË‰ÊJNß_ZYŠ^Y\‹žN	‰œ^Y\‹žOÍŒ
^ÛÝ\‘[\ŒMÌŠŠNÜ™]\›Žß_\‹œØ]™JÏYÚYŠ‹œØ]™OM
^Ü‹œØ]™OLÜ\œÚ\ÝØ[YJ
NßZYŠØ\Ý[YOŒ
^ÝØ\Ý[YKOYÚYŠØ\Ý[YOL
I
	ÈÝØ\Ý	ÊK˜Û\ÜÓ\Ýœ™[[Ý™J	ÜÚÝÉÊNß\ØZRYMÊ
NßB™[˜Ý[ÛˆÝ\›ØÚÙYMÌŠJ^ÚYŠL_ŒMÍ_OLOŽMJ\™]\›ˆYNØÛÛœÝO[Ý\“X\MÌŠ
NÚYŠOOOLJ\™]\›ˆOMÌÜ™]\›ˆ˜[ÙNßB˜ÛÛœÝ\]P™Y›Ü™LMÌ\ØZU\]LMÎÜØZU\]LMÏY[˜Ý[ÛŠ
^ÚYŠ\ØZLMÊ
_\Ý\Y]\ÙYÚ[™[X]XßØÝ[Y[šY[Š\™]\›ŽÚYŠÝ\”Ý]LMÌŠ
Kœ[™[™Ê^ÛÝ\Ú[™[XLMÌŠ
NÜ™]\›ŽßZYŠÝ\”Ý]LMÌŠ
K™XY
^ÚYŠ[Ý\’\™LMÌŠ
J[Ý\‘[\ŒMÌŠÝ\”Ý]LMÌŠ
KœXÙK˜[ÙJNÜ™]\›ˆÝ\•\]LMÌŠ
NßZYŠ^Y\‹šL
\™]\›ˆØZQX]MÌŠ˜[ÙJNØÛÛœÝ™]\^Y\‹šÝ\]P™Y›Ü™LMÌŠ
NÚYŠ[Ý\”Ý]LMÌŠ
K™XY
^ÚYŠ™]Œ	‰œ^Y\‹šL
\™]\›ˆØZQX]MÌŠ˜[ÙJNÛÝ\•XÚÌMÌŠÛ[\
ŒJJNÚYŠ˜Y]’\™LMŽ

I‰œ˜Y]”›ÙÜ™\ÜÌMŽ

K™Y™X]Y	‰ˆ\˜Y]”™\X]MÌÉ‰ˆ[Ý\”Ý]LMÌŠ
Kœ˜Y]Y\Š\™]\›ˆØZQX]MÌŠYJNß\ØZRYMÊ
NßNÂ˜ÛÛœÝ]XÚÐ™Y›Ü™LMÌ\ØZP]XÚÌMÎÜØZP]XÚÌMÏY[˜Ý[ÛŠJ^ÚYŠÝ\”[ŒMÌ‹™Ù[šÚ_Ý\’\™LMÌŠ
J\™]\›ˆ˜[ÙNÜ™]\›ˆ]XÚÐ™Y›Ü™LMÌŠJNßNÂ˜ÛÛœÝ[\˜XÝ™Y›Ü™LMÌZ[\˜XÝÚ[\˜XÝY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆÝ\’\™LMÌŠ
OÛÝ\•[ÌMÌŠ
Nš[\˜XÝ™Y›Ü™LMÌŠ‹‹˜JNßNÂ˜ÛÛœÝÝ\\MÌ^ßNÙ›ÜŠÛÛœÝÈÙˆÉÛX\ÉË	ØXÝÜœÉË	Û[Ý[Û‰×J^ÛÝ\\MÌ–Ú×O[™]È[XYÙJ
NÛÝ\\MÌ–Ú×KœÜ˜ÏIÛÝ\ŒMÌ‹ÉÊÚÊÉËÙXœ	ÎßB‹ËÈ›Ý[™È\™H[K]˜[Y]Yœ›ÛHÙ[™\˜]YÚY]ÎÈ›È™ZYÚ›Üš[™ÈÙ[È\™HØ[\Y‚›]Ý\‘œ˜[Y\ÌMÌVÖÖÌMKŒNŒM×KÌŒËNNËŒNWKÌÎLKNKŒŽWKÍNKMKNËŒŒ—KÍÍÍL‹MÍKŒWKÎMNKLKMÍËŒ—KÌLM‹MNLŒŒ×KÌLÌÍËNKNËŒM×WKÖÌKÌM‹MKŒNWKÌŒËÌMKN‹ŒŒKÍËÌLKMÌ‹ŒKÍNÌMKMKŒŒKÍÎKÌNMŒM×KÎMLKÌMNKŒŒWKÌLMËÌM‹ŒM‹ŒNWKÌLÍL‹ÌMMŒŒŒWWKÖÌNKMËMKLÍ×KÌŒMMÍ‹MÍLŽWKÍLKMŽMŒ‹LÍ×KÍŒËMŽKMNKLÍ×KÍÎMÌ‹MŒLÍWKÎMŽKMŽKMÌLÎKÌLML‹MKNËMKÌLÍL‹MŽMŽLÎWWKÖÌMKÌÍKMÌLWKÌŒÌÎKMŽ×KÌÎNÌÎKMŽ×KÍNÌÍ‹MÌËLWKÍÍÍ‹ÍÌKMÍŒM×KÎMNKÍÌ‹MÌKŒMWKÌLLÎKÍÌNNŒM—KÌLÌÌÍÌNLËŒMWWWK[Ý[Û‘œ˜[Y\ÌMÌVÖÖÌNKŒ‹MÌKŒÌ×KÌŒŒKMËŒÌKÌÎLËŒKMŒÌKÍMÍËŒLKMŽKŒ×KÍÍÌ‹ŒLËMÌ‹ŒKÎMŒ‹ŒLKMÌKŒŽKÌLMMŒLKMÍ‹Œ×KÌLÍŒLMÌ‹ŒŽWWKÖÌMKŒÌ‹MÌ‹NLKÌŒËŒÎMŒKNWKÌÎM‹ŒÍMKŒÌWKÍMËŒÍKMŒËŒ×KÍÌÍKÍ‹ŒKLŽWKÎLŽKÎKŒLÌKÌLMŒ‹ÍKŒKLÍ—KÌLÍLËÍ‹MÌËLÌ×WWNÂ™[˜Ý[ÛˆÝ\”Üš]LMÌŠ[XYÙKœ˜[Y\Ë›ÝËœ˜[YKKLLŒ›\Y˜[ÙKØÏXÝ
^ØÛÛœÝYœ˜[Y\ÖÜ›Ý×OË–ÓX]™›ÛÜŠœ˜[YJIYœ˜[Y\ÖÜ›Ý×K›[™ÝNÚYŠYŸZ[XYÙK˜ÛÛ\]_Z[XYÙK›˜]\˜[ÚY
\™]\›ŽØÛÛœÝØÏZÙ–Ì×NØØËœØ]™J
NØØË˜[œÛ]JJNÚYŠ›\
XØËœØØ[JLKJNØØË™˜]Ò[XYÙJ[XYÙK–ÌK–ÌWK–Ì—K–Ì×KY–Ì—JœØËÌ‹Z–Ì—JœØË
NØØËœ™\ÝÜ™J
NßB™[˜Ý[ÛˆÝ\“X\Z[MÌŠØËKKË
^ØÛÛœÝ[O[Ý\\MÌ‹›X\ÎÚYŠZ[K˜ÛÛ\]_Z[K›˜]\˜[ÚY
\™]\›ŽØÛÛœÝÙ[VÌKË—VÚWKÝÏZ[KÚYÌ‹ÚZ[KšZYÚÌŽØØË™˜]Ò[XYÙJ[K
Ù[	LŠJœÝËX]™›ÛÜŠÙ[ÌŠJœÚÝËÚKË
NßB™[˜Ý[Ûˆ]\˜LMÌŠK™YY˜[ÙJ^ØÛÛœÝ[[œÚ]O\™YÛÝ\”[ŒMÌ‹šØZKÌŒ‹MKžM
Ú[[œÚ]JŒŒžONŠÚ[[œÚ]JŒXÛØÚÊŽNØÝœØ]™J
NØÝ™ÛØ˜[ÛÛ\ÜÚ]SÜ\˜][ÛIÜØÜ™Y[‰ÎÙ›ÜŠ]^Y\LŽÛ^Y\LÛ^Y\‹KJ^ØÝ˜™YÚ[”]

NÙ›ÜŠ]LÚLÍŽÚŠÊÊ^ØÛÛœÝOZ‹ÌÍŠ“X]”JŒ‹LJËŒJ“X]œÚ[ŠŠŒ‹ÊÝ
JËŒŠ“X]˜ÛÜÊŠ]
NØÛÛœÝ^
ÓX]˜ÛÜÊJJœž
œŠŠJÛ^Y\Š‹ŒŠKO^KMN
ÓX]œÚ[ŠJJœžJœŠŠJÛ^Y\Š‹ŒMJNÚYŠZŠXÝ›[Ý™UÊJNÙ[ÙHÝ›[™UÊJNßXÝ˜ÛÜÙT]

NØÝ™š[Ý[O\™YÖÉÈÙ™ŒNØMMIË	ÈÙŽLÎ	Ë	ÈÙ™ŒÌXI×VÛ^Y\—N–ÉÈÙMY™™™MIË	ÈÍÙ™™ŒÌÉË	ÈÌÍNY™™ŒN	×VÛ^Y\—NØÝ™š[

NØÝœÝ›ÚÙTÝ[O\™YÉÈÙ™MMŽ	Î‰ÈØÍY˜™™Ž	ÎØÝ›[™UÚY[^Y\OOLÌÎŒNØÝœÝ›ÚÙJ
NßY›ÜŠ]LÚLŽÚŠÊÊ^ØÛÛœÝÏJÛØÚÊŒL
ÚŠŒÌJILN^
ÓX]œÚ[ŠŠKÊJœžØÝ™š[Ý[O\™YÉÈÙ™ŽNN	Î‰ÈÙMÙ™™™‰ÎØÝ™š[™XÝ
KZË‹
NßXÝœ™\ÝÜ™J
NßB˜ÛÛœÝÜš]P™Y›Ü™LMÌ\ØZTÜš]LMÎÜØZTÜš]LMÏY[˜Ý[ÛŠ›ÝËœ˜[YKKLL›\Y˜[ÙJ^ØÛÛœÝ\Ô^Y\ZOOLLŒ	‰žOO\^Y\‹ž	‰žOOO\^Y\‹žK[Ý\”[ŒMÌŽÚYŠZ\Ô^Y\Š\™]\›ˆÜš]P™Y›Ü™LMÌŠ›ÝËœ˜[YKK›\
NÚYŠ‹šØZ_ØZT[ŒMË˜Ú\™Ú[™ÊX]\˜LMÌŠKH\‹šØZJNÚYŠ‹™Ù[šÚ_ØZT[ŒMË˜XÝ[ÛË\OOOIÙÙ[šÚLMÌ‰Ê^ÛÝ\”Üš]LMÌŠÝ\\MÌ‹˜XÝÜœËÝ\‘œ˜[Y\ÌMÌ‹Ë‹™Ù[šÚOÓX]™›ÛÜŠÛØÚÊJIM
ÓX]›Z[ŠËX]™›ÛÜŠØZT[ŒMË˜XÝ[Û‹ËŽ

JKKLK^Y\‹™˜XÙO
NßB™[ÙHYŠ›ÝÏOOMJ^ØÛÛœÝO\ØZT[ŒMË˜XÝ[ÛŽÛÝ\”Üš]LMÌŠÝ\\MÌ‹›[Ý[Û‹[Ý[Û‘œ˜[Y\ÌMÌ‹X]›Z[ŠËX]™›ÛÜŠ
OË
KËŽJŽ
JKKLŒ›\
NÚYŠI‰˜KŽJ^ØÛÛœÝž^
Ê›\ËLNŒJJŠKŒÍOËLNŒÍJKžO^KMK˜YNJØK
ŒØÝ™š[Ý[OIÈÍÙXY™ŽNIÎØÝ˜™YÚ[”]

NØÝ˜\˜ÊžžK˜YX]”JŒŠNØÝ™š[

NØÝ™š[Ý[OIÈÙY™™™™‰ÎØÝ˜™YÚ[”]

NØÝ˜\˜ÊžžK˜Y
‹MKX]”JŒŠNØÝ™š[

Nß_B™[ÙHYŠ‹™›J^ØÛÛœÝ\\^Y\‹Ø[Ñ\˜\ÙOY\OOIØ˜XÚÉÏÌŽ™\OOIÜšYÚ	ÏÍ™\OOIÛY	ÏÍŽŒÛÝ\”Üš]LMÌŠÝ\\MÌ‹›[Ý[Û‹[Ý[Û‘œ˜[Y\ÌMÌ‹K˜\ÙJÓX]™›ÛÜŠÛØÚÊŽ
IL‹KLSX]œÚ[ŠÛØÚÊÊJŒËLJNØÝœÝ›ÚÙTÝ[OIÈÙY˜Y™ŽNIÎØÝ›[™UÚYLŽÙ›ÜŠ]OLÚOÎÚJÊÊ^ØÝ˜™YÚ[”]

NØÝ›[Ý™UÊ\^Y\‹™
MKKMMJÚJŒLŠNØÝ›[™UÊ\^Y\‹™
ŒLKMMJÚJŒL‹\^Y\‹™JŒŒŠNØÝœÝ›ÚÙJ
Nß_B™[ÙHÜš]P™Y›Ü™LMÌŠ›ÝËœ˜[YKK›\
NÚYŠÝ\”Ý]LMÌŠ
K™XY
^ØÝœÝ›ÚÙTÝ[OIÈÙ™™ŒØLÉÎØÝ›[™UÚYMØÝ˜™YÚ[”]

NØÝ™[\ÙJKLMKJ‹™›OÌŒ
KŒKX]”JŒŠNØÝœÝ›ÚÙJ
Nß_NÂ™[˜Ý[ÛˆÝ\‘Y™™XÝÌMÌŠ
^ØÛÛœÝ[Ý\”[ŒMÌŽÚYŠ‹™Ù[šÚJ^ØÛÛœÝ˜Y]\ÏLN
Ü‹™Ù[šÚK
ŒLK\^Y\‹žO\^Y\‹žKLNØÝœØ]™J
NØÝ™ÛØ˜[ÛÛ\ÜÚ]SÜ\˜][ÛIÜØÜ™Y[‰ÎÙ›ÜŠ]OLÚONÚJÊÊ^ØÛÛœÝOZJ“X]”KÎJØÛØÚÊ‹Ž\˜Y]\ÊÊ
JŒÌJØÛØÚÊŒLL
ILMŒ
NØÝœÝ›ÚÙTÝ[OIÈÎXÙNY™ŽNIÎØÝ˜™YÚ[”]

NØÝ›[Ý™UÊ
ÓX]˜ÛÜÊJJ™JÓX]œÚ[ŠJJ™
‹ÊNØÝ›[™UÊ
ÓX]˜ÛÜÊJJŠLJKJÓX]œÚ[ŠJJŠLJJ‹ÊNØÝœÝ›ÚÙJ
NßXÛÛœÝÏXÝ˜Ü™X]T˜YX[Ü˜YY[
KËK˜Y]\ÊNÙË˜YÛÛÜ”ÝÜ
	ÈÙ™™™™™‰ÊNÙË˜YÛÛÜ”ÝÜ
K	ÈÎYYŒÙ™‰ÊNÙË˜YÛÛÜ”ÝÜ
K	ÈÌŽNNY™ŒŒ‰ÊNØÝ™š[Ý[OYÎØÝ˜™YÚ[”]

NØÝ˜\˜ÊK˜Y]\ËX]”JŒŠNØÝ™š[

NØÝœ™\ÝÜ™J
NßZYŠ‹˜›ÛXŠ^ØÛÛœÝ\‹˜›ÛX‹˜Y]\ÏX‹˜\œÝŒÎ
ÊKX‹˜\œÝËŠJŒLÌŒ
Ø‹˜Ú\™ÙJŽNØÝœØ]™J
NØÝ™ÛØ˜[[OX‹˜\œÝŒØ‹˜\œÝËŽŒNØÝ™š[Ý[OIÈÍÎY™MIÎØÝ˜™YÚ[”]

NØÝ˜\˜Ê‹ž‹žK˜Y]\ÊÌLŠÓX]œÚ[ŠÛØÚÊŒŒ
JX]”JŒŠNØÝ™š[

NØÝ™š[Ý[OIÈØ˜Y˜Y™‰ÎØÝ˜™YÚ[”]

NØÝ˜\˜Ê‹ž‹žK˜Y]\ËX]”JŒŠNØÝ™š[

NØÝ™š[Ý[OIÈÙ™™™™™‰ÎØÝ˜™YÚ[”]

NØÝ˜\˜Ê‹ž\˜Y]\Ê‹Œ‹‹žK\˜Y]\Ê‹Œ‹˜Y]\Ê‹KX]”JŒŠNØÝ™š[

NØÝœ™\ÝÜ™J
Nß_B™[˜Ý[ÛˆÝ\Ø[Y\˜LMÌŠ
^ØÛÛœÝ›ÛÛOSX]›X^
ËÌMŒÌL
KÚY[Ý\“X\MÌŠ
OOOLÌMŒMŒÜ™]\›žÞ›ÛÛKÞ˜Û[\
^Y\‹žUËÊŠž›ÛÛJKX]›X^
ÚYUËÞ›ÛÛJJKÞN˜Û[\
^Y\‹žKRÊŠž›ÛÛJKX]›X^
LRÞ›ÛÛJJ_NßB™[˜Ý[ÛˆÝ\‘˜]ÌMÌŠ
^ØÛÛœÝÞ›ÛÛKÞÞ_O[Ý\Ø[Y\˜LMÌŠ
KO[Ý\“X\MÌŠ
NØÝš[XYÙTÛ[ÛÝ[™Ñ[˜X›YY˜[ÙNØÝ™š[Ý[OIÈÙŒXŽ	ÎØÝ™š[™XÝ
Ë
NØÝœØ]™J
NØÝœØØ[J›ÛÛK›ÛÛJNØÝ˜[œÛ]JXÞXÞJNÚYŠOOOLŠ^Ù›ÜŠ]SX]™›ÛÜŠÞÌMŒ
JŒMŒÞÞ
ÕËÞ›ÛÛJÌMŒÞ
ÏLMŒ
[Ý\“X\Z[MÌŠÝ‹MŒL
NØÛÛœÝ]J
OOžØÝ˜™YÚ[”]

NÙ›ÜŠ]LLÞLLÎLÞ
ÏLJ^ØÛÛœÝO\Û˜ZÙVLMÌŠ
NÚYŠOOLL
XÝ›[Ý™UÊJNÙ[ÙHÝ›[™UÊJNß_NØÝ›[™R›Ú[XÝ›[™PØ\IÜ›Ý[™	ÎÜ]

NØÝœÝ›ÚÙTÝ[OIÈÍXMÍIÎØÝ›[™UÚYLŒŒØÝœÝ›ÚÙJ
NØÝœÝ›ÚÙTÝ[OIÈØÎLN	ÎØÝ›[™UÚYLŒØÝœÝ›ÚÙJ
NØÝœÝ›ÚÙTÝ[OIÈÎØ™Ù	ÎØÝ›[™UÚYLNÎØÝœÝ›ÚÙJ
NÙ›ÜŠ]SX]›X^
LLX]™›ÛÜŠ
ÞLL
KÍJJJNÞX]›Z[ŠLÎÞ
ÕËÞ›ÛÛJÌL
NÞ
ÏMJ^ØÛÛœÝO\Û˜ZÙVLMÌŠ
NØÝœÝ›ÚÙTÝ[OIÈÍMÍÙŽYŽ	ÎØÝ›[™UÚYLÎØÝ˜™YÚ[”]

NØÝ›[Ý™UÊKNÊNØÝ›[™UÊ
ÌMKJÎÊNØÝœÝ›ÚÙJ
NßXÝ™š[Ý[OIÈÙXÙŽ™‰ÎÙ›ÜŠ]SX]›X^
LLX]™›ÛÜŠ
ÞLL
KÎL
JŽL
NÞX]›Z[ŠLÎÞ
ÕËÞ›ÛÛJÌL
NÞ
ÏNL
^ØÛÛœÝO\Û˜ZÙVLMÌŠ
NØÝ˜™YÚ[”]

NØÝ›[Ý™UÊLL‹KNM
NØÝ›[™UÊKLLJNØÝ›[™UÊ
ÌL‹KNM
NØÝ™š[

NßXÝ™š[Ý[OIÈÎM˜L	ÎØÝ˜™YÚ[”]

NØÝ˜\˜ÊLÍÎÛ˜ZÙVLMÌŠLÍÎ
KLX]”JŒŠNØÝ™š[

NßB™[ÙHÝ\“X\Z[MÌŠÝKMŒL
NØÝ^[YÛIØÙ[\‰ÎØÝ™›ÛIØ›ÛŒ[Û›ÜÜXÙIÎØÝ™š[Ý[OIÈÙ™™˜‰ÎØÝœÝ›ÚÙTÝ[OIÈÌLÌ‰ÎØÝ›[™UÚYMØÛÛœÝX™[JJOOžØÝœÝ›ÚÙU^
JNØÝ™š[^
JNßNÚYŠOOOL
^ÛX™[
M
	ÑS“PH8¡¤IË	ÖQSSPH8¡¤IË	ÑS“PH8¡¤IË	ÖQSSPH8¡¤IÊKLŒ
NÛX™[
M
	ÔÑT”QS•H8¡¤‰Ë	ÔÓRÑHÐVH8¡¤‰Ë	ÔÑT”S•H8¡¤‰Ë	ÖRSSˆSÓH8¡¤‰ÊKLÍŒÎ
NßZYŠOOOLJ^ÛÝ\”Üš]LMÌŠÝ\\MÌ‹˜XÝÜœËÝ\‘œ˜[Y\ÌMÌ‹X]™›ÛÜŠÛØÚÊŒÊINLŒJNØÝœØ]™J
NØÝ˜™YÚ[”]

NØÝœ™XÝ
LÌŒŒML
NØÝ˜Û\

NÛÝ\“X\Z[MÌŠÝKMŒL
NØÝœ™\ÝÜ™J
NÛX™[
	ÑS“PHÈQSSPIËLÌ
NÛX™[
M
	ÔÐSQH8¡¤ÉË	ÑVU8¡¤ÉË	ÔÐpãQH8¡¤ÉË	ðáÒRÒqgˆ8¡¤ÉÊKLŒ
NßZYŠOOOLÊ^ÛÝ\”Üš]LMÌŠÝ\\MÌ‹˜XÝÜœËÝ\‘œ˜[Y\ÌMÌ‹KX]™›ÛÜŠÛØÚÊ
INÌŒŒLLJNÛX™[
	ÒÐRSËTÐSPIËÌŒŒ
NØÛÛœÝ[Ý\”[ŒMÌ‹˜X˜›\ÎÛÝ\”Üš]LMÌŠÝ\\MÌ‹˜XÝÜœËÝ\‘œ˜[Y\ÌMÌ‹‹X]™›ÛÜŠÛØÚÊŒLŠIN‹ž‹žKK‹žŒLL
NÛX™[
	Ð•P“TÉË‹ž‹žKNMJNÚYŠÝ\”Ý]LMÌŠ
KœÝYÙOOOLŠ^ØÝ™š[Ý[OIÈÌMÌŽØÉÎØÝ™š[™XÝ
‹žMK‹žKLLL‹L
NØÝ™š[Ý[OIÈØM™ŒMØIÎØÝ™š[™XÝ
‹žMK‹žKLLL‹L
›Ý\”Ý]LMÌŠ
K˜Ø]Ú[YKÌKŒ‹
Nß[X™[
	ø¡¤S“PIËŒL
NßB˜ÛÛœÝ\\^Y\‹Ø[Ñ\›ÝÏY\OOIØ˜XÚÉÏÌN™\OOIÜšYÚ	ÏÌŽ™\OOIÛY	ÏÌÎŒØÝ™š[Ý[OIÈÌMÌÌÌÙMMIÎØÝ˜™YÚ[”]

NØÝ™[\ÙJ^Y\‹ž^Y\‹žKLËÌ‹LX]”JŒŠNØÝ™š[

NÜØZTÜš]LMÊØZT[ŒMË˜Ú\™Ú[™É‰ˆ\^Y\‹›[Ýš[™ÏÍŽœ›ÝË^Y\‹›[Ýš[™ÏÓX]™›ÛÜŠØZT[ŒMËœ\ÙJINŒ^Y\‹ž^Y\‹žKLŒ˜[ÙJNÛÝ\‘Y™™XÝÌMÌŠ
NØÝœ™\ÝÜ™J
NÚYŠOOOLŠ^ØÝ™š[Ý[OIÈÌMŒ˜MY	ÎØÝ™š[™XÝ
Ê‹ŒÍK
‹ŒŒ‹Ê‹ŒËÌ
NØÝ™š[Ý[OIÈÎX™™Y‰ÎØÝ™š[™XÝ
Ê‹ŒÍJÍ
‹ŒŒŠÌŒK
Ê‹ŒËN
J˜Û[\

^Y\‹žLŒÌ
KÌLÍŒJKJNØÝ™š[Ý[OIÈÙ™™ÉÎØÝ™›ÛIØ›ÛLœ[Û›ÜÜXÙIÎØÝ^[YÛIØÙ[\‰ÎØÝ™š[^
X]™›ÛÜŠÛ[\

^Y\‹žLŒÌ
KÌLÍŒJJŒL
JÉÉH0­È	ÊÓM
	ÔÒQÕQHSÐSRS“ÉË	Ñ“ÓÕÈH“ÐQ	Ë	ÔÒQÐHÈÐSRS’ÉË	ÖSÓH1,“IÊKÊ‹K
‹ŒŒŠÌM
Nß_B˜ÛÛœÝ˜]Ð™Y›Ü™LMÌ\ØZQ˜]ÌMÎÜØZQ˜]ÌMÏY[˜Ý[ÛŠ
^ÚYŠÝ\’\™LMÌŠ
J\™]\›ˆÝ\‘˜]ÌMÌŠ
NÙ˜]Ð™Y›Ü™LMÌŠ
NØÛÛœÝSX]›X^
ËÌMŒÌL
KÞXÛ[\
^Y\‹žUËÊŠžŠKX]›X^
MŒUËÞŠJKÞOXÛ[\
^Y\‹žKRÊŠžŠKX]›X^
LRÞŠJNØÝœØ]™J
NØÝœØØ[J‹ŠNØÝ˜[œÛ]JXÞXÞJNÛÝ\‘Y™™XÝÌMÌŠ
NØÝœ™\ÝÜ™J
NßNÂ˜ÛÛœÝÝ\”ÝÜžLMÌVÖÉÑÛÚÝHÝZ™]HH˜Y]ˆ\˜H[\Y\ˆ]YH\ØØ\KˆXØÛÛÈ™pî›™HÝH[™\™ðëXHH[ž˜H[XZØ[šÛÜØ\Ëˆ[]\]YH]˜]šY\ØHH[X›ÜÎˆÛÚÝHØXÜšYšXØHÝHšYH\˜HØ[˜\ˆHÛÚ[ˆHHHY\œ˜K‰Ë	ÑÛÚÝHÛÈ˜Y]ˆÈ™]™[\È\ØØ\KˆXØÛÛÈØ]\œÈ[™\™ÞH[™š\™\ÈHÜXÚX[™X[HØ[››Û‹ˆH]XÚÈÝšZÙ\È›Ýœ›Ý\œÎˆÛÚÝHØXÜšYšXÙ\È\ÈY™HÈØ]™HÛÚ[ˆ[™X\‰Ë	ÑÛÚÝHÙYÝ\˜H˜Y]ˆ\˜H[\Y\ˆÝXHYØKˆXØÛÛÈ™pî›™H[™\™ÚXHH[°éØHÈXZØ[šÛÜØ\ËˆÈÛÛH][™ÙHÜÈÚ\ÎˆÛÚÝHØXÜšYšXØHHšYH\˜HØ[˜\ˆÛÚ[ˆHH\œ˜K‰Ë	ÑÛÚÝHØpéÛX\ñ,[±,H0í››[YZÈpéÚ[ˆ˜Y]¸ &ZH]\‹ˆXØÛÛÈ[™\ššHÜ^q,\0åž™[qgñ,[ˆÜx &[H]\‹ˆØ[1,\±,HZÚHØ\™qgÙHH\ØX™]Y\ŽˆÛÚÝKÛÚ[ˆ™H0ïžXHpéÚ[ˆ^X]1,[±,H™YHY\‹‰×KÉÒØ[ZH]˜HHÛÚÝH[H[›XKˆ[ˆ[Ý›È][™ÈÛÛœÙ\˜HÝHÝY\œÈH™XÚX™HHÜÜ[šYYH™XÛÜœ™\ˆ[Ø[Z[›ÈHHÙ\œY[H\˜H[™[˜\ˆÛÛˆØZ[Ë\Ø[XK‰Ë	ÒØ[ZHZÙ\ÈÛÚÝH™Y›Ü™HY[[XKˆ[ˆÝ\ˆÛÜ›HÙY\È\È›ÙH[™™XÙZ]™\ÈHÚ[˜ÙHÈ˜]™[Û˜ZÙHØ^HÈ˜Z[ˆ[™\ˆÚ[™ÈØZK‰Ë	ÒØ[ZH]˜HÛÚÝHH[›XKˆ›ÈÝ]›È][™È[HX[0ê[HÙ]HÛÜœÈH™XÙX™HHÚ[˜ÙHHÙYÝZ\ˆÈØ[Z[šÈHÙ\œ[H\˜H™Z[˜\ˆÛÛHØZ[Ë‰Ë	ÒØ[ZKÛÚÝx &^]HY[[Xx &^XHðí0ï°ï‹ˆ0åZÚH0ïžXx &YH™Y[š[šHÛÜ\ˆ™HÜ˜[ØZH[Hq'Ú][YZÈpéÚ[ˆq,[[ˆ[Ûx &[HÙpéÛYH±,\œØ]1,H[\‹‰×KÉÐ[\ÈH[Üš\‹˜Y]ˆYšY\H]YHÝ›ÜÈÜÈØZ^XZš[œÈYØ\°è[ˆ[ˆ[ˆpì[ËˆÛÚÝHÙH™\\˜H[ˆ[pè\È[0èKˆ[ˆ\ÝHY\XÚpìÛˆYY\ÈY\›HH[›XH]YHH™]š]˜HÝX[™È]ZY\˜\È›Û™\‹‰Ë	Ð™Y›Ü™HZ[™Ë˜Y]ˆØ\›œÈ]ÛÈÝ\ˆØZ^X[œÈÚ[\œš]™H[ˆÛ™HYX\‹ˆÛÚÝH™\\™\È[ˆHY\›Y™Kˆ[ˆ\ÈY\][Ûˆ[ÝHØ[ˆ\ÚÈY[[XHÈ™]š]™H[ÝHÚ[ˆ[ÝHØ[È™]\›‹‰Ë	Ð[\ÈH[Üœ™\‹˜Y]ˆ]š\ØH]YHÝ]›ÜÈÚ\ÈØZ^XZš[œÈÚYØ\°èÛÈ[H[H[›ËˆÛÚÝHÙH™\\˜H›È[0ê[Kˆ™\ÝHY\péðèÛÈ›ØðêˆÙHY\ˆH[›XH\˜H™]š]™\ˆ]X[™È]Z\Ù\ˆ›Û\‹‰Ë	Ô˜Y]ˆ0í›YY[ˆ0í›˜ÙHZÚHØZ^X[¸ &q,[ˆš\ˆq,[péÚ[™HÙ[XÙq'Ú[šHðíž[\‹ˆÛÚÝH0íZÚH0ïžXYH^±,\›[±,\‹ˆH^X\›[XYH0í››YZÈ\ÝYq'Ú[™HY[[Xx &Y[ˆØ[›[›X^q,H\Ý^YXš[\œÚ[‹‰×WNÂ™[˜Ý[ÛˆÝ\Ú[™[XLMÌŠ[™[L
^ÚYŠ\ØZLMÊ
_[Ý\”Ý]LMÌŠ
K™XY
\™]\›ˆ˜[ÙNÛÝ\”[ŒMÌ‹˜Ú[™[XO\[™[ØÛÛœÝÚÙ[JÊÛÝ\”[ŒMÌ‹˜Ú[™[XUÚÙ[ŽÜÚÝÑX[ÙÊ	ÑQÓÓˆS‰ËM
	Ñ[ØXÜšYšXÚ[ÈHÛÚÝIË	ÑÛÚÝx &\ÈØXÜšYšXÙIË	ÓÈØXÜšY°ëXÚ[ÈHÛÚÝIË	ÑÛÚÝx &[[ˆ™YZðèœ›1,q'ñ,IÊK	Ï]ˆ]K[›ËZLNØ[˜\ÈYH›Ý\‹XÚ[™[XLMÌˆˆÛ\ÜÏHœ˜Y]‹\ØÙ[™LMŽˆÚYHÍŽˆZYÚHØØ[˜\Ï‰ÊÓM
‹‹›Ý\”ÝÜžLMÌ–Ü[™[JJÉÏÜ‰ÊÊ[™[
ÌJJÉÈÈÏÜÙ]‰ËÖÜ[™[ÓM
	ÔÒQÕRQS•IË	Ó‘V	Ë	Ô°äÖSSÉË	ÔÓÓ”Rñ,	ÊN“M
	ÑS•TˆSÕ“ÈUS‘ÉË	ÑS•TˆÕTˆÓÔ“	Ë	ÑS•Tˆ“ÈÕU“ÈUS‘ÉË	ðå•Rñ,0ç–Px &VPHñ,‰ÊK

OOžÚYŠ[™[Š[Ý\Ú[™[XLMÌŠ[™[
ÌJNÙ[Ù^ÛÝ\”Ý]LMÌŠ
Kœ[™[™ÏY˜[ÙNÛÝ\”[ŒMÌ‹˜Ú[™[XOKLNÛÝ\”[ŒMÌ‹˜Ú[™[XUÚÙ[ŠÊÎØÛÜÙQX[ÙÊ
NÜ\œÚ\ÝØ[YJ
Nß_WWJNØÛÛœÝÝ\\\™›Ü›X[˜ÙK››ÝÊ
NØÛÛœÝZ[J
OOžÚYŠÚÙ[ˆOO[Ý\”[ŒMÌ‹˜Ú[™[XUÚÙ[Ÿ[Ý\”Ý]LMÌŠ
K™XY
\™]\›ŽØÛÛœÝÏYØÝ[Y[™Ù][[Y[žRY
	ÛÝ\‹XÚ[™[XLMÌ‰ÊNÚYŠXÊ\™]\›ŽØÛÛœÝØÏXË™Ù]ÛÛ^
	Ì™	ÊKJ\™›Ü›X[˜ÙK››ÝÊ
K\Ý\
KÌLØØËš[XYÙTÛ[ÛÝ[™Ñ[˜X›YY˜[ÙNØØË˜ÛX\”™XÝ
ÍŽ
NÚYŠ[™[OOL
^ØÛÛœÝ[O\ØZSX\ÌMÎÚYŠ[K˜ÛÛ\]I‰š[K›˜]\˜[ÚY
XØË™˜]Ò[XYÙJ[K[KÚYÌ‹[KšZYÚÌ‹[KÚYÌ‹[KšZYÚÌ‹ÍŽ
NÛÝ\”Üš]LMÌŠØZP]\ÌMËØZSY]LMËKX]™›ÛÜŠ
ŠINLÌÌMK˜[ÙKØÊNÛÝ\”Üš]LMÌŠ˜Y]\MŽ˜Y]‘œ˜[Y\ÌMŽKX]™›ÛÜŠ
JINÌKN˜[ÙKØÊNØÛÛœÝ[ÙOKJËJ“X]œÚ[Š
ŒÊNØØËœÝ›ÚÙTÝ[OIÈÙŽLIÎØØË›[™UÚYMJÌLŠœ[ÙNØØË˜™YÚ[”]

NØØË›[Ý™UÊL
NØØË›[™UÊLŽL
NØØËœÝ›ÚÙJ
NØØËœÝ›ÚÙTÝ[OIÈØMM˜Y™‰ÎØØË›[™UÚYLÎØØË˜™YÚ[”]

NÙ›ÜŠ]MÞLÞ
ÏMŠ^ØÛÛœÝOLÌ
ÓX]œÚ[Š
‹ŒM]
ŒMJJŒNØØË›[™UÊJNßXØËœÝ›ÚÙJ
NØØË™š[Ý[OIÈÙ™™™™™‰ÎØØË™ÛØ˜[[O\[ÙJ‹ŒLŽØØË™š[™XÝ
ÍŽ
NØØË™ÛØ˜[[OLNßY[Ù^ÛÝ\“X\Z[MÌŠØË[™[OOLOÌNŒÍŽ
NÚYŠ[™[OOLJ[Ý\”Üš]LMÌŠÝ\\MÌ‹˜XÝÜœËÝ\‘œ˜[Y\ÌMÌ‹X]™›ÛÜŠ
ŒÊINÎLNMMK˜[ÙKØÊNÛÝ\”Üš]LMÌŠØZP]\ÌMËØZSY]LMËÎÍLSX]œÚ[Š
ŒÊJLL˜[ÙKØÊNØØËœÝ›ÚÙTÝ[OIÈÙ™™ØL	ÎØØË›[™UÚYMØØË˜™YÚ[”]

NØØË™[\ÙJÎŒŒNKX]”JŒŠNØØËœÝ›ÚÙJ
Nß\™\]Y\Ý[š[X][Û‘œ˜[YJZ[
NßNÜZ[

NÜ™]\›ˆYNßB˜ÛÛœÝY[P™Y›Ü™LMÌ\ØZSY[LMÎÜØZSY[LMÏY[˜Ý[ÛŠYÙOIÜÝ]IÊ^ÚYŠ\ØZLMÊ
J\™]\›ˆ˜[ÙNÚYŠÝ\’\™LMÌŠ
I‰œYÙOOOIÛX\	Ê\™]\›ˆÝ\‘ÝZYLMÌŠ
NØÛÛœÝÝ][Y[P™Y›Ü™LMÌŠYÙJKÏ[Ý\”Ý]LMÌŠ
KYØÝ[Y[˜Ü™X]Q[[Y[
	Ü	ÊNØ‹œÙ]]šX]J	Ù]K[›ËZLN‰Ë	ÉÊNØ‹^ÛÛ[SM
	ÐpäSÉË	ÖQPT‰Ë	ÐS“ÉË	ÖRS	ÊJÉÈ	ÊÜØZVYX\ŒMÌŠ
JÉÈ0­È	ÊÓM
	ÌLZ[]ÜÈXÝ]›ÜÈHHpì[Ëˆ[Ø[[™\š[È›ÈY\ž˜HHÚYÝZY[HØYØK‰Ë	ÌLXÝ]™HZ[]\ÈHHYX\‹ˆHØ[[™\ˆÙ\È›Ý›Ü˜ÙHH™^ØYØK‰Ë	ÌLZ[]ÜÈ]]›ÜÈHH[›ËˆÈØ[[™0è\š[È°èÛÈ›Ü°éØHH°ìÞ[XHØYØK‰Ë	ÌLZÝYˆZÚZØHHHq,[ˆZÝš[HÛÛœ˜ZÚH\Ý[±,H›Ü›H˜qgÛ]X^‹‰ÊNÉ
	ÈÙX[ÙØ›ÙIÊK˜\[™
ŠNÚYŠYÙOOOIÝXÚ	ßYÙOOOIÜÝ]IÊ^ØÛÛœÝÏYØÝ[Y[˜Ü™X]Q[[Y[
	Ø]Û‰ÊNÚË^ÛÛ[IÒÐRSÒÑSˆ0­È	ÊÚØZSX^MÌŠ
NÚË›Û˜ÛXÚÏZØZSY[LMÌŽÉ
	ÈÙX[ÙØ]ÛœÉÊKœ™\[™
ÊNÚYŠË™Ù[šÚJ^ØÛÛœÝÏYØÝ[Y[˜Ü™X]Q[[Y[
	Ü	ÊNÙË^ÛÛ[SM
	ÑÙ[šÚY[XNˆ[ØH\˜H™][š\ˆ[™\™ðëXH
¸ $ÍˆÊNÈ[ØHÝ˜H™^ˆ\˜H[ž˜\‹ˆÙH[ž˜H]]Ûpè]XØ[Y[HHÜÈˆËˆ™]][^˜XÚpìÛˆNË‰Ë	ÔÜ\š]›ÛXŽˆ™\ÜÈÈØ]\ˆ[™\™ÞH
¸ $ÍˆÊNÈ™\ÜÈYØZ[ˆÈ›ÝËˆ]]Ë]›ÝÜÈ]ˆËˆÛÛÛÝÛˆNË‰Ë	ÑÙ[šÚY[XNˆÜ]YH\˜H™][š\ˆ[™\™ÚXH
¸ $ÍˆÊNÈÜ]YHH›Ý›È\˜H[°éØ\‹ˆ[°éØH]]ÛX]XØ[Y[H[ÜÈˆËˆ™XØ\™ØHNË‰Ë	ÔZ›ÛX˜\ñ,Nˆ[™\ššHÜ[XZÈpéÚ[ˆ˜\È
¸ $ÍˆÛŠNÈ]XZÈpéÚ[ˆZÜ˜\ˆ˜\ËˆˆÛˆÛÛœ˜HÝÛX]ZÈ]1,[1,\‹ˆ™ZÛ[YHNÛ‹‰ÊNÉ
	ÈÙX[ÙØ›ÙIÊK˜\[™
ÊNß_\™]\›ˆÝ]ßNÂ˜ÛÛœÝY™Y›Ü™LMÌ\ØZRYMÎÜØZRYMÏY[˜Ý[ÛŠ
^ÚY™Y›Ü™LMÌŠ
NÚYŠ\ØZLMÊ
J\™]\›ŽØÛÛœÝÏ[Ý\”Ý]LMÌŠ
K[Ý\”[ŒMÌŽÉ
	ÈÜØZK\ÝÙ\ŒMÉÊK^ÛÛ[IÔÕÑTˆU‘S	ÊÜØZS[X™\ŒMÌŠY™™XÝ]™TÝÙ\ŒMÌŠ
JJÊ‹šØZOÉÈ0­È	ÊÜ‹šØZN‰ÉÊNØÛÛœÝYX\YØÝ[Y[™Ù][[Y[žRY
	ÜØZK^YX\ŒMÌ‰ÊNÚYŠYX\Š^YX\‹^ÛÛ[SM
	ÐpäSÉË	ÖQPT‰Ë	ÐS“ÉË	ÖRS	ÊJÉÈ	ÊÜØZVYX\ŒMÌŠ
JÊ‹šØZOÉÈ0­È	ÊÓM
	ÐTÑIË	ÐTÑIË	ÐTÑIË	ÕSQS	ÊJÉÈ	ÊÜØZS[X™\ŒMÌŠØZTÝ]LMÊ
KœÝÙ\ŠN‰ÉÊNÚYŠÝ\’\™LMÌŠ
J^É
	ÈÜØZK\XÙLMÉÊK^ÛÛ[SM
‹‹“ÕT—ÓSQTÌMÌ–ÛÝ\“X\MÌŠ
WJNÉ
	ÈÜØZK[Øš™XÝ]™LMÉÊK^ÛÛ[[Ý\“X\MÌŠ
OOOLÓM
	ÔÚYÝYHHÙ\œY[NÈ\ÈX™\È™Z[šXÚX[ˆ[šXZ™K‰Ë	Ñ›ÛÝÈHÙ\œ[ÈÛÝYÈ™\Ù]H›Ý\›™^K‰Ë	ÔÚYØHHÙ\œ[NÈ]™[œÈ™Z[šXÚX[HH›Ü›˜YK‰Ë	Öq,[[±,H^›NÈ[]\ˆ[ÛÝ[q'ÝH˜qgØH0í›™0ï°ï‹‰ÊN›Ý\“X\MÌŠ
OOOLÏÊËœÝYÙOOOLÓM
	Ð]˜\HHX˜›\È0­ÈY\XÚpìÛ‰Ë	ÐØ]ÚX˜›\È0­ÈY\][Û‰Ë	ÔYÝYHX˜›\È0­ÈY\péðèÛÉË	ÐX˜›\ø &q,HXZØ[H0­È^][IÊJÉÈ	ÊÓX]™›ÛÜŠË˜Ú\ÙKÎL
ŒL
JÉÉIÎ“M
	ÒX›HÛÛˆØZ[Ë\Ø[XIË	Õ[ÈÈÚ[™ÈØZIË	Ñ˜[HÛÛHØZ[ÉË	ÒÜ˜[ØZH[HÛÛqgÉÊJN“M
	Ñ[›XHYYH™]š]š\H0­ÈØ[Z[›ÈHH\™XÚIË	ÖY[[XHØ[ˆ™]š]™H[ÝH0­È›ØYÛˆHšYÚ	Ë	Ñ[›XHÙH™]š]™\ˆ›Øðêˆ0­ÈØ[Z[šÈ0è\™Z]IË	ÖY[[XHØ[›[™1,\˜Xš[\ˆ0­È[ÛØq'ÙIÊNÉ
	ÈÜØZK][ÌMÉÊKšY[Y˜[ÙNÉ
	ÈÜØZK][ÌMÉÊK^ÛÛ[SM
	ÒP“Tˆ8¥á‰Ë	ÕSÈ8¥á‰Ë	ÑSTˆ8¥á‰Ë	ÒÓÓ•qgˆ8¥á‰ÊNßY[ÙH	
	ÈÜØZK][ÌMÉÊK^ÛÛ[IÔ“ÔÒH8¥á‰ÎÙ›ÜŠÛÛœÝYÙˆÉÜØZK\[˜ÚMÉË	ÜØZKX›\ÝMÉË	ÜØZKZØ[YLMÉ×JZYŠÝ\’\™LMÌŠ
JI
	ÈÉÊÚY
K™\ØX›Y]YNØÛÛœÝ[YØÝ[Y[™Ù][[Y[žRY
	ÜØZK\[ŒMÌ‰ÊK›OYØÝ[Y[™Ù][[Y[žRY
	ÜØZKY›LMÌ‰ÊKØZOYØÝ[Y[™Ù][[Y[žRY
	ÜØZKZØZLMÌ‰ÊKÙ[YØÝ[Y[™Ù][[Y[žRY
	ÜØZKYÙ[šÚLMÌ‰ÊNÚYŠ[Š^Ü[‹^ÛÛ[SM
	ÐÓÔ”‘T‰Ë	Ô•S‰Ë	ÐÓÔ”‘T‰Ë	ÒÓñg‰ÊJÊ‹œ[ÉÈ8§$ÉÎ‰ÉÊNÙ›K^ÛÛ[SM
	Õ“ÓT‰Ë	Ñ“IË	Õ“ÐT‰Ë	ÕpáÉÊJÊ‹™›OÉÈ8§$ÉÎ‰ÉÊNÚØZK^ÛÛ[IÒÐRSÒÑSˆ	ÊÊ‹šØZOÉÞ	ÊÜ‹šØZNœ‹œ™\ÝŒÓX]˜ÙZ[
‹œ™\Ý
JÉÜÉÎ‰ÉÊNÚØZK™\ØX›YZØZSX^MÌŠ
OOOLÙÙ[‹šY[H[Ë™Ù[šÚNÙÙ[‹^ÛÛ[\‹™Ù[šÚOÓM
	ÓS–T‰Ë	Õ“ÕÉË	ÓS°áÐT‰Ë	ÐU	ÊJÉÈ	ÊÜ‹™Ù[šÚKÑš^Y
JJÉÜÉÎ‰ÑÑS’ÒQSPIÊÊ‹˜ÛÛÛŒÉÈ	ÊÓX]˜ÙZ[
‹˜ÛÛÛ
JÉÜÉÎ‰ÉÊNÙÙ[‹™\ØX›Y\‹˜ÛÛÛŒH\‹˜›ÛXŽß_NÂ˜ÛÛœÝZLMÌYØÝ[Y[˜Ü™X]Q[[Y[
	Ù]‰ÊNÝZLMÌ‹šYIÜØZKY^˜LMÌ‰ÎÝZLMÌ‹š[›™\’SIÏ]ÛˆYHœØZK\[ŒMÌˆØ]Û]ÛˆYHœØZKY›LMÌˆØ]Û]ÛˆYHœØZKZØZLMÌˆØ]Û]ÛˆYHœØZKYÙ[šÚLMÌˆØ]Û‰ÎÜØZRY›ÞMË˜\[™
ZLMÌŠNØÛÛœÝYX\ŒMÌYØÝ[Y[˜Ü™X]Q[[Y[
	ÜÛX[	ÊNÞYX\ŒMÌ‹šYIÜØZK^YX\ŒMÌ‰ÎÉ
	ÈÜØZK]š][ÌMÉÊK˜\[™
YX\ŒMÌŠNÉ
	ÈÜØZK\[ŒMÌ‰ÊK›Û˜ÛXÚÏJ
OO›[Øš[]LMÌŠ	Ü[‰ÊNÉ
	ÈÜØZKY›LMÌ‰ÊK›Û˜ÛXÚÏJ
OO›[Øš[]LMÌŠ	Ù›IÊNÉ
	ÈÜØZKZØZLMÌ‰ÊK›Û˜ÛXÚÏZØZSY[LMÌŽÉ
	ÈÜØZKYÙ[šÚLMÌ‰ÊK›Û˜ÛXÚÏYÙ[šÚTÝ\MÌŽÉ
	ÈÜØZK][ÌMÉÊK›Û˜ÛXÚÏJ
OO›Ý\’\™LMÌŠ
OÛÝ\•[ÌMÌŠ
NœØZT›ÜÚLMÊ
NÂ˜ÛÛœÝÜÜÌMÌYØÝ[Y[˜Ü™X]Q[[Y[
	ÜÝ[IÊNØÜÜÌMÌ‹^ÛÛ[IÈÜØZKY^˜LMÌžÜÜÚ][ÛŽ˜XœÛÛ]NÜšYÚŒÉNØ›ÝÛNŒŽINÙ\Ü^N™›^Ù›^]Ü˜\Ü˜\Ú\ÝYžKXÛÛ[™›^Y[™ÙØ\\ÛX^]ÚY	NÜÚ[\‹Y]™[Î˜]]ßHÜØZKY^˜LMÌˆ]ÛžÙ›Û\Ú^™NŒL\ÜY[™ÎÜLÛZ[‹ZZYÚHÜØZKY^˜LMÌˆ]Û–ÚY[—^Ù\Ü^N››Û™_HÜØZK^YX\ŒMÌžÙ\Ü^N˜›ØÚÎØÛÛÜŽˆÙLXÛX\™Ú[‹]ÜÙ›Û\Ú^™N‹Ž[_PYYXJX^ZZYÚL
^ÈÜØZKY^˜LMÌžØ›ÝÛNŒÍ	NÛX^]ÚYI_HÜØZKY^˜LMÌˆ]ÛžÙ›Û\Ú^™NŽ\ÜY[™Î\ÜÛZ[‹ZZYÚŒÍHÜØZKXXÝ[ÛœÌMÈ]ÛžÛZ[‹ZZYÚ\HÜØZK][ÌMÞÛYŒÎ	__IÎÙØÝ[Y[šXY˜\[™
ÜÜÌMÌŠNÂ™[˜Ý[ÛˆÝ\”™\ÝÜ™LMÌŠ
^ÛÝ\”[ŒMÌ‹šØZOLÛÝ\”[ŒMÌ‹™›OY˜[ÙNÛÝ\”[ŒMÌ‹œ[Y˜[ÙNÛÝ\”[ŒMÌ‹™Ù[šÚO[Ý\”[ŒMÌ‹˜›ÛX[[ÛÝ\”[ŒMÌ‹œ™\ÝLÛÝ\”[ŒMÌ‹˜Ú[™[XOKLNÛÝ\”[ŒMÌ‹˜Ú[™[XUÚÙ[ŠÊÎÚYŠØZLMÊ
J^ØÛÛœÝÏ[Ý\”Ý]LMÌŠ
NÚYŠË™XY
^Þ›Û™OSÕT—Ö“Ó‘TÌMÌ–ÛËœXÙWNÜ^Y\‹žXÛ[\
^Y\‹žLKËœXÙOOOLÌLÎŒMÍJNÜ^Y\‹žOXÛ[\
^Y\‹žKËœXÙOOOLÌNLLÍJNÚYŠËœXÙOOOL‰‰ˆ\Û˜ZÙR[œÚYLMÌŠ^Y\‹ž^Y\‹žJJ^Ü^Y\‹žLŒÌÜ^Y\‹žO\Û˜ZÙVLMÌŠŒÌ
Nß\^Y\‹š\ØZRMÊ
NßY[ÙHYŠÝ\’\™LMÌŠ
J\ØZU˜]™[MÊYJNß\™]\›ˆYNßB˜ÛÛœÝÛÛY™Y›Ü™LMÌZ\ÔÛÛYÚ\ÔÛÛYY[˜Ý[ÛŠK‹‹˜J^ÚYŠÝ\’\™LMÌŠ
J\™]\›ˆÝ\“X\MÌŠ
OOOLÈ\Û˜ZÙR[œÚYLMÌŠJN›Ý\›ØÚÙYMÌŠJNÜ™]\›ˆÛÛY™Y›Ü™LMÌŠK‹‹˜JNßNÂ˜ÛÛœÝØY™Y›Ü™LMÌ[ØYÛØYY[˜Ý[ÛŠ‹‹˜J^ØÛÛœÝÝ][ØY™Y›Ü™LMÌŠ‹‹˜JNÛÝ\”™\ÝÜ™LMÌŠ
NÜ™]\›ˆÝ]ßNØÛÛœÝÚÛÜÙP™Y›Ü™LMÌXÚÛÜÙT˜XÙNØÚÛÜÙT˜XÙOY[˜Ý[ÛŠ‹‹˜J^ØÛÛœÝÛ\˜XÙKÝ]XÚÛÜÙP™Y›Ü™LMÌŠ‹‹˜JNÚYŠÛOO\˜XÙJ[Ý\”™\ÝÜ™LMÌŠ
NÜ™]\›ˆÝ]ßNÂ˜ÛÛœÝ^P™Y›Ü™LMÌI
	ÈÜ^IÊK›Û˜ÛXÚÎÉ
	ÈÜ^IÊK›Û˜ÛXÚÏY[˜Ý[ÛŠ‹‹˜J^ØÛÛœÝÝ]\^P™Y›Ü™LMÌ‹˜\J\ËJNÚYŠØZLMÊ
J[Ý\”™\ÝÜ™LMÌŠ
NÜ™]\›ˆÝ]ßNÂ˜ÛÛœÝ™]ÜÐ™Y›Ü™LMÌ]\]SÙÌŒÎÝ\]SÙÌŒÏY[˜Ý[ÛŠ‹‹˜J^Û™]ÜÐ™Y›Ü™LMÌŠ‹‹˜JNÉ
	ÈÙX[ÙÙ^YXœ›ÝÉÊK^ÛÛ[IÓÓS’P“V–ˆÔ’QÒSS0­ÈKŽ	ÎØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	Ü	ÊNÜœÙ]]šX]J	Ù]K[›ËZLN‰Ë	ÉÊNÜ^ÛÛ[SM
	ÔØZ^X[ŽˆØ[YZ[YZHÛÛˆ™XÛÜ\È[\[ÜËÝ›È][™È[[Üš\ˆH˜\È˜Y]‹[›XKØ[Z[›ÈHHÙ\œY[KÛÜœ™\ˆH›Û\‹[™]HHØZ[Ë\Ø[XKÚ\ÝHHX˜›\ËØZ[ÚÙ[ˆˆÈÈLÈŒÜˆXY\Ý°ëXHHÙ[šÚY[XKˆØ[[™\š[È\ÙMÍŒNˆ[ˆpì[ÈØYLLZ[]ÜÈXÝ]›ÜËˆ°ìÞ[XHØYØH[™Y[K‰Ë	ÔØZ^X[ŽˆÛX[ˆØ[YZ[YZHœ˜[Y\ËÝ\ˆÛÜ›ÛˆX][™Y\ˆ˜Y]‹Y[[XKÛ˜ZÙHØ^K[›š[™È[™›YÚÚ[™ÈØZH[™]›ÚÙH[™X˜›\ËX\Ý\žKX˜\ÙYØZ[ÚÙ[ˆˆÈÈLÈŒ[™Ü\š]›ÛX‹ˆØ[[™\ˆÝ\ÍÍŒNˆÛ™HYX\ˆ\ŒLXÝ]™HZ[]\Ëˆ™^ØYØH[™[™Ë‰Ë	ÔØZ^X[ŽˆØ[YZ[YZH[\ËÝ]›È][™È[È[Üœ™\ˆH\0ìÜÈ˜Y]‹[›XKØ[Z[šÈHÙ\œ[KÛÜœšYHH›ÛË[™]HHØZ[ËXYHHX˜›\ËØZ[ÚÙ[ˆˆÈÈLÈŒÜˆXY\ÝšXHHÙ[šÚY[XKˆØ[[™0è\š[È\ÙMÍŒNˆ[H[›ÈÜŒLZ[]ÜÈ]]›ÜËˆ°ìÞ[XHØYØH[™[K‰Ë	ÔØZ^X[Žˆ[Z^ˆØ[YZ[YZHØ\™[\šK0í›0ïYH™H˜Y]ˆÛÛœ˜\ñ,H0åZÚH0ïžXKY[[XKq,[[ˆ[ÛKÛñgÝH™HpéÝqgËÜ˜[ØZHÙ^™YÙ[šK1gØZØH™HX˜›\Ë\Ý[1,ZÛHØZ[ÚÙ[ˆˆÈÈLÈŒ™HZ›ÛX˜\ñ,KˆZÝš[MÍŒx &Y[ˆ˜qgÛ\ŽŒLZÝYˆZÚZØHš\ˆq,[ˆÛÛœ˜ZÚH\Ý[ˆ™ZÛ[YYK‰ÊNÉ
	ÈÙX[ÙØ›ÙIÊKœ™\[™

NßNÜ™XYSÙÌŒÏY[˜Ý[ÛŠ
^ÚYŠÙÑš\œÝŒß\™XYJ\™]\›ŽÛÙÑš\œÝŒÏ]YNÚYŠØØ[ÝÜ˜YÙK™Ù]][J	ÛÛ[šK\ÙY[‹]\]IÊHOOIÌKŽ	Ê^Ý\]SÙÌŒÊ
NÛØØ[ÝÜ˜YÙKœÙ]][J	ÛÛ[šK\ÙY[‹]\]IË	ÌKŽ	ÊNß_NÂšYŠØØ][Û‹œÙX\˜Úš[˜ÛY\Ê	ÜXOLIÊJ]Ú[™ÝË—×ÝŒMÌ^Ù]˜[œÏO™]˜[
Ê_NÂ‚‹ËÈÜšYÚ[˜[KŽNˆ^XÝÜš]HX\ÚÜÈ[™H™\^XX›H™YK\\ÙHØZ^X[ˆØYØK‚›]˜Y]”™\X]MÌÏY˜[ÙNÂ˜ÛÛœÝÐQÐLMÌÏT‘QÒSÓ”Ë›[™ÝÐQÐWÓSQTÌMÌÏVÉÑ\Ùš[Y\›ÈØZ^XZš[‰Ë	ÔØZ^X[ˆØ[ž[Û‰Ë	Ñ\Ùš[YZ\›ÈØZ^XZš[‰Ë	ÔØZ^X[ˆØ[ž[ÛI×NÂ”‘QÒSÓ”Ëœ\Ú
Ë‹‹˜ÛX[ÛÛ™J‘QÒSÓ”ÖÔÐRWÖ“Ó‘TÌMÖÌ—WJKY‰ÜØZ^X[”ØYØLMÌÉË˜[YN”ÐQÐWÓSQTÌMÌÖÌKØYØLMÌÎYKÚYŒMŒZYÚŒLÜ]ÛœÎ–×_JNÂ˜ÛÛœÝØYØR\™LMÌÏJ
OOœØZLMÊ
I‰ž›Û™OOOTÐQÐLMÌÎÂ˜ÛÛœÝÐQÐWÑU‘S•ÌMÌÏVÉØ\œš]˜[	Ë	ÞX[XÚIË	Û˜\IË	ÜXØÛÛÉË	Ý™YÙ]IË	Ø\IË	ÝZ[	Ë	Ù[™[™É×NÂ›]ØYØT[ŒMÌÏ^ÙšYÚ\œÎ–×KÚÝÎ–×Kž–×KØ]™NŒ\ŒÚ[™[XN›[ÚÙ[ŽŒXÝ]™NŒNÂ™[˜Ý[ÛˆØYØTÝ]LMÌÊ\^Y\Š^ØÛÛœÝ\ØZTÝ]LMÊ
KÏ[‹œØYØLMÌßßK[OJ‹Z[‹X^
OO“[X™\‹š\Ñš[š]JŠOØÛ[\
‹Z[‹X^
N™ÓØš™XÝ˜\ÜÚYÛŠËÜ[Ž“X]™›ÛÜŠ[JËœ[‹YN
JK\ÙN“X]™›ÛÜŠ[JËœ\ÙKÊJK[›ØÚÙY“X]™›ÛÜŠ[JË[›ØÚÙYKKÊJKÛÛ\]NˆH\Ë˜ÛÛ\]KÛZ[\Î\œ˜^K™œ›ÛJÛ[™ÝŒßK
ËJOOˆH\Ë˜ÛZ[\ÏË–ÚWJKX[XÚNˆH\ËžX[XÚKXØÛÛÎˆH\ËœXØÛÛË›Ü›N“X]™›ÛÜŠ[JË™›Ü›KŠJK\U[YN›[JË˜\U[YKÍŒ
K[™[™Î\[ÙˆËœ[™[™ÏOOIÜÝš[™ÉÉ‰”ÐQÐWÑU‘S•ÌMÌËš[˜ÛY\ÊËœ[™[™ÊOÜËœ[™[™Î‰ÉË[™[“X]™›ÛÜŠ[JËœ[™[ŠJKØ]™Y\œ˜^Kš\Ð\œ˜^JËœØ]™Y
OÜËœØ]™YœÛXÙJŠN–×KÚ[œÎ“X]™›ÛÜŠ[JËÚ[œËYN
J_JNÛ‹œØYØLMÌÏ\ÎÜ™]\›ˆÎßB˜ÛÛœÝØYØP\MÌÏ^ßNÙ›ÜŠÛÛœÝÈÙˆÉÛX\	Ë	Ù[™[ZY\ÉË	Ø[Y\ÉË	ØÚ[™[XIË	ÜÜXÚX[	×J^ÜØYØP\MÌÖÚ×O[™]È[XYÙJ
NÜØYØP\MÌÖÚ×KœÜ˜ÏIÜØYØLMÌËÉÊÚÊÉËÙXœ	ÎßB›]ØYØQœ˜[Y\ÌMÌÏ^È™[™[ZY\ÈŽ–ÖÖÌ‹LLŽKNKÌŒK‹MKNL—KÍËËLÍËNLWKÍNL‹KM‹NKÍÎLËLŽKN—KÎMËLKMÍËN—KÌLMNËNN—KÌLÍŒË‹LŽKN×WKÖÌŒKÌÌËMÌŒ×KÌŒL‹ÌÌ‹MÌ‹ŒWKÍ‹ÌŽKMÍKŒL—KÍNMËÌÌËMÌKŒKÍÎÌÌËMÎŒWKÎMM‹ÍKŒÌKNM×KÌLMŒ‹Í‹NKŒKÌLÍÍ‹MM‹ŒWKÖÌŒËNL‹LÎKLÌWKÌŒM‹NL‹MLÌWKÍËNNKLÍËLKÍNM‹NM‹LÍLŽKÍÎNMËMLKL×KÎMLŒËŒLLŒKÌLMËŒLKŒKLL×KÌLÍŒŒKMKLŒ×WKÖÌM‹ÍŽKNËNL×KÌŒÍÌNNL—KÌÎLÍÍ‹MÎN—KÍMÎKÍÍ‹MÌËN—KÍÍMKÍŒ‹N‹ŒKÍÍMKÍŒ‹N‹ŒKÌLÍ‹ÍÌKNËNL—KÌLÍ‹ÍÌKNËNL—WWK˜[Y\ÈŽ–ÖÖÍKËL‹ML×KÌŒŒ‹‹LLËMMKÌÎM‹KLMMMWKÍNL‹LMKMM—KÎ‹LŒËMMKÎN‹ËMMËML×KÌLN‹LLÌMLKÌLÎKËLLKML×WKÖÎKM‹MKMÌ—KÌNKMËMŒMÌKÌÍËMËMMËMÌKÍMMKMŒËMMËMÍKÍÍÌMÍ‹NMMŒWKÎMÌNKŒ‹MM—KÌLMÍ‹NM‹ML×KÌLÍMÍ‹MËMŒWWKÖÌÎÍL‹LLMKÌŒLÍLMMKÌÎLÍLLŒ‹M—KÍNKÍKLMM×KÍÎËÍMËMMKLÎWKÎM‹ÍNKMÎKLÍ×KÌLMÍKÍŒKML‹LÍWKÌLÎ‹ÍL‹LM‹MWKÖÌŒËL‹LËM×KÌŒLKLËLKM—KÌÎML‹LŒËM×KÍN‹L‹LÌM×KÍÎKL‹MÍ‹M×KÎMÍ‹LMNMËMNWKÌLNLM‹MNKMM×KÌLÎKL‹LKM×WKÖÌKÍËLÌKMÌ—KÌŒËÍËLÍKMÌWKÌÎËÍ‹LÎMÌ—KÍMÍËÍ‹LÎKMÌ—KÍÍÌŽNKMŒKÎMNKŽLËNMËMMWKÌLMLKÌKNL‹M—KÌLÍÎŽ‹LÌKM—WKÖÌŒKMŽKMLWKÌŒKNMŽKML×KÌÎMNMŽKML×KÍNNN‹ML×KÍÍÎMLKMKÎMMËŽNKMKÌLMÎÌŒKM—KÌLÎŒMËML—WWKœÜXÚX[Ž–ÖÖÌKKŽLÌKÌÍÌKÌËŽM—KÍÌËLKŽNWKÌLËLŒÎKŽNWKÍKÌLËÌŽŽWKÌÍÌMÌMKŽKÍÌ‹ÌMKÍNŽKÌLLKÌMKÌKŽWKÖÍÌNNLÌLWKÍ‹NNKÌ—KÍÍKNLKNLËÌWKÌLLNL‹NMKÌ×KÌŒKLËŽMKLWKÌÍŽMËŽ‹NWKÍÌKMËŽMKM×KÌL‹L‹Ž‹LWW_KÜš]SX\ÚÜÌMÌÏ^È˜˜\ÙKLLŽˆ‘ÐRÑRÑÐQSÑSQÐQSQÐQSÝÑSÔPSÐQYÑYÐ™ÑZÐQYÔQYÝÑYQXÑQYQYÙÑZÐQ[PÑ[Ð™Ñ\STPP”Q]PQL]ÑLYÑLÐYÑL]ÑLQ^ÑL™ÑL”QLÐ”QLQLP]ÑLQ^”Q^ÔQ]PÔQ]PÙÑ\ÐÝÑ\PÙÑ\PÔQ]ÐQ]Ñ^™Ñ^P”QLQLQLÐ]ÑM]ÑMP]ÑMP]ÑMP]ÑMP]ÑMPYÑMÐYÑMÐTQNTQNPTQNPTQNPTQNPPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQSÑÐ]PQSÑÐYÓPPSÐPQSÑÐYÓPPSÐPQSÑÐ]PQSÑÐ]PQNPTQNTQMÐTQMÐTQMÐYÑMYÑMTQMYÑMPYÑM]ÑLQL™Ñ]ÑQ[‘Q[‘Q[‘Q[QQ[QQ[QQ[Q[Q[Q[Q[Q[QZÑQZÑQZÑQZ‘QZ‘QZQQZQQZQY‘QYQÑYÑYQQYQÑXÑÑX‘ÑUR]ÐQQÑTÑPQTQPQTQTQSÑTQSÑTQTTQTTQTPQTQPQTQÑTÑÑTÑÑTÑÑUÑTÑÑTÑÑTÑÑUÑTÑPQTH‹˜˜\ÙKLLHŽˆ’ÐQ]ÑRÒÐQQYÑSRPPQQTQTTPQYÑU]ÑTÑ]ÑUQUQUQUQ”QU”QUQQUÑYÑV‘ÑYQQZPÙÑ[ÔQ[Ñ\™Ñ]”QLQL]ÑLÐ]ÑLQ^”QPÐLÑLÐ™ÑM”QMQMQL”QLÙÑ]PÝÑ]PÝÑ]QQ\ÑÑ\Q\PÔQ]ÐQ^ÐQ^PÑL™ÑLP”QLÐQMPQM]ÑN]ÑN]ÑN]ÑNPYÑJÐYÑJÐYÑKÐTQPTQPPQÐPQÐPQ‘PQ‘PQ‘PQ‘PQ‘PQ‘PQ‘PQ^S]ÐTPPQ^SPTPQ^PTTQ]“PTPQ]“PTTQ]“PTTQ]“]ÐTPYÑ]“]ÐTPYÑ]“YÐT]ÑPYÑ]ÑKÐ]ÑKÐ]ÑJÐQN”QMÐ™ÑMPÐQL‘Q^Q^Q]ÑQ]‘Q]QQ]Q\ÑQ[QQ[‘Q[QQ[Q[Q[QZÑQZÑÑZ‘QZÑQZ‘QZ‘QZQQZÑY‘ÑY‘ÑY‘ÑY‘ÑY‘ÑYQÑXÑÑXQPQUPQTÑTQT‘YÑTYÑTYÑTYÑTYÑTYÑTTQTQTQT‘TQT‘PQTÑPQTÑÑUÑUÑUÑUPQTÑTQTˆ‹˜˜\ÙKLLˆŽˆ‘ÐSPQÑSÒPQQÑSÒÐQÑUPQTÑTQUTQUTQUTQUQYÑUYÑUQ]ÑUÙÑYPÔQZÑZÐ”Q[Q[Ð]Ñ\“]ÐQYÑLPTQLÐPQLÐPQLTQL”QLP”QLQLÐ]ÑLÐ]ÑLTQLÐTQLTQLPTQL]ÑP™Ð^PÐQ]ÐÐQ]ÔQ\ÔQ\ÐQ]Ñ]™Ñ^”Q^P”QLQLQL]ÑM]ÑM]ÑM]ÑMYÑMPYÑMPTQMÐTQMÐPQNPPQNPPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQKÐPQKÐPQ]“PPTPQ]“PPTPQ]“PPTPQS‘ÐYÓPPTPQS‘ÐY“TPSÐPQS‘ÐY“TPSÐPQ]“PPTPQ]“TPSÐTQNPTQJÐTQNPTQNPTQNPTQNPTQNYÑMÐ]ÑMQMPÑQQP^ÝÑ^PÝÑ^ÝÑ]ÐÝÑ]PÝÑ\ÐÝÑ[PÝÑ[PÝÑ[PÝÑ[PÝÑ[ÝÑZÐÝÑ[ÝÑZÐÝÑZÑQZ‘QZ‘QZ‘QZQQZQQZQY‘QYÑQY‘QY‘QY‘QYQXÑQX‘QURYÐQ‘ÑUÑT‘ÑTQPQTPQTPQTPQTPQTPQTÑT‘ÑTQÑT‘ÑUÑUÑUÑUÑUÑUÑTÑPQT‹˜˜\ÙKLLÈŽˆ‘TPSYÑSRYÐP‘YÑS’TPQQS’YÐQ]ÑUQU”QU™ÑTÑ™ÑTÑ™ÑU™ÑU™ÑUQQRÑÐUÝÑYÐÐQ[Ñ[™Ñ\”Q\P]Ñ]]Ñ^QLÑLÔQ^ÙÑ]ÔQ^ÔQLÑLÐÑLÐ™ÑLÐ”QLQL]ÑLQL”QPÙÐ^ÙÑ^ÙÑ]ÐÝÑ\ÐÙÑ]PÙÑ]ÐQ^PÑL™ÑLP”QMQMPQM]ÑMÐ]ÑN]ÑNYÑNPYÑJÐTQKÐPQPQPQÐPQ‘PQ‘PPQ‘PPQ‘PQ‘PQ‘PQ‘PQTPPLPPQTPPZÓ”PTPQTTPZS”PTPQTTPZS™ÐTPPQTQYÐYÓ™ÐTPPQT‘]ÐY“™ÐTPTQTQ]ÐY“™ÐTPYÑTQ]ÐYÓ™ÐTPYÑ^”PT]Ñ^”PTQQÐQQP”QKÐ™ÑNP™ÑNPÑNÔQMQQLQÑ^QÑ^QÑ^Ñ]ÑÑ]‘Ñ]QÑ]Ñ[QPQ[PQZÑPQZÑPQZÑPQZÑTQZQTQZQTQZQTQZTQYÑTQYÑTQY‘TQY‘TQY‘TQY‘YÑYQYÑYYÑXÑYÑXQYÑVQ]ÑUQQTÑQT‘”QTQ™ÑT™ÑT™ÑT™ÑT™ÑT™ÑT”QT‘”QT‘QTÑQUQU]ÑUQ]ÑUQ]ÑUQYÑU‘]ÑUQQTÑ”QTH‹˜˜\ÙKLMŽˆ‘YÐSÐQ‘TQS’ÐQQYÑTÑYÑU]ÑTÑ]ÑUQTÑQTÑQU”QTÑ”QUQXÙÑYÐQZP™Ñ[™Ñ[”Q\]Ñ\YÑ]TPPYÑL]ÑLÑ^PÔQ]ÐQ]Ñ^ÔPPÐ™ÑLÐ”QM”QLÐQL]ÑL]ÑLP]ÑLQPÐ^ÔQ]ÐÔQ]ÙÑ]ÝÑ\ÙÑ]ÔQ]ÐQ]ÐÑ^P™ÑL™ÑLP™ÑL”QLÐQMPQMPQMPQMPQMP]ÑMÐ]ÑMÐYÑNTQJÐTQJÐTQJÐPQKÐPQKÐPQKÐPQKÐPQKÐPQKÐPQKÐPQKÐPQSÑPP]PQSÑPP]PQSÑPP]PQSÑPP]PQSÑPP]PQSÑÐ]ÐPQSÑÐ]PQJÐPQJÐPQJÐPQJÐTQNPTQNTQMÐYÑMPYÑMYÑLYÑ^P]Ñ^Q]Ð”Q]Ñ]Q[‘Q[‘Q[‘Ñ[QQ[‘Ñ[QÑ[Ñ[Ñ[Ñ[Ñ[ÑZÑÑZÑPQZ‘TQZQYÑZ]ÑY‘]ÑY‘]ÑY‘]ÑY‘QYQ”QY™ÑX‘ÑXRÑTÒÑTÒÑTRÑTÑSÒÑSÒÑSÒÑSÒÑTRÑTRÑTRQTÒQTÒQUQUQUQUQUÑT’ÑTH‹˜˜\ÙKLMHŽˆ‘ÙÐP’ÐQPQSÐQPQSÒÐQTQSÒPPQYÑU]ÑT‘]ÑUQT‘”QT‘QU”QTÑ”QUQR”PUÝÑYÔQZPÑ[™Ñ[”Q\Q\“PPP]Ñ]YÑLYÑLÐYÑLÐQ]ÐQ]PÑLP™ÑLÐ”QMQM]ÑLÐ]ÑLYÑL]ÑLPQPÐP]ÐÐQ]ÐÔQ]PÝÑ\ÝÑ\PÔQ]PÐQ]ÐÑ^™Ñ^”QLP”QLQLÐ]ÑMP]ÑM]ÑM]ÑM]ÑM]ÑMYÑNTQNPTQNPPQKÐTQJÐTQJÐPQKÐPQKÐPQKÐPQPPQPPQPPQPPQ]ÓTPTPQS‘ÐZTPTPQS‘ÐZTPTPQS‘PPY“YÐSÐPQS‘PPY“YÐSÐPQS‘PPY“YÐSÐPQS‘ÐZYÐSÐPQSÑÐZ]ÐSPQSÑÐZYÐSÐPQ^YÐSÐPQPPQPPQKÐPQKÐTQJÐTQSQÐ^YÑRÑP^PQRP^P™ÑPÑP^QQ^Q]‘Q[PRQ[“”PQQQ[QQ[QQ[QQ[QQ[QQ[QQ[Q[QZÑÑZ‘QZÑÑZ‘QZ‘QZ‘QZQÑYÑÑY‘ÑY‘ÑY‘ÑY‘ÑYÑXÑÑX‘PQV‘PQTÑPQTÑTQTQTQTQTQTQTQTQTQTQYÑTTQTQTQT‘TQT‘TQT‘PQTÑPQTÑPQUPQUPQUPQUPQTÑTQTˆ‹˜˜\ÙKLMˆŽˆ‘PPSPQQPQS’ÐQPQUTQUYÑTÑYÑU]ÑU]ÑUQUQUQUÝÑRQPUPÐQYÐÑZ™ÑZQ[]Ñ\YÑ\TQ]YÑ]PPP”Q^Ñ]ÐÐQ]ÐQ]PÑ]PÑ]Ð”QLP”QLÐQLÐYÑLÐYÑL]ÑL™Ñ^ÐQ]ÐÑ^ÐQ]ÙÑ\ÐÙÑ\ÔQ]ÐQ]Ñ^Ñ^”QL”QLQLQLÐ]ÑM]ÑMQLÐ]ÑMP]ÑMYÑMYÑMÐTQNTQNPTQNPPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQS‘Ð]ÐPQS‘ÐZSTPSPQS‘ÐZTPSPQS‘ÐYÓTPSPQS‘ÐYÓTPSPQS‘ÐYÓTPSPQS‘ÐYÓTPSPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQNPPQNPPQNPTQMÐYÑMP]ÑLÐQLP”Q^ÔQP‘P[QQ[QQ[QQ[Q[Q[ÑZÑÑZÑÑZÑÑZÑÑZQÑZPQZPQYÑTQY‘YÑY‘]ÑY]ÑY]ÑXÑ]ÑYQX‘”QXQ™ÑV‘ÑVQÙÑU‘ÝÑUQT’QT’QTQTRQSÒQTQTQTQTÝÑT‘ÝÑT‘ÝÑT‘ÙÑUÙÑUÙÑUÔQUQÙÑUÙÑUÙÑTÑÝÑTH‹˜˜\ÙKLMÈŽˆ‘PPRÒPQÑS’PQQPQS’ÐQQTQT‘TQTÑYÑT‘YÑTÑ]ÑT‘]ÑTÑ]ÑTÑ]ÑUÑQ‘PTÐÙÑXÐÑZ™ÑZÐ”Q[PQ[Ð]Ñ\PTQ]ÐTQ^PTQLYÑL”Q^PÑ]P™Ñ]”QLPQLÐ]ÑMYÑMYÑLTQLTQLPYÑ^Ñ]Ñ]ÐQ]ÙÑ\PÝÑ\PÑ]™Ñ]Ð”Q^P”Q^QLP]ÑL]ÑLÐYÑMPYÑMPYÑMPYÑMPYÑMYÑMTQNTQNPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQ]“PPSÐPQS‘ÐZPPSÐPQS‘ÐYÓPPSÐPQS‘ÐY“PPSÐPQSQÐY“ÐTPQSQÐ]PQS‘Ð]PQS‘Ð]PQNPPQNPPQNPQNPQNPQMÐTQMTQMPYÑLQ^ÔQP‘P\PÝÑ[PÝÑ[PÝÑ[PÝÑ[PÝÑ[PÝÑ[PÝÑ[PÝÑ[PÝÑ[PÝÑ[PÝÑ[ÝÑ[ÝÑ[QZÑQZÑQZ‘QZ‘QZQQZQYÑQYÑQY‘QYQQYQQYQQYQXÑÑV‘ÑUÑUÑTÑPQTQPQTQPQTPQTPQTPQTQPQTQPQTQÑT‘ÑTÑÑTÑÑUQUQQUQQUQÑUÑUÑTˆ‹˜˜\ÙKLKLŽˆ’ÐP’YÐSRÑT’QT’QTRQTQÝÑT‘ÝÑTQÝÑTQÙÑT‘ÙÑT‘ÙÑXÑÔQY‘ÐQZ‘™Ñ[QQ[Ñ]Ñ\QYÑ\QTQ[ÑQPÑPP[ÑQ\ÐÑLÑLPÐQLPÙÑ^ÔQLÑL”QLÐQL]ÑLP]Ñ^”Q]ÐÑ]ÔQ]PÙÑ]PÔQ]PÐQ]PÔQ\ÝÑ[ÝÑ[PÝÑ[ÐÙÑ\ÔQ]Ñ^™Ñ^”QLQLQLÐ]ÑMP]ÑMP]ÑMP]ÑMPYÑM]ÑMPYÑMTQMÐTQNPQNPPQNPPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐTQNPYÑN]ÑMÐQM™ÑMQ^Q^QQ^QQ^QQ^QQ^QQ^QQ^QQ^QQ[YÐSQ[]ÐR‘QZÓPRQZÑQZÑQZ‘QZ‘QZQQZQQZQZQYÑQYÑQY‘QY‘QY‘QY‘ÑYÑYÑXÑÑX‘ÑV‘ÑVPQU‘TQUTQUYÑT‘]ÑTQ]ÑTQ]ÑTQQTQTQTQQTQQTQQTQ]ÑTÑQT‘QTQQTQQT‘]ÑT‘QT”QSˆ‹˜˜\ÙKLKLHŽˆ’TXÒ‘ÝÑPÒPPSÙÑTÑÔQTÑÐQTÑÐQT‘ÐQT‘ÐQTQÑT‘™ÑTÑ™ÑTÑ™ÑT’ÝÐR™ÑT’ÔPSQ”QZQQ[]Ñ[‘YÑ\TQ\PQ[ÝÑ\ÙÑ\Ñ]™Ñ^”Q^P™Ñ^PÑ^P”QLPQLÐ]ÑMPYÑMPTQLYÑ^”Q]P™Ñ]Ñ]Ñ]™Ñ]Ð™Ñ]Ñ\ÔQ\Q[ÙÑ\ÐQ\ÐÑ]PÑ]™Ñ^”Q^QLPQL]ÑLÐ]ÑLÐ]ÑLÐ]ÑM]ÑMYÑMP]ÑMPYÑMYÑMTQNTQNPQNPPQNPPQNPPQNPPQNPPQNPPQNPPQNPPQNPPQNPPQNPPQNPPQNPPQNPQNPQMÐPQNPQMÐPQMPQMPPQMPQLÐPQLTQ^YÑ]ÐYÑ]Ð]Ñ]Q]P™Ñ\ÐÙÑ[ÑQ[QQ[QQ[QQ[QQ[QQ[QQZÑQ[QZÑQZÑÑZ‘ÑZ‘ÑZ‘ÑZ‘ÑZ‘ÑZQPQZTQY‘YÑYYÑYQYÑYYÑXÑYÑXÑYÑX‘]ÑXQQVQQVQ”QVÑQ’PTQTRQTRQT‘ÝÑTÑÝÑTÑÝÑTÑÝÑTÑÝÑTÑÝÑTÒQT’ÑSˆ‹˜˜\ÙKLKLˆŽˆ’YÐS’PQSÒÑTQTQSÒQTQTÝÑTQÙÑT“ÐP‘ÝÑTÝÐRÑÙÑYQÙÑYÑÔQZ‘™Ñ[‘”Q[ÑQ[ÑYÑ[QTQ[ÑP‘PP[ÝÑ\ÐQ]PÑ^™ÑLÑLÔQ^PÑLQM]ÑMÐYÑNYÑLÐYÑLP]Ñ^P™Ñ]PÐQ]ÔQ]ÐQ]ÐQ]PÐQ\ÔQ\ÝÑ[‘Q[ÙÑ\ÔQ]PÐQ]Ð™Ñ^”QLP”QLQLÐ]ÑMP]ÑMYÑMÐYÑMÐYÑMÐYÑMÐYÑNYÑNPTQKÐPQPPQPPQPQPQPQPQÐPQÐPQÐPQ^YÐTPPQSÑÐ^PQ^YÐTPPQ^YÐTPPQTPPYÓYÐTPPQÐPQÐTQPPQTQKÐTQKÐYÑNPYÑNPYÑN]ÑMÐQMP™ÑLÐQ^QQ]Q[‘Q[‘Q[‘Q[QQ[QQ[Q[QQ[QQ[QQ[Q[QQ[QZÑQZÑQZÑQZÑQZ‘QZ‘QZQQZQZÑYÑÑYÑÑYÑÑYÑÑY‘PQYPQYTQX‘YÑV‘YÑVQYÑVYÑTQYÑTQTQT‘TQT‘TQT‘TQT‘TQT‘TQT‘TQT‘TQTQYÑSˆ‹˜˜\ÙKLKLÈŽˆ’PRRYÑRÒPQSPQRÒÑSÑSÑSQSRQSQÝÑSÓPRÝÑY‘ÝÑZÝÑZ‘ÙÑZÑÐQ[ÑZÑ”QZÑQZÑ]ÑZÑYÑZÑTQZ“”PPÑPQ\Q]ÐQLÑLÐQLÔQLÐQLÐ™ÑMPQM]ÑM]ÑL]Ñ^Q^PÑ^ÔQ]ÐÙÑ]ÙÑ]PÔQ\ÔQ\PÙÑ\Q[QÑ[QQ\PÝÑ\ÐÙÑ]ÔQ^ÐQ^ÑLP™ÑLÐ”QMQMQMQMQMÐQMÐQMÐ]ÑNYÑJÐTQKÐTQKÐPQPPQPQPQPQPQPQÐPQÐPQÐPQÐPQ^YÐTPPQTQTPYÓYÐTPPQTQTPYÓYÐTPPQÐPQ^S]ÐTPQÐPQ^“PSÐPQ^“”PSPQL”PSTQTQYÑP]ÑKÐQJÐ”QNP™ÑNÐQM‘Ñ^‘Ñ^QÑ^QÑ[“™ÐR‘Ñ[‘Ñ[‘Ñ[‘Ñ[‘Ñ[‘Ñ[‘Ñ[‘Ñ[‘Ñ[QÑ[Ñ[ÑZÑÑZÑÑZÑÑZÑÑZÑPQZQPQZQPQZTQYÑYÑYQYÑYQ]ÑXÑ]ÑXÑQXQQV‘QVQTQ]ÑTÑ]ÑTÑ]ÑTÑ]ÑTÑ]ÑT‘]ÑT‘QSÑ”QSˆ‹˜˜\ÙKLKMŽˆ‘PSPPQQT‘”QTQ™ÑTQ™ÑTQÑTQÑTQÑTQÐQTQÐQTQ”QU]ÑUÑYÑVQPQXÑÑYÑQZÐÙÑ[PÔQ[Ð™Ñ]”Q^”QL”QL™Ñ^P”Q^PQLPQLÐYÑMÐYÑMÐYÑM]ÑL”Q^ÐQ]PÔQ]ÐQ]Ñ]ÐÑ]ÐÐQ]Q[ÑQ[ÐÝÑ\PÔQ]ÐQ]PÑ^™Ñ^”QLPQLÐQM]ÑMP]ÑMP]ÑMP]ÑMP]ÑMP]ÑM]ÑMÐYÑNYÑNYÑNTQJÐTQJÐTQJÐTQJÐPQKÐPQKÐPQKÐPQKÐPQKÐPQKÐPQKÐPQKÐPQKÐPQJÐPQJÐPQNPPQNPPQNPPQNPQMÐPQMPQMPPQLÐPQLPQLPQ^TQ^PTQ^PYÑ]Ð]ÑRQP[Q[Q[Q[QZÑQZÑQZ‘QZ‘QZQÑYÑÑYÑÑYÑÑY‘ÑY‘ÑY‘ÑY‘ÑY‘ÑYQÑYÑXÑÑXQÑVQÑU‘PQUTQT‘TQT‘YÑT]ÑSÑ]ÑSÑ]ÑSÑ]ÑSÑ]ÑTYÑTQYÑTQYÑTQTQT‘TQTÑTQTÑTQTÑTQTÑTQTÑYÑTQYÑT‹˜˜\ÙKLKMHŽˆ’™ØÐ’TQRRÑSÑSQSQÝÑS‘ÝÑS‘ÝÑS‘ÙÑSÑÙÑSÑÔQTÔQTÙÐSQÙÑSÒÔPTQÔQZQÔQZ‘Ñ[Q”Q[‘Q[‘]Ñ[YÑ[ÑP‘TP[Q[ÙÑP‘P\PÐQ]ÐÑ^ÐQ^ÔQ^ÐQLÑLÐ”QMP]ÑMÐ]ÑL]ÑLP]Ñ^”Q]ÐÐQ]ÔQ]ÙÑ]PÔQ]PÐQ\ÔQ\QQ[QÑ[QQ\ÝÑ\ÐÙÑ]PÐQ^Ñ^P™ÑLP”QLQM]ÑM]ÑM]ÑM]ÑM]ÑM]ÑMÐ]ÑMÐYÑNTQJÐTQJÐTQJÐPQPPQPPQPPQPPQPPQPQPQPQPQPQ]ÓTPTPTQPTQPYÑKÐYÑKÐ]ÑJÐQNP”QNÑMÐQMPÙÑPÑPLQLQLQLQLQLQ^‘Q^‘Q[SPSQ[S”PRQQ[Q[Q[Q[QZÑÑZ‘ÑZ‘ÑZ‘ÑZQÑZQÑZÑZÑZÑYÑÑY‘ÑYQPQYPQYPQYPQXÑTQXQTQV‘YÑV]ÑU‘]ÑT‘QTQTQQTQ”QTQT‘QT‘QT‘QT‘]ÑTÑ]ÑTÑ]ÑT‘QTQ”QSÈ‹˜˜\ÙKLKMˆŽˆ’YÐSÑP’TPSRÑSÒQSÒQTÝÑTÝÑTÝÑTÙÑTQÙÑTQÙÑYÔQYÑÐQZ‘™Ñ[Q”Q[ÑQ\YÑ\QYÑ[‘Q\‘Q\PÝÑ\ÐÑ^PÑ^ÐQ^ÝÑ^ÔQ^™ÑM™ÑM]ÑMÐYÑMÐ]ÑL”Q^PÑ]ÐÔQ]ÙÑ]PÔQ]ÔQ]PÔQ\ÐÙÑ\QQ[ÐÝÑ\ÙÑ]PÔQ]ÐÐQ^PÑL™ÑLP”QLÐQMQMP]ÑM]ÑM]ÑM]ÑM]ÑMYÑNYÑNTQJÐTQJÐPQPPQPPQPPQPQPQPQPQPQPQPQPQ]ÓTPTPPQ]ÓYÐTPQ^YÐTTQ]ÓYÐTYÑKÐ]Ñ]“]ÐSÐQ]S]ÐSÐ”Q]SPS™ÑMÐÔQMQLQLQQLQQLQQLQLQLQLQ^‘Q^QQ[“”PR‘Q[“ÐPPÑQ[QQ[QQ[QQ[QÑ[Ñ[Ñ[Ñ[ÑZÑÑZÑÑZ‘ÑZ‘ÑZ‘ÑZQPQZPQZTQY‘YÑYYÑY]ÑX‘QXQQV‘QVQQVQQVQQVQV”QUÑ”QUÑ™ÑU‘ÑUQÐQUQÙÑTÑÝÑT‘ÝÑT‘ÝÑTRQSÒQSH‹˜˜\ÙKLKMÈŽˆ’TPR’ÑRÒÑSQSQSQÝÑS‘ÝÑS‘ÙÑSÑÙÑSÑÔQTPRÑÔQTRÙÐTÔQZQÐQZÑ™Ñ[”Q[QQZÑ]ÑZÑYÑZÑTQ[Q\ÝÑ\Ñ^™Ñ^™ÑLÑ^ÐQLÑL”QMPQMPYÑLÐYÑLPYÑL”Q]Ð™Ñ]ÐÐQ]ÔQ]PÐQ]PÐQ]ÐQ\ÔQ\PÙÑ\Q[ÙÑ\PÔQ\ÐÐQ]PÑ]Ð™Ñ^P”QL”QLQL]ÑMQLÐQLÐ]ÑM]ÑMP]ÑMPYÑMYÑMÐTQNTQNPPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQJÐPQNPPQNPPQNPQNPQMÐPQMÐPQMPQMPPQMPQLÐPQ^PQ^PQ^PQ^TQ^PYÑ^]Ñ]Ð™ÑQP[‘Q[QQ[QQ[Q[Q[ÑZÑÑZ‘ÑZÑÑZÑÑZ‘ÑZQÑZQPQZTQYÑTQYÑYÑY‘YÑYQ]ÑY]ÑXÑ]ÑXÑQXQ”QVQ™ÑVÑU’QTRQTRQTRQTRQTRQTQÝÑT‘ÝÑTÑÝÑTÑÝÑTÑÝÑT’QTRQSÒÑSH‹˜˜\ÙKL‹LŽˆ“YÐQÐPSÓTQQS™ÐTSPQQPT“PQUÑUÑUÑUQXÓQYSQZSQZÒÔQ\ÐQ\R™Ñ\ÒQ\’]Ñ\RYÑ\TQ[ÒPQ[Ñ™Ñ^”QL”QL™ÑLÑL™ÑL‘YÑMÑTQNTQMÑYÑL‘]Ñ^‘”Q^Q™Ñ^”Q^QQ^Q]Ñ]”]ÐPÑQ\Ñ”Q\‘Ñ\ÐQ[ÑÔQ[QÙÑZÑÔQZÑÔQZ‘ÐQZ‘ÐQZQÑZ‘ÑZQ™ÑZQ”QZ”QZ”QZQQZÑ]Ñ[YÑ[QTQ[ÑPQ\PQ\Ñ\QÑ\‘Ñ\ÑÑ\ÑQ]Q]Q]QQ]ÝÑ^PÝÑMÐÝÑNÙÑJÐÙÑKÐÙÑPÙÑPÙÑPÙÑPÙÑPÙÑPÙÑPÙÑKÐÙÑKÐÙÑ]“ÙÐP”PSPÔQ]ÔPRÐÔQ]ÔÐQÐÔQ^TPQÔQ^ÔQ^ÔQ^PÔQ^PÙÑ^PÝÑ]ÑQ]ÑÑ]‘PQ]”Q[Ñ”Q[Ñ”Q[ÑQ\Q\]Ñ\‘YÑ]TQ]QÑ^Ñ^QQLQLPÝÑLÙÑMÔQMPÔQMPÐQMÐÐQYÒÔPXPÐQY’ÔPXPÐQYÙÐXPÐQYÙÐXPÐQXÒÝÐVÐQX’ÝÐXPÑX’ÝÐXP™ÑV’ÝÐXPQXSPV]ÑX“PVPYÑX“PVTQXSPUÐPQXSÐUÐPQV“ÐUPQUÓPPUPPQUTPUPQUSYÐUPPQUS”PUPQUS™ÐUÐTQU™ÐXYÑUÐX]ÑUÐX”QTÓÐX™ÑTÓÐXÑTÓÐXÐQT“ÐXÔQTSÐXÔQTSÐVÙÑSÓÐVPÝÑSÐVÐQUˆ‹˜˜\ÙKL‹LHŽˆ“™ÐQSÝÐTS™ÑQÙÐT“”QU“QUS]ÑUSYÑUSYÑUTQYTQY“TQZSTQZÓÑ\Q\’ÙÑ]ÔQ\’ÐQ\’Ñ\R™Ñ\”Q\ÙÑ^ÔQ^‘ÔQLÙÑLQ^QÔQLÑ”QNQNQQNQ”QLQ™ÑLÐQ^‘ÔQ^QÙÑ^ÔQ\ÔÐQÐQ\‘ÐQ\‘ÔQ\’Q[’Ñ[RÑ[TQZPQZRÑZRÑZRÑZQZQZQYÝÑY‘ÙÑYÑÔQZQÐQZÑÑ[™Ñ[‘”Q\Q\Q]Ñ\‘YÑ\ÑYÑ\ÑYÑ\ÑYÑ\ÑTQ]TQ]QPQ]ÑPQ^PQ^QÑLQÑL‘ÑMÑQÑ‘ÑÑÑ‘Ñ‘QÑ‘ÑÑ‘‘Q’Q’Q’Q’QQ’Q‘ÑQ^PPTÑQ^TYÐTÑ^PSQÑ^™ÐR‘PQ]ÔÐPQÑYÑ]‘QPÑÔP[ÑÐQ\QÑ\‘Ñ\‘™Ñ]”Q]‘”Q]ÑQ^Q^QQ^QYÑLQTQL‘PQMÑM‘QNQNPÝÑZPXÐÝÑYÓÐXÙÑZÐXPÔQZPPXPÔQYÓPPXPÐQYÓPPXPÐQYÓTPXPÔQYSTPXPÐQYSTPXPÐQYTPXPÐQXÓYÐV™ÑXÓYÐVQXÓYÐV]ÑXÓ]ÐVPYÑXÓ]ÐVPTQXÓPVPQX“PUÐPQXS”PUPQV“™ÐUPPQUÐUPQTÓÐPTÐPQTÓÙÐTPPQTÓÝÐTPQTÓÝÐTÐPQTÓÝÐUTQTÓÝÐUYÑT“ÝÐUÐ]ÑT“ÝÐX”QT“ÙÐY”QTÓÙÐY™ÑTÓÙÐYÑT“ÙÐYÑT“ÝÐXÐÐQTÝÐXÐÔQS”PXPÙÑSPVH‹˜˜\ÙKL‹LˆŽˆ”PPQPTTÑU”ÑU”QUTQUTQUÝÑUÝÑYÙÑZÙÑZÓÐQ[Ó”Q\ÓQ]YÑ]STQ\“PQ\SÑ\SÑ[Ò™Ñ]’]Ñ^RYÑ^’YÑLR]ÑLR]ÑLRTQMRÑNQNRQMUÔPP’ÑLRTQ^RTQ^RYÑ^YÑ^TQ^RPQ]’PQ\ÒTQ\’]Ñ\”Q[’™Ñ[R™Ñ[™ÑZÒ™ÑZ’”QZ’QZ’]ÑZ’]ÑZRYÑZTQYÒÑZ’ÑZÒQ[RQ[‘ÝÑ\ÙÑ\QÔQ\‘ÐQ\ÑÐQ\ÑÑ]QÑ]‘™Ñ^™Ñ^™Ñ^Q”Q^Q”Q^‘”QLQ”QL‘QMQQM‘QMÑQNQNQQ‘]Ñ‘‘]Ñ‘Ñ]Ñ’YÑ’‘YÑ’ÑYÑ’ÑYÑ’ÑTQ“TQ“YÑ^ÐU‘YÑ^ÔPTÑ]Ñ]ÔÙÐTQQ]”ÝÐT”Q]•PS‘™Ñ]UPSÐQ]ÐR‘ÔQ\ÕÐRÔQ]ÐQ]‘ÐQ]ÑÑ^Q™Ñ^‘™ÑL”QLQQLÑYÑM‘TQMÑPQNQÑNQÑZPPYQZTPXÑQZYÐXÐÝÑZYÐXÐÙÑZS]ÐXÙÑZPXÙÑYÓPXÐÙÑY“”PXÙÑY“”PXÙÑYS™ÐXÔQYS™ÐXÔQXÓÐXPÐQXÓÐXP™ÑYÐPVQYÐPV]ÑXÓÔPVPYÑXÓÙÐUÐTQXÓÙÐUÐPQX“ÙÐUÐPQU‘™ÐQSÝÐUÐPQUTPV•ÝÐQPPQUÐZPPQUÐZPPQUYÐYPQUPYTQTÔ”PXÐYÑT””PXÐ]ÑT””PXÐQTT”PX”QT””PXP™ÑTÔ”PV™ÑU”PVÑTÔ”PUÐQT””PUPÐQT”™ÐTÔQTÐSPÝÑSÐPRˆ‹˜˜\ÙKL‹LÈŽˆ“ÐPQPTÑQÝÐT“”QUÓ”QUSQUSQU]ÑUSYÑVTÝÐPÓYÑZYÑZ“PQ[“Ñ\SQ]ÝÑ]ÙÑ]ÐQ\ÒÑ\RÑ[ÒTQP’]Ð\‘ÝÑ^QÙÑ^‘ÙÑLQÝÑLRQLÑM‘™ÑN”QNQ™ÑN™ÑLÕÐPÑÑ^‘ÔQ^QÙÑ^ÝÑ^ÔQ^QÐQ]QÐQ\ÑÐQ]ÔQ\ÒQ[ÒÑ[’PQZÒPQZ’PQZRÑZRÑZRÑZQZQYÒQYRQYRQY‘ÝÑZÝÑZÙÑZ‘ÔQZÑÐQ[Ñ[‘Ñ[‘™Ñ[Ñ”Q\”Q\”Q\Q\QQ\QQ\Q]Ñ\QYÑ\‘YÑ\ÑTQ]QTQ]‘TQ]ÑTQ^QTQLÑPQM‘PQMÑPQNPQNQPQNQPQNQÑJÑÑJÑÑKÑÑKÑÑKÑÑJÑÑNQÑNÑMÑÑMQPQ^YÐQ‘TQ]ÑYÑ]Ñ”Q]ÐQ\‘ÐQ\ÑÐQ\ÑÑ]QÑ]‘™Ñ]Ñ”Q^]ÑLYÑLQTQL‘PQMÑM‘QMÑQNPÝÑZSÐXÙÑZ“ÐXPÙÑZSPPXPÝÑYÓTPVÝÑY“TPXPÙÑY“TPXPÔQY“YÐVÑZYÐXPQZ“]ÐVYÑZÓ]ÐVTQZ“]ÐVPQZ“PVPPQYÓPVPQY“”PUÐPQY™ÐUPQXÓ™ÐUÐPQX“ÐUPQUÐPUPQTÓÔPUÐPQT”PUTQTTÐUTQTTÐVPYÑTÐXPYÑTÐYYÑTÐXÐ]ÑTÐXÐ]ÑTTÐXÐ]ÑT”ÐXÐ]ÑT”ÐXQTTÐXP”QTÐV”QSÔPPUÐ™ÑSTTPUH‹˜˜\ÙKL‹MŽˆ“PQÙÐT]ÑUÓYÑUÓYÑUSTQUSPQUSPQUSÑX•PP“ÑZÑZÓÑ[“Q\ÝÑ\’ÔQ\ÒÑ]™Ñ\’”Q\RQ\]Ñ\Ñ\’Q]‘ÐQLQÑLÑÑMÐQMQÔQM”QMÑ]ÑMQYÑL‘YÑLQ]ÑLQ”Q^‘™Ñ^QÐQ]ÑÔQ]QÐQ\QÑ\QÑ\‘Ñ\‘ÐQ\QÙÑ[ÑÝÑ[ÝÑ[ÙÑ[ÔQ[ÔQZÑÐQZÑÑZÑ™ÑZÑ”QZQ”QZ‘”QZÑQ[Q]Ñ[‘YÑ\TQ\TQ\PQ\‘Ñ\ÑÑ]Ñ]QÑ]QQ]‘Q]QQ]QQ]ÑQ^ÝÑLÝÑLPÙÑLÐÙÑMÙÑMPÙÑNÙÑÙÑÐÙÑTQÝÐ^PÙÑTQÝÐ^ÝÑSÑÝÐLÙÑTÙÐLÙÑ‘ÐÔQ’ÔQ‘ÐÔQ‘ÐÐQ’ÐQ^TPTÐQ^TÐTÐQ^”PPSÔQ^TTPRÔQ^T]ÐQÐÙÑ^TPQPÝÑ^QQ^ÑRÐ[QÑ[‘Ñ[‘Ñ[Q™Ñ[Ñ™Ñ\”Q\‘Q]]Ñ]‘YÑ]ÑTQ^QPQ^‘ÑL‘QLÑQMÝÑMÝÑMÙÑNÙÑNÙÑYÒÝÐXÔQYÒÝÐXÐÑZPXQZ“PXPYÑZÓÐXPTQZÓÐVPPQZÓÐVPQZSPPVPPQYÓPPVPPQYSTPVPQX“TPVPQXSYÐVPQTÓ]ÐZÐTQT“PZÐTQTS”PZÐYÑTS™ÐZ]ÑSÓÐPZ]ÑTPYQTPXÐQTPXÐ”QTTPX”QT”PXP™ÑTTPV™ÑTTPVPÑTÐUÐQS”ÐUPÙÑRÔÐTÑQQÔÐS”PQRˆ‹˜˜\ÙKL‹MHŽˆ“™ÐQ”PT”QV”QUÓQUS]ÑU“]ÑUSYÑUSYÑYTQYÓTQZ“Ñ[SQ\RÝÑ\ÒÝÑ\ÒÔQ\’ÐQ\’Ñ\™Ñ[ÑÝÑ^QÙÑ^ÙÑ^‘ÝÑ^’Q^’Q^‘ÐQM™ÑMÑ”QN”QN™ÑLUÐPÑÐQ^QÔQ^QÝÑ]ÑÝÑ]ÑÙÑ^ÔQ\”ÐPP‘ÙÑ\QÝÑ\Q\Ñ[ÑZÒÑZÒÑZ’Q[ÝÑZÑÙÑ[ÙÑZÑÐQ[ÑZQÑZQÑZ‘ÑZÑ™Ñ[QQ[Ñ]Ñ\QYÑ\‘TQ\ÑPQ]PQ]Ñ]QÑ]ÑÑ^ÑLÑL‘QMQM”ÐPQÑQ‘Q‘QQ‘‘Q‘ÑQ’ÝÑ’PÝÑ’PÝÑ’PÝÑ’PÝÑ’PÝÑ’PÝÑ]“ÝÐVÝÑ]ÔPUPÝÑ]ÔYÐSÐÙÑ^T”PRÐÙÑ^TÐPQÐÙÑ^TÙÐPÐÔQLÙÑLÙÑLÙÑLÔQLÙÑLPÝÑLQLÑ^QPQ]Ñ]Ñ]”Q\‘”Q\‘”Q\ÑQ]QQ]‘]Ñ]ÑYÑ^QTQ^‘PQLÑL‘ÑLÑQMQQMÝÑY“PXPÝÑYSPXPÙÑYSPXPÔQYSÐVÔQYÐVÔQXÓÐVÔQX“ÐVÔQX“ÐVÐQX“ÐVÐQXSPPVPÐQVSPPVPÑVSPPVP™ÑVSTPV”QVSTPVQVSYÐU]ÑVYÐUYÑV]ÐUPTQVPUPQUS”PTÐPQU™ÐTPQTÓÐPTPQTÓÔPTÐPQUÔPUPPQUÙÐVPPQUÔPXPQUSÔPYTQUÔPYYÑUSÔPYP]ÑU“ÔPYP”QUSÔPYPÑUÔPYÐQT“ÔPXÐÔQT“ÙÐXPÙÑTÝÐVPÝÑSTPUH‹˜˜\ÙKL‹MˆŽˆ“ÝÐQTPPTSÙÑU“ÔQU“ÔQUÐQUSÐQUÑUS™ÑY™ÑYÓ”QZÓ]Ñ[“PQ\“Ñ]SQ]SQ]QQRÙÐ]]Ñ^RPQP’YÐ^RQL’QLQ^’Ñ^’ÑLÙÑMQÔQMÑÔQNÔQNQÙÑMÑÝÑ^QÝÑ^RQ^RQ^Q^QÝÑ^’Q]Q\’Ñ\RPQ[ÒYÑ[R]ÑZÒ]ÑZ’YÑZ’TQZ’PQZ’PQZRÑZRÑXÔPQRÑYÑYRÑYRQYÒQYÒQZQZRQZQÝÑZ‘ÝÑZÑÙÑ[ÙÑ[ÔQ[QÔQ[QÐQ[QÐQ[TÐRÑ]ÑÑ^Ñ^Q™ÑL™ÑL”QL‘”QL‘QLÑQLÑ]ÑM]ÑLÑYÑMTQMPQMQÑMQÑMÑ]TPPQÑÑ]QÑ]‘Ñ]ÑPQ]ÑPQ^TQ^YÑ]Ñ]Ñ]Ñ™Ñ]QÐQ]ÐQ]QÐQ]‘Ñ^Ñ^™Ñ^‘™Ñ^‘”QLQ”QLQ]ÑMYÑMQPQNÑNQÑKÑQZÐYQQZPPYÝÑZSYÐXÐÙÑZS]ÐXÔQZSPXPÔQZ”PXPÙÑY“”PXPÔQYÓ™ÐVÔQY“™ÐXPÔQYSÐVÔQYÐVÐQYÐVÐQXÓÐPVPÑXSÐPVPQYÔPV]ÑYÔPVYÑXÓÙÐUTQXÓÝÐUPQXÓÝÐUPQX”PU•ÙÐQPQUQ™ÐP”PZPPQUÐZPPQUYÐYPPQU]ÐYPQUPXÐPQUPXÐTQTÔPXÐYÑT”PX]ÑTÔ”PXP”QT””PV”QTÔ”PVP™ÑTÔ”PV™ÑTÔ”PUÑT””PTÐÐQTT™ÐTÔQSÔÐSÙÑSTÐPRˆ‹˜˜\ÙKL‹MÈŽˆ“ÔPQTÐT“ÔQU“ÑUÓÑUS™ÑUS™ÑU”QUS”QX“”QY“QZSYÑ[“Ñ\ÓÑ]Q]’ÙÑ\ÒÔQ\ÒÑQÒÐP\’Ñ^’Ñ^RQ^‘ÔQL‘ÐQMQÔQMQÙÑMQL’QL’ÑLRÑLRQ^‘ÔQ^‘ÐQLQÐQL‘ÐQLQÔQ]”ÙÐPÒQ\’Ñ\Ñ[’Ñ[’Ñ[RPQ[PQZÒÑZ’ÑZ’ÑZRQZRQZQZQYQYÝÑYQÝÑYQÝÑY‘ÙÑYÑÙÑYÑÔQZÔQZÔQZÔQZÔQZÔQZÔQZÔQZÔQZÔQZÐQZQÐQZQÑ[‘Ñ\Ñ™Ñ]Q™Ñ]‘™Ñ]Ñ™Ñ]Ñ™Ñ^™Ñ^™Ñ^”Q^Q”Q^”Q^”Q]ÑQ]ÑQ]‘Q]QQ]]Ñ\Ñ]Ñ\ÑQ\ÑQ\ÑQ\Ñ”Q\Ñ”Q\Ñ”Q\Ñ”Q\‘”Q\‘”Q\ÑQ]QQ]QQ]‘YÑ^QTQLPQLÑLÑÑMQMQQMÐÝÑNÙÑNPÙÑYÒÝÐYÔQZPXÐÔQYÓPXÔQY“ÐX”QPÐÐPYÓÐXYÑ[ÐXPTQ[ÐXPPQ[ÐXPPQZ“PPVPQZSPPVPQZTPVPPQY“YÐUÐPQX’PP“YÐUÐPQX“]ÐUPQV“]ÐUPQT“PUPPQTS™ÐUPQTSÔPTTQTÙÐTYÑTÙÐU]ÑS“ÝÐUP]ÑSÓÙÐVP]ÑTÙÐXÐQSÓÙÐXÐQTSÙÐYPQTSÙÐYP”QTÙÐYP™ÑSÓÙÐYPÑS“ÙÐYÐQSÙÐXÐÔQQPQ“ÝÐXH‹˜˜\ÙKLËLŽˆ‘™ÐRÒ™ÐP‘”QS’”PQ™ÑUÑUÐQUÔQUÔQUÙÑUYÑP‘PQ‘ÙÐUPQYQÑYÑQZPÝÑZÐÙÑ[PÔQ\Ñ\ÐÑ]ÐQ]QQ\‘Ñ^QPQ^TQ^TQ]ÑPQ]ÑÑ^‘ÑMÑM‘ÑMQÑMQMQL‘ÑQQP]QQ]QQ^Q^QQ^Q”QPÑÐP]ÔQ\ÔQ[ÑÔQ[‘ÔQ[‘ÙÑ[ÝÑZÒQZ’QZRÑZRÑZPQZYÑY’]ÑYR]ÑY’YÑZYÑZRYÑZ’YÑZÒYÑ[YÑ[RTQ[’TQ[ÒTQ\TQ\TQ\RTQ\RYÑ\TQ\’PQ]Ñ]RÑ]’Q]ÒQ^]ÑM‘YÑMÑTQNPQJÑÑKÑÑKÑÑKÑÑKÑÑQÑQÑQÑ‘PQQTQKÑYÑS’TP]‘]ÑRÒTP]‘”QRPP]’PQ]’PQ]RÑ]Ñ\ÒÑ\Q[ÒQ\RQ\ÝÑ\ÑÝÑ\ÑÙÑ]ÔQ]‘ÐQ]ÑÐQ^QÑLÑLQÑL‘™ÑM™ÑMQ”QMÑ”QX“TPY‘QX“YÐYQQXSYÐYQ]ÑXS]ÐYYÑX“PYYÑX“”PXÑTQX“ÐXQTQXSÐPV‘TQV“ÔPV‘TQV“ÙÐV‘TQVSÝÐV‘TQVPVYÑQQTPVÐVTQQÑPPVÐVPPQ[TPPVPPQ[”PUPQZÔ™ÐTÐPQZT™ÐTÐPQZ”PUPQYT”PUPQXÔ”PUTQXTPUYÑV”YÐUP]ÑVTTPUP”QUÔPPUÑUTÐUPÐQTÔÐUÝÑTÐTÑQS”ÐT‘ÑRÔPPSÑÑRTTPSH‹˜˜\ÙKLËLHŽˆ‘PS‘ÙÐQQQUQUÑTÑÑTÑÑTÑPQTÑPQTÐÔQRTPTÑXÐ”QYPQYÐYÑZÐYÑ[TQ[ÐPQ\PPQ\PQ]]Ñ^™Ñ^ÔQ^PÐQLÑLP™ÑLP”QL”Q^PQ^PQ^Q^]ÑL]ÑLÐQPÐÙÐ^ÙÑ^PÙÑ^ÙÑ]ÝÑQÐ[‘PQ[‘Ñ[ÑÑ[‘Ñ[QPQ[TQ[YÑ[YÑ[]Ñ[QZÑ™ÑZ‘ÐQZÝÑY‘ÝÑY‘ÝÑY‘ÝÑYÑÙÑZÙÑZÙÑZÔQZQÙÑZÔQZQÙÑZQÔQZ‘ÔQZ‘ÔQZÑÑ[Q”Q\Q\Q]Ñ\‘YÑ\ÑYÑ]YÑ]YÑ]YÑ]QYÑ]QYÑ]‘YÑ]‘]Ñ]Q]Ñ]‘Q]‘Q]‘”Q]‘™Ñ]‘”Q]ÑQ^Q^]Ñ^Q]Ñ^QYÑ^‘YÑ^‘YÑ^QYÑ^YÑ]ÑYÑ]QYÑ\‘YÑ\‘YÑ\‘TQ\ÑTQ\ÑPQ]QÑ]‘Ñ]‘Ñ]ÑÑ^QÑ^‘Ñ^‘ÑLÑLQÑVRÐXÑÑVRÐYÑVÐYÑVÐPYÑVRÔPXÑÑVRÙÐX‘ÑVÝÐXQÑVRÝÐXQÑUÓPV‘ÑUÓPV‘ÑU“PVQPQUÐVTQTÓÐVYÑTSPPVTQTSTPUÑTQTYÐUÑTQT]ÐU‘PQT”PUQÑTSÐPTÑQTÓÔPTÐÙÑU“ÔPTÐ™ÑXSÔPTÐ”QX“ÐPU]ÑYÐUP]ÑY™ÐU]ÑYPV]ÑY]ÐV]ÑYYÐVQX“YÐUÐ™ÑVSYÐUPÑUÓYÐTÓYÑTS]ÑSÈ‹˜˜\ÙKLËLˆŽˆ‘TPSRTPQTQTTPQQYÑUQQU”QTÑ™ÑTÑ™ÑU™ÑUÑXQQYÝÑYÙÑZÐQ[Ñ[ÐÑ\”Q\Ð”Q]”Q]P™ÑLÐÙÑLQ^Ñ]‘QLQQLÑQLÐÝÑLÐÝÑLÙÑLÙÑLPÙÑLÙÑQÑTP]ÙÑQPP^QPQ^‘PQ^‘PQ^‘TQQ”P\™Ñ[TPP‘”Q[Q”Q[‘”Q[Q™ÑZÑÑZQÑZQÐQZQÔQZQÙÑZQY’ÑYÑYRÑYÑYRÑY’ÑY’ÑY’ÑYÒQZQZQZQZQZQZQZÑYÒÑYÒQZQZQÙÑZÑÔQ[ÐQ[QÑ[‘Ñ[‘™Ñ[Ñ”Q\Ñ]ÑÑ^Q^‘QLPÝÑLÙÑMÙÑMPÙÑMÙÑMÐÙÑMÐÙÑUÐ[ÐÙÑTÒP\ÝÑMÑQM‘QS‘ÝÐ\‘ÑRÑÙÐ\ÑPQRQÙÐ\ÑÔQ\ÑÔQ\ÑÐQ]Ñ]QÑ]‘™Ñ]Ñ”Q^Q”Q^Q”QLQLÑQM]ÑM‘]ÑMÑ]ÑN]ÑX“ÐZ]ÑXSÐZYÑXSPPZQYÑV“TPZTQXSYÐYÑTQV“YÐYÑPQV“]ÐY‘PQV“PYQPQV“”PYQPQV“ÐXÑPQV“ÐPXÑPQVSÔPXÑPQVSÝÐX‘PQVPXÑTQUÔPXÑPQUÔÐX‘PQU”PPX‘PQU”TPXQÑU”ÐPUQUÔÐPUQU”ÔPTÐÙÑU”ÐPUQP™ÐVTÐPUYÑX”ÐPTÐTQXÔÐPTÐPQYTÐPTPPQYTÐTPPQYT™ÐTPQYTPTÐPQY]ÐUTQXÔPTYÑX”PTQVT]ÐT‘ÑPÑYÐR”PSÈ‹˜˜\ÙKLËLÈŽˆ‘TPSQPQT]ÐP‘TQTRYÐQYÑUQQU”QU”QU™ÑUÑXQQYÙÑYÐÔQZPÑ[P™Ñ[Ð”Q\PQ\ÐQ]”Q]ÐQPÙÐ\ÐPQÝÑ^Ñ]‘Ñ^QQLQLQQLPÝÑLPÙÑLPÙÑLÔQLÔQLÔQMÙÑPÑÐ^‘PQ^QPQ^QPQ^PQ]TQQ”P[QQ[ÑQ[‘Q[Q”QZÑ™ÑZ‘ÑZ‘ÐQZ‘ÔQZ‘ÙÑZ’QZQZPQYRPQYRÑY’ÑY’ÑY’ÑY’ÑYÒÑZRÑZÑZRÑZRÑZ’ÑZ’ÑZ’ÑZ’ÑZ’ÑZÒÑ[Ñ[Ñ[Ñ[Ñ[‘Ñ]Q™Ñ]‘”Q]ÑQ^Q^Q]Ñ^‘]Ñ^‘]ÑL]ÑL]ÑLQQL”Q^‘Ñ^Ñ^ÐQ]ÑÔQ]‘ÔQ]‘ÔQ]QÐQ]QÐQ]Ñ]™Ñ]‘”Q]Ñ”Q^Q^Q]Ñ^‘]Ñ^‘YÑLQYÑLÔÙÐP‘TQMÑTQNTQJÑPQXÓÐYÑPQX“PPZPQX“PPZPQXSTPZPQV“YÐYÑÑV“YÐZÑV“]ÐYÑÑV“PY‘ÑV“”PYQÑVS™ÐXÑÑV“ÐXÑÑVSÔPX‘ÑVSÙÐX‘ÑVSÝÐYÑVPYQÑUÔÐYQÑU”TPXÑÑUTTPYÑUTYÐXÑÑUPXQÑUÙÐUQQUÙÐUPÝÑUÝÐUÔQUTÝÐU”QVTÝÐUTQXÔÝÐTÐPQYÝÐTPQYÙÐTPQYÙÐTPPQYÐPTPQYÐTPQY™ÐTÐTQXÔ™ÐTÐYÑXT™ÐTÐ]ÑVT™ÐT”QU”ÐTÐQSˆ‹˜˜\ÙKLËMŽˆ‘PSÒPQQQU‘QU‘ÑUQPQUTQUTQUÑP‘YÐTÐÐQYÑYP™ÑYÐQZ]Ñ[TQ\PQ\PQ\ÐTQ\ÐQ\Ñ\TPRPÔQ^ÝÑ]PÙÑ^ÔQLPÐQLÑL™ÑLP™ÑL”QL”Q^”QL”QLÐ™ÑPÑP^QQ^QQ^QQ]ÑQ\‘TQ[‘TQ[ÑTQ[ÑTQ[‘YÑZÑ]ÑZÑQZÑ”QZ‘”QZ‘™ÑZ‘ÑZQÔQZQY’QZÝÑZ‘ÝÑZÑÝÑ[ÙÑ[QÙÑ[ÑÙÑ\ÙÑ\QÙÑ\‘ÙÑ\‘ÙÑ\ÑÙÑ\ÑÔQ]ÐQ]‘QQÑ™Ð^QNÝÑNPÙÑJÐÔQKÐÐQÐQÐQÐQÐQÐQÐQÐQÔQPÙÑPÝÑKÑQRÑÝÐ]ÑQRQÝÐ]ÑÝÑ^ÙÑ^ÙÑ^ÔQ^QÔQ^‘ÔQ^QÐQ^QÐQ^ÐQ]ÑÐQ]QÑ]Q™Ñ\Q™Ñ\Q”Q\‘”Q\Ñ”Q]]Ñ^]Ñ^Q]Ñ^‘YÑLQYÑL‘YÑLÑTQMQTQM‘TQM‘TQV’ÝÐZPQV“PYÑPQVSPY‘ÑV“ÐYQÑV“ÐYÑV“PPYÑVSTPYÑVSYÐY‘ÑV“PY‘ÑVS”PYÑÑVÐY‘ÑUÓÐPYQPQU“ÙÐXÑPQUSÝÐX‘PQU]ÐUÑUTPTÑÑUT]ÐUÝÑUT]ÐUÙÑU]ÐTÐ”QVT]ÐTYÑXTYÐTTQX”YÐTPPQXÔPPTPQXÔÐTPQXÔÐTÐPQXÔPTÐPQXÔPTÐTQX”PTYÑXTÐTQVÐSPÑUPPS‹˜˜\ÙKLËMHŽˆ‘]ÐSRYÐPÑ]ÑSÒYÐQQQU”QU™ÑTÑÑTÑÑUÐQTÑ”QPÑÐPTÑÑXÑÑYQYÐÙÑZÐÔQ[PÐQ[ÐÑ\P™Ñ\Ð™Ñ]Ñ]SÐPQÝÑ^Ñ]‘Ñ^QÑLQLQQLQQLPÝÑLPÝÑLÝÑ^ÝÑ^ÝÑLÝÑQQTP^QQP‘TP^‘TQ^‘TQ^QTQ]QYÑQ™Ð[Ñ™Ñ[Ñ™Ñ[‘™Ñ[Q™Ñ[Ñ[ÐQ[ÔQ[ÔQ[QÙÑ[RQ[QZÒPQZPQZRÑZÒÑ[Ñ[RÑ[’Ñ[ÒÑ\Ñ\Ñ\RÑ\RÑ\’Ñ\’Ñ\’Ñ\ÒÑ]Ñ]Ñ]RÑ]RÑ]’Q]ÒQ^ÝÑ^Q™ÑLÑ”QMQMQYÑMÑTQNTQNTQNTQNQTQNQTQNQTQNQYÑN]ÑNQMÑ”QM‘™ÑMÑLÑÐQLQÐQLÔQ^QÐQ^QÔQ]QÐQ]ÐQ\QÑ\‘™Ñ]”Q]‘”Q]‘Q^]Ñ^‘]ÑL]ÑLQ]ÑLQYÑLÑYÑMTQM‘TQMÑPQX“PY‘PQXSPY‘PQXSÐYQÑXSÐYÑXSPPYÑV“TPYQÑV“YÐY‘ÑV“]ÐZÑV“”PYÑÑV™ÐYÑÑVÐY‘ÑUÓÐPYQPQUSÙÐXÑÑUSÝÐX‘ÑUTÐP”PPP”]ÐUÑTÔPTÑQTTPTÐÝÑTÔPTÙÑTÔPTÔQUPTPÑU”]ÐTP]ÑXT]ÐTTQXÔ]ÐTPQYTPTPPQYPPTPQYPPTPQYPPTPPQXÔPPTTQX”ÐT]ÑVTPPSˆ‹˜˜\ÙKLËMˆŽˆ‘YÐSÒYÐQQ]ÑT]ÐQQQTPQQ”QU™ÑUÑUÐQTÑÐQUPQX‘ÑYPÝÑZÙÑZÐÐQ[Ñ\™Ñ\”Q]™Ñ]ÝÑ\Q[ÓÐRÑ]ÑTQ^PQ^‘ÑLÑLQQLQLQLQLQ^‘QLQQPÑÐP‘TP^YÑ^YÑ^QYÑ^QYÑ^]ÑQÐP[ÑÐQ[ÑÑ[ÑÑ[QÑ[‘ÐQ[‘ÐQ[ÑÔQ[‘ÙÑ[‘ÝÑ[’Q[’Q[RÑ[RYÑZRYÑZRYÑZÒTQ[RTQ[’PQ\PQ\PQ\RPQ\’PQ\’PQ\’PQ\’PQ\ÒPQ]PQ]PQ]PQ]PQ]RÑ]ÒQ^Q^ÝÑ^QÙÑ^‘]ÑM‘YÑM‘TQMÑTQMÑPQNÑNQÑNQÑNQÑNQÑNQÑNQÑJÑÑNQPQTPP\‘TQSRPP\QYÑRÒPP\]ÑRRÐ\”QQ’Ð[ÒÑ[’Ñ[’Ñ[’Ñ[’Q\Q\Q\‘ÝÑ]ÝÑ]ÙÑ]‘ÔQ^QÔQ^‘ÐQLQÑLÑÐQLÑ™ÑM‘™ÑMÑ”QN”QXÓ]ÐY‘”QX“PYQQX“PY‘]ÑX“”PYQYÑXÓ™ÐYYÑX“ÐXÑTQX“ÔPXQTQXSÙÐV‘TQXSÝÐV‘TQV”PV‘TQVTPV‘TQVÐVYÑQTPUÔPPVTQQ‘PPVTPVPQRPV”YÐVPQ[T]ÐVPPQ[ÐPUPPQZ”ÔPUPQZTÔPUPQYTÐPUPPQYÐPUPTQXTÐPUPYÑVTÐPU]ÑVÐUQUÔ”PUP”QU”PUP™ÑUT]ÐUÐQTÔYÐUÝÑSÔ]ÐT‘QSTYÐT‘QRÔ]ÐT‹˜˜\ÙKLËMÈŽˆ‘PS’PPÑÑS’PQÑTÑPQTÑTQTÑTQUYÑTÑYÑUÙÑXÐQY™ÑYÐQZ]Ñ[YÑ[ÐPQ\PQ\ÐTQ\Ð]Ñ\™Ñ\YÐQÐÔQ]ÐÙÑ]ÙÑ^PÔQLÐQLÑLÑ^™Ñ^™Ñ^P”Q^”QL”QQÔPP‘P]™ÑPÑP]ÑQ^Q^Q]QQ\ÑQQTP[QTQ[‘TQ[‘TQ[QYÑZ‘]ÑZQ]ÑZ‘QZ‘”QZQ™ÑZQÑZÐQZÝÑYQÝÑYQÙÑY‘ÙÑYÑÙÑYÑÙÑYÑÙÑYÑÔQZQÔQZQÔQZQÔQZQÔQZQÔQZQÔQZQÔQZQÔQZ‘ÔQZ‘ÔQZÑÐQ[Ñ[‘™Ñ[Ñ”Q\”Q\QQ\‘]Ñ\ÑYÑ]QQ^‘QLÙÑLÔQMÐQMÐQMÐQMÐÐQNÐQNÐQNÐQNÐQT‘ÙÐ\PÔQTÙÐ\PÙÑS‘ÔP\PÝÑSQÐP\‘QR‘ÐP\QÑQÑÐ\‘™Ñ\Ñ™Ñ\Ñ”Q]Q”Q]‘Q]Ñ]Ñ^Q]Ñ^‘]ÑLQYÑLÑYÑMTQM‘TQMÑTQXSPZTQV“PZPQXSÐZPQV“ÐZPQV“ÐYÑTQVPPY‘ÑV“PPY‘ÑV“TPYQÑV“YÐYÑXS]ÐYÑV“”PXÑÑV“™ÐXÑÑV“ÐYÑVSÔPYÑUÓÙÐYÑUÓÝÐYÑU”PXÑÑUTÐXQÑUT”PUQÑU™ÐUQTÔ™ÐUÝÑTÔ™ÐUÐQUT™ÐUYÑV”™ÐTÐTQX”™ÐTÐPQXÔ”PTÐPQYPTÐPQXÔ]ÐTPQXÔTPTÐPQXÔPPTÐPQXÔPPTÐTQX”PPT]ÑVTPPTP”QU”TPSÑPQR”]ÐS‹˜˜\ÙKMLŽˆ”PQ”QQ”™ÐRÝÑUÝÑUSÙÑUSÙÑUÔQTÓÔQVSÐQXÓÐQY“”Q[]Ñ[ÓTQ\SÑ\“Q\’Q^]Ñ]ÒYÑ]ÒTQ]’TQ]RTQ]’TQ^ÑLQLÒQMQMRQM’QM’QMÑ]ÒÑ]ÒÑ^Ñ^Ñ]ÒÑ]Ñ\RQ\ÑÝÑ]QÙÑ]QÙÑ]QÔQ]ÑÐQ^ÔPRÑ^•ÐPR‘™ÑLÐS™ÑLU™ÐS‘™ÑLU”PT™ÑL•PTQ™ÑL•PTQ”QM]ÐT‘”QM]ÐT‘QMUPTQ]ÑM•PTQYÑMÕPTQYÑNYÐTÑTQJÕPPUQTQ”ÑTQ”‘TQ”‘PQ”‘PQ”QPQ”Ñ”Ñ”QÑ”Ñ“‘Ñ^TTPV‘Ñ^YÐVQÑ^]ÐUÑÑ^”PUÑ]”™ÐT‘PQ]TÐTTQ]TÐPSQYÑ]TÔPR‘]Ñ]”ÝÐQ‘ÔQ\QÙÑ\‘ÙÑ\”™ÐP‘ÔQ]TÐPP‘ÔQ]ÑÔQ^QÐQLQÐQL‘ÑM™ÑMÑ”QNQ”QJÑQKÑ]Ñ‘]ÑÑYÑ‘TQ‘‘PQ‘ÑPQ‘ÑÑ’Ñ’QQ[SPZQQY“PQÓ”PZPÝÑY“ÐQS™ÐQÝÐXÐÝÑYTPXPÙÑYTÐVÙÑYTÐXPÔQYTÐXPÐQYTÐXPÐQYTÐVÐQYÐVÐQXÔÐVPÐQX”ÐVPÐQX”ÐVPÐQXTPPUÐÐQV”PPUÐÐQVTTPUPÑVTYÐTÐÑV]ÐT”QVT”PT”QVPTPQV”PTQUÔ”PTP]ÑUPTÐYÑU”PUYÑTÔPUÐTQU]ÐXPPQUT]ÐXPQUTPXPQUTPXÐPQUTPXPQUT]ÐYPQUTPXPQU”PVPQTÔ™ÐVYÑT‹˜˜\ÙKMLHŽˆ”ZÐÔ]ÐQ”QQTTPSTQTÓÝÑTÓÙÑT“ÙÑT“ÔQT“ÐQT“ÐQXÓÐQY“ÑZS”Q[]Ñ[ÓYÑ\PQ\Ñ[Ò”QQSP[Ò]Ñ^YÑ]ÒYÑ]’TQ]’Ñ^’QL’QLÒÑLÒÑMÑLÒPQLÒÑMQM’QLPPÒQLQLÑ^’TQ]’TQ\RYÑ\YÑ[ÒÑ]ÐRRQ^VÐYÒQš’Q›ÝÑ›QÙÑ›ÑÔQœÐQœQÐQœQÑœ‘ÑœQÑœQÑœQ™ÑœQ”QœQ”QœQ–Q•Q]Ñ’–YÐP‘]Ñ‘Q]ÑM‘]ÑLÑ]ÑLÑTQMTQMTQLÑPQMPQLÑPQLÑPQLÑPQL‘PQL‘PQLQPQLQPQLQTQLQTQTTP[QYÑS’PP[ÑQR’PP[ÑÑQÐ\’Ñ]Ñ]’Q^RQLRQL‘ÝÑMQÙÑNÔQJÑÔQKÑÐQ‘ÐQÑÑ‘™Ñ‘‘”Q’Q’QQ’‘YÑ“TQ“QÑ[ÓÐP[QÑ\ÐP[QQ\SÔP[QQZSPPQÓÙÐQTTPYPÝÑZTYÐYÙÑZT]ÐYÙÑZ”PXÔQZ”PXÐQZ™ÐXPÐQYÔ™ÐXPÐQY”™ÐXPÐQY”ÐVÐQYTÐVÐQYÐVPÐQXÔÐPVÐQX”ÐPUÐÑXTÔPU™ÑXTÙÐU”QXTÝÐTÐQXUPT]ÑV•ÐT]ÑVUÐTPYÑVUÐTTQUUÐTÐTQUÐUPPQUPVPPQUPXPPQUUPXPQUUPXÐPQUUPXÐPQUUPXÐPQUPXÐPQTÕÐXPQT•ÐVYÑSÕPPV‹˜˜\ÙKMLˆŽˆ”ÙÒ“ÝÑP”ÐSSÔQTÓÐQUÑUÑTÓ™ÑTÓ™ÑT“”QXS”QYQZYÑ[Ñ\Q\“Q\ÒÝÑ\]ÑPÒÔP\RÑ^RQ^‘ÝÑ^QÝÑ^Q^RQ^’Q^’QLQÝÑLÑÐQMÑÑN™ÑNQÑLÕTPP‘ÙÑ^‘ÝÑ^RQ^Q^ÝÑ^QÝÑ^Q\’Q]–”PQ™PPSÝÑ^VPPZÑÙÑœÑÙÑÔQÐQ‘ÑÑÑÑ™ÑÑ”QžQ”Qž”Qž”QÑ”Q‘”Q™YPPSQ”Q–™YÐR‘Q•ÙÐPÑQ’‘]Ñ’]ÑQ]ÑMÑ]ÑLQ]ÑL]Ñ^‘]Ñ^‘]Ñ^Q]Ñ^Q]Ñ^]Ñ^]Ñ]Ñ]Ñ]ÑQ]‘Q]Q”Q\Ñ™Ñ\‘Ñ\QÐQ\QÙÑ\RQ\Q\‘ÝÑ]QÝÑ]‘ÙÑ^QÙÑ^‘ÔQL‘ÔQMÐQMÑÐQNQÑKÑ™Ñ‘”Q‘Q‘‘Q‘Ñ]Ñ’YÑ’‘TQ“TQ“PQ“QÑ“‘Q[“”P[ÑQ[Ó”P[ÐÝÑ[Ó™ÐQ”ÐYÝÑZÐQTPPYÙÑZTPXÐÔQZ]ÐXÐQZPXPÐQYÔ”PVÑYÔ”PVÑY””PVÑY””PVÑYT”PVÑY™ÐVPÑXÔ™ÐVP™ÑXÔ™ÐV™ÑX”ÐUÐ™ÑXTÐPUP”QXTÔPUQXTÙÐTÐ]ÑXUPTPYÑXUPTTQV•PTPTQVUPTÐPQUUPTÐPQTÕPUPQTÔÝÐXPPQTÔÝÐXPQTÔÝÐYPQTÔÝÐYPQTÔÝÐYPQTÔÝÐYPQTÔÝÐYPQTÕPXÐPQT•PVPQTUPPRUÔPSPPQSÈ‹˜˜\ÙKMLÈŽˆ“PQS]ÐSSQUQUÝÑUÙÑTÒÙÑTÒÔQX’ÔQYRÐQZÑZÒÑ[]Ñ\TQ\RPQ[ÒÑ[ÒQ[‘QQ’P[‘TQ^PQ^PQ^QTQ^QTQ^‘YÑ^‘TQLQÑMQMÐÝÑNÝÑMÑQLQÑ^‘Ñ^QÑ^QÑ^QÑ^Ñ]QPQ\‘Ñ\ÕYÐPÕÐP‘Ñ]UTPRQQ^PPRÑQ^•ÐSPÝÑLÐSÐÙÑL•PTPÙÑL•PTÐÔQMPTÐÐQMUPTÐÐQM”ÝÐUÑNÙÐUPÑNTÐPUÐÑ–™Ñ–”Q–Q–]Ñ–YÑ–YÑ•ÐYÑ•TQ•TQ•PQ•PQ”ÐPQ”PQ”PPQ“ÐPQ“PQ“PQ’PQ’PQU‘™Ð]PQUQ™Ð]PPQUÐ\ÔPPPQT‘ÐP]PPQTQÙÐ]ÐTQSÑÝÐ^YÑRÑÙÐLP]ÑRÙÐL‘ÙÑLÑÔQM‘ÔQNÔQKÑÐQÑÐQ‘ÐQ‘QÑ‘ÑÑ’™Ñ’Q™Ñ’Ñ”Q“”Q“”Q“QQ“‘]ÑYSÐP\]ÑYSÝÐ[‘YÑYTÐZÑTQYTPPZ‘PQY”YÐZPQYT”PY‘ÑYTÐYÑY”ÔPX‘ÑYTÔPX‘QYTÔPX‘QYTÙÐXQQYTÙÐXQQYTÝÐV‘QYPVQXÕPVQX•PUÑQXUÐU‘QXUÐUQQV•PPUÝÑV•TPTÐÝÑVUPTÙÑVU”PTÐÙÑVPUÔQUÕ”PUÐQUÕ”PVÑUÕPXÑTÕPXÐ™ÑUPXÐ™ÑTÕPXÐ”QUUPXÐ”QUU”PXQU•”PXQU•™ÐVQU•ÐVQU•ÔPTÐQUP™ÑTÑT‹˜˜\ÙKMMŽˆ’PQÐPT]ÑUR]ÑUYÑTÒTQTÒTQT’PQT’ÑT“YÐRÑYQZQÔQ[‘Ñ\Q”Q]Q]PÔQRQ]Ð\ÐQLPÑLÐQ^ÐQ]]ÑLPYÑLÐYÑM]ÑMQLÐ™ÑLÐQLPÑLQMYÑLÐTQLÐTQLÐYÑL™Ñ^Ñ]Ñ]ÐÑ^Ñ^P™ÑL”QLQMP]ÑMÐYÑNPYÑJÐTQPTQPQ‘PQ‘PPQ‘PQ‘ÐPQ‘ÐPQ’PQ’PQ’PQ’PQ’PPQ’PQ’PQ’PQ’PQ‘ÐTQ‘PTQ‘YÑ‘YÑ’]Ñ’Ð]Ñ“ÐP]Ñ”PQ”Ð”Q•™Ñ•ÐQ•PÙÑQ‘YÐ“YÑ“QYÑ“‘TQ“ÑTQ”TQ”QTQ”QTQ”‘TQ•PQ•ÑPQ˜QÑ˜ÑÑ™‘ÑYSÙÐL‘ÑYPP^ÑYP]QQYÐP\‘QXÔÙÐ\QXÔÝÐ[ÑQXÕP[QQXÕPPZÝÑXÕÝÐVPÙÑXÖPUÐÔQXÖPPUÔQXÖTPTÐQXÖ]ÐSÐÐQXÖPSPÑXÖ™ÐRÑXØPPP˜PP™ÑXÐ™ÑXÐ™ÑX™ÑX™ÑXP™ÑXP™ÑV™ÑVP™ÑVPÑUÐ™ÑUÐ™ÑU”QUÐQUQUP]ÑU]ÑTÐTQUPTQUPPQUPQUPQUPQUPQUPQUPQUPTQTÐYÑTH‹˜˜\ÙKMMHŽˆ“\Ð“YÐRÓQQTPSRÝÑTÒÙÑTÒÔQT’ÔQT’ÐQT’ÐQT’ÑVRÑX’™ÑY’]ÑZ’Ñ\Ñ\’Q]QÝÑ\ÑPQLQÑLÑ^‘Ñ^Ñ]ÑÑ^QLÝÑLÐÙÑMÙÑMPÝÑMQQMQLÑQL™TPQ‘Q^PPRQ^YPSÝÑ^˜ÝÐSÐÝÑ^˜ÐPT‘Q^”PUQQ\Ø]ÐUÑÑ\YÐVQ\–™ÐXÝÑ]UÐR–]ÐYPÔQ]ÕP]ÐQ^UYÐ]ÑLTP]ÑLÐ^P™ÑL•P^P”QMÙÐLQMTÐPLP]ÑMÔ”PLPYÑNT]ÐLPYÑŒPYÑŒPYÑŒYÑ›Ø]ÐP˜”PRPYÑ›TQšÐTQ›PQ›PQšÐPQšPQšPPQšPQ™ÐPQ™PPQ™PQ˜PPQ–PPQ•PQ”ÐPQ”PPQTQTPNPPQTQTPNPQ“PQ’PQ’PQ‘PQ‘PQPQPPQKÐTQNYÑMQL”QL™Ñ^ÐQ^ÙÑS‘ÔPYÑQRÑÔPY‘QRQÙÐYQX’QXRQXRQX’QXRQXRQV’QV‘ÝÑXQÝÑXQÙÑXQÔQX‘ÔQX‘ÔQXQÐQX‘ÐQXQÐQXQÐQXQÑXQÑXQÑV‘ÐQVQÔQUÑÔQUÑÐQUÑÐQU‘ÐQUQÑUQÑTÑ™ÑTÑ™ÑT‘”QU”QUQUQ]ÑUÑ]ÑUÑ]ÑU‘]ÑU‘]ÑUÑ]ÑUÑQUQ”QTÈ‹˜˜\ÙKMMˆŽˆ“[ÒSQPÓYÐSQTÒÝÑUÙÑUÙÑTÒÔQTÒÔQT’ÐQXRÐQXÒÑYÒ™ÑZ’]Ñ[’TQ\RÑ\’Q\Q[ÑTQRÝÐ[‘PQ^PQ]ÑPQ]‘TQ]‘YÑ]‘TQ^ÑLÑL‘QMPÝÑM‘QMQ^‘Ñ]ÑPQ]‘PQ]‘Ñ]ÑÑ]ÑÑ\‘Ñ\QPQ\TQ[ÕÐQ‘TQ[•PRQÑ\ÝÐSÑ\ÙÐS‘Q\”ÔPTQ]ÐPTPÝÑ]”ÐPTÙÑ]ÔÐTÐÔQ^TÐTÐÔQ^”ÐTÐÐQLTÐTÐÐQLTÐTÐÐQL”™ÐUÐQM”PUÐQMTYÐUÐÑ”PÑ”™Ñ”P™Ñ””Q””Q“Ð”Q“”Q“PQ“PQ“Q’Ð]Ñ’Ð]Ñ’]Ñ’PYÑ’YÑ‘ÐYÑ‘YÑ‘PYÑÐYÑU™Ð\ÐYÑTÑÐ]YÑTÑÐP]P]ÑTQÔP]P]ÑTÔP^PQSÑÔPL™ÑSÐPLÐÑR‘ÐPMÑMÑÑJÑÑKÑ™Ñ‘™ÑÑ”Q‘Q”Q‘‘Q‘ÑQ’Q’Q]Ñ’QYÑ’‘YÑ’ÑTQ“PQZS™Ð[‘ÑZÙÐZ‘ÑYÔPYÑQYÔPPYQQYÔYÐXÑQY”PXPÝÑY”PXPÙÑYÔPXPÙÑY”PXPÙÑYT”PVÔQY””PVÔQYT”PVÔQY™ÐVPÔQXÔ™ÐVPÔQXÔÐUÐÐQXÔÐUÐQX”ÐPUPÐQXTÔPUÑXTÝÐT™ÑXUPTP”QV•PTPQV•PTQVUPU]ÑVPUPYÑU™ÐPÔÝÐVTQUTÝÐVTQUÝÐXPQUTÝÐXÐPQUTÝÐXÐPQUTÝÐXÐPQU”ÝÐXÐPQU”ÝÐXÐPQUUPXPPQUUPVPPQUÙÐRYÑTH‹˜˜\ÙKMMÈŽˆ“™ÐQÙÐSS”QTÓQTÓ]ÑT“]ÑTSYÑTSYÑTSTQVSTQXÓPQYÓQ[RÙÑ\ÐQ\ÒÑ]™Ñ]ÙÑL‘ÔQLÔQ^QÙÑ]‘ÔQ^”QL‘QMQMQ”QM™ÑMÑMÐQLÑÐQL‘Ñ^TÙÐP•PP‘™Ñ^‘”QL”QL”Q^‘™Ñ]PP”™ÐP‘ÐQ\‘ÙÑ\ÐQ\‘™Ñ]”Q]‘Q^ÙÐRQ^UÔPR‘]ÑLÐPSYÑLUÐS‘YÑL•™ÐTTQM”PTQTQMPTÑTQMPTÑTQMPTÑTQMU]ÐUTQM•]ÐUPQN]ÐUPQNU]ÐUPQNUTPUQÑ•‘Ñ•‘Ñ•QÑ•QÑ•Ñ”ÑÑ”‘Ñ”QÑ”Ñ“ÑÑ“‘Ñ“Ñ’ÑÑ’‘Ñ^YÐU‘Ñ^T”PT‘Ñ^”ÐSÑÑ^”ÐPSÑLÙÐRPQLTQLTQL‘YÑLÑ]ÑMQMÔQLÔQLÑÔQMQÐQMÑÐQNQÑKÑ™Ñ‘™ÑÑ”Q‘Q”Q‘‘Q’Q’]Ñ’QYÑ’‘TQ’ÑTQ“TQZ“”P[‘PQZ“™Ð[QÑZÔPYÑQYÔÐYQQYÔTPXÐÝÑYÔ]ÐXÝÑY”PXPÙÑY”PXPÙÑYT”PVÔQY”PXÔQY”PXÔQYT”PVÔQXÔ”PVÔQX”™ÐVPÔQX”™ÐVPÔQXT™ÐVÐQXTÐUÐQXTÐPUÑXTÐPU™ÑXTÙÐT”QXUPTQV•PTQVUPTP]ÑVUPTPYÑVPTÐTQU”ÝÐUÐTQUÝÐVPPQUTÝÐXPPQUTÝÐXPQUTÝÐXPQUTÝÐXPQUTÝÐXPQUTÙÐXÐPQUÝÐXPQUPVTQTUÐUÐYÑSÈ‹˜˜\ÙKMKLŽˆ“ÝÐSÓÙÑTÔQTÐQTSÑTSÑT™ÑTTÝÐQ™ÑTÐSS”QTT™ÐSÓQZÓ]Ñ[STQ[ÓÑ[“Ñ[SQ[RÝÑ[RÙÑ[’”QQÔP[’PQ^ÑLQL’QLÒÑLÒÑMÝÑNÙÑNQÙÑNÙÑMÝÑL’QLÑLÑLQLQLQ]ÕPP’Q\ÒÑ\’PQ\Ñ\Ñ\Q\ÒQ]ÝÑ]‘ÝÑ]ÑÙÑ^QÔQ^‘ÔQ^‘ÐQLQÐQLQÐQLQÐQLQÐQLQÐQLQÐQLQÐQLÑLQÑLÑLÑLÑLÑLÑLÑ^‘Ñ^‘Ñ^‘Ñ^‘Ñ^‘Ñ^‘Ñ^‘ÐQ^ÐQ]ÑÐQ]ÑÔQ]QÔQ]ÔQ]ÑÙÑ^ÙÑ^‘ÙÑL‘ÔQLÑÐQM‘ÔQM‘ÐQNÑKÑ™Ñ‘”Q‘”Q‘QQ‘‘]Ñ’YÑ’QYÑ’‘TQ’ÑTQ’ÑPQZÓ”P[‘ÑZÓÐPZÑÑZÔPYÑQZPY‘QYÔPPYQYÔYÐXÙÑYÔ]ÐXPÙÑYÔ]ÐXPÔQYÔPVÔQY”PVÔQYTPVÐQYTPVÐQY”PVPÔQXÔ”PVPÐQXÔ™ÐUÐÐQX”ÐUPÐQXTÐPUÐQV”ÔPTÐÑXTÙÐT™ÑXTÝÐTP”QXUPTPQXUPTÐ]ÑVPU]ÑTÔÝÐUÐYÑTÔÝÐVPTQTÔÝÐXPPQUTÝÐXPQUÝÐXPQUÝÐXPQUÝÐXPQUÝÐXPQUÝÐXPQTÕPVTQT•PVYÑTÔPRÈ‹˜˜\ÙKMKLHŽˆ”PQ”]ÐSÝÑQ”TPSÓÝÑU“ÙÑU“ÔQU“ÔQUÐQUÑYSÑZ™Ñ[]Ñ\TQ\“Ñ\ÔPPÓQ\RTQQÓP\PQRÒÝÐ[ÒÑ^’PQ^PQ^QÙÑMÔQM‘ÔQMÑÙÑNQMÒQNQNÙÑJÑÔQM‘ÐQM‘ÐQM‘ÔQMQÝÑLÒÑLÑ^’Ñ]RÑ\ÒÑ\ÒÑ\’Ñ\ÒQ]‘ÝÑ^ÙÑ^‘ÙÑ^‘ÔQLQÙÑLQÐQLÑÐQLÑÐQLÑÑMÐQLÑÐQLÑÐQLÑÐQLÑÐQL‘ÐQL‘ÐQL‘ÐQL‘ÐQL‘ÐQL‘ÐQL‘ÐQL‘ÐQLQÐQLQÐQLQÐQLQÔQLÔQ^‘ÔQ^‘ÔQ^‘ÔQ^‘ÔQ^‘ÙÑLÔQLÑÔQMQÔQM‘ÐQNQÑQ™Ñ‘Q’]Ñ’‘TQ“QPQ“ÑÑ”QÑ”ÑQ•QQ•‘Q•ÝÑ•ÐÝÑ–ÙÑ–PÔQ–ÔQ˜PÔQ\“ÐPQ”Ð[ÐQ\TTPZPÐQZTPYÐÑZ™ÐYPÑY”ÔPXÑYTÙÐXPÑXÔÙÐXPÑXÔÙÐXPÑXTÝÐVÑXTÝÐVÑXUPVÐQV•PVÐQVUPUÐQVÐUPÔQU•ÐUÔQUUTPTÐQUUYÐTPÐQU]ÐTÑT•]ÐTÐ”QTÕ]ÐUQU]ÐU]ÑUUYÐVYÑU•YÐXPTQUÕYÐXÐPQVYÐYPQVYÐYPQVYÐYPQVYÐYPQV]ÐXPQUÕPVTQUU”PVYÑTÕÐRPPRÈ‹˜˜\ÙKMKLˆŽˆ“ÐQ”PSÓ™ÑUÓ”QV”QUÓQUS]ÑU“]ÑXSYÑY“TQZ“Ñ[ÓQ\’ÝÑ\ÒÔQ]QP’ÐP\’QR’™Ð\‘ÝÑLÝÑ^‘ÑL‘QMQ]ÑMÑQMÑ”QMÑÐQM‘ÔQM‘ÙÑM‘ÙÑM‘ÑNQ”QJÑQMQ]ÑM‘QMQ™ÑMÐQL‘ÙÑLÔQLQÔQLUPPQPP‘ÙÑMÕÝÐQQMÕÔPQ‘ÝÑ‘ÝÑ‘ÙÑ‘QÔQ‘QÔQ‘‘ÐQ’ÐQ’‘Ñ“ÐQ’‘Ñ“Ñ“QÑ“‘Ñ”Ñ”QÑ”QÐQ“ÑÑ”QÐQ”QÐQ”QÐQ”QÔQ”ÔQ”QÔQ”QÔQ”‘ÔQ”ÑÔQ•ÔQ•ÔQ”ÑÙÑ”QÙÑ“ÑÙÑ“‘ÙÑ“‘ÙÑ“‘ÔQ“ÑÐQ”ÐQ”Ñ”Ñ“Ñ™Ñ“Ñ™Ñ“‘Q”]Ñ“–TPP‘YÑ“‘TQ“‘Ñ”Ñ”QQ”QQ”ÝÑ”ÐÙÑ•ÙÑ•ÔQ•Ñ–™Ñ–P”Q–”Q–QLÝÐZÐQZÒÔPTÐYÐ]ÑZ’ÔPTYÐXÐYÑZ’ÔPRTPQÔPXPTQZ’ÙÐQÓYÐQT”PVTQZRÝÐQS]ÐP””PVTQZ™ÐVPPQYÔ™ÐVPPQY”™ÐVPTQYÐVPQYÐUÐPQXÔÔPUPPQXÔÙÐUPQX•PTPQXUPTPQV•PTPPQVUPTÐPQUÕPUPQTÕPUÐPQSUPXPPQSPXÐPQSPYPQSPYPQSPYPPQSPYPPQSPYPPQSPXÐPQSÐVPQSÐVPQRÖPRPQRˆ‹˜˜\ÙKMKLÈŽˆ“ÐQ”PS™ÑU™ÑTÓ”QTÓ”QTSQT“]ÑT“]ÑTT”PRÓYÑY“TQZSQ[’ÝÑ\RÔQ\ÒÑ]ÝÑR’™Ð\ÑÙÑL‘ÙÑL”QLÑQMQM‘QMÑ”QMÑ™ÑMÑÑM‘ÑMÑ”QNQQKÑ]ÑUÐQYÑU™ÐQ˜PPÑYÑU™ÐQ˜]ÐQQ]ÑKÕ”PQ˜YÐQQ™Ñ‘ÖÐQXTPQÑÐQ“TPQ‘ÐQ“XTPQ‘Ñ–ÐQ•‘ÔQ•QÙÑ•QÙÑ•QÙÑ•‘ÔQ–QÔQ–‘ÐQ˜QÐQ˜QÐQ˜‘Ñ™Ñ™Ñ™Ñ™Q™Ñ™Ñ™Ñ™Ñ™Ñš™ÑšQ™ÑšQ™Ñš™ÑšQ™Ñš™Ñ™Ñ™Ñš™ÑšQ™Ñš‘™ÑšQ™ÑšÑ™ÑÑ™‘ÐQ™QÐQ™ÐQ™ÐQ™Ñ™QÑ™Q™Ñ™‘”Q™‘”Q™‘Q™‘Q™Q]Ñ™‘]Ñ™‘YÑ™‘TQ™‘Ñ™‘Ñ™‘Q™Q˜ÐÝÑ˜ÐÙÑ™ÙÑ˜ÐÔQ˜ÐÑ™™Ñ™”Q^TP[Q\”ÐZ]Ñ[TTPY]ÑZÔYÐYPYÑZÔ]ÐYTQZÔPXÐTQZ””PXPQZ”™ÐXPPQZT™ÐXPPQZ™ÐVPQYÔÐVPPQY”ÐPVPQYTÔPUPQYÙÐUPPQXÔÝÐUPQX•PTPQXUÐTPPQV•ÐTPQVUÐTPQUÕÐUPQUUÐUPQT•PXPPQSÐXPQSÐXÐPQSÐYPQSÐYPQSÐYPQSÐYPQSÐXÐPQSÐXPPQRÕTPUÐPQRPQRH‹˜˜\ÙKMKMŽˆ”PQ”QQÔ]ÐRÓÝÑUÙÑU“ÙÑUSÔQUSÐQUÐQUPP“ÑYSÑYÓ]Ñ[STQ\Ñ\“Q]TQRP]PQLÒPQL–YÐPÒPQLVTPQQÙÑNTPQQÔQJÖTPQ‘ÔQVPPRÙÑ–ÐRRQVÐRRQKÖPPRRQVÐRÒQ“ÑÙÑ”‘ÔQ”ÑÐQ•XÔPP‘ÐQ˜‘ÔQ˜‘ÙÑ˜ÒQ˜RQLYÐ[RQ]UTP\RÑ]TP\’PQ\UPP]YÑ[•Ð]TQ\P]ÒPQ\•P^PQ™RÑ™’ÑšÑšRQšÒQ›Q›RQœQœRQœQÝÑœQÝÑœÝÑœÝÑœÙÑœ‘ÙÑœ‘ÙÑÑÙÑžÙÑžÙÑÑÙÑÙÑÙÑœÑÙÑœ‘ÝÑœRQœÝÑœÝÑœÝÑ›ÑÙÑ›‘ÔQ›ÑÔQ›ÑÐQ›ÑÐQ›‘Ñ›‘Ñ›‘Ñ›‘™Ñ›‘”Q›‘Q›‘Q›]Ñ›QYÑ›QTQšYPQPQšPP‘ÑšÑ™˜™ÐP‘Q™‘Q™ÐÙÑšÔQšÐQ^TP\ÐÑ^TPP[Ð™Ñ^”]ÐZÐQLT”PX–TPQÐQ[ÙÐSÔ”PX–TPQ]ÑZÒÙÐR]ÐQ”PX–YÐQPYÑZÒÝÐQ”™ÐXV]ÐPÐTQZÔ™ÐXPTQZ”ÐVPTQZTÐVPTQYÔÐPUÐPQZÐPUÐPQYÔÔPUPPQY”ÙÐUPQYTÝÐTÐPQYPTPPQXÕPTPQXUÐTPQV•ÐUPQVÐUPQU•PXPPQT•PXPQRÕPXÐPQRÕPYPQRÕPYPQRÕPYPPQRÕPYPPQR•PYPQR•ÐXPQRÕÐVPQR•ÔPP•ÝÐSPQRPPQR‹˜˜\ÙKMKMHŽˆ“ÐPQSÑQ“™ÑQ”PRÓ”QQ“ÝÐS“QUS]ÑUSYÑUYÑYTQY–ÐP“PQZVÐQQ[–ÐQRÙÑ\VÐQRÐQ\–ÐQ’™Ñ\ÖÐQ’QQR”P\ÖÐQÑÔQMVÐQÑÔQNÐRQ”QPÑÙÐNVPR‘]Ñ‘–PR˜]ÐPÑYÑ’PRØYÐQQ]Ñ˜˜ÙÐP‘Q˜ØÔPQ”Q™‘™Ñ™‘Ñ™‘”QšQYÑ›™YÐQÑTQÑPQÑTQ‘YÑ‘Qž™ÑÑ”Qž”QŒ‘™ÑŒ‘ÐQŒQÙÑŒ[ÑPQšÐšÙÑVV’P‘ÐQÕT˜Ð›QUÐV•P‘™ÑÕT–P›QUV–P‘”QÕÐT”P›ÑUPV˜Ð‘QÖT“P›PQUV™Ð‘]ÑÖPT“P›PQUV™Ð‘YÑÖT’P›TQTÐVšÐ‘YÑÖT’P›TQTÐVšÐ‘YÑÖT’P›TQTÐVšÐ‘YÑÖT‘P›YÑTVÐ‘ÑÙTM›”QSV‘QÙPTL›™ÑSVRP›™ÑPQ[Ð™ÝÑRÐVTPÙÑšÑPPÚÐ™MÐPSRPVÒVÑÐVÑVÑV‹ÐPQPÐVPVPVPPVPPVPPVPPUÞPVPPUšPPVPPTÐZP^PQLPPÒ˜ÐPN]PPTPPTŽPMPŒXÐP[PQÐPQPPTPNPŒXÐPYÐPTŒPNPPžÐPYÐPTÚPPLPPZÐPT›ÚPPXÜPSMÐPœP[ÐPT™ÚPUMÐPœÐPR™ÐPTPPT˜ÎP™ÐPT–NP™ÐPT•NPP˜ÐPT”NPP–PPT“JÐP”PPT’JÐP”PPT‘PP’PPTP‘PPTMPÐPPPTLPÐP‘PPT^ÐP’PPT]ÐP”PPT[ÐP•PPTUÐP™ÐPTRÐPœÐTžÐTŒPÐTŒPÐTŒPÐTŒPÐTŒQTPT›ÐT–OH‹˜˜\ÙKMKMˆŽˆ“™ÐQÔÐQ“”QT“QUQU]ÑUYÑTÓTQTÖÐP“PQYVÐQÑZVÐQ“Q[ÐQÒÙÑ\ÐQ’ÐQ\–ÐQÒ™Ñ]ÐRÔQQÒP]–ÐRQÐQMÖÐR‘ÐQNÐR‘QÖPSÙÐP‘]Ñ‘UÙÐSØÔPQYÑ‘ÕÔPTXÐPQQYÑ–™ÐQÑ]Ñ–”PRYÐQQ•Ø]ÐTQ”Q›™”PP‘”QœYÐQPPVSPPUUÐVUPUÐQÔÐUTQÔUPPS”PQÔVÔÐVÕPVZTPR‘”Q[ÐQPQ”P™ÔQÙTPTQÖPT”P›PQTVœÐPQÜÐTPPœQPPX]ÐPQÜÐTPPœQPPX]ÐPQÜÐTPPœQPPX]ÐPQÜÐTPPœQPPX]ÐPQÜÐTPPœQPPX]ÐPQÜÐTPPœQPPX]ÐPQÜÐTPPœQPPX]ÐPQÜÐTPPœQPPX]ÐPQÜÐTPPœQPPX]ÐPQÜÐTPPœQPPX]ÐPQÜÐTPPœQPPX]ÐPQÜÐTPPœQPPX]Ð™ÑÛPT\Ðš]ÑÖTPUÝÑÓVÐPRÐV]Ð›”QPQÚÐšQÙTPSÔQÑTYÐ™ÔQRVRP™ÑÑTVP™ÙÑQVPÐTPQPQŽÝÑPPTTP™”SP™™ÐPTRPYÐP•Õ›ÐQÛ•PP›ŒP”PP•ÑÐQÛÐPÖÐPLÎPYÐP•Œ]ÐQÜÐPÔPP’ž[ÐP•PR•ŒQÌPÐPP’ž˜ÐRLPÌŽP™ÐP’žœÐQÌMPÖPPVPPYÐP’PPPšœÐQÌMPÔPP’ÑPP‘ÐQÌMPÐPP’ÐQÛPÐP‘ÞÐQÕŽPÐP‘ÚŒQÑÐPP”PP‘ÕQÑŽP™ÐP‘ÑQ•P™ÐP‘žŽQ•P™ÐP‘•PPQ‘ŽPPP‘‘QPQLNPPP‘LPQUÐPPYÐP‘ZÓPQTPP‘ZÔPQPPP‘UTPQTPP‘ÔPQ]ÐPÙÜÐPUTPQ”PPŒPQÙÐPšÓPQÝÐPLPRSP’SP’SP’ÓP’TP’UP‘ÕUP‘Ñ[ÐU]ÐPU’PPTOOH‹˜˜\ÙKMKMÈŽˆ“ÔPQÙPZ“”QSX™Ð\‘™ÑTPSØ”P\ÙÑLØ™ÐZÐÔQ’X]Ð]ÐQ’ÖÐLÑÕPTPP›]ÑPPVœÐPQØTPP›YÑPPVœÐPQØTPP›”QPPVPQÙTPP›”QPPVŒPQÙTPP›ÐQPPXPPPQÙÐTPP›ÐQPPXPPPQÚTPP›ÙÑPPXRPPQÚTPP›ÝÑPPXUPPQÛTPPœQPPXUPPQÚÐTPP›ÝÑPPXSPPQÚPTPP›ÔQPPVŽPQÙTPP›ÑPPVŽPQÙPTPP›ÑPPVPQÙTPP›”QPPVÐPQÙTPP›”QPPVÐPQØÐTPP›QPPVœÐTQÖTTPšÔQ]PTTLP›PT–PPQšÐQMÐT”›ÐPÌT•žPÕNPT•ŒPÓÐTNLPPÑŒT”ÔTPQ™ÑUH‹˜˜\ÙKM‹LŽˆ’YÐSSPPPÒYÑS“PPQR]ÑT’]ÑTÒQTÒQTÒ”QTÒ”QTÒ”QTÒ”QU™ÑTÑÝÑYQÐQZÑZÑ™Ñ[Q”Q[ÑQ\Q]Ñ\‘YÑ]YÑ]TTPQQ]ÑLÑÐQ^‘ÝÑ]‘ÙÑ]‘ÐQ]ÔÔPP‘ÑL‘™ÑM”QMQ”QMQQMQ]ÑMYÑMYÑLÑ]ÑLQÔQ]ÑÐQ^QÐQ^ÔQ]‘ÙÑ]ÙÑ]‘ÐQ^Q™ÑLQ™ÑL‘”QMQMQ]ÑMÑYÑNQYÑNQTQJÑTQJÑTQJÑTQJÑTQJÑTQKÑTQJÑPQQPQQPQQÑÑÑÑÑ‘Ñ‘QÑ‘QÑ‘QQ‘ÑQ’QQ’•ÐQ”QQÝÐ”ÐQ˜P]Ñ˜ÐYÑ™TQXÒÐÐPQ™ÐPQXÒP‘PQ™ÐPQ™ÐPQ™ÐPQ™ÐPQ’TÔPVPQVÐP^ÙÐUÐTQU‘Ð^•PUYÑU™ÐLUPT]ÑT”PLÕÐTQS‘PMUPPSP™ÑRÑ]ÐM•TPRÑRQ]ÐMÕYÐQÑYÑNQTQJÑPQQÑÑÑ‘QÑ‘‘Q‘ÑQ’PÝÑ’ÐÝÑ’ÐÙÑ“PÙÑ[STP[ÙÑ[STP[PÔQ[“TP[ÔQ[“YÐ[PÐQY’ÐPRYÐRÙÐYPÐQYÔPQÓ]ÐQ“ÝÐYPÐQYÙÐQS”PPÔPYPÐQXÔPYÐQX”PYÐQXTÐXÐÐQXTÐXÐÐQXTÐXÐQV”PPXPÐQVTTPVPÔQVTPVÔQUÔYÐUÐÔQU”]ÐUÐQU”PUPÐQU”™ÐUÐQUÐPTÑUÐPTÐ™ÑUÔPTÐ”QUTÔPUQUTÔPU]ÑU”ÔPUTQVÔPUÐPQVTÔPVPQVTÔPVPQVTÔPVPQVTÔPVPQVÙÐUÐPQU”ÝÐUYÑUÝÐUH‹˜˜\ÙKM‹LHŽˆ’YÐSÐQTQTÒYÑTÒ]ÑTÒQT’QTÒ”QT’”QT’”QTÒ”QTÒ”QTÒTQUÑÝÑXÑÐQYÑÑZ”Q[Q[‘Q[Ñ]Ñ\QYÑ\ÑYÑ]Ñ]ÑLÑ^ÔQ]ÑÔQ]‘ÐQ]‘™ÑL”QM”QMQMQQM]ÑLÑYÑLÑ]ÑLQQ^‘ÐQ]‘Ñ^Ñ]ÑÐQ]QÑ]‘Ñ]Ñ™Ñ^Q™Ñ^‘”QL‘QM]ÑM‘]ÑM‘YÑNYÑNYÑNQYÑNQYÑNQYÑNQYÑNQTQJÑTQJÑTQKÑPQQPQ‘ÑÑÑÑÑÑÑÑÑÑÑ‘Q‘ÑQ’™ÑQQP“Ð”Q•ÐQ–P]Ñ˜PYÑ˜ÐTQ™PPQ™PQ™PQ™PQ™PQ™PQ™PQ’ÔPUÐTQ’ÙÐUPYÑ’ÝÐTÐ]ÑT‘”PLUPTQSÑPLÕÐS”QSQ]ÐMUÐRÐÑR‘]ÐM•PPRPÔQQ‘YÐNTPQ‘TQJÑPQQPQQÑÑÑ‘QQ‘ÑQ’QQ’PÝÑ’ÐÝÑ’ÐÙÑ“PÙÑ“PÔQ“ÔQ[STP[PÔQYRÐPRTP[PÐQYRÐPRYÐQÓÙÐYÐQYÔPQ“]ÐQSÝÐYÑYPXÐÑYPXÑYPXPÑXÔPXPÑX”ÐXPÑXTÐVÐQVTÐVPÔQUÔPPVÔQU”TPUÐÔQU”YÐUÐQU”]ÐUPÐQUTPUÑU”PTÐ™ÑTÔ™ÐTÐ™ÑTÔÐTÐ”QTÔÐUQUÐUP]ÑUTÐUYÑU”ÐUÐTQUÔÐVPQVÐVPPQVÐVPPQVÐPVPQUÔÔPUÐPQU”ÙÐUTQUÝÐU‹˜˜\ÙKM‹LˆŽˆ’]ÐSSPPQ’YÑUR]ÑUQU”QU™ÑTÒ™ÑUÑTÒÑTÒÑTÒÑUYÑVRQP’ÐXÑÝÑYÑÔQZÑÐQ[QÑ[Ñ™Ñ\Q”Q\ÑQ]YÐQ‘]ÑMQM”QLÑÝÑ]ÑÙÑ]‘ÔQLQÐQMÑMQ™ÑM‘”QM‘”QMQQLÑQLÑ”QQQÙÐ]‘ÙÑ]‘ÝÑ]‘ÙÑ^ÝÑ]’Ñ\RQ\‘ÝÑ]‘ÔQ^‘ÐQL‘ÑLÑ™ÑMQ™ÑM‘”QNQNQQJÑQJÑQJÑQJÑQJÑQJÑQJÑ]ÑKÑYÑQYÑ‘TQÑYÑ‘TQ‘TQ‘TQ‘QTQ‘QPQ‘•ÝÐQP™ÑQÐ”PQRP•P]Ñ™YÑ™ÐYÑšTQšPQ‘”™ÐYPPQY’PP[™ÐYPPQY’PP[ÐYPQYRÐ[”ÐYPQ’ÐPXÐPQšÐTQšPYÑV’P]ÝÐVYÑVÝÐ]•PUÐ]ÑUQÙÐ^ÐUQT‘ÔP^•TPT”QSÑÐPLU]ÐSÑSÐLÕ”PRÐQRQ™ÐMQQN]ÑJÑ]ÑKÑYÑQTQÑPQ‘QÑ‘ÑÑ’QQ’ÑQ“Q“ÝÑ“ÐÝÑ”ÙÑ[Ó]Ð[ÙÑ[Ó]Ð[ÐÔQ\]Ð[ÐÔQ\]Ð\ÐQZÝÐQÓP[ÐÐQY“PQSÐPÔPYÐÑY”ÐYÑYTÐYPÑYÐYPÑYPPYPÑXÔTPYÑXÔYÐXÐÑX”]ÐXÑX”PXPÐQV”PVÐQV”PVPÐQVT”PVÐQV™ÐUÐÐQUÔÐUÐÑUÔÐPUÑUTÙÐUP™ÑUPU”QUPUQUPU]ÑU•PUYÑUÕPUTQVPUÐPQVUPVPQVUPVPQVUÐUÐPQVPVPQUÕÐUÐPQU•ÐUTQUUPPU‹˜˜\ÙKM‹LÈŽˆ’”PSTPQ’”QTÒ”QTÒÑT’ÑTÒÐQTÒÐQTÒÐQTÒÐQUÐQUÐQURPQXÒQY‘ÝÑZÔQZÑÐQ[‘Ñ\™Ñ\‘”Q]”Q^‘ÔQ^‘ÝÑ^RQ]ÒQ]’Q]ÑÙÑLÔQLÑÐQMQÑM‘ÑMQ™ÑM”QM™ÑL‘ÑLQ]QÝÑ]ÑÝÑ^Q]’Q]Ñ\ÑÝÑ^ÙÑ^QÔQLÐQL‘ÑMÑM™ÑM‘”QN”QN”QN”QNQNQQJÑQJÑQJÑQJÑ]ÑQ]ÑQ]ÑQYÑ‘YÑÑYÑÑTQ‘•ÙÐQ™ÑQÑPP’ÐPRP”Q˜ÐQ™P]Ñ™Ð]ÑšTQšTQšTQšPQYÒTP‘PPQ›PQ›TQšYÑš]Ñ™Q‘ÔÝÐUÐ”QU‘ÝÐ]ÕÐTÐ™ÑTQÝÐ^TPSÐÐQSQÙÐ^U]ÐSÙÑRQÔPL”PRÝÑQÑÐPL‘ÑM™ÑM‘”QNQJÑ]ÑQYÑÑYÑ‘TQ‘‘Ñ’QÑ’ÑQ“QQ“‘Q[SP[PÝÑ[“P[ÝÑ[“P[ÝÑ[“P[ÐÙÑ[Ó”P[ÙÑ[“Ð[PÔQZPP”PYÐÔQYÔÐYÔQY”ÐYÐQY”PPYPÐQYTTPYÐQYYÐXÐÐQXÔYÐXÐÐQXÔ]ÐXÐQX”PXPÐQXTPXPÐQXT”PVÔQVT™ÐVÔQVT™ÐVÔQUÔÐUÐÐQVÔPUPÐQUÔÔPUPÑU”ÙÐUP™ÑU•PTÐ”QU•PTÐ”QUUÐTÐQUUÐU]ÑU•ÐUPYÑUÕÐUTQVÐUÐPQVUÐVPQVUÐVPPQVÐVPPQVÐVPQUÕÐVPQU•TPUTQUTPUPYÑTU]ÐRˆ‹˜˜\ÙKM‹MŽˆ’”PR“PPQRQSSTPQRQTÒ”QTÒ™ÑT’ÑT’ÑT’ÑTÒÐQT’YÑVRQYÝÑYÑÔQZ‘ÐQ[QÑ[Ñ™Ñ\Q”Q\ÑQ]Q^‘”QPÑÔP]ÑÙÑ]ÑÝÑ]QÙÑ]QÔQ]ÑÐQL‘ÑMÑMQ™ÑMQ”QMQQMQLÑ”QL™ÑP‘ÙÐ]‘ÝÑ]‘ÙÑ^ÝÑ]’Q]Q]ÝÑ]ÑÔQ^‘ÐQLQÐQL‘ÑM™ÑM‘™ÑM‘”QMÑ”QNQNQQNQQNQQNQQNQ]ÑKÑ]ÑKÑ]ÑKÑYÑ‘YÑ‘TQ‘TQ‘QQÑPP‘P]ÑR‘Ð’UÔPRYÑ™TQšTQšPPQšÐPQ›PQ›PQ‘”™ÐYPQY’PP[™ÐYPQY’PP[ÐYPPQYRÐ[”ÐYPTQXÒÐ[ÔÐPYYÑXRP\TÔPX]ÑVRP\”ÙÐXPQUÒP]ÝÐVP”QUÝÐ]•PUÐ™ÑRÑYÐPÑÙÐ^ÐTÐÐQRÔP^•YÐSÑÐQLU”PR‘ÑLÕ™ÐR™ÑMQ”QMÑQNQ]ÑKÑYÑ‘YÑÑTQ‘QPQ‘ÑÑ’Ñ’ÑQ“Q“ÝÑ“ÐÝÑ[SYÐ[ÐÙÑ[ÓP[ÙÑ[ÓP[ÙÑ[“P[ÐÔQ[ÓP[ÐÔQZÝÐQ“”PQ”PZÐQYÔPYÐÐQY”ÐYÐÑY”ÐY™ÑY”PPYP™ÑYTTPYP™ÑYTPYP™ÑYYÐY™ÑY]ÐXÐ™ÑXÔPXÑXTPXÑV””PVÐQVT”PVPÐQV™ÐVÐQUÔÐUÐÐQU”ÐPUÑU”ÙÐUPÑUÝÐP•PT™ÑTÕPTÐ”QTÕÐTÐQUÐU]ÑUUÐUP]ÑUUÐUYÑU•ÐUPQVÐUÐPQVÐVPQVÐVPQVÐVPQUÕÐUÐPQU•PPUPQUUPPUH‹˜˜\ÙKM‹MHŽˆ’]ÐSSPPQ’]ÑTÒQTÒ”QTÒ”QTÒ™ÑTÒ™ÑTÒ™ÑUÑRÐTÒQYÙÑY‘ÔQZQÐQZÑÑ[Q™Ñ[Ñ™Ñ\Ñ\ÙÑ]‘ÝÑ]’Q]RQ]ÙÑ]‘ÔQLÐQL‘ÑM™ÑMQ™ÑM”QLÑQLÑ]ÑLÑ]ÑL‘QPÑÔPPÒP]ÝÑ]‘ÙÑ]ÑÔQ^ÙÑ]’Q\Q\QÙÑ]QÐQ^Ñ^‘™ÑLQ™ÑLQ”QLÑ”QMQMQ]ÑM‘]ÑMÑ]ÑMÑ]ÑMÑ]ÑMÑ]ÑMÑYÑNQYÑNTQKÑTQJÑTQQTQKÑPQ‘PQ‘Ñ‘Ñ‘Ñ‘‘Q’ÔPQPQRP”Ð]Ñ˜ÐYÑ™PTQ™ÐPQšPPQYRÐZÔPYPPQšPPQYÐ‘PPQšPPQšPPQšPPQšPTQVÔP]ÔÙÐVTQUÑÔP]ÕPUYÑUÐP^•ÐTÐ]ÑTÐLUÐTP”QSQ™ÐLÕPPS™ÑRÑ”PMUYÐRÐÐQRPM•]ÐR]ÑNYÑJÑTQQTQQPQÑÑ‘QÑ‘ÑQ’QQ’ÐÝÑ“ÝÑ“PÙÑ“ÙÑ“ÐÔQ”PÔQ[“YÐ[ÐQ[Ó]Ð[ÐQYÒÔPQÓPQ“ÙÐYÐÐQY’ÙÐQTPYÑY”PYÑYTPYÑYÐYPÑXÔÐYÑXÔÐYÑX”PPXÐÑXTTPXÑXTYÐVÐQVTYÐVÔQV]ÐUÐÔQUÔPUÐÐQUÔ”PUÐQU”™ÐUPÑU”ÐPTÐÑUTÙÐT™ÑTÔÙÐTÐ”QUÝÐTÐQUTÝÐU]ÑU”ÝÐUPYÑU”ÝÐUTQUÔÝÐUÐPQVÝÐVPQVÝÐVPQVÝÐVPQVÝÐVPQUÕPUÐPQU•PUTQUÐU‹˜˜\ÙKM‹MˆŽˆ’™ÐT’™ÑTÒ™ÑTÒÑTÒÑTÒÐQTÒÐQUQR’ÐPUQY‘ÔQZQÐQZÑÑ[‘”Q\QQ\ÑQ]QL‘”QL‘ÐQ^‘ÙÑ]ÑÝÑ]QÙÑLQÔQLÑÐQMQÑMQ™ÑMQ™ÑLÑ”QLÑ”QL‘QL‘QLÑ”QL‘ÝÑ]ÑÙÑ^ÔQ^ÙÑ]‘ÝÑ\ÒQ\‘ÙÑ^ÔQ^‘ÐQLQÑLÑ™ÑM”QMÑQNQQNQ]ÑKÑ]ÑKÑ]ÑKÑ]ÑKÑ]ÑKÑ]ÑKÑ]ÑKÑ]ÑQYÑ‘YÑ‘YÑ‘TQ‘TQ‘TQ‘TQ‘TQ‘PQ‘‘Ñ’Ñ’”QQÑP”Q˜Ð]Ñ™PYÑ™ÐTQšPQY’PP[™ÐYPQYRÐ[T™ÐYPPQYRÐ[TÐYPQYÐ[ÔÐYPQ‘ÔÐPXÐPQXÒP\TÐPXÐPQX’P\ÔÔPXTQV‘ÝÐ]TÙÐXPYÑUÑÝÐ]•PV]ÑUQÙÐ]ÕPUPQT‘ÔP^UÐTÐ”QSQÐPLPPTP™ÑRÑÐL•YÐSÐQR™ÐM]ÐRÙÑP‘PPÑ”PM•PRQN]ÑJÑYÑQTQÑPQ‘Ñ‘‘Ñ‘ÑÑ’Q’‘Q’ÑQ“QQ[S]Ð[PÝÑ[S]Ð[PÝÑ[S]Ð[ÙÑ[“]Ð[ÔQ[Ó]Ð[ÐÔQ[ÓP[ÐQYÒÙÐQÓPQÔPYÐQY“™ÐQPYÑY”ÐYPÑYTÐYÑYÐYPÑYPPYÑXÔTPXÐ™ÑYTPXÐ™ÑXÔYÐX™ÑX”]ÐXPÑXT]ÐXPÐQVPVPÐQV”PVÐQUÔ”PVÐQU”™ÐUÐÑU”ÐUÑTÔÔPUP™ÑTÔÝÐTÐ”QTÕPTÐQTÕPUQUPUP]ÑUPUÐYÑUUPUÐTQU•PVPQUÕPVPPQUÕPVPPQUÕPVPPQUÕPVPQU•ÐUÐPQU•ÐUTQTÕPPTÈ‹˜˜\ÙKM‹MÈŽˆ’]ÐRÓÐQYÑT’]ÑT’QT’QT’”QT’”QTÒ”QTÒ™ÑT’™ÑTÒÑP’PPQR™ÐTÑÝÑYÔQY‘ÐQZÑZ‘™Ñ[Q”Q[ÑQ\]Ñ\”TPP‘YÑ^]ÑPÑÐ^ÐQ^ÝÑ]QÙÑ]QÔQ]ÐQLÑL‘™ÑM”QMQM]ÑMYÑLÑYÑL‘]ÑLÐQ]‘ÐQ]ÑÐQ]ÑÔQ]QÙÑ\’Q[ÑÔQ]QÑ^Q™ÑL”QL‘”QLÑQM]ÑM‘]ÑMÑYÑNYÑNYÑNYÑNYÑNYÑNYÑNTQNQTQJÑTQJÑPQQPQQPQQPQ‘ÑÑÑÑÑ‘Ñ‘QQ‘ÐÐQPÐÝÐ’•”PQÐQ–P]Ñ˜PYÑ˜ÐYÑT]ÐXTQ™PPQ™PQ™PQ™PQ™PQ™PQ™PQ™TQU‘Ð’YÑTÑ™ÐLÝÐTÐ]ÑTQ”PL•PTQSÑPMÐSÐ™ÑS]ÐM•ÐRÐÐQRQYÐNPPRQYÑNQTQJÑPQQÑÑÑ‘Ñ‘QQ‘ÑQ’PÝÑ’ÐÝÑ[TPZÐÙÑ[STP[ÙÑ[TP[ÔQ[TP[PÔQ[YÐ[ÐQ[]ÐZÐÐQY’ÙÐP“PQSÔPYÑY“ÝÐYÑYTPXÐÑYPXÐÑXÔPXÑXÔPXÑX”ÐXPÑXTÐXÑXTÐVÑV”PPVPÐQVTTPUÐÔQUÔTPUÐÐQUÔ]ÐUPÐQU”]ÐUPÑU””PUÑUTÐTÐ™ÑUÐTÐ”QUÐUPQUÐU]ÑU”ÐUÐYÑUÔÐVTQVÐVPPQVTÐVPPQVÐVPPQVÐPVPQVÔPUÐPQUÔÙÐUPQU”ÝÐUTQUYÐPˆ‹˜˜\ÙKMËLŽˆ’ÝÐT’ÙÑUÔQU’ÐQVRÑXR™ÑXÒ”QYRQY’QY’]ÑZ]ÑZYÑZ’YÑZÑQÒYÐZÐ™ÑRRYÐZÐQSYÐZÐ]ÑS’YÐZÐ]ÑSÒYÐZÐYÑTYÐZÐTQT’YÐZÐTQT’YÐZÐPQUYÐZÐPQURTP[PPQURTP[PQURPP\PPQU’Ð\ÐPQU’Ð]PQU’Ð^PQU’P^PQU’PLPPQU’PLÐPQU’PMPQU’PMPQU‘ÝÐNPQU‘ÙÐNPPQUQÙÐJÐPQU‘ÔPPPQUQÐPÐPQUQÐ‘PQUQÐ‘PTQU™Ð‘TQU™Ð‘ÐTQU”P’PYÑT‘”P’PYÑT‘P’Ð]ÑTQP’ÐQSÑ]Ð“P”QS‘]Ð“P”QS‘]Ð“”Q˜™Ñ˜P™Ñ˜™Ñ˜Ñ˜PÑ˜PÑ˜PÑ˜Ñ˜P™Ñ˜Ð”Q™”Q™Q™PQ™PQ™PQ™PQ™PQ™PQ™PQ™PQ™P”Q™”Q™”Q™™Ñ˜ÐÑ˜PÑ˜PÐQ–ÙÑ–ÔQ–ÙÑR‘”P“PÙÑR‘”P“ÙÑR‘™Ð’ÙÑR‘™Ð’ÙÑR‘Ð’PÙÑR‘Ð’ÙÑR‘Ð’ÝÑRQÐ‘ÐÝÑRQÐ‘ÝÑRQÐ‘ÝÑR‘ÐP‘ÙÑRÑÐP‘ÝÑR‘ÐPÐÝÑR‘ÐPÝÑR‘ÐPÝÑR‘ÐPPÝÑR‘ÐPKÐÝÑR‘ÐPJÐÝÑR‘ÐPNQQRQÐPNQQRQÐPNQQRQÐPNQQRQÐPNQQRQÐPNQQRQÐPNQRQÔPMÑQRQÔPMÑQRQÙÐM‘QRQÙÐM‘QR‘ÙÐMQQR‘ÙÐMQQR‘ÝÐX“ÐX‘QR‘ÝÐX“ÐX‘QR’PXSÐXQQR’PXSÐXQQRRPV“ÐXQQRRPV“ÐV‘QRRÐVSÐPVQQRRÐUÓÔPUÑQRRPPUSÙÐUQÑRPPUSÝÐUQÑQÒÐU“ÝÐU‘ÑQÒÐVÙÐVÑQÒPVSÙÐVQÑQÒPV“ÙÐV‘ÑQÑÝÐXSÙÐXQÑQÑÝÐXSÙÐXQÑQÑÝÐV“ÙÐXQÑQ‘ÝÐVSÙÐXQÑQ‘ÙÐVSÝÐVQPQQÝÐU”PVRQUPU’QTTÐTÈ‹˜˜\ÙKMËLHŽˆ’ÝÐTÒÔQUÒÐQVRÑX’™ÑY”QY’QYÒQZ]ÑZ™ÑRYÐZÐQRÒTP[P]ÑSRTP[PYÑSÒPP[ÐYÑTPP[ÐTQT’PP[ÐTQT’PP[ÐPQUPP\PPQUÐ]PQURÐ]ÐPQURÐ^PPQURÐLPQU’ÐLPQU’ÐLÐPQU’PMPPQU’ÐMPPQU’PMÐPQU‘ÝÐNPPQU‘ÙÐKÐPQU‘ÙÐPPQUQÙÐPQUQÙÐÐPQUQÙÐÐPQUQÙÐ‘PQUQÙÐ‘PTQUÙÐ‘PPQUQÝÐ‘PTQUÝÐ‘TQTÒP‘PTQTÒP‘PYÑT‘ÝÐ‘YÑTQÙÐ’]ÑTÔP’QS‘ÔP’QS‘ÐP’Ð”QSQÐP“”QSQÐ“P™ÑS™Ð“™ÑS™Ð“Ð™ÑS”P”™ÑSP”P™Ñ™P™Ñ™P™Ñ™P”Q™Q™ÐQ™ÐQ™ÐQ™ÐQ™ÐQ™ÐQ™ÐQ™Ð”Q™”Q™”Q™”Q™™Ñ™P™Ñ™P™Ñ™PÑ™ÐQ˜ÐÔQRÑP”PÔQRÑ™Ð“ÔQRÒPP‘ÔQRÒÐ‘PÙÑR’Ð‘ÙÑR’Ð‘ÙÑR’Ð‘ÙÑR’Ð‘ÙÑR’ÐÐÙÑR’P‘ÙÑR’PÐÝÑRRPÐÙÑR’PÐÙÑR’PÙÑR’PPÝÑRQÝÐÝÑRRPKÐÝÑRQÝÐKÐÝÑRQÙÐKÐÝÑR‘ÙÐJÐÝÑR‘ÔPJÐÝÑR‘ÔPNQQRQÔPNÝÑR‘ÔPMÑQRQÐPNQRQÐPNQRQÐNQQRQÐNQQRQÐNQQRQÐNQQRQÐNQQRQÐJÑQRQÐPNQQR‘ÔPNQRQÔPNQRQÔPNQRQÙÐMÑQRQÝÐXÓÐPYQRQÝÐX“ÐPYÑRPV“ÔPXÑQRRPXSÔPXÑÑRÐVSÙÐX‘ÑRÐUÓÙÐXQÑRÐUÓÝÐV‘ÑRÐUÓÝÐVQÑRÐVTPVÑRPV”PUÑÑRÝÐXÔÐU‘ÑQÑÙÐXÔÐUÑÑQÑÔPYTÐUÑÑQÑÐPYTÐVQÑRÐPYTÐVQÑRÐPYTPV‘ÑQÑÐPX”PV‘ÑQÑÔPU”PXQÑQ‘ÝÐSÒÙÐP”PV‘PQQPXTQVÑUÔÑU‹˜˜\ÙKMËLˆŽˆ“PTÙÑUÔQU’ÐQVÑV’™ÑX’”QXÒQYR]ÑY’]ÑYÒYÑZYÑZTQZ’TQZÒTQZÒPQ[PQ[ÐQQÒPP[”QRÒPP[YÑ^‘TQLPQL‘ÑM‘ÑNQÑKÑQÑQ‘Q‘‘Q‘ÑQ’QQ’ÑQ“PÝÑ“ÐÝÑ”ÙÑ”PÔQ”ÐÐQ•PÑ•Ð™Ñ–”Q–”Q–Q˜]Ñ˜Ð]Ñ™YÑ™PTQ™ÐPQšPQšPPQšPPQšPQšPQšPQšÐPQšPQšÐPQšÐPQšÐTQšYÑš]ÑšPQšÔQ˜ÐÝÑS’Ð‘ÑQRRÐ‘ÑÑP‘TPP’Ð‘ÒÑ‘ÒÑ‘ÒÑ‘ÒÑ‘ÒPQ‘’PQ‘’PQ‘’PQ‘’TQ‘RTQ‘RTQ‘RTQ‘RTQ‘RTQ‘TQ‘PQ‘PQ‘PQ‘Ñ‘Ñ‘Ñ‘ÑÒÑ‘ÑÒÑÒQÒQÒQ’QRQKÒQJÒQKÑÝÑQÝÑQÙÑÑÙÑÑÔQ‘ÔQ‘QÐQ‘ÑÐQ‘ÑÐQ‘ÑÐQ‘ÑÑ’Ñ’ÑZSÝÐP”PZÑYÔÐYÑÑY”PPYQÑYTPPYÑYTPXÑÑXÔYÐXQÐQX”YÐXQÐQXTYÐXQÐQXTYÐXQÔQV”]ÐVQÔQVTPVÐQVT”PUÑ™ÑVT™ÐUÑ”QV”™ÐVQXT™ÐVQYÑY™ÐV‘TQYT™ÐXQPQY”™ÐX‘PQY”™ÐX‘TQY™ÐX‘TQY™ÐX‘TQXÔÐV‘YÑVÐPV]ÑTÕPTÈ‹˜˜\ÙKMËLÈŽˆ’YÐU’TQVPQV’ÑX’ÑYQYRQYÒQZQZQÝÑZ‘ÝÑZ‘ÙÑ[ÙÑ[ÔQ[QÔQ[‘ÔQ]ÙÑP‘ÔP^™ÑRÔPL”QR‘ÔPL]ÑSQÔPLÐYÑSÑÔPMTQTÔPMTQTQÔPMÐPQTÑÔPNPPQTÑÔPJÐPQTÑÐPPPQUÐPPQUÐPÐPQUQÐP‘PQUQÐP‘PPQUQÐP‘PQUQÐP‘PQUQÔP‘PPQUQÔP‘PPQUQÔP‘PPQUQÙÐ‘PQUQÙÐ‘PQUQÙÐ‘PQUQÙÐ‘PQUQÔP‘PPQUQÔP‘PPQUQÐP‘PQUQÐ‘ÐPQUQÐ‘ÐPQU™Ð’TQTÑ™Ð’YÑT‘”P’PYÑT‘P’]Ñ˜P]ÑT]Ð’ÐQ–”Q–P”Q–P”Q–P™Ñ–™Ñ–™Ñ–Ñ•Ð™Ñ–Ñ•Ð”Q–PQ–]Ñ˜P]Ñ˜P]Ñ˜PYÑ˜YÑ˜]Ñ˜P]Ñ˜P]Ñ˜P]Ñ˜P]Ñ˜PQ–Q–”Q–P”Q–P™Ñ–ÑTÐPQÐKÐÔQRÒÐKÐÔQR’PPÔQR’PKÐÙÑRRPJÐÙÑRRPNPÙÑRRPJÐÙÑRRPNPÙÑR’PNÙÑR’PMÐÙÑR’PMÙÑR’PMÐÙÑR’PMÐÙÑR’PNÝÑRRPNÙÑR’PNÝÑR‘ÝÐJÐÝÑR‘ÝÐJÐÝÑR‘ÝÐJÐÝÑR‘ÝÐJÐÝÑR‘ÙÐKÐÝÑRÑÙÐPÝÑRÑÙÐPÝÑRÑÙÐQQR‘ÙÐQQR‘ÔP‘QR‘ÙÐQQR‘ÙÐYÓÝÐYÑQR‘ÙÐY“ÝÐYÑQR‘ÙÐY”PY‘QR‘ÝÐYTPY‘QR‘ÝÐYTPYQQRQÝÐYTPYQQRQÝÐYÐYQRRPXÔÐXÑQRRPXÔPPX‘QRRPXTPPX‘QRRPXTTPXQÑRÐVTTPXQÑRÐVTTPXQÑRÐUÔYÐVQÑRÐUÔYÐVÑRÐU”]ÐUÑÑRÐUÔPU‘ÑRÐV”PU‘ÑRPV””PU‘ÑRÝÐXT”PUÑÑRÙÐX”PVQÑRÔPXÔPVQÑRÐPYPV‘ÑQÑÐPYPV‘ÑQÑÐPYPV‘ÑQÑÐPX”PV‘ÑQÑÐPXTPV‘PQQ‘ÔPU””PVQTQQÝÐT””PVRQSÔ™ÐU”ÐQTÈ‹˜˜\ÙKMËMŽˆ˜ÔPTØÑU˜™ÑV”QV˜QX˜]ÑYYÑYXTQYØPQZVÑZÖÑZÖÑZÖÑ[™Ñ[V™Ñ[V™Ñ[–™Ñ[–™Ñ[”™ÑQÖ”P[Ô”QRV”P[ÔQRÖ”P[Ô]ÑS–”P[ÔYÑSÖ”P\TTQTV”P\ÔTQTVP]”PQTÖ]Ð^PQTÖ]Ð^”PQTÖ]ÐLTPQTÖ]ÐLTÑUV]ÐLTÑUV]ÐLTÑUV]ÐLTÑU–PLÑU–PLÑU–PLÑU–PLÑU–PLÑU–PLÑUVPLPQUPLPQU]ÐLTPQU]ÐLTPQUYÐL”PQUYÐL”TQTÖTPLÔTQT–PPMYÑTVÐMTYÑTÐM”]ÑSÖÐM”]ÑSÖPMÔ]ÑS–PNQSVPN”QSÝÐNT”QSÙÐJÔ”QSÔPKÔ”QSÐPT™ÑRÕÐ”™ÑS™ÐÔ™ÑSU”P‘™Ñ”Ô”Q•Q•T]Ñ•”]Ñ•”Q•TQ•TQ•TQ•T]Ñ•”]Ñ•”]Ñ•”Q•TQ•T”Q•™Ñ”Ô™Ñ”ÔÑ””ÑRÕÐPTÐQR•ÔPKÔÐQR•ÙÐJÔÐQR–PNÐQR–PNÔQRVPNÔQRVPNÔQR–PNÔQR•ÝÐNTÔQR•ÝÐNTÔQR•ÙÐJÔÔQR•ÙÐJÔÙÑRUÔPKÔÙÑRUÔPKÔÙÑRUÐPTÙÑRUÐPTÙÑRUÐ”ÙÑRUÐ”ÙÑRUÐ”ÙÑRUÐ”ÙÑRUÐ”ÙÑRUÐ”ÝÑRÐPKÔÝÑRÔPNTÝÑRÔPNTÝÑRÔPNÝÑRÙÐMÔÝÑRUÝÐM”ÝÑRUÝÐM”ÝÑRVPXYPPYÝÑRVPV™TPXÔÝÑRVÐVYTPXÔÝÑRVÐUÙYÐX”ÝÑRVPPU™]ÐV”ÝÑRVPPU™]ÐV•QRPV™]ÐV•QRPX™PVUQRÝÐXÙ™ÐUÕQRÙÐYÐUÕQQÕÔPYY™ÐVQRÔPYY”PVUQRÐPYY”PVUQRÔPXÙPV•QQÕÔPXYPV•QQÕÔPUÙPV•QQÕÙÐT™PV•QQ•ÝÐSÙPVUÑQVPQÖ”PP™PVÑPÙ”PU™™ÑUH‹˜˜\ÙKMËMHŽˆ–PSÕÙÑTÕÔQU•ÐQVÑV™”PP™ÐP”ÐQR™ÐX™TPTÔÑR•”PYYÐU””QSU”PM”QS•PM”QTPMÔ]Ñ“”]Ñ“ÔYÑ”YÑ”TTQ””TQ””TQ””PQ”ÔPQ”ÔPQ”ÔPQ”ÔPQ”ÔPQ”ÔPQ•PQ•PQ•PQ•TTQ•”YÑ•”YÑ–YÑ–YÑ–]Ñ•ÔQ•”Q•”Q•””Q•T”Q•T”Q•T™Ñ•™Ñ•Ñ”ÔÑ”ÔÐQ””ÐQS•ÐÔÔQSUÔPTÔQSUÝÐJÔÔQSUÝÐJÔÙÑSÙÐKÔÙÑSÙÐKÔÙÑSÔPTÙÑSÐP”ÙÑSÐÔÝÑRÕÐÔÝÑRÕ™Ð‘ÝÑ“ÔÝÑ“ÔÝÑ“ÔÝÑ“ÔÝÑ“ÔÙÑ”ÔQ”TÔQ”TÔQ”TÐQ””ÐQ””ÔQ”TÔQ”TÔQ”TÔQ”TÔQ”TÔQ”TÔQ”TÙÑ”ÙÑ”ÝÑ“ÕQ“•Q“UÑ“ÑR•ÔPUÑR–PNUÑR–PNÑR–PNUÑR–PNUÑR–PNUÑR•ÝÐJÕÑR•ÝÐJÕPQRUÙÐKÕPQRUÙÐKÕPQRUÔPUPQRUÔPUPQRUÔPUPQRUÔPUPQ’•PQ’•PQ’•PQ’•PQ’•PQ’•TQ’UTQ’UTQ’UTQ’TQ‘ÕTQ‘UTQÕYÑÕYÑÕYÑ‘YÑ‘YÑ‘YÑ‘]ÑY™PYÕ]ÑY™PY•]ÑY™ÐYU]ÑYYÐY]ÑYÐX•]ÑYPPXU]ÑXÙTPV•]ÑX™YÐV•]ÑX™PVUYÑXÙPVUTQYPV•PQYYPXUÑYÙ]ÐX•ÑYÙ]ÐX•ÑYÙYÐXÕÑY™TPYPQYTPYTQX™TPXÕYÑT™TPXUÑP•ÔPP•ÝÐPÙYÐVY]ÑU™QTÈ‹˜˜\ÙKMËMˆŽˆ–TPT–PQUVÑVQV–QX•ÝÑXÕTQ[•Ñ\UQ\ÔÙÑ]”ÐQ^T™ÑL]ÑMTQM”PQMÔÑNÑNTQKÔQSÝÑ“ÙÑ‘SÔQ’ÐQ’“ÐQ“ÐQ“SÐQ““ÐQ“ÓÐQ”ÐQ”SÔQ”SÔQ”“ÙÑ”“ÝÑ”“ÝÑ””Q””Ñ”Ñ”TÑ””Ñ”ÔÑ”ÔÑ”ÔÑ”ÔÑ”ÔÑ•PQ”ÔTQ””YÑ”TQ”™Ñ“”Ñ“TÑ“TÑ“TÑ“TÑ“TÑ“TÑ“TÑ“TÑ“TÑ“TÑ“TÑ“TÑ“TÑ“TÑ“TÑ“TÐQ’ÔÐQ“ÐQ“ÐQ’ÔÐQ’”ÐQ’ÔÔQ’TÔQ’ÙÑ’ÙÑ‘ÔÝÑ‘TÝÑ‘TÝÑ‘ÝÑ‘ÝÑÔÙÑ‘ÙÑ‘ÙÑÔÔQÔÙÑTÝÑJÕQNUQMÕQMÕQM•QMÕQMÕQMÕQMÕQMÕQMÕQMÔÝÑNÝÑNÝÑNÝÑNÝÑNÝÑNÝÑNQMÕQM•QYX]ÐXÕQXØ]ÐXÕQXØ]ÐXÕQXØPXUÑXXPX•ÑXX”PV•ÑV˜”PV•ÑVX™ÐVUPQV™ÐVTQU˜™ÐVTQU˜ÐUÕPQUØÐPU•ÑVÔPU•QV˜ÐPUÕQX˜ÐPVQXXÐPVTÝÑXØÐPV”ÙÑXØÐPV”ÔQYÐPV”ÔQXØÐPV”ÙÑVXÐPV”ÙÑUØÔPVUQUÙÐVQTXÝÐU™QU‹˜˜\ÙKMËMÈŽˆ’PSÒYÑTÒPQU’ÑVÑV’ÑXRQXÒQYQÝÑY‘ÝÑYÐÑQÑÙÐZ”QR‘ÙÐZPQSQÔPZÐ]ÑSÑÔPZÐYÑTQÐP\PQYÑTQÐP]TÝÐRTQTÑÐP^TÝÐRPTQUÐPMÐTQTÑÐPMÐTQUQÐPMÐPQU‘ÐPMÐPQU‘ÐPMÐPQUÑÐPMÐPQUÑÐPMÐPQUÑÐPNPQUÑÐJÐPQUÑÐKÐPQ–PQ–PPQ–PQ–PQ˜PTQ–TQUQ™Ð‘TQUQÐ‘TQUQÐ‘TQUQÐP‘YÑUÐP‘YÑUÐ’YÑTÑÐ’]ÑT‘™Ð’P]ÑT‘™Ð’QT”P’Ð”QSÑ”P“”QSÑ”P“™ÑS‘P“PÑSQP“PÑSP“PÑSP“PÐQ–PÐQ–PÐQ–PÐQ–PÔQ–ÔQ–ÔQ–ÔQ–ÔQ–ÐQ–PÐQ–PÑ–Ñ–Ñ–Ñ–Ñ–Ñ–Ñ–Ñ–Ñ–Ñ–PÑ–PÑ–PÐQ•ÐÐQ•ÐÔQ•PÝÑ”ÑQTRPKÑQSÒPKÑQRRPNQQRRPJÑQR’PJÑQRRPNQQRQÝÐNQQRQÝÐNQRQÝÐNQRQÙÐNQRQÙÐNÑRÙÐMÑÑRÙÐMÑÑRÙÐMÑÑRQÙÐNÑRQÙÐNÑR‘ÔPNQÑR‘ÔPNQÑRQÐPJÑÑRQÐPKÑÑRQÐPKÑÑRQÐPKÑÑ’QÑ’‘Ñ’‘Ñ’‘Ñ’‘Ñ’‘Ñ[ÓÔPY‘PQRÐPYSÙÐYQPQRÐPYSÙÐYQPQRÔPYÝÐXÑPQRÔPYÝÐYPQRÙÐX”PX‘PQRÙÐXTPX‘TQQÑÙÐXTPXQPQRÝÐV”ÐV‘TQQÑÝÐV”ÐVTQRPVÐVTQRPU”PPU‘TQRÐUTTPUQTQRPUÔ]ÐUTQRÝÐVTYÐU‘TQRÙÐV”YÐU‘TQZTTPVTQZTTPVQTQZTPPV‘TQZTPPXQTQZTPPXQYÑYÔPPXQYÑYTPV‘YÑX”TPVQ]ÑVTYÐUÑQQÐPTÐPP”]ÐU’ÑRTPU‹›[Ý[Û‹LLŽˆ˜YÐQPQQ™PSÖÑQ˜ÔPTÖ™ÑQØ™ÐU–”QQØPUÖQQØ]ÐU–]ÑQØYÐUVYÑX–YÑX–TQX–PQX–PQXVÑX–ÑXYÔQPPÑ‘ÛÐPVPVPPPLYPTœPP•™U˜ÐU•ÐTS˜QTV˜ÐQÐUQ–UQ–UVUVPUÐTR–QÐTT•ÐQÐTV•Q“PTU•PQ“PTU•QJÐTS“PU•QNPT^QÎUYÎPU[ÊÐU]PU\U\U[ÎU‘MPU•LÐU™ÌUÌUŒUÍU›ÍU˜ÎU\ÊÐUVMU[ÍULÐUMUNPU^PU“]ÐUMPTPQSÑ”ÔQPP^L•RRPPQ\ÐU\ÐUNU\PU\U‘\U[ÐU‘[U‘[PU‘[PU[PU[PU[PU‘[U’[U“[U”[U•[U–[U˜ÛU™ÛPU›ÛPUœÛPUœÛPUÛUŒUUUUUUUÐUŽUPUŽUÑZUÐYÐUÑYÐUÑYPUÒYUÔXÐUÕXUÖXUÖXPUÖVUÖVUÕVPUÕVPUÔVPUÓVUÑXPUŽPUŽUŽPUŽPUPUŒPUÖUœÖUšØPU˜ØPU–XU“XÐU“YU’YPUYUYÐUMUYU‘YU‘YÐU‘ZUZPUZU‘ZÐU’[PU‘[ÐU\ÐULUMU\ÐU’\U•\PU˜ÜPUšÜUœÜUÛUÑ[PUÔ[PUÖ[UÙÚÐUÜÚUÌPVZVYÐVYÐVYVÙVÙVÙVØÐVPVPP‘ÔQÐT™Ð™ÝÑVVTP‘™ÑÑT–P“Õ’PTÔ–P“ŒRPTÚP“ŒSPTÔ”P“ŒRPTÚP“ŒRPTÚP“ŒRPTÚP“›PQŽP‘ÖPSšP“›PQÐPP[XÐS”P“›PPÌ™ÐSN“•”PPÛ\ÐSYÍ“•–PPŒÐSTM“‘˜ÐP›MSÌ“‘šÐPLÑPS]Ð“LÒPS\Ð“[’PS\Ð“[“PRÝÛÐ“[”PRÙÛÐ“[•PRÔZÐ“[•PRÙÚÐ“[•PRÙÚÐ“[•PRÙÚÐ“VPRÝÚÐ“RPRÙÚÐ“ÕPRÙÚÐ“PRÝÛÐ“PRÙÛÐ’ÌÕPRÔ[Ð’ÌÕPRÔ\Ð’ÖPRÜÐ’ÒPRÝÐ’ŒØÐR™ÜÐ’ŒÙÐR]Ð’››ÐRYÝÐ’–ÐRP]Ð’’ÐRÜÐ’’R[Ð’’R[Ð’MPPšÒÐTÑÐPTPVÙÑYÔQPQÐZÐ‘ÖRPP˜ÒTšQTPUÐÔQVÝÑPQ™ÙÐ‘PP•RPT™QPTPUÐQUÚQPQXÐ‘›ÕPP”QÐT˜QÐTPUP™ÑUšÑPQ”VP‘–VPP–QT•ÑÐTPV”QUZQPQÔTP‘–UPP›ÑPT•ÑTPX]ÑUÚQPRRP‘›ÕPPŒÐT˜QTPYÐYÑUÚQPRYÑP‘PPÔPPTšQTP[PQVšQPR™ÐP‘ÖVPPÕPPT›QÐTP[PQVšÑPRPP‘Ö[ÐPÑPPTšTPTPXPQVÑPQ]ÒP‘’›ÐPL›ÐTPP”QT[”QPPÔOOH‹›[Ý[Û‹LLHŽˆ–PQ˜PU]ÑQ˜YÐU–YÑQ˜PPUÖTQQ–ÐU–PQX–PQV–ÑXVÑXVÑV–ÑVVQVVQVY]ÐQ•ÙÑXYÐTUÔQXYPVUÐQL•]ÑQÐPMYÑQ•ÐPMUYÑU]Ñ•QU”QKÕQNÔQPÕPMÐQQ•]ÐLÔÐQQÕTPLÔÔQQÕPPLÔÙÑM”ÙÑM“ÙÑPÔPSÙÐMÔQ’SÔQ’“ÙÑ“Q“Q“Ñ“QPÔPP“Ñ•“]Ñ˜SYÑ˜ÓTQ™STQ™SYÑ™SQ˜Ó™Ñ˜SÐQ”™ÑPPUÐ”žœÐ”žšÐ”ÑÐ”Ú˜Ð”Þ•P•P•P•TÍ•PÝÐ•ÌPÛÐ•RPZZÐ•PÙÐ•PØÐ•PÖP•PÖP•VP•VP•UP•UP•ÔP•PÔP•ZTP•^TP•ÓP•šRP•ÐÒP•ÔÒP•ÚRP•ÞRP–ÒP–ÓP•ÞTP•ÚTP•ÚTP•ÚTP•ÚTP•ÞSP–ÓP–ÓP–ÒP–ÒP–ÒP–ÒP–ÒP–ÒP–ÓP•ÞSP•ÚSP•ÔÓP•ÔÓP•ÔÓP•ÐÓP•ÐÓP•ÐÓP•ÐÓP•ÐÓP•ÐÓP•ÐÓP•žSP•žSP•šSP•šTP•ÕP•^VP•ZXÐ•PÙÐ•[Ð•ÜÐ”ÞL”ÔÍ”ÐÎ”š‘P”^’P”UP”“P”“P”P”P“Þ’P“Ú’P“ÕP“ÚP“ÞP”P”N”PÎ”TÎ”ZM”^M”šL”ÞL•ÝÐ•\Ð•Z\Ð•ÛÐ•šZÐ•ÔÙÐ–ØÐ–PÖP–ZUP–”ÔP˜PÓP˜ZSP˜ÒP˜šQP˜ÐÐP˜ÚPP˜Þ™Ž™™™PÐ™ZÐ™”šÐ™šÐ™ÔQUÐVRP‘™ÑÐÐT•P™ÝÑUVSP‘”QMÐ’ÑQMÐ“]ÑMÐ“YÑMP“QTQMP“QPQLÕÐUVPL‘PQLUÐT–™ÐLÑLUTPSØPP^‘ÑLU]ÐRPP˜YÐ^QLU”PQX”P]QQLÐ]ÝÑLÐP\ÐÝÑLÐP\ÐÙÑ^˜ÔP\ÐÙÑ^XÙÐ\ÔQ^XÙÐ\ÔQ^ÝÐ\PÔQ^ÝÐ\ÔQ^ÝÐ\ÔQ]ØÝÐ\ÔQ]ØÙÐ\ÔQ]˜ÙÐ\ÔQ]XÝÐ\ÙÑ\˜ÙÐ\PÙÑ\XÝÐ[ÐÝÑ\ÝÐ[ÐÝÑ[ÙP[PÝÑ[ÙPZ‘Q[YÐZQ[YPPYÝÑ[YTPYPÙÑ[YYÐXÐÙÑ[]ÐXÙÑZÙ”PVÙÑZ™™ÐVPÔQYÙ™ÐVPÔQX™ÐVÔQV™ÐQPQ™ÙÐ‘ÖPPP–RT›PPTPUÐÐQVÔQPQ”XÐ‘PP•QÐT™PÐTPUP™ÑUÙÙÑPQ”VP‘–SPP•QT•ÑTPUÐ”QU™ÝÑPQÔP‘–RPPšÑPT•ÐÐTPXPQU™ÙÑPQÝÓP‘–RPPÐÐT™PÐTPYYÑUÙÙÑPRÑP‘ÒRPPÑPTšPÐTPZPPQV™ÙÑPR]ÐP‘ÖRPPÔPPT›PÐTP[PQV™ÝÑPRPP‘ÖTPPÓPPT›QÐTPZPQVZPQPRÐP‘SPP“PT•ÕTPSÐYÑUÑPPVœÐPYÏH‹›[Ý[Û‹LLˆŽˆ–ÐPØÐT–™ÑQX™ÐU”QQ˜]ÐU–QXV]ÑXVYÑV–TQV–PQV–ÑV–ÑVVÑV–ÑV•ÔQP–PV•ÐQQPV•ÑYYYÐP™PRÕÑQVPVYÐUÑL•ÑLÕÑMÑPÕÐMÕÑQÕÐNUÑRUÐJÕÑ‘•YÑKÚÙÑPPU“P“ÛÍPQ•PUÐUUPU”U“ÐU“UMTMSPQÌT““QÌU’LÐU’MPU’MU’MÐU“MU•MU™ÌUœÞPUŽUÐ^PU–LU’LPULÐU[ÍU[ÍUYÍPTRNQXÌU]ÌPULU]ÌÐUUŠÐPTMUTŠÐPTMPUR‹ÐPRMUR^UXÞPUXÝÐUYÝPUYÜU\ÜPU]ÜU]ÛÐULÐULUNU[PU‘[PU’[PU’[PU“[U•[U–[U–[U–[U˜ÛU™ÛU™ÛUšÛPU™ÛPU™ÛU˜ÛU˜ÛU˜ÛU˜ÛU˜ÛU–[U–[U–[U–[ÐU–[ÐU–[ÐU˜ÛÐU˜ÛÐU˜ÛÐU˜ÛÐU˜ÜU–\U–\U–\U–\U•\U–\U–\U–\U–\U–\PU•\PU•\U”\U”\ÐU“]U‘]UNÐUMUNU]U]U]U]U‘]PU“]PU“]U”]U”\ÐU”\ÐU”\U”\U’\PU“\PU“\PU’\PU‘\U‘\UNÐUNÐUNU’[U“[U•[PUšÛUÛUÐUÑZUÓZUÔZPUÙÚUÛÚUÜÙÐUÌUÎPVYPVYVYVXVÖVÖPVÖVÐVVVVPVPP‘QÐPT“P™ÔQTÐVRP‘TQLÔÔP“QPQLÔÔP“QPQLTÔPUVPPLQÑLTÙÐT–P^QÑLUPRÕÐPP–™Ð]ÑQLUÐRVÐ]‘QLUPPQXTP]PÝÑLX]Ð\ÐÙÑLXP\ÙÑL”P\PÙÑ^˜”P\PÔQ^X™Ð\PÔQ^™Ð\PÔQ^™Ð\PÔQ^™Ð\PÔQ^™Ð\PÔQ]Ø™Ð\PÔQ]˜™Ð\PÔQ]˜™Ð\ÙÑ]™Ð\ÙÑ\˜Ð[ÐÙÑ\˜Ð[ÝÑ\ÐP[PÝÑ[ØÔPZÑQ[˜ÝÐZQ[YPYÝÑ[YPYÝÑ[ÐXÐÙÑ[ÐXÙÑ[PPXPÙÑZÙTPVÔQZÝÐP™TPVPÔQYÙYÐVÐQYÙYÐVÐQV™]ÐUÐÐQVYPUÑVY”PUPÑV”PUÑU™™ÐUP™ÑU™™ÐU™ÑUY™ÐUÐ™ÑUÐUÐ™ÑUÐV”QUY™ÐVQUY™ÐXPQUY”PXÐQUY”PY]ÑU™”PYP]ÑU™”PYYÑUÙ”PZPTQV”PZÐTQV”P[PQVY”P[PPQVY™Ð[PPQV™™Ð[PPQV™Ð[PQV™ÐQPRPP‘ÖRPPÒPPTšSTPPšÑPQQP‘œPPQPT’ÖTPRH‹›[Ý[Û‹LLÈŽˆ˜ÐPT™ÑPØ”PTÖ™ÑQ]ÐUQV–]ÑVVYÑVVTQVVTQVPQVVPQVÑVÑVUÔQPÖPVY”PQUÔQPÖPVYÐS•ÐQQPVYPPUÐQX™ÐVÐQX™PXUÐQXYPX•YÑQÐM•TQYØÙÐZTQ‘UYÑ‘]ÑJÕ”QMU™ÑL•QL•YÑL•QM•QMZ]ÑPPU[Ð”žœÐšÚÐTÕÐ‘YÐTÚ›Ð•žœÐ•”Õ•P••P•ÞP–P–’P–P•Þ–P•Ú™Ð•ÕÐ•ÕÐ•žÐ•LPUNUUMU[ÌUMUNUMÐU\ÍPUZÍÐUXÎPUUJÐUJÐPTKÐUKÐPSJÐUPTPPÔQJÔQJÓÝÑJÓÙÑJÓÔQJÓÐQJÓÑKÓ™ÑS”QSQÓ]Ñ‘]Ñ‘SYÑ‘ÓYÑ‘ÓYÑ’TQ’“TQ’“TQ’ÓPQ“PQ“PQ“SÑ“ÓÑ”Ñ”SÑ”“Ñ”“Ñ”ÓÑ”ÛPQPPšN•œÐPZÝU™UTPS“Ñ–ZÝÑPQPÎ•Ö’PP“]UœRÐTPPÚÔQPQ”Î™PÎ™PÎ™TÎ™ZN™ZN™ZN™ZN™ZN™ZN™ZM™^M™^M™^M™^M™^M™ZN“›YÐTP“•ÜÐSÞP“•ÌSÕP“LÐPPVPSQP“VÐS“P“RRÑP“RR•P“PPÒ^PTÊÒPTPPšYÑPQž’P“ÐP•^PTÊÓPTPUYÑ]š™ÑPQQP“RNPMUÔTPSPQ^›QPP‘P“Î“”Î“šM“ÐÍ“ÚL”Ì”L”PÝÐ”^L”ÝÐ”ž\Ð”Ú\Ð•ÛÐ•ZÐ•ZZÐ•ÚÐ•šYÐ•ÔØÐ–ÖP–UP–ZTP–ÓP–žRP˜ZRP˜^QP˜”ÐP˜žPP˜ž˜ÔŽ˜Ú˜Þ˜ÞÐ™Ð™P™Ð™^Ð™–P™”•P™šP™žP™ÐQUPVPP‘]ÑÐT’P™ÙÑTVSP‘PQÑPTN“ÕZÐUN“ÑZÐQ‘ÑPSM“ŒÐQ[SPS]Í“•]ÐQ–PSP]Ð“šÍPÑÙÐSÝÐ“‘‘PP‘ÛÐS\Ð“‘ÜÐS[Ð“•ÝÐRÝÛÐ“‘ÍRÔZÐ“LRÔZÐ“[MRÙÚÐ“UÍRÙÚÐ“UÌRÝÚÐ“UÌRÝÚÐ“UÌRÝÚÐ“QÌRÝÚÐ“ŒRÝÛÐ“ÌRÙÛÐ“ÌRÙÛÐ’ÛMRÐ\Ð’ÕÍRÝÐ’ŒŽR™ÜÐ’ÒPR]Ð’–PRYÝÐ’–PRÜÐ’–PR[Ð’–PR[Ð’–ÐQÙÛÐ’LÙÐQÔZÐ’VÐQÚÐ’ÚÐQÙÐ‘ÞTPPVÐQ™ØÐ‘ÛœÐQ”XÐ‘ÖÐQ”XÐ‘ÒÐQ”VP‘ÒÐQVP‘ŒÝÐQ”VP‘›ŒQUP‘›ŒQ”UP‘–Q™ÔP‘–QÔP‘–QÐSP‘›ŒQÙÓP‘›ÐRSP‘–ÐRRP‘›ÐRÒP‘›ÐRPQP‘ŒÝÐRYÐP‘ÖÐRPP‘ÖÐR”PP‘ÖÐR™ÐP‘ÖÐRÐP‘ÖÐRÐP‘ÖRÐP‘ÖRPP‘ÖQPPÒPPT™STPUÐTQUÚÑPQ]ÕP‘VPPNH‹›[Ý[Û‹LMŽˆ˜™ÐTV™ÑPØPT–”QQX]ÐTVQVQUÖ]ÑUÖYÑUÖYÑUÖTQUÖÑVVQXUÝÑX•ÔQXÕÐQYÐQUÐQXÙ]ÐSUÑYPPUÑXÙÐUÕÑXÙPXU]ÑQÐMYÑU]ÑUQ•”Q•™ÑU”QKÕ]ÑNÔQQTPMÔÐQ”ÐQKÔÔQNSÝÑQ”TPP”ÙÐM“ÙÑS•PLÓÙÑTTÝÐLÓÝÑ‘”Q’ÝÑ“Q”ÚÑPPUP•ÔÎ•ÞP•ÚP•Þ“P•ÕP•ÕÐ•ž™Ð•ž›Ð•šÐ••Ð•YÐPQÒÐTPQÓÑ””QPP^“P•“P•”P••PUÐTÞ™Ð”Ú›Ð”ÑÐ”•”ŒP‘”P^Œ”PUÐ”Ð”Ð“Þ›Ð”Ð”Ð”Ð”–P”–P”P”RPPVLUšTPR“QJÛÑPQP”RPMUSÙPTPSÓ]Ñ‘[™ÑPQ“P”œPNPUZXÐTPTSYÑ“Û]ÑPQUP•–œÐP‘^UšXTPT“TQ˜›YÑPQZP–ÐP’]ÐUØXPTPTÓPQŽPQŽPQŽPQŽPQŽPQŽPQŽPQÓPQÓPQ“PQ“PQSPQPQPQPQPQÑSÑ“ÑMTP“ÑM]ÐSÑLØ™ÐNSÑL˜ÝÐMÑL™TPVZÝÑPP’šÐP‘]ÐUÐP]XTPSÓPQLÑPPÕP“Z’P“UP“”P“P“P“P“P“P“P“P“P““P“QP“Z‘P“^‘P“‘P“žP“ÕP“ÚP”P”Î”TÎ”^M”šM”ÐÌ•Ì•ÝÐ•PÝÐ•Z]Ð•ÛÐ•ÐÚÐ•ÞZÐ–ÙÐ–PØÐ–ZXÐ–ÖP–šUP˜PÔP˜ZSP˜ÓP˜”ÒP˜žQP˜ÔÐP˜ÚPP˜Þ™Ð™PœÐ™T›Ð™ZÐ™^Ð™™Ð™™Ð™”˜Ð™šP™žP™ÐQUPVQP‘]ÑÑT’P“Ñ\ÐTÞP“Ñ]ÐQ‘ÒPSP“ŒQUÕPSYÍ“ÑMQXÐSPL“ŒPPPÛ[ÐSÌ“›PP‘ÝÐS]Ð“›]ÐS\Ð“›LRÝÜÐ“•ÍRÙÜÐ“‘ÍRÝÜÐ“[MRÝÜÐ“UÍRÝÜÐ“UÍRÝÜÐ“UÍRÝÜÐ“QÍRÝÜÐ“QÍRÝÜÐ“RÝÝÐ“ÍRÙÜÐ“ÎRÔ]Ð’ÛPRÝÐ’ÖPR™ÝÐ’ÒPR]Ð’ÒPRYÝÐ’ŒÔPRP\Ð’ŒÕPRÜÐ’›–PR[Ð’›™ÐQÝÛÐ’–ÐQÔ[Ð’’ÐQÔ[Ð’[œÐQÐZÐ’RÐQÙÐ’ÕPPVÐQØÐ‘ÛŒQ™ØÐ‘ÒQ™ØÐ‘ŒÌQ™ÖP‘ŒÍQ”VP‘›Q”VP‘–Q”UP‘–Q™ÔP‘–QÔP‘–QÐTP‘’QÔSP‘–QÝÒP‘›ŽRRP‘›RÒP‘›RÑP‘ŒÍRPPP‘ÒR]ÐP‘ÒR”PP‘ÒR™ÐP‘ÒRÐP‘ÖRÐP‘ÖPPPÖPPT›PTP[PQVYÝÑPRPP‘PPÒPÐT”ÔTPUÐQTšÔQPPV“PP‘OH‹›[Ý[Û‹LMHŽˆ–™ÐPØÐSÖ”QQX”PTV”QQX]ÐTÖ]ÑV–YÑVVTQVVPQVVÑVVÑVVÑVUÙÑP–ÐVUÔQQPVUÔQPÖPVUÐQXÙ]ÐQÕÑXÙPPTUÐQX™PUÕTQQÐX™PVUPQQ•ÐLÕPQKÕTQKÕYÑTÙÑQ]ÐTÔQQ•”PKÔÔQQÕ]ÐNZÔQPPZÛÐ›PSÌÐ”UUPZÜÐTTP•]ÐSÚÕP”Z›ÐšÖPT•P‘QXÐT•P•ÚP•Ú‘P•š’P•ž”P•š–P••Ð••Ð••Ð•‘Ð•‘•Z–PUÐPUÐUš‘PUPVP•ÒZÐPQÓTPP“PQ•“TQ•YÑ”“”Q”Ñ““ÙÑ’ÔQ’TQY™ÐQÛÔQPPšœÐ”[ÐPPTÙTPR“Ñ‘ÙÐQPP’P\ÌÐUUÐTPPÛ”QPQÐ”’ŒPLÐUPØÐTPSÔQN[QPQÐ”œÐPMÐU˜TPTSÙÑKÛYÑPQUÐ”[ÐP‘MU
ÖTPTÓÑJÛTQPQZ˜Ð”ÐP’LU–PTPU”Q“[PQPQ^”P•XÐP”LU”ÖTPUS]Ñ™ÙÑPQÕP™QP™QP™’P™‘P™‘P™‘P™P™P™P™P™N™PÎ™PÎ™TÍ™^M™Í™Í™^M™^M™ZM™TÍ™PÍ˜M\ÐPQÙTPP›ÔQPPTÍ–šM–ÌPQ]PUPÓ]UPPŒUPQŒPPLUŽPQ\ÐUÜÐU]U\ÐU\ÐU\ÐU]U]U]U]PU]TÍTÌTÝÝTÜÝTÜÝTÜÝTÜÝTÜÝPTÝÝPTÌTÎU\ÐU\ÐU\U\U\PUÜPUÜPUÜUUQ\US[ÐUV[ÐUYÛU\ÛUMPU‘[U”[U–ZÐU™ÚÐU›ÚUŒUŽPUÒZPUÓZUÕYÐUÚÙUÜÙPUÌPUÍUÎVYVXÐVXVXPVVVÕVÕPVÕVÐVÐVVVPVQP‘ÑÐÐTM™ÝÑSÐUQ[ÓUQ\ÓPUP“™QSUPP‘™ÐQRÐUÐPMZPQRU“PP[ÐQRU”PT›PÌPU›ÐPÌUœPÝÒUœPÜÑÐUœPÜÒUœPÜÑÐUœPÜÑÐUœPÜÒUœPÜÒUœPÜÒUœPÜÒTÎ\PÜÒTÍ\PÛÒPTÞÐPÚÒPTÜÐPÙÒPTÜPØÒTÚPPÕRTÚPÓRTÙPŽTÖžPŒTÕŒPÒPTÖŒPÒPTÕŒPšÒPTÓŒÐPšÒTÒP™ÒTŽMPP˜ÑÐTœP–QÐT›ÐP•QT›ÐP•QT›P•QTšP•QPTšP”QPT–ŽPP•QPT•ŽPP–QPT•ŽPP™ÑT–ŠÐP™ÑT•ŠÐPšÑT•ŽPPœÐÐT–ŽPPÐÐT–ŽPÐT–ŽPPT™PÑPT™PÓPPTšPÕPPTšPØÐPTšPPØÐPT›PPÙÐPT›
ÐPØÐPT›ÐPÖPPT›PTPZÐPQVZQPRTPP‘ÒLP–PPT™TPTPTYÑUZÙÑPQÕP‘POOH‹›[Ý[Û‹LMˆŽˆ˜ÝÐTXÔQT˜ÑTØ™ÑTÖ™ÑPØ”PTÖ”QQXPTÖQQX]ÐU]ÑQ˜YÐU]ÑQXTPUYÑQ˜PPUVYÑV–TQXVTQV–QPÖPPXUÝÑQVPPXYÔQPPŒ\Ð‘ÐPQÖQQ–PUœÐP‘ÐPQÖÐQ••P‘œÐSŒUP”P”Ð”ZÐ”Ð”ZÐ”Q™Ð”U–P”PU•PSÌLTPSÌ”ŒZÓPPUNTÐ‘PSÚÐ•”ÕPP”ÑZÒPTÑÐ•UP•ž’P–P–P–P–Ð•Ú›Ð•ÑÐ•Ñ•š••”Ú”ÑÐ”Ú–P•UP•UÐ•Ð•ØÐPRNPU\[PTPRÑ™ÙÑPP˜TPP\PUPÑTPQ[ÝÑPPÌP”ÔPPRÚPTPS”PQJÛÙÑPQ”RPPM
ÐU
ÚPTPS”Q[ÔQPQÐ”XPPPMÐUQÙTPT“ÙÑ›ÑPQUÐ”RP’MUPÙPTPTÓÑ›™ÑPQZ˜Ð”RÐP–QPPQÑTPP›™ÑPQZ–P•VŒP“LPU”ÙTPU”Q•Û”QPQ^”P–ÐPQØÐTPUS”QÓQÓQÓ]ÑÓ]ÑÓYÑÓYÑÓYÑÓTQŽTQŽTQÓTQŽPQŽSPQŠÓPQŠÓPQ‹ÓPQ‹ÓPQ‹ÓPQŠÓPQŠÓÑŠÓÑœÛÙÑPPÔÎ“ÕÚÐRRPPSÛTPQ“ÑMPYÓÑLØ™ÐRÙTPTÑM”PQ“ÑLÓÑLÓÑLÓÑL“ÑLSÑLSÑLÑ^“Ñ^SÑ^Ñ]ÓPQ]STQ]TQ]TQ\ÓTQ\“TQ\“TQ\“TQ\“TQ\“PQ\ÓPQ]Ñ]“Ñ]ÓÑ^Q^SQ^“QLQMQMRÝÑMÒÝÑNÝÑ’ÝÑ‘ÝÑ‘’ÙÑ’RÔQ“RÔQ“ÒÐQ”’ÐQ•Ñ•ÒÑ–™Ñ˜R”Q™Q™Ò]Ñš’]Ñ›YÑ›’TQœRPQœÒPQÑ’Ñ’ÑžÑžQž’Qž‘ÝÑŒQÔQÑÑ™ÑŽ”QŽQQŠÑQŠÑ]Ñ‹Ñ]Ñ‹ÑYÑÐT‘P™ÙÑTPVSP‘ÑÑTM“ÕYÐUM“ÑZÐQ‘ÐPSL“Ñ[ÐQ[SPSYÝÐ“Ñ]ÐQ”PST\Ð“ŒPÌ–PSÛÐ“›PP›ZÐS[Ð“•ÛÐSZÐ“•ÜÐSZÐ“•ÌRÙÙÐ“•ÌRÙÙÐ“LŒRÝÙÐ“[LRÝÙÐ“[LRÝÙÐ“UÌRÝÙÐ“UÌRÝÙÐ“QÌRÝÚÐ“LRÝÚÐ“ÌRÙÚÐ“ÍRÔ[Ð’ÛMRÐ[Ð’ÕÎRÜÐ’ÒPR”\Ð’ŒÑPR]ÜÐ’›“PRP[Ð’ŒÔPRÛÐ’›•PR[Ð’’ÐQÝÚÐ’–ÐQÐZÐ’LÛÐQÐZÐ’RÐQÙÐ’XÐPVÐQØÐ‘ÖÐQØÐ‘ÒQ™ØÐ‘ÒQ™ÖP‘ÒQ”VP‘ŒÍQ”VP‘›ŽQ”VP‘–Q™ÕP‘–QÕP‘–QÐTP‘–QÔTP‘–QÙÔP‘–QÝÔP‘–RTP‘–RSP‘›ŽRÒP‘ŒÎRPRP‘ŒÎR]ÑP‘ÒR”QP‘ÒR™ÐP‘ÖRÐP‘ÖPPPØÐPTœPPTP[PQXYÙÑPR”PP‘ÖSPPÔPPT›QTPZPPQVZÔQPQ”QP‘œPPQÕPTPT”QT›QPQOOH‹›[Ý[Û‹LMÈŽˆ˜ÐPT”QPØ”PTÖQQX]ÐU]ÑQXTPUYÑQVÐUVTQV–PQV–PQV–PQVVÑVVÑVÑVUÐQQPVUÑQVPVÑQVPVUÑY]ÐR•ÑXÙTPTU™ÑYÐUÕÑPÕÐXÙPVUÑQÕ™ÐMUÑ•PQ•TQÕYÑ•QKÕYÑNTQMšQPPUYÐ[PSÕXÐ‘NSÕVP”˜Ð‘XÐTP•Ð”Ú›Ð”žÐ”ÑÐ•“P••P•ÐÌ–Ì–M–‘P–P–P•Ú–P•ÕÐ•žšÐ•ZÐPUMÐUZÞPTQLPSMQYÞU’^U’^PU‘LUJÚTPQS™Ñ“›ÙÑPPžšÐ”ØQPPZÍÐUQ‹ÐPSÙÐTPSQYÐQPP\P]ÎPU™PTPS”QKÛ™ÑPQœÐ”LPNPUPÙTPTÐQ[QPQQÐ”VÐPLÐUPØÐTPTS™Ñ[]ÑPQUP”RœÐP‘LUPØTPT“Q[YÑPQZ“P”LØÐPÜÐP’^PU’ÖTPUTQ–TQPQ^‘P–YÐP”^VÞVÝÐVÝÐVÝÐVÝÐVÝVÝVÝVÝPVÝPVÝPVÝVVÐVÐVÐVÐVÜÐVÜÐVÜÐUÊØÐTPR“QœÛ”QPP^]Ð––’PPQ\ÐUPPÓ\ÐUœPÜÐUŒÐP[ÜUÜUÜPUÜPUÜPUÜPU\PU\PU\PU\U\U\ÐU]TÎPTÌPTÝÝPTÜÝPTÛÝPTÛÝPTÛÝPTÛÝPTÛÝTÝÝTÌÐTÎU\U\PU\PU\U\UÛÐUÛÐUÛÐUÛUP[UR[UU[PU[ÛPU\ÛUMU‘ZÐU”ZÐU–ZU›ÚPUŒUŽUÐYÐUÔYUÖYUÙÙPUÛÙPUÝÙUÍÐUÎVXVXPVXPVVVVVÕVÕVÐVVVPVPP‘PQÐPTP™ÐQTPVPP‘ÑÐÐTM™ÝÑSVUP‘QMÐP’‘QLÔÔP’PÝÑLÔÙÐT–Ð^ÙÑLÕPSUÔPP–YÐ]ÐÔQLÕÐRPP–™Ð]ÐQLÕTPQVÐ]ÑLÕYÐPØPP\ÐÑLXTP\Ð™ÑLXYÐ\™Ñ^˜]Ð\P™Ñ^˜]Ð\P™Ñ^X]Ð\™Ñ^X]Ð\™Ñ^]Ð\™Ñ^]Ð\™Ñ]Ø]Ð\Ñ]˜]Ð\PÑ]X]Ð\PÑ\Ø]Ð\ÐQ\˜P[ÐÐQ\X”P[PÔQ\™Ð[ÔQ[ØÐZÔQ[˜ÐPZÔQ[˜ÔPYÔQ[XÝÐYÔQ[PXÐQ[ÐVÐQZÙPPVÐQZYTPVPÐQY™TPVPÑYYÐVÑV™]ÐUÐ™ÑXYPU™ÑV™PU™ÑVY”PUP”QVY”PUP”QUÙ™ÐUÐ”QU™™ÐVQUÙÐVQU™ÐVPQU™ÐV]ÑUÙÐX]ÑUÙÐXÐ]ÑUÙ™ÐYP]ÑUÙ™ÐYÐYÑV™ÐZPYÑV™ÐZÐTQVY™Ð[TQVY™Ð[PTQVY™Ð[PQV™Ð[PQV™Ð[ÐPQXYÐQPR™ÐP‘ÛÒPPÔPPTœQÐTPYÐPQVšÐQPQ”PP‘Ò“PPJÚTPPTQVQPQRP‘–œÐPQÙTPPˆ‹›[Ý[Û‹LKLŽˆ”™ÐR”ÑSÐQS”ÔQSÔÙÑTÙÑTTÝÑT”ÝÑUQUQUVÐPÕQUVÐQQUVÐQÑUVÐQUÑU–ÐQUÑU–ÐQ“ÑRUÐU–ÐQ“TQTÕPPU–ÐQ“ÑVUPPUÖÐQ“QYPPUÖÐQØÐPPÒÔQZPPYÐPQÔQZUPPYÐPQÐQZÕPPYXÐQRÝÑZÕPPYXÐQSQ’Ñ‘“Ñ‘STQÓYÑÓ]Ñ“QS”QKÓ™ÑJÙYÐPÓÑNTPQSÑNYPPQ™™ÐPÓÐQNÐRÓÔQMÙÐRÓÙÑMYÐRÓÙÑMYPRÓÝÑ‘QPPVVPPYÍÐURŠÐP”^PTYÎQPŽPP•\ÐUÖ\PUØÛUÙÚÐUÚÚUÚÚUÙÚÐUÕ[UÑ[ÐUŽPUÜUÓ]UÓ]PUÔ]ÐUÓ^UÒ^PUÐ]ÐUÐ\ÐUÓ\UÓ[ÐUÒ[ÐUÐ\UÑ\UÒ[ÐUÕ[PUÙÚÐUÝÚUÍUÎVYVÙPVÙVÙVÙVØÐVVPVPP‘ÔQÐÐT™Ð™ÝÑUPVYÐ‘]ÑÓT’Pš™ÑTVP‘TQÔPTPšÙÑSÐV•P‘ÑÕTL›ÑSPVšÐÝÑØT\Ð›]ÑRÐVÐÙÑØÐTZÐ›”QRVÐQÙTXÐ›ÔQRXRP™ÑÚTVP›ÝÑQÐXSP”QÛTUP’žLUÛÙÐPÒQPTŒPQ]TTPX]ÑYS™Ð’šÑPQÝÒP’–PTÒPPœÐÐTŒQYTTPXPYÑXÓ™Ð’ÙÑPQÔQP‘ÕÐTœPPšÐTšÍQTÕTPVPPQV“ÐP‘ÝÑPQÔQP‘žšÐTV“PPšÐPT˜ÍQPÕTPVPQUÓÙÐKÛQPQÐPP‘š›ÐTTPP™ÐPT–MQ
ÕPTPVPPQUÓÙÐKÛQPQÐPP‘ššÐTV”PP™ÐPT–MPQQÕPTPVPPQU“ÔPÛQPQÐPP‘•ÐTMUPP˜ÐPT”MQTÕÐTPUPPQUSÐP‘ÑPQQP‘Z™ÐT’˜ÐP’PT’MQTÖPTPTTQT“ÐP‘[TQPQÒP‘QÐT’›ÐP]ÑPTLÐQUØÐTPRP™ÑQQPQÐP‘[™ÑPPXPPPSLÐUVLÐUVLÐUVLÐUXÌÐUXÌÐUXÌÐUXÌÐUXÌÐUXÍUVMUVMUVMPUUMPUVMUTMPUUMUUMUTMUTMUTMÐUSNURNUQNPUPJÐUÐUÐUÐUPPUPUÐUUPU‘U’U’PU’PTÎRTÞTÜTÛÐT“™P’T“šP^T“šPQ›PTœPPQ’T”’T”’T”’T”’T•’T•’T•’ÐT”’ÐT”’ÐT”“T’“PT‘“TNSÐTMTT^PT]TZÏH‹›[Ý[Û‹LKLHŽˆ“ÔPSSÔQTÔQP“ÝÐTÔQUQUÙÐP”QU•ÔPQÑU•ÔPQPQUUÔPQTPQU•ÔPQ”TQU•ÙÐQTTQUÕÙÐQTYÑUÕÙÐQ–TPPÔYÑVÙÐQ–TPQ]ÑYTPQQQÓPQT]ÐZQTPP”PYÒÔQUÔPZÑX”PZQY””PYÒYÑ‘TQ‘RPQ‘’TQ‘YÑÒQRÑNX]ÐPÒÔQMØYÐQRÙÑMXTPQ˜ÙÐQSQLØPPRÐPRÑL˜PPTÑL–ÐTQ’RÐQ“QP’™Ð“XÝÐSRTQšRÑšÒÑ›Q›ÙÑ›QÙÑ›ÔQšÑÙÑšRQ™RÑP’TP–R]Ñ˜’Q™™Ñ™RÑ™RQšYÑš’Ñ›Ñš’Ñ™ÒPQ™RYÑ˜RYÑ˜’TQ™PQ™RQšQÝÑ›ÙÑ›ÑÔQœQÐQœÑ™ÑQ”QŒQŒ‘QŒ‘]Ñ]Ñ]ÑQYÑ‘YÑÑTQŽQPQ‹ÑPQ‹ÑÑÑT]ÐšÑSVZÐÙÑÓTZÐš”QRPVNÐQÔTXÐšÔQRV’P™ÑÕTUP›QQV•P”QÕTUP›ÑQPV˜ÐQÖPTTP›PQQV›Ð]ÑØTRP›QPÐVÐYÑØÐTRP’PÖPULÛÐR”QP’ÜÐTPPQÐÐTPYTQX’ÝÐ‘ÙÝÑPRQP‘ÔÜÐT›ÕPP›ÐT™ÜQUÑÐTPXPPQVP‘ZÑPQÔQP‘”ÌT[ÙÐP™ÐT•]QRÒTPVPQU“ÐZTQPQÐP‘ÎTÐP˜ÐPT”]ÐQ“TPUÐPQUSPPNZ]ÑPQ™ÐP‘‘PT\ÐP–PPT”]ÐQ“TPUÐPQUSÐKÚ]ÑPQ™ÐP‘ÍTR\ÐP–PPT”]PQQÓTPUÐPQUSPÚQPQ”PP‘ÌT[ÝÐP•PPT”\ÐQTÓPTPUPQUSP‘ZQPQ”QP‘Z]ÐT’LP“PT‘\ÐQTÓÐTPTÐYÑTÝÐ‘Ú™ÑPQTSP‘ÜÐT–NPNT[ÜQXTPTPSÐQQRÙÐ’ÙÑPPÐÛÐ”TPPSÖPTPP’ÙÑ’ÔQ’RÔQ’RÔQ’RÔQ’RÔQ’RÔQ’RÔQ’RÔQ’RÐQ’ÒÐQ’’Ñ’ÒÑ’ÒÑ’Ò™Ñ“™Ñ“™Ñ“™Ñ“™Ñ’Ò™Ñ’Ò™Ñ’Ò™Ñ’Ò”Q’Ò”Q’Ò”Q’’”Q’’”Q’R”Q’”Q‘Ò”Q‘’”Q‘R”QÒ™ÑKÒÑ\•]ÐT’Ñ\UPTÐQ\”PSRÐQ\™ÐRÒÔQ[•ÐRRÔQ[•ÐPQRÙÑ[ÙÑ[ÝÑZÓQZ“QZSÑZPQY“YÑY]ÑXÓÑP“ÔPUÓÔQUÓÔQUÓÙÑU“ÙÑU“ÝÑUSÝÑUÝÑUQTÔQT”ÑTÑSÔÑS”PQSTQR”]ÑQÈ‹›[Ý[Û‹LKLˆŽˆ”PQQQÔ”QR”QRÔ™ÑRÔ”QS”™ÑS”™ÑSÔ™ÑTÑTÝÐPÔÑTUÙÐQTÐQTÙÐQTQP”ÐP”ÐPTUÙÐQ“ÝÑQÔÐTÕÙÐQ“ÝÑRÐPT•ÙÐQ“ÝÑR”ÐPVTQRÔÐPVTQSÐPV”Q[QZÖYÐP”Q[”Q[ÓÑQTP[Ó]ÑR”P[ÓYÑ^“TQLYÑ^“]Ñ^RÔQQ”P]Ò”QSSYÐP“”P]Ò”QKÒ™ÑJÖ™ÐPÒÑÒÔQKØYÐRRÙÑ“RÝÑ““Q“SQ’ÓQ’SÑ‘ÓÑ‘RÝÑ’ÐQ’’]Ñ“RYÑ“RTQ“RYÑ“’Q”™Ñ”YÐP’Ñ”ÒÔQ”ÙÑ“ÒÝÑ’ÙÐP’ÔQ“ÐQ’ÒÐQ’’Ñ’ÒÑ’Ò™Ñ“Q“Ò]Ñ”’YÑ•TQ•ÒÑ–’Q™’QšÝÑš‘ÙÑšÑÙÑ›ÙÑ›ÐQœ™ÑœÑQ‘]ÑžYÑž‘YÑŒQÑ‘QŽQQÐPT\Ð™ÙÑRÐVTPÔQÑÐTZÐšÑRPVYÐÐQÒPTXÐšYÑQÐV\Ð”QÓTTPš™ÑQPVM]ÑÔPTSPšÐQQV‘PYÑÔÐTRP’ZYÐTÖPRYÒP’ÜÐTLÛÐQÙÑP’ÜÐTLÜÐQÙÑP‘Þ\ÐTLÝÐQÔPP‘Þ\ÐTLÌQÐPP‘Ú\ÐTLÍQÐP‘ž\ÐT[ŽQ™ÐP‘ž]ÐTRQ™ÐP‘šLTŽQ™ÐP‘šMTQ™ÐP‘šNSÌÎQ™ÐP‘•PSÖQ™ÐP‘•PSPP•PPT•^QPPTPUPQUSYÐL™ÔQPQQP‘Z‘PSÒRPP“PÐT‘^QQTPTP]ÑTPPMšQPQÔP‘PSÍPPLT\ÝÐQQÐTPRÐÑQÓPPMÚPQPPžN”Î”Í”M”L”PÌ”PÌ”TÝÐ”Z]Ð”Z]Ð”Z]Ð”Z\Ð”^\Ð”ÛÐ””ÛÐ””ÛÐ””ÛÐ””ÛÐ”š[Ð”š[Ð”š[Ð”š[Ð”š[Ð”š[Ð”š[Ð”šZÐ”žZÐ”žZÐ”žZÐ”žYÐ”ÐÚÐ”žZÐ”šZÐ”šYÐ”žZÐ”žZÐ”ÐÚÐ”ÐÚÐ”ÔÚÐ”ÔÚÐ”ÔÙÐ”ÚZÐ”ÔÚÐ”ÔÚÐ”ÔÚÐ”ÔÚÐ”ÔÛÐ”ÐÛÐ”ÐÜÐ”ž]Ð”ž]Ð”šL”šL”šM””Î”‘P”Z’P”UP”QP”QP””P””P””P”•P”P”P”P”P“Þ•P“Ú•P“Ú•P“ÕP“ž•P“š•P“š•P“•P“•P“‘P“^•P“^•P“^–P‘ÑNQÕP‘ÑNQÕÐ‘šÎQÑÐ‘›PQž™Ð‘‘PQžšÐ‘LPPQššÐ‘[PQš›Ð‘UPQšœÐ‘PPQšÐ‘PQšŒÌPPQšÕPQšŽšÎQŒ‘Œ‘ÕM‘ÕL‘ÚÌ‘ÚÌ‘ÚÌ‘ÚÌ‘ÚÌ‘ÚÍ‘ÑM‘ÑM‘ÑM‘Œ‘šÎ‘•N‘•P‘LPP‘[P‘U‘P‘Q’P‘P‘•PÐOOH‹›[Ý[Û‹LKLÈŽˆ•ÐR•]ÑSUTQS•PQS”QPÕÐSÔ]ÑQUPT]ÑQTÝÐTTYÑQ”ÙÐTTYÑQ”ÔPTTYÑQTÐPT–PSTTQQ”ÐPZTQQ”ÐZTPQQÔÐZTPQ[”Ñ[”Ñ[TÑ[TÑ[Ñ\Ñ]ØÐPP”QL“ÑQPLÓ™ÑQ”PLÓ™ÑQ”PL“”QRP^S”QLÓ™ÑMTQPÓ™ÐM“PQQ“™ÐNSPQ‘“TQ‘“YÑ‘ÓQ‘“ÑQ“”P‘’ÐQ•”Q•ÒQ•’”Q”ÒÑ“RÐQ’ÒÙÑ‘ÒÝÑ‘SQ“QSÑ“Ñ‘Q’RÙÑ“ÔQ“’™Ñ”™Ñ“R™Ñ’’Ñ‘RÔQ‘ÝÑÓQ’ÒÔQ”RÐQ”ÒÐQ•™Ñ•ÒQ–Y”PP’]Ñ˜ÒYÑ™ÒÑ›Ñ›’QœQœRQœ’Qœ‘ÝÑÙÑ‘ÔQžÐQŒÑŒ‘™Ñ”Q‘QŽ]ÑŠÑYÑÐTPšQTVXÐ‘ÑÒTLš]ÑSPVLÝÑÓÐT[ÐšÐQRÐV‘PÔQÔÐTZÐšÝÑRPV”PÐQÕTYÐ›QRV–P™ÑÖPTVP’Z\ÐUÐR]ÕP’ZLTÛŒRYÕP’NT–QPPPTQUÐÐTPYPQYÐ‘™ÝÑPRTP’PT’TPPÑTÝQUÑTPXÐ]ÑXSPP‘ÑPQÙÒP‘ÕPT[ÚÐP™ÐÐT™ÞQPÒTPVTQV“YÐJÚYÑPQÐQP‘ÑPT\ÐP™ÐPT™ÌQSTPVPPQVS”PMZ]ÑPQÐPP‘ž–PSÒ]ÐP˜ÐPT˜ÌÐQSPTPVPQVS™ÐMQPQÐP‘ÑPSÒ\ÐP™ÐPT™ÌQSTPVPPQV”PMšQPQÐP‘ž”PT]ÐP˜ÐPT–LQ“TPUÐTQUS]ÐJÚ™ÑPQ”RP‘Z’PTP“QT‘^PQPÔPTPTQSÓYÐZÐQPQPVPÞ’PTR‘PPLTZÞQQÕPTPRQQPÓTPÓTQÓTQÓTQÓPQ‘PQ‘SPQ‘SÑ‘ÓÑ‘ÓÑ‘ÓÑ’Ñ’SÑ’SÑ’SÑ’SÑ’SQ’“Q’ÓQ’“Q’ÓQ“Q“Q“Q’ÓQ“Q’ÓQ’ÓQ’ÓQ’ÓQ’ÓQ“Q“Q“Q“Q“Ñ’ÓÑ’ÓÑ’“PQ’SPQ’STQ’YÑ‘Ó]Ñ‘“Q‘S”Q‘Ñ“ÐQSÔQKÓÔQKÓÔQKÓÔQKÓÔQKÓÔQJÓÔQJÓÔQJÓÔQJÓÔQNSÔQNSÔQNÔQMÓÔQM“ÙÑMSÙÑMÝÑV]ÐYTQU•]ÐYQUU]ÐXÔQUYÐX”ÑTÕ]ÐXTÑT•]ÐXTÑT]ÐXTPQSÕ]ÐV”TQSU]ÐV”YÑR•]ÐV”]ÑRPVQVQVQV]ÑV]ÑV]ÑVU]ÑVU]ÑVUYÑV•YÑV•TQXUTQXUTQXUTQXUTQXUTQV•TQV•TQV•TQVUYÑV]ÑUÕ]ÑUÕ]ÑU•QUUQUQU”QT•”QTU™ÑSÕÑSUÐQRÈ‹›[Ý[Û‹LKMŽˆšPQPQYÐTÒTQTZYÑP‘V\ÐT’ÚÐTPPšQP‘M“PPTÓTQUQPPMT”ÚÐTPQZ™ÑP‘M•PPTÐÐTQRZÑPQM•PPTÐPTQSšÑPQ’ÕPPVŠÐT‘ÔPTPX™YÑ\\QPPŒØÐ“›–P“ŒÖP“ÒÐ“ŒÙÐ“››Ð“˜PPRÐUPTLMÐQT‘QU[]TPQ–™Ñ“Ö]Ñ”–PQ•VÑ•ÖQ–UÔQ˜•ÔQ˜ÕÔQ˜•ÙÑP–P–VQ–Ñ•–TQ”ÖYÑ”–]Ñ”V]Ñ”VTQ”–Ñ•Q•VQ•ÖQ•–Ñ•ÑP–TP”YÑ“–”Q’˜PQ‘VÑ‘V™Ñ‘–”Q‘ÖQ’V]Ñ’–]Ñ’–YÑ’–YÑ’^ÑPPXÛÐPQšU\‘TPRÑ”\ÙÑPPXÒPPLYUÐÊÐTPPÐQPQQœÐ™›Ð™ZÐ™QšÐ™QšÐ™Q–P™LUP™‘“P™šÍ™ÝÑ“PVUP”ÙÑÒUYÐšTQ’V[Ð”™ÑÓUTPš”Q]TVNPR“P“QÚÐTÙÐœÑ[PV˜Ð™ÑPQUP˜Ò–PPQÖPTPUÜÔQPPœÒPPYÚVÙTPSYÑœ’TQœ’PQœ’Ñœ’Ñœ’QœQÐQQ™ÑÑ”QÑQ‘YÑ‘PQÑÑQÑœ‘QœÝÑœÙÑœPÔQœPÐQœPÑœÑœPÑœP™Ñœ™ÑœP™ÑœP™Ñœ”QœQœ]ÑœYÑ›ÐTQ›ÐTQ›PQ›PQ›PPQXÒTP‘PQV’YÐTÓ™ÐQÔPPZPQU’”PSTPT•ÐPRPQURÐR””PSÕÐPRPPQUT™ÐSÔPQPPQUÐRPPQTÔÐPQPQTPQTPPQTPQSPQSPQSPQRÐTQR‹›[Ý[Û‹LKMHŽˆšPQPQÙÐT‘ÒTQTÚ]ÑP‘V]ÐT’ÛTPPšQP‘M”PPSÓTQU\QPP’MT”ÚÐTPQÚÑP‘M•PPXTTQU\QPPPTYTPTPU\QPPÒ‘PPPŒNPUÐUPUUUUPUPUTRQPTUÐQ›PTQœP^QULZUNYÐUšUNZPUMYÐU™PU’˜ÐU”˜PU–˜PU–˜PU–™U”™PU“™ÐU‘šPUNZÐULZULYÐU‘™U‘™PU’™PU’™UšULZU[ÐUYUT›UT›PUU›UVšÐUYUZÐU\PU]ULTPRVQ–PQPQœÐ˜[Ð˜L[Ð˜•šÐ˜ŒPP™QL™LÐ™‘ZÐ™ŒÐ™ÔQ‘PVTP”QP”ÐÒUP›Ñ]VšÐ“QØTÜÐ›Q\V’ÐQÙPTØÐ›™Ñ[PVÐ’Q›QPQÜšÐPYÚUÞTPTPP›ÑPQRØÐPRÝPTPP’YÑœYÑPPÔÑP˜ZPP˜Z˜Z˜T˜PŒ˜PŒ–šÐ–šP˜T”P˜T‘P˜PN˜TM–]Ì–]Ð–\Ð–”[Ð–”ZÐ–”YÐ–™ÙÐ–”YÐ–”YÐ–XÐ–XÐ–]ØÐ–TVP–TUP–PUP–ÔP–ÓP–ÓP”PPPZÓPRÓP“ÑTPRRP’ÖPQPQPPÙÑP‘ÚÐPTÛÐPÑUPPÛPPÔQP‘ÐÝÐPUUPPÕ”PPÑP‘šÖPP‘•PP]ÐP‘ÐP‘™ÐP‘”PP‘]ÐP‘YÐP‘PPP‘ÐP‘ÐP‘ÐP‘PP‘PPÝÑPÔQPÐOOH‹›[Ý[Û‹LKMˆŽˆ”]ÐSTÑTSYÑP”PT“TQQÝÐTÓÑQSÙÐTÓÑQ“ÐPUÑQ“ÐUQQÓ™ÐUSQR”PURÝÑR”PUÝÑRSPURÙÑYÙÑYPQ’ÔQYTÔPSÒÔQ]ÒÔQLÐQL’ÐQL’ÑL’Ñ^’ÐQ^TPQÒÐQ]–ÐRÒÐQ]UÝÐT’ÐQ\ÕÙÐUÒÔQ]ÐYÔQ“RÙÑ“ÝÑ’ÒÑ“’™Ñ“R”Q“”Q’’”Q’RQ’’Q“ÒQ”Q”Ò”Q•”Q•”Q”Ò™Ñ”™Ñ“Ò™Ñ“R™Ñ’ÒÑ’ÒÑ“ÐQ“ÙÑ’SQ‘“Q‘QSQJÓQNRÝÑJÓQJÓQJÓÑJÓÑKÒÐQ’”Q“Ð”QRÒTP•]ÑžPYÑŒTQŒPTQŒPQŒÐPQPQÐPQ‹ÙÐQPPTPP™ÝÑPPVUPPQÑÐTPPšPQPPVZÐPQÒÐTQPšYÑPV‘PYÑÕPVœÐPVQXQPQ^SÙÐœ™ÑRÑ]ÐZPœÐQRPSTTP›TYÑ›Ô]Ñœ]Ñœ”Qœ””Qœ”™Ñœ”ÐQœÔQœÙÑ›ÕQ›•Ñ›UTQP•]ÐšU”Qš™ÑšÐQPÖP˜–Q˜–Ñ˜”QPPUŽ–[PP–LP–‘ÐP–‘ÑP–‘ÑP–•ÒP–‘ÒP–‘ÓP–‘ÔP–L•P–[UP–[VP–[XÐ–UÙÐ–UÚÐ–QÛÐ’RLQ\T”TPNQRÙÐTYÑPSUÌÖÐQœÐPJÝPTPYX™ÑRY]ÐRÛ”QPPÍÑPPQÞTPV˜ÐQQ™”PRQPQŒÒP[ŽP“PP™LTQVÑP‘œ™ÐT•ÍTQU]ÑP‘\ÐT‘ÊÐTQTÑP‘ŽTMÐPTQSÔQP‘QPT]ÐTQRÝÑPÏOH‹›[Ý[Û‹LKMÈŽˆ‘TPP’TPSQPQQPTPQQÝÐTQÑQ‘ÔPT‘QQ‘ÐTÑQQ‘™ÐTÐÝÑR”PTÐÙÑRQPUÙÑR]ÐUÔQRQYÐUPÐQYÐQYPRPÑYÐTPÑY”PUPÑLÑLPÑLP]ÑP™ÐLPYÑQÐ^YÑM™ÐQTQQÐ^”PSTQQÐ^SÝÐTTQQÐ^ÙÐVPQRÐP]“ÐPYPQRÐP”PQ–PPQ–PPQ–PQ•ÐPQ•PPQ”ÐPQ”PQ”PQ•PPQ–TQ–PTQ–YÑ–P]Ñ•]Ñ•Q”Q”PQ”PQ”PQ””Q”P™Ñ”Ñ“ÐQ’ÔQ‘ÔQ‘ÔQ‘PÔQ‘ÐÔQ’ÙÑ’ÝÑ’ÝÑ“Q“Q“™Ñ”Q•P]Ñ•ÐYÑ–PTQ™PQšÐPQ›PQ›ÐPQœPQœPPQœÐPQžYPPP™YÐPPQÑTPPšPQPPVZÐTQÒÐTQPšQPÐV]Ð]ÑÓTTPš™ÑQVM™ÑS]ÐS’TPžPÑQÒÝÐœQœQœÑœÑœTQ›“]Ñ›SQ›S™Ñ›ÔQš”ÑšÔTQš”]ÑšTQšT”Qš”QšT”QšT™ÑšT™ÑšT™ÑšTÑšTÑšTÐQ™ÔÐQšÔQ™ÔÙÑ™”ÝÑ™UQ™UQ™UÑXØÔPQYÐLUÑV™PP^•PQRÕÝÐSPPLYÑR–PR™TPTšÔQPQÌSPÑPÖPVPÜPP›PTV™ÐPXPPTPRÑPQŒVP‘ÓPP\PP™VTQUÛPQP‘–™ÐT•ÖTQU[YÑP‘M\ÐT’ØÐTQT›”QP‘RTJÙPTQTÑP‘PPT^YÐTQS[ÔQPÜRPTZZTQQÈ‹›Ý\‹LLŽˆ”ÐP™YÐQQQTPQTQQYTPQÔQQYTPQÓÙÑQÙTPRSÔQRYTPR“ÐQR™YÐR“ÑR™TPRÓ™ÑRÕ]ÐP•”PT™YÐRÓ”QSTPVYYÐRÓQSUPPXÙYÐSS]ÑS•ÐYÙYÐS“YÑS”ÝÐZÙYÐSÓYÑS”ÔP[ÙYÐSÓTQSÔÐP\Y]ÐSÓPQTÐ\Ù]ÐTTQSÔ™Ð]Y]ÐTPQT”P]Ù]ÐTSPQTP^™]ÐTSÑT”TP“Ñ™“Ñ™“Ñ™“Q™ÓÑ™“Ñ™“Ñ™“Ñ™“Ñ™“Ñ™SÑ™Ñ˜ÓPQ˜SPQ˜STQ–SYÑ•Ó]Ñ•SQ”Ó”Q”™Ñ““ÐQ’ÓÔQ’SÐQ’“ÐQ’“ÐQ’“Ñ“Ñ“”Q““Q”Ñ–Q™ÒÝÑš’ÐQ›ÐQPPTÖP˜ÕP˜šVP˜”ÔP˜žRP˜ÚRP™ÐP™PŽ™Z™Œ™š™š™”™”Œ™ÐQXÐVRP‘ÙÑÑTšÐšÑVPVYÐ‘ÑÒÐT˜ÐšYÑVV\Ð‘™ÑÓT–Pš]ÑUÐV\Ð‘ÑÒÐT˜ÐšYÑVV[Ð‘ÑÒÐT˜ÐšYÑUÐVL‘QÔT“P›QTV˜Ð‘PQÖTP›YÑTPVœÐ‘ÑØÐTM›™ÑSÐV‘QÙÐTL›ÐQSPXRP‘QÚTL›ÔQSXTPÝÑÚÐT\ÐœQRÐXUPÙÑÛT[ÐœQRÐXUPÙÑÛT[ÐœQRÐXUPÙÑÛTZÐœÑRPXYÐÐQÛÐTYÐœTQRPXZÐÑÜPTXÐœYÑRX[Ð™ÑÜÐTVPœ]ÑQÐX]Ð”QÝTUPœ”QQXMQÝTTPœÑQPXPQÝÐTSPœÙÑQX’P]ÑÞTSPœÙÑPÐX”PYÑÌTQPÑPX•PTQÌTQPÑPX–PTQÌTPPPQPPX™ÐPQÍTPPPQPPX™ÐPQÍTPPPQPPX™ÐPQÍTPPPQPPX™ÐPQÍTPPPQPPX™ÐPQÍTPPPQPX–PTQÌTQPÑPX–PTQÌPTQPQPÐX”PYÑÞTRPœÝÑQX’PQÝÐTTPœÑQXM”QÝTVPœ]ÑQÐX]ÐÑÜPTXÐœYÑRX[Ð™ÑÜTVPœ]ÑQXL”QÝTTPœ™ÑQPXMQÝTSPœÐQQX‘P]ÑÞTSPœÔQQX‘P]ÑÞTSPœÔQQX‘P]ÑÞTSPœÔQQX‘P]ÑÞTSPœÔQQX‘P]ÑÞTSPœÔQQXPQÝTTPœÑQXM”QÝTVPœQRX[ÐÑÜTYÐœPQRPXYÐÔQÛPT[ÐœQSXRP‘QÙÐTL›™ÑSÐVœÐ‘PQÖT’P›QUÐV]Ð‘ÔQLÕÐ’ÒQP’Ð[T™ÐPÕÙÐSØÙÐ\‹›Ý\‹LLHŽˆ™PQQP™]ÐQ”QQPQ“ÝÑQPQÓÙÑQYPRÐQQÙPRSÑRPR“™ÑRU”PT™PRÓ”QR•YÐVPSQRÕPPXÙ”PSQRÕÐYÙPSS]ÑSPZ™”PSSYÑSÙÐ[™”PS“TQS”ÔP\Y”PSÓPQSÔÐP\Ù”PSÓPQS”Ð]Y”PSÓÑSÔ™Ð]Ù”PTSÑSÔ”P^Y”PTSÑTP^™”PT“ÑTT]ÐLY”PT“ÑT”YÐLÙ]ÐUQšQšSQšSQšSQšSQšSQšSQšQšQ™ÓÑ™“Ñ™SÑ™Ñ˜ÓPQ˜STQ–SYÑ•ÓQ•”Q”S™Ñ“ÓÐQ’ÓÔQ’SÐQ’ÓÐQ’ÓÐQ’ÓÐQ“Ñ““™Ñ”Q•YÑ˜SÑ™ÓÑšSÑšÒÐQœÒÑR™ÑÒ™Ñž™ÑžQŒRYÑRTQÒPQŽRPQŽRÑŠÒÑŠÒÑŠÒÑÐT™ÝÑXÐVVP‘ÝÑÒT›ÐšTQVV\Ð‘ÔQÓTšÐš]ÑVV\Ð‘ÐQÓPT™ÐšQVPV]Ð‘ÐQÓPTšÐš]ÑVV\Ð‘ÙÑÒÐT›Ðš]ÑUÐVN‘”QÔÐT”P›QTÐV˜Ð‘TQÖTP›]ÑTVÐ‘ÑÙTN›”QSÐVŽ‘ÑÙTL›ÐQSXQP‘QÚT]Ð›ÙÑSPXRP‘QÚPT]Ð›ÙÑSPXSPÝÑÚÐT\ÐœQSXUPÝÑÚÐT\ÐœQRÐXVPÔQÛÐTZÐœPQRPX[ÐÔQÜTYÐœYÑRPX[ÐÐQÜPTYÐœYÑRX]ÐÑÜÐTVPœ”QQÐXM”QÝTUPœÑQXP”QÝÐTUPœÐQQPX‘PQÞTTPœÙÑQPX’P]ÑÞPTRPQPÐX”P]ÑÌTRPQPX–PTQÌTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPX–PTQÌTRPQPÐX•PYÑÌTSPœÝÑQX“P]ÑÞPTTPœÔQQPXP”QÝTVPœ”QRX\ÐÑÜPTYÐœPQRPXYÐÐQÛÐTXÐœYÑRX[Ð™ÑÜÐTVPœQQÐX]Ð”QÝPTUPœ™ÑQXN”QÝTTPœÐQQPXPQÞTTPœÔQQPX‘PQÞTTPœÔQQPX‘PQÞTTPœÔQQPX‘PQÞTTPœÐQQPXPQÞTUPœÑQXM”QÝPTVPœ”QQÐX]ÐÑÜTYÐœTQRXXÐÔQÛTZÐœÑRÐXUPÝÑÚT]Ð›ÔQSPXPP‘QÙPTM›QTPVšÐ‘YÑÕT”PšÔQVV[Ð‘ÐQP’P^UPPP•P’ÑZ”™ÐP”ÐPP”ÙÐP•ÙÐSØTPP˜™ÐP˜ÔPPÙPUZTQPQÐPQOH‹›Ý\‹LLˆŽˆ™ÐQYÑQÙÑRÑPÙÐR™ÑQYÐRS”QQ™ÐR“”QQ™ÐRÓ]ÑRPPRÓYÑRYTPRÓYÑR™PPSSTQR•”PSÙTPSSPQRÕPPVTPS“ÑRÕPXÙYÐS“ÑSÝÐYÙTPTQSTÔPZ™TPTQSTÐP[™TPTSQS”™Ð\YTPTRÝÑSÔP]YTPTRÙÑT]Ð]ÙTPTÒÙÑTYÐ^YTPTÒÔQTTTPLPPUÔQTTPP“ÔQT”PP“RÔQTÔÐ“RÐQš’ÐQš’ÐQš’ÐQš’ÐQš’ÐQš’ÐQšRÐQšRÔQšÔQ™ÒÙÑ™’ÙÑ™RÝÑ™Q˜“Q–“Ñ•“Ñ•PQ”STQ“ÓYÑ““]ÑP“”P“™Ñ’ÓÑ’“Ñ’“Ñ“S™Ñ”™Ñ•Ó”Q–S]Ñ–š”QPPTÎ–TÝÐ–ÛÐ–”ÚÐ˜ÚÐ˜”ÙÐ˜žXÐ˜ÚVP˜ÞSP™PÒP™TÑP™^QP™ÐP™Ð™ÐQXVQP‘ÙÑÑT›ÐšQXPVUP‘ÙÑÑÐTšÐšPQVVZÐ‘ÔQÒTšÐšYÑVV[Ð‘ÔQÒÐTšÐšTQVPV[Ð‘ÐQÒÐT™ÐšYÑVPV[Ð‘ÐQÓT™Ðš™ÑVVP‘™ÑÕT•P›QUPV˜Ð‘]ÑÖPT’P›YÑTVÐ‘TQÙTP›™ÑTXPP‘ÑÙÐTM›ÙÑSÐXRP‘QÚÐT]ÐœQSPXUP‘QÛPT\ÐœÑSXXÐÝÑÛT\ÐœÑRÐXYÐÔQÜTZÐœYÑRPX\ÐÐQÜÐTYÐœQRPXL™ÑÝTVPœÑQÐXN”QÝÐTUPœÐQQX‘PQÞPTTPœÙÑQX“P]ÑÌTSPQQX•PYÑÌTRPÑPX™ÐTQÍTPPTQPPX›ÐPQÍPTPPTQPPX›ÐPQÍPTPP]ÑPPX›ÐPQÍTPP]ÑPPXœÐPQÍÐTPPQPPXÐPQÎTPPQPPXŒPQÎPTPP”QPPXŒPQÎPTQPQPXÐYÑÍÐTRP]ÑPÐXœÐ]ÑÍTSPYÑQPXšÐQÍPTUPPQQÐX˜ÐÑÌTYÐQRX”PÙÑÞT]ÐœÐQTX]Ð‘™ÑÛT”PœÑTÐXYÐ‘TQÜTNœ]ÑSÐX\Ð‘QÜÐT]Ðœ™ÑSXMÝÑÝPT[Ðœ™ÑRÐXLÔQÝTZÐœQRPXLÐQÝPTYÐœÑRX‘P™ÑÞPTVPœÙÑQX“P”QÞTUPQQPX•PQÌPTTPÑQPX–PQÌTTPÑQPX–PQÌTTPÑQPX–PQÌTTPÑQX•P”QÌTUPQQÐX“P™ÑÞTVPœÝÑRX‘PÑÞTYÐœÐQRXMÔQÝPT[ÐœQRÐX\ÐÝÑÜPT\ÐœTQSXZÐ‘QÛTLœQSÐXSP‘ÑÚTP›ÑTVŒ‘]ÑÖT–PšÝÑXPVL’Ñ^UYÐP•ÐP’ÒPQSÐVVÐS™ÐPÙTPTÚÔQPP\PPUOH‹›Ý\‹LLÈŽˆ“ÔPQYÐQSÐQQ™ÐQ“ÑQÙÐQÓ™ÑRÐQÓ™ÑR™ÐRS”QRYÐRSQR™ÐRS]ÑRÙÐRÓYÑSÐQPPÕPÌ]ÐPLÎPÞP‘•PQVPPP\ÝÐT^PšPPTPSSÑS•ÐYYÐQPQÍ‘LRVPPPMPTLSPÕÐPTPSÓQSÔÔP\ÐQPQ]Ð‘ÐRÍPPNÐTMQÐPÊÐPTPTRÝÑTT”P^ÐQPQPÜÐ‘QTPSMPP‘\PT‘‘QÐPTPT’ÙÑTÔYÐL™ÐTÒÙÑ”™ÐURÙÑ›ÒÙÑ›ÒÙÑ›ÒÙÑ›ÒÙÑ›ÒÙÑ›ÒÙÑ›’ÙÑ›RÝÑ›RÝÑ›Qš“QšSQšÑ™ÓÑ™SPQ˜ÓTQ˜SYÑ–Q•”Q”ÓÑ“ÓÐQ““ÐQ“SÐQ“Ñ“SÑ“SÑ““”Q”S]Ñ•Ñ–“Ñ˜“QšÒÔQ›ÒÑœR™Ñœ’™Ñ’™ÑÒ]ÑŒYÑŒRPQŒÒÑ’ÑŽRQ‹ÒQÐPT™ÐQYPVPP’QÐTœÐ™ÝÑXPVUP‘ÔQÒTšÐšPQVPV[Ð‘ÐQÒÐT˜ÐšQVV]Ð‘ÑÓPT˜ÐšQUÐVL‘™ÑÓPT–PšQVV\Ð‘ÑÓT™Ðš]ÑVV]Ð‘™ÑÓÐT•PšÐQUPV’P‘]ÑÕPT’P›QTV˜Ð‘TQÖPTP›TQTPVšÐ‘ÑØPTM›QSÐVÐ‘ÑÙTM›QSV‘QÙPTL›™ÑSVŽÝÑÚPT[Ð›ÝÑRXUPÔQÛPTZÐœÑRXVPÔQÛPTYÐœÑRXVPÐQÛÐTYÐœPQRPXZÐÑÜPTXÐœ]ÑRX\Ð™ÑÝTUPœ”QQXMQÝÐTTPœÐQQX‘P]ÑÞPTSPœÙÑPÐX“PYÑÌTQPQPÐX”PTQÌTQPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐTQÌPTQPQPÐX“PYÑÞTSPœÔQQPXNQÝTTPœ™ÑQXL™ÑÜTVPœTQRXXÐÐQÛTYÐœQRPXVPÐQÛPTYÐœÑRXYÐÐQÛTXÐœPQRXYÐ™ÑÜPTVPœYÑQX]Ð”QÜÐTUPœ”QQPXMQÝTUPœ™ÑQXP]ÑÞTSPœÔQQX‘P]ÑÞTSPœÔQQX‘P]ÑÞTRPœÙÑPÐX’PYÑÞPTRPœÙÑQX‘P]ÑÞTSPœÔQQXP]ÑÝÐTTPœÑQPXM”QÝTVPœQQÐX\ÐÑÜTXÐœTQRXYÐÐQÛPTYÐœÑRXTPÔQÚÐT[Ð›ÙÑSXQPÝÑÙÐT]Ð›™ÑSVÐ‘ÑÖT‘P›QUVP‘™ÑÑVÐPUXÐTÍTPPQ”ÐPQ•PP•PÜÛPTÐPQ‘PPQ˜PP^PQŒPTÐTPP›QPPV–PPQOH‹›Ý\‹LMŽˆ“™ÐPÙPQ”QQY]ÐQ“QQÙ]ÐQÓ]ÑQÙ]ÐRYÑR]ÐRSTQRYPRSPQR™PR“ÑR™PRÓÑRÕTPTPSQSUPU™PSSQSTÙÐX™PSRÝÑS”ÔPZPS’ÝÑS”™Ð[YPS’ÙÑSÔP\YPS’ÔQT]Ð\ÙPSÒÔQTYÐ]YPSÒÔQTTP]ÙPTÔQTPP^Y]ÐTRÐQTTÐL]ÐTRÑUÐL™YÐT’Ñ“ÙPPUÑšÒÑšÒÑšÒÑšÒÑšÒÑšÒÐQš’ÐQš’ÔQšÔQšÔQšÙÑ™ÒÙÑ™’ÝÑ™ÝÑ˜ÓQ˜“Q–“Ñ–Ñ•SYÑ”Q“Q’S]Ñ’Ó]Ñ’Ó]Ñ’ÓYÑ“TQ“SÑ”’ÝÑ•ÒÔQ–šÑPPTØÐ–^VP–”ØÐ–ÓP˜PÒP˜^PP˜ž˜ÔÐ™Ð™TœÐ™ZÐ™œÐ™Ð™^Ð™^Ð™”šÐ™žÐ™ÔQVVSP‘™ÑÑT•PšÑUVVP‘”QÒT•PšÑUVXÐ‘QÒPT”PšPQUVVP‘”QÒT•PšÑUVVP‘”QÑÐT”PšPQTÐV\Ð‘PQÔPTM›QSV–P‘QÖT\Ð›]ÑSVœÐÙÑÙTZÐ›™ÑRVŽÐQÙÐTYÐ›ÔQRXRPÑÚTVP›ÝÑQÐXUP™ÑÛTUPœÑQXVP”QÛPTUPœÑQXVPQÛTTPœÑQPXXÐQÛTSPœTQQXZÐ]ÑÜPTSPœYÑQX[Ð]ÑÜPTRPœ]ÑPÐX\ÐYÑÜTRPœ]ÑPÐX\Ð]ÑÜTSPœTQQPXYÐQÛTTPœÑQPXXÐQÛPTTPœÑQXUP”QÛTVPœQQÐXTP™ÑÚTXÐ›ÙÑRXRPÑÚPTXÐ›ÔQRPXPPÔQÙPTZÐ›”QRÐVÐÙÑØT[Ð›YÑSVšÐ‘QÖT]Ð›ÑSV•P‘ÑÕTMšÝÑTV‘P‘PQÔPTPšÑTVL‘PQÓÐTPš™ÑTPVL‘PQÓTPš”QTVM‘PQÓTNš™ÑTVN‘QÔÐT]Ð›QSV˜ÐÙÑÖTZÐ›]ÑRPVŒÐQÙPTXÐ›ÐQRXPP™ÑÚPTVP›ÝÑQXUPQÛPTSPœPQQXYÐYÑÜPTRPœYÑPX\ÐTQÜTQPœ]ÑPPXLTQÜÐTPPœ™ÑPPXMPQÝTPPœÑPPXNPQÝTPPœÑPPXNPQÝTPPœÑPPXNPQÝTPPœÑPPXNPQÝTPPœÑPPXMPQÝPTPPœ™ÑPX]ÐTQÜÐTRPœ]ÑPÐX[Ð]ÑÛÐTTPœÑQPXXÐQÛTTPœÑQXUP™ÑÚÐTVP›ÝÑRXQPÐQÙTZÐ›”QRÐVœÐÝÑÖTL›QTPVN‘YÑÒPVŒPQXPTÞP’šPQXÐTZÛP‘–PQPP˜TTPPˆ‹›Ý\‹LMHŽˆ”ÐQÔQR“ÝÑRÙ”PPÓÙÑS”PQÐQSYPQ“ÑS™PQÓ”QSÙ”PQÓQSÙ”PR]ÑTPR“YÑTYÐS”PR“TQTUPUY”PRÓTQTÝÐP•PVV™ÐP™”PSPQTTÙÐY™”PSPQTTÐZÙ™ÐSÑTT™Ð[™™ÐSSÑT”P\™™ÐS“ÑT”]Ð]™ÐS“ÑTÔTP]Ù™ÐSÓQ‘™™ÐSÓQ‘ÙÐSÓQ’™ÐTQ’Y™ÐTSQ’™”PT“Q’ÙTPUÓQšSQšSQšSÑšÑšÑ™ÓPQ™SPQ™TQ˜ÓTQ˜ÓYÑ˜SYÑ˜S]Ñ–SQ•Ó”Q•S”Q•S”Q•”Q”“Q”SQ”Q““YÑ““PQ“SQ”RÑQSP”’™Ñ–™Ñ•Ò”Q–’Q˜ÒTQ™ÒPQš’ÑœÒÑQ‘ÝÑÑÝÑž‘ÝÑŒQÝÑŒ‘ÙÑQÔQ‘ÐQŽÑŽQ™Ñ‹Ñ”Q‹Ñ”QÐPT”P™ÙÑUPVSP‘]ÑÑT“PšÑUVXÐ‘]ÑÒT“PšPQUPVXÐ‘QÒT”PšÑUPVUP‘QÑT’PšPQTVZÐ‘PQÓTMšÑSV’P‘QÕPT\Ð›ÑRÐV˜ÐÔQØPTZÐ›YÑRPVœÐÑÙTVP›ÑQÐXPP”QÚTUP›ÔQQPXSPQÚTTPœQQXUP]ÑÛTSPœQQXUP]ÑÛTSPœQQXVP]ÑÛPTSPœÑPÐXYÐYÑÛÐTRPœPQPÐXYÐYÑÛÐTQPœTQPXZÐYÑÜTRPœTQPÐX[ÐYÑÜTRPœYÑPÐX\Ð]ÑÜPTSPœYÑQX[Ð]ÑÜTSPœ]ÑQX\Ð]ÑÜTSPœ]ÑQX]Ð]ÑÜÐTSPœQQX]Ð]ÑÝTSPœ”QQX]ÐQÜÐTTPœQQPXL”QÜÐTUPœQQÐX\Ð™ÑÜTXÐœYÑRPXZÐÐQÜTZÐœPQRXYÐÙÑÛT\ÐœÑSXVP‘QÛT]ÐœQSXTP‘ÑÚTM›ÝÑSÐXSP‘ÑÚTM›ÝÑSÐXRP‘ÑÚPTM›ÙÑSPXTPÝÑÚÐT[ÐœÑRXVPÐQÛTYÐœÑRXXÐ™ÑÛÐTVPœÑQÐXVP”QÛTUPœÑQPXVPQÛTSPœÑPÐXVPYÑÛPTRPœÑPÐXXÐTQÛÐTQPœTQPPXZÐPQÜPTPPœYÑPPX\ÐPQÜTPPœQPPX]ÐPQÜÐTPPœ”QPPXLPQÝTPPœ”QPPXLPQÝTPPœ”QPPX]ÐPQÜÐTPPœQPPX]ÐPQÜÐTQPœ]ÑPX[ÐYÑÜTRPœPQQXXÐQÛTTPœQQXRP”QÚPTUP›ÙÑQÐXPPÑÙTYÐ›”QRPVÐÔQØPT[Ð›PQSV–P‘QÔÐTPšQTÐUÐQ\ÖPTÛPP“›PPÝØPTÐ•PL]ÐPÓÐTPPˆ‹›Ý\‹LMˆŽˆ“ÝÐQÔQQ™ÝÑPP^™Ð›ÒPPULÐTZPTPR™ÑR™ÔQPPž•PÖRPPXÌT\PPJÐÐTPRS]ÑSPUÙÙÑPPÕPÌQPRRPP[ÞPT^PÑÐÐTPSTQS•P[YÙÑPPÞP‘\ÐRÒRPP]ÝTMRÐPÜPÐTPS“ÑSÔÔP]ÙÑPQÍ‘ÐSPPMPTNQÐQÐÐTPSÓÑTT”PLÙÑPQL‘ZÔPS›ÑPP]UMPTPTÓQ›Q›Q›Q›Q›Q›Q›Q›Ñš“ÑšSÑšSPQ™ÓPQ™ÓTQ™SYÑ˜“]Ñ–“Q–S”Q•ÓÑ•ÐQ”“ÔQ”ÔQ“ÓÔQ“SÔQ’ÓÔQ’ÓÔQ“ÐQ“SÑ““™Ñ”]Ñ•Q˜’ÝÑ™’ÔQ›’ÐQ›ÒÐQ›’Ñœ[QPPTÕP˜ÚSP™ÒP™PP™T™Œ™š™žÐ™ÔQXÐVQP’QÐPTÐ™ÔQXVRP‘ÙÑÑPTšÐšQVPVZÐ‘ÐQÒÐT˜ÐšQUÐVL‘™ÑÓT–Pš”QUÐTRVR[Ð‘™ÑÓT–PšQVV\Ð‘ÑÓT˜Ðš]ÑUÐVL‘ÑÓT–PšÔQUPV”P‘QÕT“P›ÑTÐV™Ð‘TQØPT‘P›]ÑTPVÐ‘PQÙTSP™Î[™ÑPT[ÔRPQSQÐÙTPPœ™ÑPPXMPQÝTPPœÑPPXNTQÝPTQPœ™ÑPÐXM]ÑÝTTPœQQXMYÑÝTRPœÐQPÐXPYÑÝÐTRPœÐQPÐXPYÑÝÐTSPœÐQQXPQÝÐTTPœÔQQPX‘PQÞPTSPœÝÑQX“PYÑÌPTRPQPÐX•PTQÌÐTQPÑPX˜ÐPQÍTPPTQPPXšÐPQÍTPPYÑPPXœÐPQÍTPP]ÑPPXœÐPQÎTPP]ÑPPXÐPQÎTPP”QPPXPQÎPTQP”QPXŒTQÎPTQP”QPXŒYÑÎTRPQQXœÐ]ÑÍÐTTPYÑQXšÐ™ÑÍTXÐÑRPX–PÔQÌPT[ÐQSX“P‘QÞPTMœÐQTX]Ð‘TQÜÐTPœQTXM‘ÑÝPTLœÑSPXNÝÑÝÐT[ÐœÔQRÐX‘PÙÑÝÐTZÐœÔQRXPÐQÞTXÐœÔQRPXP™ÑÞTVPœÝÑQÐX“P”QÌTUPQQX•PQÌTTPÑQPX˜ÐQÍTTPÑQPX™ÐQÍTTPPQQPX™ÐQÍTTPPQQPX™ÐQÍTTPPQQX˜Ð”QÌÐTUPÑQÐX”P™ÑÌTXÐœÝÑRPX’PÐQÞPTZÐœÐQRXPÙÑÝPT[Ðœ”QSX]ÐÝÑÜT]ÐœTQSPXZÐ‘QÛTMœQTXSP‘PQÙÐT“P›]ÑUV˜Ð‘ÔQM•P•RÑ\•ÐU™ÐLÑPPTÐP’‘UPPVPPÒÐRMLPROH‹›Ý\‹LMÈŽˆ”ÐQYÐQQQÙTPQ”QQÙTPQ“ÝÑRTPQÓÙÑRYTPRÔQR™TPR“ÐQR•™ÐSÙTPRÓÑR•]ÐUYTPSÑR•PPXYTPSS™ÑR•ÐYYYÐSS”QSPZYYÐSSQSÙÐ[™YÐS“]ÑSTÔP\YÐS“YÑS”ÐP\™]ÐS“TQSÔÐ]]ÐS“TQSÔ™Ð]™PSÓPQT”P^]ÐTÑTTP^™PTÑTT]ÐLY]ÐTSÑT”YÐL™TPTÓÑ™SÑ™SÑ™“Q™ÓQ™ÓQ™ÓÑ™“Ñ™“Ñ™“Ñ™SÑ™Ñ˜ÓPQ˜STQ–“TQ–SYÑ•ÓQ•”Q”“™Ñ“ÓÑ“SÔQ’SÐQ’“ÐQ’“ÐQ’“ÐQ’ÓÐQ’ÓÑ“S”Q”]Ñ•TQPPZM–L–M–ZÐTÝÐVTÙÐ˜ØÐ˜šVP˜žVP˜šSP˜ÞRP™ÑP™PP™TŽ™™”Œ™ž™ž™”Œ™žÐ™ÙÑXPVUP‘ÙÑÑTšÐšÑVPVYÐ‘ÐQÒT™ÐšTQVPVZÐ‘ÐQÒÐT™ÐšTQVPVYÐ‘ÐQÒPT™ÐšPQVVYÐ‘ÐQÒT˜ÐšQUPV‘P‘]ÑÕT’P›QTV˜Ð‘PQÖTN›]ÑSÐVÐ‘ÑÙTM›”QSVŽ‘QÙT]Ð›ÔQSPXQPÝÑÚPT\Ð›ÝÑSXSPÙÑÚÐT[ÐœQRÐXTPÙÑÚÐT[ÐœQRXUPÔQÛTZÐœQRXUPÔQÛPTYÐœÑRPXYÐÐQÛÐTYÐœPQRXZÐÑÜTXÐœYÑQÐX\Ð™ÑÜTUPœ”QQXM”QÝPTUPœ™ÑQPXNQÝÐTTPœÐQQX‘P]ÑÞTSPœÙÑPÐX’PYÑÌTRPœÝÑPÐX”PYÑÌTQPQPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPPX˜ÐPQÌÐTPPÑPX–PPQÌÐTQPQPX–PTQÌPTRPQPÐX”P]ÑÞPTSPœÙÑQPXPQÝTUPœ™ÑQÐX]Ð™ÑÜPTXÐœTQRXZÐÑÜTYÐœTQRXZÐ™ÑÜPTVPœ]ÑQÐX\Ð™ÑÜÐTVPœQQXL”QÝTTPœÑQXP]ÑÝÐTSPœÐQQXP]ÑÝÐTSPœÐQQX‘P]ÑÞTSPœÔQQX‘P]ÑÞTSPœÐQQXPQÝTTPœÑQXL”QÝTUPœQQÐX\Ð™ÑÜPTXÐœPQRPXVPÐQÛPTYÐœÑRPXVPÔQÚÐT[Ð›ÙÑSXPP‘QÙPTL›QSÐVšÐ‘PQÕT“PšÐQUÐUPQLTÚP’œPPQœÐPÍH‹›Ý\‹LKLŽˆ“TPRØPPS“ÑS–ÐTSQT–™ÐUQR“™ÐRÖ”PRX™ÐP˜ÐPRÒÙÑRSÐPP“ÙÐQÖ]ÐRYPRÔQRPQ–YÐRPRÐQRPQÖYÐQ™ÐRÑRÐQ–TPQÙÐRÑQ”ÐQ–PPQÙPPQÒ™ÑQÔÐQ–ÐQÙTPQÒ”QQÔÐQÖÐQÙYÐQÒ”QQ”PPQ–ÐQÙYÐQÒQQÔTPQ–ÐQÙ]ÐQÒQQ”YÐQ–PRPQ’]ÑQTTPQÖPQÙPQÒYÑQÔYÐQ–PR”PQ’YÑQTYÐQÖPQ™”PQÒYÑQ”]ÐQ–PQÙ™ÐQ’TQQ”PQVPQ™™ÐQÒTQQ”PQ•ÝÐQÙÐQ’PQQÔPQ•ÝÐQÙÐQPP”ÐP•TPP›ÐP›ÐPPUYÐTU‘PU˜PUÐTPQ’ÑQ””PQ•ÙÐQÙÔQPP”Ž•VPP‘œÐP’QPPUYPTV‘ÐPU˜PPUÐTPQ’ÑQ””PQ•ÙÐQ™ÝÑPP^•VPP•›ÐP–SPPTYTV‘ÐPU˜PPUÐÐTPQ’QQÔ™ÐQÕÙÐQYÝÑPPÐšØÐP•›ÐP’SPPUXÐTV’PU–PUÑTPQ’QQ”ÐQ•ÔPQ™ÝÑPPŒ‘XÐP•™ÐP›ÔPPSXÐTU’PU–PPXQPTPQRQQ”™ÐQÕPPÕPRÚQPPÐ‘XÐQPPTXÐTT‘P›QPTPQRQQTPXÚQPPÐ‘SPRPPSXÐTSPÒYTQPPÔKÐTÖJÐTÙÎPTÛÎTÝÍÐTÌUMPUMPUMUMUŽPQ[PTULÐQPPV[TYÌQŒÐPZÚÐT\ÌQP[ÚÐT]ÌQPP\ÚÐTLPQPLÐTMPQPPMU\PMPU[ÐPNPUšÛPUšÛPUšÛPU™ÛPU™ÛPU™ÛU˜ÛU–[U–[U–[U•[ÐU”[ÐU”[ÐU“\U‘\U‘\U‘\U‘\UYPTXÛQ’ŠÐP“UPTQXÐQžPPŒVXÐ‘QÓÐTZÐ›QRV˜Ð™ÑÖTVP›TQQÐVšÐ™ÑØPTVP›TQQÐVšÐ™ÑÖTUP›YÑQV›Ð™ÑÖTVP›PQQÐV™Ð™ÑÖTXÐ›ÑRV•PÐQÕPTYÐšÝÑRV’PÙÑÔPT[ÐšÐQRÐVPÙÑÔT[ÐšÔQRV“PÔQÕTYÐ›QRPV–PÑÕÐTXÐ›PQQÐVšÐ™ÑØPTUP›QQPVÐQÙPTSP›ÑQVŽYÑÚTQP›ÙÑPXSPPQÚÐTPPœQPPXUPPQÛTPPœQPPXUPPQÛTPPœQPPXUPPQÛTPPœQPPXUPPQÛTPPœQPPXUPPQÛTPPœQPPXTPTQÚTQP›ÙÑPÐXQPYÑÙÐTSP›™ÑQPVŒQØÐTUP›YÑQÐV™Ð™ÑÖTXÐ›QRPV“PÔQÔÐT[ÐšÑSVL‘QÒÐTMšPQTVVP‘TQÑPT‘PšQTVTP‘TQÑPT‘PšQTVUP‘PQÑÐTPšÑTPVVP‘PQÑÐTPšÑTVYÐ‘ÑÒPTNšPQTVYÐ‘ÑÒPTNšPQTVYÐ‘ÑÒPTMšTQSV\Ð‘QÓTLšYÑSV\Ð‘QÓT]ÐšQSPV]Ð‘QÓPT]ÐšQSPV]Ð‘QÓPT]ÐšQSPV]Ð‘QÓPT]ÐšQSV\Ð‘ÑÒT‘P™ÝÑUVVÓÐTPP‘ÔQžÝÑQÝÑ‘ÔQž‘ÐQŒQÑ’Ð]Ñ™Ñ\Ö]Ð]Q]P]Q]P]Q]Ñ]P]‘YÑ]VP]ÑTQ]–P]ÑPQ]Ö”P^Ñ^”P^Ñ^”P^Ñ]ÖÐ]‘PQ]PP]QTQZÓÐPP“ÙÐP˜ÐP[]ÑXYPPXÈ‹›Ý\‹LKLHŽˆ“PPSTPQÓÑSÖÐSQT–™ÐS“QU”PTÙÑRSÐR–PQ˜YÐP˜”PR’ÙÑQ“PPP“ÙÐR]ÐQØÐPRÔQQÔPQÖYÐQØÔPQÒÑRPQÖYÐQ˜ÙÐR™ÑRÐQ–TPQ˜ÝÐQÒ™ÑQÔÐQÖTPQ™PQÒ”QQÔPPQ–TPQ™PQÒ”QQ”PPQÖPPQ™PQÒQQÔTPQÖPPQ™ÐQÒ]ÑQÔTPQÖÐQ™ÐQ’]ÑQ”YÐQ–ÐQ™ÐQÒYÑQÔYÐQÖÐQYPPQ’YÑQ”PQ–ÐQYPPQÒYÑQ”]ÐQÖÐQTPQ’YÑQTPQ–ÐQ™TPQ’TQQ”PQÖÐQYYÐQ’PQQ””PQ–ÐQYYÐQRPQQ””PQÖPQ™]ÐQ’ÑQ”™ÐQ–PQ™]ÐQ’ÑQ”™ÐQÖPQ™]ÐQ’ÑQ”™ÐQÖPQ™]ÐQ’ÑQ”ÐQ–PQ™PQRÑQ”ÐPQ–PQ™PQ’ÑQTÐQÖPQYPQ’ÑQ”ÐPQ•ÝÐQÙ”PQRQQ”ÐQÕÝÐQÙ”PQRQQTÐPQÕÝÐQ™”PQRÑQÔPQ•ÝÐQ™”PQRQQTÐPQÕÝÐQ™™ÐQQQTÐPQÕÝÐQ™ÐPÒQQ”ÔPQÕÝÐQ’QQ”ÔPQÕÝÐQ’QQ”ÔPQÕÙÐQÒQQTÔPVQQTÔPVRQQTÔPV’QQÐYQQT™ÐYÒQPÔPZT]Ñ[YÑ[TTQ[ÔPQ\”Ñ\ÔÑ]Ñ]”Q^Q^TQ^™”PPÒÔQQSÝÐLY]ÐQÒÐQRÝÐLYYÐRRÑRÓÙÐLÙTPRRÑSSÙÐLÙÐRÒÑS“ÔPMYÐSÑTÔPMYPS\ÑPP^YÐ‘™ÐSÛ”PQPPPRÚÐTPQÒÔQ–[™ÑPP˜TPPV[ÐU›YTPSÒÔQ–[QPQÐPT\UšXTPUÒÔQ–]ÑPQšZÐ•\ÐP–\PU˜XTPVÙÑ•Û]ÑPQž[Ð•–›ÐP›ÜU”ØPTPXÒÝÑ•[YÑPRÜÐ•MTPPSØPTPXÓQ”ÚÙÑPPœÐPŒÐU’ÔTP[Q”ÚÔQPR”ÝÐ•\PPÖ]UÔPTP[SQ”ZÐQPR”Ì•RPPÕ]PUM”PTP[Ñ“ÚQPSP˜ÐZVSšP›ÐQTPXRP‘QÛPT\ÐœPQRÐXZÐÔQÜTZÐœTQRXZÐÔQÜTZÐœTQRXZÐÔQÛÐTZÐœPQRÐXXÐÙÑÛÐT[ÐœÑSXXÐÝÑÛT\ÐœÑSPXXÐ‘QÛTLœÑSXVP‘QÛPTLœÑSPXXÐ‘QÛT\ÐœPQRÐXZÐÔQÜPTZÐœTQRPX[ÐÐQÜPTXÐœ]ÑQÐX\Ð”QÜÐTUPœQQPXLQÜÐTSPœ”QQX]ÐYÑÝTRPœQPXLTQÜÐTQPœQPX\ÐPQÜTPPœYÑPPXZÐPQÜTPPœÑPPXUPPQÚÐTPP›ÝÑPPXPPPQÙTPPšÙÑPPV’PPQÔÐTPPšÙÑPV’PTQÔTQPšÙÑPV’PYÑÔÐTRPšÙÑQV‘PQÔPTTPšÔQQVP™ÑÔTXÐš™ÑRPVLÔQÓT[ÐšQSV\Ð‘QÒTLšYÑSÐVZÐ‘ÑÒPTPšÑTPVXÐ‘PQÒPTPšPQTPVYÐ‘PQÒPTPšPQTVZÐ‘ÑÒTNšYÑTV[Ð‘ÑÓTMš]ÑSÐV]Ð‘QÓTMšQSÐV]Ð‘QÓT]Ðš™ÑSPVM‘QÓÐT]ÐšÑSPVMÝÑÔPT\ÐšÐQSVPÝÑÔPT\ÐšÐQSVPÝÑÔPT\ÐšÐQSVPÝÑÔPT]ÐšÑSVL‘ÑÒPT‘P™ÝÑUVÐVÖVVPVUÐVÕPVVÐTÍRÐPœPÍTÍ[PPÎPTÍ[PQTTÎ[QTTÎ[QSÐU›QSU›QSU›QSU›QSU›ÐQSTÍ\PPÎÐTÝÐPÚÔTÐŠÐPšÏH‹›Ý\‹LKLˆŽˆ–YÐSÖPQTÖÑU’”QR–ÐR˜PPP˜YÐP˜PR’YÑSÖPR™ÐR’TQT–PQØÔPRPQUVPQ˜ÝÐQÒÑUÕÝÐQ˜ÝÐRÑRÐRUÙÐQ™PQÒQQÓTPQÕÔPQÙÐQÒQQÓTPRÔPQYÐQ‘ÝÑQÓ]ÐQÕÐPQ™PPQÑÙÑQÓPQÕÐPQYTPQ‘ÔQRPQÕÐQ™TPQÑÔQQÓ”PQÕ™ÐQÙYÐQ‘ÐQQÓ™ÐQ•”PR]ÐQ‘ÑQ“™ÐQÕ™ÐQ™]ÐQÑÑQ“ÐQÕ™ÐQ™PQ‘™ÑQÓÐPQ•PR”PQ‘™ÑQ“ÐPQÕPQÙ”PQ‘”QQÓÔPQ•PQÙ™ÐQ‘”QQ“ÔPQ•PQ™™ÐQ‘”QQ“ÙÐQ•]ÐQÙÐQ‘QQ“ÙÐQ•]ÐQÙÐQ‘QQ“ÙÐQÕ]ÐQÙÐQÑ]ÑQÓÝÐQUYÐRÐQPP”“P•ÐP›PP›ÑPPUUTUMÐPU”ÐPXPTPQ‘]ÑQTPQ•YÐQÙÔQPPšP‘P‘’PP›ÒPPTTÐTUNPPU”ÐPUÐÐTPQ‘YÑQTPQ•TPQÙÙÑPP”’P‘P•‘PP›ÓPPTTTUJÐPU”PXQTPQQTQQ”ÐQ•TPQÚQPPP•P•’PP–TPPSTTTNPPYPXQPTPQTQQTÐQÕTPQÑPQQ”ÐQÕPPRPQQTÐQÕPPRPQQTÐQÔ™ÐP•PSPQQTÐV‘PQQÐXQPQQÐXÑPQQPYQPQPÓÝÐZQPQPÓÙÐZ“ÙÑ[ÐQ[“Ñ\™Ñ\“”Q]SQ]Ó]Ñ^]Ñ^SYÑ^“YÑLTQLXÙÐQ’ÑQ“TPL˜ÔPRRÑR“PPMÐPR’ÑRÓPPLØ™ÐSÑSPPM”PSRQSÓÐMXPSRÑSÓÐMX]ÐS’Ñ“YÐSÒÑ˜[QPP^•Ö”PPUØTPQ’Ñ–šÝÑPPœÐPXÙUšTÐTPTRPQ–ÔQPQÐP•QPP–ZU˜TTPVPQ•ÚÐQPQÐÑP•–‘PP˜ÚU•ÔPTPV’TQ•ZÑPQÞRP•MÐPUÔTPXÒYÑ•ÑPR”ÓP•[ÖPPÖZU‘ÑTP[‘]ÑQ’]Ð”šQPRÌ’PPžTPURUPPØÓPTMÐQÑTP[ÝÑTR”P”ÑPR™ÚÐ‘ZUPU™ÐPÍÐPÕRT•[QŒQQÐT–[RVP™ÑUÒ™ÐÑPTUPœQQXTPQÚÐTSPœQPÐXUPYÑÛTQPœÑPXVPTQÛTRPœQPÐXTP]ÑÚÐTTP›ÝÑQPXTPQÚÐTTPœQQPXTPQÚÐTTPœQQXSPQÚÐTUP›ÝÑQXSPQÚÐTTPœQQXUP]ÑÛTRPœÑPÐXUPTQÛPTQPœÑPXVPPQÛTPPœÑPPXUPPQÛTPPœQPPXUPPQÚÐTPPœQPPXSPPQÚTPP›ÙÑPPXRPPQÚTPP›ÔQPPXPPPQÙTPP›™ÑPPVÐTQØPTRP›ÑPÐV˜Ð]ÑÔÐTSPšYÑQPVXÐ”QÒTVPšÑRVUPÔQÑT[Ð™ÝÑSVRP‘QÐT]Ð™ÔQSPVQP‘QÐT\Ð™ÝÑSPVRP‘QÐÐT\Ð™ÝÑSVSPÙÑÑPT[ÐšQSVSPÙÑÑPTZÐšÑRVVPÙÑÑTZÐšÑRPVYÐÐQÒTYÐšPQRV[ÐÑÒÐTXÐšYÑRV[Ð™ÑÓPTVPšQQÐV]Ð™ÑÓPTVPšQQVM”QÓÐTUPš™ÑQVM”QÓÐTTPšÐQQPVP]ÑÔTSPšÔQQV’P]ÑÔÐTSPšÙÑQV’P]ÑÔTRPšÝÑPÐV“PYÑÕTRPšÝÑPÐV“PYÑÕTRPšÝÑQV‘PQÔPTUPšQRVVPÝÑP‘PÐTM™”P™Î™TM™]Ð™ÐQSVRPÙÑÑTZÐ“PPSÙÐ“QPSØÐ“QPSÖP“‘PSPUP“QÑPSTTP“UÑPSYÓP“[QPS]ÓP“[QPS]ÓP“UÒPSYÔP““PSTUP’Œ˜ÐPÖPRTVP’ÜÐQ™ÏOH‹›Ý\‹LKLÈŽˆ–PPRQSÖQT•ÝÑUÙÑQÖÐRUÔQQØTPRÐQQØ]ÐQÒÔQR•ÐPQ˜PQÒ™ÑSÕÐQØ”PQÒ”QTUÐQ˜™ÐQ’QU™ÐQØÐQÒYÑRRÝÐP“PS™ÐQ˜ÐPQ’TQRTPR”PQØÔPQ’TQQ“]ÐR”PQ˜ÔPQÒPQQÓPR”PQØÙÐQ’ÑQ“”PR”PQ˜ÝÐQ’ÑQ“™ÐR”PQ˜ÝÐQ’QQÓÐQÕ”PQ™PQ’QQÓÐPQÕ”PQYPQRQQ“ÐPQÕ”PQYPQQÝÑQÓÔPQÕPQ™ÐQ‘ÝÑQ“ÙÐQÕPQ™ÐQQÙÑQÓÙÐQÕPQYÐQ‘ÙÑQÓÝÐQÕPQYÐQQÔQQÔPQ•PQYPPQ‘ÔQQ”PQ•PQYTPQQÐQQÔPQÕ]ÐQ™TPQ‘ÐQQ”PQ•]ÐQ™YÐQÑQÔPQÕYÐQ™YÐQQÑQ”ÐQ•]ÐQ™YÐQQÑQÔÐQ•YÐQÙYÐQ‘ÑQ”ÐQ•YÐQÙYÐQQ™ÑQÔÐQ•YÐQ™]ÐQ™ÑQ”PPQ•YÐQÙ]ÐQQ™ÑQ”ÐQÕYÐQÙPPÑ”QQÔTPQUYÐQÑ™ÑQTPPQ•YÐQÑ™ÑQTPPQÕYÐQÑ”QQ”TPQ•PS”QQTTPQÔÔPT”QQTTPXQ”QQTYÐXQ”QQTYÐXÑ”QQPPYÑQQÐZ‘QQP[QQP[‘QQÝÐ\QQÙÐ\Q”QPÓÔP]ÐQ]SÑ]ÓÑ]ÙPPÓ™Ñ^˜ÝÐQ“”QLXÙÐQÓ”QL˜ÐPR“QLØÐRÓQMX™ÐSQ‘’”QQP‘RQR]Ð‘’]ÑR“]Ð‘R]ÑS]Ð‘’]ÑS“]Ð‘’QS“YÐ‘’Q•Q•Q•Q•Q•”Q”Ò”Q”Ò”Q”Ò™Ñ”R™Ñ”’Ñ“ÒÑ“ÒÑ“ÒÐQ“ÒÐQ“ÒÐQ“ÙPRÔQ“™ÐP™YÐSÔQš’ÙÑ›’ÔQœTQžÝÑŒÑ™ÑŽQQ‹ÑPQÑTMšQSVUPÝÑÒT[ÐšPQRVZÐÐQÒÐTXÐš]ÑQÐV]Ð™ÑÓPTVPš]ÑQÐV\Ð™ÑÓTXÐš]ÑRV]ÐÑÓTXÐš”QRVMÐQÓÐTYÐšÑRPVPÐQÔÐTZÐšÙÑRPV”PÐQÕPTXÐ›ÑRV˜Ð™ÑÖTUP›]ÑQPVŒQÙPTTP›™ÑQXPP]ÑÙÐTRP›ÙÑPÐXRPYÑÚPTQPœQPXTPTQÚÐTPPœQPPXUPPQÛTPPœQPPXUPPQÛTPPœQPPXUPPQÛTPPœQPPXTPPQÚÐTPPœQPPXTPPQÚÐTPPœQPPXTPPQÚTPP›ÝÑPPXRPTQÙÐTQP›ÐQPÐVYÑÙTSP›QQPV›Ð”QÖPTVP›ÑRV–PÐQÕPTZÐšÝÑSVPÝÑÔPT\ÐšÑSVMÙÑÓÐT[Ðš”QRÐV]ÐÔQÓTZÐšQRV]ÐÔQÓPTZÐšQRPVLÐQÓTYÐš”QRPVLÐQÓTYÐš”QRVMÑÔTVPšÐQQÐV‘P™ÑÔTVPšÐQQV’P”QÔTUPšÙÑQV’P”QÔÐTTPšÝÑQPV“P”QÔÐTUPšÙÑQV’P”QÕTUPšÝÑQV’P™ÑÔTYÐš”QSPVYÐ‘ÑP‘PPÐT’P™“P™T“P™P™TP™”N™ÐQSÐTÝÍÐQ•STÞQ]ÓPTÞQSTÍZQRÐTÍZQRUšQRPUšQRUšQRPUšPQRUšQRPTÍ[QRTÚÐPÌÐTŽ^PÓOH‹›Ý\‹LKMŽˆ’ÔPRVÐRRÑSUÝÐS’QT•ÔPT’]ÑTÕÐPR–PRYÑRSÐRUÐR”PRTQQÓTPQÕ™ÐRÐRPQQÓYÐQÕ™ÐQØTPQÒPQQ“]ÐQÕ”PQØYÐQÒÑQÓPQÕPQØ]ÐQ’ÑQ“”PQ•PQ˜]ÐQÒQQ“”PQÕ]ÐQØPQÒQQÓ™ÐQÕ]ÐQ˜”PQ’QQS™ÐQ•YÐQØ”PQÑÝÑQ“ÐQÕYÐQ˜™ÐQÑÝÑQ“ÐPQUTPQ˜ÐQ‘ÙÑQ“ÐPQUTPQØÐQÑÙÑQ“ÐPQÕTPQ˜ÐPQ‘ÔQQ“ÐPQÕPPQØÐPQÑÔQQ“ÔPQ•PPQØÔPQ‘ÐQQ“ÙÐQ•PPQ˜ÔPQÑÐQQ“ÔPQ•PPQ˜ÙÐQ‘ÑQÓÙÐQ•PPQXÙÐQÑÐQQÙÐQ•ÐQXÝÐQ‘™ÑQÓÙÐQÕÐQ˜ÝÐQ‘ÑQSÙÐQ•ÐQ˜ÝÐQÑ™ÑQ“ÝÐQ•ÐQYPQ‘”QQÓÝÐQ•ÐQPQ‘”QQ“ÝÐQ•ÐQYPQ‘”QQ“ÝÐQ•PQ™PQ‘”QQ“ÝÐQÕPQ™PQ‘QQ“ÝÐQÕPQ™PQ‘QQ“ÝÐQÕPQ™ÐQQQQTPQÕPQ™ÐQ‘QQ”PVÐQ‘QQTPUÙÐQ‘QQÙÐX™ÐQQQQÔPYÐQQQQÐYÙÐQQ”QPÓ™ÐZYPPPÑ”QPÓ”P[Q[“YÑ\STQ\ÓPQ]SPQ]SÑ]ÓÑ]ÓÑ^SQLÑ^˜ÐPQÝÑQSPL˜™ÐQÑÙÑRPLX”PRÔQR’ÝÐM]ÐR‘ÔQSÝÐMYÐRÑÔQSRÙÐMXTPSÔQS’ÙÐMVÐS‘ÔQSÒÙÐM–™ÐS‘ÙÑ’Ö”PSÑÙÑ–‘ÙÑ–‘ÙÑ–‘ÙÑ–‘ÝÑ–ÝÑ–Q•ÒQ•ÒQ•RQ•RQ•RQ•RÑ”ÒÑ”ÒÑ”’Ñ”RÑ”RÑ”RÑ”PQ“ÒPQ“’TQ“QQ›QÑžÔQŽÑÐÐTUPšQQPVXÐ]ÑÒTRPšYÑPÐV[ÐTQÓTQPš]ÑPÐV[ÐYÑÒÐTQPš]ÑPV\ÐYÑÒÐTRPšYÑPÐV[Ð]ÑÒTSPšPQQPVVPQÑÐTUPšQQÐVSP™ÑÐÐTXÐ™ÐQQÐVRP™ÑÐÐTVP™ÝÑQÐVRP”QÑPTUPšQQVUPQÑÐTTPšÑQPVXÐ]ÑÒPTSPšPQQVYÐ]ÑÒTSPšTQPÐV[ÐYÑÒÐTRPšYÑPÐV[ÐYÑÒÐTRPšYÑPV\ÐTQÓTQPš]ÑPV\ÐTQÓTQPš]ÑPV\ÐTQÓTQPš]ÑPÐV[ÐYÑÒÐTRPšYÑPÐV[Ð]ÑÒTSPšTQQPVXÐQÒTUPšQQVUP™ÑÑTVP™ÙÑRVQPÑÐPTXÐ™ÐQRVVÐVPP™ÑÐPTVP™ÐQQÐVQP™ÑÐTUP™ÙÑQVRP”QÑTTPšQQPVTPQÑPTSPšÑQVVP]ÑÑÐTRPšÑPÐVYÐYÑÒPTRPšPQPÐVYÐYÑÒTRPšTQPÐVZÐTQÒÐTQPš]ÑPPV]ÐPQÓPTPPšQPPV]ÐPQÓPTPPšQPPV]ÐPQÓPTPPšQPPV]ÐPQÓPTPPšQPPV]ÐPQÓPTPPšQPPV]ÐPQÓPTPPšQPPV\ÐTQÒTTP™ÝÑQÐTQRRÓVÐÐTPP‘Qž‘QŒPÝÑŒÐÔQÐQŽPÑ]™Ð”P™Ñ]Ð]Ð”Q]ÐP]Q]UÐP^]Ñ]•ÐP^PYÑ^ÐP^TQ^ÐPLPQ^UÔP^TQ^ÙÐ^PTQ]ÕÝÐ^YÑ\ÖPP–Ð]]Ñ[VP[H‹›Ý\‹LKMHŽˆ”PPR”QSÙPPRÝÑT™ÐSSÙÑUPT“ÔQRT™ÐRXÝÐUSÐQRÙÐQØÙÐR™™ÐRÓ™ÑRÙÐQØÔPQÙPPP™ÐQPPÕPšÜÐP›PPPPYÌTYPYPXQTPQÓ]ÑQÕPQØ™ÐQšÑPPš’PšÌP›LP›ÙÐPV^TV“PVPUÒTPQÓPQQÕÐQØPQšYÑPPšP•MP›\ÐP›ÛÐPV]TV”PUœPPXSTPQÓÑQ•ÐQØYÐQš]ÑPPšMšÎP›ZÐP›ÝÐPV]PTU”PPUœPUÓTPQÓQQ•PPQ˜PPQÚ™ÑPPšL•PP›YÐP–NPU\ÐTU”PU›PXTTPQÒÝÑQÕPPQÖÐQšÐQPP”ÜÐ•‘PP•ØÐP–PPV\PTV”PU›PPUÔTPQ’ÙÑQ•TPQÖ™ÐQšÙÑPP”ÛÐ•‘PP›UPPœPPU\TU”PV›PUÕTPQRÔQQ•TPQÖPQÚÝÑPP”ÚÐ‘’PP•ÔPP–”PPT\TT”ÐPUšÐPXUPTPQ’ÐQQ•YÐQ–]ÐQÛQPP”ÙÐ‘‘PP›TPP’•PPT[ÐTT”ÐPUšPUÕTPQRÐQQUYÐQ–]ÐQ›QPPÚÐ[PP•ÓPP––PPT”ÐTUšPPXVTPQYÑQ–YÐQ›ÑPP‘’P•ÑPPœÐPS”ÐTVšPXVPTPPÕYÑQ–TPQÛPQPP[P‘•’P‘‘]Ð‘ÚÜÐ’[Ð’Ð’ZÖP’šÖP’ŒP’ÚÓP“RP“ÒP“P“QPLPSZNžŽSÎÑSÍÚSšMÞSšN‘SPPU]TLPQ
ÐPZÝTLPQPP\ÝUYÐPLUYPMUYPPNU™ÝÐU˜ÝÐU˜ÝÐU˜ÝÐU˜ÝÐU–]ÐU–]ÐU•]ÐU•]ÐU”^U“^U’^U’^U‘^U‘^U‘^UÞTPPQPPUP•ÑPPXÞPUMÐTPR’ÑP“YÐ“Ü™ÑPPÞÐ–˜LP]ÔPUÊÑTPPšÑPPœ[ÐPNÐVYÐœTQPQPLš™ÑÛTPTÑQÔXUPP”SV”P›ÝÑPQ”[Ðœ”QRÐX]ÐÙÑÜÐT[Ðœ]ÑRÐX[ÐÙÑÜPT\ÐœYÑRÐX\ÐÝÑÜPT\Ðœ]ÑSX]ÐÝÑÝT\Ðœ”QSXLÙÑÝTZÐœÐQRPXPÑÞTXÐœÔQQÐX’P”QÞPTTPœÝÑQPX’P]ÑÞPTSPœÔQPÐX‘PYÑÞTQPœÙÑPX’PPQÞTPPœÝÑPPX“PPQÞTPPœÝÑPPX“PPQÞTPPœÙÑPPX‘PPQÞTPPœÔQPPX‘PPQÞTPPœÐQPPXPPQÝPTPPœ™ÑPPXLPQÜÐTQPœYÑPXZÐYÑÛPTRPœQQVŽQØÐTTP›QØPTPQ”QÕPTVPšÔQRVPÔQÓÐT\Ðš”QSÐVZÐ‘YÑÑÐT’PšÑTÐVVP‘YÑÑÐT‘PšPQTVYÐ‘TQÒPT‘PšPQTPVZÐ‘PQÒTPšYÑTV[Ð‘ÑÓTNš]ÑTV\Ð‘ÑÓTMš”QSVL‘QÓÐTLšÑSVN‘QÔPT]ÐšÐQSPVP‘QÔT\ÐšÙÑSV’PÝÑÔÐT\ÐšÙÑRÐV”PÙÑÕT[Ð›QRÐV”PÙÑÕTZÐ›ÑRV–PÔQÕÐTZÐ›ÑRV–PÔQÖTZÐ›ÑRV˜ÐÔQÖTZÐ›ÑRV˜ÐÔQÖTZÐ›ÑRV•PÙÑÕPT\ÐšÐQSV[Ð›PQPPTPšÑUVVÔVPVQP‘ÑÑTLšÑSTÎPÐPÐ›PÎÐTÎ[QRU›QRTÎ[ÐQRPU›QRU›QRU›QRU›QRUœQRTÎ\QRPTÌ\PÎTÐPÑOH‹›Ý\‹LKMˆŽˆ™ÐTYQUSTQSXÝÐVSÑTØÙÐR™PT’ÝÑVXÔPRZQPPÚZÐ’PPÐPYÛÐTZÍÐP]PPYRTPRRÑRÐR˜”PR]ÑPPÐÕPŒPPŒŒP›ÌPXÚÐTYPVœÐPUÓÐTPRYÑRPQØ]ÐQÚÑPPšQPŒPP›[ÐPœPPXÚTYÐPYPPXTTPRPQRÐQØYÐQšÙÑPPšŒÐP›ZÐPœPPUYPTYPVœPUÕTPQ’QRÔPQØPPQÛQPP”ŒšÛÐP›YÐP––PPUXÐTV“PU›PXVTPQÒQQ”ÝÐQÖÐQ›PQPP”œÐ•]ÐP›VPPœÐPUXPTU“PPV›PPXXPTPQQÙÑQ•PQÖ™ÐQ›]ÑPPšÐ•LP›VPP–œÐPTVTU“ÐPV›PPUØÐTPQQÐQQ•ÐQÖ”PQ›QPP”™Ð‘NP•ÔPPœÐPUVTU”PVšÐPXYTPQ‘ÑQUPPQ–PQÛ™ÑPP^P•PP›TPPœPTUÐTT”PPVšÐPUÙTPPÑ™ÑQUTPQÖ]ÐQÑ™ÑQUYÐQ–]ÐQÑ™ÑQTPQÖ]ÐQÑ”QQUYÐQÖ]ÐQÑ”QQUYÐQÖYÐR”QQ]ÐQ–YÐRQQU]ÐU‘QQU]ÐV”QPÕ]ÐV•]ÑX•TQY•ÑZÑZÕQ[”ÝÑ\TÝÑ\”ÙÑ\ÔÔQ]TÔQ]”ÐQ^ÐQ^ÝÑPP•XÐ“MPPYUÐPTPR”™ÑLYÐRÓ”QQ”PLÙ™ÐSQQÔ”PLÙ”PSS]ÑR””P‘]ÔQPP^’P‘TPT˜ŽPXÞPTLQPQUÊÐTPR“]ÑSÔP‘”QPPÞ“P•œŒP\ÞU˜NPTPSQ•QPQP•“ÐPLU”ÍÐTPS“”Q•YÑPQ•P•MÚÐPNU’ÍTPTÞÑPP•P•\•PPÑLÐU‘ÌTPZ“Ñ”œÔQPRž˜Ð•XPPÙÍUÝTP\ÐQ”\QPSÐ•›ÐPÍPUM›ÐTP]ÓÔQ“ÚÙÑPPÍ•PQMPUM“PTPTÛÙÑPSššÐ›ÑMPVŽ“ÔQÙPUÐ›™ÑUÐTV]ÐRÖP‘”QRRPÞPT”PÚRP\ÝÑUPXŽ‘]ÒPT“P™ÑUXŽ‘]ÑÊÐT“P”QUXœÐ‘]ÑÍTUPžÑQPXÖP]ÒÐTSPžÑPÐXØÐYÒTRPžÑQXÕPYÒÐTQPžÑPPXÙÐPRPTPPžPQPPXÙÐPRPTPPžPQPPXÙÐTRTRPžQPXÖPTRTQPžQPXÓPTRÐTRPÑQXÐQÍPTVPœÝÑRXMÙÑÜT[ÐœÑRÐXTPÙÑÙÐX]ÐPQRÐVŒÙÑÖT\Ð›ÑSV˜ÐÝÑÖT\Ð›ÑSPV–P‘QÖTL›ÑSV–P‘QÖTM›ÑSÐV–P‘ÑÖTN›ÑTPV•P‘TQÕPT’P›QUV“P‘™ÑÔPT™Ðš™ÑZPVUP’ÐQ‹ÒÐQ‹ÒÐQ‹ÒÐQÐPTØÐ™ÔQ[PVRP’ÑÐTÖP™ÝÑ[PVSP’™ÑÑTÖP™ÝÑ[PVSP’”QÑTÔPšQZÐVVP’QÑÐTÓPšÑZVYÐ’]ÑÒPTÒPšPQZPVYÐ’YÑÒTÒPšTQZV[Ð’TQÒÐTÑPšYÑZV[Ð’TQÓTÐPš”QYÐV]Ð’PQÓTŽš™ÑYVM’ÑÔTŽšÑYVN’ÑÔPTšÐQYPVP’ÑÔPTšÔQYPV‘P’ÑÔTšÔQYPV‘P’ÑÔTšÔQYVN’TQÓTÓPšPQ[VRP’ÐQŠÒÝÑSQŒÓQ’ÙÑŽRÔQÐPTÙÐ™ÙÑ[U˜PPQ˜ÐP›PQ[PTÍMQ[TÎMQZÐTÎMQZUQZPUQZUQZUÐQZUŽQZPTÎNPQZPTÌPTP]’QZšQPRYÏOH‹›Ý\‹LKMÈŽˆ˜PPRÓPQR–ÐS“ÑS–”PTSQT–]ÐURÝÑU]ÐR™ÐR’ÙÑRÐRVTPRÔPRÔQQ“ÔPRPPRÙÐRÐQQÓÝÐQÖÐRPQÒÑQÔPQÖÐQÙPQÒ™ÑQÔPRÐQÙÐQ’”QQÔPQÖPQÙÐQÒ”QQ”ÐQÖPQÙPPQ’QQ”ÐQÖPQÙTPQ’]ÑQÔÐQÖPQÙTPQÒ]ÑQ”ÐQÕÝÐQÙYÐQ’YÑQ”PPQÕÝÐQÙYÐQÒYÑQÔTPQ•ÙÐR]ÐQÒTQQÔPPRÙÐQÙ]ÐQÒTQQ”YÐQ•ÝÐQ™PQ’TQQ”TPQÕÔPQÙ”PQ’PQQÔYÐQ•ÙÐQ™”PQ’ÑQÔYÐQÕÔPQ™”PQÒÑQÔYÐQÕÔPQ™”PQÒÑQ”]ÐQ•ÐPQÙ™ÐQ’ÑQ”]ÐQ•ÐPQ™™ÐQÒÑQ”]ÐQ•ÐQÙÐQ’ÑQ”]ÐQ•ÐPQ™ÐQRQQÔ]ÐQÕÐQÙÐQ’QQ”]ÐQÕÐQÙÐQPPŒ•SPP›PP›ÐPPUYTU‘PPU•ÐPXPPTPQ’QQ”PQ•™ÐQÙÔQPPÐšÔPP›PP›ÑPPUXÐTU‘PPV•PXPTPQRQQ”PQÕ”PQÙÔQPP”Ð•TPP›PP›ÒPPTXTV‘PPZPQ”P^PÐTPQQÝÑQ””PVÙÑPPœÐ•TPQÒSPPSXTUÐPžQTPQÝÑQ”PPYÙÝÑPP^Ð•RMPPSXÐTSNPPÕÑTPQQP”P[TQ[ÓÝÑ\SÙÑ\ÓÔQ]SÐQ]“ÐQ]ÓÑ^S™Ñ^“™ÑL”QLYPPQRQQ“”PL™ÐQÒ]ÑRPL™PRRYÑRÓPMÝÐRÒYÑS]ÐMXÙÐSYÑSS]ÐMXÔPS’YÑSÓYÐMØÐPSR]Ñ’Ø™ÐT]Ñ–’]Ñ–’]Ñ–RQ–Q–”Q•’”Q•’™Ñ•”Q•R™Ñ•R™Ñ•™Ñ•Ñ”’Ñ”’Ñ”’ÐQ”RÐQ”ÐQ”ÐQ”ÔQ“ÒÔQ“’ÙÑ“YTPSR™ÑšQ™ÑP‘ÔPŒQ]Ñ‹ÑÑÒPT]Ðš]ÑSVLÙÑÔTZÐšÔQRV‘PÔQÔTYÐšÙÑRV‘PÐQÔÐTYÐšÙÑRPV’PÐQÔTYÐšÙÑRVPÔQÔPTZÐšÑRÐVMÙÑÓT\ÐšQSV\ÐÙÑÓPTZÐš”QRVNÐQÔPTYÐšÐQRV’PÑÔÐTVP›QQÐV”P”QÕÐTTP›ÑQPV™Ð]ÑØPTSP›YÑPÐVÐTQÙTQP›™ÑPPVŽPQÙÐTPP›ÐQPPXPPPQÙÐTPP›ÐQPPXPPPQÙÐTPP›ÐQPPXPPPQÙÐTPP›ÐQPPXPPPQÙÐTPP›ÐQPPXPPPQÙÐTPP›ÐQPPVŽTQÙPTQP›™ÑPÐVÐYÑØÐTSP›YÑQPV™Ð”QÕÐTVP›QRV’PÐQÔPTZÐš™ÑRÐV]Ð‘QÒTMšQSÐVSP‘ÑÐTM™ÔQSÐVRP‘ÑÐÐTM™ÙÑSVTP‘QÑPT]ÐšQSPVUPÝÑÑÐT\ÐšÑSVXÐÝÑÒT\ÐšÑRÐVYÐÙÑÒT[ÐšTQRÐVZÐÙÑÒTZÐšYÑRV\ÐÔQÓTZÐš]ÑRV\ÐÐQÓPTYÐšQRPV]ÐÐQÓPTYÐšQRPVLÐQÓTYÐš”QRPVLÑÓÐTXÐš™ÑRVNÑÔTXÐš™ÑRVMÑÓÐTXÐš™ÑRPVLÐQÓTZÐš]ÑRÐVYÐ‘QÑPTNT‘PYšP™P˜ÞP˜ÞP˜ÞP™”P™P“ÑSP“LNSP“QŽSP“QŽSPP“UŽSTP“UŽSZP“QÐPSTP“‘PSP’ÞŒPUÔPS’P’LœÐR]ÏOH‹›Ý\‹L‹LŽˆ‘ÐT‘QVÙÑXÐQYÑZ™ÑZ”Q[Q[]Ñ\YÑ\šQPP”QP“TPPYÐTÌ‘TPSPQ]™ÝÑPQPP“PPRÑTPSPQ]™ÐUPQ]Ù™ÐUPPQ^™ÐVPQ]Ù”PVPQ^”PXPQURPU™YÐYPQTÒÐUYYÐYÐPQT’ÐUTPZPPQTRÐUYPPZYÑS’PPUPP[YÑSPPUPP[PQQÒPPUYÐ[’TQUÐ[ÒYÑTÙP\’YÑTÙP\’YÑTÙP]YÑTØÝÐ]YÑTØÝÐ]RYÑTØÙÐ]’YÑTØÙÐ]ÒYÑTØÙÐ]ÒYÑTØÔP^RYÑT˜ÔP^RYÑT˜ÔP^RYÑT˜ÐPLTQTØÐPLTQT–PQØ”PLÒTQT•P”RTQT•P–RTQT”ÝÐ–’TQTTÐP˜ÒTQTT™Ð™RTQTTP™ÒPQT”]ÐšPQT”YÐšRPQT”YÐšPQT”TPšRPQT”PPšRPQT”PPšRPQT”ÐšÒPQT”ÐšÒPQT”Ð›RPQT”P›ÒPQTÔP›ÒPQTÔPœPQTÔPœPQUPœTQTÓÝÐœRTQUÝÐœRTQUÙÐœ’TQUÔPœÒTQUSÔPœÒTQU“ÐPYÑUSÐRYÑÑTÓP™ÔQZVQP’Q‹ÒQŠÒQŽR”QÒ™Ñ™šPQPQšXÐ–ÛÐP”[UŒ“PTPPš™ÑPQYÐ•ÖPP[XPTPP’ÔQ–ZÙÑPPV–PPR\PU–\U•\ÐU“]U‘]UNÐULUZÞUYÞUXÞUV^PUV^PUT^UU]PUZÝU\ÚPTT\PQ‘YUPUÐYPUÒYUÓXÐUÕXÐUÖXUØØUØØUØØPUÚÖUÛÖPUPÌPUPÜÖPUPÜÖUPÛÕÐUPÛÕÐU–PÚÕU–PÚÕU–PÙÕPU–PØÕPU–PÖUU–PPÔUU–PPRŒPQPRUU–PPšÔÐTšÞPRLP\PÕT™PPÕT––PÐUT•–PÓUT••ÐPÖUPT“•ÐPØÕPT’•ÐPÙÕPT’•ÐPÚÕT‘•PÜÕT‘•PÜÕÐTNUPÜÖTMUÐPÛÖPT^ÐPÛÖT\ÐPÛØTYPÛPTÙPTÓOH‹›Ý\‹L‹LHŽˆ™ÔQPPÖQPT]PPTQSÙÐQP‘R‘LÌ‘›Ð‘ÔšÐ‘ÐR•P‘’ÐR“P‘ÒÐRP’ÐRPN’ÛÐRTL’[šÐR]ÝÐ’’ÐR]ÜÐ’›™ÐR™ÛÐ’ÒÐRÐYÐ“ÐRÔXÐ“˜ÐRÔVP“ÖPRÝÖP“ÕPSUP“VPSTP“LÔPSÓP“–PSÒP“›“PSPQP“ÒPSÑP“ÒPSTPP‘ÞRPQÑŽP’PSTPP‘ÚUPQ•“PRPSYÐP‘ÐÖPQ‘’PU]ÐP‘žXÐQ‘PU”PP‘šYÐQLUÐP‘”ÙÐQLÐUÙÐP‘ÚÐQLÐUÝÐP‘^[ÐQLÐVPP‘Z\ÐQZÙÐVPP‘Z\ÐQUYÐVPP‘TÜÐQZØÐVÑP‘]ÐQZØÐVRP‘ÝÐQZØÐVSPÚLQUVPVÕP”\ÐPTÌQUVPV]Ð‘LPVL‘ZÕPVPÌ‘ZÕPVTÍ‘UUPVZM‘ZÕPVZM‘ZÕPVZM‘LPVZN‘ZÕPV^N‘LPVÎ‘LPV‘P‘ZÔPV‘P‘LPV‘P‘LPV^‘P™‘P™‘P™P™P˜Þ’P˜Ú’P˜Ú“P˜ÑP˜š”P˜•P˜UP˜QÐ–‘Ð–Z™Ð–Ð–Ð•ÞœÐ•ÞÐ–––ŒPQÙTPRTQ›Ô]Ñ›”YÑœTYÑœ”PQÝÑž“ÑQÓÐPŒ“ÑÐPTÝÐ™ÙÑ\VSP’ÙÑ•YÐQPS[Ð•MPPÌPU”ÑTP\’ÔQ•ÚQPRÚZÐ•›ÖPPÙÜU™QÐTP[ÒÔQ–PQPRšYÐ•ÖZÐPÔ[UœRÐTPZ’Ñ˜ZQPRPØÐ•ÜPPQÔÐTPV’™Ñ˜›ÑPPVšÐP‘[PUYÐTPRR”Q˜›ÐQPPžUP–ÔP“›RZTP“‘ŒR^SP“‘ŒR^SP“L]ÐR^RP“L]ÐRZRP‘ž›ÐQÕÐRTÒP‘žŽQ]ÐRPÑP‘ŒPPÛÐRTÑP‘Œ\ÐRPÑP‘›ÐRQP‘›ÐRQP‘•›ÐRQP‘‘šÐRQP‘‘šÐRZQP‘LZÐRÒP‘[ÐRšRP‘[ÐRÔÓP‘U™ÐRÚSP‘Q˜ÐSÔP‘ÐSÖPÌXÐSÙÐÑ˜ÐSÚÐ›ÐS˜Ð“˜Ð“™Ð’ÌZÐ’Õ›Ð’ÑŽ’ÏOH‹›Ý\‹L‹LˆŽˆ™ÐQYPP™ÑR™ÑSÑSÙÑT™ÑUQVÝÑXRÑSXÝÐYÝÑTØÙÐYÑÐQVXÙÐZ™ÑX˜ÙÐZQ”QYÔPZÑQY˜ÐP[YÑZXÐP[QYÑZ˜ÐP[‘Ñ[XÐ\Ñ[ØÐ\QQ\Ð\QQ\˜™Ð\ÐÝÑ\Ø™Ð\ÐÙÑ]”P]ÔQ]X”P]PÐQ]Ø”P]PÑ^P]Ð™Ñ^XP]Ð”Q^˜]Ð^QXÒPUX]Ð^PQXR™ÐTØ]Ð^P]ÑV’ÐT˜]Ð^PYÑV’™ÐTÖ™ÐLÐYÑVRÐTÖTPNTQVRÐT•ÔP‘PTQVÐT•™Ð’PQVÐT•P’PQVÐT•YÐ“PQUÒÐTÕPP“PQU’ÐT•Ð“PQU’ÐT•Ð“PQURÐT•P”PQURÐT•P”PPQUÐT•P”ÐPQTÒÐT”ÝÐ•PPQTÒÐT”ÝÐ•TQTRÐT”ÝÐ•YÑSÒÐT”ÝÐ•]ÑSRÐTÔÙÐ•ÐQRÒÐTÔÙÐ•ÐQPÐQÐPTTÔP–ÐQT”ÐP–RÐQT”ÐP–RÑUÐP–RÐQT”ÔP•ÒÐQTÔÔP•’ÔQT”ÔP•ÒÔQTÔÔP•’ÐQUTÔP•RÔQUTÔP•RÔQUTÐP•RÙÑUTÐP•ÙÑU”Ð”ÒÝÑU”™Ð”ÒÝÑUÔ™Ð”’ÝÑUÔ”P”“Q˜Ú]ÑPPÚ]Ð–Ì•ÞL–Í•ÞN•ÞN–P–RPPUÖPTPPÓTQœ“YÑœ“]Ñœ“”QœS™ÑœSÑœSÔQ›ÓÙÑ›ÓÝÑ›“ÝÑ›’YÑRPPžRTQÐTŽ™ÝÑYPVTP’QÑTÐšQXÐVUP‘ÝÑÑPTœÐšQXPVUP‘ÙÑ›ÐQPRÐ–›ÒPPQÑPTPV‘ÔQ›šÑPQ”šÐ˜RNP]ÖPUÛTÐTPRÐQœQÑœ‘ÑœÑ™Ñ™Ñ”QJÕP]‘”QNU”P]QQNÔP\Q]ÑMÖP[‘YÑMÖÐZÑYÑVÐYVPPZ‘TQVSÐP“TPVVTPZQTQVYÐUÖYÐZTQUÓPU]ÐYÑTQU“™ÐTPY‘TQU“ÙÐR–PYQTQU–”PYTQUV”PYYÑU”PYYÑU™ÐXÑ]ÑT–™ÐXÑQT™ÐXÑ”QS–™ÐY‘ÑR–™ÐZ‘ÔQQÖÐ[XPQ[ÖÑ\VÑ\–Ñ\–Ñ\ÖÑ\ÖÑ\ÖÑ\ÖÑ\ÖÑ\Ö™Ñ\ÖÑ\XPQ[˜TQZX]ÑXÈ‹›Ý\‹L‹LÈŽˆ™PPQ™™ÐP™ÑSÑS™ÑTÑT™QU‘ÔQSXÝÐVQ]ÑP‘”PU˜ÙÐXQTQXØÙÐXÑÑYØÔPY‘QZ˜ÔPYÐÙÑ[˜ÐPZÔQ\XÐZÐÑ]™Ð[P™Ñ]X™Ð[”Q^”P\Q^X”P\P]ÑLP\]Ñ^˜P\ÐYÑL˜]Ð]PTQLØ]Ð]PTQMYÐ]PQMXYÐ]ÐPQM˜TP^PQXÒYÐV˜TP^PPQVRPVTP^PPQV™ÐU˜PPLPQUÒ™ÐU˜PPLPQU’ÐU˜PPLPQURÐU˜PPLPQUÐU˜PPLPQTÒÐPUVPMPQT’ÐPUVYÐMÐTQTÔPUPPYÑSRÔPUÝÐÐ]ÑR’ÔPUÙÐ‘ÑPÐÙÐP’ÔPU™Ð’ÔQU™Ð‘ÒÔQUP’RÔQU]Ð’’ÔQUYÐ’’ÔQTÕTP’ÒÔQTÕÐ“’ÔQT•Ð“ÒÔQTÕÐ“ÒÔQT•P”RÔQT•P”RÔQT•P”’ÐQTÔÝÐ•ÐQTÔÙÐ•RÐQT”ÔP•’ÐQT”ÔP•’ÑTÔÐP•ÒÐQT”ÐP•ÒÑTÔÐ–ÑT”™Ð–RÑT”™Ð–ÑT””P–™ÑTÔ”P–™ÑTÔP–R™ÑTÔ]Ð–R™ÑTÔ]Ð–™ÑTÔYÐ–R™ÑTÔYÐ–™ÑTÔTP•Ò™ÑTÔPP•Ò™ÑUÐ•Ò™ÑUÐ•ÒÑUÐ’ÑPQØÐ‘^ŒTÔØÐ‘‘TÚXÐ–[ÍPXÛÐV[ÐV[ÐV\V\PV\PV\V\V\ÐV]V]PV]V]ÐUÎUÍUÝÞUÝÖPTQXPPS^PQÝÖTYÞPQÝÕÐT\ÞQÌT\PR]ÐQÌPTšÝÐQÌVZÐ‘YÑÒÐT’PšTQTVZÐ‘PQÒTNšTQTVXÐ‘Ñ‹Ú™ÑPP™Í™Ì™ÐQSPULYPÌPUZPÛÓUYPÕRÐUVœÐPÐRUVœÐPÐRPUYPÒPUUPÒUUPÑÐUUPŒÐUTPŒUTPŽUTÐPÕQUSÐPÙÑURžPÛÑT™ÚPÔžPÜÑT˜ÚPÑžPÝÑT–[PPžPPÝÑT•[ÐPšPPÌT”\P“žPÝÑT“]PN^PÝÑT“]P]PÜÑÐT’ŒPÜÑÐT‘ŒPÛÒTN^PÛÒPTLLPÙÒT]PØÓPTYPÖSTUŒPÓŒTÑŒTŽLPT™SÐTPP™ÑTÙÑSÙPQRˆ‹›Ý\‹L‹MŽˆšQPP–SPTYPÐTQRÙÐQP‘‘[Œ‘–Ð‘ÒÐ‘Û›Ð‘Û›Ð’Ð’Ð’P‘ÐRZP‘[–PR’P‘’PR™Î‘Û•PRÌ’PRÐ\Ð’VPRÐ[Ð’[’PRÝÙÐ’›’PSXÐ’ÒPSVP’ÌÑPSÖP“PSÕP“ÎSPTP“ŽSTSP“UÎSTRP“[MSYÒP“[LS]ÑP“‘ÌS]ÑP“‘ÚÐSÐP“›RPTÐP“›PUÑPTÐP‘ÔÑPQ›T]ÐP‘žRPQ•›ÐT™ÐP‘”ÓPQ•šÐTÐP‘ÕPQ‘•PTÝÐP‘^VPQLTPUPP‘ZXÐQ[PUÐP‘TØÐQLQPUÐP‘PÙÐQ[PUPPP‘PÙÐQZÎUPPP‘ZÐQZÌUYÑP‘ÛÐQU]ÐU]ÒPÞZÐQZÜÐUSPÐÛÐQZÚÐU”ÛÐ‘ZÙÐUž\Ð‘UXÐUÐÜÐ‘UVPUÚ\Ð‘UUPUÞ\Ð‘ZÔPVÝÐ‘UTPVÝÐ‘USPVÝÐ‘URPV]Ð‘ZÒPV]Ð‘ZÒPV]Ð‘ZÑPVL‘ZÑPVL‘ZÑPVL‘ZÐPVL‘ZÐPVL˜ÔÌ˜ÐÌ˜žL˜žM˜”Í˜Î˜TÎ–žP•›ÙÐPQÒÐTPRÓPQ•ÚQPP•P•‘P•‘P•Z“P•Z”P•UP•^•P•UP•UÐ•QÐ•QÐ•UÐ•^™Ð•œPPUMUÑ[TXÍQÓZÐVÚPVÚVÐVVPP’ÑÐÐT™ÙÑYVSP’QÑPTœÐšQXVUP‘ÙÑÑÐTšÐšÑVVVP‘ÑÒT–PšPQUUÒÐPÒUPUÒÐPTPXÑ]Ñš™ÝÑPQÐ’P–’YÐP’TÐUÔÓPTPS‘TQ•]ÐZš™ÑPPÔP”Q“PR[ÎPQÕTPP‘TQJÕYÐZ‘TQNUYÐZ‘TQV“ÐYUTPZ‘PQVSPPX•PPZÑPQUÓ]ÐU•PPZ‘TQUS”PTÕPPZQTQUSÐPSÕPPYÑYÑTÕÐZ]ÑTUÐYÑQSÕÐYQ”QSUÐYÑRUÐYÑÐQQ•PZUQ[UQ[ÔÝÑ\TÝÑ\”ÝÑ\ÔÝÑ]ÝÑ]ÝÑ]TÝÑ]TÝÑ]UQ]Q\•Ñ\Ñ[H‹›Ý\‹L‹MHŽˆ™TPQY™ÐP™PQR™PQRÙPQSYÑT”QSYÐT‘TQUYPVÑV™PV‘QYPXÐÙÑZÝÐYPÐQ[ÝÐYÐQ[XÔPZPÑ[ØÐPZÐ™Ñ\XÐP[”Q\˜Ð[Q]Ð[Ð]Ñ]˜™Ð\YÑ^™Ð\PTQ^X™Ð\TQ^˜”P]PQL”P]PQLXP]PPQLXP]PQLX]Ð^PQVÐPP’ÐUØ]Ð^PQU‘™ÐP’TPUX]Ð^PPQURTPUVÐR˜YÐ^PQUYÐUUÝÐÐPQTÒYÐUUÐP‘PQT’]ÐUÐ‘ÐPQTR]ÐU”P’PQTPTÕYÐ“PTQS’PTÕPP“ÐYÑRÒPTÕÐ”P]ÑRRPTÕP”ÒQTÔÝÐ•QTÔÝÐ•QTÔÙÐ•RQTÔÔP•RQTÔÐ•ÒQTÔ™Ð–QTÔ”P–RQT””P–’QT”P˜RQT”]Ð˜ÒQT”]Ð˜Ò”QTTTP™R]ÑTÔPP™’]ÑT”Ðš]ÑT”Ðš]ÑT”ÐšR]ÑT”Ðš]ÑT”Ðš]ÑT”Pš’]ÑT”Pš’]ÑT“ÝÐšÒ]ÑTÓÝÐšR]ÑUÙÐš’]ÑUÔPšÒ]ÑUÔPšÒQTÓÐPš’”QTÓÐPš’”QTÓÐPš[QPPVPQZÐVØPTPR’QÐTÕP™ÔQ[VÕÐTPT’”QœÚÙÑPPV•PP’[UØUPTPU’™Ñ›ÚÝÑPQšXÐ™ÙÑ[VSP’ÐQÐÐTÚÐ™ÔQ\VQP’ÙÑÐPTÜÐ™žL™”Í™‘P™Z‘P™UP™’P™’P™‘P™‘P™L”ŒÕPSZÐžYÐTÛ˜ÐS›Ð•ŒÙÐRÔšÐ•ŒÚÐR\ÐPSVPU™PŽU™PÕÐU–ŽPP›ÕÐU•‹ÐP–UU•ÐÐTPTQ”Q•QPPÚP•ZP•^P•^P•’P•”’P•”‘P•šP•žP•Î•ÐM•ÔL•ÙÝÐ•ÝÝÐ•ÝÜÐ“ÚØÐRP\Ð“ÑXÐRT[Ð‘ÔÕPPTØÐQÌÐRP[Ð‘ÐÚÐQÑYÐRÛÐ‘ž\ÐPTÌQZÙÐRP[Ð‘šMQÐRÛÐ‘š‘PPÕ[ÐR[Ð‘•[ÐRÙÐPT\Ð‘LÐRYÜÐ‘LÐR™ÜÐ‘ZÝÐS]Ð‘ULSL‘SÍ‘ÍSN‘MSPÑNS”PUMSÍ“Í“Í“Í“N’Ì’ÚÎ’ÑP’•‘P’[P’”P‘™ÏOH‹›Ý\‹L‹MˆŽˆšQPP’\ÐTXSTQRPQP‘XÐTÒTQUÑP‘–VPT™ÙPTZÛÐPQÑTPV‘ÙÑP’PSÚQPQÞÐ‘PPŽPTŒÐTPZQYÑZÔQPRP’–QPPÕTTÙPTP[QÑ\ÐQPRÐ]Ð“RÙÜÐ“ŽRÙÛÐ“ÎRÝÚÐ“VRÝÙÐ“LÍSXÐ“–SÖP“›ŒSÕP“ÒSPUP“ÒÐSTTP“ÛÐSTSP“ÌÝÐSYÒP’ZUPQÖÐS]ÑP’ØÐQÒÐS]ÑP‘ÞZÐQ–ÐSPP‘Ú[ÐQ•ŒUYÐP‘ÔÛÐQ•šÐPUœÐUPP‘ÐÜÐQ‘˜ÐUÐPP‘ž]ÐQLXÐUÐPP‘š]ÐQLTPUÝÐP‘šLQ[PVPP‘”ÌQ[PVÐP‘ÌQ[PVÐP‘ÍQUPVÐP‘^LQZÎVPPP‘ZMQULVYÐP‘ZMQU]ÐVYÐP‘PÍQU\ÐV]ÑP‘MQU\ÐVRP‘ÍQU[ÐV™ÔPÐÍQUZÐVÕP^MQUYÐXTÍ‘QXÐXZM‘QVPX^M‘QUPXÍ‘QUPXÍ‘QTPX”Î‘PXšL‘URPXžM‘QQPXÐÍ‘PXÔÍ‘ŽXÚM‘QXÚLšQ]VSP“QÑTÌ™ÙÑ]VRP“QÐTÌ™ÐQ]VVVVÝPVÝVÚTPP›ÝÑPPZM˜šM˜œÐPYÝUÊÜTPSSÑŒÑPQPÎšTQ]V[Ð“PQÒÐUPšYÑ]ÐV\Ð“TQÒÐUPšTQ^PVZÐ“]ÑÒPUPšÑLPVVP“™ÑÑUÐšQMVSP“ÙÑÐPUÐ™žŒ™‘”ÛÚÐQNU^RÐTP]SÝÑ“ÚQPRÞœÐ•ÌPÚÍUÔTP[SÐQ”ÚÐQPR‘P•Ò’PPÐZÐTXÝQžUÐTPSYÑœTQœRPQœ’ÑœÒÑœÒÑÑœÒQ‘TP\QJÖPPÖP[RQJÖÐZ‘ÝÑJØYÐY‘ÝÑNXYÐYQÝÑNYÐYQÙÑNYÐYÙÑMØTPYQÔQMØYÐYÔQMXYÐXÑÐQM˜YÐY‘ÑM˜YÐZÑ™ÑM˜YÐ[‘™ÑMYÐ\”QMTP\Q”QL˜TP\ÑQX“PPVTP\ÑQVS”PT˜TP\Ñ]ÑVSÔPRØTP\Ñ]ÑVPP]Q]ÑVPP]]ÑU˜PP]]ÑUÖÐ]]ÑU–Ð\Ñ]ÑUVÐ\‘]ÑUVÐ\QQTÖÐ[ÑQTÖÐ[”QT–ÐZ‘™ÑTPPYÑÑS˜TPVÐQRØYÐTÑÝÑQ˜]ÐSH‹›Ý\‹L‹MÈŽˆ™ÔQPP›ÑPTZPPTQRÙÐQP‘‘Î‘VÐ‘–Ð‘Û›Ð’Ð’ÚÐ’RÐ’[˜Ð’’P’–P’›•P’ÒP’ÖP’Û•P’Û”P“P“P“P–PSP‘LÒPSPM‘Û’PSÌ’PSP\Ð’ÑPST[Ð’[PSYÙÐ’–PSYÙÐ’›PS]ÖP’Õ’PQPSYÕP’ÌÐQÕÖPPVPSYÔP“ZÐUÔTP“YÐUÙÔP“ØÐUÝÒP“UVPVQP“LPVQP“LPVÐP“‘SPVÑP“‘SPVÐP‘ÚQÑRPVPPP‘šPPQšÑPVYÐP‘šQPQ•PPV]ÐP‘ÒPQ•PPVPP‘ZSPQ‘V™ÐP‘ZSPQ‘VÐP‘TÔPQ^VÐP‘TÔPQ^ŒXPPP‘PÕPQ^ŒXPPP‘UPQ^ÐXTQP‘ÕPQ^ÐXYÒPÞVPQZœÐX]ÕPšVPQZœÐXZXÐ‘UÐXØÐ‘UÐX^XÐ‘UÐXØÐ‘UÐX^XÐ™ÙÐ™^XÐ™^XÐ™ZXÐ™ZXÐ™TÙÐ™YÐ™YÐ™ÙÐ™ØÐ™TØÐ™ZYÐ™^YÐ™”ÙÐ™šYÐ™žZÐ™žZÐ™žZÐ™ž[Ð™šZÐ™ž[Ð™š\Ð™”ÜÐ™”ÜÐ™”ÝÐ™ÝÐ™Ì™^L™ZM™TÎ•RPPPÖ]ÐULÐTPZ“YÑ’ÚÑPR“P”Ò\ÐPQÓTPRÑPQP”ZÐPZÌPUXXPTPQÓÐQ‘ÔQÓÔQ‘ÐQ‘“ÐQ‘SÑ‘ÓÑ‘Ó”Q’SPQ““PQ“’ÝÑ”ÒÙÑ•ÔQ•’ÐQ^ÙÐZ’Ñ^VPY’™Ñ^VÐY”Q^VÐY”Q^ÐXÒQ^ÐXÒ]Ñ^ÐXÒYÑ]ÖÐXÒYÑ]ÖÐXÒYÑ]VÐXÒTQ]–ÐX’PQ]VÐXRPQ]ÐXRPQ\–ÐXRÑ\–ÐX’Q\VÐX’Q[ÖÐX’QYÔPPÔPPP–PY‘ÝÑZPZQÙÑYÖPZ‘ÙÑZUÝÐ[‘ÔQZÕÝÐ[ÑÔQZÕÝÐ\ÔQ[ÝÐ\QÔQ[UÝÐ\‘ÔQ[•ÝÐ\‘ÙÑ[UÝÐ\‘ÙÑ[VP\QÙÑ[P\ÝÑZÖÐ[’QZPPZÒPQYÐPTÒÔQTÙPR™ÐPˆ‹›Ý\‹LËLŽˆ‘YÐQ[ÑPPYÎÞPPP›ÛÐPQÔÐTPSÙÑYZÑPPQPPQÐTÓÑTPRšÐQPQ]ÕP’’TPPÒQPTÕÑPTPZ]Ñ[ZQPRSP’›ÔPPÔQTÕÑTPZÐYÑ[ÑPR]ÒP’MÐPÓPÐTÔÒTPZYÑZšÑPR]ÒP’MÐPÓQTÓÒTPZP™ÑYÚÑPRPZÐ’VPPÐT›QTPXÑÑVšQPQÚP‘PP™ÔTšQPTPVTQVU™ÐPÚQPQžP‘ŒUPP–TPP–TÐT™PXQTPVYÑVU™ÐQÙÝÑPQšP‘ŒPPLÐP›PPPP˜ÕTšPMVPZPÐTPV]ÑVT]ÐT•ÐRYÙÑPQžP‘ŒPQU™ÐPÒRPP˜ÕT›P–PP[PTPV]ÑV”ÐPTUÔPRYÔQPQžP‘ÕZÐQÖPPP™ÕT›P›PPTPV”QV”ÙÐV™ÐVQ”QXTÙÐV™™ÐV‘™ÑV”ÝÐV™™ÐV‘™ÑXTÝÐXY”PXQ™ÑXTTPRUPVY”PV‘™ÑXTÐ[”PV‘™ÑX”Ð[PX‘™ÑXTPPP”YÐZY”PV‘™ÑXTÐ[”PV‘ÑV”P[™PXQÐQVSÔP\ÙPV‘ÐQVSÐP]PV‘ÐQVSÐ]PV‘ÐQV“”P^PVQÐQV“”P^YPVQÔQV“”PLÝÐQ™]ÐVQÔQXS™ÐLÔPRY]ÐVQÙÑXSÝÐ]ØÐR™YÐVQÝÑXSÙÐNYTPV‘ÝÑX“Ð˜RQŒRQŒRQž’ÑžRQž’Qž’ÑžRÑžÑžÑÒÑÒÑ’ÑRÑRÑRPQPQœÒPQœÒTQœ’TQœRTQœTQœTQ›ÒYÑ›ÒYÑ›’]Ñ›]Ñ›Qš’”Qš”Qš”Qš”QšQšRQš’Qš’Qš’Qš’Qš’Qš’”Qš™Ñ™’Ñ™Ñ˜ÒÐQ˜RÔQ–RÙÑ–ÝÑ•ÒÝÑ•ÒÝÑ•’ÝÑ•“Q•Q”ÓQ”“Ñ”SÑ”Ñ“ÓPQ“SPQ“STQ’ÓTQ’“YÑ’YÑ’]Ñ‘“]Ñ‘“]Ñ‘S]Ñ‘S]Ñ‘“Q‘”Q“™ÑKÓ™ÑKÓÑNSÐQMÓÔQMSÙÑMÙÑLÓÙÑLÓÔQMSÔQMÐQM“ÐQMÓÑN™ÑJÓ™ÑJÓ”QS”QS”Q“QÓ]Ñ‘S]Ñ‘S]Ñ‘S]Ñ‘“YÑ’TQ’SPQ“Ñ““Ñ“ÓQ”SQ”SQ”ÓQ”ÒÝÑ•RÝÑ•RÙÑ•ÒÙÑ–ÔQ–RÐQ˜RÑ˜’Ñ˜Ò™Ñ™R™Ñ™R”Q™’QšQšR]Ñš’]Ñš’YÑ›RYÑ›RTQ›ÒPQœPQœPQLU™ÐLÑLUÐLÑLUÐPLQLUÔPLQLUÔPLQÝÑL•ÙÐLÙÑL•ÝÐLÔQL•ÝÐLQÔQLVPLÔQLVPLÐQLVPLÑL–Ð^‘ÑLVÐL™ÑLVÐ^‘”QL–PP^Q”QLVPP^‘QLVTP^QQLYÐ^QQ^V]Ð^Q^P^]Ñ^”P]ÑYÑ^V”P]ÑYÑ^™Ð]ÑTQ^V™Ð]ÑTQ^™Ð^TQ^Ð^PQ^VÐ^PQ^XPP]ÑÑ^XPP^Ñ^XTP]ÑÑ^XYÐ]ÑÑ^YÐ]ÑÑ^YÐ]‘Ñ]Ø]Ð]QÑ]Ø]Ð]‘Ñ]˜]Ð]QÑ]X”P\ÑPQ\Ø”P\‘PQ\ØP\ÑPQ\˜”P\‘PQ\˜”P\‘TQ\X™Ð\TQ\™Ð\YÑ[˜Ð[‘YÑ[˜ÐP[]Ñ[ÔPZ‘]ÑZØÔPZ‘YÑZØÙÐZQYÑZ˜ÝÐZQYÑZPZTQYYÐYQTQXY]ÐX‘PQV™ÐVQPQVÐQPQžP‘›ÑPP–TT™PTPVÑVÙÑPQÌ‘PP™ÓPTšQTPVPÝÑVYÝÑPQÔZÐ‘ÖSPP›ÒPTœQTPXÑX™ÝÑPRVP’SPPPT‘TPYYÑYÙÝÑPRPQP’VSPPÒPPTÒÑTPZÐPQZYÝÑPRPP’[ÔPPÓPPTÑÑTPZPPQYÚÑPRTPP’ÐPÑPPT“TPXÐTQVš”QPQÔSP‘–MPQÔPTPUP”QTšÔQPQOOH‹›Ý\‹LËLHŽˆ‘ÐRšÔQPPÔM‘ÑPPMÐPQÔPTPSÐÔQTÒÐRQPPœPPNTÑÑPTPRZÑPQ]ÕP’MPPÐQPTÔÐÐTPZ]Ñ[YÙÑPR]ÓP’›ÒPPÔPÐTØQTP[TQ[ZQPRRP’MPPÓPÐTÓÑTPZYÑZšQPR]ÓP’[ÖPPÑQTQRPŠÑTPYÐÐQYZQPRÜÐ‘ÍPPÓÐT›QPTPX‘ÑVU™ÐPÚQPQÔP‘Ñ•PP’TPP™ÔPTšPUÑTPVQTQV”PRÝÑPQžP‘ÑSPPZØÐP•–PP›ÒPP˜ÔTšÐPNVPYPÐTPVTQV”]ÐTÐRYÔQPQÐ‘P‘ÚÕPQYÐPÒQPP™ÔTœP‘–PP[PTPVYÑV”™ÐT•ÐPR™ÔQPQžP‘ÕXÐQÍPP™ÕT›PPPPTPVQQV”ÔPXYÐVQ”QVTÔPXY™ÐV‘”QV”ÙÐXY™ÐVQ”QV”ÝÐV™”PV‘”QXTTPQ™ÐP”ÝÐV™”PV‘”QXTÐ[YPV‘”QXTÐ[YPV‘”QX”P[™PV‘”QX”ÐQYÐZYPV‘”QX”Ð[]ÐX‘™ÑXTP[Ù]ÐXQ™ÑXSÙÐ\Y]ÐXQ™ÑXSÐP]]ÐXQÑV“™Ð]Y]ÐV‘ÑV“”P]Ù]ÐV‘ÑV“P^™]ÐVQÐQV“PLÔPQY]ÐVQÔQV“”PLÐR]ÐUÑÔQV“ÝÐ]˜”PR™YÐVQÙÑV”ÐLÙTPVQÙÑXSÐPJÙPPVQÝÑXSÐ–’QŒQŒQžRQžRQžRÑžQžRÑÒÑÒÑ’ÑRÑRÑÑÑœÒPQœ’PQœ’TQœPQœRTQœTQ›ÒTQ›ÒYÑ›RYÑ›R]ÑšÒQšR”Qš™Ñ™R™Ñ™’™Ñ™’™Ñ™’™Ñ™’™Ñ™’™Ñ™’™Ñ™’™Ñ™’™Ñ™’™Ñ™RÑ™ÐQ˜’ÔQ–’ÙÑ–ÝÑ•“Q•SQ•Q•Q•Q”ÓQ”“Ñ”Ñ”Ñ““Ñ““PQ“PQ“TQ’“YÑ’YÑ’]Ñ‘“]Ñ‘S]Ñ‘S]Ñ‘S]Ñ‘SQ‘”Q“™ÑKÓ™ÑKÓÑNSÐQM“ÙÑMÙÑL“ÙÑLÓÙÑLÓÙÑLÓÔQMSÔQMSÐQMÓÑNSÑNS™ÑKÓ”QS”Q“”Q“Q‘Q‘]Ñ‘“]Ñ‘“]Ñ‘“YÑ’PQ“Ñ““Ñ”Q”“Q”“Q”ÓQ•Q•ÝÑ•’ÙÑ•ÒÙÑ•ÒÔQ–RÐQ˜RÐQ˜RÑ˜Ò™Ñ™™Ñ™R”Q™Ò”QšQš’]ÑšÒ]Ñ›YÑ›’YÑ›RTQœTQœPQœRPQLUÐLÑLUÐPLÑLUÐPLRQLUÔPLRQLUÙÐLQÝÑL•ÙÐL‘ÙÑL•ÝÐLQÔQL–PLQÔQL–PLQÐQL–PLQÐQLVÐ^‘ÑLVÐ^‘ÑLVÐ^‘ÑLVÐL™ÑLVPP^Q™ÑLTP^Q”QLYÐ^”Q^–]Ð]Ñ”Q^V]Ð^Q^VP]Ñ]Ñ^V”P]‘]Ñ^”P^YÑ^–”P^TQ^–™Ð^TQ^–™Ð^QTQ^VÐ^PQ^˜PP^PQ^XPP^Ñ^˜TP]ÑÑ^YÐ]‘Ñ^YÐ]ÑÑ]Ø]Ð]‘Ñ]Ø]Ð]‘Ñ]Ø]Ð]‘Ñ]ØP]QÑ]˜P]QÑ]˜P]QPQ]XP]Ñ]XP]PQ]”P\ÑPQ]”P\‘TQ\˜™Ð\QTQ\XÐ[ÑTQ\XÐ[ÑTQ\XÐ[‘YÑ[ØÐP[Q]Ñ[XÔPZÑQZØÙÐZQ]ÑZ˜ÝÐZ]ÑZYPYÑ]ÑZÐY‘YÑYÙPPYYÑY]ÐX‘TQXY”PXQTQV™ÐVQTQVÐQPQžP‘PP–TPT™PTPVÑVÙÑPQÎ‘PPšÓÐT™QTPV‘QVQPQÔ\Ð‘ÖSPPœÒÐTœQTPXÐÔQX™ÝÑPRYÐ’SPPÐT‘TPZQYÙÝÑPRYÒP’[ÓPPÓPTÓÑTPZÐPQZÙÝÑPR”PP’MPPÔPPTÒÑTPZPQZÑPRTPP’RXÐPRÒÐTPYPPQYš”QPQÝÑP‘ÍPšÑT•ÔPTPUPÑTÚÙÑPQPOOH‹›Ý\‹LËLˆŽˆ‘PSÒTPQšÐQPQ]Ð‘TÐPPÒUPPXTTPTPÙÑY™ÝÑPRØÐ’MPPŽÐTÔÐÐTPZP™ÑZÙÙÑPR]ÕP’’RPPÓQPTÔÐÐTPZ]ÑZ™ÝÑPR”SP’LÐP[ÔPPÔQTÓ’PYPSÑPTPZÐQZÐR•ÐQQPRUP’UYÐPÛÐP’TPPÔRTŒRÐP]PUÑPTPZQX”]ÐQTÙÐSUÐQšQPRÎ‘ÑSPP•\ÐQ™ÐP–TPPÔPTšPYPLVPUÑPTPXQTQVPRPTÙÝÑPQÔ’P‘ŒPQÛÓPP™ÔÐT˜ÎPÓÐÐTPVQYÑVSÙÐ[ÙÑPQžP‘ž•PRÛÒPP˜ÕT˜ÌPPÝPTPV]ÑV”P\™ÔQPQžP‘ÑÐRÖQPP˜ÕTšÍPÚPTPV]ÑV“ÙÐ[YÔQPQžP‘ÕÐR–PPP˜ÕPT›ÎPÔ‹ÐP™ÕTšÎPPÓŠÐP™ÕT›ÎPPÓŠÐP˜ÕT›ÊÐPÒŽPP™ÕÐT›ÊÐPÒŽPP™ÕÐT›ÌÐPÜPšÕÐTœÌÐPÞPšÕÐT›ÍPÞPšÕÐT›ÍPPÞÐP›ÕÐT›ÌÐPÎMÐP›ÕÐTœÌQÐP›ÖT›ÞPQžPTÐPšÖPU‘PVÐPšÖU“œÐP\ÐP™ÖPU’œPMMÐP™ÖPUÒÐP™ÖVÖTœÌPQŒPVØPVØUœÐP›ØÐVYVYVYPVYPVYPVYPVYPVYPVYPUÎUÍUÍUÌUÌÐUÜÙÐUÝÚUÛÚUÚÚUÚÚUÚÚPUÙÚPUØÚPUØÚUÕZÐUÔZÐUÓ[UÑ[PUŽUPUPUŽPUPUPUŽPUPUPUPUPUUÛÐUœÜUšÜPU™ÜU–\ÐU”\ÐU”\ÐU“\ÐU“]U’]PU]UNPUNULULÐU\ÝÐU[ÞUZÞPUXÞPUV^UU^UTLUTLUTLUTLUSLPUQLUPLÐUUÍPUÍUÍUÍÐUMÐUMUÍUÍPUÍUÌÐUUUPUPUPLPUPLPUQLUR^UT^UT^UT^UU^PUXÞPUYÝÐU[ÝPUMU]U‘\ÐU’\ÐU’\ÐU“\U”\PU–\PU˜ÜU™ÜUšÛÐU›ÛUœÛUŒPUŒUÐZÐUÑZÐUÒZUÔZUÔZPUÖZUØÚUØÚUÙÙÐUÚÚUÚÙU–QYPU–QYPU–PQXÐUPQXUQXPUPQXPUQVUQVPUÐQVPUÐQVU™QVU™PQUÐUPQUÐU™QUÐU™QUU™ÐQUUšQUUšPQUPUšPQUPUšQUUšÐQTÐU›QTÐU›QTU›PQTPU›PQTPU›PQTU›PQTU›QSÐU›ÐQSÐU›ÐQSÐUœQSÐUœPQSÐUœPQSÐUœPÎÐUœPÎÐUœPÎTÎ\ÐPÍPTÍ\ÐPÍPTÌ\ÐPÍPTÌ\ÐPÌPTÌ\ÐPÌTÜPÜÔTÝPPÛÔÐTÛPPÛÔÐTÛPÙÔÐTÚÐPÖUTÖžPÔUTÕžPPÓUTÔžPÑTÐTÔŒPÑTÐTÒŒPPÐTÐTŽMPPŒÐTœÝPPQPœÔT›PœÔT™
ÐPšÔPT™PPTPVÑVYÔQPQÍ‘ÒQPP™ÓTšPÐTPVQQV™ÝÑPQÐ\Ð‘ÖSPPšÒÐT›QPTPVÔQXYÝÑPQÝÚÐ‘ÛÓPPÒTžQTPYP”QYYÝÑPRÔP’PPŽTÐÑTPZTQZZQPRYÐP’MPPÔPPTÓÑPTPZÐPQZZQPRPP’[ÕPPÓPPTÐÑÐTPZPPQYšTQPRÐP’LPœÐT›SÐTPVQUÔQPQVP‘R’PP‘OH‹›Ý\‹LËLÈŽˆ‘PRÒÐQQPQY[QPP]Ì’[ÛÐP[VTPRPÝÑZÚTQPPÍXÐPMÐTÕÒPTPYPÔQ[ZPQPRPYÐ’ŒRPPVXÐPÒRPTÙPPUÒTPZÑ[UPPRPQPRXÐ’•PPÑšÐPUÒPPMÐPÕRTÔ”P]PPTÒTPZÐÑZÔÔPQ•TPSVYÐQšYÑPR]ÙÐ’LÐPŒRPQÒPP–[ÐPÓRPTÓ’ÐPYÐPMZPPXRÐTPZÔQZTÝÐR]ÐSÖ]ÐQšYÑPR]Ì’PPZÚÐQÕÓPP›ÛÐPÒTTQUPšËÐPÜRÐTPY‘”QVSÝÐ]ÚTQPR•P‘ÑÐSVZÐPœÕÐT˜ÍÐQÒTPV‘™ÑVTP]ÚPQPQÔ–P‘ÑSÐP™ÕÐTšËÐPÍ’PTPVQ™ÑV”PP]PQPQÐ˜Ð‘ÕQPSXÐP™ÖT›PÌ’TPVQÑV”YÐ\ÚÑPQÐ˜Ð‘ÚÒPSXÐP˜ÖPT›PÝQÐTPVQÐQXTÐPÔP\ZQPQÔ™Ð‘ÚŒPšÕPRÖPPVPP[ÕPP™ÖPTœÎPQÐPUÑPTPV‘ÔQXTP^XÐPQ™ÝÑPQÔšÐ‘ÞœÐPZSÒSPPšÖTœÍPQÐTPXQÔQXÓÐPNYÙÑPQÚÐ‘Þ˜ÐTÑPP›ØPUPTPXQÙÑšÔQPQÚÐ–MPP›ØPUÒÐTPXQÝÑ™ÙÐQPQÞÐ–PP›ØUÔÐPTPXRQŽRQŠÒQŽRQŽQÒÑRÑÑŒÒPQŒ’TQŒTQŒTQŒTQž’TQž’TQž’TQž’YÑžYÑžYÑž]Ñ’]Ñ’]Ñ’]Ñ’QQœÒ”Qœ’”Qœ’”Qœ’”QœR™Ñœ™Ñ›Ò™Ñ›ÒÑ›RÐQ›ÐQšÒÔQšRÙÑ™ÒÔQšÔQšÔQšRÔQšRÔQšÔQšÔQšRÔQšRÙÑ™ÒÙÑ™ÒÙÑ™’ÝÑ™Q˜ÓQ˜SÑ–SÑ–Ñ•ÓPQ•“PQ•“PQ•STQ”ÓYÑ”“YÑ”S]Ñ”]Ñ“ÓQ“SQ“”Q’Ó™Ñ’S™Ñ’™Ñ’Ñ‘ÓÑ‘“Ñ‘“Ñ‘“Ñ‘“ÐQ‘ÔQ“ÙÑKÓÝÑJÔQNQM”QM”QMTQMTQM”QMÓÙÑNSÔQKÓÔQSÐQ“ÐQÓÐQ“Ñ‘Ñ‘™Ñ‘“™Ñ‘“™Ñ‘Ó”Q’S”Q’SQ’“]Ñ“YÑ“ÓTQ”PQ”ÓÑ•SÑ•“Ñ•“Q•ÓQ–Q–SQ–’ÝÑ˜’ÝÑ˜’ÝÑ˜ÒÙÑ™RÔQ™’ÐQšÐQšÑš’™Ñ›”Q›R”Q›’Qœ]ÑœR]Ñœ’YÑœÒYÑYÑTQRPQMÙÐL’ÑMUÝÐL’ÑMUÝÐMQMVPMQMVPMÝÑMVÐLÑÙÑMVÐLÑÔQM–PPL‘ÔQMVPPLÑÐQMVTPL‘ÐQMYÐLQÑMVYÐL‘ÑMVYÐL‘ÑM]ÐLQ™ÑMVPLÑLÖPL™ÑLÖ”PL™ÑL–™ÐL”QLVÐ^‘”QLPP^‘QLTP^Q]ÑLXYÐ^]ÑLYÐ^‘YÑLXYÐ^‘TQL˜YÐLPQL˜YÐLPQL˜YÐLQPQLX]ÐLÑL˜PLÑLX”P^‘ÑL™Ð^QÑ^˜™Ð^QÑ^XÐ^Ñ^XÐ^Ñ^XÐ^Ñ^XÐP]ÑÑ^ÐP]ÑPQ]ØÔP]‘PQ]ØÐP]‘TQ]XÔP]QTQ]XÔP]QTQ]ÔP]TQ]ÙÐ\ÑYÑ\˜ÙÐ\‘YÑ\˜ÝÐ\Q]Ñ\ÝÐ\Q[YP[‘Q[YP[Q[Ð[QZÙÐZÑ]ÑZ™PPZQ]ÑZYYÐZYÑYTPP™ÐYYÑXYÔQPQÞP‘ÖTPPšÔTšQTPVQTQVQPQÐP‘ÒVPP˜ÔTšRTPVÑVšÑPQÔL‘ÖYÐPšÓPTœRPTPXPÝÑXšPQPQÝÛÐ’YÐPÒTŒ’PTPYÐQYZPQPRØÐ’ÐPÐQÐTÐÒPTPYÐ]ÑZšPQPRYÑP’–ZÐPÓPPTØRTPZÐPQ[TQPRPP’’[ÐPÓPPTÓÒÐTPZPQZš]ÑPRYÐP’VLPÐPPTŒ”PTPYTQXZÔQPQÝÓP‘œPP˜ÑÐTQSÐP\UTPU‹›Ý\‹LËMŽˆ•ÐQÕÑR•ÐQRÖ™ÐQÐQSV™ÐQUÑP•ÔPSVÐQU™ÑQÙÐTÕ™ÑUÔÝÑRU™ÐVÔQ[”Q\Q\TQ\””Q\TÑ[ÔÐQ[ÔÔQ[”ÙÑ[TÝÑ[QZÕQZÕQZ•ÑZT]Ñ]TQ]”TQ^ÙÑ\T”Q]ÔTQLTQMÙÝÑPPZ›Ð”ÐPPVMUQŠÐP[ÌÐUSÐP’LÐU–MU”MÐUNPUL
ÐU[ÊÐUZÍÐULU“LÐU›ÌUŒUUœÞUœÌÐU•MUNU]ÊÐU[UXËÐU\ÍÐUNUNÐULPU[ËÐUZÐUTKÐUYÎPU\ÎUMU’MPU•MU–MU˜ÌÐUšÌU›ÌPUœÌPUÌPUŒUŒUUUŽUÐ^UÐ^UŽUŽUÐ^UÐ^UÑ^UÑ^UÒ^UÒ^UÓLUÓLUÓLUÓLPUÓLPUÓLUÒLÐUÑLÐUÒMUÑMUÒMPUÒMUÒMUQŽPPŽÐUPŠÐPŽÐUPŠÐPŽUQŠÐPŽÐUPŽPPÑMÐUPŽPPÑNUNPPÑJÐUJÐPÐKÐUÐPŽÐUPPTPYTÑMYÔQPRUPPSPPœÎPUQPTPVTQMšÑPQšœÐ”XÐP”MU’ÐTPTSÔQZQPQÐ”VNPXÍURÔTPPšÙÑPPUÐ”Z˜Ð”ÕÐ”ÕP•P•QP•^”P•š“P•ÕP–NPQ]ÐUÒ]UÖ]UÙÝPUÜÝUÌÐUÎV\PV\PV\VÜVÛÐVÛVVPVVQP’”QÐTÔP™ÝÑZPVUP’PQÒPTŽšPQYPV[Ð’QÓTÐšQXVL‘ÙÑÓÐTšÐšÑVPVP‘ÑKÖ]Ð‘‘ÑNV™ÐÑ™ÑNÐ‘”QNTPKÑ”QN”PMÑ”QM˜ÔPLÑQM™PL]ÑM™Ð^Q]ÑMYTP]‘YÑMYÐ]QTQMYYÐ]QPQMYYÐ]QÑMYYÐ]QÑM]Ð]ÑM]Ð]ÑMP\ÑQM”P\‘QM”P\‘QLÙ”P\‘QL™”P\‘QL™”P\‘QL”P\‘Q^™”P\QQ^”P\QQ]Ù”P\Q]Ù”P\Q]™”P[ÑQ]™™Ð[‘Q]™Ð[‘Q]Ð[Q\ÙÐQPR]Í’ÍPPÑSÐTÜPÐTPY‘Ñ\YÝÑPRM’ÖTPP›ÓÐTÛQÐTPVQQ\ÑPQÌ’›ÙÐP–STÕÒPTPUÑQZÚTQPQ”]Ð’[ÚÐP•SPTÐÒTPUÐÝÑYšTQPQÛÐ’ÚÐP™ÒÐTRTPVÔQXZPQPQÝÙÐ‘ÛØÐPŒT›RTPYÑVšÑPRTVP‘ÛØÐPÑQTRTPZPQXšÑPRSP’YÐPÔPÐTŒ’PTP[PTQYZPQPR™ÐP’ÚÐPÕPPT’ÐTPZÐPQYZQPRYÐP’PPÐPT•PTPVPQY[ÑPQ”PP’ÐPMTžYTPRYÑXP”QUÈ‹›Ý\‹LËMHŽˆ”PRÕ”PPÔQSU”PQ”QSUYÐP•”PQT™ÑSÕ™ÐQTÑTÐQTÑU”QPÔÐPUT]ÑQ”ÔPUT]ÑQÔÙÐUQXSÙÑZÓÙÑ[™Ñ\]Ñ]TQ]“PQ]ÓPQ]ÓTQ]“]Ñ]”Q\“ÐQ[ÓÔQ[ÓÙÑ\ÝÑ\ÐQ]XÝÐQSÑ]ØÔPRÑ^ÐRSQLX”PRYÐRSTQMXPTÓÑ”Ñ“ÓQ“ÓQ“SQQTP’SQP“Ð’“Q’ÒÙÑ”™PP’ÔQ–ÐQ–’™Ñ˜’”Q˜ÒQ˜’Q–’Q–ÐQ”“Q“SPQ“TQ“Ñ““Q”ÝÑ“ÒÝÑ“RÝÑ”QQPP“ÓÑ”“Q•RÝÑ•šQPPTÜÐ–ÛÐ–ÌPT[ÐUÐÓPTPQÒÑšZ]ÑPPÐÖP–MÐP[ÛUÔÒÐTPR’”Q’Q’Q›PQPP^TP˜VPPVZVÕTPR]Ñ›QPPÔÓP™ZSP™ZSP™ZSP™TÓP™PÓP™TP™ÔP™ÕP˜ÔÕP˜ÐÖP˜ÐØÐ˜ÐÖP˜ÐØÐ˜žXÐ˜šYÐ˜”ÙÐ˜^ZÐ˜ZZÐ˜Z[Ð˜PÛÐ˜PÜÐ–ž]Ð–”Ì”–PQÞN”’ÐQ”Î”LÝÐQZP”[ŽQP”[ÒPPYÝÐUR]ÐUQ]ÐUQ^UPUUÌUÌPUÌUÌUÌUÞUÞPUPUPUUP^UQ]ÐUR]ÐUYÝÐUZÝU]ÝPUMU‘\ÐU”\U–\U™ÜPUœÜPUŒUÐ[ÐUÒ[UÕ[PUÙÛUÜÛUÝÚÐUÍVZPVZVZVYÐVÙVÙPVÙVÐVVPP‘ÙÑÐÐTšÐšQVPVUP‘ÑÑÐT•PšTQUPV[Ð‘]ÑUP’ÑYÑKÕÔP‘‘YÑJÖPÑTQJÖÐQTQNVPPKÑPQNYÐNQPQMÖ]ÐNPQMV”PMÑPQLØTPLÑÑLØPLÑM™Ð^QÑLØÐP]ÑQLØÔP]‘QL˜ÝÐ]QQLXÙÐ]ÝÑLXÝÐ]PÝÑLXÙÐ]ÙÑLXÝÐ]PÔQL˜ÝÐ]ÔQLYP]ÔQLYÐ\ÐÔQLÐ\ÐÔQ^™Ð\ÐÔQ^YÐ\ÐÔQ]ÙÐ\ÔQ]™Ð\ÐÙÑ]YÐ\ÙÑ]Ð\ÙÑ]Ð\ÙÑ\ÙÐ\ÝÑ\™Ð[ÐÝÑ\YPP[‘Q[ÙPP[QQ[YTP[Q[YYÐZ‘Q[Y]ÐZQ[PYÝÑ[™ÐXÐÝÑZÙÐXÝÑZYÔQPQÔ\Ð’ÒPP™ÒÐTÐTPVPÔQXYÝÑPQÚÐ‘ÖSPP˜ÒPT›QTPVÐQVYÝÑPQÐXÐ‘ÒSPP›ÒTšQTPX™ÑVYÝÑPRUP‘ÖSPPT›QTPYÐQXYÙÑPRYÔP‘ÛÓPPÓQTQTP[YÑXÙÝÑPRÑP’SPPØÐPT‘TP[ÐPQYZQPRÐP’ÕPPÖPPT‘ÐTP[PQYZÑPRPP’ÛÐPQÓPTPYPQYÝÑPQÑP‘ÍUPP”PTœVPTPP›YÑPPVÐP\ÑPT˜ZPTPP™ÑU‹›Ý\‹LËMˆŽˆ–PR”QRÖ”QSV™ÑS–ÑSÙ]ÐP–ÑTYÐQÑPØPPTYÐQVÑQPPTY]ÐQVÑQ˜TPTYPQVÑQØTPT™PQVPQQØTPTÙ”PQVYÑQ˜TPTÙ”PQ•QR–]ÐQ˜YÐVU]ÑS–PQ˜YÐVUQV”PYTÝÑMÐQMÔÑNÐQNÙÑM•QMÑL•ÑLUPQLYÑ^U]Ñ^Q]Õ”Q]•”Q]•QPÕPPQ•™Ð]”ÔQN”QPPšÖP”ÐPZUQÒÐTPRÔQ‘TQPQZÓP•ÑTP•ŒP••SP••RP•‘PP••••••Ð•ÞœÐ–QÐ–UÐ–QPP–SP•ŒP•ZÚÐ•ÛÐ”ÌÐ•TP•ÓP•QSP•USP•UYÐU[ÐTÕ]Ð”šÝÐ”‘[Ð”‘YÐ”ÕVP•UP•P•ZÒP•“PPSU•ÝÐTPQ”PQ–ÑPPŒP•PYËÐUš]TPRYÑPP‘–ÌP[MPTPQÔÑ™\”QPPØ™ÐPXÊÐUŠÝTPRÑPPÑ–ÐP[LTPR”Q™Ü]ÑPQ‘–RPQÜTPUTQšœ]ÑPQ“QPPRTPP”Q›œYÑPQ“PPPUNPUÛ\PTPXÔQœœTQPRšPQNPVYÐ”QÒUšÑNPVUP”QÑPUšÑNPVZÐ”QÒUšTQJÐVYÐ”ÑÒPUšÑKÐVSP”ÑÐPUPP™•PP™‘QP™‘RP™LP™•QP™•QP•\ÐPQØÐTPP›ÙÑPRRP•VPPšÐU\SÐTPPœTQPPÜ˜ÐPYUPPTPP™ÙÑPP“ÐPV‘PUMPTPQ”QM”™ÑM™ÑLÔ™ÑLÔ”QLÔ]ÑMTYÑMTYÑMTTQMÔPQNPQNTÑKÔÑTQ‘Q’TQ“ÝÑ““ÝÑ”SÔQ•“ÐQ–SÑ˜Ó™Ñ™“”QšSQ›Q›“]ÑœSYÑTQ“PQž“ÑŒSÑŒÓQSQÒÝÑŽRÔQÐPTÙÐ™ÙÑ[PVUP’QÒTÓPšTQZPV\Ð’PQÓTšÑYVP‘ÝÑÔÐT›ÐšÝÑVV”P‘ÐQÕT˜Ð›ÑUÐUYÐQLÐUU›QVUÐUTœPQSUUTœÐQRUURPQPUURžQÔÐUQŒPQŒQÔUQQTPUQPQŽQTUQŽPQTUP‹ÐPÎÐUPÐÐTP\ÑQKÙÔQPSL”PPÝÓPU
ÐÐTP]QJÙÙÑPS]Ð”TPPÜÓPUQPTP\‘QMÚQPRÙÝÐ“ÛÔPPÜÓPUQTP\QQLÚQPRÙÌ“’UPPÚÓUÑTP\Q^ZQPRÐL“VUPPÙÓTÊÑTP[‘Q]ZÑPR™Ì“ÖPPÕSÐTÞRTPZ‘Q\ÚPQPRTL’ÍÐPŽTÜRÐTPYQ\šQPQÙÝÐ’ÛÌPšÓTÛSÐTPVPÝÑ[šÑPQÛÐ’’PP–RTÒÔPTPVÐQX’PPšÐQPQÙÐ‘Ò‘PP˜ÒTšTPTPXPÑVZÐQPQÝÖP‘ÒPPÑÐTšTTPYP”QVZÑPRPTP‘ÖNPÒÞPTPPQVšÑPR™ÓP‘ÛÎPÖPÐTTPTP[PYÑXšÐQPRÑP’PPØÐTžTTP[PPQYZÝÑPRPP’PPÓPPT™TPVPQY[ÙÑPQ]ÐP’UPPNPTœPTPPœQPP”PP’ÑP’SP‘ÙÕP‘ÏOH‹›Ý\‹LËMÈŽˆ˜ÔPQXÔQRÙÑRTQP˜ÙÐR˜PQQXÙÐRØTQQ˜ÙÐRÙÔQPP[[Ð–PPÍPPT™TUœPUžP^PPTPQU™ÑUPQ˜ÝÐS™ÔQPP‘•P‘›]ÐP›“PQ[P’PQÒPPT–PTÍVTÍXPTÌXTÌXÐTÞTÝTÝPTÜTÛTÛÐTÚTV™ÐPÚTMZPÙPUPUUPUUTQ“QTQ’Q”PTPQT™Ñš™ÑPPŒP”MÐP[PUUÓTPTT”QQTÙÐKÚYÑPQU]Ð••]Ð•]Ð”ÌÐ•XÐ•ÔP•QSP•LP•Ñ––PP–RP•ÕVP•‘ZÐ•Ð”Ì”Œ”’ÜÐPT“PUY\PTPQÝQPP•[Ð”ÜZÐPZ^TPRÐQ“\PQPPØ’PPZPU^[ÐTPTÔÐQPÔÝÐ’\PQPQ\œÐPU“UTÛTPXUÑ\ÑPQÚÎ”–PPÐURÛPTPX•Q’QPR\Ð”ÜTPPŒRÐU’ÚPTPY”ÔQ•ÛÔQPRÙÐ™Ð™QVP™P™P™P™ÔP™ÓP™ÓP™ÒP™P™ÑP™QRP™ZÑP™•QP™šÑP™ŒP™ÐQPVPP”PQÐPUPP™ÐQPVPP”PQÐPUPP™ŒP™ŒP™šÐP™•PP˜ÓPPZPUÌPPUÖPUÓU˜XPTPRTTQ’ZYÑPPV]ÐPRÔTPP”TQ‘TQKÔTQNTPQJÔPQJÔPQNTPQNTPQNTQMÔTQM”YÑMTYÑMTYÑMTQMTQLÔPQLÔÑMÑLÔÑMÑMTQMÔQKÔQÔQ‘ÝÑ‘™ÔQPPUÐ”ÛÕPPQMUMU’MUšÌÐUœÌUÐLPUÔLUØÌUÚÞUÜÞUÌPUÎV]ÐV]V]PVÝPVÝVÜVÜPVPVVPP’”QÑTÔPšÑZVXÐ’YÑÒPTÐPš]ÑYPVL’QÓÐTœÐšÐQXPV‘P‘ÐQÕT˜Ð›QUÐV•P‘™Ñ‘P””Q–PPQ]Ð‘Q˜™ÐJÑ]Ñ˜ÐPNYÑXÝÐP™PLÑTQYPPLPQYPP™™Ð]‘ÑY™Ð]‘ÑY™Ð]‘ÑKÙ™Ð]‘ÑJÙÐ]QQJÙÐQPSL”QPPÝÓPUPTP\ÑQMÙÔQPS]Ð“ÖQPPÝÓPUPTP\ÑQLYÔQPS\Ð“›ÑPPÜÓUÐTP\ÝÑLÙÑPRÔ\Ð“MPPÚÓPUÐÐTP[ÑQ]ÙÙÑPRÐL“ÓPPÖSTÌ‘TP[QQ]QPR]Ð’ÍPPÒSTÝQÐTPYÐÝÑ\ZPQPR[Ð’ÛÚÐPÒTÜSTPVÙÑ[š”QPQÐYÐ’ÒMP˜ÒTÙSTPVP™Ñ[Z™ÑPQÕP’’MP˜ÑTŠÓÐTPV”QXZ™ÑPQÙÔP‘ÖMPœÑPT›SÐTPY]ÑVš”QPRPRP‘ÛÌPÒPÐT›STP[TQXš”QPRÐQP‘ÍPÚÐTSTP\PPQXÚ”QPRÙÐP’LPÛÐPTžSÐTP\PQXÚÑPRÐPP’‘PPÖPPTžUTPZÐPQXÛ™ÑPQÐP’ÒPP’PPTZTPQPQPPÙÒP‘ÐUP‘OOH‹™[™[ZY\ËLLŽˆ”PQTQQ“ÝÑRÝÑR“ÝÑR“ÝÑSÝÑS•PPÓÝÑT]ÐQÓÝÑU]ÐRSÝÑV]ÐR“ÝÑZ–YÐP“ÝÑZÖTPQÝÑ[TPQSÝÑ[TPQ“ÝÑ\ÓÝÑ]Q\ÔQ]Q]SÝÑ]“ÙÑ]ÓTQPÓÔP^“PQQSÔPLPQQSÔPLÐP“PQQ“ÔPMÑRÔPMSÑR“ÔPMSPQÓPQÓPQ‘Ñ‘SÑ‘SPQ‘SPQ‘SPQ‘“PQ‘“PQ‘“PQ‘ÓTQ‘“TQ‘“TQ‘“TQ‘“YÑ‘SPQP“YÐ‘SÑQ]Ð‘Ñ’Ñ’Ñ’SÑ’SPQ’PQ’TQ‘“TQ‘“YÑ‘S]Ñ‘QÓQÓ”Q“™ÑS]Ñ‘YÑ‘SYÑ‘S]Ñ‘Q“”QS™ÑKÓ™ÑKÓÑNSÑ‘“Q‘ÒÑ“™Ñ“R”Q“’Q“Ò]Ñ”]Ñ”]Ñ“Ò]Ñ“ÒQ“RQ“R”Q“R”Q“’™Ñ“’Ñ“’ÐQ“RÙÑ’“Q‘ÓQ‘SÑÓÑSPQJÓPQNSÑNSÑNÑMÓÑMÓÑNQNSQNQNSQJÒÝÑKÒÝÑKÒÙÑQÑR’ÝÐJÑQSRÙÐKÐÙÑTÒÙÐKÐÐQUÒÔPPÑV’ÔP™ÑXÒÔP”QYRÔPQYÒÔPQZÔP]ÑZ’ÔPYÑ[ÐPÐTQ[RÐPÐTQœPQœPQœÐPQœÐPQPQPQPQU‘™Ð–PQUQÔP•PPQUÙÐ•PQUÝÐ”ÐPQUP”PQUP”PPQUÐ“ÐPQUÐ“PQUPP“PPQTÒTP“TQTRYÐ“TQT”P’PYÑS’™Ð’P]ÑSÐP‘Ð”QRSPPKÐÐQPÙÐPÓYÐNSPQY•PPYÓÑY•TPY“ÑY•YÐYSQY•]ÐYÝÑZPXÒÙÑZ”PX’ÔQZ”PX’ÐQZ™ÐX’ÑZ™ÐX’ÑYÕ™ÐX’™ÑYÕÐXÒ”QYÕÐYQZÐY]ÑZÐY]ÑYÕÐYYÑZÐYYÑYÕÐPXÒTQY•ÐPXÒTQYUÐPXÒTQYUÐPYPQY•ÐPYPQYUÔPXÒÑYUÔPXÒÑYÔPXÒÑYÙÐX’QYÙÐX’QXÕÙÐXÒQXÕÝÐX’QX•ÝÐXÑÝÑX–PYÙÑX–PY‘ÙÑX–PY‘ÔQXÖPZÔQXÖPZQÐQYUÝÐZÑÐQYUÝÐ[ÐQY•ÝÐ[QÐQY•ÝÐ[QÐQY•ÝÐ[QÐQY•ÝÐ[QÐQY•ÝÐ[QÔQYVP[ÙÑYPZÒQXVÐZRQVVPPYˆ‹™[™[ZY\ËLLHŽˆ”]ÐQ]ÑQTYÑRYÑRT]ÑRTYÑRÔYÑSTYÑSÔYÑTVPPÔYÑT•ÝÐQTYÑUÝÐQ”YÑU–PQÔYÑVVPRYÑV–PRXYÐPÔYÑZØTPQTYÑ[TPQ”QPÔ]Ð[TPQÔQQ]Ð[XYÐQÔQQ]Ð]QQT]Ð]TQQ”]Ð]”QL”QL”QLÓQP”PLÓ]ÑQPMS]ÑQTPM]ÑQ”PMSYÑRPMSYÑRPM“YÑR”PMÓYÑRÔPMÓYÑ‘ÓYÑ’YÑ’SYÑ’SYÑ’SYÑ’SYÑ’“]Ñ’SQ’Q’Q’SQ’S”Q’”Q’Q’S]Ñ’“]Ñ’“]Ñ’“]Ñ’“]Ñ’“Q’S”Q’”Q‘Ó™Ñ‘“™Ñ‘“Ñ‘SÐQ‘ÔQÓÙÑ“ÑQÝÐS™Ñ‘“™Ñ‘“™Ñ‘SÑ‘ÐQÓÐQÓÐQ“TQP“]Ð‘ÓÑ’ÓQ“RÝÑ“’ÙÑ“ÒÐQ”ÐQ”ÐQ”RÐQ”RÐQ”RÔQ“ÒÔQ“ÒÙÑ“’ÝÑ“SQ“SQ“SÑ“SPQ“PQ“TQ’ÓYÑ’SYÑ’TQ‘ÓPQ’Ñ‘ÓÑ‘ÓQ‘ÓQ‘“Q‘RÝÑ‘’ÙÑ‘ÒÙÑ‘ÒÔQ‘ÒÔQ‘ÒÔQ’ÔQ‘ÒÔQ’ÔQ’ÐQ’’Ñ’ÒÑ’’Ñ“Ñ“Ñ“’Ñ“’Ñ“ÑÑP’Ð“ÑÑSRÐ”QTÐ”PÙÑURÐ”ÐÐQV™Ð•ÐÑXR™Ð–™ÑX’™Ð–P”QYR”P˜PQŽQŽ]ÑŽPYÑŠÐYÑ‹ÐTQÐPTQP™ÐQPVPPPQÐPTPP™ÐQPPVPVPT–VPQÖPPT”VQÔPPT“XQÑPPT“XÐQŽPT“YQÐPT“YPQ›ÐPT“YQ–PPT“ZQ’PT’ZPQ[QNT’[PQ[QLÐTNPQ\PÙPPÐQTMPPÓ•PŽPTLPPÒ•ÐPŽT\ÝPÓ–PÐTYÜÐPÓ–PÒTT\PPÔ˜PPÜTÕ˜PÛÐTÕ˜ÐPœÛTÕ™P›ÛPTÕ™P›ÛPTÔ™PœÛTÔ™PÚÐTÓ™PPœÚTÓ™PœÚPTÓ™PœÚTÓ™PœÙÐTÓ™PÙÐTÑ™PÙÐTÐ™PŒTÐ™PŒTŽYPŒPTÐ™ÐPŒPTŽYÐPŒTŽYÐPPTŒZPÐTZPPŒÐTŒZPPŒTžPPTžÐPPTPÑVTPPÒVPTPÓVTÐPÓVTÐPÔUÐTŒ[ÐPÕUÐTŒ[ÐPÕUÐT[ÐPÕUÐTŽ[ÐPÕUÐTÐ›ÐPÕUÐTÑ›ÐPÕUÐTÒ›ÐPÕVTÑ›ÐPÔVPTÐœPÒVTŽ\PÐXTŒ\PPŒT›P–ZT–OH‹™[™[ZY\ËLLˆŽˆ”PQT”QQQQ”QQÔQRT]ÑRÔ]ÑST]ÑSÔ]ÑT–PPÔ]ÑTÖPPÔ]ÑUVPQT]ÑUUÐPP–PR]ÑVPRT]ÑZT]ÑZ˜]ÐP”QZXYÐQÙÑP”TPP”PZ˜YÐQSÔQQPPQPZØYÐQSÔQQPP[ØYÐQ“ÔQQTPP\YÐQÓÐQQÔPP]ÓÐQQÔÐ^ÐQMSÐQMSÔQMS”QPÓÔPM“”QQÔPMS”QNSQÓQ‘Q‘Q‘SQ‘SQ‘“Q‘“”Q‘S”Q‘S”Q‘“”Q‘“”Q‘“”Q‘“”Q‘“”Q‘“™Ñ‘S™Ñ‘ÓÑ‘“Ñ‘“”Q’Q’SQ’SQ’SQ’S”Q’™Ñ‘Ó™Ñ‘Ó™Ñ‘ÓÑ‘“Ñ‘SÐQÓÐQÓÔQ“Ñ‘™Ñ‘S™Ñ‘SÑ‘Ñ‘ÐQÓÔQ“ÔQ“ÔQ“YÑ’SÑ“Q“’ÙÑ”ÔQ”RÔQ”ÔQ”ÔQ”ÔQ”ÔQ”ÙÑ“’ÝÑ“SQ’ÓQ’ÓÑ’ÓÑ’ÓPQ’ÓPQ’“TQ’“TQ’SPQ’“Ñ“Q’ÓQ’ÒÝÑ’’ÙÑ’RÔQ’RÔQ’ÐQ’ÐQ‘ÒÐQ‘’Ñ’ÐQ‘ÒÑ’Ñ’™Ñ’R™Ñ’R™Ñ’’”Q’Ò”Q“”Q“RQ“ÒQ”Q”QQRÒPVTPLÑQSPVPMPÙÑTÒ”PUÔPNÐQUÒPVPJÐÑVRP–™ÑXRP–P”QYP–Q]ÑŽ]ÑŽYÑŽPTQŠÐTQ‹ÐTQ‹ÐPQÐPTPP™ÐP™™ÐP™™ÐP‘–PVÐP‘^ÐVPP‘^ÐVYÐP‘ZÐVPPP‘ZÐVÐP‘ZÐVPP‘ZUÙÐP‘ZUÐPP‘ZUPPP‘TÑPPTÓPUQP‘SPPTÕPTÙÒP‘VPTÙÓP‘PRPPRPTPÞNRQ‘PRÕPÐÝÐR[PRØÐTZÐP^\ÐR[PRÛÐ’[PRÚÐ’[PRÙÐ’[ÐQÞXÐ’LXÐRÖP’LYÐQÞUP’LYÐRÕP’LYÐRÔP’LYÐRÔP’[ÐRÓP’[ÐRÒP’UšÐRRP’UšÐRQP’Q›ÐRÑP’\ÐRÐP’\ÐRÐP’ÐRŽ’ÐRŽ’ÐR’ŒRŒ’ŒRŒ’RÐ’ŽRTœÐ’ŽRœÐ’ÐPR›Ð’ÑPRšÐ’ÒPRšÐ’ÒPRžÐ‘Ì“PRšÐ‘Ì”PR”™Ð‘Ì”PR”™Ð’ÔPR”˜Ð’ÔPR”–P’”PR”˜Ð’”PR–P’UÕPRZÐ’UÕPRT–P’[UPRP˜Ð’UÕPRÐ’QÕPRšÐ’•PQÚÐ’˜ÐQZ‘Ì™ÐPÞTÐPQÏOH‹™[™[ZY\ËLLÈŽˆ”PQ”QQÔQRQRTQR”QSQSTQS”QTÐP”QT–ÐQQTÖÐQ”QUUÔPP–PRTQZTQZ”QP”PZÔQQP[]ÐPÔQQTP[YÐQSÝÑQ”P[X]ÐQTQQÔ”P\TQRP]QLTQLSÑP”PL“™ÑQPL“™ÑQPLÓ”QQ”PL“”QQ”PL“”QQÔPLÙÐP“”QRPMÓ”QRÐMÓ”QRTÐMÓ”Q‘“”Q‘“”Q‘“”Q‘Ó”Q‘Ó”Q’”Q’”Q’™Ñ‘ÓÑ‘“Ñ‘ÓÑ‘ÓÑ‘ÓÑ‘ÓÐQ‘Ó™ÑP“ÐP‘“”QQÔP‘S”QQÔP‘S”QQSÙÐ‘”QQ“ÝÐÓ”Q’S™Ñ’™Ñ’Ñ’Ñ‘ÓÐQ‘“ÔQ‘ÙÑÓÝÑ“ÝÑTQKÓÔQP”PJÓÐQ‘ÐQ‘ÔQÓÙÑ“ÝÑTQKÔQJÔÑNÑNÝÑJÓQ‘STQ’Ñ’“Q“RÝÑ“RÙÑ“’ÔQ“ÒÐQ”ÐQ“ÒÐQ“’ÐQ“’ÔQ“RÙÑ“RÝÑ“Q“Q’ÓÑ’SPQ‘ÓTQ‘SYÑÓQKÓ™ÑNÑMÓÑM“ÐQMÑMÐQLÓÑMÑMÑMÑMÑM™ÑM”QMS”QMS”QM”QM”QM”QLÓ”QLÓ”QM™ÑLÓ™ÑLÑÑS™ÐMQTÐLÐÙÑUSÐLÐÔQUÓÐLÐÑV“ÐPL™ÑX“ÐPL”QYSÐPLÐQYÓÐMP]ÑZS™ÐMYÑZÓ”PMÐYÑ[PNTQ[ÓTPKÐTQTQPQÐPQÐPQÐPQÐPQU‘™Ð˜PPQUQÐP–PPQUQÙÐ•ÐPQUÝÐ•ÐPQUP•PQUP•PQUÐ•PPQUPP•TQTÒYÐ”ÐPQTÒ”P]UPYÐTQTÒ™Ð\Õ”PYÐYÑTRÔP[ÕÐYPYÑTPZ•ÐPYP]ÑS’ÝÐ[ÔPYQSÙÐ[ÙÐXÐ™ÑRRÔP[ÝÐXÔQP‘PP’ÐP[PXRÑ[VPXR™Ñ[VÐXR™ÑZÖÐXR”QZ–ÐXÒQZ–ÐX’]ÑZÖÐXÒYÑZ–ÐYTQZÖÐXÒTQZ–ÐYTQZPPYPQZPPYPQYÖPPYRÑZPPYRÑYÖTPYÑYÖTPYRQYÖYÐYQYÖYÐYRQY–]ÐYÝÑY–PXÑÙÑYV”PXÑÔQY™ÐYQÔQYÐYÑÐQXÖÐZQÑXØPPZ‘™ÑXØTPZ‘™ÑYTPZÑ”QYXTP[QY˜TP[QY˜TP[QYØTP[QZTP[QZTP[”QZTP[™ÑYØTPZÑÑY˜YÐZQÐQYX]ÐYTQPPT›Ð‘ÌÐQÏOH‹™[™[ZY\ËLMŽˆ“PPQSPQQÓPQRPQRSPQRÓPQRÔÝÐQPQSTÙÐQÓPQTÝÐQ“TQT”ÝÐRSTQUTÝÐR“TQUÔÝÐSTQVPSYÑVUPSSYÑ[’ÙÑPÓYÐ[ÒÔQQSYÐ\PPP’ÔQQS]Ð\PPQÔQQ“]Ð\VÐQ’ÔQR]Ð\–ÐQ’ÔQR“]Ð\–ÐRÔQJÒÔQJÒÔQKÒÔQKÒÔQRÔQ˜]ÐP’ÔQ‘RÔQ‘RÙÑ‘ÙÑ‘RQP’ÙÐ‘’]ÑQÙÐ‘’]ÑQRÝÐ‘’]ÑQRÝÐ‘’]ÑQÒÝÐ‘Ò]Ñ“Ò]Ñ”]Ñ”]Ñ”Q“Ò]Ñ”Q“ÒQ””Q“Ò”Q”™Ñ“Ò™Ñ“Ò™Ñ“Ò™Ñ“ÒÑ“’QPÒÐ“’]ÑQRÐP“R]Ñ”’Q”RQ”R”Q“Ò™Ñ“’™Ñ“’Ñ“Ñ“Ñ“ÐQ’ÒÐQ’Ò”Q“’]Ñ”TQ”’PQ”ÒÑ•RQ•’Q•‘ÝÑ•ÑÙÑ–ÔQ–ÐQ–QÐQ–QÑ–‘™Ñ™‘”QšÑQ›‘QœQ]ÑœÑYÑ‘YÑ‘YÑ‘YÑ‘TQÑTQÑTQÑTQQTQTQœ‘TQœQTQœTQ›ÑTQ›‘YÑ›YÑ›]Ñ›]Ñ›Q]Ñ›QQ›Q”Q›™ÑšÑÑšÑÔQšQÙÑP’ÐTS]Ð’“Q’“Q’“”Q’“”Q’“”Q’Ó”Q’Ó™Ñ’‘QS™Ð’ÐÝÑT™Ð’ÐÙÑTÓÐ’ÔQU“Ð\VYÐYPÐQVÐ\YÐYPÑXS”P\–YÐYP™ÑXÓP\ÖTPY”QYS]Ð\ÖPPYÐQZTP”]ÑZÓÐ”YÑŠÐTQ‹ÐTQ‹ÐPQ‹ÐPQ‹ÐPQŠÐPQŠÐPQŽPQŽPQÐPQUQÐšPQUQÙÐ™ÐPQUP™PQUP˜PPQUÐ•ÐPQUPPP’YÐ“ÐPQTÒYÐ“ÐTQT’™Ð’ÐPQTÒÐP’TQT’Ð’ÐYÑT”P“PYÑSÒ]ÐZÕÐZ]ÑSRYÐ[ÐZP”QR’PP[UTPYÐÑQÒÐ[YÐY’Ñ[PYQ[U™ÐX’Q[U™ÐX‘ÝÑ[™ÐX‘ÝÑZÕ™ÐX‘ÔQZÕ™ÐX‘ÐQZÕÐXQÐQZ•ÐXQÑZ•ÐXQ™ÑZ•ÐXQ™ÑZ•ÐXQ”QZ•ÐXQQZ•ÐV‘]ÑZ•ÐV‘]ÑZ•™ÐXQYÑZ•™ÐXQTQZ•ÐVQTQZUÐVQPQZUÐVQÑZUÐVQÑZUÐV‘QZÐXQQYÕ™ÐXÐÝÑZ”PYÝÑY•”PYÐÙÑYÕ”PZÙÑY•”PZPÔQYÕ”PZÐQYÕP[ÐQYÕP[PÑYÕP[™ÑZP[ÐÑYÕ]Ð\ÑYÕ]Ð[ÐÑYÕ]Ð[ÐÑY•P[ÑYU”P[ÐQX•™Ð[‹™[™[ZY\ËLMHŽˆ”ÐQÑQTÑQ”ÑRÑRTÑR”ÑSÑS•ÐPQÑTÐQÔÑTÕÐRÑUÐRTÑU•ÐPRTÑVÐPRÔÑVUÐPSÑ[™ÐPÔÑ\TÑ\”PQ\”Ñ]Ñ]TÑ]“QPÔÐ]ÓQQP^XÙÐPÓQQTP^˜ÔPQS]ÑQ”P^˜ÔPQSYÑRPMYÑR”PMSYÑRÔPMSYÑRÔPM“YÑ‘“YÑ‘ÓYÑ‘Ó]Ñ‘Ó]Ñ‘Ó]Ñ‘Ó]Ñ‘Ó]Ñ’]Ñ’Q’Q’Q‘ÓQ’Q’S]ÑP“”P’YÑ’ÓYÑ’“YÑ’“YÑ’“YÑ’“YÑ’“]Ñ’S]Ñ’SQ’Q’Q’Q‘ÓQ‘ÓQ‘ÓQ‘Ó”Q‘“]Ñ’ÙÑ”RÐQ”Ò™Ñ•R”Q•’Q•ÒQ•ÒQ–Q•ÒQ•Ò”Q•R”Q•R™Ñ•Ñ”Û™ÑPPÞXÐ•\ÐP[U›QÐTP[RYÑÓPTÐPšÑYPV‘P’QÕTÐ›QXV–P‘ÙÑÖTšÐ›PQVPVšÐ‘ÑØPT˜Ð›YÑUÐVœÐ‘”QØÐT•P›QUVÐ‘QÙT”P›”QUPVŒ‘QÙT”P›”QUPVÐ‘QØT•P›TQUV˜Ð‘™ÑŽÑPPÚP•–PPÔ˜Ð•^Ð‘š”PS”šÐ‘‘PS”šÐ‘^”PS›Ð‘UPSZÐ‘•PSTÚ•PSPÑP‘PS•P“–P“MTPPÑPS]ÐTMQPS\Ð‘UPSÛÐ‘‘PSÙÐ‘ÑPSPXÐ‘ÞMSTUP’[ÐS”TP•ÙÓP–SP–SP–ÒP–TQP–]ÑP–QP–™ÐP˜PPP˜TPP˜]ÐP˜PP‘™ÐU”PP‘^ÐUPP‘^ÐU]ÐP‘^U]ÐP‘^PPUTPP‘^RPUÐP‘^VPTÝÐP‘ZTPUÐP‘ZRPUPQP‘TÑPRŒR”QP‘PÐPRŒR]ÒP‘RŒPPR]ÓP‘ŒRÑ‘PRYÔPÞÐRÑ“PRPVPžÐRÑ”PRÐ’Ñ–PR›Ð’›ÐRšÐ’•˜ÐR™Ð’•˜ÐR˜Ð’‘˜ÐR–P’‘™ÐR–P’LYÐR•P’‘™ÐR•P’LYÐR”P’LYÐQÞP’LYÐQÞP’LYÐQÞP’‘™ÐQÞP’‘šÐQÚP’LZÐQÙÎ’LYÐQÙÍ’LYÐQÝÍ’UšÐQÙÌ’UšÐQÙÜÐ’UšÐQÝÛÐ’UšÐRZÐ’UšÐRZÐ’QšÐRÙÐ’Q™ÐRTYÐ’YÐRYØÐ’Q™ÐR]ÖP’Q™ÐRVP’Q™ÐR”UP’U™ÐR™ÕP’U™ÐRÕP’U™ÐRÕP’Q™ÐRÕP’Q˜ÐRÐUP’YÐRÖP’šÐR™ØÐ‘Ì\ÐRYÏOH‹™[™[ZY\ËLMˆŽˆ“ÐPQSÔQQSÔQQ“ÔQRÐQR“ÐQSÐQSPP“ÐQS”™ÐP•PPÓÐQTU]ÐQ“ÐQTÕ]ÐRÐQV•]ÐRSÐQZÓÐQ[SÐQ[“ÐQ[–PP“ÔQ[–]ÐQÔQ[Ö]ÐQ“ÔQ]Ó™ÑPÓÔP]Ó™Ñ^“QP“™ÐLQQ”PLSQQS”PL“QQ“”PLSQQ“”PLÓQQÓ”PLØ”PQSQR”PLØ”PQ“QRS”PNSQ’Q’Q’SQ’SQ’“Q’“Q’“Q’“Q’“Q’“Q’“Q’“Q’ÓQ’ÓÑ’“Ñ’ÓÑ’“Ñ’“QPÓPP’“Q““Q““Q““Q““Q“SQ“SÑ“Ñ“Ñ’ÓÑ’ÓPQ’STQ’YÑ‘Ó]Ñ‘“Q‘SQ‘SYÑ‘ÓTQ’PQ’SÑ’“Ñ’ÓÑ’ÓÑ’ÓÑ’ÓÑ’ÓÑ’“Ñ’YÑR“Ð’ÑSÓÐ’Q–’Q–‘ÝÑ˜QÙÑ˜ÑÔQ™QPPšÐ–PNPU™TPT‘ÑœZYÑPQRÐP“UÐVÒTP[‘™ÑØT–P›QUVŒ‘”QÙPT•P›ÑUVŽ‘”QÙT•P›ÑUVŽ‘”QÙT•P›ÑUÐV‘™ÑÙPT˜Ð›”QVPVÐ‘ÐQØÐTšÐ›]ÑXPV›Ð‘ÝÑÖPT›Q\VVP“QŽQ›]ÑPPXSPP[ÌUŽPUYÌPULPUTTQUPULPQSÐT]ÌQST’LQRÐT”LÐQRPT™ÌQRPTšÌQQÐTÌPÍTŽPPÍPTÑ^PÎPTÓ^PPÎTÖ]QPÐUŽUÑPUÓPUÕPPUØÐPUÚÐPUÛÐPUÜÐPT•VPQ”PPT”VQ”PPT“XQ”PPT“XÐQ”PPT“YPQ”PPT“YQ”PPT“YÐQ”PPT“ZPPQZÐQ‘PPT’[PQPT‘\PQLÐTNQMÐTMÐQQT]ÛPPÕ“PPQ“ÐPÛÑPT[ÛPÓ”PÚÑÐTUZPÔ”PØÚPTÕ•PÕZTÕ•PPÔYÐTÕ•ÐPÒYTÕ–PPÐYPTÕ–PŽTÔ˜PPŽTÓ˜ÐPŒÐTÓ˜ÐPŒTÓ˜ÐPŒPTÓ˜ÐPŒPTÒ˜ÐPŒTÓ˜ÐPŒTÑ˜ÐPŒPTÒ˜ÐPŒPTÑ˜ÐPŒTÒ˜ÐPŒÐTÒ˜ÐPŒTÒ™PÕPTÓ™PP›ÕTÓ™PP›ÕTÒ™PPœÔÐTÑ™PPœÔÐTÐ™PPÔPTÐ™PÔTÐ™PPŽÐTŽYPÐSTŽYPPÒSPTÐ™PPÓSPTŽYPPÔSTÐ™PPÕSTŽYPØÒÐTÐ™PÙÒÐTÐ™PÚÒÐTÐ™PÛÒÐTÐ™PÛÒÐTÐ™PÛÒÐTŽYPÛÒÐTŽYPPÚÓTŒYPÙÓPTœPÕOH‹™[™[ZY\ËLMÈŽˆ“ÐQSÑQ“ÑQÓÑRÑRSÑRÓÑSSÑS“ÑTPPÓÑT•]ÐQ“ÑUYÐRÑU•YÐRSÐQUÕÐSSÐQZÓÐQ[ÔQ[SÔQ[“ÐQ\™ÑP“ÔP\”QQÔP\S”Q]“”Q]Ó”Q]Ó”Q^ÝÑPÓ”P^ÝÑPÓP^’ÝÑQSPLÙÑQÓPLYÐQÙÑRPM’ÙÑRSPM’ÙÑR“PM’ÙÑ‘RÙÑ‘’ÙÑ‘’ÙÑ‘’ÙÑ‘’ÙÑ‘ÒÙÑ‘ÒÙÑ’ÝÑ‘ÒÝÑ‘ÒÝÑ‘ÒÝÑ‘ÒÙÑ’RÔQ’’ÔQ’’ÔQ’’ÔQ’’ÔQ’’ÔQ’ÒÔQ’ÒÔQ’ÒÙÑ’’ÙÑ’’ÙÑ’’ÙÑ’RÝÑ’ÝÑ’Q‘“Q‘SQ‘ÑÒÝÑ‘’ÝÑ‘’ÙÑ‘ÒÝÑ‘’ÝÑ‘“Q‘SQ‘Q‘Q“RTQ”Ñ”’Ñ”ÒQ”ÒQ•Q•Q•Q•Q–RQ˜’Ñ™Ñ™’Ñ™’PQ™’TQ™’YÑ™R]Ñ™]Ñ™TQ™RPQ™Ñ˜’Ñ˜’Ñ–’Q–’Q–’Q–ÝÑ•ÑÝÑ•QÙÑ•ÑÔQ–QÔQ˜‘ÔQ˜ÑÐQ™QÐQ™‘ÐQ™ÑÐQšÐQšQÐQš‘ÐQš‘ÐQš‘ÔQš‘ÔQš‘ÙÑšQÝÑšÝÑšQ™ÑÑQÒP™ÑQRÒP™‘QTP™ÔQURÐ™ÐQžÑV’TP–™ÑX’YÐ–QYR”P•]ÑŒYÑ™TPUYÑ™–YÐUTQš]ÐTPTQšV”PSPPQ›ÐRPQ›XYÐPPQ›PQœPQœPPQUÑÐ•PPQUÐP•PPQTÑÔP•PPQTÑÝÐ”ÐPQTÒP”ÐPQT’Ð”PPQT’PP“ÐPQT’P’ÐPQT’”P’ÐPQT’]ÐZTÝÐZÐTQTRTPZ•PZPTQTPPZ•ÐZYÑSÒÐZ•ÐZ]ÑSRÐZÕTPYPQRÒPZÕ]ÐYÐQQ’PZÕPXÑÝÑZÕ™ÐX‘ÙÑZÕ™ÐX‘ÔQZÕ™ÐXÑÔQZ•ÐX‘ÐQZ•ÐXÑÑZ•ÐPXQ™ÑZ•ÐPXQ™ÑZ•ÐPX‘™ÑZUÐPX‘”QZUÐPX‘”QZÐPX‘”QYÕÔPX‘QZÔPX‘QYÕÔPX‘]ÑYÕÙÐXQYÑYÕÙÐXQYÑY•ÙÐX‘TQY•ÝÐXQPQY•ÝÐX‘ÑY•ÝÐX‘ÑYUÝÐYÑYUÝÐY‘QYUÝÐYÑQYUÝÐZQYUÝÐZPÝÑY•ÝÐZÐÝÑY•ÙÐ[ÝÑY•ÙÐ[PÙÑYÕÝÐ[PÙÑYÕÙÐ[ÙÑYÕÙÐ[ÙÑYÕÙÐ[ÙÑYÕÙÐ[ÙÑY•ÝÐ[PÙÑY–P[QXÖÐZH‹™[™[ZY\ËLKLŽˆ–ÐSÖ”QUYÑVVTQX–PQYVÑZQZ–QZÖQ[ÝÑ[•ÝÑ[•ÝÑ[ÕÙÑ\UÙÑ\UÙÑ\•ÔQ\ÕÔQ\ÕÔQ\ÕÐQ]ÐQ]UÑ]•ÑMTÝÑNYÑ‘“Q˜R™ÑP’ÔP™RQšÒPQœRÑÒQÙÑŽÔQÐPT™Ð™ÙÑVVVP‘™ÑÒT•PšQUPVM‘”QÓÐT•Pš™ÑUVM‘”QÓÐT–Pš”QUÐV]Ð‘ÑÓT™ÐšTQVVXÐ‘ÙÑÑTœÐ™ÝÑXPVSP‘ÔQÑTšÐ™ÙÑVPVSP‘ÑÑPT–PšQUVVP‘QÒT”PšÑUVYÐ‘]ÑÒPT’PšTQTV[Ð‘TQÒÐT‘PšYÑTPV\Ð‘PQÓTNš™ÑSÐVM‘QÔT]ÐšÔQSV“PÝÑÕT[Ð›QRV•PÔQÕTYÐ›ÑRPV–PÐQÕÐTXÐ›PQRVšÐ™ÑØTVP›]ÑQVŒ”QÙPTTP›ÐQQPXPPQÚTSP““PXÝÓP’Þ“PXÝÓP’Ú”PTÍPPÖPÐTÛÌQ\PÐTP[]Ñ\”P’YÙÑPR”SP’Ú•PTPPÖPÐTÜÌQXPÐTP[YÑ\S”P‘ÙÝÑPR™ÒP’Ú•PT–SPPÖPÐTÛÌPQUÑPTP[YÑ\S”P‘šQPR”RP’ÕPT–TPPÖPÐTÙÌQXQTP[TQ\YÐ’ZQPR”QP’ÑPTÖVPPÔPPTÙÝÐQ\RTPZPQ[“Ð“ÑPR]ÐP’žNTÛÙÐPÒPPTÖ]PQ^RTPZTQZÓÐ“ZTQPRTQP’^LUÚÐPÑPTÓ\ÐQJÒTPZTQZ“P”ZTQPRTPP’ÜÐUVZÐPÑPPTÔ\Q‘ÒTPZPQZÒÙÐ”ÚTQPRTPP’ÛÐUMÐPÑPPTÕ\Q”ÒTPZPQ[ÐP•šTQPRTPP’”ÙÐU›ÛÐPÐPPTÖ[ÐQ˜RÐTPYÐPQ[Ð–]ÑPRÐP’”ØÐUÐPŽPTÕ[QšSPTPYPPQ[™Ð–šQPRÐP’ÖPUÖLPÐTÓ[QœSTPXÐTQZR”P˜š™ÑPQÙÒP’PÔPVNP™ÑTÐQžTTPUQXÒP˜ÚÙÑPQ]ÕP‘ÚTPV•PPNÐT™ÚQŒ–TPSÐQU’]Ð™TQPPÝÐ‘PÓPV‘PÚSPVÓP–ÓP–ÓP–ÓP–ÓP–ÔP•ÞTP•ÚUP•ÔÖP•ÐÙÐ•”ÛÐ•ZYÐ•ÖP•”ÕP•”ÓP•šQP•ž•Ô•Þ–Ð–œÐ–Ð–P›Ð–PšÐ–TšÐ–T˜Ð––P“ÌRPRÔ–P“ÛPRÔ–P“Õ’PRÚP“Õ’PRÚP“Õ’PRÚP“Õ’PS’P“Õ’PRÞP“ŒRPS‘P“•’PS‘P“LRPSP“LSPSM“‘“PSL“‘“PS]Ð“LSPS]Ð“LSPS\Ð“LSPS[Ð“‘”PS[Ð“LUPRÝÙÐ“‘•PSXÐ“LVPRÝÖP“LXÐRÝÕP“LYÐRÝÕP“YÐRÝÔP“ZÐRÝÓP“ZÐSSP“ÐRÝÒP“ÐSRP“›ÐSPRP“œÐSPRP“œÐSYÒP“œÐSSP“œÐS”SP“œÐSÐTP“œÐSÔUP“œÐSÙÖP“œÐSÝÙÐ’Ì]ÐSÝÛÐ’ÛÐT]Ð’ÕÐT]Ð’ÛÐTM’ÕÐTP’Œ]ÐT‘P’›ÐT“P’‘ÐT”P’L]ÐT–P’UÐSÞÐTšÐRŒSÐ›Ð‘ÌNSœÐ‘ÕÐPSPOOH‹™[™[ZY\ËLKLHŽˆ˜PSX]ÑTXTQU™ÑVVQXÖ]ÑYVYÑYÖTQZVPQZÖÑ[VÑ[–Ñ[ÖQ\VQ\VQ\–Q\ÖQ\ÖQ]ÝÑ]UÝÑ]UÝÑ]UPQR•ÙÐ]ÓPQ˜SQ™RÑš’]Ñ›’TQœÑœÒQQÝÑŒÙÑÝÑPPZÐ™žÐ™ÝÑVVTP‘™ÑÒT–PšTQUÐV]Ð‘™ÑÓT–Pš™ÑVVM‘ÐQÓTšÐšQVV]Ð‘ÙÑÓTœÐšTQXÐVXÐ’QÑÐTÐšQXVUP‘ÙÑÑTšÐšQVPVUP‘ÑÑT–PšÑUVVP‘”QÒT”PšPQUVYÐ‘]ÑÒPT’PšTQTÐV[Ð‘TQÓT‘Pš]ÑTPV]Ð‘PQÓPTNš™ÑSÐVN‘QÔPT]ÐšÙÑSV“PÙÑÕPT[Ð›QRV–PÔQÕÐTYÐ›ÑRPV˜ÐÐQÖTYÐ›ÑRV›Ð™ÑØÐTVP›”QQÐVŒ”QÙTUP›ÐQQPXRPQÚPTTP“PXÙÓP’Þ•PXÝÓP’Þ–PXÝÓP’Ú˜ÐXÙÓP’Ú˜ÐTÒQPPÚÑTÛÌÐQYQTP[]Ñ\SÐ‘ÙÝÑPRÓP’Ú˜ÐT›ÓPPÙÐÐTÛÌÐQUÑTP[ÐYÑ\SÐ‘ZQPRÒP’Ú˜ÐT’TPPØÐÐTÚÌÐQTÑPTP[YÑ\™Ð‘šQPR™ÒP’ÑPT›ÕPPØÐTÙÌQYQÐTP[PPQ[Ó]Ð’ZÑPR™ÐP’ÑPTÖXÐPÕPPTØÞQ\RPTPZÐPQ[SPP“PQPRPP’•PTÛÚÐPÓPPTÕ]Q]RÐTPZPPQZÓÐ“YÑPRYÐP’ÍU\ÐPÑPTÓ]PQL“TPZPQZ“P“ÚQPRPPP’ÌUÐPÐPPTÔ\ÐQÓPTPYÐPQZÒÝÐ”šQPRPPP’”ÜÐUV]ÐPÐPPTÕ\PQ’ÓPTPYÐPQ[ÔP•Z”QPRÐP’”ÚÐU’LPŽPTÕ\Q”ÓÐTPYPPQ[ÔP•Z™ÑPRÐP’”ÙÐU–NPŒPTÕ[ÐQ˜TPTPXÐPQZÒÐP•ÚÐQPRQP’ZXÐUœPPœÐTÑ[Q™TTPXPYÑY’Ð–ÙÑPQÐSP’VPUÒ“PP–QTœÛPQ›UPTPUPÑV’™Ð–›ÑPQTXÐ‘ÐÖPUÖšÐP]ÒTQSP“[PQ›XPTPR‘ÑT”P˜QYÑR’”P˜R”Q˜R”Q˜R”Q˜R”Q–’”Q–’”Q–’™Ñ–RÑ–ÐQ•’ÔQ•SQ”Ñ“ÓQ”ÙÑ”RÔQ”RÐQ”R™Ñ•”Q•RQ•’]Ñ•ÒYÑ–YÑ–RTQ–’PQ˜’Ñ˜ÒÑ™Q™’Q™’Q™ÒQL•]Ð\ÙÑLÕ]Ð\QÔQLÕ]Ð\‘ÐQLÕ]Ð\‘ÑLÕ]Ð\‘™ÑL•]Ð\Ñ”QLUP\‘QLUP\Ñ]ÑLUP\‘YÑLUP\ÑTQLU”P\ÑPQLUP]ÑLU”P\ÑÑL•”P]QL•”P]QLU™Ð\ÐÝÑLU™Ð\ÐÝÑ^•Ð\ÐÙÑ^•ÐP\ÔQ^UÔP\ÔQ^ÔP\ÐÔQ]•ÙÐ\ÐÔQ]ÙÐ]ÔQ\ÕÝÐ]PÙÑ\UÝÐ^ÙÑ\P^PÝÑ[ÖPLÝÑ[ÖPLQQ[–PLÑQ[VPMQ[VPMQÑ[PM‘Ñ[ÐM‘TQZÖÐMÑ]ÑZ–ÐNQZ–ÐN”QZ–ÐN™ÑZVÐNQÑZVÐNÐQZÐNÔQYÖÐMÑÙÑY–ÐM‘ÝÑYVÐLÒQYPP^’QX–TP^ÑVVYÐ]]ÑTÖ]Ð\H‹™[™[ZY\ËLKLˆŽˆ˜PTØ]ÑUXTQVXPQXVÑXÖ™ÑYV”QYÖQZV]ÑZÖYÑ[VTQ[ÖPQ\PQ\VPQ\VPQ\–Ñ\ÖÑ]VÑ]VÑ]VÑ]VÑ]VÑ]UYÑMÓ]ÑS™Ð’QšÐQ›”Q›ÒTQÑžQQŠÑÝÑÐT›ÐšQVPVYÐ‘ÑÓT˜Ðš”QVVM‘ÑÔT˜ÐšÐQVVP‘ÑÔT˜ÐšÔQVPVP‘ÔQÓÐT›ÐšQXV[Ð‘ÝÑÒÐTÐšPQXVYÐ‘ÙÑÒPTšÐšPQVPVYÐ‘ÑÒT–PšYÑUÐVZÐ‘”QÒÐT”Pš]ÑUV]Ð‘YÑÓT’Pš”QTVM‘TQÓÐTPšÑTPVN‘ÑÔTMšÙÑSÐV“P‘QÕPT]Ð›QSPV–PÝÑÖPT[Ð›TQRV›ÐÔQØPTYÐ›]ÑRPVœÐÐQØTXÐ›”QRVŒ™ÑÙPTVP›ÑQÐXPP”QÚPTUP›ÙÑQPXTPQÛTTPœÑQPTÌPRQPTÛÌRQTÛÌRQTÛÌÐQ\QTP[]Ñ\SÐP’ZÑPR™ÓP’ÕÐTÒVPPÖPÐTÜÍPQYRTP[P]Ñ\ÔP‘ÚÑPR™ÒP’Ú™ÐTÐPÖPÐTÛÍQXRPTP[PYÑ\SÐP‘šPQPR™ÑP’Ú™ÐT–YÐPÖPTÚÍQTÒTP[TQ[ÓÐ‘šTQPR”QP’ÑPT›ÚÐPÕPPTÙÌPQYRÐTP[PQ[“P’ZYÑPR”PP’š“PTÖ\ÐPÔPPTÖ^PQ\STPZÐPQ[TP“QPR]ÐP’‘PTÍPÒPPTÔ^Q]STPZPPQZÓPP“š™ÑPRTPP’‘PUMPÑPPTÔ]QM“ÐTPZPQZÓÐ“Ú™ÑPRTPP’”ÍURMPÑPPTÕ]PQÓÐTPZPQ[SÐ”Z™ÑPRTPP’šLUVMPÑPPTÖ]Q‘ÓÐTPZPQ[SP•ÑPRPPP’š]ÐUMPÐPPTÖ\Q•ÔPTPYPQ[ÝÐ•šÐQPRÑP’^[ÐUœPPTÓ\PQ˜TÐTPYYÑZÔP–ÝÑPRSP’ZÐUTPP›ÑPTŒQ™UPTPV”QXÒÐP–[QPQÖP‘ÚXÐUÜPP•RT™ÛQœVTPUÔQU’Ð˜[TQPQP]Ð‘TØÐUÜÐP]ÓTMQœYTPRQ]ÑP‘™ÐQRÐ˜RÑ˜RÑ˜RÑ˜RÑ˜RÑUTP‘’ÑUP‘RÐQTTP‘RÔQS”P‘RÙÑSP‘SQRSÝÐ‘“ÝÑ‘SÝÑ‘ÝÑ‘ÔQ‘“Ñ‘ÓQ’“YÑ“PQ““Ñ“ÓÑ”Q”SQ”SQ”SQ”’ÝÑ•ÙÑ•RÔQ•’ÐQ•ÒÑ–Ñ–R™Ñ–’”Q˜RQ˜’]Ñ™YÑ™’TQ™ÒÑLU™Ð\’ÑL™Ð\’QL™Ð\’Q^•™Ð\’Q^•™Ð\ÑÝÑ^•™Ð\ÑÙÑL™Ð\ÑÔQL™Ð\ÑÐQLUÐ\‘ÑLUÐ\Ñ™ÑLUÐP\‘QL•ÔP\Q]ÑLUÔP\‘YÑ^•ÙÐ\QTQ^•ÝÐ\QTQ^ÝÐ\QTQ]ÖP\QTQ]–P\‘TQ]VP\QTQ]P\ÑTQ\ÖP]QYÑ\–Ð]Ñ]Ñ\Ð^QQ[ÖÐL”Q[–ÐLQ™Ñ[VÐM™Ñ[VÐMQÑ[ÐM‘ÐQ[ÐMÑÙÑZÖÐNÝÑZ–ÐNRQZVÐNRQZ–ÐJÒÑZVÐJÒÑZÐNRÑYÖÐNRPQY–ÐNTQYVÐM’]ÑXÖPPMQX–TPLR”QV–YÐ^RÑUÖ]Ð]‹™[™[ZY\ËLKLÈŽˆ˜PPT–™ÑUV]ÑV–YÑXÖTQYVPQYÖÑZVÑZÖQ[VQ[ÖQ[ÕÝÑ\UÝÑ\UÙÑ\•ÙÑ\ÕÙÑ]ÔQ]UÔQ]UÔQ]UÐQ]•ÐQ]ÕÑM”ÝÑJÔQ‘“Ñ˜’™ÑPÒÔP™ÒYÑP’P›Ñœ’QÑÝÑÙÑŽÔQÐPT˜Ð™ÝÑUÐVVP‘”QÒPT”Pš]ÑUPVL‘QÓT”Pš™ÑUPVM‘QÓÐT•Pš”QUÐV\Ð‘ÑÒÐT™ÐšPQVVVP‘ÔQÑT›Ð™ÝÑVVSP‘ÐQÑPT˜ÐšQUÐVTP‘”QÑT”PšÑUPVVP‘]ÑÒPT’PšPQTV[Ð‘TQÒTPš]ÑTPV\Ð‘PQÓTNšQTV]Ð‘ÑÓÐTLšÐQSPV’PÝÑÕT[Ð›QRV–PÔQÕÐTYÐ›ÑRPV˜ÐÑÖPTXÐ›TQRVšÐ™ÑØPTVP›]ÑQVŒ”QÙPTTP›ÐQQPXPP]ÑÚPTSP›ÙÑQXSP]ÑÚTRP“‘PYÒP’Þ’PUQPPØÐÐTÜÞQ]PÐTP[YÑ\S]Ð’ÙÝÑPR™ÒP’Þ”PTÒSPPÖPÐTÛÌQYQTP[PTQ\“”P‘ÙÝÑPR™ÑP’Þ•PT–TPPÖPTÜÌPQUÑTP[TQ\“”P‘ZQPR”QP’Ú•PTMPPÖPTÛÌQTÑTP[PTQ\]Ð‘šÑPR”QP’ÑPTPPÕPTÙÞQZQÐTP[PQ[ÓPP’šÑPRPP’žNTÛÙÐPÓPPTØÝQ\RTPZPPQ[SÐ“TQPRYÐP’”ÌU[ÐPÑPPTÕ]Q^RÐTPZTQZ“P“šYÑPRTQP’^]ÐU[ÐPÑPTÓ\QM’ÐTPZPQZÒÙÐ”YÑPRTPP’ÚÐUR[ÐPÑPPTÕ\QÒÐTPZPQ[ÔP”Z]ÑPRPPP’šYÐUV\ÐPÐPPTÖ[ÐQ‘ÓTPYÐPQ[RÐ”ÚQPRÐP’šXÐU[ÌPPTÖ[Q’ÓTPYPPQZ™ÑPRPP’”ÖPUMPœÐPTÔ[Q•ÔTPXPTQZÐQPQÐQP’ZTPUœPP˜ÐÐTÐZÐQ™UTPUP]ÑYRP–QPQTTP’ÔPUUPPNTœÚÐQ™VPTPS™ÑV’P–TQPPÙÐ‘šSPUÐ\Ð‘ZSPUÐNÚÐPTÓPUÐÓP•ÐÓP•ÐÓP•ÐÓP•ÐÓP•ÐÓP•ÐÔP•žTP•žUP•šXÐ•ÝÐ•\Ð•PÚÐ•ZXÐ•ÖP•”ÔP•žRP•ÔÑP•ÚPP•Þ––Œ–Ð–Ð–Ð–P›Ð–ZÐ“Õ“PRÔ™Ð“Õ“PRÔ˜Ð“Õ“PRÔ–P“Õ“PRÔ–P“Ñ“PRÚP“Ñ“PRÞP“Ñ“PRÞP“Ñ”PRÚP“›PRÚP“›PRÚP“‘”PRÝÎ“•”PRÝÍ“•”PRÝÌ“•”PRÝÌ“‘”PRÝÝÐ“LTPRÝÝÐ“LUPRÙÜÐ“LUPRÙÚÐ“‘•PRÙÙÐ“‘–PRÙØÐ“‘˜ÐRÔVP“LXÐRÔUP“LYÐRÔTP“[ÐRÙÔP“UšÐRÔSP“UšÐRÔSP“[ÐRÐSP“ÐRÝÓP“›ÐSSP“›ÐSPSP“›ÐSTTP“œÐSTTP“œÐS]ÕP’Ì\ÐS”VP’ÛÐSØÐ’ÛÐSÐYÐ’ÛÐSÔ[Ð’Õ›ÐSÙÝÐ’Ñ›ÐSÝÌ’Œ[ÐTM’Œ[ÐTN’›ÐTP’•›ÐT’P’L[ÐT“P’[ÐSÞP’U›ÐSÚP’QœÐSÐ˜Ð’ÐSšÐ‘ÕŒSTœÐ‘•SÏOH‹™[™[ZY\ËLKMŽˆ˜PPTÑUV”QVVQX–]ÑYYÑY–TQZPQZ–Ñ[Ñ[–Ñ[–Q\Q\Q\–Q\–Q\•ÝÑ\ÕÝÑ\ÕÝÑ]ÙÑ]UÙÑ]UÙÑ]UÙÑ]UÔQ]ÓÑP“TPT•YÐLÓQP“ÐVTÔPRÙÑ™’ÑšR”QšÒQ›]Ñ›YÑ›YÑ›ÑœQ‘ÙÑŒÑÑŠÑ”QÑT”PšÑTÐV\Ð‘TQÓÐTPšÔQSÐV”P‘QÕÐT]Ð›PQSPV™ÐÝÑÖT[Ð›YÑRÐV›ÐÔQØTYÐ›]ÑRPV›ÐÑØPTVP›TQQÐV™Ð™ÑÖPTVP›ÑQV˜Ð”QÕÐTUP›ÑQV–P”QÖTUP›ÑQV˜Ð”QÖTUP›™ÑQÐXPP™ÑÚPTXÐ›ÝÑRXTPÐQÚÐTYÐœQRXUPÙÑÛT\ÐœQSPXTP‘QÚÐTMœQTPXRP‘YÑÙÐT”P‘VPZQ[ÐV[Ð“ÑÑUP™ÙÑ^VQP“TQÐUP™ÐQ^PVPP“]ÑŠÓQŽSQŽSQŽSQŽQÓQÓQ“QSQS]Ñ’™™Ð]S]Ñ’YÐ\ÓYÑ’YÐQPRÚ‘P”ÒQPPÙÝÐU[PÐTP[SÑ’ÙÝÑPR^M”ÍPPÒ]U^QTPY’ÝÑ“ÚÑPRÛÐ•ÐPœÜU‘ÒÐTPUÒÐQ”ÚQPQTØÐ•’“PPYÛPU˜ÛUšÛUšÚÐUœÚÐUÚUŽUÐZPUÑZPUÒZUÔYÐUÖYÐUÙÙÐUÚÙUÜÙUÜÙPUÌUÎUÎVXÐVXÐVXÐVXÐVXÐVXÐVYVYPVYVZTQZQÎPVZVZPVZPVZU•QPZU•PQÐU•QU•ÐQPU–PQØÐU–QØU˜PQØPU›PÍU›PPÌPU›ÐPÜÖUœPPÚÕÐUœPPÙÕÐUœPØÕUœPPÙÕPUœPPÙÕPUœPPÙÕUœPÚÔÐUœPÚÔÐUœPÚÔU›ÐPÛÔU›PÜÔPU›PÜÔPTÎ[PÜÔPTÎ[PÜÔTÎ[PÜÔTÍ[PÜÓÐTÎ[PÜÓÐTÎ[PÛÓÐTÍ[PÚÓTÍ[PÚÓPTÍ[PÚÓPTÍ[PÙÓPTÍ[PÙÓTÍ[PÙÓTÌ[PÙÓTÞPØÒÐTÞPØÒÐTÝÐPÖRTÝÐPÖRPTÞÐPÕRPTÝÐPÖRTÞÐPØÑÐTÞPÛÑÐTÝPÝÑTÝPÎTÜQQPTÜQQPTÜPQQTÝPQPÐTÝQPÐTÝQÐTÞQÐPTÌ[QÐPTÌ[QÐPTÌ[QÐPTÌ[QÐPTÌ[QÐPTÌ[QÐPTÞQÐPTÞPQÐPTÝQPPTÛÐQPTÙQPÐTÕžPÔQTÒP”OH‹™[™[ZY\ËLKMHŽˆ™PPTYÑUQVYQV™QX˜ÝÑYÔQZÐQZ˜ÑZØ™Ñ[X”Q[Ø”Q[Ø”Q\Q\XQ\˜Q\˜]Ñ\Ø]Ñ\ÔÑS]Ð]”QT˜YÐ]T]ÑU˜YÐ]TÑYXYÐ]SÝÑZ˜YÐ]SQ›TQ›ÓPQœSÑœÓQÝÑRÙÑ’ÔQžÐQŒÛÐQPPTØÐ™”ÖP™ÐQ[VSP’QÑÐTÔPšÑZVZÐ’]ÑÒÐTÑPš”QÊÐTPRRTQÓX“PP™ÙÐVNœÔQPRPPQYXšÐ’ÒPTÝÑYPXÕP’RTŒžÑYXÙÐ’RPTŒžTQYXÛÐ’RÐTŒžYÑYXÛÐ’RÐTŒžYÑYPXÚÐ’ÒPTŽžPQYXÙÐ’PRTÐPžÑYÐXØÐ’TRÐTÑPžÑZPXÕP’YÒTÓPžQZÐXÒP’”RTÖPÑ[XŒ’ÙÑÍPTÛÐTÝÐ]Ñ\ÐTQ]PRÔPŒÑPQ‘P›™ÒPTPRLÔQPPUP›]Ñ^PV–P“]ÑœÔQPQÐPPV^VLTPPÓ]Ñ™[QPQUP–P•Þ•P•ÕP•ÑP•š˜Ð•‘Ð•Z˜Ð•Z˜Ð•UP•QP•–P•P•P•P•P•P•Î•N•L•PÝÐ•PÛÐ•ZZÐ•^YÐ•”ØÐ•žXÐ•ÐÖP•ÚVP–ÕP–TP–TÔP–ZSP–šSP–žRP˜TÒP˜ZQP˜”ÐP˜žPP˜ÔŽ˜Þ™™Œ™™™TŒ™TŒ™Z™^™Z™ZPP™TÒP™PÒP™PÓP™PÒP™ZPP™Ž™š™ÐQXÐU•PQZØU•PQZØPUQYÖUÐQXÖPUQVVUPQUUÐUQTUÐUPPL[ÐQUUÐP\PQUPU™PZQUPUQUUÐPÌUžPÛÔÐUžPÛÔÐUžPÛÔÐUžPPÜÔUžPÝÔUžPÝÔPUžPÝÔPUžPÝÔPUžPÝÔUžPÝÔTÎ^PÝÓÐTÎ^PÜÓÐTÍ^PÜÓTÍ^PPÛÓTÍ^PPÛÓTÌ^PPÛÓPTÌ^PÚÓPTÞPPÚÓPTÝPPÚÓTÞPØÒÐTÞPØÒÐTÝPØÒTÝPÙÒPTÝPÜÒTÝPÌTÜPÎÐTÜQQTÜPQQTÜPQQPTÝPQQTÝQPÐTÞQÐÐTÞÐQÐTÌ^QÐTÌ^QÐPTÍ]ÐQÐPTÌ]ÐQÐPTÌ]ÐQÐPTÌ^QÐPTÌ^QÐPTÌ^QÐPTÞQÐPTÝQÐTÚPQÐÐTÖžQQTÔŒQOH‹™[™[ZY\ËLKMˆŽˆ™™ÐSÙ]ÑUTQVYPQXYÑXÙÑYYQY™QZXÝÑZ˜ÙÑ[ÔQ[˜ÔQ[ØÐQ\Ñ\XÑ\˜Ñ\˜™Ñ]™Ñ\ÔQT™Ð]ÑXX”P]S™ÑYØ”P]SYÑ[Ø”P]SPQ^”PQX]ÐP˜”P]SÑSQ“QÒÝÑžÝÑžÝÑžÙÑžRÙÑžÙÑžÔQžÐQžRÑ™ÑÒ™ÑÐPTÕPšQ[VVP’QÒÐTÔPšQZVN’]ÑÔPTÒPšÙÑZV”P’TQÕPTÑP›QZV”P’TQÕPTÐP›QYÐV“P’PQÔÐTŽšÙÑYV‘P’ÑÔPTŽšÑYVM’ÑÓÐTŽš™ÑYVN’PQÓÐTÐPš™ÑYÐVM’PQÔTÐPšÔQYÐV’P’PQÕPTÑP›QZV”P’TQÕTÒP›QZPV•P’]ÑÕTÔP›Q[V”P’™ÑÕTØÐšÙÑ[ÐV‘P’ÔQÔPTÛÐšÑ\VM“QÓPTÍš]Ñ^PVXÐ“QÑUP™ÝÑMTQMRÐVVÎVÎVÎVÎUM“TP[ÓÝÑ“Ú™ÑPRž›Ð•ÍPÖMPUM”TPZÓÐQ“ÚÑPR^˜Ð•PÒLUÔPTPYÓ”Q”ZÔQPR”P•V’PPœÞPU“ÕTPV“TQ•[QPQžP•––PP“]U™VTPTSÑ–›ÑPP”Ì•ÞL–ÜÐ–PÛÐ–^ZÐ–”ÙÐ˜PÙÐ˜ZYÐ˜ØÐ˜šXÐ˜žVP˜ÔÕP˜ÞUP˜ÞUP™ÔP™TP™PÔP™TÔP™ZTP™^TP™^TP™ÕP™^VP™ÖP™”ÖP™”ÖP™”ÖP™šVP™šVP™šUP™ÐQ[VPP’QÐTÒPšQZUÐQ[ÙÐUPQYÙPUPQYÙUQXØÐUQXØUÐQVXPUPQTVUPL^QVPUÐP]PQVPUPPYÐPÍUPÌÐUÐPÛÕUÐPÛÕUÐPÛÕPUPÜÕPUPÜÕUPÝÕUPPÌÐUPPÌÐUPPÌUPPÌUPPÌPUPPÝÔPUPPÝÔUPPÝÔUPPÜÓÐUPPÜÓÐUPPÝÓÐTÎMPÛÓTÎMPÛÓTÍMPÛÓPTÍMPÛÓPTÌMPÛÓTÌMÐPÙÒÐTÌMÐPÙÒTÍNPØÒTÌMÐPÚÒPTÌMÐPÛÒTÌMÐPÜÒTÞÐPÌÐTÞQQÐTÝQQÐTÜQQTÜQQPTÝQQPTÜQÑTÝPQÐÐTÞPQÐTÌMPQÐTÌMPQÐPTÍMPQÐPTÍMPQÐPTÍMPQÐPTÍMPQÐPTÍMPQÐPTÍMPQÐPTÌMPQÐPTÞQÐPTÝÐQÐTÛPQPÐTÖŠÐQOH‹™[™[ZY\ËLKMÈŽˆ–PS–TQTÖÑVVQX–QXÖQYUÙÑZÔQZ•ÐQ[Ñ[•Ñ[•™Ñ\”Q\U”Q\UQ\•Q\ÕQ\Õ]Ñ]U]Ñ]U]Ñ]U]Ñ]•]Ñ]•]Ñ]•YÑ]ÕTQ^QL”ÐQMÔ”QJÔTQ“QSÙÐ’RÝÑ•ÒYÑ™’ÑšRQšRQš‘ÙÑ›ÐQ›‘Ñœ™ÑœÑ”QžQŒQQŒÑQÑQŽQŠÑQ‹Ñ”QÐPT•P™ÔQUÐVPP‘Ñ‹ÑÑ‹ÑÐQŽQÐQŽQÐQŽÐQŽÑŽÑÑ™ÑÑ”Q‘Q‘]ÑÑYÑŽQTQŠÑPQ‹ÑÑÐPTN™ÐQSÐVQP‘ÑÑTLšÑSVXÐ‘QÒTLšYÑSPV]Ð‘QÓT\ÐšÑSVNÝÑÔPT[ÐšÔQRÐV’PÙÑÔÐTZÐšÝÑRV“PÐQÕPTYÐ›QRPV”PÐQÕPTYÐ›QRPV”PÐQÕPTYÐ›QRPV”PÐQÕTYÐšÙÑRV‘PÔQÔPT[Ðš™ÑRÐUÖžPPÖSUÔžPPÕSUÔžPÓSPUÓŒPÑSUÒŒPPŽÐUÑŒPŒUÐŒÐPœÔPUŽMPšÔÐUŒMPP–UUŒMÐP“XPU›PPQ‹ÐP\ØÐUšPTPPšÑPPZ^SPU^VP•TÕP•^UP•”ÔP•›œÐPTÓP•ÔÓP•ÞRP–QP–PÐP–^PP–ÐP–ÐP–”Ž–ž˜T˜Z˜Œ˜”Œ˜”Ð˜ž˜š˜ž˜ÐŒ˜ÐŒ˜ÔŒ˜ÔŒ˜ÔŒ˜ÚÐ˜ÞÐ™œÐ™Ð™Ð™P™Ð™T˜Ð“LÐT”–P“‘LT•P“‘MT^P“‘NTZP“LPPQQPSP“P“LQPQÓPS’P“LSPPÑÖPRÚP“[YÐRžP“[YÐRžP“[XÐRÐP“UØÐRÐN“–PRÔN“ÖPRÔN“ÖPRÔM“UPRÙÌ“TPRÝÌ“TPRÝÌ“TPRÝÌ“ÔPRÝÝÐ“TPRÙÝÐ“ÔPRÔ]Ð“ÔPRÔ]Ð“ÔPRÙÝÐ“ÔPRÔ\Ð“ÔPRÔ\Ð“ÔPRÔ\Ð’Ì”PRÔ\Ð’ÛTPRÐ[Ð’ÛTPRÐ[Ð’ÕÔPRÐ[Ð’ÕÕPRÚÐ’ÕÕPR™ÙÐ’ÕÕPR”YÐ’ÑÕPR™ØÐ’ÑÕPR™ØÐ’ÑÔPRÐVP’ÑÔPRÔUP’ÑÔPRÙÕP’Œ”PSTP’Œ“PSÔP’Œ“PSTSP’ÑÓPSYÒP’ÕÓPSRP’ÕÒPS™ÑP’ÛQPSÐPP’Ì‘PSÔPP’Ì‘PSÔPP’Ì‘PSÙÐP’Ì‘PSÙÐP’Ì‘PSÙÐP’Ì‘PSÙÐP’Ì‘PSÙÐP’ÛRPSÔPP’ÛRPSÔPP’ÕÓPSÐP’ÑÔPS”QP’›UPS]ÓP’[XÐSPOOH‹™[™[ZY\ËL‹LŽˆ•ÐTÕQUÕYÑXUTQYÑZQ[Q[ÔÝÑ\TÙÑ\ÔÔQ]ÐQ]”Ñ^™Ñ^”™ÑL”QL”QMQMT]ÑMÔYÑNYÑNTTQJÓÙÑPÔTPJÓÔQ’ÐQ’SÑ’“ÐQ’“ÔQ’SÔQ’SÔQ’SÙÑ’ÙÑ’ÙÑ’ÙÑ’ÙÑ’ÔQ’SÑ’Ó™Ñ“”Q“SQ““Q““]Ñ”YÑ”STQ”STQ”SPQ”“PQ”SÑ”SÑ”SÑ”Ñ“ÓQ“ÓQ”ÝÑ”ÙÑ”RÙÑ”RÔQ”’ÐQ”ÒÐQ•Ñ•™Ñ•R™Ñ•™Ñ•”Q•Q•Q•]Ñ•RYÑ•’YÑ–YÑ–RYÑ˜RTQ˜ÒTQ™RTQ™’PQšÑš’ÑšÒÑ›Ñ›RÑ›’Ñ›ÒÑœÑœRÑœRÑœ’Ñœ’ÑMÕÙÐ^ÑNVP]RÑJÖPP\’QKÖ™Ð[QXPPZ’Q˜YÐZQØPY’QØ”PYRQØÐPX‘ÝÑ‘XÙÐVQÔQ‘ÙPUÑÑ’YPUQ™Ñ’™ÐTÑ”Q’ÙPPTQ“PPS‘]ÑZ“ÔP[YÐS‘YÑZÓÙÐ[PPQÙÔQPPT‘P’‘ÐR’ÐP”P’^ÐRLÚÐP]Î’^ŒRYÌ’•RT\Ð’šŽRÛÐ’šÑPRZÐ’ŒPRZÐ’šÔPQÔYÐ’šÕPQÐXÐ’•VPQÖP’‘VPQÔUP’LÐQÝÔP’ZÙÐRSP’ZÙÐRÓP’QYÐRYÒP’‘XÐR”RP’•VPRÑP’šÖPRÐQP’ŒPRÔQP’ÑUPRÝÐP’ÚÕPSPP’ÚÕPSPP’ÚÕPSPP’ÚÕPSPP’ÚÕPSPP’ÚÕPSPP’ÚÖPRÙÐPÍQÌÐPÕ–PQ›LPYÕPT‘PQ‘ÒPP”OOH‹™[™[ZY\ËL‹LHŽˆ•PPTUQVÙÑX”ÔQYTÐQZ™ÑZÔQ[Ô]Ñ\TYÑ\ÔTQ]TPQ]ÔÑ^TÑLÑLTQLÔQMTQMSÝÑMÓÙÑNSÙÑNSÔQJÓÔQKÓYÑQ“ÐPSTQ’SPQ’“Ñ’ÓÑ’ÓPQ’“TQ’STQ’SYÑ’]Ñ‘Ó]Ñ‘Ó]Ñ‘Ó]Ñ‘ÓTQ’SPQ’“Ñ“Ñ“Ñ“Q“SQ““Q“’ÝÑ“ÒÝÑ“ÒÙÑ”ÔQ”ÔQ“ÒÐQ“ÒÐQ“’Ñ“’™Ñ“’”Q“ÒQ”]Ñ”RYÑ”’TQ”ÒPQ•PQ•PQ”ÒÑ”ÒÑ”ÒÑ”ÒÑ”ÒÑ•Ñ•RÑ•ÒQ–’Q˜’Q™QšÒQ›‘ÝÑœQÝÑœ‘ÙÑÙÑQÙÑ‘ÙÑÑÙÑžÙÑžÙÑž‘ÙÑMÕÙÐLÝÑM–P^ÝÑM–PP]‘ÝÑM–]Ð]ÙÑN™Ð\QÙÑNV™Ð\QÔQJÖÐ\ÔQKØ]Ð[ÔQXPZÑÔQX™ÐZQÔQ˜ÐZÔQØÐPYÑÔQØÔPY‘ÐQ‘ÝÐXÑÑ‘YÐV‘™Ñ‘™PPUÑ”QYÓ™Ð[YÐTQQZÐP“ÔPZYYÐT]ÑZÙÐZ]ÐS‘YÑZPYYPRQPP^P’URÐPšP’ZÐPQÛÐPN’ZÐPQÛŒPYÍ’ZÐPQÔL’LPQÔ]Ð’LPQÐ[Ð’•QPQÐZÐ’•QPQÐYÐ’•QPQÐXÐ’•RPQÐVP’•RPQÐUP’‘RPQÐUP’ZÒPQÙÔP’ZÓPQÝÓP’USPRÒP’URPRYÑP’‘RPRQP’•QPRÐP’ŒPRÐPP’ŒPRÔPP’ÑPPRÝÐP’ÕPPSPP’ÕPPSPP’ÚÐPSPP’ÚÐPSPP’ÚÐPSPP’ÚÐPSQP’ÕPPSSP’ŒPRÚP‘ÕUPPU‘PQ•ØÐPTOOH‹™[™[ZY\ËL‹LˆŽˆ•ÙÐT™ÑV]ÑYUYÑZTQZ•PQ[UÑ\Q\•Q]ÝÑ]”ÙÑ^ÔQLÐQL”ÐQL”ÑM™ÑM”™ÑM””QN”QNTQJÔ]ÑKÔ]ÑTQ‘ÓÙÑ’“ÔQ“ÐQ“SÐQ““ÐQ““ÔQ“SÙÑ“ÙÑ“ÔQ“SÑ“Ó”Q”SQ”“]Ñ”ÓYÑ•TQ•SPQ•“PQ•“Ñ•ÓÑ•ÓQ–ÝÑ–’ÙÑ–’ÔQ–’Ñ˜R™Ñ˜’”Q˜’Q˜’]Ñ˜ÒYÑ˜ÒYÑ˜ÒTQ™PQ™RÑ™’Ñ™ÒQšQšQ™ÒQ™‘ÝÑ™ÑÝÑ™‘ÝÑ™QÝÑ™QÝÑ™ÝÑ™ÝÑ™ÝÑ™ÝÑ™RQ™Q™RQ™’QšRQš’Q›Q›’Q›ÒQœQœQÝÑœ‘ÝÑœÑÙÑQÙÑ‘ÔQÑÔQÑÔQÑÔQÑÐQžÑžQ™Ñ’V™ÐZ‘Q’ØTPYÑ]Ñ“]ÐYQYÑ“X”PXÑTQ“˜ÐXQPQ“ØÔPVÑ”ÝÐU‘Ñ”PTÑQLYÐX™PTÝÑLTYÐX™ÐTÙÑ^YÐXYÐRYÐQÔQ]”YÐXYÐRÐQPP]ÙÐ’ÑPP‘RPQÖÐP”XÐ’ž•PPURPQÖÐP]ÖP’ŒPQÔUP’ŒPQÐTP’šÒPQÐSP’•RPQÐRP’LPRQP’URPRÑP’UQPRYÐP’LPRPP’‘PPR”PP’•PPR™ÐP’šŽRÐPP’žŽRÔPP’ÑRÙÐP’ÕRÝÐP’ÕRÝÐP’ÕRÝÑP’ÑRÝÒP’žŽRÝÓP’šÑPRÐN‘ÕQPPUSPROOH‹™[™[ZY\ËL‹LÈŽˆ•ÔPSÕ™ÑUUQV•YÑXÕPQYÕÑZÕÑ[UQ\ÝÑ\”ÙÑ]ÔQ]ÔÐQ^TÑLÑLT™ÑL””QM”QMTQM”QM”]ÑN]ÑNÙÑQÔYÐJÓÔQ’SÔQ’SÔQ’SÙÑ’SÙÑ’SÙÑ’SÝÑ’ÝÑ’ÝÑ’ÙÑ’SÐQ’Ó™Ñ“S”Q““Q“Ó]Ñ”YÑ”STQ”“TQ”“TQ”“PQ”ÓÑ”ÓÑ•Q•SQ•Q•ÝÑ•RÙÑ•RÔQ•RÐQ•’Ñ•’™Ñ•Ò”Q–Q–RQ–R]Ñ–’]Ñ–RYÑ–’TQ˜RTQ–’PQ–RPQ–PQ•’PQ•’TQ•RTQ•TQ”ÒTQ•YÑ”ÒYÑ•RYÑ•’YÑ•Ò]Ñ•ÒYÑ–RYÑ˜RTQ˜ÒPQ™RÑ™ÒÑšÑš’Ñš’Q›Q›’Q›ÑÝÑœQÝÑœQÙÑœÑÙÑ–Ð[ÑÔQÖTP[Ñ‘–”PZ”Q’™ÐYÑQ’VÐY‘YÑ’ØTPYTQ’ØYÐXÑPQ“”PV‘Ñ[ÐPZ˜ÐUÑÑ[ÙÐZÐPUQÑZÓÝÐYØÔPTÑQZ”PY˜ÔPS™ÐQQZ”ÐYÔPS™ÐQPPT\Ð’LPQÌÒPPÝÚÐ’‘PPQÌÒPPÙÙÐ’•PPQÌÒPPÔXÐ’•QPQÛ“PP’ÐPTXÐ’‘QPQÙÕP’•RPQÔTP’•RPQÔSP’LPQÔRP’QSPQÔRP’SPQÙÑP’TPQÝÑP’ÔPRQP’UTPRYÑP’ZÔPRPP’•SPR™ÐP’šÓPRÐPP’ŒPRÔPP’ŒPRÙÐP’ÑRPRÝÐP’ÕRPSPP’ÕQPSPP’ÕQPSPP’ÑRPSPP’ÑQPSQP’šÒPSM‘ÑSPRÚP‘LÐPULP‘’PQOOH‹™[™[ZY\ËL‹MŽˆ”ÐTQT“ÙÑU“ÐQVSÑX“™ÑY™ÑYVTPS“”QY–PUSQZPVYÑZ•ÔPX“TQZÕÐY“PQ’ÓÑ“SÑ“ÓQ”’ÝÑ•RÙÑ•ÒÐQ–’Ñ˜’™Ñ™”Q™RQ™Ò]ÑšYÑš’TQšÒTQ›PQ›RÑ›ÒÑZPP’ÑYTPP’QYTP’QYTP’QYYÐ‘ÒQXÔYÐ‘ÑÝÑYÐ’‘ÝÑÝÑÝÑÝÑÝÑÝÑÝÑÝÑRQQQœÒÑœ’PQ›ÒTQ›’YÑ›RQš’QšR™Ñ™’ÐQ™ÙÑ˜RÝÑ–“Q–Q•ÓÑ•“Ñ•“Ñ•SÑ•SQ•SQ•SQ•SQ•ÝÑ•ÙÑ•ÔQ•’ÐQ˜’Ñ™R™Ñš™ÑšÒ”Q›R”Q›ÒQœR]Ñ]ÑRYÑÒ]ÑÒYÑžYÑžTQž’TQž’PQŒRPQŒ’PQŒÒÑÑÑÑRQÑÝÑŽÔQ˜ÙÐZÐQ–TPYQÐQ–]ÐXÑÑ–™ÐVQ™Ñ^ÐP[YÐQPQ”•P’šÍRRQPP‘ÕTPP‘Q[UPPYÙÑPQP’›PQÍPPMTÕ”ÐPœQTPR]ÑPPP’ŒRPQÛÓPPXSPTPPÑÑ[•YÐXYÝÑPP”M’›PQÛÔPPSSTÖ”ÐPšÓPTÖ•P™ÒÐTÚP™ÒPTÚP™ÒTÚP›ÑÐTÙPÑTÙPPTÕ”ÐPÑQPTÓ”PÔQTÔ”PÕPÐTÖ”PPÙÐTÚPPÚÐTÛPPÛÐPTÝPÝÐPTÝPÝÐPTÝPÝÐPTÝPÝÐPTÝPÝÐPTÝPPÜÐPTÜPÚÐPT[ÓPTÐPÔQTQSÐPLÐPQZPQZPS™PP”OH‹™[™[ZY\ËL‹MHŽˆ˜YÐSÖÑU–”QV–]ÑYVYÑZÑ[VÑ[ÖQ\VQ\ÕÝÑ]UÙÑ]ÕÙÑ]ÕÔQ^UÐQLÐQLUÑLÕÑLÕ™ÑMU”QMÕ”QMÕ]ÑP•”PNÙÑ’ÔQ’TÔQ’”ÔQ’”ÔQ’”Ñ“YÑP”P“ÔTQ”ÔQPPž•“ÐPNU˜MTPUSÐQ˜]ÑPQž–P–PPœÞUŠÞPTPYTQš\ÔQPRP–MŽPÐ]UÔÝTPZSQ›œQPRZ\Ð˜RÛÐPÓ\PUÛZTP\ÒÔQœ›™ÑPSTÚÐ˜œÐQÛÐXYÐ’ÑÜTØÐœYÑ[PX]Ð’™ÑÜÐTÖPœQ[PX]Ð’™ÑÜÐTÖPœQ[PX]Ð’™ÑÜTØÐœRPTPQRÐQÚTÙÐ›ÙÑ\XQP’ÙÑÙÐTÛÐ›ÐQ\VŽ“QÐXÑPPZÝVÐÐTPRÑÝÝÑPP•P™ÓPPT]ÐVPTPPÓÑžÑšÛTQPPÍ•ÛÚÐPV]PU™ÝU™ÜÐU™ÜÐU–\U–\PU–\U•[ÐU•[ÐU”[U”[U”[PU•[U˜ÚÐU™ÚÐU™ÚU›ÙÐTQZPQœÙPUŽUÐXUÒXPUÓVUÔVPTÞPÙÖTÞPPÒUÐTÝPŽTQUPÝP›ÔTÍZP›ÔPTÍZP›ÔTÍZPšÓTÍZPšÓPTÍZPšÓTÌZPšÒÐTÌZPšÒTÌZPšÒPTÌZP›ÒTÞPPœÑÐTÞPŒTÝÐPÒQPTÜÐPÔQTÛÐPÖPÐTÛPÙÐÐTÛPPÛÐTÝPPÜÐPTÞPÌPTÌYPÌPTÌYPÌPTÌYPÍPTÌYPÍPTÞPPÌPTÝÐPÛÐPTXÓPŽYÐPÙÐÐTQSPMPP[P”OH‹™[™[ZY\ËL‹MˆŽˆ˜ÐSØQUXYÑVXTQXÖÑY–”QZVQ[]Ñ[ÖYÑ\VTQ\ÖPQ]Ñ]ÖÑ^VQLQL–QLÕÝÑMÙÑM•ÙÑM•ÔQNÔQNPQQ•ÐPNUPQ‘ÕPQ‘ÕPQ‘ÕPQ‘ÕTQ‘•TQ‘•TQ‘•TQ‘•Ñ’UQ’”ÝÑ“ÙÑ“TÐQ“ÔÑ”™Ñ”””Q”Ô”Q”ÔQ•Q•YÑ•”PQ–Ñ–Q–TQPPXÐPQÊÐTPPÐQPPUÐ•ÍÕPPRÍTPS“ÙÑ™ÜÙÑPQÑÐ–œNPÌÐUÍœÐTPYÓÑÕÐUP›ÑLPV™Ð“”QÖPUP›TQLVœÐ“QØUP›Q^VÐ“YÑÙPUP›ÐQ]ÐXQP“ÑÚPTÍ›ÝÑ]PXSP“QÚÐTÌœQ\ÐXUP’ÙÑÛTÚÐœPQ\U”ÒÐTP’ÐQ–QPT”ÙÐ•Ò•PPQÖTPT\™ÑPR^XÐ•ÜÐP[]ÐTPYÒ™Ñ˜ÜÔQPRVP–PPŒUŒTPUžYÑPPÔP–SÐPNUÑÎPTPSPQšÝÑPPÐŽ–˜ÐPPXÙUÙTPQ‘ÝÑœÙÑPP^Ð˜ZÐ˜˜Ð˜”–P˜šP•TPRP”P“RPRQÜÐQÔ‘P“ÓPR]ÐQÐP“ÔPRÝÐQÐN“ÖPQÛ]ÐQÐL“ÙÐQLLP[]ÐQÐ]Ð“ÛÐQUÝÐQÐ[Ð“\ÐPÑ”PP›]ÐQÔZÐ“]ÐP›PPLŒQÙÙÐ“LP‘ÌRXÐ“LP‘ÌRÖP“MP[MR]ÕP’ÌŒR™ÔP’ÛLRÓP’›]ÐRÔRP’›]ÐRÙÑP’ŒÐRÝÑP’ÑÜÐSPP’ÕÜÐSPP’Û\ÐSPP’Û\ÐSPP’ÕÜÐSPP’Û\ÐSPP’Û\ÐSPP’ÕÌRÔPPÔ[ÐRŒQÐQ™Í‘ÐPÙÏOH‹™[™[ZY\ËL‹MÈŽˆ•PSÕPQTÕÑVQYQY”ÙÑZÔÐQ[”Ñ\”Q]Q]”]Ñ^YÑ^”TQLTTQL”PQLÔPQMÑM”ÑNÑNQNTQJÓ]ÑQ“ÝÐ“YÑ’ÓTQ“STQ“STQ““YÑ“SYÑ“SYÑ“S]Ñ“]Ñ“]Ñ“YÑ“STQ““PQ“ÓÑ”Ñ”Q”“Q”“Q”ÒÝÑ•ÝÑ•ÙÑ•RÔQ•RÐQ•’Ñ•’”Q•ÒQ•Ò]Ñ•ÒYÑ•ÒTQ•ÒPQ–PQ•ÒÑ–Ñ–Q–’Q–’Q˜QÝÑ˜‘ÝÑ˜QÝÑ–‘ÙÑ˜QÙÑ˜QÙÑ˜ÑÙÑ™‘ÙÑšÙÑš‘ÙÑ›ÑÙÑœQÙÑœÚÑPPTœÐ˜žÐ˜ÔœÐ˜ÞÐ™›Ð™Ð™Ð™TšÐ™T™Ð™^Ð™˜Ð™”˜Ð™šP™žP™žP™žP™ÐQUPU^PÒUUŽLÐPÐUÐPPÔUÑPœÔUÐÐP›ÔUÐŠÐP˜ÔPUÑÐPTPU‘PQšÔQPQ]Î”’PRPP’TUPžPÐTPTQÑZSPU•™ÐXYÙÑPQÌ’UPQQ–PQÛÒPPMTŽÐPMUÐPœQTPSQQYSÐSÕ™ÐXYÝÑPP’ZÐPUSTP^ÐPœQPTPPÚYÑPP]Ì’ÐP^ŒP›PQÙÝÐ’P‘˜ÐQÔ\Ð’˜ÐQÔZÐ’XÐQÔYÐ’YÐQÔXÐ’XÐRUP’Q™ÐRTP’Q˜ÐRTSP’U˜ÐR]ÒP’‘˜ÐR”RP’•˜ÐR™ÑP’ŒVPRÐQP’ŒVPRÔPP’Õ–PRÙÐP’ÛPRÙÐP’ÛPRÝÐP’ÛPRÝÐP’ÛPRÝÐP’ÛPRÝÐP’ÛPRÝÐP’PÛÐRÙÎ‘ÑPPÑ™ÐPÑÖPQÔOOH‹™[™[ZY\ËLËLŽˆ˜”PR‘ÐQRVTPQ”PSQ”QSÖPPX‘]ÑUVÐYYÐP‘TQVVPPZQPQXVPPZ‘ÑYTP[‘QZTP[ÐÝÑZ–PP–Ð\ÐÝÑZÖP]ÐÔQ[–P^ÐQ\ÝÐ^ÐQ\ÔPL™Ñ\ÕÐPM™Ñ]ÐPMP”Q]UÐPMQ]ÕÐMÛQPP]ÓP“U–PTYÒP“[PT]ÒP“LVPT]ÒP“LUPTQP“‘•PT”QP“•“PTÑP“•’PTÔPP“›PTÝÐP“ŒUÐP‘ÞÐQÌUÐP‘ÚQÕMUÐP‘ÐQÕ\ÐU]ÐP‘ÐŽQÑVPUÐPP‘žQÑRPVPP‘šPPQžVYÐP‘šPPQžŒVPP‘”ÐPQžœÐV™ÐP‘ÐPQžšÐXPPP‘”ÐPQž™ÐXTPP‘ÑPYÐQPPT”ZRPPPQUTPÐTQP‘TÑPYÔQPÐTNÐRSP]ÑS’PPÑPTTPÞZÑQÐTYÙÐRVP’ÑÒPTšTQYPV[Ð’QÓTŒšQXÐT˜ÌRXÐT˜ÌPRXT™ÌRXT˜ÌPRXPT˜ÌPRVT™ÌRVT™ÌRVPT™ÞRVPT˜ÞPRVT™ÞRUÐT™ÝÐRÕÐT˜ÝRÕT™ÝRÕPTšÝPRÕTšÝRÕV’P‘YÑV“PTQV’ÝÐPQV’ÝÐPQVRÙÐQÑVRÔP‘ÑV’ÔP‘QV’ÐPŽQVRÐŽQQV’ÐŽPÝÑV’™ÐŠÐÝÑVR™Ð‹ÐÝÑVR”PÐPT[Ð‘ÐÔPYÙÑRTšÚÐRRPÔQVR]ÐÑTYÐ‘ÐÓPZQRTšÚRTPÑVRYÐÑTXÐ‘žRPZÑRT˜ÚPRVP™ÑVTPÒTVP‘šQPZÑQT˜ÙÐRYÐ”QUÒPPÒPTUP‘šPPZTQQPT˜ÙÐR[ÐQVPPÓTTP‘žPPZ]ÑQPT˜ÙÐR]ÐQVPPÓPTTP‘žPPZ”QQPT˜ÙÐRMQVPPÓÐTTP‘žPPZ™ÑQPT˜ÚRMQVTPšZQPRÙÔP‘žRPVRVPPÚÑPT˜ÚPQÐÑÐTP\QVR]Ð™ZÑPRÙÔP‘ÐÓPVVPPÛÑT˜ÚQŒ‘ÐTP\P”QVRP˜ÚÑPRÙÕP‘ÐÔPVXÐPÛÑÐT™ÛQžRPTP\™ÑV’™Ð˜ÚPQPRÙÖP‘ÚVPVÚÐPÚÑÐTÛQŠÒÐTP\ÑYR™ÐšZ]ÑPRÔXÐ™ÙÑÓTP\PÐQÐÐV]ÐPÛÒPVTPš™ÑPRÔYÐœÑRXMÔQÝPT[Ðœ”QSX]Ð‘QÜT]Ðœ]ÑSX[Ð‘ÑÜTNœPQTPXXÐ‘YÑÛT”P›ÝÑUÐXPP‘ÑÙPT›Ð›]ÑXVšÐ’QP’PPÔÐTÔPš”QZÐVL’Q›ÑPQPÓP™M‘PPLVšPTPR’PQŠÜQPP”Ž™ž™ÐQYVQP’QÐÐTœÐ”›ÐT›Ð”œÐT^Ð”ÐTZÐ”ŒTP™Ð”ŒTP˜Ð”ŽT˜Ð“ÌNT–P”ÐPT–P“Ì‘PQÍSP“Ì“PPÕÌSP”P“ÌŒSP”P“ÕÌSP“ÛLSP“ÛLSP“ÌÐSP‘P“Û]ÐSPP“Û]ÐSP“Û]ÐSP“ÕÝÐSP“ÕÝÐSÎ“ÕÝÐSÍ“ÕÝÐSM“ÑÝÐSL“ÑÝÐSL“›]ÐS]Ð“›LRÝÝÐ“•ÌRÝÜÐ“•ÌRÙÛÐ“•ÌRÙÛÐ“‘ÌRÔ[Ð“[]ÐRÝÙÐ“[]ÐSYÐ“QÜÐSPXÐ“QÜÐSYÖP“QÛÐS”VP“›ÐS™ÖP“[ÐSÐUP“ÛÐSÔUP“ÚÐTUP“ZÐTUP“šÐTUP“šÐTÕP“šÐTÕP“šÐTÕP“šÐTÕP“›ÐTÖP“[ÐTØÐ“ÜÐTZÐ’ÕÝÐSÙÏOH‹™[™[ZY\ËLËLHŽˆ–™ÐSÙTPQÖ™ÑXÖÑYÑYšTQPPUÙÐ’‘ÙÐ’•ÙÐ’Œ’P“QP“QÐP“ZÐÌPSMXÐPQUPTšQÕÐTPQ]ÑU–PPM‘TQV–PJÑÑYPQÑY•ÝÐÑQZÝÐ‘QZ•ÝÐ‘ÝÑ[ÙÐ‘ÙÑ[UÙÐ‘ÐÐQ\ÔP’Ñ\UÐP’P™Ñ\ÕÐP’™Ñ\ÕÐP’Ð”Q]UÔP’”Q]UÔP“Q]ÕÐ“Ð]Ñ^P”]Ñ^UPP•ÐYÑ^•Ð–PTQLÝÐ˜ÐTQLÐP™TQLTÐ™ÐPQL””PšPPQL”]ÐšÐPQX’ÐVTYÐ›PPQXRÐVTP›PQV’ÐVPP›ÐPQVRÐVÐœPPQVÐVÐœÐPQVÐVPPQVÐVPžPQUÒÐVÝÐžPPQUÒÐVÝÐžPQU’ÐVÝÐŒPQU’ÐVÝÐŒPQURÐUÔPžPQURÐUÔPžPQUÐU”PžPQUÐU”PžPTQTRÐU”PžPYÑTÐU”Pž]ÑS’ÐU”PžQSÐU“ÝÐž”QRRPUÓÙÐžPÔQQÐU“ÔPžRQVÐPžRQUÓÐžRQUÓÐžÝÑV™ÐœÑÙÑV”PQÔQVSP‘ÔQV]ÐžÐQVSYÐžQÑVSYÐžÑVSTPžQ™ÑVSPPž‘™ÑVSPPžQ”QVSPPž”QVÐžQVSÐžQVÐž]ÑVÐÑYÑVSPÑYÑVPžQTQVSPž‘PQVRÝÐŒPQVÝÐŒÑVRÝÐŒÑVRÙÐŒQÑVRÙÐŒQÑVÙÐŒQQVÙÐŒ‘QVÔPQVÔPQQVÐP‘QVÐPÐÝÑVÐPÐÝÑVÐPŽQUÒÐPŽPÝÑUÒÐPŠÐÙÑVÐP‹ÐÙÑUÒÐPÐPT[Ð‘šYÐYÔQRT˜ÛÐRQPÔQVÐPÐÐTZÐ‘žZÐYÙÑRT˜ÜPRRPÔQVÙÐÑTZÐ‘ž[ÐZQRT˜ÜRTPÔQVÝÐ”Ù™Ð^PÔQVÝÐ”™Ð^PÔQVP”YÐ^PÔQVSP”YÐQPSYÛÐ‘šLUPQRÐT˜ÝQMÐTP^ÙÑVSP”ÝÑPSP\Ð‘žLUPQST™ÝQ‘ÑTP]ÝÑV“P”ÚÑPSÜÐ‘Þ]ÐU–YÐPÝÓPTœÜÐQ˜RÐTP\QQYRÝÐ–Z]ÑPRÔL™ÐPÙÓVSÐTP[QQZÑPR”M™V‘PPÓTVUTPYÑÑ›QPRP™\PPŒPVUÐTPX‘TQÛÑPQÚP™\ÐP™ÕVVTPUÑQ›]ÑPQZP™\ÐPMÐVYPTPR‘ÐQÔQÙÑP’PŒ’QP’ÐŒÑP’PPžRPQž’]ÑÒ”QR]ÑžTQŒPQŒÑŒÒQQÝÑ‘ÙÑVÐLÑÔQVÐP–PPLQÐQVPPL™Ñ–YÐ^‘”QÖ]Ð^”Q–PP–™Ð]QQ–™Ð]Q]ÑÖÐ]YÑÖÐ]YÑ–Ð]TQ–Ð]QPQÖ™Ð]‘PQ–™Ð]‘Ñ–™Ð]‘Ñ–”P]ÑÑV”P]ÑQKÖ”P]ÑQJÖ”P]ÝÑKÖ”P]ÙÑV”P]ÔQV”P]PÔQKÖ”P]PÐQKÖ”P]PÑKÖ”P]PÑJÖ”P]P™ÑJÖ”P]P”QNV™Ð\QN™Ð\]ÑN™Ð\]ÑM™Ð\YÑM™Ð\TQLÖÐ\TQL–™Ð]PTQ^–Ð]TQ^Ð^PTQ]Ö™ÐLPTQ]–™ÐLTQ]V™ÐLÐTQ]”PMTQ]”PMÐTQ]V”PNYÑ]V”PNYÑ]V”PNPYÑ]–”PNP]Ñ]V”PNP]Ñ]V”PNPQ]”PNP”Q\Ö™ÐN™Ñ\–™ÐNÐQ[ØPPM‹™[™[ZY\ËLËLˆŽˆ˜ÙÐRXÙÑSÝÑSV™ÑSXÝÐTQPPUÕP’ÔPPS›TÓ›TÕ›PTÖ›PTÛÐTÌYÐTRšPÎYU™U™PUVTPP–ÑMÖÑNÑS–ÐNQQUÐNTQVVPP–ÐJÑPQXUÝÐÑQYUÙÐ‘QZÔP‘ÝÑZ•ÔP‘ÝÑZÕÔP‘ÔQ[•ÐP’PÐQ\™Ð“Ñ\•”P“™Ñ\ÕP“Ð™Ñ]]Ð””Q]•PP•Q]ÕÐ•Q^P–P]Ñ^TÝÐ˜]Ñ^”ÙÐ˜ÐYÑLÔP™PYÑLÐP™PYÑL™ÐšTQL”PšTQL”]Ð›PQLÔYÐ›PQYÐV”TPœPQXRÐVTPPœPQV’ÐVTÐPQVRPPVÐPQVRPPVÐPQVPPVÐPQUÒPPVÐPQVTPUÔPÐPQUÒTPUÔÐPQU’TPUÔÐPQU’TPUÔÐPQURPPVÐPQURPPUÔÐTQTÒPPUÔÐPTQT’PPUÔÐYÑTÐVPP]ÑS’ÐVPPQRÒÐUÔPÑRÐVÝÐÑUÓÝÐ›ÜQPP^‘š›ÐXPŒ‘š›ÐXPÐ‘ž›ÐXPÐ‘žšÐXZÐ‘žšÐXZÐ‘ž™ÐXZÐ‘ž™ÐXZÐ‘ž˜ÐXZÐ‘ž˜ÐXZÐ‘ž–PXZÐ‘ž–PXT˜Ð‘ÑPXT˜Ð‘ž•PVžP‘ž”PV•P‘ÑPVZP‘ÑPVZP‘ÑPV^P‘ž“PV“P‘ž”PV’P‘ÑPV’P‘ž”PV‘P‘ÑPV”‘P‘ž”PV”P‘ž”PVšP‘ž“PVžP‘š“PXPN‘ž“PXTM‘ž“PXYÍ‘ž“PXL‘ž“PX”L‘ž“PXÌ‘š“PXÐL‘š“PXÝÌ‘š“PYÝÐ‘ž“PYP]Ð‘ž“PYT]Ð‘ž•PYP]Ð‘ž”PYYÝÐ‘š•PYYÝÐ‘š•PY]ÝÐ‘š–PY]ÝÐ‘ž–PY]ÝÐ‘ž˜ÐYYÝÐ‘ž˜ÐY]ÝÐ‘ž™ÐYYÝÐ‘ž™ÐYYÝÐ‘ž™ÐYYÝÐ‘ÑÐY]Ì‘ž˜ÐY]ÝÐ‘ÑPYL‘ÑPYL‘ÑPY]Ì‘ÕPYYÌ‘Þ•PYM‘Þ“PY”M’PY™Î’NVÍPÑTV
ÔTPYPQ‹ÛQPQÐP™ÐQÖTPU‘TQÐPV™ÐP“TÐVPP›TQPQT’P™ÐQØTPSÑ]ÑÐPVŒP\ÕPVPP›™ÑPPžP™žP™žÐ™šÐ™šÐ™”›Ð™œÐ™œÐ™”Ð™™ZQP™XÐ˜ÔÜÐ˜”ÛÐ˜š[Ð“ÕÔPSÚÐ“ÕÔPPUÖPSZYÐ“ÕÖPSZXÐ“ÛZÐSVP“Û[ÐSUP“Û\ÐSÔP“Û\ÐSÓP“Û\ÐSÓP“Û\ÐSÒP“Û\ÐSÒP“ÕÛÐSQP“ÕÛÐSQP“ÑÛÐSPP“ÑÛÐS“ÑÛÐS“Œ›ÐS“Œ›ÐS“Œ›ÐSŒ“Œ›ÐSÐ“Œ›ÐSÐ“Œ›ÐSÐ“›[ÐSœÐ“›[ÐS›Ð“•ÛÐS›Ð“‘ÛÐRÞÐ“[[ÐRÞÐ“UÜÐRÚÐ“QÜÐRÔšÐ“œÐRÔ™Ð“\ÐRÚÐ“ÜÐS–P“ÜÐSP“ÛÐSP•P“ÛÐST•P’Û[ÐSZP’Û[ÐS”P’ÛZÐSšP’ÛZÐSžP’ÌšÐSÐ”P“ÛÐSÐ”P“ÛÐSÔ”P“ÛÐSÔ”P“ÛÐSÔ•P“ÛÐSÔ–P’Ì›ÐSÔ˜Ð’ÕÜÐSžÐ’›LSOOH‹™[™[ZY\ËLËLÈŽˆ–ÐV–QXÖÑYVÑYÙÐPÖÑZÖÑ[ÝÑ\•ÙÑ]Ñ^™Ñ^•”QM”QMQ™ÑS•”PMÑ]ÑU”PNPQV•™ÐNÑX•”PJÑQYUPQQYÕ]ÐÝÑZUYÐ‘ÙÑZÕYÐ‘PÔQ[UTP‘ÐQ[ÕTP‘ÐÑ\UTP‘Ð™Ñ\ÕTP‘Ð™Ñ]PP’”Q]•Ð“Q]ÕÐ“]Ñ^Ð“]Ñ^UÐ“PYÑ^•Ð“YÑLPP“TQLUÐ“ÐTQL•P”PPQLÕP”PQLÔÝÐ”ÐPQMÐP•PQMÐ–PQX’ÐXT™Ð˜PPQXRÐXTP™PQV’PPV”]Ð™PQVRPPV”TPšPQVPPV”ÐšÐPQUÒTPVTÐ›PQUÒTPVTP›PQU’TPVTP›PQU’TPVTP›ÐTQURTPVSÝÐ›ÐTQUTPVSÝÐ›ÐYÑT’TPVSÝÐ›Ð]ÑTTPVSÙÐ›ÐQS’TPVSÙÐ›Ð”QSPPV“ÙÐ›™ÑR’PPVSÙÐ›RPQVSÙÐ›ÑV“ÝÐšÒÑVSÝÐš’ÑVSÝÐšRÑVSÝÐ™ÒÑVÝÐ™RQVSÙÐ™RQVÔP™ÒQVSÔP™ÒQVÐPšQVÐšQÝÑVS™ÐšQÙÑVS™ÐšÔQV“™Ð™ÑÔQVS”P™ÑÔQVS”P™QÑV“P™‘™ÑV“]Ð™Ñ”QXSYÐšQQXSYÐš‘]ÑX“YÐš‘YÑX“TP›YÑXSTP›QTQXSPP›ÑTQV“PPœPQXSÐœ‘ÑXSÐœÑÑV“ÐÑV“Ð‘ÑV“ÐžQÑVSÐŒ‘QV“PQV“P‘QVSPŽQQVPŠÑQVSP‹ÑQVSPÐPT]Ð‘ž]ÐYÔQSPT˜ÜÐRQP‘QUÓPÐT]Ð‘š]ÐYÔQSPT–\ÐRQP‘QUÓPÐT]Ð‘šLTÌÝÐST]Ð‘žLTÖSP]Ð‘šLTÒSÝÐ‘žLTŒÎSÝÐ‘žMT–QPPÝÓPT™ÝPQUÑTP\QQVSÐ‘šQPRÔL‘ÐÍT–VPPØÓPT›ÝPQYRTP[QXSÐ’ZPQPR]Ì’ÌTÍÐPÒSUÌ“PTPYQQZ”QPRM˜PQÔÐTPUÑÑÛQPQ]Î˜Ò–PPNVÖTPS‘PQž›TQPPÚP˜Í\ÐPUÚTPP‘TQŒYÑŒ]ÑŒQŒ”QŒÑž‘ÑŒÔQž‘ÝÑžQÒÑÒTQ]ÑœÒ™Ñœ”Qœ’QœÒYÑ’TQÒÑžRQŒÝÑŒÑÙÑÔQQÐQ‘ÑÑ™ÑÑ™ÑÑ”QŽ]Ñ“YÐ]‘YÑ’UÝÐP–P]YÑV™Ð\‘TQ–”P\ÑPQ–”P\ÑÑ–”P]ÑV”P]ÑV”P]QVP]QQKÖP]PÝÑKÖP]PÙÑKÖP]PÔQJÖP]ÐQKÖP]ÑJÖP]™ÑKÖP\Ð”QKÖP]QKÖP\Ð]ÑKÖP\ÐYÑKÖ”P\PYÑNV”P\PYÑN”P\PTQM–”P\PTQLÖ”P\PPQL–”P\PPQL™Ð\PQ^V™Ð]PQ]Ö™Ð]PQ]–™Ð^PPQ]V™ÐLPQ]”PLPQ\Ö”PLÐPQ\–”PMPQ\Ö”PMPTQ\ÖPMÐTQ]PMÐTQ]PNYÑ\ÖPNYÑ\ÖPN]Ñ\VPNQ\”PMÐ”Q[Ö™ÐMÑ[ÐLÈ‹™[™[ZY\ËLËMŽˆ”ÐTQP”™ÐT”]ÑUÔYÑV”PQXÔÑYÑY”QZSÝÑZ˜PP˜™ÐQÙPQ‘YÑSÙÐ[]ÐT]ÐRQTQSÓÔP[˜YÐXÑÑT“ÐP[ØYÐYÑU“™Ð\X]ÐYÝÑXS”P\˜]ÐYÐÙÑXÓP\Ø]Ð[ÔQY“]Ð]YÐ[ÐÐQZYÐ]”P]PÑZSTP]VP^™ÑZÓPP]–P^P”Q[SÐ]ÖP^Q[ÓÐ^VPL]Ñ™PLPYÑ™–YÐM]ÑPPYÒP›QPVTQÙPTQP›ÑPVŽPQÚTPP›ÙÑPPXRPPQÚTPP›ÝÑPPT˜ÖR\ÐPQUÑÔPÓTPP‘šÐZ]ÑPPT•XR[ÐPQU‘ÝÐÓTQP‘^ÐZQPT’XÐR]ÐYÑT’PÓPTSP‘ÐZ”QQTMÐR]ÐQSPÓTVPÐÐZ”QRTVXRN‘ÝÑÔPTœÐšÔQXV’P‘ÝÑÕTœÐšÝÑXPV•P‘ÙÑÕT›Ð›QVV˜Ð‘ÔQÖT™Ð›PQVPV˜Ð‘ÐQÖT˜Ð›ÑVV˜Ð‘ÑÕÐT–P›ÑUÐV–P‘”QÕÐT•P›ÑUV•P‘QUÒÝÐŠÑQUÓPŽQQU“PŽQU“Ð‘]ÑUÓÐQYÑUÓTPŒ‘YÑUÓ]Ðž‘YÑUÓ]Ðž‘TQUÓ”PÑTQUÓÐQTQUÓÙÐœÑPQVÝÐœ‘PQUÔPœQPQUÔÐ›ÑPQUÔ]ÐšÑPQUÔ”PšQÑUÔÙÐ™QÑUÔÙÐ™QÑUÔÙÐ™‘ÑUÔÙÐ™ÑÑUÔÙÐ™ÑÑUÔÝÐ™ÑÑVÝÐšÑVÝÐšQÑVÝÐ›QÑVP›QÑUÕP›ÑÑUÕPœÑUÕPœQÑVPœ‘ÑVÝÐÑVÝÐQÑVÝÐQPQVÝÐ‘ÑVTÝÐ‘ÑVTÙÐÑPQVTÔPžPQV”ÐPžQPQV”Ðž‘TQV”™ÐŒTQXTPŒ‘YÑXT]Ð’š”QPS’P‘ÌPTÛÎPÜÔÐTžQ]TPTP\Q]ÑXÔPP“ZÙÑPRžP’ŽU“PPÖUPTŽ
ÐQM•TPZÑQZSÙÐP”P”[ÑPRZP™YÐPÐUÐVVTPYQ™Ñ[YÑPR˜Ð™\ÐPšÖPVZTPUÔQÛÙÑPQT›Ð™M•PPLPV[PTPR‘ÝÑŽQŽQŽÑŽÑŽPQŽTQŽ]Ñ’”QRÑÐQŒÓQŒPQžTQžTQžTQžSPQž“ÑŒSQQRÙÑÒÔQŽRÐQŠÒÑM–”P’™ÑM–™ÐR”QMÖÐKÒQMØPPJÒ]ÑNPPJÒYÑNTPNRTQN]ÐMÒPQNPM’ÑNPMRÑN”PMÑNÐR™YÐ\’QNTP\ÒQMÙTP\ÒQMÙTP\ÒQMYTP\’QMPP\ÑÝÑMTP\‘ÝÑLÙPP\ÑÙÑLÙÐ]ÔQMÐ]ÔQLÙÐ]ÐQMÐ\ÑÐQLÙÐ\ÑÑMÐ\ÑÑLÙÐ\Ñ™ÑMÐ\Ñ™ÑLÙÐ\‘”QLÙÐ\‘”QL™Ð\QQL™Ð\‘]ÑL™Ð\QYÑLPP\YÑ^™PP\YÑ^YPP[ÑTQ^YPP[ÑPQ^PP[ÑÑ]ÙPP\‘Ñ]™PP]Ñ]™Ð]ÑQ]™Ð^QQ]YÐ^‘Q\ÙÐLQQ\ÙÐLÑQ\ÙÐLÐÝÑ]ÐMQ\ÙÐMPÝÑ]ÐMÝÑ]ÐMÝÑ]ÐMÝÑ]ÐMÝÑ]ÐM‘Q\ÙÐMQQ\™ÐMPQ[™PPLˆ‹™[™[ZY\ËLËMHŽˆ”ÐTQP”™ÐT”]ÑUÔYÑV”PQXÔÑYÑY”QZSÝÑZ˜PP˜™ÐQÙPQ‘YÑSÙÐ[]ÐT]ÐRQTQSÓÔP[˜YÐXÑÑT“ÐP[ØYÐYÑU“™Ð\X]ÐYÝÑXS”P\˜]ÐYÐÙÑXÓP\Ø]Ð[ÔQY“]Ð]YÐ[ÐÐQZYÐ]”P]PÑZSTP]VP^™ÑZÓPP]–P^P”Q[SÐ]ÖP^Q[ÓÐ^VPL]Ñ™PLPYÑ™–YÐM]ÑPPYÒP›QPVTQÙPTQP›ÑPVŽPQÚTPP›ÙÑPPXRPPQÚTPP›ÝÑPPT˜ÖR\ÐPQUÑÔPÓTPP‘šÐZ]ÑPPT•XR[ÐPQU‘ÝÐÓTQP‘^ÐZQPT’XÐR]ÐYÑT’PÓPTSP‘ÐZ”QQTMÐR]ÐQSPÓTVPÐÐZ”QRTVXRN‘ÝÑÔPTœÐšÔQXV’P‘ÝÑÕTœÐšÝÑXPV•P‘ÙÑÕT›Ð›QVV˜Ð‘ÔQÖT™Ð›PQVPV˜Ð‘ÐQÖT˜Ð›ÑVV˜Ð‘ÑÕÐT–P›ÑUÐV–P‘”QÕÐT•P›ÑUV•P‘QUÒÝÐŠÑQUÓPŽQQU“PŽQU“Ð‘]ÑUÓÐQYÑUÓTPŒ‘YÑUÓ]Ðž‘YÑUÓ]Ðž‘TQUÓ”PÑTQUÓÐQTQUÓÙÐœÑPQVÝÐœ‘PQUÔPœQPQUÔÐ›ÑPQUÔ]ÐšÑPQUÔ”PšQÑUÔÙÐ™QÑUÔÙÐ™QÑUÔÙÐ™‘ÑUÔÙÐ™ÑÑUÔÙÐ™ÑÑUÔÝÐ™ÑÑVÝÐšÑVÝÐšQÑVÝÐ›QÑVP›QÑUÕP›ÑÑUÕPœÑUÕPœQÑVPœ‘ÑVÝÐÑVÝÐQÑVÝÐQPQVÝÐ‘ÑVTÝÐ‘ÑVTÙÐÑPQVTÔPžPQV”ÐPžQPQV”Ðž‘TQV”™ÐŒTQXTPŒ‘YÑXT]Ð’š”QPS’P‘ÌPTÛÎPÜÔÐTžQ]TPTP\Q]ÑXÔPP“ZÙÑPRžP’ŽU“PPÖUPTŽ
ÐQM•TPZÑQZSÙÐP”P”[ÑPRZP™YÐPÐUÐVVTPYQ™Ñ[YÑPR˜Ð™\ÐPšÖPVZTPUÔQÛÙÑPQT›Ð™M•PPLPV[PTPR‘ÝÑŽQŽQŽÑŽÑŽPQŽTQŽ]Ñ’”QRÑÐQŒÓQŒPQžTQžTQžTQžSPQž“ÑŒSQQRÙÑÒÔQŽRÐQŠÒÑM–”P’™ÑM–™ÐR”QMÖÐKÒQMØPPJÒ]ÑNPPJÒYÑNTPNRTQN]ÐMÒPQNPM’ÑNPMRÑN”PMÑNÐR™YÐ\’QNTP\ÒQMÙTP\ÒQMÙTP\ÒQMYTP\’QMPP\ÑÝÑMTP\‘ÝÑLÙPP\ÑÙÑLÙÐ]ÔQMÐ]ÔQLÙÐ]ÐQMÐ\ÑÐQLÙÐ\ÑÑMÐ\ÑÑLÙÐ\Ñ™ÑMÐ\Ñ™ÑLÙÐ\‘”QLÙÐ\‘”QL™Ð\QQL™Ð\‘]ÑL™Ð\QYÑLPP\YÑ^™PP\YÑ^YPP[ÑTQ^YPP[ÑPQ^PP[ÑÑ]ÙPP\‘Ñ]™PP]Ñ]™Ð]ÑQ]™Ð^QQ]YÐ^‘Q\ÙÐLQQ\ÙÐLÑQ\ÙÐLÐÝÑ]ÐMQ\ÙÐMPÝÑ]ÐMÝÑ]ÐMÝÑ]ÐMÝÑ]ÐMÝÑ]ÐM‘Q\ÙÐMQQ\™ÐMPQ[™PPLˆ‹™[™[ZY\ËLËMˆŽˆ–PSPR–]ÑT™PS]ÑY‘ÝÑS–]ÐZÑUVPZ”QV]ÐZ‘]ÑXVPZÚYÑPPZP’ÑPSP’QÐPSÎ’[SÎ’LMSTL’›S]ÝÐ’ÑS\Ð’ÛS™ÜÐ’Ì]ÐSÝÛÐ“œÐTZÐ“ÐTÚÐ“[ÐTPYÐ“QšÐTTYÐ“U™ÐT]ÙÐ“U™ÐT]ØÐ“LYÐTXÐ“LYÐT”XÐ“‘™ÐT™ØÐ“‘™ÐT™ØÐ“‘–PTÔXÐ“••PTÙØÐ‘ÐÒPQÛPTÝØÐ‘šSPQÕMUYØÐ‘”ÔPQÑ[ÐUØÐ‘”ÔPQÑZÐUÐYÐ‘^UPQŒPUÝÙÐ‘ZUPQŒPVZÐ‘TÕPQŒPVÚÐ‘UPQŒPVYÛÐ‘UPQžŽV\Ð‘ÕPQžV”LÔÕPQžŒVšP”ÕPQžŒVšUP™šUP™šUP™žUP™ÐQZÐVRP’QÑTÔPšQZVVP’]ÑVÝÐ’YÑVSÝÐ’YÑVÝÐ’TQVTPRTQVÝÐ’PQVSÝÐ’PQVSÙÐ’ÑVSÙÐRÑVSÙÐRÑVSÔPRÑVSÐP’QVSÐ’QV“™Ð’QV“™ÐQÝÑVS”PÙÑV“”PœQÔQV“Pœ‘ÔQV“]ÐœÑÐQV“]ÐœÑÐQV“YÐÑV“YÐÑVSTPQ™ÑV“TPQ™ÑV“PP‘”QV“ÐÑQV“ÐžQ]ÑV“ÐžQ]ÑVSPž‘YÑV“PŒQYÑVSPŒQTQV’ÝÐŒÑPQV’ÝÐŒÑÑV’ÝÐÑXRÙÐQÑV’ÙÐQÑV’ÔP‘ÑVRÔP‘QV’ÔPÑQVRÐPŽQQVRÐPŠÑQVÐP‹ÑQVRÐPÐPT]Ð‘žYÐYÔQSPT˜ÛÐRQP‘QVÐPÑT]Ð‘žYÐZQSPT–[ÐRTP‘QUÒÐPÑT\Ð‘žYÐZQST˜ÜRUPÝÑVÔPÑT\Ð‘žZÐZÑST˜ÜPRVPÝÑVÝÐÑÐT]Ð‘š[ÐZPQST™ÜQ™QTP]ÑQVÝÐ–QPSP]Ð‘ž]ÐU›ÕPQSPT™ÜÐQ˜QÐTP]‘QVSP•ÚÑPSPL‘ÐÌU›ØÐPÎTšÝQ˜RTP]QQXSP–YÑPSL’ÌUÒ\ÐPÝÓÐVSTP\QÑZ™ÑPRÔM™[ÎPÙÔVTPTP[‘ÑŽZÔQPRšP™–’PPÕTPV•TPZTQŠÛÑPRP’P™œÐPŽÐV
ÖPTPY]Ñ‹ÛTQPQÞP™[ÐPšÕV
ØPTPVQ™Ñ‹Û]ÑPQšÐ™]ÐP”VPV
ÙTPTÙÑŽ[ÐQPPÔÐ™’ÒPPRÛTPP’ÑÒÑ’TQRQŒÒQŒÒ]ÑRYÑ’TQŽÑŠÒÑ‹ÒQÐT›Ð”QÐTZÐ”ŒTT™Ð”TP˜Ð”TP”ŽTP”ÐPT”P”ÑPT“P”ÒPSÞP”ÓPSÔ’P”ÔPSÐ‘P”ÕPSžP”ÖPSšP”ÌSÎ”ÌSÎ”ÌSÍ”ÌSÌ“ÛLSÌ“ÕÝÐSÝÐ“Û]ÐSÜÐ“Û]ÐSÜÐ“ÕÝÐS[Ð“ÕÝÐS[Ð“ÑÝÐSZÐ“ÕÝÐSZÐ“ÑÝÐRÝÙÐ“ÑÝÐRÝÙÐ“ŒÐRÝØÐ“ŒÐRÙÖP“ŒÐRÙÖP“›LRÔUP“›]ÐRÙÔP“‘ÌRÐTP“[LRÐSP“[LRÐRP“[]ÐRÝÑP“UÝÐSQP“QÜÐSPPP“QÜÐSYÐP“\ÐSPP“\ÐS”PP“ÛÐSÐP’Ì›ÐSÐPP“ÛÐSÔPP“ÛÐSÙÐP“ÛÐSÙÐP“ÛÐSÙÐP“ÛÐSÝÐP“ÛÐSÝÐP“ÛÐSÙÒP’Û]ÐSÐTP’ŒŒS”UP’•ÎS]ÏOH‹™[™[ZY\ËLËMÈŽˆ–PSPR–]ÑT™PS]ÑY‘ÝÑS–]ÐZÑUVPZ”QV]ÐZ‘]ÑXVPZÚYÑPPZP’ÑPSP’QÐPSÎ’[SÎ’LMSTL’›S]ÝÐ’ÑS\Ð’ÛS™ÜÐ’Ì]ÐSÝÛÐ“œÐTZÐ“ÐTÚÐ“[ÐTPYÐ“QšÐTTYÐ“U™ÐT]ÙÐ“U™ÐT]ØÐ“LYÐTXÐ“LYÐT”XÐ“‘™ÐT™ØÐ“‘™ÐT™ØÐ“‘–PTÔXÐ“••PTÙØÐ‘ÐÒPQÛPTÝØÐ‘šSPQÕMUYØÐ‘”ÔPQÑ[ÐUØÐ‘”ÔPQÑZÐUÐYÐ‘^UPQŒPUÝÙÐ‘ZUPQŒPVZÐ‘TÕPQŒPVÚÐ‘UPQŒPVYÛÐ‘UPQžŽV\Ð‘ÕPQžV”LÔÕPQžŒVšP”ÕPQžŒVšUP™šUP™šUP™žUP™ÐQZÐVRP’QÑTÔPšQZVVP’]ÑVÝÐ’YÑVSÝÐ’YÑVÝÐ’TQVTPRTQVÝÐ’PQVSÝÐ’PQVSÙÐ’ÑVSÙÐRÑVSÙÐRÑVSÔPRÑVSÐP’QVSÐ’QV“™Ð’QV“™ÐQÝÑVS”PÙÑV“”PœQÔQV“Pœ‘ÔQV“]ÐœÑÐQV“]ÐœÑÐQV“YÐÑV“YÐÑVSTPQ™ÑV“TPQ™ÑV“PP‘”QV“ÐÑQV“ÐžQ]ÑV“ÐžQ]ÑVSPž‘YÑV“PŒQYÑVSPŒQTQV’ÝÐŒÑPQV’ÝÐŒÑÑV’ÝÐÑXRÙÐQÑV’ÙÐQÑV’ÔP‘ÑVRÔP‘QV’ÔPÑQVRÐPŽQQVRÐPŠÑQVÐP‹ÑQVRÐPÐPT]Ð‘žYÐYÔQSPT˜ÛÐRQP‘QVÐPÑT]Ð‘žYÐZQSPT–[ÐRTP‘QUÒÐPÑT\Ð‘žYÐZQST˜ÜRUPÝÑVÔPÑT\Ð‘žZÐZÑST˜ÜPRVPÝÑVÝÐÑÐT]Ð‘š[ÐZPQST™ÜQ™QTP]ÑQVÝÐ–QPSP]Ð‘ž]ÐU›ÕPQSPT™ÜÐQ˜QÐTP]‘QVSP•ÚÑPSPL‘ÐÌU›ØÐPÎTšÝQ˜RTP]QQXSP–YÑPSL’ÌUÒ\ÐPÝÓÐVSTP\QÑZ™ÑPRÔM™[ÎPÙÔVTPTP[‘ÑŽZÔQPRšP™–’PPÕTPV•TPZTQŠÛÑPRP’P™œÐPŽÐV
ÖPTPY]Ñ‹ÛTQPQÞP™[ÐPšÕV
ØPTPVQ™Ñ‹Û]ÑPQšÐ™]ÐP”VPV
ÙTPTÙÑŽ[ÐQPPÔÐ™’ÒPPRÛTPP’ÑÒÑ’TQRQŒÒQŒÒ]ÑRYÑ’TQŽÑŠÒÑ‹ÒQÐT›Ð”QÐTZÐ”ŒTT™Ð”TP˜Ð”TP”ŽTP”ÐPT”P”ÑPT“P”ÒPSÞP”ÓPSÔ’P”ÔPSÐ‘P”ÕPSžP”ÖPSšP”ÌSÎ”ÌSÎ”ÌSÍ”ÌSÌ“ÛLSÌ“ÕÝÐSÝÐ“Û]ÐSÜÐ“Û]ÐSÜÐ“ÕÝÐS[Ð“ÕÝÐS[Ð“ÑÝÐSZÐ“ÕÝÐSZÐ“ÑÝÐRÝÙÐ“ÑÝÐRÝÙÐ“ŒÐRÝØÐ“ŒÐRÙÖP“ŒÐRÙÖP“›LRÔUP“›]ÐRÙÔP“‘ÌRÐTP“[LRÐSP“[LRÐRP“[]ÐRÝÑP“UÝÐSQP“QÜÐSPPP“QÜÐSYÐP“\ÐSPP“\ÐS”PP“ÛÐSÐP’Ì›ÐSÐPP“ÛÐSÔPP“ÛÐSÙÐP“ÛÐSÙÐP“ÛÐSÙÐP“ÛÐSÝÐP“ÛÐSÝÐP“ÛÐSÙÒP’Û]ÐSÐTP’ŒŒS”UP’•ÎS]ÏOH‹˜[Y\ËLLŽˆ”ÐPRTQST]ÑS”ÑPÔYÐSTQQTYÐSTQT•ÙÐQ”QTÕ™ÐSÝÑU•TPUSÝÑ\ÓÙÑ]ÙÑ]ÔQ\ÓÔQ\“Ñ\Ó”Q]Q]]Ñ]™ÑP“YÐ]R”QQ“TP]RQRSPP^PQS“Ð^’Q‘ÒQ’RQ’’Q’’PQ’RTQ’YÑ’TQ’RÑ“Q“‘ÝÑ”ÙÑ”QÔQ”‘ÐQ“PPPÑÐQ“ÐQ“ÐQ“ÐQ“ÐQ“QÔQ“ÙÑ’ÒQ’QKÒ”QKÒ”QJÒQJÒ]ÑMVPQ’YÑMVPQRTQMVÐQPQLÑÑKÑ”Q‘TQP‘]Ð‘QTQ‘ÑÑ’‘Q“ÙÑ“PÔQ“ÐQ“Ñ“™Ñ“Ð”Q“ÐQ“]Ñ“YÑ“ÐYÑ”YÑ”YÑ”PYÑ”YÑ”]Ñ“Ð™Ñ“ÔQ’PÙÑ‘ÐÝÑ‘QQ‘ÑQTQNQQMQQMQQMQ]ÑM•ÐQ‘]Ñ‘Q]Ñ‘‘]Ñ‘Ñ]Ñ’]Ñ’Q]Ñ’‘]Ñ’Ñ]Ñ’Ñ]Ñ’Ñ]Ñ’ÑQ’‘Q’‘Q’‘”Q’”Q’Q’Q‘ÑQ‘‘Q‘QQ‘QÑQ‘Q‘”QQ”QQ”Q‘QÑYÑ‘‘TQ‘ÑPQ’QÑ’ÑÑ“Q“QQ“ÝÑ“ÐÝÑ“ÐÙÑ\”PZÐÔQ\ÐZPÔQ[“ÔPZÔQ[SÙÐZÔQ[ÝÐYÐÔQZÔPYÐQ[PYÐQZÔPYÑZÔPY™ÑZÓÝÐY”QZÔPY”QZÔPY”QZ”PXÐ”QZTÐX”QZÐXPQZPPV]ÑYÔTPVYÑYÔYÐVPYÑY]ÐVTQVQÙÐP”]ÐXTQV]ÐYPQVPYÐPQUÔ”PYÐPQUÔPZPPQUÔPZPPQV]ÐZÐPQVTPZPQV”PZPQV”PZPPQV”PZPQV”PYÐPQV”PYPPQV”PXÐYÑUÔ”PVH‹˜[Y\ËLLHŽˆ•ÐRTÝÑSÙÑSQQÔPS]ÑT”]ÑTPP”YÑT•ÝÐP–PSYÑTUÔPTÔTQUUÐPU”TQ]TQ]PQ]PQ\TPQ\Q\”Q\“ÔQ]ÐQ]SÐQ]ÝÑQSÐ]RÙÑR™Ð]’ÔQR“”P^’™ÑS“PL’]Ñ’’YÑ“TQ“’PQ”PQ”RTQPÒP“’Ñ’ÒÐQ’’”Q“RQ“’]Ñ“ÒYÑ”TQ’X™ÐQPQ’’PQ’ÒPQ’ÒÑ“Ñ“RÑ“RÑ“RÑQRÙÐSQNSQJÒÝÑJÒÙÑMPQRÙÑLÖPQÐQLÖPQÑLÒ™ÑLÑÝÑÑÔQ‘Q™Ñ’QQ’ÑYÑ“QPQ“ÑÑ”Q”PÝÑ”PÙÑ”PÔQ”PÔQ”PÐQ”Ñ”Ð™Ñ•P™Ñ•P™Ñ•P™Ñ•P™Ñ•PÑ•ÔQ”‘Q“ÑÑ“PQ’‘TQ’QYÑ‘Ñ]Ñ‘ÑÑP‘ÔPQÙÑKÑÔQQÔQÑÔQ‘VPPQ‘ÔQ”ÐQ”‘ÐQ”ÑÐQ•ÐQ•QÐQ•‘ÐQ•ÑÐQ•ÑÐQ•ÑÐQ•ÑÐQ•ÑÐQ•ÑÑ–Ñ•ÑÑ•Ñ™Ñ•Ñ™ÑNPV™ÑNUÔPT‘™ÑJÖPS‘™ÑKÖPS™ÑVÐRQÑ–YÐPÑÑÑÑ‘ÐQ‘ÐQ‘QÑ‘Ñ™Ñ’”Q’‘Q’Ñ]Ñ“QYÑ“‘TQ“ÑPQ”QÑ”‘Ñ”‘Ñ”ÑÑ\”PZÑÑ\TÐZÝÑ\”PPZÙÑ\”TPYÐÔQ\”YÐYÐQ\”YÐYÑ\”YÐY™Ñ\”YÐYQ\ÔYÐY]Ñ\ÔYÐY]Ñ\”YÐYPYÑ\TYÐYPQ\”]ÐXÐPQ\TPXPQ[Ô”PXPPQ[T™ÐVPQZÔÐVPPQXQÝÐP”ÔPVPQVTÔPVTQUÔÔPVTQU”ÙÐVPTQUTÙÐXYÑUTÙÐXÐYÑUÔPYÐ]ÑUTÔPZ]ÑU”ÙÐZ]ÑUÔÔPZQU”ÙÐZ”QUTÙÐZP™ÑUTÙÐZÑTÔÙÐYÐÐQTTÙÐYÙÑSÙÐY‹˜[Y\ËLLˆŽˆ•ÐR•QSÝÑST”QT””QT”QT–ÐS]ÑTÕÝÐTT]ÑUÔPUÔ]Ñ]YÑ]TYÑ]TYÑ\ÔPQ\ÔÑ\ÔQ]ÝÑ]SÙÑ]SÔQ]RÙÑQSÐP“ÐP]’ÔQRS™Ð]ÒÔQRÓ”PLR™ÑSÓ”PLÒQ’’]Ñ“YÑ“’TQ”TQ”RYÑP’™Ð“RÑ“Ñ“”Q“’Q“Ò]Ñ”TQ’˜]ÐRPQ“ÐQPQ“ÐPPÒPQ“Ñ“RÑ“RÑ“RÑ“RÑPÒÐP‘ÔQÒÐQ‘Ñ‘Ñ‘™ÑJÖ”PQR™ÑN”PQ”QMÖ”PPÒ]ÑNPQJÒQ‘ÐQ‘ÑQ’Ñ]Ñ“YÑ“QPQ“ÑÑ”Q”ÝÑ”PÙÑ”PÔQ”PÐQ”Ñ”PÑ”™Ñ”P”Q”Ð”Q””Q”Q”ÐQ”Ð”Q”™Ñ”ÙÑ“Ñ’Ñ‘ÑPQ‘‘YÑÑ™ÑJÑÝÑMÝÑMÝÑLÑÝÑLÑÝÑL’QLRQLQLQLQ^’QLÑ^’Ñ^RÑ^’Ñ^RPQ^PQ^PQ^TQ^PQ^’PQLPQLRPQLÒÑMRÑM’ÑNQJÒQQÝÑÑÔQ‘‘ÐQ’™Ñ’‘”Q“Q“Q]Ñ“‘YÑ“ÑTQ”PQ”QÑ”ÑÑ\ÓÝÐ[‘Ñ\”P[Q\TÐ[Q\PPZ‘Q[ÔTPZQQ[”YÐZQ[TYÐZÝÑ[”]ÐYÐÙÑ[”]ÐYÐÔQ[”PYÐQ[”PYPÑ[”PYPÑ[PYPÑZÔPY™Ñ[PY™ÑZÔ”PYP”QZ””P\PQZ”™Ð\P]ÑZ”ÐP\YÑZTÙÐ[YÑXRPQUP[TQXUP[PQXUPZÐPQVUPZPQVUÐZPQVUÐYÐPQV•ÐYPQXUÐYPPQXÕÐYTQXÕÐXÐYÑXÕÐXP]ÑX•ÐVQXUÐV”QV•ÐUÐ™ÑVUÐUÔQUUPPTÝÑT•TPRˆ‹˜[Y\ËLLÈŽˆ•PPRUQSUQST™ÑPÔÝÐST”QQTÙÐSTQTÔQT–ÐS]ÑTÕÝÐU]ÑUUÐPVYÑ]”YÑ]”YÑ]TTQ]TQ\”Ñ\ÔQ]Q]ÝÑ]ÔQ]’ÝÑQÓÐP]’ÙÑRSÐP]ÒÙÑRÓÐ^’ÑP’ÔPSS™ÐL’Q’Ò]Ñ“RYÑ“ÒYÑ”]Ñ”ÐQ“ÔQ’ÒÑ“RQ”]Ñ”RYÑ”’TQ”ÒTQ’ØÐQRPQ“XÔPP’PQ“RÑ“ÒÑ“ÒÑ“ÒÑ“ÒÑQÐP‘’PQP“PSÑJÓÑNSQJÓQM”PQÒÝÑM™ÐQRÙÑM™ÐQÔQMÑM’YÑKÑÝÑ‘‘ÔQ’”Q“]Ñ“‘YÑ“ÑPQ”Ñ”Ñ”Q”Q”ÝÑ”ÙÑ”ÔQ”ÔQ“ÐÐQ”Ñ”Ñ”Ñ”™Ñ”ÐÑ”PÐQ”Ñ’‘PQ‘ÑTQ‘‘TQ‘QYÑ‘QQÑP‘ÝÐMQÝÑM‘ÙÑMÑÙÑNUÙÐRQÙÑ’ÑÙÑ’ÑÙÑ“QÙÑ“‘ÙÑ“‘ÙÑ“ÑÙÑ“ÑÙÑ“ÑÙÑ”ÙÑ“ÑÙÑ”ÙÑ“ÑÙÑ“ÑÝÑ“QÙÑ“‘ÙÑ“QÙÑ“QÙÑ“ÙÑ’ÑÙÑM™ÐS‘ÙÑMÐPRÑÙÑMÝÐQ‘ÔQMÙÑMÔQM‘ÐQN™ÑJÑQ‘]Ñ‘YÑ‘QTQ‘ÑPQ’PQ’Ñ’QÑ’‘Q’ÑQ“Q“Q\™ÐZÝÑ\ÐZPÔQ\SÐPZPÐQ\SÔPZÑ\SÙÐYÐÑ\ÙÐYÐÑ[ÓÙÐYÐ™Ñ[“ÙÐYÐQ[ÓÙÐYÐ]Ñ[ÓÙÐYYÑ[ÓÙÐYPTQ[ÓÝÐYTQ[“ÝÐYPQ[TPYPQZÔPXÐPQZÐXPQXTÐXPPQVTPPXPPQVYÐVTQU”YÐXTQU”]ÐYPYÑUT]ÐZYÑUÔPZYÑV]ÐZYÑVT]ÐZÐ]ÑVT]ÐZÐ]ÑVT]ÐZÐQV]ÐZÐ”QUÔ]ÐZÐ™ÑU”]ÐZÑU]ÐZÔQSÔ]ÐYÔQY”QXH‹˜[Y\ËLMŽˆ•PR•YÑSTQSUPQSUQPÕÐSTÝÑTÙÑTV]ÐSÔÙÑTVPPUÔQ\ÔÔQ\ÔÐQ]ÐQ]Ñ\”Ñ\T”Q\”YÑ]TQ]TPQ]TÑ]TÑ]”Q^”QL“ÑRSÝÐMQS“ÝÐMRÝÑ“ÐQ“ÒÑ”’™Ñ”Ò”Q•R”Q•’™Ñ•SQ““Ñ“RÝÑ”RÙÑ”’ÙÑ’PPPÒÔQ’RÑ“™Ñ“R™Ñ“’™Ñ“’™Ñ“R”Q“’”Q“’”QQSTP’™ÑP“YÐS]ÑJÓTQSPQM˜]ÐQ“ÑM˜PQÑM˜”PP’ÝÑNQÒ]Ñ‘PQP’YÐ‘RÑ’RQ’’Q’ØYÐR‘ÙÑ“XPPSQÔQ“VÐSÑÐQ™‘Ñš™Ñ“–”PU”Q“VPUQQ›Q›Q]Ñ›‘YÑ›ÑYÑ›ÑTQœTQœTQœPQœÑœQÑœÑ›ÑÑ›ÑÑ›ÑÑ›‘Ñ›‘Ñ›ÑÑR’PS’ÝÐ“QÑRRÐSRÝÐ“‘ÑQÒÐRÒÝÐ“‘PQQR]ÐP’”PQÝÐ“’ÝÑ“’ÝÑ“’ÙÑ“’ÙÑ\PZ’ÙÑ[ÕÐY’ÔQ[ÕÔPXÒÐQ[–ÐUÒÑ[ÖTPP–]ÐQÐSR™Ñ\PPR’”Q]TPRQ^QL]ÑLÒ]ÑMRYÑNTQRPQ‘Ñ‘’Ñ’RQ’ÒQ“QÙÑ”ÐQ”ÑÑ•Q™Ñ•‘”Q–Q–Q]Ñ–‘YÑ˜QTQ˜‘PQ˜ÑÑ™Ñ™QÑ™ÑÑ\ÔÐ]‘Q\ÔYÐ\ÑQ\Ô”P\Q\TÙÐZÑQ[ÕPZQQ[•PZQ[UÐYÐÝÑ[UÐYÐÙÑ[UÐYÐÔQ[UÐYÐÔQ[ÐYÐQZÕÐYÑ[ÐYPÑZÕPPYÑZ•TPY™ÑZ•YÐXÐ”QZUPXP”QZ”PVQY•ÐVQXUÐPV]ÑV•ÐPVP]ÑVUÔPVPYÑVUÔPXTQVUÔPYTQVÔPYTQVÐPZPPQV•ÐPZPQXUÐPZPQX•ÐPZPQX•ÐPZPQX•ÐPZPQXÕÐPZPQX•ÐPZTQXUÔPZPTQV•ÙÐYÈ‹˜[Y\ËLMHŽˆ•ÐPS”QS•QSUÑQ]ÐS•QTÕQUPPP”ÝÑU™ÐTÝÑ]ÙÑ]”ÙÑ]ÔÙÑ]ÔÔQ]”ÔQ]TÐQ]Ñ]”Q]T]Ñ]”YÑ]”TQ]”PQ]”ÑLYÑRTÐMTQRÔÐMSQ“ÝÑ“ÒÔQ”’ÐQ•ÐQ•RÐQ•RÐQ•“Ñ“ÓÑ“ÓQ”SQ”’ÝÑ’ÙPPQ’ÙÑ“YÐPÒÙÑ“RÔQ“ÒÐQ”ÐQ”Ñ”[ÑPP”ØÐ•R•PPV[PU‘ÕPTPR’™ÑRÓ]Ð‘ÝÑPPÚXÐ‘PTR“PP[ÌPUPÔÐTPS]ÑšÙÑPPÞ’P“ÌP–‘PP]ÝÐUPTÔPTPS’ÝÑZÐQPQÕP”–NPMÐU[SÐTPTQ“Z”QPQÐ•ÌPNPUÓPTPTQÔQ”šQPQP–PT™ÐU[ÜÐP‘UU•ÓTPTQ”Q•˜ÐSÚPQPQ^PšÑUVYÐ‘YÑÒÐT‘Pš]ÑTPVL‘PQÓTNš™ÑSÐVN‘ÑÔTLšÑSPVP‘QÔT\ÐšÐQSPVM‘QÓT]ÐšQSPTÐQÜÓPTŒÐQÛÓPTUXPPMÐQÚÓPTSXP]ÜÐQÖXT]ÜÐQŒ’ÐTPP’QSP•YÔQPP”ÔÝÐSÌœÐQPÐPš]ÐSQŒP›‘PPžTPTÝÐSÝÐ“ÜÐ“ÜÐ’Þ[Ð’ÞZÐ’ÞYÐ’ÞYÐ’ÚXÐ’ÞVP“ÕP“UP“ZTP“”ÓP“ÐÓP“ÞQP”TÐP”Ž”š”ÐŒ”ÚÐ•›Ð•Ð•T˜Ð•–P•šP•žP•Ð“P•Ô’P•ÞP–P–P–N–Í–Ì“ŽSÌ“ÒPSL“UPRÔ]Ð“XÐRÝÐ’ÚÛÐR”\Ð’ÕLRYÜÐ’ÑMRT[Ð’ÑMRTZÐ’ÕMRPYÐ’ÑMRPYÐ’ŒRPXÐ’ŒRØÐ’šÎRÖP’›PRVP’•‘PRUP’•’PQÝÕP’‘“PQÙÔP’LUPQÐTP’TPPU–PQÓP’–PQÒP‘ÛPQÐRP‘Õ–PQÔRP‘Ñ˜ÐQÔQP‘Ñ˜ÐQÝÑP‘Ñ˜ÐRÐP‘Õ–PRTPP‘Õ–PRYÐP‘Õ–PR]ÐP‘ÛPRPP‘ÌVPR”PP‘ÌVPR”PP‘ÌVPR”PP‘ÌVPRPP‘ÌVPRPP‘ÛÐR]ÑP‘Ñ™ÐRTOOH‹˜[Y\ËLMˆŽˆ–PRVQR•ÔQSUÐQSU]ÑTUYÑTXÐPPÕTQT˜YÐT•PQUPPU•ÑU–”PV•Ñ]ÕÑ]ÕÑ]•Ñ]Ñ]Q]Q]Q\ÔÔQ]”ÔQ]TÐQ]”Ñ]™ÐPÔ”QLTQLÓ™ÑR”PMSQS”YÐNYÑ““PQ”Ñ”“Ñ”“Ñ•Ñ”ÓQ“ÓQ“Ó”Q““Q“ÓYÑ”STQ’Ù”PPÙÐQPPZP”ÞN•Í•Ì•L•L•]Ð•]Ð•]Ð•ÐTZLZšÐTZ™Ð”Z˜Ð”Z–P”PPš–P“ÌÔPP‘P“Û•PPZ‘PUPTÛÐ”ÙÐ””ÖP”ÐÓP”ÞRP”ÞPP•••••Ð•Ð•Ð•Ð•Ð•PšÐ•P™Ð•T™Ð•T™Ð•T™Ð•T™Ð•P™Ð•PšÐÒPTšSP””ÕP”ØÐ”ÚÐTÜÐTTÜÐ”Z\Ð”^\Ð”ÝÐ”^]Ð”^L”ZL”ZL”ZL”ZL”Z]Ð”Z\Ð”^\Ð”^[Ð”^ZÐ”ÙÐ””ÙÐ””ØÐ”žVP”ÐÕP”ÚSP•ÒP•QP•TÐP•^•žÐ•ÔœÐ•ÚÐ–šÐ–™Ð–Ð–P–P•P–T”P–ZP“ØÐSP“P“ÝÐRÞP“ÍRÔ’P“‘PPU“PR”‘P“”PR‘P’ÌVPRZP’ÛÐRTP’Õ˜ÐRTN’Õ˜ÐRTN’Ñ˜ÐRTM’Ñ˜ÐRTL’Ñ˜ÐRP]Ð’Ñ™ÐRÝÐ’ŒZÐRÜÐ’Œ[ÐR\Ð’›ÐR[Ð’›ÐQÝÚÐ’›QÙÙÐ’•ŒQÙØÐ’‘QÔXÐ’QQÔVP‘ÚQPPUŽQÐTP’ÐPQÔSP’ÐPQÝÓP‘ÌPRRP‘ÛRÑP‘ÌNRPQP‘ÛRTPP‘ÌNR]ÐP’ŽR]ÐP‘ÌNR]ÐP‘ÌNR]ÐP’ŽR]ÐP‘ÌNR]ÐP‘ÌPRTQP‘ÑÑPRÏOH‹˜[Y\ËLMÈŽˆ”ÙÐR”ÐQSÑS™ÑSPQQ”PSÑT–PRTÑT•ÙÐSTÑUÐTÔÑ]Q]”Q]TQ\ÔQ\“ÝÑ\“ÙÑ\“Ñ]S™Ñ]S”Q]SQ]“]Ñ]ÒÝÑPÓ]Ð^ÔQQ“YÐ^’QSSTPLR]Ñ‘’PQ’ÒÑ“’Q”Q”RÑ”]Ñ“”Q’’”Q’’YÑ“RTQ“’PQ‘˜TPQ’Ñ’XPPÒQ’ÒQ’ÒQ“Q“ÝÑ“QÝÑ“QÝÑ“QÝÑQR™Ð’ÔQJÒÐQJÒÑKÒ”QM–PPQ’QM–PPQRQMVTPQ]ÑM]ÑMÙÑQÑ‘Q‘ÑTQ’ÑÑ“QQ“‘Q“ÝÑ“ÔQ“ÐÐQ”Ñ“Ð™Ñ””Q””Q”Q”PQ”Q”P]Ñ”YÑ•]Ñ”Ð]Ñ”Ð]Ñ”Ð]ÑQPÙÐ“Q’QÑ‘ÑÑ‘‘TQÑQKÑ™ÑNQ™ÑNQ™ÑNUÐPÑ™ÑJÕ”PRQ™Ñ’‘™Ñ’ÑÑ’ÑÐQ’ÑÐQ’ÑÔQ’ÑÙÑ’’Q’Q‘ÒÑ‘’Ñ‘RPQ‘PQ‘Ñ‘Ñ‘ÑÒÑÒÑÒQÒQÑÝÑÑÙÑ‘ÐQ‘‘Ñ’™Ñ’‘Q“Q]Ñ“‘YÑ”TQ”QTQ”QÑ”ÑÑ•Ñ•Q\SÐP\QQ\SÝÐ[ÝÑ\TP[PÝÑ\Ð[ÝÑ\PPZÝÑ[ÔYÐZÝÑ[”]ÐYÐÝÑ[TPYÙÑ[TPYÔQ[TPYÐQ[PYÑ[PYÑZÔPY™Ñ[PY”Q[”PYP™ÑZ”™ÐY”QZ”ÐXQZTÐPXPQZÔPXP]ÑYÔÝÐVP]ÑYPVYÑVUPUÐYÑVUPVPTQVUPXPTQVÐXPQVUPYPPQVUPYPQVUPZPQV•PZPPQXUPZPPQXUPZPPQXUPZPPQX•PZPPQXUPZPPQXUÐYÐTQVUÐY‹˜[Y\ËLKLŽˆ˜PSPQTÖQV–]ÑXÖYÑYVPQZÑZ–Ñ[Q[–Q[ÖQ\UÝÑ\•ÙÑ]ÙÑ]ÙÑ]ÔQ]•ÐQ]ÕÐQ^QRÐP^QNUQNUQNUQNUQNÑMÕÑMÕÑMÕÑMÕÑMÕQNÝÑJÔÙÑKÔÔQKÔÑT™Ñ”™Ñ””QÔQ‘Ñ’Q’SÝÑ’“Ñ““Q”YÑ”“TQ”ÓPQ•Ñ•Q•“Q•’ÝÑ•’ÙÑ•’ÔQ•’ÐQ–Ñ–’™Ñ˜R”Q˜ÒQ™]Ñ™RYÑ™’TQ™ÒTQ™ÒÑšÑšRÑšRQš’Qš‘ÝÑš‘ÙÑš‘ÔQš‘ÐQš‘ÐQš‘ÑšÑ™ÑšÑ”Q›Q”Q›Q›Q]Ñ›‘]Ñ›QYÑ›‘TQ›ÑTQ›ÑPQœQÑœÑÑQÑ‘QQÑQŽPÝÑ‹ÐÝÑÐPT[Ð™ÙÑRVTPÐQÑTYÐšQRPVUPÑÑÐTXÐšÑRVVP™ÑÒTVPšÑQVYÐ™ÑÒTUPšÑQPVXÐQÑÐTSPšÑQVPPNÐVŽP\ÐÐVŽPPYÐÐVPÐVPVPVPVPVÐPVÐPVÐPVÐPVÐPVÐPVÐPVÐPVÐPVPVPVPVPVPVPVPVPVPVPVVVTœÚPQŒÐT™ÚÐPÝPÚÐÐT–[PPÚPÕQT”[PÖ˜PÔQT”[ÐPÔ˜ÐPÓQPT“[PÕ˜ÐPÓQPT“[PPÕ™PÒQT’[PPÓ™PÓQÐT‘[PÔ™PÒRT[PÒ™PÒRT‘[PPÑ™PÑRPT[PÑ™PÑRTNÐPÐ™PPÐSTLÐPYPŽPT]ÚPŒYÐPT\ÚPP›PŒÐT[ÚP›PœÔTXÚPšPšÙÐTšP›ÙTšP›ÙTšPP›ÙTšPPÙTšPTšPÐYT›PÓYÐT›PPÕZT›PPÖZPTœPPØÚTœPPØÚÐT›PPØÛTšPPØÛTšPPØÛPT™PPÖ[ÐT”›PPÔ\PTN[ÐPŒ\T™ÏH‹˜[Y\ËLKLHŽˆ˜ÝÐUÐQV˜ÑX˜™ÑYQZ]ÑZ˜]ÑZØYÑ[XTQ[˜PQ\Ñ\–™Ñ]™Ñ]V”Q]–”Q]–”Q]ÖQ^ÝÑMÕÙÑNÔQNUÔQNUÔQNUÔQNUÙÑNÙÑNÝÑMÕÝÑMÕÝÑMÕÝÑMÕÐQJÕÑJÕ”QKÕQU]Ñ•YÑ•TQÕÑ‘Q‘TÝÑ‘ÔÔQ’Ñ’TQ“]Ñ“TPQ“ÔÑ”Ñ”TQ””Q”“ÝÑ”“ÝÑ”SÙÑ”“ÔQ”“ÐQ”ÓÑ•”Q•“Q–YÑ–SPQ˜SÑ™Q™SQ™’ÝÑ™ÒÙÑ™ÒÐQšRÑš’Q›]Ñ›RYÑ›’TQ›’PQ›’ÑœQœ’Qœ‘ÙÑÔQQÐQ‘™ÑžQ”QŒÐQPP””P™VNP[ÕVYÐ‘YÑÓT‘Pš”QTPVM‘ÑÔPTMšÙÑSV“P‘QÕT]Ð›QSPV”PÝÑÕT[Ð›ÑRV˜ÐÔQÖTYÐ›ÑRPV˜ÐÑÖPTVP›PQQÐV™Ð™ÑŒšQPQÔUP™ÐP“QPVSTPTPQ”QPQSP™V‘PPXÑVÐÐVÐÐVÐÐVÐVVVVVQPPQÐÐTPP™ÝÑPPVTPPQÑTPPšÑPPVXÐPQÒTPPšPQPPVYÐPQÒTPPšTQPPV[ÐPQÒÐTPPšYÑPPV[ÐPQÒÐTQPšTQPVZÐTQÒTRPšPQPÐTœÚÐQÖQTšÛQÖQT™ÜQÒQT˜ÜPQÑQPT•\ÐQŽT“]Q›PÕQÐT’]PÜPÔRT‘]PPÛÐPÓRT‘]PÚÐPÓRPTNÐPÛÐPÓRTMÐPÚÐPÓRÐTLÐPÙÐPÓST]ÜÐPÖ›ÐPÓSPT\ÜÐPÕœPÑST[ÜPÕœPÑSÐTZÜPPÓœPPÐTPTXÜPÓœPPÐTÐTT[ÐPÓœPŽTÒœÐPPTžPŒTžPÚÐTžP›ÚÐTP›ÚÐT›PœÚÐT›PPŒÐT›PPŽÐT›PÓ[TšPÕ[PT›PPØÛT›PPÙÛÐT›PPÙÛÐTœPPÙÜT›PPÙÜPT›PPØÜTšPPÖ\ÐT–žPPÕ]T”žPPÑÕPTPP“ÑT˜ÝÐXÚÙÑPPTOOH‹˜[Y\ËLKLˆŽˆ™PTZÑPPVYÐPQŒT™PTœTŒ]ÐTŽ]TÑPTÓœÐTÖœÐTÙTÛPTÜTÞTÞTÌ[ÐTÍ[ÐTÍ[U›U›U›U˜ÐUUXUXUXUXUXÐUÐUÐUUVUQ•ÐUQ•UQ•PUR•US”ÐUS”UV“UYPUYUYU]ÐU^PULQUMPÐUNPUPU‘PUKÐUJÐUNPUMÐU‘MU‘MPU‘MU’LÐU“LU”LPU•LU˜ÞPUšÞU›ÝÐU›ÝUœÝPUÝUÜPUŽUŽÐUŽPUÑ[UÑZÐUÒZPUÔZUÕYÐUÖYPUÙÙUÙØÐUÚØUÚØPUÛÖUÝÖPUÍVÓTPR™ÑÐT”PšQUVXÐ‘]ÑÒPT’PšYÑTV]Ð‘TQÓPTPš”QTVM‘ÑÔTLšÐQSPV‘P‘QÔT\ÐšÙÑRÐV’PÔQÕTZÐšÙÑRPV’PÐQÔÐTXÐšÙÑQÐVQPTPUP™ÑŒšTQPQÕP™R\ÐP[ÑPVÑVÑVÐVÐVVQPTQÐÐTQP™ÝÑPVSPTQÑPTPPšQPPVXÐPQÒTPPšPQPPVZÐPQÒTPPšYÑPPV[ÐPQÒÐTPPš]ÑPPV\ÐPQÓTPP–PRÝÐP–QPRÙÐP–ÒPRÔPP–ÓPRÔPP•Ì”PRÐPP‘ÞTÕPRÐPP‘ÔÑPSÑÕPRÔQP‘žRPS›VPRÐQP‘šTPSL˜ÐRÒP‘”ØÐSYÐR™ÓP‘^YÐSÚÐR”SP‘^YÐRÛZÐR”TP‘TØÐRÌšÐR”VP‘VPRÌšÐR”XÐ‘UPRÌšÐR”YÐ‘ÕPRÌšÐR”ZÐ‘ÕPRÛZÐR[ÐÞUPRÕÛÐRYÝÐÔÔPRÕÜÐRTLÐÓPRÑÜÐRTNšRPRŒÐRT‘P^QPRŒŒRPÐP’›MR’’PR’’PR’PQÞ’PQÚÐ’PRŒ‘ÖPR‘ÒPRZ‘ÒÐRÐ‘ÖÐR”Œ‘ÒPRž‘ÒPRÐ‘ÖPRÐŽ‘Û•PRÐÐP‘Û•PRÐÑP‘ÖPRžQP‘ÖPRšRP‘ÒPR”ÓP‘ŒÖPR^UP‘’PRTØÐ‘VÐQÙÏOH‹˜[Y\ËLKLÈŽˆ™TPSÑTYQUYQVÙÑX˜ÔQYXÑZ™ÑZØ”Q[XQ[Ø]Ñ\]Ñ\XYÑ\ØTQ]TQ]PQ]–Ñ]ÖÑ^Ñ^Ñ^QMÖQNQNQNQNQNVQNÑMÖÑMÖÑM–ÑM–ÑM–ÑMÕÝÑJÕÙÑJÕÑ•™ÑU™Ñ•”Q•QÕQ•]Ñ•YÑ•Ñ‘•Q‘ÔÔQ’ÔÑ“T™Ñ“””Q“”Q“”YÑ“ÔTQ“ÔPQ”Ñ”Q”ÓÝÑ•SÝÑ•SÙÑ•ÓÐQ–SÑ–“™Ñ˜S”Q˜“Q˜ÓYÑ™STQ™“PQ™“Ñ™ÓÑ™ÓQšQšÝÑšRÙÑšRÐQš’ÑšÒ™ÑšÒ”Q›Q›R]Ñ›RYÑ›’PQ›ÒÑœÑœÑœRQœÑÝÑQÙÑÑÔQžš”QPP”™Ð™šÐ™ÔQUÐVSP‘”QÑT”PšÑUPVYÐ‘]ÑÒÐT’Pš]ÑTV]Ð‘PQÓTNš™ÑSÐVN‘QÔPTLšÐQSPV‘PÝÑÔT[Ð˜ÌÍRÚÐ˜ÍPP›ÒVÐÐTPVÐQŒQPQ™ØÐ™VPP“QÐVRÐTPS™ÑŒšQPPÙÕP™PYÑVÑVÑPVÑPVÑVVVÐVQPYÑÐTRP™ÙÑPVTPTQÑPTQPšQPPVVPPQÑÐTPPšÑPPVXÐPQÒTPPšÑPPVXÐPQÒTPP–QÑPR™ÐP–’PR”PP–RPR™ÐP–ÒPR™ÐP–ÓPR”QP•ÛSPR”QP‘ÚRPSÑÔPRQP‘žTPS•ÕPRRP‘”ØÐSUÕPRRP‘^\ÐSÖPRSP‘ZPR›VPRSP‘ZNRŒ–PRTP‘TÍRŒ–PR]ÕP‘PÍR›VPR]ÕP‘PÌR›VPRVP‘LR•ÖPR]ØÐ‘ÌR‘ÖPR]ÙÐ‘ÌRL–PRYÚÐÞ]ÐRL˜ÐRT[ÐÚ]ÐR[YÐRÜÐÔÜÐRQÚÐRÌž\ÐRÛÐRÎ”ÛÐRÜÐRP^[ÐQÕÝÐRÚÐ‘ÕÎQÔÙÐ‘ÕÎQÔØÐ‘ÒPQÔØÐ‘ŒÐPQÞXÐ‘ŒÐPRØÐ‘›‘PRVP‘ŒÑPRZVP‘ŒÑPRÖP‘ÒPR”ÖP‘ÒPRžVP‘ÖPRžVP‘ÖPRžVP‘ÛPRžVP‘ÖPRžXÐ‘ÒPRžYÐ‘ŒÐPR”ÚÐ‘–PRÜÐ‘[‘PRÏOH‹˜[Y\ËLKMŽˆ™PUYYÑVYTQX™PQYÑYÙQZYQZØÝÑ[XÝÑ[˜ÙÑ\ÔQ\˜ÔQ\ØÐQ]ÐQ]Ñ]˜Ñ]ØÑ]Ö”QRX™Ð^QMÖ]ÑN]ÑNQÕÝÑ‘UÐQ’Ñ’U™Ñ’•”Q’Õ]Ñ“UPQ“ÕQ””ÝÑ•ÔQ•TQPPŒÐ•œ™ÐP[U˜LTPST”Q–]QPQTP•Ø•PPLQU›LTPSÔ]Ñ–\ÝÑPQP•ÓPPNPUš^PTPTTTQ–\ÙÑPQQPP•Ø‘PP‘KÐUœ]ÐTPTÔÑ˜œÑPQ^Œ–ÎP“NUŠÝTPUÙÑšœ™ÑPQ‘Ð˜RÍP”LPVL“]ÑÔUPšÔQ]ÐV’P“ÑÕPTÜÐ›Ñ\PV™Ð’ÑØTÕP›”QZVŽ’YÑÙÐTÐP›ÙÑYPXTP’QÚÐTÐœQXPXVP‘ÐQÛT˜ÐœÑUXXÐ‘QÚT“PœQTÐVÐœÑPPT‘P›ÑÜTPP‘PQÕTNšÔQÚTPP‘ÑŒÚÔQPQÌ˜Ô]Ð˜Ô]Ð˜Ô\Ð˜Ô[Ð˜ÔZÐ˜ÔYÐ˜ÔYÐ˜ÐXÐ˜ÐVP˜ÐVP˜ÕP˜ÕP˜ÔP˜ÐSP™SP™ÓP™YÒP™™ÒP™PPQPVTPTQÒPTPPšQPPVMPQÔTPPšÔQPPV’PPQÔÐTPP›QPPV•PPQÕTPP›ÑPPV˜ÐPQV’YÐŒPPQVR]ÐŒPQVPŒTQUÒ™ÐžPTQU’ÐžPTQUR™ÐžTQURPŒPYÑTÒ]ÐŒYÑTÒTP]ÑT’PPPQTPPPQTÐQSÒÐÐ”QS’ÐÐ”QS’P‘V™Ð^”QS’P‘XTP]Ð™ÑSRP‘”P\ÐÑRÑÝÐ‘XÐP\ÐQR‘ÝÐ‘ÝÐ[PÔQRQÙÐ‘P[ÙÑRÙÐÙP[ÝÑQÑÔP™P[QQQÔPYP[QPÑÔPNYP[ÔQMÙPZ‘ÔQM™PZQÐQMYPZQ™ÑMYÐYÑ”QMYÐY‘”Q]”™ÐQÙPPYQ]™YÐXQQ]Y]ÐV‘Q\ÙPVQ]Ñ\Ù]ÐVQYÑ\Ù]ÐV‘YÑ\Y]ÐVQTQ\Y]ÐVQPQ[]ÐV‘ÑZ™PVQÑXÙPVQQX™]ÐX‘QXY]ÐYQXY]ÐY‘QVY]ÐZÝÑVYYÐZÐÝÑVYYÐZÐÙÑV™YÐ[ÔQXYYÐ[PÔQXYYÐ[PÔQXYYÐ[PÔQXYYÐ[PÔQXYYÐ[PÔQXY]ÐZÐÙÑVYPZPÝÑUÈ‹˜[Y\ËLKMHŽˆšQPQRQPT•‹ÐTšPTžTŽMÐTÑTÓPTÕTÙÐTÚÐTÛTÝPTÌLPTÍLTÎLTÎLUœTUžQœPUT\QÐUNUPU‘”ÐU“”U””PU•”U–”U–“ÐU™‘ÐTPQÕQ–^QPPÑL•ÓTPP\PU›‘PTPRÕQ–ÝÑPPÌÐ•ÜÓPP]PUÐTPST™Ñ™ÔQPQUP–ÑPPLQUÐPTPSÔYÑ™ÑPQP–SPNÐUÑÊÐTPTTQš™ÑPQQÐ–“P‘MUÙNTPTÓ”QžQPQUP™SÐP“]ÐVŒTPVÑÙTÝÐ›ÔQ\XTP’ÑÛPTÕPœPQZÐX[Ð’YÑÜÐTÐPœ™ÑYXN’QÝÐTœÐœÔQXPX‘P‘ÐQÞPT˜ÐœÝÑUÐX”P‘”QÌT”PQUX•P‘YÑÌT‘PQTPX”P‘ÑÌTMœ]ÑSXSP‘QÙXLPQSPVUP›QPQÜÐ™ÔQRÐVŽPPZÒVRPVRVQÐVQÐUÎÐUÍUÌUÌPUÍPUÎPVQVQVQVÐÐVVTPTQÑÐTQPšPQPPV\ÐPQÓTPPš™ÑPPVNPQÔPTPPšÔQPPV’PPQÕTPPšÝÑPPV”PPQÕPTPP›QPPV•PPQÕTPP›QPV”PTQÕPTRPšÝÑPÐV“PYÑÕTSPšÙÑQPV‘P]Ñ”UÔPMÐQ“ÖPMQ“VTP^Q“”P]P”Q’VÐ\Ð”Q’YÐ[Ð™Ñ‘XP[PÑØP[PÑ˜P[PÐQJØP[PÙÑM˜P[QÑLXP[ÑLP[Ñ^”PZÑÑ]Ø™ÐZQÑ]˜™ÐZÑ]X™ÐYÑÑ]”PYÑÑ\˜PYÑÑ\XPY‘Q\PYQ[˜PXÑQ[XPXPÝÑZ˜]ÐXPÝÑXÒÔPQYÐXÙÑXØTPXÙÑX˜TPXPÔQXXPPXÔQV–ÐXÐÐQV–ÐYPÑV–™ÐZÑV–™ÐZPÑV–”PZÐ™ÑX–™Ð[™ÑX–™Ð[P™ÑXÖ™Ð[P™ÑXÖ™Ð[P™ÑXÖ™Ð[P™ÑXÖÐ[™ÑXØPPZÑXXYÐYÐÐQVH‹˜[Y\ËLKMˆŽˆ™ÔQPQ’‘Ò‘ÌÝÐ’Ð’ÛÐ’VÐ’LÙÐ’–Ð’ŒØÐ’ÒP’Û–P’Û•P“P“ÜÐ[”PS[Ð“ÑÚÐ“ÕÙÐ“Ì™Ð“Ì™Ð“Ì™Ð“Ì™Ð“Ì™Ð“Ì–P”ÔP”’P”U”•›Ð”Õ™Ð”ÌVP••P•“P•Î•ZÍ•ZÌ•LÐ••YÐ•ŒP•ÑSP•Ú–•P–ž‘P˜^L˜ž[Ð˜ÔØÐ™ÕP™RP™PÐP™T™TÐ™ZÐ™^Ð™”˜Ð™”–P™””P™šP™’P™P™™Î™Í™ÐQSVQP‘QÐT\Ð™ÙÑRÐVRPÔQÐÐTZÐ™ÔQRPVQPÑÐÐTVP™ÝÑQÐVSP”QÑTUP™ÝÑQPVTP]ÑÑTRPšÑPÐVVPYÑÑÐTQPšÑPVYÐTQÒTPPšPQPPVYÐPQÒPTPPšPQPPVZÐPQÒV[ÐPRPPVLPQÔTPP›QPPV–PPQÖPTPP›TQPPV›ÐPQXÒPP’TPPPQXRPŒÐPQVR™ÐŒPQVRÐŒÐPQVÐŒÐPQVÐPŒÐTQU’ÔPŒÐTQU’ÙÐŒTQURÝÐŒPYÑUPŒYÑUPŒ]ÑT“PPž]ÑT“ÐžPQTÐž”QSÓPŒP™ÑSRÝÐŒ™ÑSRÙÐŒÐÑRÒÔPÐQRÒÐPMV”PNÔQRRÐMXYÐLÐÙÑRR™ÐMXÐ^ÙÑR™ÐMÙÐ]ÝÑQ’”PLÙÐ\‘QQ”PL™PP\QL™P[]ÑL™P[]ÑLYP[]Ñ^™P[]Ñ^PZÒ]Ñ]ÙP[YÑ]™”PZ’TQ]Ù”PZRÑ^Y™ÐZQ^Y™ÐYÒQ^ÐYRQ]ÙÐQPRœÐ“RQPP›ØTÊÑTPVQÝÑ]YÙÑPQÔ›Ð“ÒPPšØPTÞPÐTPV‘ÔQ\ÙÙÑPQÔ™Ð’ÕRPPVRPPšÖTÚQTPVQ™Ñ[ÝÑPQÐ•P’’RPP›ÕPTžPÐTPXÑQXYÙÑPRP‘ÛÒPPÐTÐTœPTPZ‘TQXYÔQPR‘P‘ÛÑPPÕTPTPTP[PQX™ÔQPR”P‘ÍPPÕTPTPTP[PQX™ÔQPR”P‘ÍPPÔTT›QTPZQTQVH‹˜[Y\ËLKMÈŽˆ•ÐPUU™ÑVU”QX•]ÑYUYÑZTQZ•PQ[PQ[Ñ[•Ñ\Q\•Q]Q]Q]UQ]TÝÑ]”ÝÑ]ÔTQM”PQMÔPQMÔPQMÔPQMÔTQM”TQM”YÑMT]ÑMQLÔQLÔ”QL”ÑQPL”QNTQNSÝÑJÓÙÑJÓÔQKÓÐQKÓÑKÓ”Q“TQ‘SÑ‘ÓQ’ÝÑ’’ÙÑ’ÒÔQ“Ñ“’™Ñ“’™Ñ“RQ“Ò]Ñ”RTQ”ÒPQ•RÑ•ÒÑ–Q–RQ–RQ–’Q–RQ–QÝÑ–‘ÝÑ–‘ÙÑ–‘ÔQ–‘ÐQ˜QÐQ˜QÑ˜‘™Ñ˜Ñ”Q™Q”Q™QQ™‘]Ñš]Ñš™TPRYÑžTQž‘PQŒ‘ÑÑQÑÑQŽQŽQŽQQŽPÝÑŠÐÝÑŠÐÙÑ‹ÐÔQ‹ÐÔQ‹ÐÐQ‹ÐÐQ‹ÐÑ‹ÐÑŠÐÑšØ™ÐV™Ñ›ÔPU™Ñ›ÐSP”Q›YPPR”Q›™]ÐQQœ]Ñœ]ÑœÐ]ÑPYÑžYÑžPYÑžYÑŒPTQŒÐTQPQPQÐPQŽPQŽPPQŽPPQŠÐPQŠÐPQŠÐPQ‹ÐPQ‹ÐPQ‹ÐPQ‹ÐPQ‹ÐPQ‹ÐPQÐPTPP™ÐQPPVPPPQÐTPP™ÔQPPVRPPQÐÐTPP™ÙÑPPTšØPQÚÐPT–YPQÕPT“YÐQPÙÐÐT‘ZQPÕPÐT‘ZQ™PPÔQTZQ™PPÔQTZQ™PPÔQPTNPPÓ’PP[PPÓQTMPÓ’ÐPT™PÒQÐTMPPÑ™PÑRTLPÒ™ÐPÐRPTLÐPÒšPÐRT]ÙÐPÐšPPÐT\ÙÐPŽZPPTZÙÐP[PÓTYÙÐPžÐPšÓÐTVYPP™ÔÐTQYPPœPšÙTœPšÙT›PœØÐT›PPœØÐTšPŒTšPPÐXTšPPÒXTšPÓXPTœPPÔVTžPPÕVTžPPÕVTŒ\PPÕVTŒ\PPÕVTŒ\PPÕVTžPPÕXPTPÓXT›PPH‹˜[Y\ËL‹LŽˆ”ÐTT”QU”]ÑV”YÑXÔTQYTPQY”ÑZTÑZÔQ[TQ[ÓÝÑ\SÝÑ\SÙÑ\ÓÙÑ]ÙÑ]ÔQ]“ÐQ]ÓÐQ^ÐQ^ÐQ^ÐQ^ÐQ^ÐQ^ÐQ^ÐQ^ÐQ^ÐQ^ÔQ]ÓÐQ^ÔQ]“ÔQ]“ÔQ]SÙÑ\ÓÙÑ\ÓÙÑ\“”Q]“YÑ^SÑLRÝÑMÙÑMRÐQMÒÑN™ÑNR”QNR”QNQN]ÑN]ÑMÒ]ÑM’]ÑM’]ÑMÒYÑNTQNRPQKÒÑRÑRÑRQ’Q’Q‘ÝÑ‘ÝÑQÙÑ‘ÙÑQÔQ‘ÔQ‘ÐQÑÐQÑÐQÑÑ“QÑ“‘Ñ“ÑÑ”Ñ”‘Ñ”ÑÑ”ÑÑ•Ñ•Ñ•Ñ•Ñ”ÑÐQ”‘ÐQ”‘Ñ”ÑÑ”‘Ñ”QÑ”QÑ”Ñ“ÑÑ“‘Ñ“QÑ“Ñ’ÐP‘Ñ‘ÑÑ‘Ñ™Ñ’QQ“]Ñ“‘TQ”PQ”‘Ñ”ÑÑ•Q•QQ•ÝÑ•ÐÝÑ–ÙÑ–ÔQ–ÔQ–ÐQ˜PÐQ˜ÐQ]ÓÙÐ\ÐQ\P[ÐQ[ÔTPZPÐQ[”TPZPÑ[”TPZPÑ[TTPZP™Ñ[TTPZP”Q[TYÐYÐ”Q[YÐYÐQ[YÐYÐ]Ñ[T]ÐYPYÑ[TPXÐYÑZÔPXÐTQZÔ™ÐXPTQZ”ÐXPPQZTÐPVPQY”ÔPVPPQXTÙÐVPQV”ÙÐXPQVTÙÐYPQVÙÐYPQVÙÐYÐPQVÙÐZPQVTÙÐZPPQV”ÙÐZPQV”ÙÐZÐTQV”ÙÐZÐTQVTÙÐZÐTQV”ÙÐZÐTQV”ÙÐZÐTQVTÝÐZYÑVPZ]ÑU•ÐXˆ‹˜[Y\ËL‹LHŽˆ”ÐTT”QUT]ÑVTTQXÔPQYTÑYÔÑZTQZÔQ[TQ[SÝÑ[ÓÝÑ\ÙÑ\SÙÑ\“ÔQ\ÓÔQ]ÐQ]SÐQ]SÐQ]SÐQ]SÐQ]SÐQ]SÐQ]SÐQ]SÐQ]SÐQ]SÐQ]SÐQ]SÔQ]ÔQ\ÓÙÑ\“ÙÑ\SÝÑ[ÓÝÑ[ÓÔQ\S”Q]SÑLQLRÝÑLÒÔQMRÐQM’ÑM’™ÑMÒ™ÑM’”QM’QM’QM’QMRQMRQM’QM’]ÑN]ÑNYÑNRTQJÒPQKÒÑRÑ’Ñ’QÒQÒQ’QÑÝÑ‘ÙÑ‘QÙÑ‘QÔQ‘‘ÔQ‘‘ÔQ‘ÑÔQ”ÑÔQ•ÔQ•QÔQ•‘ÔQ•ÑÔQ–ÔQ–ÔQ–ÔQ–QÔQ–QÙÑ–ÙÑ–ÔQ–QÙÑ–ÙÑ•ÑÙÑ•ÑÙÑ•‘ÔQ•ÑÔQ•‘ÔQ•QÔQ•ÔQ”ÑÔQ‘VPPRÑÔQ‘VTPRQÙÑ‘QÝÑ‘QÝÑ‘‘ÙÑ’ÐQ’‘Ñ“”Q“Ñ]Ñ”‘YÑ”ÑTQ•PQ•‘PQ•‘Ñ•ÑÑ–Ñ–Q–QQ–‘Q˜QQ˜QQ˜PÝÑ˜ÐÝÑ\ÓÝÐQ”YÐ[ÝÑ\]ÐZÐÙÑ\PZÔQ[ÔPZÑ\PZ™Ñ\TPZQ\”PZ]Ñ\””PZPYÑ\””PZTQ\Ô”PZPQ\”™ÐYPQ\”ÐYPQ\ÐXÐPQ[ÔÐPXPQ[TÙÐXPPQZTÝÐVPQYÕPVPTQX•PVTQV•PXPTQVUPXÐYÑUÕPYPYÑUÕPYÐ]ÑU•PZP]ÑU•PZÐ]ÑUÕP[]ÑVP[P]ÑVUP[]ÑVUP[]ÑVUP[QVP[”QUÕP[™ÑU•ÐZÐÑUÐZPÐQT•PPYH‹˜[Y\ËL‹LˆŽˆ””PSTYÑUTÑV”QXÔQY“ÝÑYÓÙÑZ“ÙÑZÓÔQ[SÐQ[“ÐQ[ÓÑ\SÑ\S™Ñ\Ó™Ñ\Ó™Ñ\Ó™Ñ]™Ñ]”Q]S”Q]“”Q]“”Q]“”Q]“”Q]“”Q]“”Q]“”Q]“”Q]“™Ñ]™Ñ]™Ñ\Ó™Ñ\ÓÑ\SÑ\SÐQ[Ó]Ñ]ÑP“TP]’ÝÑLRÙÑL’ÐQLÒÑM™ÑMR”QMRQMR]ÑM’YÑM’YÑMRYÑMYÑMYÑMYÑMTQM’TQMRPQM’ÑMÒÑNÑNRQJÒQKÒQJÑÝÑKÑÝÑKÑÙÑQÙÑVPQÑÔQ‘YÐSÔQ–ÐQ–‘ÐQ˜QÑ˜ÑÑ˜ÑÑ™Ñ™Ñ™Ñ™Ñ™Ñ˜ÑÑ˜ÑÑ˜ÑÑ˜‘Ñ˜‘Ñ˜QÑ–‘ÐQMUYÐYQÑM•”PPÕÐPVÑM•ÙÐP–PP–ÐSÑÑM–YÐRÑ™ÑN™ÑN™ÑNQ™ÑKÑ™Ñ‘™ÑÑ™Ñ‘Ñ‘ÐQÑÐQ‘QÔQ‘ÔQ‘‘ÐQ’™Ñ’ÑQ“Q]Ñ“ÑYÑ”TQ”QPQ”ÑÑ•Ñ•QÑ•ÑQ–QQ˜PÝÑ˜ÐÝÑ]ÔP\ÝÑ]TP\PÝÑ]Ð\ÝÑ\”Ð[ÐÙÑ\”PP[ÔQ\”YÐ[ÐQ\T]ÐZÐÐQ\TPZÑ\”PZP™Ñ\”PZPQ\TPZ]Ñ\T”PZPYÑ\T”PZ˜ÐP˜ÔPQYÑ\™Ð^PTQ\™Ð^PQ\Ð^PQ[”ÐP^PPQ[TÔP^PQZTÙÐ]ÐPQXÕÐ\ÐPQXUPP\PPQV•]Ð[PPQVU]Ð[PQVUPZTQV”PZYÑV™ÐYYÑV™ÐY]ÑV™ÐX]ÑVU™ÐXQV™ÐV”QUÕ™ÐV”QUÕ™ÐU™ÑU•™ÐUPÑUUÐPTPÐQTÕÐPSÈ‹˜[Y\ËL‹LÈŽˆ”ÐST]ÑUYÑVTPQXÔÑY”QZQZ“ÝÑ[ÝÑ[SÙÑ[ÓÙÑ\ÔQ\SÔQ\“ÐQ\ÓÑ]Ñ]Ñ]S™Ñ]“™Ñ]Ó™Ñ]Ó™Ñ]Ó™Ñ]Ó™Ñ]Ó™Ñ]Ó™Ñ]Ó™Ñ]Ó™Ñ]ÓÑ]SÑ]SÐQ]ÐQ\ÓÔQ\“ÔQ\SÙÑ\ÔQ\S]Ñ]“PQ^SQLRÙÑMÐQM’ÑMÒ™ÑN”QNQNQMÒ]ÑMÒYÑMÒYÑM’YÑMRYÑMRYÑMRYÑMRYÑM’TQMÒPQNÑNRÑNRÑJÒÑJÒQKÒQJÒQKÒQKÖPQ’Q’QÝÑ“ÝÑ“‘ÝÑ“ÑÙÑ”‘ÙÑ”ÑÙÑ•ÔQ•‘ÔQ•‘ÔQ•‘ÔQ•‘ÔQ•‘ÔQ•‘ÔQ•‘ÔQ•‘ÔQ•QÔQ•QÔQ•ÙÑ”‘ÙÑ”QÝÑ“ÑÝÑ“‘ÝÑM•ÐPTÝÑMUÝÐRÑÝÑMVÐQ‘ÝÑM‘ÝÑMÑÝÑNÝÑJÑÝÑKÑÝÑQÝÑÑÝÑ‘ÙÑ‘QÔQ‘Ñ™Ñ’Ñ”Q“QQ“Ñ]Ñ”YÑ”‘TQ”ÑPQ•Ñ•QÑ•‘Ñ•‘Q•ÑQ–Q–Q–QQ–PÝÑ˜PÐQ™”Q]ÓÔPPÔPP”PP[Q]ÔTPZÐ]Ñ]ÔYÐZÐYÑ]ÔYÐZÐTQ]ÔYÐZPQ]ÔYÐZÐPQ]”YÐZPQ]YÐZPQ\Ô]ÐZPQ\”]ÐZPQ\T]ÐZPQ[ÔPYPQ[Ô”PYPPQ[™ÐYPPQZ”ÐPXÐPQV”ÔPXÐPQVÝÐXÐPQU•PYPQU•PYPPQUUÐYPQUUPZPPQUUPZPQUUP[TQUUP[PTQUUP[PPQU•P[PTQUUP[PTQUUP[PYÑUP[P]ÑUP[QT•ÐZÐ”QTÐZ‹˜[Y\ËL‹MŽˆ˜PPSÖ”QUV]ÑVVTQX–PQYÑYVÑYÖQZVQZ–Q[UÝÑ[•ÝÑ[ÕÙÑ\UÔQ\•ÔQ\ÕÔQ\ÕÐQ]UÐQ]UÐQ]UÐQ]UÑ]•Ñ]•Ñ]•Ñ]•PQP•YÐP•Ð]•QMTÝÑMÔÔQNTÐQNTÑJÔ™ÑJÔ”QKÔ]ÑTYÑ”TQ”PQÔÑÔÑ‘Ñ‘Q‘TQ‘”Q‘“ÝÑ‘ÓÙÑ‘ÓÔQ‘ÓÐQ‘Ú™ÑPPš™Ð”›ÌPYÌÐUYSTPSSÑ’YÑPQ˜Ð”ÐPLUÓLUÓLUÔLUÕLUÕLUÕLUÕLUÕLUÕLUÕLUÕLUÕLÐUÔLÐUÔLUÕLUÔLPUÖLUÖ^UØÞPUÙÞPUØÞU›PPQœPPÎÐUœÐPÝÝUPÚÝPUžPÖ]PUŒPÑ]UPÝUŠÐP•\ÐUÐP’\U‘TPPšQPQÛÐ”RVPPXÜUS[ÐUU[PUZÚÐU]ÚUMU’YÐU”YPU–XÐUšØPUÖUPUŽUÑUÐUÒUUÓUPUÕUPUÕUUÖTÐUØÔUØÔPUÚÔUÚÔUÚÔUÚÔUÛÓÐUÐP[PPÌÐU‘PU”PÛÓU•ÐPÓSTÍUÐPÓSPTÎUÐPÓSTÍUÐPÓSTÌUÐPÒRÐTÌUÐPÒRTÞÐPÑRTÝPŽPTÝPPTÝPÑÐTÜPP›ÑÐTÛPšÑÐTÚÐP™ÑTÙÐP™ÑTÕ˜ÐPšÑPTÑ˜ÐPœÑTžÐPŒTœPŒÐTÐPÐPTœÐPÑPPTÐPÒPPTœÐPÓPPTPÕPPTPÖPPTPÖPPTPÖPPTPÖPPTÐPÕPPTÐPÔPPTPÒPT›ÐPTÐPLH‹˜[Y\ËL‹MHŽˆ˜PPT”QUV]ÑVVYÑXVTQXÖPQY–ÑZVQZ–QZÖQ[UÝÑ[ÕÝÑ\ÙÑ\•ÙÑ\•ÙÑ\ÕÙÑ\ÕÔQ]UÔQ]UÔQ]•ÔQ]UÔQ]UÔQ]\YÑPP‘™Ð“™ÐPYPTÊÛTPR•ÐQ]œÑPPÌYÐ“•PPLUÐUÚÐTPSÕ]ÑLÝÑPQQ’P“’ÓPP“ÐUZPTPT”ÝÑM›ÙÑPQU[Ð“Í’PP‘’UZTPTÔÑN[ÐQPQLP”PPP“‘U™TPUTQ[ÑPQLP”VŽP“‘UQÑTPPšPQPPÍ]ÐPQÙPTPUT]ÑTYÑ”YÑ”TQÔYÑTTQ”TQ”TQ”TQ”YÑTYÑTYÑTYÑTQTTQTQœÔPQPQœÔPQœTPQšTPQ˜[]ÑPP^Ž”MÐP]ËÐUËÐUJÐUÎUÍÐUÍUÍPUÍUÌÐUÌUÌPUPQLUPUU]ÐUZÝU]ÝU\ÐU“\PU˜ÜUšÛÐUœÚÐUÐZPUÓZUÕYÐUØÙUÚØÐUÝØUÌVVPVVVUÐVUVUPVUVTÐVÔVÔVÔPVÔVÓÐUPQÐUÐQÓÐU“QÓU“PS•P[ÐPÕSU˜PQ™ÐPÕSU™ÐPÔSPU™ÐPÔSUšPÓRÐTÎYÐPÓRÐTÍZPÒRTÍZPPÐRTÌZPPTÞPPPTÝPÒTÜPPÒTÛPPœÑÐTÚP›ÑÐTÙPšÑTÙPšÑPTÖ™ÐPšÑPTÒ™P›ÑTžP›ÐÐTPPœÐÐTœPŒTœPŽTœÐPÒPPTœÐPÒPPTœPÕPPTœPÖPPTœPØÐPTœPÙÐPTœPÙÐPTœÐPØÐPTœÐPÖPPTœPÔPPTœPÑPT˜ÏH‹˜[Y\ËL‹MˆŽˆ–”PS–TQUVÑVVÑXVQXÕÝÑY•ÙÑZUÔQZÕÐQ[UÐQ[•Ñ[ÕÑ\U™Ñ\•™Ñ\Õ™Ñ\Õ”Q]”Q]U”Q]U”Q]UQ]•Q]•Q]•Q]•Q]•Q]•Q]•ÑLQL”ÙÑMTÑMÔ”QNTYÑKÔTQTPQTÑÔQÔQ‘ÝÑ‘SÙÑ‘“ÔQ‘ÓÔQ‘ÚYÑPPÕÐ”–ZÐP\ÍPUUÒPTPS“ÐQ‘šÑPQ˜Ð”–VPP‘LUYQPTPUS™ÑšS”Qš“QšÓ]Ñ›YÑ›SYÑ›STQ›“TQ›“PQ›ÓPQ›“PQ›“PQ›“PQ›“PQ›“PQ›“TQ›TQ›TQ›YÑš“]ÑšYÑšTQšPQ™PXÓÑKÙÐVSÑJÙYÐUQNQNÝÑRÙÑ‘ÔQ’ÐQ’ÒÑ“’™Ñ”’”Q•]Ñ•ÒPQ˜RÑ˜ÒÑ™RQ™‘ÝÑšQÙÑšÑÐQ›‘Ñ›Ñ™ÑœQ”Qœ‘Q]Ñ‘]ÑÑYÑžQTQŒPQŒQÑŒÑÑÑQÑQÑJÕPM‘Q^]ÐRUPM‘Q]”PQÕÐRÖÐ\Q]ÐRÐ\Q]TP[PÝÑ]VYÐ[ÙÑ]VYÐZÐÔQ]VYÐZÐÔQ\ÖYÐZÐÔQ\–]ÐZÐÔQ\V]ÐZÐÐQ\VPZÑ\V”PZÑ\™ÐZP™Ñ\PPZ™Ñ[ØTPYÐ”Q[˜]ÐY”QZØÐXÐQZXÐPY]ÑXØÔPYPYÑXØÙÐYYÑX˜ÙÐZTQX˜ÙÐZPQX˜ÙÐZÐTQXXÙÐ[PQX˜ÙÐ[PPQX˜ÙÐ[PPQX˜ÙÐ[PPQX˜ÙÐ[PPQX˜ÙÐ[PPQX˜ÙÐ[PPQX˜ÝÐ[PQXYPZTQVH‹˜[Y\ËL‹MÈŽˆ”PT“ÙÑVÔQXSÐQXÓÑYS™ÑYÓ”QZQZ“]Ñ[YÑ[“TQ\TQ\PQ\“PQ\“PQ\ÓÑ]Ñ]SÑ]“Ñ]“Ñ]“Ñ]“Ñ]“Ñ]“Ñ]“Ñ]“Ñ]“Ñ]“Ñ]SÑ]SÑ]PQ\ÓPQ\“TQ\STQ\Ñ\RÝÑ]R™Ñ^’QLRTQMPQMRÑM’ÑM’QMÒQMÑÝÑNÙÑNÙÑMÑÙÑMÑÔQNÔQNÙÑNÙÑNÔQNQÐQJÑÑKÑÑKÑ™ÑKÑ™ÑQ”QQ”QQQQQQQQ]ÑÕ™ÐRQYÑ”QYÑ”‘TQ•TQ•QTQ•‘TQ•‘TQ•‘TQ•‘TQ•‘TQ•‘TQ•‘TQ•‘TQ•‘YÑ•QYÑ•YÑ•]Ñ”‘]Ñ”Q]Ñ”Q“‘Q“QQ“”Q’‘Q‘‘”Q‘Q”Q‘Ñ”Q’”Q’Q”Q’‘”Q“™Ñ“™Ñ“Q™Ñ“‘”Q“Ñ”Q“ÑQ”Q]Ñ”ÑYÑ•TQ•QPQ•‘Ñ•ÑÑ–Ñ–QQ–‘Q˜‘Q˜‘Q]ÝÐ\ÑQ]P\‘Q\ÔPP[ÝÑ\TPZÝÑ\™ÐZÝÑ[”™ÐZÙÑ[”™ÐZÔQ[”™ÐZÔQ[”™ÐZÐQ[”™ÐYÐÐQ[T™ÐYÐÑ[TÐY™Ñ[TÐPYP™Ñ[ÔPY”Q[ÙÐXÐ”QZÔÝÐXQZ•PXQZÐV]ÑYÕÐXP]ÑXUPPXYÑV•PPYTQV•PPYÐTQVUÐZPTQVUÐZPQV•Ð[PQXUÐ[PQX•Ð[PQX•Ð[PQX•Ð[PQX•Ð[PQX•PPZÐPQX•TPZTQV•YÐZYÑVPQXÐPÈ‹˜[Y\ËLËLŽˆ•ÙÐSÐQSÕÑTUÑPÕ”PT•QQUPTÝÑR]ÐTÔQZTÑ[™Ñ[˜ÐPR™Ñ[˜™ÐRÔÑ^ÔQ^ÐQ^”ÑLTÑLÔ”QM”QMÔ]ÑN]ÑM”PPÔYÑLÔYÑL”YÑLÔTQM“YÑPÔPPMÓTQQTÐJÓPQQ”PSÑRSÙÐ‘SÑ”SÑ”SPQ”YÑ““PQ”]ÑPÒÔP•ÒYÑ™YÑ™]Ñ–]ÐQRYÑ–Y]ÐQRYÑ–Y]ÐQRTQ–™PPÒTQ–’YÑ–RTQ–RTQ–RÑ˜RÑ˜’Q˜’Q˜ÑÝÑ˜ÑÙÑ•˜ÔPQ‘ÔQ•ØÙÐQÔQ•ÑÔQ•ÑÔQ•‘ÔQ•‘ÔQ•QÔQ”ÑÔQ”ÑÔQ”‘ÔQ”‘ÐQ”ÑÐQ”ÑÐQ”ÑÐQ•ÐQ•ÐQ•ÐQ•ÔQ”ÑÝÑ”QÙÑ”‘ÔQ”ÑÔQ”‘ÐQ”ÑÑ•™Ñ•Q™Ñ•Q”Q•‘”Q•‘”Q•Ñ”Q•Ñ”Q•Ñ”Q–”Q–Q”Q–‘”Q˜‘™Ñš‘™Ñ›™Ñ›QÑ›‘Ñ›ÑÑ›ÑÐQ›‘Ñ›ÑÐQ›‘ÐQ›‘ÔQ›QÔQ›QÔQÖPZ‘ÔQÖÐZÙÑÖPPY‘ÙÑÖTPYQÙÑ‘PXQÙÑ‘–™ÐVÝÑ‘˜TPUQÝÑ‘Ø]ÐT’Q’”PSÒQ’X™ÐSRQ’XÐPR’Ñ’XÔPQÒÑ’RPQ’RÑ’ÒÑ“Ñ“’Q“ÒQ”RQ”‘ÙÑ•QÐQ–™Ñ˜Q”Q˜‘Q™]Ñ™Q]Ñ™QYÑ™‘TQ™ÑPQšÑšQÑL”™Ð\‘QLÔÐ\QQ^PPQÐ\ÝÑ^ÐP\PÝÑ]ÕP[PÝÑ]•ÐZÐÙÑ]•Ð[ÙÑ]•Ð[ÙÑ]UÐZÐÙÑ\ÕÐZÐÙÑ\•ÐZÐÔQ\UÐZÐÔQ\ÐZÐÐQ\UPPZPÑ\UÐZÑ\PPZÑ[ÕTPY™Ñ[ÕYÐYP”Q[Õ]ÐXÐ”Q[•PXÐQ[•”PXPQ[U™ÐV]Ñ[ÐV]ÑZUÐPVYÑZUÐPXYÑV•ÔPYTQXUÔPYPTQV•ÔPYPQXUÐPZPPQV•ÐPZPQV•ÐPZÐPQXUÐP[PQV•ÐP[PPQXUÐP[PPQXUÐP[PPQXUÐP[PPQV•ÐP[PPQV•ÔPZÐPQV•ÙÐZPTQUÕÝÐYÈ‹˜[Y\ËLËLHŽˆ•ÐPSU™ÑTQPÕPTÕQQU]ÐTÔÝÑQÕYÐT–™ÐP˜PPP”ÐQZ”™Ñ]”Q]”Q]Ô]Ñ^Q^ÐQ]ÔÑ^T”QLTQLÔ]ÑMTYÑMÔTQNPQNTPQLÙTPQÑLÔÑL”ÑMSQPÔÐMÓYÑQ”ÐNTQRPNSPQRÔPJÓPQ“TQ“YÑ’ÒQPÓYÐ“]ÑQRÝÐ”Ò]ÑQRÐP•’]Ñ˜R]Ñ˜R]Ñ˜R]Ñ˜RYÑ•™PPQ’YÑ•™TPP™]ÐP’]ÑPÒ™Ð”R™Ñ”R]Ñ•YÑ•RPQ•ÒÑ•ÒÑ–Q”˜ÐQ‘ÝÑ”Ø™ÐQ‘ÙÑ”ØÐQQÙÑ”ØÐPPÑÙÑ”ÑÔQ•ÔQ•ÔQ”ÑÔQ”‘ÔQ”QÔQ”ÐQ”Ñ”Ñ“ÑÑ”Ñ”ÐQ”ÙÑ“‘ÙÑ“‘ÔQ“ÑÔQ“ÑÔQ“ÑÔQ“ÑÐQ”ÐQ“ÑÐQ“ÑÐQ“ÑÔQ“‘ÙÑ“QÝÑ“ÝÑ“QÝÑ“QÝÑ“RQ“QÝÑ“ÑÝÑ”RQ”RQ˜’Q˜ÒÑ™Ñ™Ñ™RPQ™YÑ˜’]Ñ˜RQ–’”Q–R™Ñ–ÐQ•’Ñ•ÒÑ•Ò™Ñ–™Ñ–”Q–R”QMÐYR”QLÖYÐV’QM™ÐPØTPT’]ÑM˜]ÐSÒYÑNPSYÑN™ÐRRTQJØÐQÒPQRPQ’Ñ‘Ñ‘RQ‘ÒQ’RQ’‘ÔQ“‘ÐQ”Ñ”Q™Ñ”Ñ”Q•Q]Ñ•ÑYÑ–QTQ–‘PQ˜‘Ñ˜ÑÑ˜ÑÑ™Ñ™Q]”P]QQ]”Ð\ÑQ]TPPP””P[‘Q\Ô™Ð[QQ\”Ð[QQ\TÐ[PÙÑ\TÐP[ÔQ\TÔPZÐÑ\”ÔPZÐ”Q\ÔÔPZÐQ]ÔPZÐ]Ñ\ÔÔPZÐYÑ\ÔÔPZÐTQ\ÔÙÐZPPQ\ÔÙÐZPPQ\ÔÝÐZPQ\TÝÐYÐPQ\UPYPQ[ÕPYPPQ[UÐYPQZ•ÐXÐPQYTPXTQV•]ÐXPTQVUPXPYÑUÕPXÐYÑUÕ”PYYPPYÑUÕ™ÐZYÑUÕ”PZYÑUÕ”P[YÑV”P[PYÑVP[YÑVUP[ÐYÑV•P[Ð]ÑVUP[ÐQV”P[QUÕP[”QU•”P[™ÑUU”PZÐÑT•™ÐYPQ‹˜[Y\ËLËLˆŽˆ•”PSU]ÑTTQTTÔQPÕPPSÔÑQÕÐSÔ”QYXTPQÔ]Ñ]YÑ]TYÑ]YÑPÔ”P]”™Ñ]ÔQ^”]ÑLT]ÑL”YÑMTQM”PQMÔÑNÑMÑLÔQMTQM“ÑPÓÐQPNÑQS”P‘SQQ“P‘ÓQ“ÓQ“ÒÝÑ”SQ”Q“ÓÑ““Ñ““Ñ“’ÝÑ”RÑ•RYÑP’™Ð”YÐQRTQPÒP”ÙPPP’PQ•ÒPQ•’PQ•ÒTQ•RPQ•’TQ•TQ•PQ“X”PQÒÑ“˜”PQ’Q“˜™ÐQRQ“Ø™ÐQÝÑ”ÙÑ”ÙÑ”QÙÑ”ÙÑ”ÔQ”ÔQ“ÑÔQ“‘ÔQ“QÔQ“QÐQ“‘ÐQ“‘Ñ“ÑÑ“ÑÑ“ÑÑ”ÐQ“ÑÝÑ“ÝÑ“ÙÑ“ÙÑ“QÙÑ“QÙÑ“ÙÑ’ÑÙÑ’ÑÙÑ’ÑÝÑ’’QPÒÐ‘’Ñ‘’Ñ‘’Ñ‘ÒÑ‘ÒÑ’Ñ’’Ñ’ÒPQ’Ø”PQ’PQ•ÒTQ–YÑ–]Ñ–Q–”Q•Ò”Q•Ò™Ñ•’Ñ•RÑ•RÐQ•ÐQ•ÐQ]UÐZÒÐQ]UÙÐZÐQ]VPYRÑ]ÖPYÑ]ÖÐXRÑ]ÖYÐUÒÑ]–™ÐTÒ™Ñ]ØPPT™Ñ]ØYÐS”Q^XPRR”Q^X”PQÒQ^’]ÑLR]ÑL’YÑMTQM’PQNÑJÒQ’Q‘ÝÑ‘QÐQ’QÑ’Ñ™Ñ“Q”Q“ÑQ”Q]Ñ”‘YÑ”ÑTQ•PQ•QÑ•‘Ñ•ÑÑ–Ñ]TP\Ñ]Ð\Ñ\ÔÐ[‘Ñ\”Ð[ÑQ\ÔPP[ÝÑ\ÔYÐ[ÙÑ\ÔYÐ[ÔQ\Ô]ÐZÐÑ]]ÐZÐ™Ñ\ÔPZ”Q\”PZQ\”PZ]Ñ\”PZYÑ\”PZYÑ\TPZPQ\””PZPPQ\”PZPPQ[T™ÐZPQZÔÐYÐPQYRÐPÔÔPYÐPQX”ÙÐZPPQV•P[PQVUPP[TQVTP[ÐYÑUÕYÐ[]ÑU•]Ð[]ÑU•P[QUUP[QU•]Ð[Ð”QU•]Ð[”QUÕ]Ð[P™ÑU•]Ð[™ÑU•]ÐZÐÑUU]ÐZÐQU]ÐZÔQTÕ]ÐYÝÑTUPXQÑSU”PTÈ‹˜[Y\ËLËLÈŽˆ•ÙÐS•ÑPÕÐPTUÑQUÐT•QQ•”PTÕQRPTTÝÑVVPP–™ÐPØTPQ”Ñ\™Ñ]”™Ñ^™Ñ^”ÝÑ]”ÔQ^TÐQLÑL”™ÑM”QM”QMÔ]ÑM”PP”]ÑL”YÑLÔYÑMTQMSQP”TPM“YÑQTPSTQQÓÝÐÓTQRÝÐÓPQ“ÓPQ“ÓTQ“ÓTQ“ÓYÑ““]Ñ“SPQ”Ñ”“Q•QP’ÙÐ”Y]ÐQR]Ñ–PQ]Ñ–]Ñ–]Ñ•Ò]Ñ•ÒYÑ–TQ–RPQ–RÑ–’Ñ”˜ÔPQÒPQ”ÙÐQRTQ“˜ÙÐQRPQ“ØÝÐPÒPQ“’Ñ“ÒÑ”RQ”RQ”‘ÝÑ”‘ÝÑ”ÙÑ”QÙÑ”ÙÑ”ÔQ”ÙÑ“ÑÙÑ“ÑÙÑ”ÙÑ”ÙÑ”ÙÑ”ÙÑ”ÝÑ“ÒQ“’Q“’Q“’Q“RQ“Q“Q’ÒQ’ÒQ’ÒQ’ÒQ’ÒQ’ÒQ’ÒQ’ÒÑ’ÒÑ’ØYÐPÒPQ”ÒTQ”ÒYÑ•]Ñ•R]Ñ•’Q•RQ•’”Q•R™Ñ•Ñ”ÒÐQ”’ÐQ”’ÔQ”RÐQ”’ÐQ”’Ñ”’Ñ”’™Ñ”’™Ñ”R”QNYÐUQNVPTRQNV™ÐS’]ÑXPPRÒYÑØYÐQÒTQ‘RTQ‘’PQ’Ñ’’Ñ“Q“‘ÝÑ”ÙÑ”‘ÔQ•Ñ•‘™Ñ–”Q–‘”Q˜Q]Ñ˜ÑYÑ™TQ™QPQ™‘PQ™‘Ñ™ÑÑšQ]ÔÐQÔ™Ð\QQ]ÔPPQTÐ\QQ]”ÐP\Q]”ÔP\Q]TÙÐ[ÐÝÑ]TÝÐ[ÙÑ]ÝÐ[ÔQ]P[PÔQ\•P[ÐQ\•P[Ñ\•ÐZÐ™Ñ\•ÐZÐQ\ÕÐZ]Ñ\ÕÐZYÑ\ÕÐZTQ\ÕÐZTQ\•PPYÐPQ\•TPYPQ\UYÐYPPQ[Õ]ÐYPPQ[•PYPQZ•™ÐXÐPQX•ÐPYPPQXUÔPZPPQV•ÙÐ[TQVUÙÐ[PTQVUÙÐ[TQV•ÙÐ[ÐYÑVUÙÐ[ÐYÑVUÙÐ[Ð]ÑVUÙÐ[Ð]ÑV•ÙÐ[ÐQVUÙÐ[Ð”QVÙÐ[”QVÙÐ[PÑU•ÙÐ[ÑU•ÙÐZÔQTÕÝÐYÝÑTPVH‹˜[Y\ËLËMŽˆ˜]ÐSPQTÑT–QQV™ÐT–QRPTUÔQXYPRÑ[”PP™ÐR™Ñ^™Ñ]ÕÑPÖP\ÝÑ\•ÔQ]ÕÐQ^•ÑLU™ÑLÕ”QMUQMÕ]ÑN]ÑNYÑLÚQPP[P“ŒP•‘PSÑ‘PSÚŒ‘UNTÐ•QÐ•ZÐ•ZÐP•MZŽUPÌ‘UZ]Ð•ÐUž]Ðš•PUÚ]Ð–^]Ð–^]Ð–^\Ð–ÜÐ–ÛÐ–ÐPU\UÐÓTPQÐQšÑšRÑšÐQPÓP˜ÒÙÑ™ÐQ™’Ñ™Ò”QšQ˜™ÔQPPÔP•ÛÒPPRZUœÚUœÚPUžZTPRRTQ™ÔQPQÐP–VRPPQÒPTPRšÝÑPPVšÐPRÙPTPTRPQÔTŽšÔQYV‘P’ÑÔTŽšÔQYV‘P’ÑÔTŽšÔQYTV[PR[Ð’ÑQ’™ÐÒÐTŽ^UPZ]ÑYTS[R\Ð’ÑPÒ”PÓTÔPšQZÐV]Ð’]ÑÓTÓPšQZÐV[Ð’QÒTÓP™MNPLVZPTPR’Q›QPPV–PPQÚTPQRQ“ØÝÐSZÑPP’]ÐPSÔPTPP’QQÒÝÐ‘ÒQ“R”Q“™Ñ’ÒÑ’RÔQP’ÝÐ‘RÝÑQÓ”PMSQQSÐL“ÑP“ÐPLSÙÑ^SÝÑ]ÓÝÑ]“ÝÑ]ÙÑ]SÔQ]SÐQ]SÑ]“™Ñ]Ó”Q^SQLQLS]ÑLÓ]ÑMSYÑNTQNSPQ“PQ‘Ñ‘ÓÑ’SQ’ÓQ“ÒÝÑ”RÙÑ”ÒÐQ•’™Ñ–RQ˜’]Ñ™TQ™’ÑšRQP’Ðš’Q›ÔQœÐQœ‘ÑœÑ™Ñ”QQQ‘]ÑÑYÑžTQž‘TQž‘PQUTP^‘ÑMTÔPQÕTPLÑMÝÐQYÐ^‘ÑMPQVP\QÑL–Ð[ÑÑLVÐ[‘Ñ^VPP[QQ^VPP[QQ^PP[PÝÑ^PP[PÝÑ]ÖPP[ÙÑ]–TPZÔQ]VPPZÐÐQ]VTPZPÑ]VYÐZÑ]]ÐYP™Ñ]PYP™Ñ\Ö”PXÐ”Q\Ö™ÐX”Q\–ÐXPQ\˜TPV]Ñ\XYÐV]Ñ[ÙÐP˜]ÐVYÑZR™ÐP˜]ÐXPYÑX˜]ÐXÐTQX˜]ÐYPQX˜]ÐZPQXX]ÐZPPQXX]ÐZPQXXYÐ[PQX˜YÐ[PQX˜YÐ[PPQX˜YÐ[PPQX˜YÐ[PPQX˜YÐ[PPQX˜YÐ[PPQXX]Ð[PQV˜PZTQVÐY‹˜[Y\ËLËMHŽˆ˜]ÐRPPQXYÑR™ÐRYÐP˜PQSPS™ÝÑPP‘ÔP’‘ÓP’›RP’ÑÒP’ÑÓP’Œ”P’ÐPTšPUšPU™ÐU™ÐU™PUUU–TQ˜Q’ÐTZQPU[ÐU^UMQPU‘‘PU’‘TQ’QLRPUNQPU”ÐU–PU™ÊÐU›ÍUUÐLÐUÑLUŒ•PTPQ”Q™[QPPZ”P–”P–“P–QP–’P–QP–”P–P–P–‘P–P–N–PÎ–ÚÐPT]PUÑÖTPRQPQÍ–MVPPJÞPTPTSQÕÐTÌ›Ñ]V˜Ð“QÖTÝÐ›TQ\ÐVšÐ“QÖTÝÐ›TQ]TTLR‘P“QQS]ÐÔÐTÌ^“PZÙÑ^PV“P“YÑÕUP›Q^V”P“TQÕPUPšÝÑ^V“P“TQÔÐUPšÔQ^VP“TQ‹ÝQPQP–PP’ÌTPR“YÑQSÐP”ÝTQPP•PZ™ÐT^™Ð”Z™Ð”UÐ”QÐ”šÐ”Ð^ŽSšÐP“‘PP“‘PP“LP“ZŽ“Z“ZŒ“ZÐ“‘Ð“šœÐ“ÑÐ”Ð”UÐ”•Ð”š˜Ð”Þ–P•P•^“P••P•ž‘P•ÕP–Î–M–\Ð–^ZÐ–šXÐ˜PÖP˜ZTP˜ÑP˜žPP˜ÐŒ˜ÞÐ™œÐ™›Ð™Ð™Ð™P˜Ð™T–P™ZP™^P”ÕŽSP“P”ÕÔPRÞP”ÕÛÐR”‘P”Q’PPÑÛÐR”‘P“ÌTPP•ÛÐR”‘P“ÕÛÐR”‘P“Œ›ÐR”P“›[ÐR”N“‘ÛÐR”M“‘ÛÐRL“‘ÛÐR]ÝÐ“LœÐRT\Ð“LœÐRT[Ð“[]ÐRÚÐ“[LRZÐ“QÍQÝÙÐ“ŽQÔYÐ“NQØÐ“NQØÐ“ÎQ™ÖP“ÎQ™ÕP“ÌQÐUP’ÛLQÐSP’ÕÌQÐRP’ÙÐPUÝÐQÝÒP’\ÐRQP’ÜÐRÑP’ÜÐRYÐP’ÛÐRPP’ÛÐR”PP‘Ì›ÐR™ÐP’ÛÐRÐP’ÛÐRÐPP’ÛÐRÐPP’ÛÐRÐPP‘Ì›ÐRÐPP’ÛÐRÐPP‘ÌœÐR™ÐP‘Û]ÐRQP‘ÒÐPÝÏOH‹˜[Y\ËLËMˆŽˆ˜PPRPQÖ™ÑRØÙÐRÖ”QRØÔPT]ÑSÐPTÖYÑZTQZ–TQZÖYÑZ–YÑZ–PQZÚTQPP‘Ž’–YÐPYU˜ÐU˜U˜U’PTZPQTMVQT’–QÐU^ÐU]ÌTR‘Q]ÌPTT’PQXÌPTU‘Q\ÌTYQNUUŒUUUÐ^UÒ]ÐUÓ]UÕ]UÕ]PUÐÔTPQSÑ™ÚÑPPÎ–PPPR^UŒÐUUŽPUÐ]UÑ]UÐ\UÑ\UÐ\PUÐ\UQTPQ›QPPšZÐ•ÛÖPPSÔÐTPRÒÔQ˜ZÔQPQÙÐ•ÍPPPMÐU“TPT’ÐQŒÒÐQŒÒÐQŒÒÐQŒÒÐQQÓÐÒÐQQSÐÒÐQQÐžÐQQÐžÔQP“PžSQžSQžSQžSQžSQž“Qž“Qž“QžSQžQÓQ“Q™šÑPPÞL•PURPPYÝPTTLQQŒÐPZÝTRLQQLUPLUUPTTNQLTRNQNPTQKÐQJÐUJÐUNPUNUMÐUMUMPUMUMULÐUÌÐUÌUÌPUUR^PUXÞUZÝÐU]ÝUNU“\ÐU–\PU™ÛUŒPUŽÐUÑZUÔZUÖYÐUÙÙPUÜØÐUÍUÎPVVVVPVVVUÐVUVÕPVÕPVÕVÔÐVUTPQPTUPYPT™ÐPÎUPÍUPÛÔU›PÙÔPUœPÖTUœPÖSÐUœPPÕSUœPPÕSPUœPPÕSUœPPÔRÐUœPÓRÐTÎ\PÓRTÎ\ÐPÒRTÍ]PÑRPTÌ]PPÐRPTÞPŽTÞÐPŽÐTÞPPŒTÝP›ÑPTÛÐP›ÑTÙÐPÐÐTMPŒÐTžPÐPTžPÒPTÐPÔPPTÐPÖPPTÐPØÐPTÐPØÐPTžÐPÙÐPTÐPÙÐPTžÐPÙÐPTžÐPÙÐPTžÐPÙÐPTPØÐPTœPPÔPTšQTPUÈ‹˜[Y\ËLËMÈŽˆ•TPSÕPQTUÑTÕQTÔ™ÑP•PTTQVPQTTQZÐQÑ[”PSÑLQLÔÑQ]ÐP””P]ÔTQP”]Ð^”PQLÔÑMÑMQL™PP”QLSÝÑLSÝÑL“ÙÑM“ÙÑMÓÔQNSÐQKÓPQP“ÐPKÓÑQSÐPSQQ“Ð“QQÓÐÒÝÑ“ÒÙÑ”ÝÑ“ÒTQP“P“RPQQP“RÑQÒ™ÐP’ÔP”RÑ•YPQ’Ñ•™PQRÑ•ÙÐPÒÑ•ÒÑ•ÒÑ•RÑ•RÑ•’Q–ÝÑ–QÙÑ–QÔQ–‘ÐQ–‘Ñ•]ÐQ‘™Ñ•]ÐQQ™Ñ”ØPPÑ”Q•”Q•”Q•”Q•™Ñ”‘™Ñ”Q™Ñ”™Ñ””Q””Q””Q”Q”QQ”‘]Ñ”Ñ]Ñ•]Ñ•Q”Ñ”Q”‘Q”ÑQ”Ñ]Ñ•YÑ•QTQ•‘PQ•ÑPQ•ÑÑ–Ñ–Ñ–QÑ–‘Ñ–‘Ñ–‘Ñ˜QÑ˜‘ÑXRÔP‘QXRÔPÑQV’ÙÐ‘˜ÐPQ™ÐP‘QV“P“‘QXSP“‘QV“P”QVSP”QQVP”QQVP”QQVP”‘QUÒÝÐ”ÑQUÒÙÐ•QVÔP•QQVRÐP•‘QV’ÐP•‘QV’Ð^UÙÐZÝÑXR™Ð^–PZÝÑXR™Ð^–ÐYÝÑXR™ÐLPPXÐÝÑ”VTPXQQ”V”PUÑQ”XTPT‘Q”˜PS‘Q”˜PSQQ”Ø™ÐR‘Ñ”ØÐPQ‘Ñ”ÑTQTTP‘]ÑSRPP‘”QR’Ð‘‘ÝÑPÒÐ’Ñ’RQ’ÒQ“ÙÑ“ÑÔQ”Ñ•™Ñ•Q”Q•‘”Q•ÑQ–]Ñ–QYÑ–‘TQ˜QPQ˜‘PQ˜‘Ñ˜ÑÑ™QÑ]TPQ””P[‘Q]T™Ð[QQ]Ð[QQ\ÔÐP[Q\”ÐP[Q\”ÔPZÑQ\TÔPZÐÝÑ\TÔPZÐÙÑ\TÔPZÔQ\TÔPZÐÔQ\ÔPZÔQ[ÔÙÐZPÐQ[ÔÝÐYÐÑ[ÔÝÐYÑ[ÕPYP™Ñ[ÕPYÑ[UÐX™Ñ[UPPV”Q[TPVQZÕ]ÐUÐQZPVP]ÑXÕPVYÑX•PXYÑV•PYYÑV•PYÐTQV•PZTQV•]ÐZPQXU]ÐZÐPQXU]Ð[PQX•]Ð[PQX•]Ð[PPQX•]Ð[PPQX•]Ð[PPQX•]Ð[PPQX•PZÐTQV•”PZPYÑUÕÐPU˜™ÐQÙÐPÈ‹˜[Y\ËMLŽˆ•YÐTÑUUQVQV”ÝÑX”ÙÑYÔQY”ÐQZÐQZÑZ”™ÑZÔ”Q[””Q[””Q[”Q[ÔQ\Q\Q\Q\Q\Q\Q\Q\Q\]Ñ\TPQP”]Ð\ÝÑ^ÑLQP“PP“™ÐLRÔQ’ÑÒ™Ñ‘”Q‘RQ‘’]Ñ‘’TQ’PQ’RÑ’’Ñ’’Ñ’’Q’ÒQ’ÒQ“Q“QÝÑ“ÑÙÑ”QÔQ”‘ÐQ•Ñ•Q™Ñ•‘™Ñ•‘”Q•Ñ”Q•ÑQ–]Ñ–Q]Ñ–Q]Ñ–YÑ–QTQ–QPQ˜‘Ñ˜ÑÑ™QQ™‘Q™‘Q™ÑQ™ÑQ™ÐÝÑšÝÑšÙÑšPÙÑšÙÑšÐÔQYRÐP’ÔQYÐP’ÔQXÒÐP’ÐÐQYÐP“ÐQYÐP“ÐQXÒÐP“ÐÐQXÒÐP“ÐÐQX’ÐP”ÐQXRÐP•PÐQXRÐP•ÐÐQV’ÐP–ÐQV’™Ð]•™Ð\PÐQVR”P]ÕÐ\PÐQVR”P]ÕÐP\PÐQVR”P]ÕÔP\PÐQVRP^ÙÐ\ÐQVRP^UÙÐ\ÐQV’]Ð^•ÝÐ[ÐÑXR]Ð^–P[PÑ”VÐZÐÑ”–TPZPÑ”–YÐP–PY™Ñ”ÖPP–™ÐXÐ™Ñ•™ÐXÐ™Ñ•˜PPXP™Ñ•ØTPVPÑ–]ÐUÑ–˜”PTÐÑ˜X™ÐTPÑ˜˜ÐSÐÐQ˜˜ÐPSPÔQ˜˜ÙÐRPÙÑ˜™PP™ÐPÝÑ˜ÑPQ–]Ñ•ÑÐQ”ÑÐQ•Ñ•QÑ•‘Ñ•Ñ™Ñ–”Q–‘Q˜Q]Ñ˜ÑYÑ™QTQ™‘PQ™ÑPQ™ÑPQ™ÑÑšÑ^YÐ]QQ^T]Ð]Q^T”P\ÝÑ^T”P\ÝÑ^™Ð\ÙÑ^Ð\PÙÑ^ÐP\PÙÑ]ÔÐP\ÙÑ]”ÔP\PÙÑ]TÙÐ\ÙÑ]ÙÐ\ÙÑ]ÙÐ\ÙÑ\ÔÝÐ[ÐÙÑ\ÔÝÐ[ÙÑ\ÔÝÐ[ÔQ\ÔÝÐ[PÔQ\”ÝÐ[PÔQ\UPZÐÐQ\UPZÐÐQ\PZPÑ[ÕÐZÑ[ÕÐYÐÑ[•TPY™Ñ[UYÐYP™ÑZUPXÐ”QZUPXÐ”QZ”PXÐ”QY”PXÐQY™ÐXQXÕ™ÐXÐ]ÑXÕ™ÐXÐYÑXÕÐXÐYÑX•ÐYTQXÕÐYTQX•ÐYÐTQX•ÐZPTQXUÐPZÐPQX•Ð[PQXÕÐ[ÐPQYÐ\PQYUÐ\PQYUÐ\PQYUÐ\PPQYUÐ\PPQYUÐ\PPQYUÐ\PPQYUÐP[TQXÕÔP[YÑXYÐQÈ‹˜[Y\ËMLHŽˆ•TPTUÑTÕQUÕQV”ÝÑX”ÙÑYÔQY”ÐQZÔQZÑZ”ÑZ”™Ñ[™Ñ[T”Q[ÔQ\Q\Q\Q\Q\Q\TQ\TQ\TQ\TQ\T]Ñ\TTQ\ÔQP”Ð]ÙÑ^ÐQ^’ÝÑKÒÔQRÐQ’ÑÒ”Q‘RQ‘’]Ñ‘ÒYÑ‘ÒTQ’TQ‘ÒPQ’PQ’RÑ’ÒÑ“Ñ“Ñ“’Q”Q”QÝÑ”‘ÙÑ”ÑÙÑ•ÔQ•QÐQ•‘ÐQ•QÑ•‘Ñ•‘™Ñ•Ñ™Ñ•Ñ”Q–Q–‘]Ñ˜QYÑ˜ÑTQ™TQ™PQ™‘PQ™‘Ñ™ÑÑ™ÑÑ™ÑÑšQÑšÑÑ›ÑYP’QQXÓP’QXÓÐ’‘QX“P“QX“P”QQX“P•QQX“P•ÑQXSP–QXSP–QV“P–QQV“P]ÝÐ\‘QV“P]ÝÐ\ÑQVSP]P\‘QVP]P\QQVÝÐ]Ð\QVÙÐ]–Ð[ÑQVÙÐ]VPP[‘QVÔP]ÖTP[PÝÑV’ÔP^]ÐZÐÝÑXRÐP^V”PZPÙÑYÐP^–ÐYÐÙÑ”˜]ÐXÙÑ”Ø™ÐVPÙÑ”ØÐUÐÙÑ”ØÔPUÙÑ•ÙÐTÙÑ•XÝÐTÙÑ•™PSPÙÑ•ÙÐRÐÙÑ–ÐRPÝÑ•ÑQ•ÑQ–Q–Ñ•‘TQ•Q™ÑR’TP‘’PQ’PQ’RÑ’ÒÑ’ÒÑ“RQ“ÒQ”ÙÑ”ÑÔQ•ÐQ•‘Ñ–™Ñ–Q”Q–‘Q˜Q]Ñ˜‘YÑ˜ÑTQ™TQ™PQ^”P\QTQ^”P\TQ]Ô”P\QPQ^™Ð\QPQ]Ô™Ð\QPQ]”Ð\PQ]”Ð\Ñ]”ÐP[ÑÑ]”ÔP[‘Q]”ÔP[‘Q]ÔP[‘Q]TÔP[ÝÑ]TÔP[ÙÑ]TÔP[PÔQ]TÔP[Ñ]”ÙÐZÐ™Ñ]”ÝÐZP”Q]•PZQ]UPYÐ]Ñ]•ÐY]Ñ]ÐYPYÑ\ÕPPYTQ\ÝÐP•TPYTQZUYÐXÐPQZU]ÐXPQZ]ÐXÐPQY•]ÐXÐPQYUPXPQXÕ”PXPQX•”PYTQVU™ÐYTQV™ÐZTQVÐZYÑUÕÐ[YÑUÕ™Ð[]ÑU•™Ð[ÐQU•™Ð\”QU•™Ð\P™ÑU•™Ð\P™ÑU•™Ð\PÑUU™Ð\PÐQU™Ð\ÔQTÕÐ[ÙÑT•ÐP[QS•ÔPZ]ÐPˆ‹˜[Y\ËMLˆŽˆ•ÐSQT•]ÑUUTQVUTQV•PQX•ÑYUÑY•QZQZ”ÝÑZÔÝÑ[ÙÑ[”ÙÑ[”ÙÑ[”ÔQ[ÔÔQ[ÔÔQ[ÔÔQ[ÔÔQ[ÔÔQ\ÔQ\ÔQ\ÔQ\ÐQ\TÐQ\ÐQ\YÑ]”TQ]”Ñ^SÝÑLYÑNSPQKÓÑSQ“QÒÝÑ‘ÙÑ‘RÔQ‘RÐQ‘’ÐQ‘RÑ‘Ò™Ñ’Ñ’™Ñ’’™Ñ’’”Q“Q“R]Ñ“ÒYÑ”TQ”RPQ”’PQ”’Ñ”ÒPQ”’Ñ•Ñ•Ñ•Q•RQ•‘ÝÑ•ÑÝÑ•ÑÙÑ–ÙÑ–QÔQ–‘ÐQ˜QÐQ˜QÑ˜‘Ñ˜‘Ñ˜‘Ñ˜‘Ñ˜ÑÑ˜Ñ™ÑXÓPQ™ÑX“”P‘™ÑXS™Ð‘™ÑXS™Ð‘™ÑXS™Ð‘‘”QX“™Ð’Q”QXS™Ð“”QXS™Ð“‘”QV“”P”Q™ÑVS™Ð”Q™ÑVS”P”Ñ™ÑV”P•™ÑVP•Q™ÑVP•‘™ÑVP•Ñ™ÑV]Ð–™ÑVSYÐ]TP\™ÑV“TP]VYÐ[Ñ™Ñ’Ö”P[”Q“ÐZ‘™Ñ’ØTPYÑ™Ñ’ØYÐY‘”Q“PXÑ”Q“ÐV‘”Q“ÐPV”Q“XÔPU‘”Q“XÙÐU”Q“XÝÐT‘”Q“YPSÑ”Q“™ÐSQ™Ñ“™PPR‘Ñ“™YÐQÑÐQ“‘ÔQ“‘ÝÑ“RPQ’’Q‘Ò]Ñ’RYÑ’ÒTQ“RPQ“’Ñ”RQ”ÑÙÑ•ÑÔQ–ÐQ–‘Ñ˜Q™Ñ˜‘”Q˜ÑQ™Q]Ñ™ÑYÑšTQšQTQš‘TQš‘TQšÑTQLÐ]‘TQ^”ÐP]‘PQ^”ÔP]PQ^TÔP]QÑ^TÙÐ]Ñ^TÝÐ\ÑQ^UP\‘Q^UP\‘Q^P\PÝÑ]ÕÐ\ÙÑ]ÕÐ[ÐÔQ]ÕÐ[ÐÐQ]ÕÐ[Ñ]ÕÐ[P™Ñ]•Ð[P”Q]UPP[P”Q]TP[Q]TP[]Ñ]YÐ[YÑ\•PZTQ[Õ”PZPQZUÐZPPQZÐPZPQYÕÝÐ[PQY–P\PPQYP]PQX–P]PQXVÐ\ÐPQV–Ð\TQVVÐ\YÑVTP\YÑVPP\P]ÑUÖTP[Ð]ÑUÖTP[ÐQUÖTP[P™ÑU–YÐZÐ™ÑUÖYÐZÑU–YÐZPÐQUVYÐZÔQUYÐYÙÑTÖYÐYÝÑT–]ÐVQQTPUH‹˜[Y\ËMLÈŽˆ•™ÐS•QTÕYÑU•TQVUPQXUÑXÕÑYUQYÕQZQZTÝÑZÔÝÑZÔÙÑ[TÙÑ[”ÔQ[ÔÔQ[ÔÐQ\TÐQ\TÐQ\TÐQ\TÐQ\TÐQ\TÐQ\TÐQ\TÐQ\ÐQ\Q]PQ]ÔÑ^TQLPQKÓÑ“QÒÝÑ‘RÙÑ‘’ÔQ‘ÒÐQ‘ÒÑ’™Ñ’”Q’R”Q’RQ’Ò]Ñ“]Ñ“R]Ñ“’YÑ“ÒTQ”PQ”’PQ”’Ñ”ÒÑ•RQ•’Q•’Q•ÒQ•ÑÝÑ–ÝÑ–ÙÑ–QÙÑ–ÔQ–QÐQ˜QÑ˜ÑÑ˜Ñ™Ñ™”Q™‘”Q™‘Q™ÑQ™ÑQ™ÑQ™ÑQ™ÑQšQš‘QXÓ]Ð‘‘]ÑX“]Ð‘ÑYÑX“P‘ÑYÑX“P’QTQXÓP’‘TQXÓP“TQX“P“‘TQX“P”‘TQX“P”ÑTQX“P•TQXSP•QYÑV“]Ð•ÑYÑVS]Ð–YÑVSYÐ\ÖPP\‘]ÑVYÐ]TP\Q]ÑVTP]YÐ\]ÑVSTP]V]Ð[Ñ]ÑV“PP]–P[‘]ÑXSÐ]Ö™Ð[]Ñ“˜PPZ‘]Ñ“˜YÐZ]Ñ“˜PY‘]Ñ“˜”PP˜ÐX‘]Ñ“˜ÐX‘]Ñ“˜ÔPVQ]Ñ“˜ÝÐU‘]Ñ“ÙPUQ]Ñ“ÙPTÑ]Ñ”ÐTQ]Ñ”YPPSQQ”YTPRÑ”Q”Y]ÐR™Ñ”‘™Ñ”ÑÝÑ“ÒÑ“YÑ’’YÑ’ÒYÑ“PQ“ÒÑ”RÑ”ÒQ•Q•‘ÝÑ•ÑÔQ–‘Ñ˜QÑ˜‘”Q™Q™Q]Ñ™ÑYÑšQYÑš‘TQ›PQ›‘PQ›ÑPQL”Ð^PQLÐP^PQ^”ÐP^PQ^TÔP]ÑPQ^ÙÐ]‘PQ]ÔÝÐ]QÑ]ÕP]Ñ^P\ÑÑ]ÕP\ÑQ]ÕÐ\‘Q]ÕÐ\PÝÑ]ÕÐ\ÙÑ]•Ð\ÙÑ]•PP[ÔQ]UPP[ÐQ]UTP[ÐQ]TP[Ñ]YÐ[PÑ\Õ]Ð[P™Ñ\•P[”Q\U™ÐZQ\ÐZQ[•ÙÐYÐ]ÑY–PY]ÑYVPYPYÑYVÐYPTQYVÐYPQYÐYÐPQXÖPPZPPQXÖYÐZPQX–TP[PPQX–YÐ[PQXÖYÐ[ÐPQY]Ð[ÐPQYVYÐ\TQYV]Ð[ÐYÑYV]Ð[ÐQXÖ]Ð[Ð”QX–]Ð[ÐÑV–]Ð[ÐÔQV]Ð[ÐÙÑUÖ]Ð[‘QTÖPZÈ‹˜[Y\ËMMŽˆ˜ÝÐSØÐQUXÑV™ÑV˜”QX˜QYX]ÑYØYÑZTQZ˜TQZØPQ[VÑ[–Ñ[–Ñ[Ö™Ñ\”Q\V”Q\V”Q\–”Q\–”Q\–”Q\–”Q\–YÑ]VQLÙÑL•ÑMQMÕTQJÕÑUÑUQ”ÝÑ‘ÙÑ‘ÐQPPÕZÐ”’ÎP]PUUÝPTPS”Ñ‘Ü”QPQÐ”œLPNQÐUY\ÐTPT”™Ñ’QPQUVP”ÒÜÐP’‘U[\TPTÔ”Q’œYÑPQLP”Í›ÐP“‘PU^\TPUT”Q“PQPQ•TP•YÐP•‘UM›TPUÔQ”œÑPQŒP™USP™ZÓP™ZÓP™ZÓP™ZÓP™ZÒP™LP™LP™LP™LP™LP™USP™UTP™QTP™P™P™ÔP™TP˜ÌP˜ÕUP˜ÑTP˜ÑTP–ŒP–ZÔP•ÒŒPU‘PU\PUR‘UUÐUÐUPUKÐUKÐUJÐUNPUNPUNPUNUžPPQMÐUÍUQMUTMPUXÍU\ÌÐULPU•^UšÞPUœÝÐUŽPUÒ]UÔ\ÐUÖ\PUÚÛÐUÝÛUÍVZVZVYVÙPVÙVØÐVØPVVPVVPP‘ÑÐPT–P™ÔQUVRP‘”Q‘VPPLÑQ‘VYÐLQÖÐ]‘QX]Ð\‘QNX”P\QNÐ[‘]ÑNÐ[‘YÑMØÐ[‘TQMØÐ[‘PQMØÐ[‘PQL˜Ð[QÑL˜ÐPZÑÑLÔPZ‘QLÔPZQQ^˜ÙÐYÑQ^˜ÝÐYQQ^XÝÐYÝÑ^YPXÙÑ^YPXPÔQ^YPXPÐQ^PXPÑ^PXP™Ñ]XÝÐXP™Ñ\ØÝÐXP”Q\XÙÐX”Q[ØÙÐXPQYØÙÐX]ÑYXÙÐXYÑYXÙÐXÐTQYXÙÐYPTQYÔPZPQXØÐPZÐPQXØÐP[PQX˜ÐP[PPQXXÐP[PQXXÐP[PQXXÐP[ÐPQXXÐP[ÐPQXXÐP[PQXXÐP[PQV˜ÔP[PQVXÝÐZPYÑUYPSÚQPPYÏOH‹˜[Y\ËMMHŽˆ™PT˜ÝÑUXÙÑVÔQV˜ÐQXØÑYX™ÑYØ”QZXQZ˜]Ñ[]Ñ[XYÑ[˜TQ\TQ\XPQ\˜PQ\˜PQ\˜PQ\ÖÑ]Ñ]Ñ]™Ñ]VÑLVQLÝQPP›Ð“ÍÒPP[TQ–Q^TPS”QKÜÐQPQ’P”\PPMTURÝTPTUPQÜ™ÑPQUN”MP’“ÐUTÝTPUQ‘\”QPQLÐ”˜]ÐP”“UUÜÐTPUTÙÑ‘Ü]ÑPQ•[Ð”œ\ÐP•’UY\TPU”ÐQ’\YÑPQšÙÐ”ÒÛÐP•’PUZ\PTPU”Ñ’\TQPQšÖP”Í™ÐP™ÐU‘ÛPTPV”™Ñ”QT”QTQ”Q”QŠÔ]ÑÐPUSP™ÔQ‘VRP”]ÑÐÐURP™ÝÑÐVSP”YÑÑURP™ÝÑÐVRP”YÑŽYÑÔYÑTYÑŒÔYÑŒ”YÑ”TQœ\QPPZÑP–•QP”’VPPU
ÓTPSTTQLTPQLTQ^TTQ^PQ^TÑ^TÑ^Ñ^Ñ]ÔQ^Q^ÝÑ^SÙÑ^“ÙÑLSÔQMSÐQNSÐQSÐQ‘SÑ’“Ñ“™Ñ“Ó”Q”“Q•Ó]Ñ–SYÑ˜STQ˜ÓPQ™SÑšQšÒÔQ›ÒÐQœÑœ’”QYÑÒTQžPQžRÑŒQŒRQŒ‘ÝÑŒÑÙÑÔQQÐQ‘ÐQ‘ÑÑÑÖÐ^‘Ñ–]ÐP–™Ð\‘ÑKØPP\ÑJØYÐ[‘”QJØYÐ[‘QJØYÐ[‘]ÑJØYÐ[‘YÑJØYÐ[‘TQNX]Ð[QTQM˜]Ð[PQM˜PZ‘ÑMX”PZÑM™ÐY‘QM™ÐYQQM™ÐYQLØ™ÐXÐÝÑL˜™ÐXÙÑL˜™ÐXÔQLX™ÐXÐQLX™ÐXPÑ^˜™ÐXP™Ñ^X”PXP™Ñ]X”PXP™ÑZ’ÙÐP“PP“ÐQX”PV”QZ”PXPQY˜PXÐQYXPYP]ÑYXPYÐYÑY]ÐZTQY]ÐZÐTQXØ]Ð[PQXØ]Ð[PPQXØ]Ð[ÐPQXØ]Ð[ÐPQXØ]Ð[ÐPQXØ]Ð[ÐPQXØ]Ð[ÐPQXØ]Ð[ÐPQX˜P[PTQV˜”PZÐYÑV‹˜[Y\ËMMˆŽˆ™PSØÙÑUXÔQVÑX˜™ÑY”QYØQZX]ÑZ˜]ÑZØYÑ[XTQ[ØTQ[ØTQ[ØPQ\XPQ\VÑ\–Ñ\–Ñ\PQPPUØÐ’ÍÕPPV›TÝ^TPS™Ñ\ÜÙÑPQÒP“X‘PPNYUÝÐTPTVQLœÑPQU›Ð“ØNP‘–U]PTPTÕ”QN\™ÑPQ[P”LP“”ÐU
ÝTPUTQ\”QPQLPP”RÝÐP””PUPÜÐTPUUÑœ]ÑPQ•L”MœÐP•“PUTÜPTPUÔÝÑ‘œYÑPQšÜÐ”˜[ÐP–’ÐUUÜTPUÔÙÑ‘œÑPQÑZÐ”œSPPžPU\XTPZÔÐQŒ”ÐQŒ”ÑŒ”ÑŒ”™ÑŒÔ™ÑŒ”™ÑŒT™ÑŒT”QŒTQŒ”QŒTQŒ”QŒTQŒQž”QžTQžQÔQÙÑPPUTP˜ZÓP˜QSP–•SP–URP–P•ÕQP•ŒP•QQP•P•P•Ž••Œ•Ð“›”PQšœÐ“–PQUÐ“›™ÐPÕÐ“ÚšÐ”UÐ”^˜Ð”ÕÐ•P•”P•‘P•ž’P•Ú‘P–P–M–Z[Ð–žZÐ˜TØÐ˜ÕP˜žSP˜ÚQP™ÐP™™™TÐ™^Ð™›Ð™šÐ™ÐQVPVRP‘ÑÑT˜ÐšQUÐVVP‘™ÑÑÐT–PšÑUÐUQ™PQ™QÐUZPQšQÕPU[QÕU\QTÐU\ÐPQPPÌÐU]ÐPÜÔUPØÔPUPØÔUPÖSÐUPÖSUPÖSPUPPÕSPUPÕSUÐPÔRÐUPPÒRUÐPÑRPUŽPPQ‹ÐPŒU‹ÐPÐU‹ÐPŽÐTÎÐPQÐPTPYP™Ñ]YÐQPRÕP“QPPPTÒÐTPY]ÑYÙÙÑPRPRP’RSPPÑPÐTŠÑTPZTQYYÝÑPR”QP’RPPØÐPTŒ‘TP[ÐPQXÙÝÑPRÔPP’SPPÚÐPTQTP\PPQXÙÝÑPRÙÐP‘ÍPPÛÐPTQTP\PPQX™ÝÑPRÔPP‘ÛÔPPØÐPT›QÐTPZˆ‹˜[Y\ËMMÈŽˆ•PTÝÑTÔÔQUÔÐQVTÑX”™ÑXÔQYÔ]ÑZTYÑZÔTQ[TTQ[TTQ[”PQ[ÔPQ\PQ\Ñ\TÑ\”Ñ\TÑ\TÑ\”Ñ\TÑ\TÑ\TÑ\TÑ\TQ\ÓÝÑ]Ñ^QLÝÑNÑKÒ™ÑRQÒ]ÑÒYÑ‘TQ‘RPQ‘’Ñ‘ÒÑ’Q’RQ’’Q’ÒQ’ÒQ“QÙÑ“ÑÔQ”QÐQ”‘Ñ”ÑÑ•™Ñ•Q”Q•‘”Q•‘”Q•QQ•Ñ]Ñ•ÑYÑ–TQ–‘PQ˜‘Ñ˜ÑÑ™Ñ™QÑ™QÑ™QÑ™QQ™‘Q™ÑQšQšQQšÑQXÒÔP’‘QXRÙÐ’‘QXRÝÐ’ÑQV’ÙÐ“ÝÑXRÙÐ”ÝÑXRÙÐ•ÝÑXRÙÐ•QQVRÙÐ•ÑQVÙÐ\•Ð\QQVÙÐ\•Ð\‘QUÒÙÐ\•Ð\‘QUÒÔP\ÕÐP\‘QUÒÔP\ÕÙÐ\QUÒÐP\ÕÝÐ[ÑQUÒÐ]P[‘QV™Ð]–P[PÝÑV’™Ð]ÖÐZÐÝÑ“PPZÝÑ“VYÐZÝÑ“–PYÙÑ“Ö™ÐYÝÑ”PPXÝÑ”XYÐVPÝÑ”˜PUÝÑ•”PUPÝÑ•X™ÐTÐÝÑ•˜ÐTQQ•ØÐPSÑQ–ÙÐSQ–ÝÐR‘Ñ–YPQ‘Ñ–QYÑ–”QQÔP”’Q“ÒQ”QÝÑ”ÑÝÑ•ÝÑ•QÔQ•ÑÐQ–QÑ–‘™Ñ˜Q”Q˜ÑQ™]Ñ™‘]Ñ™QYÑ™‘TQšPQšQÑš‘Ñ^”P]QQ^””P]QQ^T™Ð]QQ^”ÐP\ÑQ^TÙÐ\QQ^ÝÐ\Q^ÝÐ\QQ]ÕP\Q]•P\Q]UP[ÑQ]P[ÑQ\ÕP[ÑQ\ÕP[ÝÑ\ÕÐ[PÙÑ]P[PÙÑ\ÕÐZÐÔQ\ÕÐZÔQ\•PPZPÐQ\•TPYÐÐQ\UYÐYÐÑ\UPYPÑ\™ÐXÐ™Ñ[ÕÐX™Ñ[•ÐX”Q[UÐPXQ[ÐPXQY•ÐPXÐ]ÑYUÔPX]ÑYÙÐXYÑYÙÐXÐYÑXÕÝÐYYÑX•ÝÐYÐTQXÕÝÐZPTQX•ÝÐZPQX•ÝÐZÐPQXÕÝÐ[PQXÕÝÐ[PPQYÝÐ[ÐPQYÝÐ[ÐPQYÝÐ[ÐPQYÝÐ[ÐPQYÝÐ[ÐPQYÝÐ[ÐPQYP[PQXÖPZYÑV–PPSÈ‹˜[Y\ËMKLŽˆ”ÐRÙÐP–ÐP”QSÐPRT]ÑSU™ÐSQSPS””QSTPP•]ÐS””QXSÙÑQÔ”PXSÔQ[]ÐP–”PP“ÔQZÖÐS“ÙÑ^“ÝÑLS]ÑJÓPQÓÑ‘SQ‘ÒÙÑ‘˜ÐPP’ÔQ‘ÔQÒÐQ‘ÔQ‘QÓQ‘Ñ‘Q‘ÒÐQ“™ÑP’ÐP“RQP’™Ð“ÒTQ•RÑ–Ñ–RQ–’Q–’Ñ–RTQ“ØÙÐQÑ”ÑÝÑ•‘ÔQ–ÐQ–QÑ˜Q™Ñ˜‘™Ñ˜‘Q™]Ñ™Q]Ñ™QYÑ™‘TQ™ÜÑPP^P–UPPTTUŠÚÐTPQ‘PQ™›ÝÑPPšP–PU‘ÝÐP\RPPXÔTSUQ˜ZTPRQYÑP‘P–ÑPPÚP•ÖP\ÕU›XÐTPS‘YÑ˜[]ÑPQP•ÜÐPNUVTPTTQ˜›TQPQP–™ÐPTUŒ–TPT‘PQ™›ÑPQPN–V–PP‘SÐUÓÕPTPTÑQšÚÝÑPQYÝÐ–œPP’SUÙTTPTÐÙÑ›ÚÐQPQYÛÐ˜VMP“RUÝSTPUÐQœÚ]ÑPQYÐ˜’[ÐP”RUÌ’TPU™ÑZPQPQVP˜›ØÐP”QVÑÐTPUP”QÚQPQ]ÕP˜ÖTPP”QPVÑTPUPQž™YÐPÙÔQPQ”TP™[ÐPP•QV‘P]ÑÔPTSPš™ÑPÐVLYÑÓPTRPšYÑPÐVZÐYÑÒPTRPšÑPÐVVPTQÒTPPšPQPPVYÐPQÒPTPPšPQPPVYÐPQÒTPPšÑPPVUPPQÐPTPP™ÐP™™ÐP™”PP™]ÑP™TRP™ÓP™TP˜ÝÕP˜ÙØÐ˜ÔYÐ˜Ð[Ð˜ÜÐ˜™ÝÐ˜”]Ð˜”]Ð˜”L˜]ÝÐ˜\Ð˜”\Ð˜”[Ð˜™ÚÐ˜ÚÐ˜ÚÐ˜ÙÐ˜ÐYÐ˜ÐXÐ˜ÐXÐ˜ÐXÐ˜ÐXÐ’ÑÐQ•˜ÐRPVP’ŒXÐRPUP’›ÐRÕP’‘šÐRÔP’‘šÐRÓP’L[ÐRÓP’[ÐRÒP’U›ÐRTRP’Q›ÐRYÑP’QœÐR]ÑP’Q›ÐR”QP’Q›ÐR™ÐP’UšÐRÐPP’[ÐRÔPP’[ÐRÔPP’[ÐRÔPP’[ÐRÔPP’[ÐRÐPP’[ÐRÐQP’UœÐR”SP’ÐR]ÔP‘ÌLRTOOH‹˜[Y\ËMKLHŽˆ”ÔPQ•PQÔÑRUYÐR”™ÑRUPPRÔ”QR•ÐRÔQU•ÝÐP”QQ]ÐUÕÙÐQ“ÔQY•ÔPTÐQ^SÐQLÔQLÙÑLÙÑLYÑQÙÐ^“PQMX]ÐP“QM’ÝÑNRÙÑ’ÙÑ‘ÝÑ‘Ñ“ÑSQ‘RÔQ’R™Ñ“]Ñ”TQ”’Ñ•Ñ•RQ•’Q•ÑÝÑ•ÝÑ•QÝÑPÒÐ”’PQ”Ñ”RQ”ÑÝÑP’P”ÑÙÑ•‘ÐQ–Ñ–Q”Q˜QQ˜‘]Ñ˜ÑYÑ™TQ™PQ™\ÑPPTN–VPPSTUŒ›TPQQÑ™\QPP”M–SPPVSUŒšPTPRQ˜ÛÔQPPÐM•ÍPPZÔUœYPTPSÑ˜[”QPQN•ÜÐPMÐUXPTPTÑ˜›YÑPQÌ–šÐPNUžVTPTQQ™ÑPQT]Ð–PP‘SUÐÕPTPT‘Q™šÝÑPQT]Ð–R‘PP’SPUÐÔPTPTÑQ™ÚÑPQYÝÐ–VMP’SUÒÓÐTPT‘QPÑÐ™ZQPQYÎ–ÚÐP“SÐUŠÒPTPUÑ™šÑPQ]Ì–VVPP“SUÒÑPTPUQš™ÝÑPQL–[ÑPP•SUÓÐPTPUQQšÙÐQ™ÐU‘QšÙPQÙ”PUÝÑ›XÝÐYPÝÑÑT\ÐšQSVSPÝÑÐÐT\Ð™ÐQSVÐVÐVÒVÒVÒVÒPVÒPVÒPVÒPVÒVÒVÒPVÒPVÒPVÒPVRUÎÐUÝÓUÚÓPUÖSUÔSUÒSUŽUŽPUÐSUÒSUÒSUÓSUÓSUÓSPUÒSUÑSUÐSUŽPUÐSUÑRÐUÒRUÓRPUÔRUÕRUÕQÐUÖQUÖQPUØÐÐTÎPQPTÍP’’PÑPPTÍSPŽPTÌSPPŽPTÜPPÐPPTÚPÒPPTÔ[PQ“PÕPPTÓ“ÐPÖPPTÒ“ÐPØÐPTÑ“ÐPÙÐTÑ”PÙÐÐTÐ”PÚÐÐTÑ“ÐPÛÑTÑ“ÐPÛÑPTÐ“ÐPÛÑTÐ“ÐPÛÑÐTÐ“ÐPÚÒTŽSÐPÙÒPTSÐPÖRTžÐPÔSTœÐPÑSPT›PPÓÐT•”ÐP–OH‹˜[Y\ËMKLˆŽˆ•”PRYÑPÕTPP•]ÐRÔTQRUPPSTTQRÕÐSTYÑRÕÐS”]ÑVT]ÑVÐR“ÙÑQÔYÐ\ÔQLÐQLÓÑMS]ÑNSTQKÓTQNS]ÑMQL“”Q^“”QLÒÝÑ‘RÐQ’RÑ’Ò”Q“ÒQ”R]Ñ”’YÑ•]Ñ”ÒÑ”ÐQ“ÒÐQ“Ò™Ñ”RQ“XÙÐQRTQ”XÙÐQÑ•ÝÐP’Q•ÑÙÑ–QÔQ˜QÐQ˜‘ÐQ˜‘ÐQ˜‘ÐQ˜‘ÝÑ–QÙÑ–‘Ñ˜‘™Ñ˜Ñ”Q˜Ñ]Ñ˜X™ÐPÑ]Ñ–‘TQ˜ÜÑPPTP–VPPSTUŒšÐTPQ‘Ñ™[ÝÑPP™Í–RPPXÓUšTPRQQ™[ÑPPÙÝÐ–MP\ÓPUŠÙTPSPÝÑ™Û]ÑPQÝÐ^PUÜÐPNTQTPQVTPTÑ˜ÛPQPQPM––PP‘SÐUŒ•TPTÑÑ™[QPQTL–SPP’SUÐÔÐTPUQšÔQPQ]Ì–VPP“SPUÒÔTPUQšZQPQ”]Ð–[ÜÐP”SPUÒÒTPU‘QššPQPQLZPVPP•TUÑÑTPU‘ÑšQPQ”N–VRPP–TUÑÐTPUÑÑšYÐQPQ”N–[Q™Í––PP’ÐQÍ˜LÜÐQÌ™ÝÑSVRP‘QÐTL™Ì™™ÝÐ™]Ð™YÜÐ™]ÜÐ™T\Ð™P[Ð™P[Ð™ÚÐ™PZÐ™PZÐ™PYÐ™PYÐ™PYÐ™ÙÐ™ÙÐ˜ÔZÐ˜ÛÐ˜[Ð˜]ÜÐ˜P]Ð–L–TM–PM–PL–YÝÐ–]Ð–\Ð–™ÜÐ–™ÜÐ–™ÜÐ–™ÝÐ–”L–L–]Ì–]ÝÐ–\Ð–”\Ð–”[Ð–™ÚÐ–™ÙÐ–ØÐ˜PVP˜TVP˜TUP˜YÕP“PTRP“ÐQMRTRP’ÌRPPP’ÌPPR]ÐP’ÛPRÐPP’Ñ‘PRÔPP’›PRÙÐP’‘“PRÙÐP’[PRÙÐP’U“PRÙÑP’Q”PRÔRP’Q”PRÔSP’Q”PRÔTP’Q“PRÔTP’U“PRÐUP’U“PR™ÖP’Q“PR”XÐ’SPRYÐ’PR]ÚÐ’“PRP\Ð‘ÌSPR]Ð‘Õ”PQÔM‘•–PQOOH‹˜[Y\ËMKLÈŽˆ•ÙÐRÑRÔ™ÑQÕ™ÐRÔ”QRÕ”PRÔ”QS]ÐST™ÑV”ÐQV]ÐS”ÐQVTPTÔÐQ\ÔÑQÔÐP\ÔQL”Q^TQ^TÑ]ÔPQ]S™ÑNSQ“YÑ‘“TQ’SÑ“SÑ““Q”Ñ”YÑ“Q’“]Ñ‘™TPQSTQ‘ÙYÐQQ“RÙÑ”Ñ•]Ñ–TQ˜RPQ˜’Ñ™Ñ™RÑ™RÑ™PQ˜ÒPQ˜ÒQ™’Q˜YÐQ‘ÙÑ˜ÙÐQQÔQ™ÐQQÐQ™™PPPÑ™Ñš”QšQQšQQšQ]ÑšœÝÑPP^P–“PPUTÐUÓÝÐTPQÑTQšÜÑPPžP–MPYÔTUVQž\ÐTPRÑTQQ™Ð˜Ü]ÑPPÞP–ÛÐP]ÕUž[ÐTPSÑQ™ÑPQP–VPPNU›TPTQYÑ™œQPQP‘P–RÓPPTPUÒÚTPTÑPQš[ÐQPQZP–\P’TPUÓÙTPUPQš›QPQ^P–’ÐP’TUÕØPTPUÑ››TQPQ]Í–VPP”SUÚUTPUQQœ[QPQ]Ð˜\PP•SPUÜTTPU‘QœZÑPQ™ÜÐ˜’LP˜ÓUÞSPTPUÐÝÑœÚ]ÑPQ™ÜÐ˜–ZÐP˜ÓUÌKÐPQÒTPVÝÑYPQÚQPQÐ[Ð˜ŒÜÐRT[Ð˜ÒÐRÚÐšÐQRPVNÐQÓPTXÐš”QRV\Ð™ÑÒÐTVPšTQQÐVYÐ”QÒTUPšÑQVXÐ”QÒTUPšÑQVXÐ”QÑÐTVPšQRVRPÐQŽQPP]ÚÐ™T\Ð™]Ð˜ÙÍ˜Í˜™Î˜]Í˜]Í–Ì˜T]Ð˜YÝÐ˜]ÝÐ˜]Ì˜YÍ˜TM˜TL˜YÝÐ˜]Ð˜\Ð˜™ÛÐ˜ÛÐ˜ÚÐ˜ÐYÐ˜ÔXÐ˜ÙÖP˜ÝÔP™RP™ÑP™ÐP™ÐP•[PRPP“‘PR–PR]ÐP“RPPU™ÐRPP’ÑšÐRÝÐP’•›ÐRÝÐP’‘œÐSPP’[ÐSPP’QÐSPP’]ÐSQP’RÝÑP’RÝÑP’LRÙÒP’LRÔSP’LRÐSP’QŒRÔP’LR™ÔP’LR”TP’LR]ÕP’RTVP’RXÐ’ŽQÔ[Ð‘Œ‘PQOOH‹˜[Y\ËMKMŽˆ–TPTÖQV•ÐQYU™ÑZ]Ñ[PQ[ÕÑ[ÕQ[ÔÔQ[ÔÑ[T”Q[SÝÑP”]Ð[ÑRPP[™Ñ\“”Q\PPÓQ[Ö]ÐQ“PQ\ÙÐQVTPRSÑ\ÔPTXÙÐQ“Q[•ÔPTXÐRÒÝÑ[UÙÐSØ”PS’ÙÑ[UÝÐS˜PSÒÔQ[PPRVPSXYÐTRÐQZÕÐ\RÑZUÐ\™ÑZUÐ[’™ÑZPP[R™ÑZPP•TP]’™Ñ™™Ñ™’™Ñ™ÒQš’]ÑšÒTQ›RPQ›’Ñ›ÑšÒQšÒQ›RQ›’Q›ÒÑ›ÒÑ›ÒÑœPQ›ÒTQ›ÒYÑ›’ÐQšRÐQšRÐQšRÐQš’ÐQš’ÐQ™ÑPPÙÐ–YÐPR[ÐUŒÐUŒÐUŒUÜUÜUÜPUœÜPUœÜPUœÜPUœÜPUœÜPU›ÜPU›ÜU›ÛÐUšÛÐU˜ÛU™ÛUšÛPUœÛPUœÛUŒUÕ[UÖ[UÙÛUÛÛUÛÛUÝÛUÌPUÌPUÍPUÍPUÎPUÎV[V[VZÐVZÐVZÐVZÐVZVZVZÐVZÐUÎÐUÎÐUÍÐUÝÚÐUÝÚÐUÜÚÐUÛÚÐUÚÚÐUØÚÐUÕZU™PP[ÚPU™ÚU™ÙÐUšÙUŽPUÓYUØØUÛØPUÜÖUÌPUÎPVVVUÐVUÐVUVÕPVÕPVÕPVÕVÕPVÕVÔVPVVPP‘ÑÐTL™ÙÑSPVSPÝÑÑPT\ÐšQRÐVUPÙÑÑPTZÐšQRPVVPÐQÑÐTXÐšÑRVVP™ÑÒTUP“PUÙÔP’Þ•PSÑÍRÓP’Þ™ÐS‘ÎRRP’ÑÐSQÎRÒP’žRÛNRÑP’šÓPRLŽRÑP’LÐRPRTPP’LÐQ[P–PR]ÐP’[NR”PP’[MRÐP’UÍRÐPP’[MRÔPP’[MRÔPP’[MRÔPP’[MRÔPP’[MRÔPP’[MRÔPP’[NRÐQP’ÑPR”SP’PRPOOH‹˜[Y\ËMKMHŽˆ™PRÑPP–ÐÖ]ÐP[TZSTPRÙQRšTQPQÐ‘ÒP›œÐQÑÎÛ›ÐQÖP’\ÐPSžTÒÕTPS–™ÑNV]ÑÖTQ‘–Ñ’Ñ’Ñ‘VYÑVQNVQKÖ]ÑÕÙÑ“•”Q•ÕQ–•]Ñ˜•]Ñ™Q™PQPÕ™Ð˜PQQ]Ð™PPQQ•TP™PQRÐ™œ™ÑPPTPPÑ\ÐVÐPÕ[ÐVPPPÌÐVYÐP‘XÐV]ÐP‘VPV”PP‘ÕPVÑP‘PVÒP‘PXTRP‘QTPXTRP‘UTPXYÓP‘USPX]ÓP‘ZÔPPLÐV™ÔP‘LÐVÕP‘ZÖPXPVP‘LPV\ZÐPURT”‘QÓÜTPQÐQU”PšÜTQPPZÐ‘šÓPV˜[ÐPRST•ÐQÖSPT–ÐQÖST–QÖSÐT–QÖTT™PQØÔT–KÐQØÔÐT˜ÊÐQÙÕT™ÊÐQØÕPTšÎPQØÕT›ÎQÙÖTšÎQØÖPT›ÍQÛØPTœÌQÜØÐVTP’ÑÐTÐP™šQP™”ÓP™ZTP™TÕP™TÖP™TÙÐ™\Ð™ÝÐ˜ÞM˜ÔÎ˜ÐÎ˜ÐÎ˜ÐÎ™P™‘P™ÐQ^PVPP“]ÑÐPUPUÐY•Ð™•Ð™‘Ð™ZŒ™Q™Ž™Ž™™Œ™œÐ–’PP‘MUÐÝTPPÓÔQšSÑ›S™ÑœS”QœÓQSQ“]ÑžYÑž“YÑŒTQŒ“PQPQSPQPQSÑÓQŽQŠÒÝÑ‹ÒÔQÐTÙÐ™ÙÑ[VSP’™ÑÑPTÕPšQZÐVUP’QÑPTÓPšQZVTP’YÑÑTÒPšQZPVTP’TQÑPTÐPšQYVUP’Ñ\UÐ•’Ñ\YÐ]ÙÝÑPRPŒ’Õ–PRÍPPŽÐTÚPPÑŽPQÑTPY‘ÝÑ[•ÝÐYYÝÑPRP›Ð’›PPQMPPÑXPTÔÑTPZQÔQZ™ÝÑPR™Ð’MPPÖVPTÒÐTP\ÑZ™ÔQPRÚÐ’MPPÚÖTÓÐÐTP\ÑZ™ÙÑPRÔ˜Ð’MPPÚÖTÓÐÐTP\ÑZ™ÝÑPRÐ™Ð’RUPPÔXPTŒ‘ÐTPPšPQPRÏOH‹˜[Y\ËMKMˆŽˆ–TPRPP–TQRØÙÐRVYÑRØÐPSÔQP•ÝÐP–PR˜ÐSÐQQÖPU•ÑR–]ÐUÕÐQYÕÐQZ]ÐP™”PR•ÔQY™TPTÑNÔQ”ÐQÔÑTÑKÔÐQJÔÙÑNQNÝÑTÙÑ‘TPQ”Q•SÔQ–“ÐQ˜“ÐQ˜ÓÐQ˜ÓÔQ˜SÝÑ–Q˜STQ˜ÓPQ˜ÓPQ™PQ™PQ™SÑ™ÓQš’ÝÑšÒÔQ›RÐQ›’ÐQ›’Ñ›Ò™Ñœ”Q›]ÑPPÕP––]ÐPRTPPÒQ›^TQPPÓP–ŽPPXÚUØ‘PTPR’]Ñ›]ÝÑPPÚRP–ŽPP]ÚPUØKÐTPSÒYÑQ’ÝÐ˜Ý™ÑPQSPZZÐVÐP[ÐUŠÍTPTÒÐQ™ÑPQØÐ–ÖPP”[UŠÌTPU’™Ñ™ÝQPQÕP–\‘PP–[UÑÝÐTPUÒQš\QPQÔÓP–M›ÐPšÚÐUÑÛÐTPXR]Ñš\ÑPQÞRP–\TPPœÚUÒÚPTPXÒÑš›ÐQPR–’ŒPPUÓØTPY’Qš›PQPRPÐ–’ZÐPUÕTPZRQ›ÚÑPPÖ“PPÒXV™Ð‘ÝÑÕÐT›Ð›QXPV“P‘ÔQÔPT™Ðš™ÑVPV]Ð‘ÐQÒÐT™ÐšPQVPVXÐ‘ÐQÑPTšÐTœÐYžÐ™šÐ™”›Ð™œÐ™^Ð™›Ð™^Ð™^Ð™MPTVVVVUÐVUVUPVUPUÎUÌÐUÍVTPVTVTVTVTVTPVTPVTVTVTPVTVÓÐVÓÐVÓVÓPVÓVÓVÒÐVÒÐVÒVÒVÒPVVÐVÐTÜÞQ’QTÛÌPÌ[PŽPTÚÍPÛPPŽTÚÍPÑ›PŒTÕKÐP••PQ–PS›PÐTÖÐP›PÐPÐTÓ›PÒPTÓ›PÔPTÒ›PPÖPTÑ›PPØÐPTÓ›PPÙÐPTÓ›PPÙÐPTÓ›PÚÐPTÓ›PPÙÐPTÓ›PPÙÐPTÒ›PPÙÐPTÒ›PØÐTÐ›PÕPÐT\PÒOH‹˜[Y\ËMKMÈŽˆ•PQÕ]ÑRT]ÑRTPRÖ”PP”]ÑR•PPSÐR”]ÑVVPSTQ[™ÑZ”QQ™ÐZTQR”™Ð\ÝÑL”QLÔQMTQM“™ÑS]Ñ‘TQ‘SÑÓQ‘QÓQ‘“Q‘ÓYÑÓ]ÑÓ]ÑÓÑ’SQ“ÙÑ“ÒÑ”Ò”Q•R]Ñ•Ò]Ñ•ÒTQ–RTQ–RYÑP’P”YÐQ™Ñ”ÐP’Q”’TQ•RÑ•ÒÑ–Q–RQ–‘ÝÑ˜QÙÑ˜‘ÔQ˜ÑÐQ™ÐQ˜ÑÑ™™Ñ™™Ñ–™ÐQ‘™Ñ–™ÐQQ™Ñ–ÐP‘™Ñ–Ñ–ÐQ–ÐQ–ÐQ–ÐQ–Ñ–QÑ–QÑ–QÐQ–Ñ–QÑ–‘™Ñ˜‘”Q˜Ñ”Q™Q™QQ™Q]Ñ™ÑYÑšTQš‘TQš‘PQšÑPQšÑPQšÑÑ›QÑ›QÑ›‘Ñ›‘Ñ›ÑÑ›ÑÑ›ÑÑ›ÙÐPšPQPP”M˜ÒTPP[ÓÐVQP‘ÑÐTM™ÔQSÐVQP‘ÑÐTM™ÔQSÐVQP‘ÑÐPTM™Í™M™]Í™YÌ™TL™ÝÐ™ÚÐ™PXÐ™YÕP™]ÓP™TRP™PQP™PPP™PPP™ÐP™PP˜ÙÐP˜ÔPP‘”–PUÝÐP‘^ÐUÙÐP‘T™ÐUÙÐP‘ÐUÙÑP‘™ÐUÙÒPÐ˜ÐUÞÐ•ÞÐ•ÚÐ•ÚÐ•Ô˜Ð•ÚÐ•Ô–P•ÚP•ÚP•ÞP•ÞP–”P–”P•ÞP’ÑPPSP’ŒPPšÍRT’P’ŒPPRP’•‘PRP’LRPRP’LSPRP’[PRP’U”PRN’U“PRPN’Q”PRPN’TPRYÎ’TPR]Î’SPR™Í’Q“PRÍ’Q“PRÌ’[PRÐL’[PRÐL’[PRÌ’[PRÌ’[PRÌ’[PRÎ’PR^P’˜ÐRTOOH‹œÜXÚX[LLŽˆž]ÑPP\ÍP“PTQY^ÑP’PTÕPTQ[ÙÑPXÔPPØÐTQ\ÔQP’ÊÌPQËÐTQPÔQPSUÎPTQ^QP““ÐUMTQMYÑP“Ø›ÐUMPTQMÝTQP”ÐUœÐTQQÝÑPT\ÐTY^TPPÑPTœÐT\LTP\]ÑP•ÜÐU^\TQ“\]ÑP•ÜÐU^\ÐTQ“QP”ÍŒU\]TQ’Ü™ÑP”ØMU[]TQ’\ÑP”ÒÎUZ]TQ’\ÐQP”ŽUZ]ÐTQ’ÑP”ÓPUY]TQ’\”QP”Ø[ÐU^\TQ“œÑP•“PU’ÚTQ•ÑPXQPQ“ÙPTQ•›”QP•–Ð‘[ÜÐPZXÐTP•™QZQPU–P’œÐPQØPTP•ØÑÐPUÝÐ™ÝÑœVSP˜YÑÑUÚÐšQœVTP˜PQÑUÙÐšQ›ÐVSP˜PQÑUÙÐ™ÙÑ›ÐVQP˜PQÐUÙÐ™ÙÑ›ÐVRPÑPPUÚÐšQœPVTP˜]ÑÑPUÝÐšQVVP˜”QÒPUÍšÒTPP˜ÑÒUÎšTQÐVZÐ˜ÐQÒÐVPšTQžPVZÐ˜ÝÑÒPVPšÑŒVXÐ™QÒVPšÑžVYÐ˜ÝÑÒPVPšPQžPVXÐ˜ÔQÒPVPšPQVZÐ˜ÐQÒUÎšÑPVXÐ˜™ÑÑÐUÌšQVTP˜QÑUÜÐ™ÝÑœPVRP˜YÑÐÐUÚÐ™ÙÑ›ÐVSP˜PQÑUØÐšQ›VTP–™ÑÑUÖP™ÝÑ›VTP–”QÑPUÔPšQšÐVUP–QÑPUÒPšÑšVUP–TQÑÐUÐPšÑ™VVP–ÑÑÐUŒšPQ™VYÐ•ÝÑÒU›ÐšTQ–V[Ð•ÑÓPU–Pš”Q•VL•QÓPU“Pš”Q”VN•ÑP•TPÓÐUMšÙÑ“ÐV‘P”ÝÑÕUZÐ›PQ’TQ’R™Ð””QØÐUTP›™ÑXQP”PQÚUœÑMÐXYÐ“ÙÑÜPUÐœ”QLXL“”QÝÐUPUP\ÔQ^X–P“ÑÍTÝÐQ\PXŽ’ÔRPTØÐžQ[PXÜÐ’RTÒPŒÑYÐYP’ÒPTŒŒÑXÐY‘ÝÒTšÐÑVPYTP‘™ÒT•P]ÑUPY[Ð‘]ÒT’PÐQTYL‘TRTNÝÑSÐYP‘RT]ÐŽÑSY“PÙÒT[ÐŽPQRY“PÐRTYÐŽPQRY•P™ÒPTUPŽTQQY”PRPTTPŽPQQY•P]ÒTRPŽ]ÑPÐY˜ÐTRPTQPŠÙÑPYœÐTRTPP‹ÔQPPYŒPR
ÐTPP‹ÙÑPPYŽPQÐPYÐP™ÐRPPVPPÐPQÐYÐP™ÔRPPVRPÐPQÐÐYÐP™ÝÒPPVSPÐPQÑPYÐPšRPVTPÐTQÑPYÑPšRPÐVTPÐ]ÑÑPYÔP™ÝÒQPVSPÐ”QÑYÕP™ÝÒQVTPÐ™ÑÑYØÐ™ÙÒRPVSPÐÐQÑYÚÐ™ÙÒRÐUR“PQ”SÐÝÑ•ÐP•TPÍTL”P]TQTUSÐ‘ÑN”PÌT‘P“Õ–P]QTUQÞ‘PTP’]ÑLÕÐÌT“P“ŒYÐXNPQXÕPU–PQÜ‘PTP’”QP‘Ð^UÐPœ^ÑPT˜Ð“U™ÐX\ØÐQRVU–PQÛ‘ÐTP‘ÐQ]ÕÐPœÑPTZÐ“QšÐVŽÐQQVPU–QÙ’PTP‘ÔQ]•ÔP›^TQPTÐ“ÐVœÚÐQTÌVQÙ“TPNQÝÑ]Ð›^QPSÞÐ’ÌVPVŽÐQÙTÜÐQØ“PTPMRQ\U™Ð›”QPSÐŒ’ÛPVœÌQÙPTÛPQÖTPLÒÑ\]ÐP•”PšÞ™ÑPSš’Ñ’PVœÎQYTÙÐQÖTPLRÑ[•TP›LQPS”Ž’›PVPQYÐTÕ”QÕÐTPLPQ[Ð›ÑPS^QP’‘NVNTPQZPTÓ“QÔTP]YÑZ•PMš”QPRYÐPÜÚTÒ“QÓTPZQPPYRPPÔ[TÐ“PPÝTTPXQPR”ÕP’ÐRÜPP›™ÐTP[’ÑXÔÙÐ\[QPQYQPPÕ[TžÐPÜUÐTPTQPR”ÚÐ‘ÚÚÐRÝQPPÖ\TœPÚšTP[’ÝÑVTÔP[QPRÔÝÐ‘ŒÐRŠÑPPÝÝT–’PØšPTP\ÓÑU”ÔP[MÑPSQP‘ZÚÐRTPQ^T’ÐPÖTPLÓ™ÑS•PZPQPSž™ÐÚÝÐRJÓPQTÓTPNUQZMÑPTÌ’]RPQSÐTÒPTPUÑZÑPTQN’SÒPQP“ÐTÔPTPUÑZMÑPTQP’]RPQP”PTÓPTPUPQZÑPTP’JÒPQTÐTÓPTPNU]ÑZÑPSÛP’YSPQT‹ÚÐTP^•ÑYPQPS™Ð‘Ì[Ð‘Õ›Ð‘ŒL‘OOH‹œÜXÚX[LLHŽˆÑPQMÒPTž^TQY\™ÑP’MŒTÕÝTQ[ÑPPX\ÐTÛ\PTQ\ÜPQP“™ÐUÛTQ^\ÑP“’ÕPUÚÐTQLÜQP“ÒÓPUZTQM›ÙÑP“Í’PUUÐTQQ›ÔQPT•PTZYÐTPJÛQP”Ö•PU[UTQ“QP”ÍUPU]UTQ“QP”ÍVPU\VTQ’›ÑP”Ö™ÐUZVPTQ’[PQP”Ò™ÐUZVPTQ’[TQP”ZÐUYVTQ’TQP”ZÐUYXPTQ‘Û]ÑP”–œÐUTØTQ‘]ÑP”M[ÐUTÕPTQ’ÚÔQP•MUÓTQ”ZQP•V\ÐU‘ÑÐTQPšTQPU[Ð–Ž–PV•ÛÐ˜ÑÚÐ˜Œ’PUØÐXÑÑP™™Q™UÐUYUœÐ™L]Ð™U›Ð™[Ð™[Ð™L[Ð™‘›Ð™›Ð™Œ[Ð™ÐQ˜PVQP•ÙÑÑU›ÐšQ˜ÐVSP–QÑUœÐšPQ˜ÐVYÐ–QÒPUŒšTQ™V[Ð–ÑÒÐUš]Ñ™V[Ð–PQÒUÑPšPQšPVXÐ–QÑUÕP™ÝÑ›PVRP–™ÑÐUÖP™ÔQ›PVPP–”QÐPUÕP™Œ”P™Œ”P™Œ“P™Œ“P™›SP™•ÒP™•ÑP™‘ÑP™‘ÐP™•ÐP™•Ž™›™›™ŒL™ÐQ˜ÐVPP–QÐPUœÐ™ÔQ˜VQP•ÙÑÐU›Ð™ÐQ–VPP•ÐQÐU™Ð™ÐQ–PVPP•ÑÐPU–P™ÔQ•ÐVQP•”QÐU”P™ÔQ•VRP•YÑÑU‘PšQ”PVUP•ÑÑÐUNšQ“VYÐ•ÑÑÐYPPQ“PV\Ð”ÙÑP•PÓU[Ðš™Ñ’PV‘P”™ÑP”ÐPÔUTPUVP[Q‘V˜Ð”YÑÖPUQP›YÑKÐVÐ”QÙUÐ›ÔQMPXSP“ÑÛUPœÑ^X[Ð“YÑÜÐTÎœÑ]PXP“QÞTÛÐœÝÑ[ÐTQ\PSP’ÑÌTÔPYÑZPXœÐ’PQÊÐTÐQYPXÐP’RÐT›ÐžQVPXÖP‘ÒT”PT–P^PQUXÜÐ‘PRTNŒQSÐYP‘RPT\ÐŒTQSYPÙÒTYÐŒ™ÑRYÐÒPTVPŒÐQQYRPTUPŒÔQQYYÒÐTQPÑPÐYRPTRÐTRPPQPPYVPPRPTPP]ÑPPYYÐPRÐTPP”QPPYZÐPRTPP™ÑPPY[ÐPRTPPÐQPPY]ÐPRTPPÔQPPYMTRTQPÔQPYMTRTRPÔQQYL]ÒPTSPÙÑQPYL”RTVPÐQRY\ÐÐRPTYÐ™ÑRYZÐÙÒÐT\Ð]ÑSPYVP‘RTLTQSÐYTP‘ÒÐTNPQTYUP‘PRÐTPTQTYUP‘]ÒT“P“ÖP\ÔQUTÞRÍ‘Q\•ÐÜT”P’Ì\YÑUPTÝRÛÐ‘Q\•PÜT”P’ÚÜÐ\QUPTÛÐRÌ‘Q\ÙÐÝT”P’ÕZÐ\™ÑUPTÛPRÎ‘Q\ÐPÝT”P’ÑVP\ÐQUPTÙPSP‘Q[”TPÞT”P’ž]ÑUÐTÕNPRLPTPKÑ”QØÐX•PQÐVšÐÑPTP›TQÌTPN™ÑÖPX–PQÖV˜ÐÑPSÞÐ›QÌÐTPM‘ÐQÕPX˜ÐQÖPV“PÑPSÐšÐ–[ÐSšÐQXPUÐŽPPÞMPTPLQÙÑ˜™™Ð\TQPSšÐ•ÖRÚÐQXÐU[PPTPZÝYÑPS”Œ”PPÒÍÐTPLRÑ‘šQPQÜÐQYPT›ÍPPÚQÐTPV]”QPSÐP‘ÑÐRÒ[ÐPJËÐTP^RYÑUÓÙÐ[ÐQPPNPPÎPT–MPÔTP\ÒQUSÝÐZžÑPRÚVP‘ZÐRXÌPÔ[T‘NPÓTP[RÔQTPZ]ÑPRž\Ð‘ÐRS\ÐPÚÜÐT]ÎPP‹ÓTP\TQPPZMÚŒRÐPÌTYÎPP‹ÓTP]ËÐQPPU’ÐQNPT‹ÓTP^”QYž™ÑPSšŒ’SMQÎPTÒÐTPKÔQZ™ÑPTU’\ÌQSJÐTÓTP‘ÑYÖPPPž”QPT‘’NQTKÐTÓTP‘TÑZÞ”QPT‘’“LQTPTÔTP‘TPQZž”QPT‘QP’\ÌQTÐTÒTP‘]ÑYÞ”QPTZÔP’QQÐTž”TPMÔÐQVŒQPSOOH‹œÜXÚX[LLˆŽˆœÔQPQ˜LTSÞTPVœQP’[ÐTQÜÐTPZPQP’œYÐTÚ[PTQPœPQPRÒÖPTÞZÐTQPœÑPSÔPUÚPTQ^[ÔQP“’ÐPUYÐTQLÛÑP“ÒŽUYPTQMÛ™ÑP“ÍLUYPTQNÔQP]ÐQ”TQ’šÔQP”ÜPU\TTQ’ÚÔQP”ÜPU\TTQ’ÚÔQP”ÜPU[TÐTQ’ÚÙÑP”ÜPU\TÐTQ’ÚÝÑP”Ö”PUZUTQ’QP”UPUYUPTQ’[QP”œPUUÕÐTQ‘›ÑP”MVPUSÕÐTQ‘™ÑP”ÍÐUL’ÐTQ“ÚÑP•RVPU‘ÑTQ”™QRYÐPšQPUVP‘VTPQ‘›PUÎZV™V˜PVVPVVTQ–RPVUPVVUVÐVTÐVTÐVÔÐTPP•]ÑÐU“P™ÙÑ•VUP•]ÑÑÐU”PšÑ•VZÐ•”QÒÐU•Pš]Ñ•VL•™ÑÓU–Pš™Ñ–VM•ÑÓÐU™Ðš™Ñ–VL•ÙÑÓPU›ÐšQ˜ÐV[Ð–QÒÐUŒšTQ™PVXÐ–ÑÑUŽšQ™VUP–ÑÑPUŽ™ÝÑ™PVSP–ÑÐÐU™ÔQ™VRP–QÐUÐ™ÔQ˜ÐVPP•ÝÑÐU›Ð™ÙÑ–VSP•ÔQÐÐUšÐ™ÝÑ–PVSP•ÑÑU˜Ð™ÝÑ•ÐVTP•”QÑU•PšQ•VUP•QÑU“PšÑ”ÐVXÐ•TQÒPU‘PšPQ”PVYÐ•ÑÒUMš]Ñ“ÐV\Ð•QÓPU]Ðš™Ñ“PVN”ÝÑÔU[ÐšÙÑ’PV–P”ÑÕÐUVP›TQ‘VšÐ”QØÐURPUTP[]ÑPXPP”ÑÚU›ÝÑNPXTP”QÛUÐUÐ\ÑMXYÐ“ÐQÜUPœ”QLXP“]ÑÞPUPœÝÑ]ÐX–P“PQÌTÍTQ\ÐXŒ’ÙÒTÙÐžQ[XØÐ’™ÒPTÓPž”QZPXÍ’TRTŽŒÑYPYP’RPTÐœ”RÐTP\‘ÝÑÝPXÝÐPÛÖXPž”QPRÚÐœÔRÐTP[ÑÐQÞXÎPÚÖX’PŒQPRžPRÐTP[‘QÌPYPPÕUX–PŒÑPR”’PÒTP[TQÌÐYPPÕTPX™ÐŒÑPR™ÎTRTP[ÑÍPYPPÕSÐX›ÐŒÑPR”MYÒPTPZ‘QÎYPPÑSPXÐŒTQPRT\Ð™ÒÐTPYÐÙÑP‘PÊÐYPPŽXÑPŒTQPRÛÐÔRÐTPYÐRPYÐP›ÒXÕPŒ”QPQÐVPžÒTPU™ÒYÐP’QÐXØÐŒÔQPQVPžÒPTPS”RTTPžYÑQPXÜÐ]ÒTSPžQQXÝÐYÒTRPž™ÑPYPTRTQPŒQPYPTRTPPŒÑPPYPPRTPPŒPQPPYPPRTPPŒTQPPYPPRÐTPPŒ]ÑPPYÐPRTPPŒQPPYÐPRPTPPŒQPPU•–PRPPPQ•UÐPÐPTPP•‘™ÐYÐQPPU“–RQPPQ•™ÐÐÐTPP•LVPYÙÑPPU“•ÐRRPPQ•ÐÐTQP•U˜ÐYÔQPU–RRPTQ”UÐÐÐTRP•XÐYÙÑQULVRSPQ“ÐÑTUP”ÛÐZQQU[RTP™Ñ’™ÐÑTYÐ”‘–PZÑRPUS•ÐRVPÙÑUÐÑT]Ð”˜ÐZQSURVP‘ÑP‘PP\”PR•ÐÑÐTP’ÌYÐZQTÐTÛPRUP‘”Q[UÐPÑT™ÐT›ÐRU™ÐZQXTÐ–PRTP’QYUÐP•ÔPNÑPT”Œ’PT–PQTYPTŒUQVTP‘ÑY”PNPQPTZ’”PTšÐQPTŒUPQVTPKÒÑY]ÐNTQPT’“PSÍZÐQÐTžQVTPJÒPQXÕ]ÐMTQPTÐP’’PSÒ›ÐQÙÐTžPQXPTPMÒTQX•ÐM]ÑPSÔÒP‘ÚÍSÒÐQÚT›QØÐTPM’QVUP^[”QPSÞUP‘ŒRÒŒQÛT•“PÜYTPM’ÔQTÔÙÐ\›ÔQPSÔÜÐ‘QZÐSÔPQ]TMRPÝ[TPLSPQSÐP\œTQPS]MPT^PTZPPÜ\TP^MYÑPQÐ’ØLQZTÜ^TP‘TÑ\QPTLÐ’Ü”PQU’PTÝLPTP‘TÑ\ÝQPT‘YÐ“PQT’TÝLTP‘”ÔQ\ÝQPT‘[Ð“–PQS“TÍŒÐTP•Q]PQPT“SÐQPUÍPTPNPQ^YÑPSÌRP“X›ÐQPTQ•ÐPÌTPM™Ñ]]YÑPSÑ™Ð“›ÐQ–TÞMTPLUÝÑ\]YÑPS‘Ð’Ø›ÐQ™TÚMTP^VÑ[YÑPSUŽ’œ›ÐPÍZTÒÍTP\–”QY]YÑPRŒ˜Ð‘ÜœÐPØMÐTQZQP‘Ó•PPQÎPTQV‹œÜXÚX[LLÈŽˆ›ÙÑPQ’TšLÐTPQ[”QP’\ÐTÓØPTQZÛTQP’XÐTÜUÐTQ]ÑP“•PUÕPTQ^ÝÑP“MRPUÔÐTQLšÔQP“PPUTTQMšÑP“ÍUQTQQZ™ÑPTRPTYSTPJÙÙÑP”ÖRPU\PÐTQ“ÙÑP”ÍPU]PÐTQ“ÙÑP”ÍPU\QPTQ’šQP”ÖTPU[QPTQ’šQP”ÖUPUZQTQ’ZÑP”PUYQTQ’ZQP”ÒVPUYRTQ‘šÑP”’XÐUTÒTQ‘ZÑP”’QPU[PPTQ’YQ“™]Ñ“™PQ”YÑ”YÑ”XPQS™Ð”VQœUÐQÑTQP•]ÐžPQŒQP•ÐŒTÝÑTÐQŽÐQÔÑÔÑ””QŽT”QŠÔ”Q‹Ô”QÐPUUP™ÔQ‘VRP””QÑUUPšQ‘VXÐ””QÒPXÍPQ‘ÐV[Ð”™ÑÓUVPš™Ñ’VM”ÑÓÐUXÐšÑ’PVN”ÐQÔUYÐšÑ’VM”ÝÑÓPU]Ðš]Ñ“V[Ð•ÑÒUNšPQ”PVVP•TQÑU‘PšQ”VTP•PQÑPUP™ÝÑ”VRP•ÑÐUN™ÐQ”VSÐVSÐVSVSVSVSPVSPVSVSVSVRÐVPP”ÔQ‹ÔÔQ‹ÔÔQ‹ÔÐQÐPUYÐ™ÔQ’VRP”ÑÐUVP™ÙÑ‘VSP””QÑUUP™ÙÑ‘PVSP”QÑUSPšQÐVUP”YÑÑUQPšÑÐVVP”PQÒUPPšYÑKÐV\Ð”ÑÓPUšQNVP“ÝÑÔUÐšÙÑMPV”P“ÔQÕPUÐ›QLÐV–P“™ÑÖPUP›TQLPV›Ð“”QØPUP›Q^VÐ“TQÙUP›Ñ]ÐXQP“ÑÚTÍœQ\ÐXYÐ’ÝÑÜYPPQ\PXL’ÔQÝPTÙÐœÐQ[X‘P’™ÑÌTÕPQZÐX˜Ð’]ÑÍPTÓPTQZXœÐ’PQÎTÐP™ÑYPXÑP’RT›ÐžQVXÖP‘ÔRÐT™ÐžÑVXÙÐ‘™ÒT•PžYÑUPXÜÐ‘RÐT“PžYÑTÐXÜÐ‘TRT‘Pž]ÑTPXÜÐ‘ÒTMž]ÑSXÛÐ‘RT\ÐžÑRÐX™ÐžQPQZÐTQRPXœÐÐQÎTXÐ™ÑRXŒÑÊÐTXÐÑQÐXÐP™ÒPTUPÔQQXÒPRTSPžQQXÕPYÒÐTRPžÑPÐXÖPYÒTQPžTQPÐXÙÐTRÐTPPžQPPXÝÐPRPTPPž”QPPXÍPRÐTPPžÑPPXÎPRPTPPŒQPPYPPRPTPPŒQPPYPTRTRPž™ÑPÐXÍYÒÐTRPž™ÑQXÍRÐTUP•ÕÐPXÙÖP•ŒPXÙÖP•›PPXÝÙÐ•LPYZÐ•UÐPY\Ð•PY]Ð•YPL”ÌLYTM”ÑÐYZP“QTPQQœÐY^P“ÕPQœÐY^P“ØÐPÛÐY‘P“ÐYšP“ÐYÐQTÐTÌUÐRQP‘YÑ\ÕPÐÐT’P“’PZQUTÝPRVP‘Q\UÐ‘ÛQPTP”P’ÚÌTœPQPUTÛPQXUTPQ”Q\ÝÐ‘ÛQPTP’Ñ[ÐT––PQÐTÚQXUÐTPNQ™Ñ[ÔÔP‘[ÑPT˜Ð’ŒÐT\PQÖPTÖ’ÐQ•ÐTPMÑÔQ[ÙÐM›ÑPSÔ›Ð’‘[ÐRÌÖPPV˜ÐQØTÓ’ÐPÝVPTPLRQZTÙÐ\›PQPS”’Q[ÐRÜÐQYÐTSPÚXPTPLTQYP[[]ÑPSÔP‘ÚÝÐRM]ÐQ[PTšPPÓÙPTP^RÐQUÕPZÐQPSPÚÐ‘•LRXQPPÎÐT’“ÐPÐÚÐTP\ÓQT•ÐYÜQPRÞN‘R˜ÐPÚÞTLTPŠÜTP[“QR•ÐYœTQPRÑPÑPRYÐPÞTŒœTP\ÕTQYTQPS‘P’ZÐPÎTÐTž\PTP]ÕYÑYQPSQ’P’LQ•TœÐTPL•QY\”QPSÕ”P’\ÐQUTœTPKÕ”QY\]ÑPTVP’œÐQR•ÐTŠÜPTPÕ™ÑYÜYÑPT‘˜Ð’›ÐQU–TŠÜPTP‘•ÐQY\YÑPT•šÐ’[ÐQU˜Tœ\PTP‘–ÑUÜ]ÑPT‘ÑP‘\\ÐQSšPTÜÐTPœQP”U]PTQLÈ‹œÜXÚX[LMŽˆœTQPQM˜ÐTQÜTPUQP’RPTÐÚTQZ[ÑP’œTÛXÐTQ]]ÑP“[ÐUØPTQ^TQP“MYÐUÖTQL›PQP“––PUUTQM›QP“ÍTPUUTQNZÝÑP”ØÐTXUTPJÚÑPRPQ
ÒTQ“ÑP•VPUL‘ÐTQ“šÑP•XÐU^RTQ“šPQP•YÐU^RPTQ“ZPQP•YÐU^RPTQ“ZTQP”ÍÐU]RÐTQ’ÚYÑP”ÛÛÐU[RÐTQ’šYÑP”ÖVPULKÐU“ŠÐU”ÐU™U›UUžUŒZT^PQŒZUÝ–TPQÕTQŽLTQPPÕM™ŽTPPNRVSPŒÑPQUVPšÒTPU”™ÑÑÐYPP™PVYÐžÑPQŒPšTRÐTPVTQÒXÝÐPœÐXTP”YÑÚÐUQPœQXTP”TQÚUQP›ÝÑXRP”TQÚURP›Ñ‘V”QØÐUTP›Q‘PVÐ””QÙUVP›”Q‘ÐVŽ”ÑÙÐUYÐ›Ñ’XPP”ÔQÚU[Ð›ÔQ“XPP•QÙU]Ð›Ñ“V•ÑÙUP›]Ñ”V›Ð•YÑÖU“P›PQ•V˜Ð•YÑÖPU’P›Ñ”V˜Ð•TQÕÐUN›PQ“ÐV™Ð•ÑÕÐUL›Ñ“V•P•QÕPU]Ð›Q“V”P”ÙÑÕU[ÐšÙÑ’V“P”ÐQÕPUYÐ›Q’V–P”ÑÕÐUVP›Ñ‘VšÐ”QØPUTP›YÑ‘PV›Ð”]ÑØUSP›]ÒTPRYÑØÐY”PPZŽPTPR”PQÙPY‘PP–VŒÝÑPQÚŽ›ÐRPTPX”ÑÚYLPPXQPQPPYLPPXUPÐQPRUÐœÒTPZTQÜY[ÐPÔMX]ÐQPR•ÐŒTQMPYP“ÐRUÐŒQLÐYÐ“™ÒUPUÐLQLPYÐ“]ÒÐUPŒÔQ^PY“TRPUPŒÔQ]Y“ÒTÌQ\ÐYQP“RÐTÜÐQ\YPP’ÙÒTÚÐQ[TQ\SÐP’ÒTÕPQ[Y’]ÒTÒPžRTPT’TRY‘PPMXŽYÑPPTŽÐQYPXÖP’RTÐž™ÑYXÎ‘ÝÒÐTœÐŒÑXPYÐ‘ÔRPT™ÐŒÝÑVYQP‘™ÒT•P]ÑUPYZÐ‘]ÒÐT’PT”PMÐQTY’PšRPPTPŽYÑTY™Ð‘ÒÐTM‹ÐQSY‘QÐPYÝÐ™ÔRSVTPÐÝÑÑPYÚÐšPRRVZÐÐÐQÓYÙÐšRRVLÐ™ÑÔYÖPšÒQV‘PÐ”QÔYÔPšÙÒQV“PÐ]ÑÕYÓPšÝÒPÐV–PÐYÑÕÐYÒP›ÒPV™ÐÐTQÖPYÑP›TRPPV›ÐÐPQØYÐP›]ÒPPVÐÐPQÙYÐP›ÒPPXQPÐPQÚPYÐP›ÙÒPPXSPÐPQÚYÐPœRPPXUPÐPRPYPQPPXÎŒTQPUTPPž™ÒÐTP”PPRÐYÐQMULÐR•PŒQPUÒP“UÐZÝÒTP“TQ^SÔPÔYÐQLÐUMRLžPQPPYÐQLÐUMÐR\ÐŒ”QPUÒP“QÐZÒPTP“]Ñ]”PÑYÐQ]ÑPTÌRSPŒÑPUTP“ÐYÐRÐTP“”Q\”PŽLÐQPTÝÕP’ÞÐYNLQZÑÐTÛÎR™TP’PÑ[ÔPÙÑPTÙÐ’šŒYQVRPTÖNPRTP‘ÔQ[PžQPTT[Ð’‘ÐXÝPPQSSTÓNQÓÐTPQZÝÑPQÊÑPQQSPTÑNQJÕPTPUMQPTPL’QÐU\ÐP\šPTPQÑY“ÝÐ“ÍÑPTTN’ÐUSPQQTTœÍPQMÚTPÑ]ÑV“ÔP“TQPTT“P‘ÕÐTŠÕPQQUPT™ÍQVTPQ™ÑUÓÐ‘M”QPTÐ‘•PT“ÜÐQÖT’LÐQRTPMÑÝÑTS”PÍÝÑPSÚ‘PTY•PQYTLQQPTPLRÑRÓ]ÐJËÔQPSRPž’PTÑPÐPÜÚPTV^PQPYÐ]SPQNÐRPSPÎ”QPÐQ]UPÐYÐ^SÑLÙÝÒPS”Ì’ÌZÐPÍPÐQ\ÐTÝQPYÐLSQ\RPSÚ\Ð’ÖSPÐQÜTØQYÐJÒÙÑ[ÙÝÒPTPÛÐ’PÐQR\TÙQYÐ‘ÙÑ[YÝÒPTÙÐ’ÒSPÐQU[ÐTÚQYÐ‘’ÐQ[ÙÝÒPT”ÙÐ’ÖSPÐQU[ÐTÛQYÐ‘’ÐQ\ÝÒPT”ÙÐ’ÖSPÐQU[ÐTÛQYÐ‘ÐQ[ÚRPT^[Ð’›ÙÐÐQTØYYÐ[RÙÑZÓQYÈ‹œÜXÚX[LMHŽˆ›ÝÑPQ’TŒ˜ÐTQYÛYÑP’’›ÐTØVPTQ[ÛÑP“–PTÌ•PTQ]šÝÑP“\PUÑPTQPšPQPPV’PQÑTQRÔQPS›ÔPTXTPTPMQPÒPQQPTQRšÑPSÛÔPUTÑPTQ‘ÚQP”PUXQTQ’QP”PUXQTQ’QP”PUYQTQ’QP”PUXQÐTQ‘ÚÑP”›ÖPUXQÐTQ‘ÚÑP”›ÖPUXRTQ‘šÑP”–XÐUUÒTQ‘šÑP”–Ð•–P•ŒÕP•›’P•ÖP•ÛN•ÌŒ–ÝÐ–ÛÐ–˜Ð–[SP–•ÑP–Œ[Ð˜›Ð˜›P˜ÛP˜ÍÐPÐPYV\ÐYÐPœ™ÒPQ‘P™šÐÐP”V[ÐYÐUÑŽPRPQLUNY’ÓPÐPšPVQP›™ÒPR]Ð™ÔQÙYÐYUQÑVœÐÐPÐ“PVSP›PRPRLÐšQÖYÐZÕQÑPV”PÐPÙPVUPšÝÒPRŒÐšQÔÐYÐ[ÕQÑVPÐPÚPVUPŒÔQPQMÐPÛVUPŒ™ÑPQ’]ÐÐPÜVTPŒQPRÐÐPÝÐXMšPRPRÚÎQ”Y•PRÐUPŒ™ÑÜYÐP•PRU‘PŒ™Ñ”ÐYÐ•YÒU“PŒQ•PYP•RÐU•PŒTQ•ÐYP•ÒU˜ÐŒÑ–PYP•ÐRU˜ÐŒÑ–YP•ÒÐU˜ÐŒQ–YP•ÒU–PžÑ•ÐXÍ•™ÒPU–Pž]Ñ•X•QÜU”PœPQ•PXUPŠÙÑPPU“PœQ•PV“TPPŒQPR[P™YPPÐ”ÐV–PTPUUYÑŒŒ”QPQLRP™ÐPNTVPVPVPVVVÐVVVPVPV’TPQ”ÝÑŒÞQPPÚÛÐ™ÔPP^ÐVTPS”ÔQŒÙÑPQšÚÐšÑ’PV’P”ÐQÔÐUXÐ›Q‘ÐV˜Ð”™ÑÖPUTP›]Ñ‘VšÐ”]ÑÙURP›ÑÐVŽ”PQÚUPP›ÔQJÐXSP”ÑÚUÐU\QMÐXXÐ“ÙÑÛUÐœPQMXYÐ“ÑÛÐUPœTQLX\Ð“YÑP“PÜUPœQ]TQ]ÐRÌ“QÝÐTÛÐœÔQ\X’P’ÐQÞTÖPœÝÑZÐX”P’]ÑÌTÑPQYÐX”PŒTQPPZYÑXÐXÐ‘ÝÑËÐT›ÐÙÑVXÓP‘ÒPT˜ÐžTQUXÝÐ‘RT“PŒÑTÐYP‘YÒÐTPŒQTYÐ‘ÒPTLŒÝÑSPYSPÝÒT[Ð]ÑRÐYXÐÐRTYÐÐQQÐYN”RTUPŽÑQPY“PRTSPŽYÑQY˜ÐYÒÐTQPŠÔQPYšÐTRPTPPŠÙÑPPYœÐPRTPP‹ÐQPPYÐPRTPP‹ÐQPPYÐPRTPP‹ÔQPPYÐ‹ÔQPPTRP‹ÔQPÐYŽYÑÐPYÒP™ÔRQVQPÐQÐÐYÔP™ÝÒQÐVPPÐ™ÑÐÐYÙÐ™ÐRRPXP”QPU[Ðœ”QÊÐTP“ÙÑÝXŽQ[ÓX]ÐÐQPTÔLœYÒPTP’‘ÑÜXÐPQZÔXXÐÔQPTÐPœRTP’QYÑÚXÒPQXÕXRPÝÑPTšP›ÒTP‘Ñ™ÑÙXÔPQUVPVŒžQPT™Ð›”RTP‘QÙÑØPXÖPQSXÐTQYPR•PžÑPTZ›RTP’PQÕXÙÐQÐV’PžPQPTQPšÐRPTPJÒYÑÓÐXÚÐQPVMžTQPTÔPš]ÒTPNQ™šÑPRŽÐQÛPUQTP[^TQPTÖP•PPÖÐTPNÑ•šTQPRS[ÐQU’ÒÐTPY^]ÑPTÚÐ•VPP˜“PTPNÙÑ”ZÝÑPQRPPRTPMÒÝÑ“ž™ÑPSÚL”ÎPPQÝU[”TPMÝÑ’ŒPQPS”ÛÐ”ÙPQ\PUZšPTP\ÔQ’ÑPRÔÚÐ”]SPPÚÛUUTP\’ÑNV”PPÑPSÖP”TPPÍPTÞPPKÛPTP\ÚÝÒPPTÕP“ÖPPÎÐTÞ›PTP^Q\YÑPSÔP’ÝVPQYYÐP’]Ñ\TQPSÔÒP’ÝTPQPTÜšÐTP’YÑ\MPQPTTÒP’ÝTPQSZPTÝšÐTP‘YÑ\ÍPQPTÒP“ÔPQUZPTÌÚÐTP‘’YÑ]MPQPT”ÒP“TPQUZTÌÛTP‘R]Ñ]]ÑPTZSP“VPQSZÐTÞ›ÐTP’”Q\ÎQPSžVP’ÛÑPÐPÕ[PTÚÜTÔOH‹œÜXÚX[LMˆŽˆ™ÑPQ“T›MPTQYTQP’SPTØLPTQ\ÙÑP“‘PTÊÝÐTQ^ÐQP“XNUÝPTQL™ÑP“˜MUÜÐTQM\”QP“ÒÜÐU\TQMœYÑP”TX\PTPN[™ÑP–PPQÜTPJÛ™ÑP”ÜU\YPTQ“™ÑP”ÍMU]YPTQ“™ÑP”ÍMU]YÐTQ’›ÑP”ÜPPU[YÐTQ’›ÐQP”ØPPU[YÐTQ’›ÐQP”ØPPU[YÐTQ’›ÐQP”ØPPU[UÐTQ•QP•MU›SÐTQ–™ÐQP‘LQœVžVPVVVVTQœRPV[VÚYÐP–QÐPYÐÐPLZVSPŒRPQJÕPÐPQšVUPžÒPQŒ“PšÒPYÐYV]ÑÒXØÐÐPŽZV\ÐTRPSÓPšQÐPYÐTÒPS“Pš™ÒÐTPTœÝÒPPMØÐÐPÎZPVP‹ÐQPP]ŽPš]ÐYÐL–]ÑÔY›ÐPŠÝYÐLÖ]ÑÔY™ÐPÜ]YÐMQÔY˜ÐQÌ[VPŽYÑPX•ÕP‹ÔQ›YÐ–™ÒPUÙÐŽYÑ›ÐY’P˜TRUÛÐÒÐYÐP˜TRPUÛÐQœYXÐ˜RPUÌTQYSP˜ÒVPQYRP˜™ÒUÌPQœÐYTP˜RPXÎÐPQœYSP˜YÒÐUÚÐPQœYSP˜PRUØÐQÝÐYÐXV”QÎXPÐPšÐXÐYÒPPÌ”PYÑÍÐYÐR–]ÑÍUÒPÑšPX“P›ÒPP[PPQ™ÐX’P–ÑÔY”PPžVNŠÔQPQ[š]ÒTPTUÝÑÒUœÐšPQ˜PVVP•ÐQÑU–PšÑ•TQ–RTP•]ÑÒU’PšPQ”ÐVYÐ•PQÒÐUNšYÑ“PV]Ð”ÙÑÓÐUZÐš™Ñ‘ÐVP”]ÑÕURPšÝÑV“P”ÑÕPUšÝÑNV•P“ÙÑÕUÐ›ÑLÐV˜Ð“”QÖUP›]Ñ^PVÐ“YÑØÐUP›™Ñ]VŽ“ÑÙÐTÝÐ›ÙÑ\ÐXSP’ÙÑÛTÛÐœQ[ÐXYÐ’™ÑÜTÔPœQZXL’]ÑÝTÒPœÑZXP’TQÞTÐPœÙÑYX“P’QÌTŒQXX™Ð‘ÙÑÍPTšÐ]ÑVXœÐ‘ÐQËÐT˜ÐžQUXÙÐ‘RT“PžÑTÐYP‘YÒÐT’PŒ]ÑTPYÐ‘TRTNÑSÐYUP‘RTL”QSPY\ÐÝÒPT[ÐŽQRÐY“PÔRPTYÐŽYÑRPY™ÐÐRPTXÐŠÝÑRYÐ™Ò
ÐTUP™ÐRQVRPÐQÑPYÔPšRQVVPÐ]ÑÒYÒPšPRPV[ÐÐTQÒÐYÑPš]ÒPV\ÐÐTQÓYÑPš]ÒPPVLÐPQÓÐYÐPš™ÒPPVMÐPQÓÐYÐPšÒPPVNÐPQÔYÐPšÒPPVNÐPQÔPYÐPšÔRPPV‘PÐPQÔÐYÐPšÙÒPPV“PÐPQÕYÐPšÝÒPPV”PÐPQÕPYÑPšÝÒPV“PÐTQ\ÑPTQP’š‘PMÑPTÕ^PQ^SÑPTQZÓ”PÕÐXÌQXÐTÓLR•Pž™ÑPT™ÒP’Z˜Ð[RÐTP‘ÐYÑZÐPÕXÍQVPÐTÑMPR’PžÑPT”SP’QÐZÔRTP‘]ÑY“ÝÐÔPXÎQUQPTRNŒQPTTP’ŒZ™ÒTP‘”QXÔPÓÐYPQRQÐTœÎPRLŒÑPTTXÐ‘ÚŒZ”RÐTPÑXTPÓPYPQPRPTšÊÐR[ÐŒÑPTPZÐ‘ÑÐZRTPKÐÔQVÝÐÓYPQT˜ÍQ‘ÓPTPPš™ÑPSÝPQÐT–MPQÔTPMLPQPT\Ð‘‘ÐUR‘PQ•TPMÑQUÐ”ZÔQPS™PQÓT‘LQJÔÐTP^ŒYÑPSÔL‘UPU“PQTPMÑTS”P“›QPSYÐQÓÐTLPQ^UÐTP]”QPSÎ‘“PU˜ÐPÝ˜ÐTPLQPQSÓ]Ð’]ÐP›TQPRŽLPRTP^QTQS“TP’]ÑPR]QUT\ÞQYYÐTPVÑPSPÕPT˜RPP–TP]”QRSÐ‘ÍQPRÚÐšMT“ÜÐPØÖTU]PQSTP[ÓQMÑPRÐÌ”
ÜÐPÛÜUœTP\ÒÙÑNÐQPS[Ð’ÛPQ
ÌPÎTÜPTP]ÒÔQ\ÙÑPSTÙÐ’ÙLQ[TÛTPLÒÐQ[ÐQPSÐÖP’ŠÝÐQÛTÚœÐTPJÒ”Q[ÍÐQPTPÕP’ÓÝÐQRZÐTÛœÐTP‘]Ñ\MÐQPT^SP’Ý]ÐQUZTÝœÐTP‘’]Ñ\ÐQPT”ÓP’ÊÝÐQUZTÞœÐTP‘’]Ñ\ÍÔQPTÓP“ÍQSZTÞTPÒQ\ŽQPTUP’ÖTPÐPÜÛPTÚUYÐQÒÔQZ’ÐQZÈ‹œÜXÚX[LMÈŽˆQPQMÒPT]TQYœÑP’X]ÐTØ\ÐTQ[\TQP’ÍšÐTÌ›TQ]ÜÑP“XVPUÛTQLQP“˜SPUZTQMÙÑP“ÜRPUZTQNÐQP”PTTÙÐTPJÛQPPQ•PTQ’ÛQP”ÍTPU]UPTQ“QP”ÍTPU]UPTQ“QP”ÜPU[UÐTQ’›ÑP”Ö–PU[UÐTQ’›ÑP”Ö–PU[VTQ’[PQP”YÐUYVPTQ’PQP”PPUJÓPTQ•]ÑP•MÐU™QTQ–šQP•Û˜Ð–›”P˜VP˜UÍ˜•ÕP™TP™™LL™‘›Ð™›Ð™œ˜ÐÐP]PV
ÌYÐSÕÐQŠÜRPQŒXÐ™šÐÐPžÐVPP›ÐRPR•–P™ÐQÙPYÐ[•™ÑÐPVŒÐPÚÐVPP›TRPS–P™YÐÐPÌUÐV•YÐ]Õ™ÑŽM™ÑPPMUPÐQ•ÐVšPTPTšÔRPS‘•P™“ŒPŠÔYÐ^U™ÑŽLÑPR[ÍÐQ–PY[Ð•ÐRU™Ð]Ñ–PYSP•ÔRUœÐŒÔQ˜PYÐ•ÝÒUÐŒ]Ñ˜ÐYP–RUŒPQ™YP–ÒPUŽŒÑ™ÐYP–PRUÐPŒÑ™ÐYP–PRUŽŒQ™YP–ÒUŒQ™PXÎ–ÒÐUžQ™PXPšÝÒPPÍNÐP\XYÐ–QÛUÐ›ÝÑ˜ÐV•ÝÑÖUœÐ›PQ–VVPVVÐVVPVVÐVTVTPVTPVSÐVPP•ÑÐÐU[ÐšÑ’VYÐ”ÐQÒPUTPZØÐZYÑ‘VN”TQÔUPPšÝÑNPV˜Ð”QØPUÐ›ÐQLÐXTP“™ÑÛPUPœTQ^PX]Ð“PQÝPTÍœÙÑ\PX•P’ÔQÍTØÐYÑ[XÐ’YÑËÐTÑPÔQYÐXÒP’ÒPTŒžQXÐXÖP‘ÙÒPT™ÐžYÑVXÜÐ‘™ÒPT”PžÑTÐYP‘PRTNŒÑTYP‘ÒTLŒÑSYP‘RT\ÐŒÑRÐYPÔRÐTZÐŒ”QRPYÐÐRÐTXÐQQÐYVP™ÒÐTUPÑQY\ÐRTTPŽQQY”P]ÒPTRPŽ]ÑPÐY™ÐYÒTQP‹ÔQPYTQÐPYÐP™ÙÒPPVRPÐPQÑPYÐPšRPPVVPÐPQÒYÐPšPRPPVZÐÐPQÒYÐPšTRPPV[ÐÐPQÓYÐPš]ÒPPV]ÐÐPQÓPYÐPšRPPVLÐPQÓYÐPš™ÒPPVMÐTQÓYÑPš”RPVLÐTQÓYÒPšRQV]ÐÐQÓYÔPšRQV\ÐÐ™ÑÓYÖPš]ÒRPV[ÐÐÐQÒÐYÚÐšYÒRÐVZÐÑQÒPYÌšÒTVUPÑÑÑÐYÎšRTXšÐžYÑPTÙÎ“PZÒTP’‘Ñ]”]ÐÑPXÝÐQYÔTÎQPRSPž”QPTÎ“PYÔRÐTP‘ÑÑ]T”PÐXÍQVTTÌQRQPžÑPT”N“UPYÐRTP‘‘Ñ]™Ð‹ÌQPTYÎ“VPY™PQRTTÌQRÔTPÑPQ\””PŽÑPTPP’ÌPYNSPQPTÝR•TPJÑTQ\”PPQPT‘P’ÑUPYS”PQÔÐTÚQM•PTP[PQPSÞP’ŒPUÐPŒÕTPN]Ñ[”P“›ÑPQ™PQPTÖ‘QL™ÐTPULYÑPTP’šÒPUÖPPTTPKÑ”QZÔ]Ð’Ì]ÑPTP’LPTÝÐQÐTÒÐQZ–TPJÑÑZTP‘Ì™ÑPT™Ð’QQPTYÐQØPTPPQÙTPM‘ÝÑYÐMQPSš‘ÞT
ÒPQYPT›ÊÐQÝÐTP\RÑV”PNNQPRÜÐÐPQYÐT™ÎQÝÐTP]TQVPMYÐPŽQPSÒP‘šœÐSÔPPÍÐT”MQžTP]Ò™ÑP’ÐPTSÔPL™ÐPŽÑPSTÙÐ”™“PQ\UÞTPLÓQ^VPPPŽÑPSÚP“ÓPQÌPTÛžPTPKÓ”Q[ÎÑPTQP’ÔPQRLTÚžPTPÓ]Ñ[ÎÑPT‘P’ÔPQU^TÚžPTP‘Ó]Ñ[ÎÑPTš’P’Ý’PQV^TÝžPTP‘ÓYÑ\NÑPT•P“PQT^TÞŒTP‘YÑ\ŽTQPTUP’ËÖPQPTÝTPYÐ[YÑ\šÔRPR^‘P““PÐPÞPTÜÞTÛÌTØÌTÔOH‹œÜXÚX[LKLŽˆ•ÝÐUUÔQV”QY•™ÑYÕ]Ñ[TQ[ÕPQ\UÑ\ÕÑ]UÑ]•Q]ÕQ^”ÝÑLÙÑL”ÙÑLÔÙÑLÔÔQMTÔQM”ÐQMÔÐQMÔÐQMÔÑNÑNÑNTÑJÔÑJÔÑJÔÑJÔÑJÔÑKÔÑKÔÑKÔÑKÔÑKÔÑKÔ™ÑT™ÑT™ÑT”QTQ””QTQ”Q”QTQTQTQKÔQJÔ”QN”QN™ÑM”ÑM™ÑMT™ÑM™ÑMT”QMTQM”TQPÔPMTQP”ÐJÔQSÝÑ“ÙÑÓÑ‘“™Ñ‘“]Ñ’]Ñ’YÑ’PQ’’ÙÑ”RÑ˜’”Q™]Ñš’PQ›’ÑœÑœÒQ‘ÝÑžÝÑžÙÑŒÙÑŒÔQŒQÙÑŒ‘ÐQÐQQÑ‘ÐQQ™ÑŽÑÑ™ÑŽQ™ÑŽQ™ÑŽQ™ÑŽQ”QŠÑQ‹ÑQ‹ÑYÑÐPT’P™ÐQTÐVPP‘TQÐTP™ÙÑTPVQP‘PQÐTN™ÔQSÐVTP‘ÑÑPTMšQSÐVUP‘ÑÑTLšÑSPVZÐ‘QÒPT]ÐšPQSPVZÐ‘QÒT]ÐšTQSPVZÐÝÑÒÐT\ÐšYÑSV[ÐÙÑÓPT[ÐšQRVMÔQÔTYÐšÙÑRPV’PÐQÕTXÐ›QRTÝÌQÚÒTÜÌQÙÒTÛÌÐQØÒTÚÍQØÑÐTÚÍPQÖQTÙÍQÖQTÖMQØÑTÓMQØÑTÔMQØÑTÔMQØÑPTÕMQØÑPTÖMQÙÑPTÕMQÙÑTÖMQÙÑTÖMQÚÑTÖMQÚÐÐTØÍQÚÐÐTØÍQÚÐÐTØÍQRŽPPØÐÐTØÍQRŠÐPØÐÐTÙÍQRŽPPÙÐÐTØÍPQS‹ÐPÖPÐTÖMPQR‹ÐPÖPÐTÖMPQRÐPTP[PYÑ[SÔP‘ÔQPR”SP’•ÐT’SPPÔQTÔMQTÑTPZÐ]ÑZÓÐ‘šQPR]ÓP’‘ÐT–TPPÕQTÔLÐQUÑTP[]ÑZ“Ð‘šQPR”SP’^˜ÐT–VPPÖQTÒLÐQUÒTP[QZÐ’PQPR™ÔP’UPTÒZÐPÕQPTÑLPQ[RÐTP[”QY“”P’šQPRUP’•PTÖ]ÐPÕQTPQ[STPZÐ”QYS”P’š”QPRVP’PTÖLPÖQÐTŒPQ[STP[™ÑY”P’š™ÑPR”VP’PTÖLPÖQÐTŒPQ[STP[™ÑY”P’š™ÑPR™ÕP’•PTÖMPÖQTÐLPQ[SÐTP[P”QZ”P’š™ÑPR™ÕP’Z•PTÖMPÖQTÓLPQ[SÐTP[PQ[”P’šÑPRSP’ž•PTÖPPÒQPTÖLPQ[TPTPZPQ[“”P’šÐQPRYÔP’ž”PTÜPPÒQPTØÌQ\TPTPZQ[“P’ÚÐQPRPTP’ÑPTÍQPPŽPTÙÌQ]TPTPYQ[Ó]Ð“ÔQPPV“PP›ÑTÚÞQ]TÐTPX]Ñ\YÐ“šÝÑPQÐSP’ÕPU”PP˜ÑTÚÞPQL•TPU]Ñ\TP”ÑPP\ÐPQTÙÞQJÖTPSÐ]Ñ[ÓTP”[YÑPQSP’ž‘PUPSP’ž‘PUTTP’šPUYÕP’‘PU]ÕP’^PU]ÕP’^NUXÐ’PÍU™ÙÐ’LUÚÐ’ÌUÐ[Ð‘Ú\ÐUÙÝÐ‘žZÐVP‘ZYÐVP‘XÐVPÖP–ZTPTÖPVZSP–”ÑP˜PÐP˜T˜^˜”Ð˜šÐ˜Ð›Ð˜Ô™Ð˜ÞÐ™˜Ð™–P™P™P™T–P™T”P™^P™^P™”P™””P™””P™šP™šP™žP™ÐQUVPP‘]ÑÐT“P™ÔQUVQP‘]ÑÐT“P™ÙÑUVRP‘]ÑÑT“P™ÝÑUVRP‘YÑÑPT‘PšQTPVVP‘ÑÒTNšÑSÐVYÐ‘QÒT]ÐšYÑSPV[Ð‘QÒÐT\Ðš]ÑSV[ÐÙÑÒÐTZÐ”‘NT”YÐ”•PT”YÐ”‘PT”YÐ”[PT™ØÐ”[PT™ÙÐ”RPTVP”SPT]ÕP”TPPU“PTUP“ÛPPU–PTX\ÐPNPUQRÜPTPTQM™Ð‘QPQÐSP“˜ÐTM“PP›ÐÐTÌVPPQ˜PQÔPÐTÝQÕPTÝPQÔPPTÞÐQÒPPTÝQÑPPTÝPQÐPPTÜPQÐPTÜQ˜ÐPTÜÐQMPTÛPQ\ÐPTÛQ]ÐPTÛPQ\ÐPTÛQYÐÐTÚQXÐTÛQVPÐTÛPQQRQTÛQQQPTÛPQÐTÚPQTÛPQPTQRÐPÙQÒÐTQSPPÖQÓPTQSÐPÖÐQSTÚÐQSÐTQTPPÙPQTÐTÖŽPPQ‹ÐPÍTÚÐPÝÔÐTÚÐPÛÕPTØPPTP[‘™ÑZÙÐQPRžPT™ÐR[ÐPPÖVPTÒÐPTP[ÔQZÐQPR^ÐTÐRÐPPŠÙÐTPP’QXÙÐQPRTÑPQPPŒPT•ÐÐTPXR]ÑUÝÑPQÒRPTšQTQUšQP‘ÕPT]ÏH‹œÜXÚX[LKLHŽˆ–TPUVÑX–QYQZÔQ[ÐQ[Õ™Ñ\•Q\Õ]Ñ]•]Ñ]•YÑ^UTQ^ZQPPUP“›P“šÎ“Œ“ÑN“ÑN“ÑM“ÕL“Ì“Ì”L”L”L”L”L”L”L”Ì”Ì”Ì”Ì”Ì”Ì”ÜÐ”Ð”Q[Ð”Q[Ð”Q[Ð”Q[Ð”Q[Ð”Ð”ÜÐ”\Ð”]Ð“ÌÐ“ÚÜÐ“ÌÐ”XÐ”ÔP”QPP”^Ð”ÑÐ”ÕÐ•Ð•P•M•”ÙÐ•ÚTPZYÐUÔÓP–QP–PÐP–PŽ–TŒ–VPTÐ–žÐ–žÐ˜›Ð˜šÐ˜ÞÐ™™Ð™Ð™P˜Ð™P™ZP™^P™^P™”•P™”•P™šP™šP™ÐQUPVQP‘]ÑÐÐT’P™ÝÑTVTP‘PQÑTPšQTVVP‘ÑÒTLšPQSVYÐ‘QÒPT]ÐšTQSPVZÐÝÑÒT\ÐšTQSVZÐÙÑÒÐT[Ðš]ÑRV]ÐÐQÓTYÐš”QRPVMÐQÓTYÐšÑRV‘PÑÔTVPšÙÑQV“PQÕPTTP›QQV•P]ÑÕTSP›QPÐV˜ÐYÑ]“YÐœTQ]SPœYÑ\“”P›ÐPQ\“PP“™Ð›ÐPQ\“ÐP›PQ\ÙÐ›PPQ\ÙÐ›PQ[SÝÐ›PQ[ÝÐ›PQ[SÝÐ›PQ[ÝÐ›ÐPQ[SÝÐœPQ[SÝÐœPPQ[SÝÐœPPQ[TPœPQ[TPœPQ[PœPQ[PœPQ[TPœPPQ[PœPQ[PœPQZÔPœÐPQZÔPPQZÔPPPQZÔPPPQZÓÝÐPQZÓÝÐÐPQZÓÝÐ‘YÐQPSQP’^œÐT’QPPÜÐTÒMQUÐÐTP\PTQZÙÐ‘™ÙÑPRÝÒP’QÐT›ÓPPÛÐÐTÐMPQXQPTP\PYÑY“ÔP‘ÚQPRÔRP’šÐT›ØÐPÙÐÐTQYRPTP[YÑYSÐP’TQPRÒP’™ÐTÒ[ÐPÖPÐTQ[STP[YÑYSÐP’ZQPRÐRP’™ÐTÒLPØÐÐTQZSÐTP[ÐYÑYSÐP’š™ÑPRÔRP’™ÐTÖNPÚÐÐTŽQ[TPTP\YÑY“ÐP’šÔQPRÒP’UÐTÖ’PPÙÐÐTÒMQ[UTP[YÑZ“ÐP’›QPRÒP’‘ÐTÖ˜ÐPÕPÐTÕMQ[UÐTP[TQ[“ÐP’›ÑPR™ÐP’ÕÐTÖ˜ÐPÖPPTÙÍQ[VTP[PPQ\SÐP’›ÑPR™ÐP’Ú™ÐTÖ˜ÐPÖPPTÜÍQ[VTP[PPQ\“ÐP’›ÑPR™ÐP’Þ™ÐTÖ˜ÐPÖPPTÜÍQ[VPTP[PQ\“ÐP’›PQPR”PP’Þ™ÐTÖ™ÐPÔPPTÜÍQ\VPTPZÐPQ\“ÐP“TQPR]ÐP’Þ™ÐTÍZÐPÒPPTÜÍQ^VTPYÐPQ\“ÐP“›TQPRPPP’Ú™ÐUÐPPTÚÍQJØPTPYPQ\Ð”›YÑPRPP’ÕÐUVœÐP›ÐTØÌÐQ’ÙTPVYÑ[Ð•”QPQ™ÒP’‘ÐU’ÐPPNTÒLÐQ•ÚTPSÐQZÐ•ÛÙÑPQUP’˜ÐU™ØÐ’ÐU™ØÐ‘Þ–PUÐ]Ð‘•PUÐ]Ð‘‘PUÚÐUPUÞ”P–P–P–‘P–P–UP–TÎ–^M–Ì–š\Ð˜PÛÐ˜TÙÐ˜ÖPTÙÐXÕP˜ÐÓP˜ÞRP™ÑP™PP™PŽ™TŽ™T™Z™^™^™”Œ™šÐ™ÐQXÐVPP’QÐPTÐ™ÐQXÐVQP’QÐÐTÐ™ÙÑXVTP‘ÝÑÑPTœÐšQXVUP‘ÝÑÑÐT›ÐšÑVVZÐ‘ÔQÒT™ÐšYÑVV\Ð‘ÑÓT˜Ðš]ÑUVL‘”QÓPT“PšÑTVP‘ÑÔÐTM”ÛÐTÐ\Ð•™ÐTÐ\Ð•šÐTÚÐ•ÐTÐXÐ•ZÐT™ÖP•[ÐTVP•ÐT™ÔP•[ÐTTP•ÐTTP•›ÐT]ÔP•œÐTYÔP”Ì\ÐTTTP”Ì]ÐTÔP”ÛÐTÔP”›TTP“™ÐQMTVP“ÐP[SÝÖP’ÕPPUÐPSÙÖP’ÛPPSÙÖP’žMPUÑPSÔXÐ’Œ“PSÙÐ’•ÔPS™ÙÐ’‘ÖPS”ZÐ’[XÐS”[Ð’UÜÐST\Ð’ÐSP[Ð’QÌSÜÐ’ÑPS]Ð’“PRÝÌ’PRÝÝÐ’•PRÝÌ’–PSTM’˜ÐSÓPPQTTLÐQRTTLÐQTTTŽLÐQUTTŽLÐQUTPTÐŒÐQVTPTÐŒÐQVTPTÑQUTTÐQUTÐTÐQSTÐTÑPQTUTÑQSUPTÐQSUTŽMQSUÐTMQRVPTžQTQT›QØT›QÙÐT“QYÐT’QZTMMQÜÐTPP™YÑ\Ù]ÑZÙQZ™QZY™ÑVH‹œÜXÚX[LKLˆŽˆ•™ÐU”QUUTQYPQYUQZÕQ[TÝÑ\ÙÑ\”ÔQ]ÐQ]ÔÑ^Ñ^T™Ñ^””QLT”QLTQLÔ]ÑM]ÑMTYÑMÔYÑMÔ]ÑM”TQNTTQNTQJÔTQJÔTQJÔTQJÔTQJÔTQJÔTQJÔTQJÔTQJÔTQJÔPQKÔPQKÔPQKÔPQKÔPQKÔTQJÔTQJÔPQKÔTQNPQJÔPQNTTQNTQMÔTQMÔYÑMTYÑMTQMTPQM”PQM”ÑNÔQQPNSÐQ“ÐQ“Q‘“]Ñ‘“PQ’SÑ’ÓQ“ÝÑ“R™Ñ”’™Ñ”’TQ–TQ˜RÑšRQP’ÐšQÝÑœÙÑœÑÔQQÔQ‘ÐQžÐQžÑž‘™ÑŒ‘™ÑŒ‘™ÑŒÑ”QQQ‘”Q‘Q‘QŽQŽQŽQŽQŽ]ÑŽQYÑŠÑYÑŠÑTQ‹ÑPQÐPTN™ÔQSÐVSP‘ÑÐÐTN™ÐQSVRP‘QÑT]Ð™ÝÑSPVTP‘QÑPT]ÐšQSPVUPÝÑÑT\ÐšÑRÐVYÐÙÑÒPT[ÐšPQRÐVYÐÙÑÒPT[ÐšPQRVZÐÙÑÒPTYÐš]ÑRPV\ÐÑÓTXÐš™ÑQÐV‘P™ÑÔTVPšÝÑQTÝÞPQØÑTÝÞPQÙÑTÛÌQÖQPTÚÌPQLQÖQTÚÌQØÑTØÌÐQÖQTÖMQÖQTØÍQØÑTØÌÐQÙÐÐTÙÍQÙÐÐTÙÍQÙÐÐTØÍQÚÐÐTØÍPQÙÐÐTØÍPQÚÐÐTØÍPQÚÐÐTØÍPQÚÐÐTØÍPQÛÐÐTØÍPQMPPÜÐÐTØÍQPPPÜÐÐTØÍPQMPÜÑTÖMPQPPÝÑTÕMPQMÐPÜÑTÕMQPŽPÛÑPTÔMQQŽPÛÑTÒMQQŽPPÛÑPTÓLÐQRŠÐPÛÑTÒLÐQRÐPTP[”QZSÐÙÐQPPVRPPØÑTÑLQSÐÐTP[”QZ™Ð‘QPR™ÕP’UPT’TPPÖQTÐLQTÑÐTP[”QYÓ™Ð‘ZÑPR”UP’QPT’XÐPÖQTÐLQTÒPTP[”QYÓ™Ð‘šTQPR™ÕP’QPT–ZÐPØÑTŽQUÒÐTP[”QYS™Ð‘šQPR”UP’–PT–LPÔQPTŽQUÓÐTP[QY“™Ð‘šÐQPRSP’QPT–‘PPÔQTÐLQUÔTPZÐ]ÑYÓ™Ð‘šÔQPR”RP’UPT–‘PPÕQTÑLQUÔTP[YÑZS™Ð‘šÔQPR”QP’‘PT–‘PPÕPTÔLQUÔTP[PQ[S™Ð‘šÔQPR”QP’š–PTœPPÕPPTØÌQXTTP[PPQ[Ó™Ð‘ÚÝÑPRPP’ÑPTRPPÔPPTÚÌPQZUTPZPPQ\P’šÝÑPRYÐP’ÕPTÍSPPÑPPTÚÞQL•TPYÐPQ\YÐ”ÝÑPRÐP’ÕPUSPPŽPTÚÞPQÕPTPYPQ\YÐ”›QPQÙÐP’ÕPUMUPP›ÐPTÚÝÐQ•ÕÐTPVPQ[ÓPP•›PQPQ”PP’žPUœÐP‘ÜPTPPÐPQ[“PP–TQPQTPP’žNUÖÐPLTÕ]Q›YTPRTQZÓÐ˜PYÑZSÐ˜ÐYÑZÐ˜Ð]ÑYÓP™P™ÑXÓÐ˜Ð™ÑX“P™ÝÑTÓPšÙÑURÝÐš]ÑRRPP’ÙÐšRÔQšÒÐQ›RÑ›’Ñ›’™Ñœ”QœRQœ’QœÒYÑRYÑ’PQžÑP’PPžRÑŒRQŒÑÝÑQÙÑ‘ÔQÑÐQŽQÐQŠÑ™ÑÐPT–P™ÐQUVRP‘QÑT”PšQUPVTP‘]ÑÑT’PšÑTÐVXÐ‘TQÒT‘PšYÑTV\Ð‘TQÓT‘PšQTV]Ð‘TQÓT‘Pš”QTVM‘TQÓT‘Pš™ÑTVN‘TQÔT‘PšÑTVN‘TQ‘ÕÐP’QTQ‘UÔP’YÑÕÝÐ‘‘YÑ•ÙÐ‘ÑTQUÙÐ‘ÑTQUÙÐ‘ÑTQKÕÝÐ‘‘TQNUÝÐ‘‘PQNVP‘QÑNVPÑÑNVP‘ÑNVPÑÑNVP‘QNVP‘QNVPQQNÐJÐÝÑMÖÐJÐÙÑMÖÐNÔQM–PPMÐÔQMPPMÐÔQLTPMPÔQLTPMPÐQLTPMPÐQ\YÐMPÐQ[ÖYÐMPÑ[Ö]ÐMPÑ[–PMP™Ñ[–™ÐL™Ñ[V”PMQ[Ö™ÐLÐ”Q[XPPLQ[˜”P^]Ñ[Ø”P^PYÑ\Ð\YÑ[ÙÐ\YÑ[ÙTP\YÑ[ÙPP]PYÑ[ÙPP^PYÑ\TP^PYÑ\YTPMPQ\YÐMQ\™]ÐNP”Q\ÙPP™Ñ\ÙPPÑ]YPÐÐQ]YP‘ÙÑ]YP‘ÙÑP‘P]”P‘QÑ\Ù”P‘QÑP‘PP\™™Ð‘YÑ\Y™Ð‘]Ñ\Y™Ð‘™Ñ[™™Ð‘™Ñ[™™Ð‘Ñ[Y™Ð‘ÐQ[™Ð‘ÔQZÙ™Ð‘ÙÑZ™™ÐRQY™™ÐJÒÑQYÐV™™ÐNRYÑVYÐMÒ]ÑP’”PP’ÐP“YÐP“PQ™ÐQPS›ÑPTÍH‹œÜXÚX[LKLÈŽˆ–PUTQUÖÑYQYÕÝÑZÕÝÑ[ÔQ[ÕÐQ\UÑ]™Ñ]•”Q^Q^•QL]ÑLYÑL•YÑLÕTQMUPQM•PQMÕPQMÕPQMÕÑNÑNUÑJÕÑJÕÑKÕÑUÑUQ•Q•Q•Q•QÕQÕQ•Q•Q•Q•Q•Q•QKÕQKÕQKÕQJÕQJÕÑNUÑNÑMÕÑM•QMÕQMÔÔQJÔÐQKÔYÑ‘”TQ‘”Ñ’TQ“ÝÑ“SÐQ”Q–“Q–RÐQ˜ÒÐQ˜’™Ñ˜ÒQ™YÑ™’TQ™RPQ™’Ñ™’Ñ™’Ñ™ÒQšÒQ›RQœZÑPPTÐ˜”Ð˜žÐ˜ÐœÐ˜ÚÐ˜ÞÐ™›Ð™Ð™Ð™P™Ð™ZÐ™^P™•P™”“P™ÐQTÐVQP‘YÑÐT‘P™ÙÑTVRP‘TQÐÐTP™ÝÑTPVSP‘ÑÑPTNšQTVTP‘ÑÑTNšQSÐVTP‘QÑÐTLšQSPVXÐ‘QÒPT]ÐšPQSV[ÐÙÑÓTZÐš”QRVLÐQÓÐTZÐš™ÑRVP™ÑÔTVPšÔQQV’P”QÔÐTUP“PVTP“•PV”TP“ÐVSP“ÐV”SP’ÞšÐV”SP’Ú›ÐVSP’ÕÐV]ÓP’šÐV]ÓP’šŒV]ÓP’šŒVSP’šŒV”SP’šV]ÓP’šV”SP’•V”SP’•VSP’•V”RP’šŽVRP’•VRP’•V™ÒP’•V™ÒP’•VÒP’‘XPRP’‘XTRP’^ŒXYÒP’^ŒXYÒP’ZŒTRRÙÒP’ZÐTVRÔRP’UÐT[ŽRÙÒP’UÐTMPPÛÐÐTÑMQTÐÐTP[ÐYÑZÙÐ‘YÝÑPRÐRP’QÐT’TPPÖPÐTÐMQTÑTP[YÑYÓÔP‘šÑPRÒP’™ÐTPPØÐÐTŽPQXRTP[ÐYÑY“ÐP’PQPRÒP’™ÐTÐPÙÐÐTŽQZRTP[ÐYÑY“ÐP’ZYÑPRÐRP’QÐTÖ]ÐPØÐÐTŽÐQ[STP[TQZSÐ’š™ÑPRÑP’Z–PTÛÎPÖPTÔLQ[TPTP[PQ[Ð’ZÔQPR™ÐP’ž˜ÐTÒ’PPÕPPTØÌÐQZTÐTP[PQ[“Ð’ZÙÑPRÐP’ÕPTÖ’PPØÐPTÚÌQ[UTP[PQ\™Ð’šÝÑPRÐP’ÕPTÖ“PPØÐPTÚÌQ[UTP[PQ\™Ð’šÝÑPRÐP’Ú–PTÖ“PPØÐPTÚÌPQ\UTP[PQ\S”P“QPR”PP’Ú”PTÍTPPÓPPTÛÌPQ]UPTPZÐPQ\P“›QPR]ÐP’ž”PUPPÓPPTØÌQJÕTPYPQ[“]Ð”[QPRPQP’š“PUV•PPÐPTÕ^Q’ÕTPYYÑZ“YÐ•ÑPRRP’Z’PU–˜ÐP›ÑTÑ^PQ˜VTPXP”QYYÐ–PQPQÐVP’PUZÐP–RPT›ÞQšXPTPUPÔQVSTP–›”QPQÜÐTMQZPUÍMP\ÓÐT‘]ÐQÝUŒUPUÐ]UÒ]UÒ\ÐUÔ\ÐUÔ\ÐUÕ\UÕ\PUØÜUØÛUÜÛPUÝÚÐUÍVZPVZVYÐVYVYPVÙPVÙPVÙPVÙVØÐVØÐVØÐVØÐVÐVÐVÐVPP’QÐTÐ™ÙÑXÐVSP’QÑPTÐšQXÐVUP’QÑTÐšÑXÐVVP’QÑÐTŒšQYVUP’QÑÐTŒšÑYVVP’QÑÐTŒšÑYVVP’QÒTÐ”ÐTžÐ”QÐTžÐ”LTšÐ”T^Ð”TšÐ”NTZÐ”TZÐ”NT^Ð”•PPUŽTT–P”PPTT•P”PPTT•P”ÐPTP“P”ÐPTP‘P”‘PTP”ÑPTÎ“ÑÑPTÍ“ÕÒPTM“RPTL“’PT]Ð““PSÝÝÐ“TPSÙÝÐ“ÔPSÙÝÐ“ÕPSÙÝÐ’Ì•PSÙÝÐ’ÛVPSÔ]Ð’ÕÖPSÙÌ’ÑØÐSÐL’ÑÙÐSÐM’ŒšÐSÍ’ŒœÐS™Í’›LSN’‘ÎS^P’LÛÐRÔ‘P’[œÐRÚP’[œÐSP’VSP’VT“P’VTT”P’VT^P’QPPVT–P’[ŽTZÐ’[ŽT–P’–T™Ð’’T™Ð’–TšÐ’›ŽTšÐ’›ŽT›Ð’›ŽTœÐ’›ÑPQRXTØPTP]ÙÑPPTÐ’–QPQPYTÔÐTPKÒQZÙÔQPTPQYPTÓÐTPMÒÑZYÔQPSÚPP’RQPQZTŠÐTP^]ÑX™ÔQPSYÐ‘›ÑPPÍTQ\ÔQP’›ÒPTŠÚTPP™ÙÑP’SPT’ÑTQTH‹œÜXÚX[LKMŽˆšÝÑPQMTQÔPTPUÚ”QP’ÌTÐÓTQZÚ]ÑP’–ZÐTÚRPTQ\ZÑP“VPTÍ‘TQ]ÚQP“[ÔPUÑTQLYÙÑP“›ÒPUPÐTQLÙÔQP“ÖQPUPTQMYÐQP“ÛŽ“ÌÎ”””””””””Œ”Ì”Ì”Ì”Ì”ÐPZPUÒÐTPS”QKÞTQPQ”ÐPŽPUÒTPT™Q^ÑPQLÝÐ”SUPP•ŽUÑPTPVQKÞQPQŒÛÐ”SSPP›USÐTPX˜ÙÑ’ÔQPRÐ‘VPTÓQPPŒXUŒÐPTPYUÐQ™ÝÑPRQ–P–\ŽPÑ•PUÔÊÐTPZU]Ñ›]”QPR‘‘P˜\ŒPÔ”PV’P•ÑÕPUM›Q“V˜Ð•QÖPU\Ð›YÑ“V›Ð”ÙÑØÐU[Ð›Q’V”ÔQÙUYÐ›ÐQ’PXPP”ÐQÙÐUYÐ›ÔQ’XSP”™ÑÚÐUVPœQ‘ÐXUP”™ÑÛPUVPœÑ‘ÐXM”™ÑÝUVPœÙÑ‘ÐX“P”™ÑÌPUVPÑ‘ÐX–P”™ÑÌÐUXÐUZÐ]Q’PX˜Ð”ÔQÌÐUYÐPQ’PXšÐ”ÔQÍPU[ÐPQ“X˜Ð”ÙÑÍPU\ÐTQ“PX™Ð•QÍPU]ÐTQ“X™Ð•QÍULPQ“X™Ð•ÑP•PPÌPUNÑ”X–P•ÑÌPUPœÝÑ”X’P•YÑÝÐU“P–“ÐQ[UÒÍPTP’U”Qš]ÑPT›Ð–ŒQT–UŒŽPTP‘ÔQ–ÑPTQšÐ•ŽPQVU–TPMUÙÑ•^QPPXØÐPRTPLÙÑ”ÞYÑPS[Ð•\ÌP[–TPZUÙÑ”LÔQPR›Ð•
ÑPP™UKÚPTPT•ÔQ“ÍYÑPPŒYÐ•P•UP•TP•Q“P•[P••‘P•Ñ‘P•Ì–Q]Ð˜Q]Ð˜‘[Ð™ÚÐ™ZØÐ™ÝÑ‘ÐVXÐ””QÒÐURPšÝÑV–P”ÑÙÐUœÑMÐX[Ð“ÔQÝUÐœÐQLÐX”P“QÍPUP”Q^X“PRPTÎÝÑ]PXÔP“ÒÐTÌžÑ\ÐXÚÐ’ÝÒTÜÐž]Ñ\PXÌ’ÙÒTÚÐž™Ñ[ÐYP’ÐRPTØÐŒQ[YP’™ÒPTÖPŒPQ[YP’RTÓPŒ”QZYÐ’PRTŽŒÙÑYPY’RTÐÑXYTP‘ÝÒTœÐTQVYYÐ‘ÔRÐTšÐ”QVUÔÒPTP‘Ñ›TQPYZÐ–R‘PRVUžPRÔÐTPžQÑ˜›YÑPXZÐ•›PPVPX[TP™‘Ñ•œQPVP˜Ð•’ÍQ˜ÖU“ÝTP•ÑÑ•ÔQPU˜Ð•\“PQ’VU’ÌTP”‘™Ñ•QPUP–P•\•PQNÐU’ÌTP“Ñ™Ñ”ÑPU˜Ð•ÙÐQ\ÖUJÍPTP’‘Ñ“ÝYÑPTÐ™Ð•œÐQVVPU^NPTP‘‘ÔQ’Ý”QPT”šÐ”ØŒQXÖU[JÐTP‘ÑÔQ’™ÑPTšÐ”œŽQVVUVPTP‘QÔQ‘ÔQPTšÐ”NPQUVUUÐTP‘‘ÑÝÝÑPT˜Ð”XÒPQVUÐUÑTPPžQPT•P”PQTUU’TP‘”QMÞÑPT^P“ÜÚÐQRTÐU“ÐTPNQYÑLž™ÑPTP“UVPPYPPRTPM‘PQ]ŒÙÑPSTP“NQTTÍÚTP]ÑÑ]MÑPSTM“SPPRTP]ÑQ]MTQPST\Ð“
ÖPQRÐTËÛPTPLÔQ]YÑPS”XÐ“SØÐQQÐUÐTPL”Q^QPSÕP“SÙÐQÑUÐTPMPYÑ^QPSÙÑP“]YÐQÐUÐTPNPPQ^MQPTÐP“]YÐQPUÐTPJÐPQ^MQPTÐP“]YÐQPUÐTPKÐPQ^MQPTÐP“YZÐQPUÐTPKÐPQ]Í”QPTÑP“[ÐQÐTÌÍPTP\ÐYÑ\PP™ÙÒPRTOOH‹œÜXÚX[LKMHŽˆšÑPQMPT™XÐTPPÙÔQP’ÐPTŽKÐTÒŠÐTÔŽTØZTPP™]Ñ\YÑ\ÙTQ]YPQ]ÙÑ^Ñ^YÑ^YÑLQL™QLÙQLÙQMQMXÝÑM˜ÝÑM˜ÙÑNÙÑNÙÑNÙÑNXÙÑNXÙÑNXÙÑNXÙÑNXÙÑNXÙÑNXÙÑNXÔQJØÔQNXÐQJØÐQJØÐQJØÑKØ™ÑXPQ‘Ö”Q’VPQ“–Ñ“ÖQ”UÝÑ”•Ñ••YÑ–•PQ›Ñœ•ÑÝÑŒÔQŒÔÑ”™ÑŽTQÐUSPšQÐVXÐ”TQÒUQPšYÑV\Ð”PQÓPXÌPQKÐV“P”ÑÕÐU›TQNPV”QÙÐU›ÙÑNXTP“ÝÑÛUÐœTQMÐX[Ð“ÝÑÜÐUÐœ™ÑMÐXP“ÝÑÞUÐœÙÑMÐX“P“ÝÑÌUÐQNX•P”QÌPUÐQNX–P”QÌÐUÐÑNPX–P”QÌUPQJÐX˜Ð”ÑÍUPQJÐX™Ð”ÑÍUPQJÐX™Ð”ÑÍUÑJÐX˜Ð”PQÌPUQPX“P”PQÌUPPœÝÑPX’P”TQÞUQPœÐQXN”YÑÝPURP˜“ÐQ‘UÕÜPTPP]ÑPSLP–\ÐPPRÐTP\””Q™]ÝÑPPXÙÐPÓ‘ÐU’ÐTPY”™Ñ˜^™ÑPQÕXÐ•Ó‘PP“’Uš”ÐTPT”ÐQ•ÔÐQ•”ÔQ•TÔQ•TÔQ•TÙÑ•ÝÑ”ÕQ”•Q”•Q”ÕÑ•TQ”Õ]Ñ”Õ]Ñ•UYÑ•ÕTQ˜UPQ™ÕPQš•ÑœUQP•Ð”ÝÑŒ”ÐQÐPUXÐšQ‘ÐV[Ð”]ÑÔURPšÙÑPV›Ð”ÑÙUÐ›ÝÑMÐXYÐ“ÙÑÜPUÐœÐQLX’P“QÌÐUPTQ^PXœÐ“YÑÎUPÑ]ÐXÐP“ÒTÍÙÑ]XÔP“RTÜÐžÑ\PXÙÐ’ÙÒPTÚÐžYÑ\XÛÐ’ÐRÐTÙÐž]Ñ[XÜÐ’ÒTÖPž™Ñ[PXÎ’”RPTÔPŒQZPYP’YÒPTÐPŒ]ÑYÐYP’ÒTŒŒ™ÑXÐYÐ‘ÝÒT›ÐŒÙÑVYPP‘ÔRT™ÐÑVUÕÑÐTPŒQÑšYYÐPšTQPXÞÐ–VNQÌÐU”PTPœÑ™Ñ™ÙÑPX^P–™ÐQÖUUœXTPQÑPVP•œPPPQÚPTP˜Ñ”Q•\TQPU”•P•\LQ‘UUÝTP””Q”œÐQPUP•SPQLUÞPTP“Q”Q”ÙÑPU•P•ÓPQ[ÕUMŒTP’‘”Q“ÝQPTÐ”P••PQXÕU^LTP‘Ñ”Q“]ÑPT–P”ÍØÐQTVU[MTP‘Ñ’]PQPT^Ð”ÚÐQRVPUXMTP‘ÐQ‘YÑPTT™Ð”“ÐQQVUTÎTPQ™Ñ‘QPTP•P”˜QUSÊÐTPKÑQÝÑPTP”Q•PPXÐPQPUQTPNQKÞQPT“P”ÐQÔÐUÒTPLÑTQJÞ”QPPYPPRTP\ÑTQMŒTQPSP“ŽVPPÌPU–TP]QÑ]LQPSÎ“ÐPÍÐTÌØPTP]‘Q\Ì™ÑPSTL’Î[ÐQSPTÝ˜TPLÝÑ\LÑPS”[Ð’Î\ÐQÒTÜ˜TPMPÔQ\LÑPSÖ•PÐPQRPTÜ˜TPNÐQ\LÑPTVP’Î\ÐQÐTÝ˜TPQ\ÌÑPTTTP’Î\ÐQRPÐTÌØTP‘YÑ]ÑPT]ÒP“ÐQSPTÍØTP‘PQ]ŒÑPT]ÐP“\ÐQSPPTËØTP‘PQ]ŒÐQPTYÐP“LQQPPTËÙPTPPPQ]QPTPP“˜ÐPÔPPTÌÍPTPZTQ\]Ñ[Ð]Ñ[H‹œÜXÚX[LKMˆŽˆšTQPQMPT˜QPTQYÝÑP’PTÓÐPTQZÙ™Ñ[™”Q\Q\Ù]Ñ]YYÑ]™TQ^TQ^YTQ^YPQ^™ÑL™ÑL™ÑMÑMÑMÑMQM™QMÙQNQNQMÙQMÙQMÙQMÙQMÙQMÙQMÙQMÙQNÝÑNXÝÑNXÝÑNXÙÑJØÔQKØÔQKØÔQJØÐQKØÐQKØ™ÑXQØPQ‘–™Ñ’Q’–YÑ“ÖPQP–YÐ”–Ñ•ÖQšÕ”QQžUPQUÑŽQÐPU\ÐšQ’ÐVVP”ÐQÒÐUXÐš]Ñ‘ÐVL”™ÑÓÐUTPšÔQ‘PV’P”]ÑÕPUSP›QÐV˜Ð”YÑÖPUQP›]ÑÐVŒ”TQÙÐUQP›ÙÑPXTP”PQÛUPPœÑPXVP”PQÛÐUœTQKÐX\Ð”ÑÜÐUœ™ÑKÐXN”ÑÝUœÐQKÐX‘P”ÑÞUQJÐX•P”QÌUÑNPX™Ð”ÑÌUTQNPXšÐ”QÍÐUÐ]ÑNXÐ”QÎPUÐQNXÐ”QÎUÐQNXÐ”QÎUÐQNXÐ”QÎUÐQNXœÐ”QÍÐUÐ]ÑJÐX˜Ð”ÑÌÐUQKÐX”P”ÑÜÙÑPTQ˜ØÐQÊÐUÊÊÐTP^”ÑP”TPœÝÔQPSP˜“TPPÝUÝ‘ÐTP[ÔPQœÞTQPRLP˜NÐPPÐUÜ“ÐTPX”]ÑœÑPQLP˜YPPQ‘PUÚPUÔ’PUÕ’ÐTQ”QŽTUŽTÐUŽVUžÐU›U›UŒVUÖ•ÐUÚÐV”PV“VVRVSP””QÒUSPšQV’P”PQÕPU›YÑNVÐ“ÝÑÚPUÐœÑMX[Ð“™ÑÝÐUPœÙÑLX–P“]ÑÍUPTQ^PXœÐ“TQÎPUPÑ]XÑP“ÒTÍÝÑ]XÕP“RÐTÝÐžÑ\XÙÐ’ÝÒPTÛÐžTQ\XÜÐ’ÐRPTÙÐžQ[PYP’™ÒPTÔPŒÑZYP’YÒPTÑPŒ™ÑYÐYÐ’ÒPTQYYRP’RTœÐYÑXPTQXÐSÖP‘ÙÒT›Ð˜[ÍRVUÜTTPžQÔQ›ÝÑPXÐ™Ð––•PQÎUÒÖTPœ‘ÑšQPPVQÖVUœYPTP›Q™Ñ˜[ÝÑPVZP•“PQÒUÐU’ÚÐTPš™Ñ•PQPV–P•\\ÐQ›ÕÐU‘ÝTP–Q™Ñ”\ÔQPU˜Ð•ÒPPQÌTP”‘Ñ”QPUP˜Ð•–PQNPULTP“QÐQ“]PQPU™Ð•ÐQ\ÖU\MTP’‘ÔQ’QPTžÐ”ÓÐQYÖUYNPTP’ÐQ’]™ÑPTšÐ”œŽQUVUYPTP‘QÑ‘ÝÐQPT˜Ð”“PPQUUÐUTTP‘Q™ÑÝÔQPT”•P”\ÓPQSUUQÐTP‘QQ^QPT^P”PQTUPUÑÐTPÑYÑN^ÑPT‘P“ÎÐQTTU’TPÑTQLžYÑPTYÎ“‘UPPXÍQPTTÍÔTPQLPQPSÝÍ“PQÓÐTÜ•TPNQQ\ÍÑPSYÝÐ’ÊÔPQRÐTÞšÐTP^PÔQ\YÑPSYÙÐ“ØÐQRTÞ›ÐTPLÐQ\MQPS”VP’ÊÚÐQQTÝœPTPLÐQ\™ÑPSÐSP’ÊÛÐQÐÐTÞœPTPMPYÑ\Í™ÑPSÝÒP’ÊÛÐQÐTÞœPTPNPQ]™ÑPTPP“[ÐQPTÌÜPTPNPPQ\Í™ÑPTPP’ÊÛÐQPTÝœPTPNPPQ\™ÑPTPP’Ý\ÐQÐPTÜœÐTPMPPQ\ÔQPSÐQP’PÐPÒOH‹œÜXÚX[LKMÈŽˆ™ÙÑPQ’’’œÐ’VÐ’[›Ð’–Ð’PPQŒÐTÜTÌLPTÎLUŒUžUžPUžUÐUÐUÐUÐUUPUPUPUPUPUPU]PUU]U]U]U]U]U]U]U]U\ÐU\U\U\UZÐUUšÐUU™U\U]PUMVPUNTUšÐU›PUŒRUÌRPV‘ÐVVVPÐVPVSP”PQÑUšPQJÐV[Ð”ÑÓUšQNPVL”QÓÐUšÑNV‘P“ÝÑÕPUÐ›QMÐV™Ð“ÝÑÖUÐ›YÑMÐVŒ“ÝÑÙUÐ›ÐQMÐXQP“ÝÑÚPUÐœQMÐXTP“ÙÑÛUÐœPQMPX[Ð“ÔQÜUÐœQMPXL“ÐQÝUÐœÔQLÐX’P“ÑÞUÐœÝÑLÐX”P“ÑÌUÐQLÐX•P“ÑÌPUÐQLÐX•P“ÑÌPUÐQMX”P“ÔQÞUÐœÝÑMPX“P“ÔQÞUÐœÝÑMPX“P“ÝÑÞUÐ˜˜ZÐQRMÐUÞ\ÐTPKÔQœœ™ÑPT˜SPQÊÐUÙLTPLTÑ›PQPSQPP–\šÐPÎPUÐÍÐTP\ÔQ˜ÝQPRÕUP•ÜŒPÙU•ÊÐTPZ”ÙÑ•ÔQPRÐ•SRPPžÐULÒPTPUPQ’ÞPQPQPP”ÛP”ÕP”ÕN”ÕM”ÚÌ•\Ð•U\Ð•ZÖPZÚÐU‘TP–P–šÑP˜Q˜žœÐ™UÐ™œ™ÐPRLÐVVP“™ÑÓPUPšÙÑ^V›Ð“PQÙPTÎœÑ]X[Ð“QÝPYÐPQ\X’P’ÙÑÌÐTÚÐTQ[ÐXÐ’ÐQÎPTØÐÑ[PXÑP’”RTÕPžQZÐXÖP’RÐTÓPžPQZXÙÐ’YÒTÒPžYÑZXÜÐ’TRPTÐPž”QYÐXÌ’ÒTŽžÑYYP’RTœÐŒYÑXYÐ‘ÔRTšÐŒÐQVPY‘ÒT–PQUYRP‘RÐT”PTQUYXÐ‘YÒÐT’PQTÐYYÐ‘YÒÐTP–’Y”P–VQPRÔPUžRTPž‘PQ–šÐQPXZP•–PQÛÔPU’ÔÐTPP›]ÑPVP•PPVœÐQPUØÐTPP›™ÑPPXQPQšÔPULYPPQÚÐTP•‘PQ“ÜQPU^P•XÐQ‘TPUL›ÐTP”‘PQ“\TQPUPP•ÚÐQNPU^\PTP“‘TQ“]ÑPTÞP”Ø]ÐQZÔÐUZ]TP’QYÑ’\”QPTÐ’P”œMQXÔÐUX]TP’YÑ‘œÑPTšP”“PQVTÐUTÞTP‘‘]ÑÜÔQPTšP”\’PQUTÐUQÞTP‘‘TQ]QPTP”SPQTTPU
ÌTP‘PQJÝTQPTTP”›ÐQQTUŽTPQÐQPSÝÍ”ÑPQÓÐUÐTPQ^TQPSL“ØÍQSUTP]ÑQLLQPSP]Ð“S’PQSPTÞ•TP^ÝÑ\ÌPQPSYÜÐ’ÎTPQRÐTÜ•TPLÔQ\LTQPS™ÚÐ’ÙPQÒPTÛ•ÐTPMPÑ\]ÑPSÙØÐ’ÙÐQÑTÜ–TPJÐ”Q\]ÑPTÔP’Ó˜ÐQPQTÛ–TPYÑ\L]ÑPTTQP’ÎXÐQSPTÝ–TP‘TQ\Œ]ÑPT]ÐP“˜ÐQSPPTÞ–TP‘PQ\Ì]ÑPT]ÐP“˜ÐQSPPTÞ–TP‘PQ\ÌQPTYÐP“šÐQQPPTÞ˜PTPKÐPQ\ŒÝÑPSÔPP’ËÒPPÒPPTÜŒPTPXÐYÑ[PYÑ[ŸNÂ›]Üš]PØ[˜\ÌMÌÏJË
OOžØÛÛœÝÏYØÝ[Y[˜Ü™X]Q[[Y[
	ØØ[˜\ÉÊNØËÚY]ÎØËšZYÚZÜ™]\›ˆÎßNÂ˜ÛÛœÝÜš]PØXÚLMÌÏ[™]ÈX\

NÂ‹ËÈ^XÝÛÛ›™XÝYÚ[ÝY]\È\™H™[™\™\ˆX\ÚÜËØXÚYÛ˜ÙKˆ›È[XYÙH™XY˜XÚÈÜˆÓÔ”È\[™[˜ÞK‚™[˜Ý[ÛˆÜš]PÝ]MÌÊ[K‹Ù^K[L
^ÚYŠZ[OË˜ÛÛ\]_Z[K›˜]\˜[ÚYYŠ\™]\›ˆ[ØÛÛœÝÚÏZÙ^JÉÎ‰ÊÝ[ÚYŠÜš]PØXÚLMÌËš\ÊÚÊJ\™]\›ˆÜš]PØXÚLMÌË™Ù]
ÚÊNØÛÛœÝÏ\Üš]PØ[˜\ÌMÌÊ–Ì—K–Ì×JKØÏXË™Ù]ÛÛ^
	Ì™	ÊKX\ÚÏ\Üš]SX\ÚÜÌMÌÖÚÙ^WNØØËš[XYÙTÛ[ÛÝ[™Ñ[˜X›YY˜[ÙNÚYŠX\ÚÏË›[™Ý
^ØØË˜™YÚ[”]

NØÛÛœÝž]\Ï]\[ÙˆX\ÚÏOOIÜÝš[™ÉÏØ]ØŠX\ÚÊN›[ÚYŠž]\Ê^Û]OLOLØÛÛœÝ™XYJ
OOžÛ]LÚYLŽÙÞØXž]\Ë˜Ú\ÛÙP]
JÊÊNÝŸJ‰ŒLÊOÚYÜÚY
ÏMÎß]Ú[J‰ŒLŽ
NÜ™]\›ˆŽßNÝÚ[JOž]\Ë›[™Ý
^ØÛÛœÝ\™XY

NÞJÏ\™XY

NØÛÛœÝÏ\™XY

NØØËœ™XÝ
KËJNß_Y[ÙH›ÜŠÛÛœÝÞK×[ÙˆX\ÚÊXØËœ™XÝ
KËJNØØË˜Û\

NßXØË™˜]Ò[XYÙJ[K–ÌK–ÌWK–Ì—K–Ì×K–Ì—K–Ì×JNÚYŠ[
^ØØË™ÛØ˜[ÛÛ\ÜÚ]SÜ\˜][ÛIÜÛÝ\˜ÙKX]Ü	ÎØØË™š[Ý[OIÜ™Ø˜JMKMKÌ	ÊÝ[
ÉÊIÎØØË™š[™XÝ
–Ì—K–Ì×JNß\Üš]PØXÚLMÌËœÙ]
ÚËÊNÜ™]\›ˆÎßB™[˜Ý[ÛˆÜš]TZ[MÌÊ[K‹Ù^KK›\Y˜[ÙKØÏXÝ[L
^ØÛÛœÝÏ\Üš]PÝ]MÌÊ[K‹Ù^K[
NÚYŠXÊ\™]\›ŽØÛÛœÝØÏZÙ–Ì×NØØËœØ]™J
NØØË˜[œÛ]JJNÚYŠ›\
XØËœØØ[JLKJNØØË™˜]Ò[XYÙJËËÚYËšZYÚY–Ì—JœØËÌ‹Z–Ì—JœØË
NØØËœ™\ÝÜ™J
NßB™[˜Ý[Ûˆ^Y\•[MÌÊ
^Ü™]\›ŠÌŽ‹ŒN‹ŒÌ‹L‹KŒ‹ŸJVÛÝ\”[ŒMÌ‹šØZW_ßB™[˜Ý[Ûˆ˜\ÙTZ[MÌÊ›ÝËœ˜[YKK›\
^ØÛÛœÝOSX]™›ÛÜŠœ˜[YJIN\ØZSY]LMÖÜ›Ý×OË–ÚWNÚYŠŠ\Üš]TZ[MÌÊØZP]\ÌMË‹	Ø˜\ÙKIÊÜ›ÝÊÉËIÊÚKK–Ì×JšÌM›\ÝOOLLŒÜ^Y\•[MÌÊ
NŒ
NßB˜ÛÛœÝÝ\”Üš]P™Y›Ü™LMÌÏ[Ý\”Üš]LMÌŽÛÝ\”Üš]LMÌY[˜Ý[ÛŠ[Kœ˜[Y\Ë›ÝËœ˜[YKKLLŒ›\Y˜[ÙKØÏXÝ
^ÚYŠ[HOO[Ý\\MÌ‹›[Ý[Û‰‰š[HOO[Ý\\MÌ‹˜XÝÜœÊ\™]\›ˆÝ\”Üš]P™Y›Ü™LMÌÊ[Kœ˜[Y\Ë›ÝËœ˜[YKK›\ØÊNØÛÛœÝOSX]™›ÛÜŠœ˜[YJIYœ˜[Y\ÖÜ›Ý×K›[™ÝYœ˜[Y\ÖÜ›Ý×OË–ÚWKÙ^OJ[OOO[Ý\\MÌ‹›[Ý[ÛÉÛ[Ý[Û‰Îš[OOO[Ý\\MÌ‹˜XÝÜœÏÉÛÝ\‰Î‰ÉÊJÉËIÊÜ›ÝÊÉËIÊÚNÚYŠYŠ\™]\›ŽÜ™]\›ˆÜš]TZ[MÌÊ[K‹Ù^KK›\ØË
[OOO[Ý\\MÌ‹›[Ý[ÛŸ[OOO[Ý\\MÌ‹˜XÝÜœÉ‰œ›ÝÏOOLÊI‰˜ØÏOOXÝÜ^Y\•[MÌÊ
NŒ
NßNÂ™[˜Ý[ÛˆØYØTZ[MÌÊÚ[™›ÝËœ˜[YKK›\Y˜[ÙKØÏXÝ
^ÚYŠÚ[™OOIØ[Y\ÉÉ‰Š›ÝÏOOL_›ÝÏOOM
J^ÚÚ[™IÜÜXÚX[	ÎÜ›ÝÏ\›ÝÏOOLOÌŒNßXÛÛœÝOSX]™›ÛÜŠœ˜[YJIN\ØYØQœ˜[Y\ÌMÌÖÚÚ[™OË–Ü›Ý×OË–ÚWNÚYŠŠ\Üš]TZ[MÌÊØYØP\MÌÖÚÚ[™K‹Ú[™
ÉËIÊÜ›ÝÊÉËIÊÚKK›\ØÊNßB‚™[˜Ý[Ûˆ˜Y]”™\^LMÌÊ
^ÚYŠ\ØZLMÊ
_Ý\”Ý]LMÌŠ
K™XY\˜Y]”›ÙÜ™\ÜÌMŽ

K™Y™X]Y
\™]\›ˆ˜[ÙNÚYŠ\˜Y]’\™LMŽ

I‰ˆ\ØZU˜]™[MÊYJJ\™]\›ˆ˜[ÙNÜ˜Y]”™\X]MÌÏ]YNÜ˜Y]ŒMŽ[[Ü˜Y]”›ÙÜ™\ÜÌMŽ

KšTQU—ÒMŽØÛÛœÝ\˜Y]”ÙYYMŽ

NØ‹˜XÝ]™O]YNØ‹˜ÙLŽÜ^Y\‹š\ØZRMÊ
NÜØZTÝ]LMÊ
KšÚO\ØZRÚSX^MÊ
NØÛÜÙQX[ÙÊ
NÜ\œÚ\ÝØ[YJ
NÜ™]\›ˆYNßB™[˜Ý[ÛˆØYØQ[YÚX›LMÌÊ
^ØÛÛœÝÏ[Ý\”Ý]LMÌŠ
NÜ™]\›ˆØZLMÊ
I‰ˆ[Ë™XY	‰œ˜Y]”›ÙÜ™\ÜÌMŽ

K™Y™X]Y	‰›ËœÝYÙOOOM	‰œØZVYX\ŒMÌŠ
OJË˜\œš]˜[YX\ŸÍŒŠNßB™[˜Ý[ÛˆØYØSXZÙLMÌÊY\KJ^ØÛÛœÝÜXÏ^ÜØZX˜NžÜÝÙ\ŽŒÌX^ŒLL[XYÙN‹ŒK›ÝÎŒŸK˜\NžÜÝÙ\ŽŒX^Œ[XYÙN‹ŒK›ÝÎŒ_K™YÙ]NžÜÝÙ\ŽŒMLX^ŽL[XYÙN‹ŒMK›ÝÎŒK\NžÜÝÙ\ŽŒMLX^ŒL[XYÙN‹ŒK›ÝÎŒß_VÝ\WNÜ™]\›žÚY\KKœÜXË›X^‹‹œÜXËÙŒKJÚY
‹ŒÌKÚ[™ŒXÝŒœ˜[YNŒ[Ýš[™Î™˜[ÙK™^‰ÛY[YIËZ[NžÞœ^Y\‹žNœ^Y\‹ž_K]ÎŒNßB™[˜Ý[ÛˆØYØTÙYYMÌÊ
^ØÛÛœÝÏ\ØYØTÝ]LMÌÊ
NÚYŠ\Ëœ\Ù_Ë˜ÛÛ\]_Ë˜ÛZ[\ÖÜËœ\ÙKLWJ^ÜØYØT[ŒMÌË™šYÚ\œÏV×NÜ™]\›ŽßXÛÛœÝ\Ëœ\ÙOOOLOÐ\œ˜^K™œ›ÛJÛ[™ÝŸK
ËJOOœØYØSXZÙLMÌÊK	ÜØZX˜IËÎ
ÚILÊŒŒN
ÓX]™›ÛÜŠKÌÊJŒŒŒ
JNœËœ\ÙOOOLÖÜØYØSXZÙLMÌÊ	Û˜\IËLLÌL
WN–ÜØYØSXZÙLMÌÊË™›Ü›OOOLOÉØ\IÎ‰Ý™YÙ]IËLLÌÌ
WNÚYŠËœ\ÙOOOLÉ‰œË™›Ü›OOOLŠY–ÌK›X^Y–ÌKšLÍLÙ›ÜŠÛÛœÝHÙˆŠ^ØÛÛœÝØ]™Y\ËœØ]™Y™š[™
OO˜KšYOOYKšY	‰˜K\OOOYK\JNÚYŠØ]™Y
^ÙKšS[X™\‹š\Ñš[š]JØ]™Yš
OØÛ[\
Ø]™YšK›X^
N™K›X^ÙKžS[X™\‹š\Ñš[š]JØ]™Yž
OØÛ[\
Ø]™YžNMŒ
N™KžÙKžOS[X™\‹š\Ñš[š]JØ]™YžJOØÛ[\
Ø]™YžKLŒLŒ
N™KžNß_\ØYØT[ŒMÌË™šYÚ\œÏYŽÜØYØT[ŒMÌËœÚÝÏV×NÜØYØT[ŒMÌË™žV×NÜØYØT[ŒMÌË˜XÝ]™O\Ëœ[ŽßB™[˜Ý[ÛˆØYØTÛ˜\ÚÝMÌÊ
^ÚYŠ\ØYØR\™LMÌÊ
_ØYØT[ŒMÌË˜XÝ]™HOO\ØYØTÝ]LMÌÊ
Kœ[Š\™]\›ŽÜØYØTÝ]LMÌÊ
KœØ]™Y\ØYØT[ŒMÌË™šYÚ\œË›X\
OOŠÚY™KšY\N™K\K™Kš™KžN™Kž_JJNßB™[˜Ý[ÛˆØYØQ[\ŒMÌÊ
^ÚYŠ\ØYØQ[YÚX›LMÌÊ
J\™]\›ˆØYØSY[LMÌÊ
NÜØYØTÛ˜\ÚÝMÌÊ
NÞ›Û™OTÐQÐLMÌÎÜØZPÛX\ŒMÊ
NÜ˜Y]ŒMŽ[[Ü˜Y]”™\X]MÌÏY˜[ÙNÛÝ\”[ŒMÌ‹šØZOLÛÝ\”[ŒMÌ‹™Ù[šÚO[Ý\”[ŒMÌ‹˜›ÛX[[Ü^Y\‹žLŽÜ^Y\‹žONLÜ^Y\‹™LNÜ^Y\‹™OLÜ^Y\‹™˜XÙOLNÜ^Y\‹Ø[Ñ\IÜšYÚ	ÎØØ[KžXØ[KžOLÞ›Û™TÝ]\ÖÜ™YÚ[ÛŠ
KšYOV×NØÚ]š[Ý]\ÖÜ™YÚ[ÛŠ
KšYOV×NÜØYØTÙYYMÌÊ
NÜØYØP[Y\ÔÙYYMÌÊ
NØÛÜÙQX[ÙÊ
NÚY

NÜ\œÚ\ÝØ[YJ
NØÛÛœÝÏ\ØYØTÝ]LMÌÊ
NÚYŠËœ[™[™Ê\ØYØPÚ[™[XLMÌÊËœ[™[™ËËœ[™[˜[ÙJNÜ™]\›ˆYNßB™[˜Ý[ÛˆØYØTÝ\MÌÊ
^ÚYŠ\ØYØQ[YÚX›LMÌÊ
J\™]\›ˆ˜[ÙNØÛÛœÝÏ\ØYØTÝ]LMÌÊ
NÚYŠËœ\ÙI‰ˆ\Ë˜ÛÛ\]J\™]\›ˆØYØQ[\ŒMÌÊ
NÜËœ[ŠÊÎÜËœ\ÙOLNÜË˜ÛÛ\]OY˜[ÙNÜË˜ÛZ[\ÏVÙ˜[ÙK˜[ÙK˜[ÙWNÜËžX[XÚO\ËœXØÛÛÏY˜[ÙNÜË™›Ü›OLÜË˜\U[YOLÜËœØ]™YV×NÜËœ[™[™ÏIØ\œš]˜[	ÎÜËœ[™[LÜ^Y\‹š\ØZRMÊ
NÜØZTÝ]LMÊ
KšÚO\ØZRÚSX^MÊ
NÜ™]\›ˆØYØQ[\ŒMÌÊ
NßB™[˜Ý[ÛˆØYØS™^MÌÊ
^ØÛÛœÝÏ\ØYØTÝ]LMÌÊ
NÚYŠ\ØYØR\™LMÌÊ
_\Ë˜ÛZ[\ÖÜËœ\ÙKLW_Ëœ\ÙOLÊ\™]\›ˆ˜[ÙNÜËœ\ÙJÊÎÜË[›ØÚÙYSX]›X^
Ë[›ØÚÙYËœ\ÙJNÜËœØ]™YV×NÜË™›Ü›OLÜË˜\U[YOLÜËœ[™[™Ï\Ëœ\ÙOOOLÉÛ˜\IÎ‰Ý™YÙ]IÎÜËœ[™[LÜ^Y\‹š\ØZRMÊ
NÜØZTÝ]LMÊ
KšÚO\ØZRÚSX^MÊ
NÜØYØTÙYYMÌÊ
NÜ\œÚ\ÝØ[YJ
NÜ™]\›ˆØYØPÚ[™[XLMÌÊËœ[™[™Ë˜[ÙJNßB™[˜Ý[ÛˆØYØT™]Ø\™MÌÊ
^ØÛÛœÝÏ\ØYØTÝ]LMÌÊ
NÚYŠ\ØYØR\™LMÌÊ
_\Ëœ\Ù_Ë˜ÛZ[\ÖÜËœ\ÙKLW_ØYØT[ŒMÌË˜XÝ]™HOO\Ëœ[Ÿ\ØYØT[ŒMÌË™šYÚ\œË›[™ÝØYØT[ŒMÌË™šYÚ\œËœÛÛYJOO™KšŒ
J\™]\›ˆ˜[ÙNÜË˜ÛZ[\ÖÜËœ\ÙKLWO]YNÜË[›ØÚÙYSX]›Z[ŠËX]›X^
Ë[›ØÚÙYËœ\ÙJÌJJNÜØZTÝ]LMÊ
KœÝÙ\SX]›Z[ŠYLL‹ØZTÝ]LMÊ
KœÝÙ\ŠÍL
NÜØYØTÛ˜\ÚÝMÌÊ
NÚYŠËœ\ÙOOOLÊ^ÜË˜ÛÛ\]O]YNÜËÚ[œÊÊÎÜËœ[™[™ÏIÙ[™[™ÉÎÜËœ[™[Lß\\œÚ\ÝØ[YJ
NÝØ\Ý
M
	Ñ˜\ÙHÛÛ\]YIË	Ô\ÙHÛÛ\]IË	Ñ˜\ÙHÛÛ˜ÛpëYIË	ÐqgØ[XH[X[[[™1,IÊJÉÈ0­È
ÍLÕÑTˆU‘S	ÊNÚYŠËœ\ÙOOOLÊ\ØYØPÚ[™[XLMÌÊ	Ù[™[™ÉË˜[ÙJNÙ[ÙHØYØSY[LMÌÊ
NÜ™]\›ˆYNßB™[˜Ý[ÛˆØYØU\™Ù]MÌÊ
^Ü™]\›ˆØYØT[ŒMÌË™šYÚ\œË™š[\ŠOO™KšŒ
KœÛÜ

KŠOO™\Ý
K^Y\ŠKY\Ý
‹^Y\ŠJVÌ_Þ‹NNNNKN‹NNNN_NßB˜ÛÛœÝ\™Ù]™Y›Ü™LMÌÏ\ØZU\™Ù]MŽÜØZU\™Ù]MŽY[˜Ý[ÛŠ
^Ü™]\›ˆØYØR\™LMÌÊ
OÜØYØU\™Ù]MÌÊ
N\™Ù]™Y›Ü™LMÌÊ
NßNÂ™[˜Ý[ÛˆØYØQ[XYÙLMÌÊKœ›ÛT^Y\Y˜[ÙJ^ÚYŠ\ØYØR\™LMÌÊ
_Y_KšLS[X™\‹š\Ñš[š]J
_LØYØTÝ]LMÌÊ
Kœ[™[™ßØYØTÝ]LMÌÊ
K˜ÛZ[\ÖÜØYØTÝ]LMÌÊ
Kœ\ÙKLWJ\™]\›ˆ˜[ÙNØÛÛœÝ˜][ÏXÛ[\
X]œÜ\
ØZTÝ]LMÊ
KœÝÙ\‹ÙKœÝÙ\ŠKŒMKÊNÙKšSX]›X^
K\OOOIØ\IÏÌNŒKšJœ›ÛT^Y\Ù
œ˜][Î™
JNÙK™›\ÚKŒMNÙKš]ÊÊÎÜØYØTÛ˜\ÚÝMÌÊ
NÜ™]\›ˆYNßB˜ÛÛœÝ]™Y›Ü™LMÌÏ\ØZR]\™Ù]MÎÜØZR]\™Ù]MÏY[˜Ý[ÛŠ
^Ü™]\›ˆØYØR\™LMÌÊ
OÜØYØQ[XYÙLMÌÊØYØU\™Ù]MÌÊ
KYJNš]™Y›Ü™LMÌÊ
NßNÂ™[˜Ý[ÛˆØYØR\MÌÊK][LJ^ÚYŠ\ØYØR\™LMÌÊ
_^Y\‹šLØYØT[ŒMÌËš\Œ
\™]\›ŽÜØYØT[ŒMÌËš\KNØÛÛœÝ˜][ÏXÛ[\
X]œÜ\
KœÝÙ\‹ÜØZTÝ]LMÊ
KœÝÙ\ŠKKËJNÜ^Y\‹šSX]›X^
^Y\‹š\ØZRMÊ
J™K™[XYÙJœ˜][Ê›][
NÜ^Y\‹œ™YÙ[•ØZ]LÎÚYŠ^Y\‹šL
^ÜØYØTÛ˜\ÚÝMÌÊ
NÜØZQX]MÌŠ˜[ÙJNß_B˜ÛÛœÝSLMÌÏVÞÚY‰ÙÛÚ[‰Ë˜[YN‰ÑÓÒS‰Ë›ÝÎŒÝÙ\ŽŒÍLÛÛÜŽ‰ÈÙ™™MM	ËÚÚ[–ÉÓX\Ù[šÛÉË	ÓX\Ù[šÛÉË	ÓX\Ù[šÛÉË	ÓX\Ù[šÛÉ×_KÚY‰ÜXØÛÛÉË˜[YN‰ÔPÐÓÓÉË›ÝÎŒKÝÙ\ŽLÛÛÜŽ‰ÈØNY™‰ËÚÚ[–ÉÓXZØ[šÛÜØ\ÉË	ÔÜXÚX[™X[HØ[››Û‰Ë	ÓXZØ[šÛÜØ\ÉË	ðåž™[qgñ,[ˆÜI×_KÚY‰ÚÜš[[‰Ë˜[YN‰ÒÔ’SS‰Ë›ÝÎŒ‹ÝÙ\ŽŒÌŒÛÛÜŽ‰ÈÙ™™MÍ™	ËÚÚ[–ÉÒÚY[ž˜[‰Ë	Ñ\ÝXÝÈ\ØÉË	ÒÚY[ž˜[‰Ë	ÒÚY[ž˜[‰×_KÚY‰ÞX[XÚIË˜[YN‰ÖPSPÒIË›ÝÎŒËÝÙ\ŽŒŽÛÛÜŽ‰ÈÎÙYŒ‰ËÚÚ[–ÉÔpì[È[Ø›ÉË	ÕÛÛˆ˜[™Èš\Ý	Ë	Ô[šÈÈØ›ÉË	ÒÝ\qgÚH][\q'ÝI×_KÚY‰ÝY[‰Ë˜[YN‰ÕS”ÒS’S‰Ë›ÝÎÝÙ\ŽŒÎÛÛÜŽ‰ÈÙ™™˜ŒÉËÚÚ[–ÉÒÚZÛÚÉË	ÕšKP™X[IË	ÒÚZÛÚÉË	ÒÚZÛÚÉ×_WNÂ›]ØYØP[Y\ÌMÌÏV×NÂ™[˜Ý[ÛˆØYØP[Y\ÔÙYYMÌÊ
^ØÛÛœÝÏ\ØYØTÝ]LMÌÊ
NÜØYØP[Y\ÌMÌÏPSLMÌË™š[\ŠOOˆJKšYOOIÞX[XÚIÉ‰œËžX[XÚJI‰ˆJÉÝY[‰Ë	ÜXØÛÛÉ×Kš[˜ÛY\ÊKšY
I‰œËœXØÛÛÊJK›X\

KJOOŠË‹‹˜KŒÍL
ÚJŒLLNÌÌ
ÚILŠŒLŒÙŒJÚJ‹ŒËÚ[™ŒXÝŒœ˜[YNŒ[Ýš[™Î™˜[Ù_JJNßB™[˜Ý[ÛˆØYØP[U\]LMÌÊ
^ÚYŠØYØTÝ]LMÌÊ
Kœ[™[™Ê\™]\›ŽÙ›ÜŠÛÛœÝHÙˆØYØP[Y\ÌMÌÊ^ØK˜ÙSX]›X^
K˜ÙY
NØK˜XÝSX]›X^
K˜XÝY
NØK›[Ýš[™ÏY˜[ÙNØÛÛœÝ\™Ù]\ØYØT[ŒMÌË™šYÚ\œË™š[\ŠOO™KšŒ
KœÛÜ

‹ÊOO™\Ý
‹JKY\Ý
ËJJVÌNÚYŠ]\™Ù]
XÛÛ[YNØK™˜XÙO]\™Ù]žKžËLNŒNØÛÛœÝ™X\XKšYOOIÞX[XÚIÏÌMNŒÍŒY\Ý
K\™Ù]
NÚYŠKÚ[™Œ
^ØKÚ[™OYÚYŠKÚ[™L
^ØK˜XÝKŽØÛÛœÝ[[Ý[JKšYOOIÜXØÛÛÉÏÍÌ˜KšYOOIÞX[XÚIÏÌÎMJJ˜Û[\
X]œÜ\
KœÝÙ\‹Ý\™Ù]œÝÙ\ŠKŒ‹K
NÜØYØQ[XYÙLMÌÊ\™Ù][[Ý[
NÜØYØT[ŒMÌË™žœ\Ú
ÚÚ[™˜KšYÛÛÜŽ˜K˜ÛÛÜ‹˜KžN˜KžKML\™Ù]žN\™Ù]žKMMK‹KX^‹_JNØK˜ÙL‹JØKœ›ÝÊ‹ŒLÎß_Y[ÙHYŠK˜ÙOOL	‰™™X\ŠÍ
XKÚ[™KNÙ[ÙHYŠ›™X\Š^ØÛÛœÝ]\™Ù]žXKžO]\™Ù]žKXKžKSX]š\Ý
J_NØKžXÛ[\
Kž
ÙÛ
ŒLÌ
™MŒMÌ
NØKžOXÛ[\
KžJÙKÛ
ŽMJ™LÌLŒ
NØK›[Ýš[™Ï]YNßXK™œ˜[YJÏY
ŒLß_B™[˜Ý[ÛˆØYØQ[™[^U\]LMÌÊK
^ÚYŠKšL
\™]\›ŽÙK˜ÙSX]›X^
K˜ÙY
NÙK˜XÝSX]›X^
K˜XÝY
NÙK™›\ÚSX]›X^

K™›\Ú
KY
NÙK™œ˜[YJÏY
ŒLÙK›[Ýš[™ÏY˜[ÙNÚYŠKÚ[™Œ
^ÙKÚ[™SX]›X^
KÚ[™Y
NÚYŠKÚ[™OOL
^ÙK˜XÝKÎØÛÛœÝYK˜Z[KžYKžOYK˜Z[KžKYKžK[™ÏSX]˜][ŒŠK
NÚYŠK›™^OOIÛY[YIÊ^ÚYŠ\Ý
K^Y\ŠO
K\OOOIØ\IÏÌÌÌŒMÍJJ\ØYØR\MÌÊJNßY[ÙHYŠK›™^OOIÙ\\[Û‰Ê^ÜØYØT[ŒMÌË™žœ\Ú
ÚÚ[™‰Ù\\[Û‰Ë™K˜Z[KžN™K˜Z[KžK‹‹X^‹‹ÛÛÜŽ‰ÈÙ™˜ÙŒÉßJNÚYŠX]š\Ý
^Y\‹žYK˜Z[Kž^Y\‹žKYK˜Z[KžJOMÍJ\ØYØR\MÌÊKKŒŠNßY[ÙHYŠK›™^OOIØ™X[IÊ^ÜØYØT[ŒMÌË™žœ\Ú
ÚÚ[™‰Ø™X[IË™KžN™KžKJK\OOOIØ\IÏÌLÌMJK™Kž
ÓX]˜ÛÜÊ[™ÊJŒLÌN™KžJÓX]œÚ[Š[™ÊJŒLÌMMK‹KX^‹KÛÛÜŽ™K\OOOIØ\IÏÉÈÙ™™IÎ‰ÈØØŽÙ™‰ßJNØÛÛœÝJ^Y\‹žYKž
J“X]˜ÛÜÊ[™ÊJÊ^Y\‹žKYKžJJ“X]œÚ[Š[™ÊKXÏSX]˜XœÊ
^Y\‹žYKž
J“X]œÚ[Š[™ÊKJ^Y\‹žKYKžJJ“X]˜ÛÜÊ[™ÊJNÚYŠL	‰™LÌ	‰˜XÏ
K\OOOIØ\IÏÌLNJJ\ØYØR\MÌÊKKŒÊNßY[ÙH›ÜŠÛÛœÝÜ™XYÙˆK\OOOIÜØZX˜IÏÖÌN–ËKŒNŒNJ\ØYØT[ŒMÌËœÚÝËœ\Ú
Þ™KžN™KžKMMK“X]˜ÛÜÊ[™ÊÜÜ™XY
JŒÌN“X]œÚ[Š[™ÊÜÜ™XY
JŒÌŒËÛÝ\˜ÙN™KÛÛÜŽ™K\OOOIÜØZX˜IÏÉÈØŒÙ˜MIÎ‰ÈØŽ™™‰ßJNÙK˜ÙYK\OOOIØ\IÏÌËŽ™K\OOOIÜØZX˜IÏÌ‹ÎŒ‹Nß_Y[ÙHYŠK˜ÙOOL
^ÙK›™^YK\OOOIÜØZX˜IÏÊKš]ÉLÏOOLÉÚÚIÎ‰ÛY[YIÊN™K\OOOIÛ˜\IÏÊKš]ÉLÏOOLÉÛY[YIÎ™Kš]ÉLÏOOLOÉÙ\\[Û‰Î‰ÚÚIÊN™Kš]ÉLÏOOLOÉØ™X[IÎ‰ÛY[YIÎÙKÚ[™YK›™^OOIÛY[YIÏËŽNŒKŒNÙK˜Z[O^Þœ^Y\‹žNœ^Y\‹ž_NÙKš]ÊÊÎßY[ÙHYŠ\Ý
K^Y\ŠOŠK\OOOIØ\IÏÌŒÌŒMJI‰™K˜XÝOOL
^ØÛÛœÝ\^Y\‹žYKžO\^Y\‹žKYKžKSX]š\Ý
J_KÜYK\OOOIØ\IÏÎN™K\OOOIÜØZX˜IÏÌLNŒMNÙKžXÛ[\
Kž
ÙÛ
œÜ
™NMŒ
NÙKžOXÛ[\
KžJÙKÛ
œÜ
‹Ê™LŒLŒ
NÙK›[Ýš[™Ï]YNß_B™[˜Ý[ÛˆØYØQ]™[MÌÊÙ^J^ØÛÛœÝÏ\ØYØTÝ]LMÌÊ
NÚYŠËœ[™[™Ê\™]\›ˆ˜[ÙNÜËœ[™[™ÏZÙ^NÜËœ[™[LÜØYØTÛ˜\ÚÝMÌÊ
NÜ\œÚ\ÝØ[YJ
NÜØYØPÚ[™[XLMÌÊÙ^K˜[ÙJNÜ™]\›ˆYNßB™[˜Ý[ÛˆØYØU\]LMÌÊ
^ØÛÛœÝÏ\ØYØTÝ]LMÌÊ
K\ØYØT[ŒMÌÎÜ‹š\SX]›X^
‹š\Y
NÚYŠËœ[™[™Ê\™]\›ˆØYØPÚ[™[XLMÌÊËœ[™[™ËËœ[™[˜[ÙJNÚYŠË˜ÛZ[\ÖÜËœ\ÙKLWJ\™]\›ŽÚYŠ\‹™šYÚ\œË›[™Ý
^ÜØYØTÙYYMÌÊ
NÜØYØP[Y\ÔÙYYMÌÊ
NßZYŠ\ØYØP[Y\ÌMÌË›[™Ý
\ØYØP[Y\ÔÙYYMÌÊ
NÙ›ÜŠÛÛœÝHÙˆ‹™šYÚ\œÊ^ÜØYØQ[™[^U\]LMÌÊK
NÚYŠ\ØYØR\™LMÌÊ
J\™]\›Žß\ØYØP[U\]LMÌÊ
NÙ›ÜŠÛÛœÝÚÙˆ‹œÚÝÊ^ÜÚž
Ï\Ú™
™ÜÚžJÏ\Ú™J™ÜÚOYÚYŠÚŒ	‰“X]š\Ý
Úž\^Y\‹žÚžKJ^Y\‹žKMJJOÍJ^ÜÚLÜØYØR\MÌÊÚœÛÝ\˜ÙKŽJNÚYŠ\ØYØR\™LMÌÊ
J\™]\›Žß_\‹œÚÝÏ\‹œÚÝË™š[\ŠOžŒ
NÙ›ÜŠÛÛœÝˆÙˆ‹™ž
Y‹OYÜ‹™ž\‹™ž™š[\ŠO™‹Œ
NØÛÛœÝXY\‹™šYÚ\œË™š[\ŠOO™KšL
K›[™ÝÚYŠËœ\ÙOOOLI‰ˆ\ËžX[XÚI‰™XYLJ\™]\›ˆØYØQ]™[MÌÊ	ÞX[XÚIÊNÚYŠËœ\ÙOOOL‰‰ˆ\ËœXØÛÛÉ‰œ‹™šYÚ\œÖÌOËš\‹™šYÚ\œÖÌOË›X^
‹MJ\™]\›ˆØYØQ]™[MÌÊ	ÜXØÛÛÉÊNÚYŠËœ\ÙOOOLÉ‰œË™›Ü›OOOL	‰œ‹™šYÚ\œÖÌOËš\‹™šYÚ\œÖÌOË›X^
‹J\™]\›ˆØYØQ]™[MÌÊ	Ø\IÊNÚYŠËœ\ÙOOOLÉ‰œË™›Ü›OOOLJ^ÜË˜\U[YJÏYÚYŠË˜\U[YOLÍJ\™]\›ˆØYØQ]™[MÌÊ	ÝZ[	ÊNßZYŠ‹™šYÚ\œË›[™Ý	‰œ‹™šYÚ\œË™]™\žJOO™KšL
J\™]\›ˆØYØT™]Ø\™MÌÊ
NÜ‹œØ]™JÏYÚYŠ‹œØ]™OM
^Ü‹œØ]™OLÜØYØTÛ˜\ÚÝMÌÊ
NÜ\œÚ\ÝØ[YJ
NßZYŠ^Y\‹žN	‰œ^Y\‹žOŽÌ	‰œ^Y\‹™KŒŠ^ÜØYØTÛ˜\ÚÝMÌÊ
NÜØZU˜]™[MÊ‹YJNÜ^Y\‹žNÜ^Y\‹žOMŒÜ\œÚ\ÝØ[YJ
Nß_B‚˜ÛÛœÝØYØTØÙ[™\ÌMÌÏ^Â˜\œš]˜[žØ\–ÌK[™\Î–ÖÉÕ™YÙ]HH˜\H]\œš^˜[ˆ\˜H\ØØ\ˆ\È\Ù™\˜\È[˜YðìÛ‹ˆÜÈÝY\œ™\›ÜÈHHY\œ˜HØ[[ˆHÝH[˜ÝY[›Ë‰Ë	Õ™YÙ]H[™˜\H[™[ˆÙX\˜ÚÙˆH˜YÛÛˆ˜[ËˆX\8 &\ÈØ\œš[ÜœÈØ]\ˆÈ˜XÙH[K‰Ë	Õ™YÙ]HH˜\HÚYØ[H[H\ØØH\È\Ù™\˜\ÈÈ˜YðèÛËˆÜÈÝY\œ™Z\›ÜÈH\œ˜H°èÛÈ[™œ™[0èK[ÜË‰Ë	Õ™YÙ]H™H˜\HZ™\ˆÜ\±,HpéÚ[ˆÙ[\‹ˆ0ïžXx &[±,[ˆØ]˜qgðéñ,[\±,HØ\±gñ,[\±,[˜H0éñ,ZØ\‹‰×KÉÓ˜\H[HÙZ\ÈÙ[Z[\Îˆ˜XÙ[ˆÜÈØZX˜[Y[‹ˆ[œÚ[š[ˆ[]Y\Ý˜H]YHYY[ˆÙ\ˆ™[˜ÚYÜËˆ[ˆ\ÝHY\XÚpìÛˆYYØ\ÈÛÛ[ÈÛÚÝH\ÙH[š[Y\ˆÛÛX˜]H[ÈHÝ\È[XYÜË‰Ë	Ó˜\H[ÈÚ^ÙYYÎˆØZX˜[Y[ˆ[Y\™ÙKˆY[ˆ›Ý™\È^HØ[ˆ™H™X][‹ˆ[ˆ\ÈY\][Ûˆ[ÝH^H\ÈÛÚÝH[Û™ÜÚYH\È[Y\Èœ›ÛHHš\œÝšYÚ‰Ë	Ó˜\H[HÙZ\ÈÙ[Y[\Îˆ˜\ØÙ[HÜÈØZX˜[Y[‹ˆ[œÚ[š[ˆ›Ý˜H]YHÙ[HÙ\ˆ™[˜ÚYÜËˆ™\ÝHY\péðèÛÈ›Øðêˆ›ÙØHÛÛ[ÈÛÚÝHÛÛHÜÈ[XYÜÈ\ÙHHš[YZ\˜H]K‰Ë	Ó˜\H[1,HÚ[HZÙ\ŽˆØZX˜[X[›\ˆ0éñ,ZØ\‹ˆ[œÚ[š[ˆY[š[Xš[XÙZÛ\š[šHðíœÝ\š\‹ˆH^X\›[XYH[È0í°ï1gÝ[ˆ]X˜\™[ˆpïYšZÛ\›HÛÚÝx &^]HÞ[˜\œñ,[‹‰×W_KžX[XÚNžØ\–ÌK—K[™\Î–ÖÉÖX[XÚHÜ™YHX™\ˆ™[˜ÚYËˆ[ØZX˜[X[ˆÙH]˜[KØ[HHÙHY™\œ˜HH0ê[ˆ0¨Q\Ý0èH™][šY[™È[™\™ðëXHIË	ÖX[XÚH™[Y]™\ÈH\ÈÛÛ‹ˆHØZX˜[X[ˆÙ]È\X\È[™Û[™ÜÈÈ[Kˆ]\ÈØ]\š[™È[™\™ÞHIË	ÖX[XÚHXÜ™Y]H]YH™[˜Ù]KˆÈØZX˜[X[ˆÙH]˜[KØ[HHÙHYØ\œ˜HH[Kˆ\Ý0èH™][š[™È[™\™ÚXHIË	ÖX[XÚHØ^˜[™1,q'ñ,[±,HØ[±,\‹ˆØZX˜[X[ˆØ[Ø\‹]\ˆ™HÛ˜HØ\±,[1,\‹ˆ[™\ššHÜ^[ÜˆI×KÉÑ[ØZX˜[X[ˆÙH]]Ù\Ý^YKˆÝX[™ÈÙH\Ú\H[Û›ËX[XÚHXXÙH[ˆ[Ü°è]\‹ˆÜš[[ˆHÜÈ[pè\ÈX™[ˆÛÛ[X\ˆH˜][K‰Ë	ÕHØZX˜[X[ˆÙ[‹Y\ÝXÝËˆ\ÈH\ÝÙ]\ËX[XÚHY\È[ˆHÜ˜]\‹ˆÜš[[ˆ[™HÝ\œÈ]\ÝÛÛ[YHH˜]K‰Ë	ÓÈØZX˜[X[ˆÙH]]Ù\Ý°ìÚKˆHÙZ\˜H˜Z^HHX[XÚH\Ý0èHØpëYÈ˜HÜ˜]\˜KˆÜš[[ˆHÜÈÝ]›ÜÈ™XÚ\Ø[HÛÛ[X\‹‰Ë	ÔØZX˜[X[ˆÙ[™[šH]]1,\‹ˆÞˆq'ñ,[1,[˜ØHX[XÚHÜ˜]\™HX]XZÝY1,\‹ˆÜš[[ˆ™Hq'Ù\›\šHØ]˜qgØH]˜[H]Y[Y\‹‰×W_K›˜\NžØ\–ÌK[™\Î–ÖÉÓÜÈØZX˜[Y[ˆ[ˆØpëYËˆ˜\H[˜H[ˆÛÛX˜]NˆÝHY\ž˜H\È]^HÝ\\š[Ü‹ˆÛÚ[‹XØÛÛËÜš[[ˆH[œÚ[š[ˆXÚ[ˆHHYËˆØœÙ\˜HÝ\È]š\ÛÜÈHÚHHØ[H\È›Û˜\ÈX\˜ØY\Ë‰Ë	ÕHØZX˜[Y[ˆ\™HÝÛ‹ˆ˜\H[\œÈ˜]HÚ]˜\ˆÜ™X]\ˆÝ™[™ÝˆÛÚ[‹XØÛÛËÜš[[ˆ[™Y[ˆšYÚ™\ÚYH[ÝKˆØ]Ú\ÈÚHØ\›š[™ÜÈ[™X]™HHX\šÙY\™X\Ë‰Ë	ÓÜÈØZX˜[Y[ˆØpë\˜[Kˆ˜\H[˜H˜H]HÛÛH›Ü°éØH]Z]ÈXZ[Ü‹ˆÛÚ[‹XØÛÛËÜš[[ˆH[œÚ[š[ˆ][H[ÈÙ]HYËˆØœÙ\™HÜÈ]š\ÛÜÈHØZXH\È0è\™X\ÈX\˜ØY\Ë‰Ë	ÔØZX˜[X[›\ˆY[š[Kˆ˜\H0éÛÚÈZH°ïpïÈðï0éÛH0í°ï1gÙHÚ\™\‹ˆÛÚ[‹XØÛÛËÜš[[ˆ™H[œÚ[š[ˆX[±,[™HØ]˜qgñ,\‹ˆÚH^X\±,[\±,[±,H^›H™HqgØ\™]H[[›\™[ˆ0éñ,ZË‰×W_KœXØÛÛÎžØ\–ÌË×K[™\Î–ÖÉÕ[œÚ[š[ˆ[ž˜H[ˆ0î›[[ÈÚZÛÚÈÛÛ˜H˜\KYÛÝ[™ÈÝ\ÈY\ž˜\ËˆÛÚ[ˆ[[H™\ÜÛ™\ˆÛÛˆ[ˆX\Ù[šÛË\›È[ØZ^XZš[ˆ™\\˜H[ˆÛÛH]˜\ÝYÜ‹‰Ë	ÕY[ˆ[›X\Ú\ÈÛ™Hš[˜[šKP™X[HYØZ[œÝ˜\K^]\Ý[™È\ÈÝ™[™ÝˆÛÚ[ˆšY\ÈÈ[œÝÙ\ˆÚ]X\Ù[šÛË]HØZ^X[ˆ™\\™\ÈH]˜\Ý][™È]XÚË‰Ë	Õ[œÚ[š[ˆ[°éØH[H0î›[[ÈÚZÛÚÈÛÛ˜H˜\K\ÙÛÝ[™ÈÝX\È›Ü°éØ\ËˆÛÚ[ˆ[H™\ÜÛ™\ˆÛÛHX\Ù[šÛËX\ÈÈØZ^XZš[ˆ™\\˜H[HÛÛH]˜\ÝYÜ‹‰Ë	Õ[œÚ[š[ˆÛÛˆÚZÛÚø &\Ý[H˜\x &^XH]1,\ðïðï°ï0ïÙ]\‹ˆÛÚ[ˆX\Ù[šÛÈ[HØ\±gñ,[1,ZÈ™\š\ŽÈØZ^X[ˆq,Zñ,Xñ,Hš\ˆØ[1,\±,H^±,\›\‹‰×KÉÔXØÛÛÈÙH[\œÛ™H\˜H›ÝYÙ\ˆHÛÚ[ˆH™XÚX™H[]\]YKˆÝHØXÜšYšXÚ[ÈZ˜HHÛÚ[ˆHÜš[[ˆ\˜H^]Y\Kˆ[ˆH\ÝÜšXHÜšYÚ[˜[ÛÚÝHYØH\Üpê\ÈH\ÝH[ÛY[Ë‰Ë	ÔXØÛÛÈÝ\È[ˆÈ›ÝXÝÛÚ[ˆ[™ZÙ\ÈH]XÚËˆ\ÈØXÜšYšXÙHX]™\ÈÛÚ[ˆ[™Üš[[ˆÈ[[ÝKˆ[ˆHÜšYÚ[˜[ÝÜžKÛÚÝH\œš]™\ÈY\ˆ\È[ÛY[‰Ë	ÔXØÛÛÈÙHÛÛØØH˜Hœ™[HHÛÚ[ˆH™XÙX™HÈ]\]YKˆÙ]HØXÜšY°ëXÚ[ÈZ^HÛÚ[ˆHÜš[[ˆ\˜HZY\ˆ›Øðê‹ˆ˜H\Ý0ìÜšXHÜšYÚ[˜[ÛÚÝHÚYØH\Ú\È\ÜÙH[ÛY[Ë‰Ë	ÔXØÛÛÈÛÚ[¸ &q,HÛÜ[XZÈpéÚ[ˆ\˜^XHÚ\š\Ø[1,\±,^q,HØ\±gñ,[\‹ˆ™YZðèœ›1,q'ñ,[™[ˆÛÛœ˜HÛÚ[ˆ™HÜš[[ˆØ[˜HX\™1,[HY\‹ˆ\ñ,[ZðèžYYHÛÚÝHH[™[ˆÛÛœ˜HÙ[\‹‰×W_K™YÙ]NžØ\–ÌK[™\Î–ÖÉÑÛÚÝHÝ\\˜HH˜\Kˆ™YÙ]H[[Z[˜HÜY[Y[HHÝHÛÛ\pìY\›ÈHXÚYH[X\ˆÜˆðëHZ\Û[Ëˆ[°ë[˜Ú\HØZ^XZš[ˆHÛÚÝHÙH[Z˜[ˆ\˜HÝHY[Ë‰Ë	ÑÛÚÝHÝ™\˜ÛÛY\È˜\Kˆ™YÙ]HÜY[Hš[š\Ú\È\ÈÛÛ\[š[Ûˆ[™XÚY\ÈÈšYÚ[\Ù[‹ˆHØZ^X[ˆš[˜ÙH[™ÛÚÝH[Ý™H]Ø^H›ÜˆZ\ˆY[‰Ë	ÑÛÚÝHÝ\\˜H˜\Kˆ™YÙ]H[[Z[˜HÜY[Y[HÈÛÛ\[šZ\›ÈHXÚYH]\‹ˆÈ°ë[˜Ú\HØZ^XZš[ˆHÛÚÝHÙHY˜\Ý[H\˜HÈY[Ë‰Ë	ÑÛÚÝH˜\x &^q,HY[™\‹ˆ™YÙ]HXñ,[X\ñ,^˜ØH[Ûqgñ,[±,[ˆqgÚ[šHš]\š\0í°ï1gÛY^YHØ\˜\ˆ™\š\‹ˆØZ^X[ˆ™[œÚH™HÛÚÝH0ï[ÈpéÚ[ˆ^˜ZÛqgñ,\‹‰×KÉÕ™YÙ]HÛÛ˜Ù[˜HÝHØ[XÚÈÝ[‹ˆÛÚÝH™\ÜÛ™HÛÛˆ[Ø[YZ[YZHHY\ž˜HÝHØZ[ÚÙ[‹ˆ[ˆ[YYÛÈYY\È[™[˜\ˆ‹LHŒÈ[Ù\ˆ˜\ÙHHHXY\Ý°ëXHÚYÝY[ˆÙ\\˜YÜË‰Ë	Õ™YÙ]HÚ\™Ù\È\ÈØ[XÚÈÝ[‹ˆÛÚÝH[œÝÙ\œÈÚ]Ø[YZ[YZH[™\Ú\ÈØZ[ÚÙ[‹ˆ[ˆ\ÈØ[YH[ÝHØ[ˆ˜Z[ˆ‹L[™ŒÈ˜\ÙHÝÙ\ˆ[™X\Ý\žH™[XZ[ˆÙ\\˜]K‰Ë	Õ™YÙ]HÛÛ˜Ù[˜HÈØ[XÚÈÝ[‹ˆÛÚÝH™\ÜÛ™HÛÛHØ[YZ[YZHH›Ü°éØHÈØZ[ÚÙ[‹ˆ›È›ÙÛÈ›ØðêˆÙH™Z[˜\ˆ‹LHŒÈÙ\ˆ˜\ÙHHXY\ÝšXHÛÛ[X[HÙ\\˜YÜË‰Ë	Õ™YÙ]HØ[XÚÈÝ[ˆÜ\‹ˆÛÚÝHØ[YZ[YZH[HÙ]˜\™\š\ØZ[ÚÙ[¸ &ZH›Ü›\‹ˆÞ][™H‹L™HŒ0éØ[1,qgØXš[\œÚ[ŽÈ[Y[ðï0éÈ™H\Ý[1,ZÈ^\±,Y1,\‹‰×W_K˜\NžØ\–ÍK[™\Î–ÖÉÕ™YÙ]H[ž˜H[˜HÝÙ\ˆ˜[[ÚY[ËˆHY^˜ÛHÛÛˆH]pìÜÙ™\˜H\˜HÜ™X\ˆ[˜H[˜H[˜H\YšXÚX[ˆÝHÛÛH™\ÜÛ™HHH^‹‰Ë	Õ™YÙ]H›ÝÜÈHÝÙ\ˆ˜[[ÈHÚÞKˆZ^[™ÈÚ]H][ÜÜ\™K]Ü™X]\È[ˆ\YšXÚX[[[ÛÛ‹ˆ\ÈZ[™\ÜÛ™ÈÈ]ÈYÚ‰Ë	Õ™YÙ]H[°éØH[XHÝÙ\ˆ˜[[Èðê]KˆZ\Ý\˜YH0è][ÜÙ™\˜K[HÜšXH[XHXHÚZXH\YšXÚX[ˆÝXHØ]YH™XYÙH0è^‹‰Ë	Õ™YÙ]HðíšÞpï°ï™HÝÙ\ˆ˜[]\‹ˆ][ÜÙ™\›HØ\±,qgñ,\X\^HÛ[˜^HÛqgÝ\\‹ˆÝ^\q'ÝH1,qgñ,q'ØH\ÚH™\š\‹‰×KÉÕ™YÙ]HÙH˜[œÙ›Ü›XH[ˆ1c˜\NˆY^ˆ™XÙ\ÈÝHÝÙ\ˆ]™[ˆ\Ü]Z]˜HÝ\Èpì[ÜÈHÝH˜^[ÈH›ØØKˆ™\Ú\ÝHÍHÙYÝ[™ÜÎˆXZš\›Ø™H\ØØ\°èH[˜HÜÜ[šYY\˜HÛÜ\ˆHÛÛK‰Ë	Õ™YÙ]H˜[œÙ›Ü›\È[ÈHÜ™X]\Nˆ[ˆ[Y\È\ÈÝÙ\ˆ]™[ˆÙÙH\Èš\ÝÈ[™[Ý]™X[KˆÝ\š]™H›ÜŒÍHÙXÛÛ™ÈÚ[HXZš\›Ø™HÛÚÜÈ›Üˆ[ˆÜ[š[™ÈÈÝ]\ÈZ[‰Ë	Õ™YÙ]Hš\˜H1c˜\Nˆ^ˆ™^™\ÈÙ]HÝÙ\ˆ]™[ˆ\ÝšYHÜÈ[šÜÈHÈ˜Z[ÈH›ØØKˆ™\Ú\ÝLÍHÙYÝ[™ÜÈ[œ]X[ÈXZš\›Ø™H›ØÝ\˜H[XHÚ[˜ÙHHÛÜ\ˆHØ]YK‰Ë	Õ™YÙ]H1c˜\HÛ\ŽˆÝÙ\ˆ]™[ÛˆØ]1,[˜H0éñ,ZØ\‹ˆ][\ZÛ\±,[±,H™Hq'ñ,^ˆ1,qgñ,[±,[±,H]]ˆXZš\›Ø™HÝ^\q'ÝHÙ\ÛYH±,\œØ]1,H\˜\šÙ[ŒÍHØ[š^YH^X[‹‰×W_KZ[žØ\–ÍKWK[™\Î–ÖÉÖXZš\›Ø™H\Ü\˜H\ÝH]YH™YÙ]HÙH\Ý˜YKˆØ[H\ÙH\È›ØØ\Ë\Ù[˜Z[˜HH\ÜYHHÛÜHHÛÛHÛÛˆ[ˆÛÛÈ[Ýš[ZY[Ë‰Ë	ÖXZš\›Ø™HØZ]È[[™YÙ]H\È\Ý˜XÝYˆHX\Èœ›ÛHH›ØÚÜË˜]ÜÈ\ÈÝÛÜ™[™Ý]ÈHZ[Ú]Û™HÝÚ[™Ë‰Ë	ÖXZš\›Ø™H\Ü\˜H™YÙ]HÙH\Ý˜Z\‹ˆØ[H\È›ØÚ\Ë\Ù[X˜Z[šHH\ÜYHHÛÜHHØ]YHÛÛH[HÛÛK‰Ë	ÖXZš\›Ø™H™YÙ]x &[±,[ˆZÚØ][š[ˆq'ñ,[X\ñ,[±,H™ZÛ\‹ˆØ^X[\™[ˆ]^q,\ñ,[1,Xñ,[±,H0éÙZÙ\ˆ™HÝ^\q'ÝHZÈ[[YHÙ\Ù\‹‰×KÉÔÚ[ˆÛÛK™YÙ]HY[™HHÝH›Ü›XH˜\ÙK\šYËˆÛÚ[ˆHÜš[[ˆ™YÜ™\Ø[ˆ\˜H^]Y\ˆHÛÚÝKˆ\›Z[˜H[ÛÛX˜]HÛÛ˜H[°ë[˜Ú\HXš[]YË‰Ë	ÕÚ]Ý]\ÈZ[™YÙ]H™]\›œÈÈ\È˜\ÙH›Ü›KÛÝ[™YˆÛÚ[ˆ[™Üš[[ˆ™]\›ˆÈ[ÛÚÝKˆš[š\ÚHšYÚYØZ[œÝHÙXZÙ[™Yš[˜ÙK‰Ë	ÔÙ[HHØ]YK™YÙ]H›ÛH™\šYÈ0è›Ü›XH˜\ÙKˆÛÚ[ˆHÜš[[ˆ™]Ü›˜[H\˜HZY\ˆÛÚÝKˆ\›Z[™HH]HÛÛ˜HÈ°ë[˜Ú\H[™œ˜\]YXÚYË‰Ë	ÒÝ^\ZÜÝ^ˆ™YÙ]HX\˜[1,H[Y[špéÚ[Z[™H0í›™\‹ˆÛÚ[ˆ™HÜš[[ˆÛÚÝx &^XHX\™1,[XHÙ[\‹ˆ˜^q,Y›^X[ˆ™[œÛH0í°ï1gðïš]\‹‰×W_K™[™[™ÎžØ\–ÌK[™\Î–ÖÉÑÛÚ[ˆHÜš[[ˆ^]Y[ˆHÛÚÝHH™\Ú\Ý\ŽÈHÙ[šÚY[XH\ÈXÚ\Ú]˜H[ˆ[[™œ™[[ZY[Ëˆ[ˆ[™[]ÈÜšYÚ[˜[ÛÚ[ˆ[Xšpê[ˆÙH˜[œÙ›Ü›XH[ˆ1c˜\HHXØX˜HØ^Y[™ÈÛØœ™H™YÙ]K‰Ë	ÑÛÚ[ˆ[™Üš[[ˆ[ÛÚÝH[™\™NÈHÜ\š]›ÛXˆ^\ÈHXÚ\Ú]™H›ÛKˆ[ˆHÜšYÚ[˜[ÝÜžKÛÚ[ˆ[ÛÈ™XÛÛY\ÈHÜ™X]\H[™[[X][H˜[ÈÛÈ™YÙ]K‰Ë	ÑÛÚ[ˆHÜš[[ˆZY[HÛÚÝHH™\Ú\Ý\ŽÈHÙ[šÚY[XH0êHXÚ\Ú]˜Kˆ›È™[]ÈÜšYÚ[˜[ÛÚ[ˆ[X°ê[Hš\˜H1c˜\HHXØX˜HØZ[™ÈÛØœ™H™YÙ]K‰Ë	ÑÛÚ[ˆ™HÜš[[ˆÛÚÝx &[[ˆ^X[›X\ñ,[˜HX\™1,[HY\ŽÈZ›ÛX˜\ñ,H™[\›^ZXÚHÛ\‹ˆ\ñ,[ZðèžYYHÛÚ[ˆH1c˜\HÛ\™YÙ]x &[±,[ˆ0ïÝ0ï™H0ï1gÙ\‹‰×KÉÒÜš[[ˆ]ZY\™HXØX˜\ˆÛÛˆ™YÙ]K\›ÈÛÚÝHYHZ˜\›ÈX\˜Ú\‹ˆ™YÙ]H\ØØ\H[ˆÝHðè\Ý[KˆHØYØH\›Z[˜NÈYY\È™\]\ˆ\È™\È˜\Ù\ÈÈ›Û™\ˆH™\ˆ\ÈÚ[™[pè]XØ\Ë‰Ë	ÒÜš[[ˆØ[ÈÈš[š\Ú™YÙ]K]ÛÚÝH\ÚÜÈ[HÈ][HÛËˆ™YÙ]H\ØØ\\È[ˆ\ÈÙˆHØYØH[™ÎÈ[ÝHØ[ˆ™\^H[™YH\Ù\ÈÜˆ™]Ø]ÚHÚ[™[X]XÜË‰Ë	ÒÜš[[ˆ]Y\ˆXØX˜\ˆÛÛH™YÙ]KX\ÈÛÚÝHYH]YHÈZ^H\\‹ˆ™YÙ]H›ÙÙH˜Hðè\Ý[KˆHØYØH\›Z[˜NÈ›ØðêˆÙH™\]\ˆ\È°êœÈ˜\Ù\ÈÝH™]™\ˆ\ÈÙ[˜\Ë‰Ë	ÒÜš[[ˆ™YÙ]x &[±,[ˆqgÚ[šHš]\›YZÈ\Ý\‹[XHÛÚÝHÚ]Y\Ú[™H^š[ˆ™\›Y\Ú[šH\Ý\‹ˆ™YÙ]HØ\ðïHØpéØ\‹ˆ\Ý[ˆš]\ŽÈ0ï0éÈqgØ[X^q,HZÜ˜\ˆÞ[˜^XXš[\ˆ™^XHØZ™[\šH^›^YXš[\œÚ[‹‰×W_BŸNÂ™[˜Ý[ÛˆØYØPÚ[™[XQš[š\ÚMÌÊ
^ØÛÛœÝÏ\ØYØT[ŒMÌË˜Ú[™[XNÚYŠXÊ\™]\›ˆ˜[ÙNÜØYØT[ŒMÌË˜Ú[™[XO[[ÜØYØT[ŒMÌËÚÙ[ŠÊÎÚYŠËœ™]šY]Ê^ØÛÜÙQX[ÙÊ
NÜØYØSY[LMÌÊ
NÜ™]\›ˆYNßXÛÛœÝÏ\ØYØTÝ]LMÌÊ
NÚYŠËœ[™[™ÈOOXËšÙ^J\™]\›ˆ˜[ÙNÜËœ[™[™ÏIÉÎÜËœ[™[LÚYŠËšÙ^OOOIÞX[XÚIÉ‰ˆ\ËžX[XÚJ^ÜËžX[XÚO]YNØÛÛœÝO\ØYØT[ŒMÌË™šYÚ\œË™š[™
OO™KšŒ
NÚYŠJYKšLßZYŠËšÙ^OOOIÜXØÛÛÉÊ\ËœXØÛÛÏ]YNÚYŠËšÙ^OOOIØ\IÊ^ÜË™›Ü›OLNÜË˜\U[YOLÜËœØ]™YV×NÜØYØT[ŒMÌË™šYÚ\œÏVÜØYØSXZÙLMÌÊ	Ø\IËLLÍ
WNßZYŠËšÙ^OOOIÝZ[	Ê^ÜË™›Ü›OLŽÜËœØ]™YV×NØÛÛœÝO\ØYØSXZÙLMÌÊ	Ý™YÙ]IËLLÍ
NÙK›X^YKšLÍLÜØYØT[ŒMÌË™šYÚ\œÏVÙWNß\ØYØT[ŒMÌËœÚÝÏV×NÜØYØT[ŒMÌË™žV×NÚYŠËšÙ^OOOIØ\IßËšÙ^OOOIÝZ[	Ê^ÜØZT[ŒMË˜XÝ[Û\ØZT[ŒMË˜™X[O[[ÜØZT[ŒMËœÚÝV×NÛÝ\”[ŒMÌ‹™Ù[šÚO[Ý\”[ŒMÌ‹˜›ÛX[[ÛÝ\”[ŒMÌ‹šØZOLÛÝ\”[ŒMÌ‹œ™\ÝSX]›X^
Ý\”[ŒMÌ‹œ™\Ý
NÛÝ\”[ŒMÌ‹œÝ˜Z[Lß\ØYØP[Y\ÔÙYYMÌÊ
NÜØYØTÛ˜\ÚÝMÌÊ
NØÛÜÙQX[ÙÊ
NÜ\œÚ\ÝØ[YJ
NÚYŠËšÙ^OOOIÙ[™[™ÉÊ\ØYØSY[LMÌÊ
NÜ™]\›ˆYNßB™[˜Ý[ÛˆØYØPÚ[™[XLMÌÊÙ^K[™[L™]šY]ÏY˜[ÙJ^ÚYŠ\ØZLMÊ
_\ØYØTØÙ[™\ÌMÌÖÚÙ^WJ\™]\›ˆ˜[ÙNØÛÛœÝÜXÏ\ØYØTØÙ[™\ÌMÌÖÚÙ^WNÜ[™[XÛ[\
X]™›ÛÜŠ[™[
KÜXË›[™\Ë›[™ÝLJNØÛÛœÝÚÙ[JÊÜØYØT[ŒMÌËÚÙ[ŽÜØYØT[ŒMÌË˜Ú[™[XO^ÚÙ^K[™[™]šY]ßNÚYŠ\™]šY]Ê^ØÛÛœÝÏ\ØYØTÝ]LMÌÊ
NÚYŠËœ[™[™ÈOOZÙ^J\™]\›ˆ˜[ÙNÜËœ[™[\[™[Ü\œÚ\ÝØ[YJ
NßXÛÛœÝ™^J
OOœ[™[
ÌOÜXË›[™\Ë›[™ÝÜØYØPÚ[™[XLMÌÊÙ^K[™[
ÌK™]šY]ÊNœØYØPÚ[™[XQš[š\ÚMÌÊ
NÜÚÝÑX[ÙÊ	ÑQÓÓˆSˆ0­È	ÊÓM
	ÔÐQÐHÐRVPS‰Ë	ÔÐRVPSˆÐQÐIË	ÔÐQÐHÐRVPS‰Ë	ÔÐRVPSˆTÕS’IÊKM
	Ò\ÝÜšXIË	ÔÝÜžIË	Ò\Ý0ìÜšXIË	ÒZðèžYIÊJÉÈ0­È	ÊÊ[™[
ÌJJÉÈÈ	ÊÜÜXË›[™\Ë›[™Ý	Ï]ˆ]K[›ËZLNØ[˜\ÈYHœØYØKXÚ[™[XLMÌÈˆÛ\ÜÏHœ˜Y]‹\ØÙ[™LMŽˆÚYHÍŽˆZYÚHÌˆØØ[˜\Ï‰ÊÓM
‹‹œÜXË›[™\ÖÜ[™[JJÉÏÜÙ]‰ËÖÓM
	ÔÒQÕRQS•IË	Ó‘V	Ë	Ô°äÖSSÉË	ÔÓÓ”Rñ,	ÊK™^KÓM
	ÔÐSTˆÒS‘SpàUPÐIË	ÔÒÒTÒS‘SPUPÉË	ÔSTˆÒS‘SpàUPÐIË	Ôñ,‘SPU1,1'±,UIÊKØYØPÚ[™[XQš[š\ÚMÌ×WJNØÛÛœÝÝ\\\™›Ü›X[˜ÙK››ÝÊ
KZ[J
OOžÚYŠÚÙ[ˆOO\ØYØT[ŒMÌËÚÙ[Ÿ\ØYØT[ŒMÌË˜Ú[™[XJ\™]\›ŽØÛÛœÝ[YØÝ[Y[™Ù][[Y[žRY
	ÜØYØKXÚ[™[XLMÌÉÊNÚYŠY[
\™]\›ŽØÛÛœÝØÏY[™Ù]ÛÛ^
	Ì™	ÊK[O\ØYØP\MÌË˜Ú[™[XKJ\™›Ü›X[˜ÙK››ÝÊ
K\Ý\
KÌL[™^\ÜXË˜\Ü[™[KÝÏZ[KÚYÌ‹ÞOVÌÌMËWVÓX]™›ÛÜŠ[™^ÌŠWKÚVÌÌMËÌÌ‹ÍÍWVÓX]™›ÛÜŠ[™^ÌŠWNØØËš[XYÙTÛ[ÛÝ[™Ñ[˜X›YY˜[ÙNÚYŠ[K˜ÛÛ\]I‰š[K›˜]\˜[ÚY
^ØÛÛœÝLJËŒMJ“X]œÚ[Š
‹JKÏMÍŽ
ž‹MÌŠžŽØØË™˜]Ò[XYÙJ[K[™^	LŠœÝËÞKÝËÚ
ÍŽ]ÊKÌ‹
Ì‹Z
KÌ‹Ë
NßZYŠÙ^OOOIØ\œš]˜[	É‰œ[™[OOLJ^Ù›ÜŠ]OLÚOŽÚJÊÊ\ØYØTZ[MÌÊ	Ù[™[ZY\ÉË‹X]™›ÛÜŠ
ŠIMN
ÚJŽËÎÍKOŒ‹ØÊNßZYŠÙ^OOOIÞX[XÚIÉ‰œ[™[OOL
^ØØËœØ]™J
NØØË™ÛØ˜[ÛÛ\ÜÚ]SÜ\˜][ÛIÜØÜ™Y[‰ÎØØË™š[Ý[OIÜ™Ø˜JMKKML	ÊÊŒ
ËŒMŠ“X]˜XœÊX]œÚ[Š

JJJÉÊIÎØØË˜™YÚ[”]

NØØË˜\˜ÊLŒJÓX]œÚ[Š
JJŒMKX]”JŒŠNØØË™š[

NØØËœ™\ÝÜ™J
NßZYŠÙ^OOOIÞX[XÚIÉ‰œ[™[OOLJ^ØØË™š[Ý[OIÜ™Ø˜JMKN	ÊÓX]›X^
Ž]
‹
JÉÊIÎØØË™š[™XÝ
ÍŽÌŠNÙ›ÜŠ]OLÚOLŽÚJÊÊ^ØØË™š[Ý[OIÈÙXNM	ÎØØË™š[™XÝ

JÎJÝ
ŒŒŠIMÍŽÌ
ÚJŒŒŠNß_ZYŠÙ^OOOIÝ™YÙ]IÉ‰œ[™[OOLJ^ØØËœÝ›ÚÙTÝ[OIÈØ™MÍ™™ŽNIÎØØË›[™UÚYLÌØØË˜™YÚ[”]

NØØË›[Ý™UÊLŒÌ
NØØË›[™UÊÎL
ÓX]œÚ[Š

JŒŒŒ
NØØËœÝ›ÚÙJ
NØØËœÝ›ÚÙTÝ[OIÈØÙ™‰ÎØØË›[™UÚYLŒŽØØË˜™YÚ[”]

NØØË›[Ý™UÊLŒŽ
NØØË›[™UÊÎL
ÓX]œÚ[Š

JŒŒŒ
NØØËœÝ›ÚÙJ
NßZYŠÙ^OOOIØ\IÊ^ØØËœÝ›ÚÙTÝ[OIÈÙ™™™ØØ˜‰ÎØØË›[™UÚYLÎØØË˜™YÚ[”]

NØØË˜\˜ÊNÌŠÓX]œÚ[Š

JKX]”JŒŠNØØËœÝ›ÚÙJ
NßZYŠÙ^OOOIÝZ[	É‰œ[™[OOL
^ØØËœÝ›ÚÙTÝ[OIÈÙ™™Ž˜IÎØØË›[™UÚYMŽØØË˜™YÚ[”]

NØØË›[Ý™UÊML
ÓX]œÚ[Š

JŒŒLÌ
NØØË›[™UÊÍLÍL
NØØËœÝ›ÚÙJ
NßZYŠÙ^OOOIÙ[™[™ÉÉ‰œ[™[OOLJ^ØØË™š[Ý[OIÈÙYL™Y	ÎØØË˜™YÚ[”]

NØØË™[\ÙJLÌLSX]›Z[ŠŒŒ
ŒÌ
KÍKËX]”JŒŠNØØË™š[

Nß\™\]Y\Ý[š[X][Û‘œ˜[YJZ[
NßNÜZ[

NÜ™]\›ˆYNßB‚™[˜Ý[ÛˆØYØSY[LMÌÊ
^ÚYŠ\ØZLMÊ
J\™]\›ˆ˜[ÙNØÛÛœÝÏ\ØYØTÝ]LMÌÊ
KÏ[Ý\”Ý]LMÌŠ
K[YÚX›O\ØYØQ[YÚX›LMÌÊ
NÛ]›ÙOIÏ]ˆ]K[›ËZLNˆÛ\ÜÏHœØZKYX[ÙÌMÈ‰ÊÓM
	Õ™\È˜\Ù\ÎˆØZX˜[Y[ˆ8¡¤ˆ˜\H8¡¤ˆ™YÙ]HÈ1c˜\KˆØYH˜\ÙHÛÛ\]YHH
ÍLÝÙ\ˆ]™[[Xšpê[ˆ[™\]\›Kˆ™\ˆÈØ[\ˆ\ØÙ[˜\È›È[™YØH™XÛÛ\[œØ\Ë‰Ë	Õ™YH\Ù\ÎˆØZX˜[Y[ˆ8¡¤ˆ˜\H8¡¤ˆ™YÙ]HÈÜ™X]\KˆXXÚÛÛ\]Y\ÙHÜ˜[È
ÍLÝÙ\ˆ]™[[˜ÛY[™È™\^\ËˆØ]Ú[™ÈÜˆÚÚ\[™ÈØÙ[™\ÈÜ˜[È›È™]Ø\™Ë‰Ë	Õ°êœÈ˜\Ù\ÎˆØZX˜[Y[ˆ8¡¤ˆ˜\H8¡¤ˆ™YÙ]HÈ1c˜\KˆØYH˜\ÙHÛÛ˜ÛpëYH0èH
ÍLÝÙ\ˆ]™[[˜Û\Ú]™H[È™\]\‹ˆ™\ˆÝH[\ˆÙ[˜\È°èÛÈ0èH™XÛÛ\[œØK‰Ë	ðç0éÈqgØ[XNˆØZX˜[X[›\ˆ8¡¤ˆ˜\H8¡¤ˆ™YÙ]HÈ1c˜\Kˆ\ˆ[X[[[˜[ˆqgØ[XHZÜ˜\›\™HH
ÍLÝÙ\ˆ]™[™\š\‹ˆØZ™H^›[YZÈ™^XH][XZÈ0í™0ï™\›Y^‹‰ÊJÉÏÜ”ØZX˜[Y[ˆÌŒ0­È˜\HŒŒ0­È™YÙ]HMLŒ0­È1c˜\HKLŒÜ‰ÊÓM
	Ð[XYÜÈ
˜[Ü™\È[YYÛÊIË	Ð[Y\È
Ø[YH˜[[˜ÙH˜[Y\ÊIË	Ð[XYÜÈ
˜[Ü™\ÈÈ›ÙÛÊIË	ÓpïYšZÛ\ˆ
Þ][ˆ[™ÙHq'Ù\›\šJIÊJÉÎˆÛÚ[ŒÍKŒ0­ÈXØÛÛÍKŒ0­ÈÜš[[ŒÌ‹Œ0­ÈX[XÚLŽŒ0­È[œÚ[š[ŒÎŒÜ‰ÊÓM
	Ô™\]Z\Ú]ÜÎˆ™[˜Ù\ˆH˜Y]‹\™[™\ˆÛÛˆØZ[Ë\Ø[XK\Ý\ˆš]›ÈHYØ\ˆ[pì[È™]š\ÝË‰Ë	Ô™\]Z\™[Y[ÎˆY™X]˜Y]‹X\›ˆœ›ÛHÚ[™ÈØZK™H[]™H[™™XXÚH^XÝYYX\‹‰Ë	Ô™\]Z\Ú]ÜÎˆ™[˜Ù\ˆ˜Y]‹\™[™\ˆÛÛHØZ[Ë\Ý\ˆš]›ÈHÚYØ\ˆ[È[›È™]š\ÝË‰Ë	ÑÙ\™ZÙ[›\Žˆ˜Y]¸ &ZHY[‹Ü˜[ØZx &Y[ˆ0í±'Ü™[‹^X]HÛ™H™ZÛ[™[ˆq,[H[qgË‰ÊJÉÈ	ÊÓM
	Ðpì[ÉË	ÖYX\‰Ë	Ð[›ÉË	Öq,[	ÊJÉÈ	ÊÜØZVYX\ŒMÌŠ
JÉÈÈ	ÊÊË˜\œš]˜[YX\ŸÍŒŠJÉÏÜ‰ÊÓM
	Ñ˜\ÙIË	Ô\ÙIË	Ñ˜\ÙIË	ÐqgØ[XIÊJÉÈ	ÊÜËœ\ÙJÉËÌÈ0­È	ÊÓM
	ÔØYØ\ÈÛÛ\]Y\ÉË	ÐÛÛ\]YØYØ\ÉË	ÔØYØ\ÈÛÛ˜ÛpëY\ÉË	Õ[X[[[˜[ˆ\Ý[›\‰ÊJÉÈ	ÊÜËÚ[œÊÉÏÜ‰ÊÓM
	ÐY\XÚpìÛˆYØX›NˆÛÚÝHÛÛX˜]H\ÙH[[šXÚ[ÎÈ\ÈÚ[™[pè]XØ\È^XØ[ˆÜÈXÛÛXÚ[ZY[ÜÈÜšYÚ[˜[\Ë‰Ë	Ô^XX›HY\][ÛŽˆÛÚÝHšYÚÈœ›ÛHHÝ\ÈÚ[™[X]XÜÈ^Z[ˆHÜšYÚ[˜[]™[Ë‰Ë	ÐY\péðèÛÈ›Ùðè]™[ˆÛÚÝH]H\ÙHÈ[°ëXÚ[ÎÈ\ÈÙ[˜\È^XØ[HÜÈ]™[ÜÈÜšYÚ[˜Z\Ë‰Ë	ÓÞ[˜[˜Xš[\ˆ^X\›[XNˆÛÚÝH˜qgÝ[ˆØ]˜qgñ,\ŽÈÚ[™[X]ZÛ\ˆ\ñ,[Û^[\±,Hpéñ,ZÛ\‹‰ÊJÉÏÜÙ]‰ÎØÛÛœÝ]ÛœÏV×NÚYŠ[YÚX›J^ÚYŠ\Ëœ\Ù_Ë˜ÛÛ\]JX]ÛœËœ\Ú
ÜË˜ÛÛ\]OÓM
	Ô‘TUTˆÐQÐIË	Ô‘TVHÐQÐIË	Ô‘TUTˆÐQÐIË	ÑTÕS’HRÔT“IÊN“M
	ÐÓÓQS–TˆÐQÐIË	ÔÕT•ÐQÐIË	ÒS’PÒPTˆÐQÐIË	ÑTÕS’Hqg“U	ÊKØYØTÝ\MÌ×JNÙ[ÙHYŠØYØR\™LMÌÊ
I‰œË˜ÛZ[\ÖÜËœ\ÙKLWJX]ÛœËœ\Ú
ÓM
	ÔÒQÕRQS•HTÑIË	Ó‘VTÑIË	Ô°äÖSPHTÑIË	ÔÓÓ”Rñ,qgSPIÊKØYØS™^MÌ×JNÙ[ÙH]ÛœËœ\Ú
ÓM
	ÐÓÓ•S•PTˆÐQÐIË	ÐÓÓ•S•QHÐQÐIË	ÐÓÓ•S•PTˆÐQÐIË	ÑTÕSHUSIÊKØYØQ[\ŒMÌ×JNßY›ÜŠÛÛœÝÚÙ^KX™[[ÙˆÖÉØ\œš]˜[	ËÉÓQÐQIË	ÐT”’US	Ë	ÐÒQÐQIË	ÑÑS1,1g‰×WKÉÞX[XÚIËÉÖPSPÒIË	ÖPSPÒIË	ÖPSPÒIË	ÖPSPÒI×WKÉÛ˜\IËÉÓTIË	ÓTIË	ÓTIË	ÓTI×WKÉÜXØÛÛÉËÉÔPÐÓÓÉË	ÔPÐÓÓÉË	ÔPÐÓÓÉË	ÔPÐÓÓÉ×WKÉÝ™YÙ]IËÉÕ‘QÑUIË	Õ‘QÑUIË	Õ‘QÑUIË	Õ‘QÑUI×WKÉØ\IËÉÕS”Ñ“Ô“PPÒpäÓˆ1cT•IË	ÑÔ‘PUTHS”Ñ“Ô“PUSÓ‰Ë	ÕS”Ñ“Ô“PpáðàÓÈ1cT•IË	ñcT•H0å“°ç1g°çpç	×WKÉÝZ[	ËÉÐÓÔ•HHÓÓIË	ÕRSÕU	Ë	ÐÓÔ•HHÐUQIË	ÒÕVT•RÈÑTñ,q,	×WKÉÙ[™[™ÉËÉÑ’SS	Ë	ÑS‘S‘ÉË	Ñ’SS	Ë	ÔÓÓ‰×WWJX]ÛœËœ\Ú
Éø¥­ˆ	ÊÓM
‹‹›X™[
K

OOœØYØPÚ[™[XLMÌÊÙ^KYJWJNØ]ÛœËœ\Ú
ÓM
	ÐÑT”T‰Ë	ÐÓÔÑIË	Ñ‘PÒT‰Ë	ÒÐTU	ÊKÛÜÙQX[Ù×JNÜÚÝÑX[ÙÊ	ÑQÓÓˆS‰ËM
	ÔÐQÐHÐRVPS‰Ë	ÔÐRVPSˆÐQÐIË	ÔÐQÐHÐRVPS‰Ë	ÔÐRVPSˆTÕS’IÊK›ÙK]ÛœÊNÜ™]\›ˆYNßB™[˜Ý[ÛˆØYØQ˜]ÌMÌÊ
^ØÝš[XYÙTÛ[ÛÝ[™Ñ[˜X›YY˜[ÙNØÝ™š[Ý[OIÈÍÍLM˜‰ÎØÝ™š[™XÝ
Ë
NØÛÛœÝ›ÛÛOSX]›X^
ËÌMŒÌL
KÞXÛ[\
^Y\‹žUËÊŠž›ÛÛJKX]›X^
MŒUËÞ›ÛÛJJKÞOXÛ[\
^Y\‹žKRÊŠž›ÛÛJKX]›X^
LRÞ›ÛÛJJK[O\ØYØP\MÌË›X\ØÝœØ]™J
NØÝœØØ[J›ÛÛK›ÛÛJNØÝ˜[œÛ]JXÞXÞJNÚYŠ[K˜ÛÛ\]I‰š[K›˜]\˜[ÚY
XÝ™˜]Ò[XYÙJ[KMŒL
NØÝ^[YÛIØÙ[\‰ÎØÝ™›ÛIØ›ÛMœ[Û›ÜÜXÙIÎØÝ›[™UÚYLÎØÝœÝ›ÚÙTÝ[OIÈÌYLNLÍ	ÎØÛÛœÝX™[JKÛÛÜIÈÙ™™ŒX˜IÊOOžØÝ™š[Ý[OXÛÛÜŽØÝœÝ›ÚÙU^
JNØÝ™š[^
JNßNØÛÛœÝÏ\ØYØTÝ]LMÌÊ
NÚYŠËœ\ÙOOOLJ^ÜØYØTZ[MÌÊ	Ù[™[ZY\ÉËLÍÌMÌLÌ
NÜØYØTZ[MÌÊ	Ù[™[ZY\ÉËKLŒLMÌMŒ
NßZYŠËœ\ÙOOOLŠ\ØYØTZ[MÌÊ	Ù[™[ZY\ÉËLÍÌMÌLÌ
NØÛÛœÝXÝÜœÏVË‹‹œØYØT[ŒMÌË™šYÚ\œË™š[\ŠOO™KšŒ
K›X\
OOŠË‹‹™K[™[^NY_JJK‹‹œØYØP[Y\ÌMÌËÜ^Y\ŒMÌÎYKœ^Y\‹žNœ^Y\‹ž_WKœÛÜ

KŠOO˜KžKX‹žJNÙ›ÜŠÛÛœÝHÙˆXÝÜœÊ^ÚYŠKœ^Y\ŒMÌÊ^ØÝ™š[Ý[OIÈÌŽYØMIÎØÝ˜™YÚ[”]

NØÝ™[\ÙJKžKžKÌKX]”JŒŠNØÝ™š[

NØÛÛœÝ›ÝÏ\^Y\‹Ø[Ñ\OOIØ˜XÚÉÏÌNœ^Y\‹Ø[Ñ\OOIÜšYÚ	ÏÌŽœ^Y\‹Ø[Ñ\OOIÛY	ÏÌÎŒXÝ\ØZT[ŒMË˜XÝ[ÛŽÛ]œ\›ÝË™\^Y\‹›[Ýš[™ÏÓX]™›ÛÜŠØZT[ŒMËœ\ÙJINŒ›\Y˜[ÙNÚYŠXÝË\OOOIÜ[˜Ú	Ê^ÜœMÙ™SX]›Z[ŠËX]™›ÛÜŠXÝØXÝ›X^
Ž
JNÙ›\\^Y\‹™˜XÙOßY[ÙHYŠXÝË\OOOIÚØ[YIÊ^ÜœMNÙ™LÙ›\XXÝ™ßY[ÙHYŠØZT[ŒMË˜Ú\™Ú[™É‰ˆ\^Y\‹›[Ýš[™Ê^ÜœMŽÙ™SX]™›ÛÜŠÛØÚÊŽ
INß\ØZTÜš]LMÊœ‹™‹KžKžKLŒ›\
NØÛÛ[YNßXÛÛœÝXK™[™[^OÊK\OOOIØ\IÏÌÌL˜K\OOOIÜØZX˜IÏÎMN˜K\OOOIÛ˜\IÏÌMNŒLÍJN˜KšYOOIÙÛÚ[‰ÏÎL˜KšYOOIÜXØÛÛÉÏÌMNŒLŒœ˜[YOXK˜XÝŒÍ
ÓX]›Z[ŠËX]™›ÛÜŠ
ËXK˜XÝ
KËÊ
JN˜KÚ[™ŒÍ˜K›[Ýš[™ÏÓX]™›ÛÜŠK™œ˜[YJIMŒØÝ™ÛØ˜[[OXK™›\ÚŒËŽŒNÜØYØTZ[MÌÊK™[™[^OÉÙ[™[ZY\ÉÎ‰Ø[Y\ÉËKœ›ÝËX]›X^
œ˜[YJKKžKžKK™[™[^OÜ^Y\‹žKž˜K™˜XÙO
NØÝ™ÛØ˜[[OLNÚYŠK™[™[^J^ÛX™[

K\OOOIÜØZX˜IÏÉÔÐRPSPS‰Î˜K\OOOIØ\IÏÉÕ‘QÑUH1cT•IÎ˜K\KÕ\\Ø\ÙJ
JJÊK\OOOIÜØZX˜IÏÉÈ0­ÈÌÉÎ‰È0­È	ÊÜØZS[X™\ŒMÌŠKœÝÙ\ŠJKKžKžKZLJNØÝ™š[Ý[OIÈÌÌXLÍIÎØÝ™š[™XÝ
KžMLKžKZLMKLÊNØÝ™š[Ý[OIÈÙYMØÌÉÎØÝ™š[™XÝ
KžMLKžKZLMKL
˜KšØK›X^ÊNÚYŠKÚ[™Œ
^ØÝœÝ›ÚÙTÝ[OXK›™^OOIÛY[YIÏÉÈÙ™ŽM‰Î‰ÈÙMXM™™‰ÎØÝ›[™UÚYMØÝ˜™YÚ[”]

NÚYŠK›™^OOIÙ\\[Û‰ÊXÝ™[\ÙJK˜Z[KžK˜Z[KžKMÍKLX]”JŒŠNÙ[ÙHYŠK›™^OOIØ™X[IÊ^ØÝ›[Ý™UÊKžKžKMMJNØÝ›[™UÊK˜Z[KžK˜Z[KžKMMJNßY[ÙHÝ™[\ÙJKžKžKK\OOOIØ\IÏÌÌÌŒMÍKK\OOOIØ\IÏÌNLŽMKX]”JŒŠNØÝœÝ›ÚÙJ
Nß_Y[Ù^ÛX™[
K›˜[YKKžKžKZLL‹	ÈØÍÙXÌÉÊNÚYŠKÚ[™Œ
[X™[
M
‹‹˜KœÚÚ[
KKžKžKZLÌËK˜ÛÛÜŠNß_B™›ÜŠÛÛœÝˆÙˆØYØT[ŒMÌË™ž
^ØÝœØ]™J
NØÝ™ÛØ˜[[OXÛ[\
‹Ù‹›X^JNØÝœÝ›ÚÙTÝ[OY‹˜ÛÛÜŽØÝ™š[Ý[OY‹˜ÛÛÜŽÚYŠ‹šÚ[™OOIÙ\\[Û‰Ê^ØÝ›[™UÚYLLØÝ˜™YÚ[”]

NØÝ™[\ÙJ‹ž‹žKN
ŠKY‹Ù‹›X^
JÌŒLX]”JŒŠNØÝœÝ›ÚÙJ
NßY[ÙHYŠ‹šÚ[™OOIÚÜš[[‰Ê^ØÛÛœÝOLKY‹Ù‹›X^Y‹ž
Ê‹Y‹ž
J˜KOY‹žJÊ‹KY‹žJJ˜NØÝ›[™UÚYMŽØÝ˜™YÚ[”]

NØÝ™[\ÙJKKX]”JŒŠNØÝœÝ›ÚÙJ
NßY[ÙHYŠ‹šÚ[™OOIÝY[‰Ê^ØÝ˜™YÚ[”]

NØÝ›[Ý™UÊ‹ž‹žJNØÝ›[™UÊ‹ML‹KLJNØÝ›[™UÊ‹
ÍL‹JÌJNØÝ˜ÛÜÙT]

NØÝ™ÛØ˜[[JKNØÝ™š[

NßY[ÙHYŠ‹šÚ[™OOIÞX[XÚIÊ^ØÝ›[™UÚYMÙ›ÜŠ]OKLNÚOLNÚJÊÊ^ØÝ˜™YÚ[”]

NØÝ›[Ý™UÊ‹M‹JÚJŒMJNØÝ›[™UÊ‹
ÌÍK‹JÚJŒMKLJNØÝœÝ›ÚÙJ
Nß_Y[Ù^ØÝ›[™UÚYY‹šÚ[™OOIØ™X[IÏÍN™‹šÚ[™OOIÜXØÛÛÉÏÎNŒŒŽØÝ˜™YÚ[”]

NØÝ›[Ý™UÊ‹ž‹žJNØÝ›[™UÊ‹‹JNØÝœÝ›ÚÙJ
NØÝœÝ›ÚÙTÝ[OIÈÙÙ™™™‰ÎØÝ›[™UÚYLÎØÝœÝ›ÚÙJ
NßXÝœ™\ÝÜ™J
NßB™›ÜŠÛÛœÝÚÙˆØYØT[ŒMÌËœÚÝÊ^ØÝ™š[Ý[O\Ú˜ÛÛÜŽØÝ˜™YÚ[”]

NØÝ˜\˜ÊÚžÚžKLËX]”JŒŠNØÝ™š[

NßY›ÜŠÛÛœÝÚÙˆØZT[ŒMËœÚÝ
^ØÝ™š[Ý[OIÈØÎY˜Y™‰ÎØÝ˜™YÚ[”]

NØÝ˜\˜ÊÚžÚžKL‹X]”JŒŠNØÝ™š[

NßZYŠØZT[ŒMË˜™X[J^ØÛÛœÝ\ØZT[ŒMË˜™X[NØÝ›[™PØ\IÜ›Ý[™	ÎØÝœÝ›ÚÙTÝ[OIÈÍMXÙ™™Ž	ÎØÝ›[™UÚYMŒØÝ˜™YÚ[”]

NØÝ›[Ý™UÊ‹ž‹žJNØÝ›[™UÊ‹ž
Ø‹™
Ž‹žJØ‹™JŽ
NØÝœÝ›ÚÙJ
NØÝœÝ›ÚÙTÝ[OIÈÙMY™™™‰ÎØÝ›[™UÚYLØÝœÝ›ÚÙJ
Nß[Ý\‘Y™™XÝÌMÌŠ
NÛX™[
	ø¡¤	ÊÓM
	ÕSIË	ÕSVIË	ÕSIË	ÕQ1,	ÊKŒLLŒ
NØÝœ™\ÝÜ™J
NßB˜ÛÛœÝ˜]Ð™Y›Ü™LMÌÏ\ØZQ˜]ÌMÎÜØZQ˜]ÌMÏY[˜Ý[ÛŠ
^Ü™]\›ˆØYØR\™LMÌÊ
OÜØYØQ˜]ÌMÌÊ
N™˜]Ð™Y›Ü™LMÌÊ
NßNÂ˜ÛÛœÝ›ØÚÙY™Y›Ü™LMÌÏ\ØZP›ØÚÙYMÎÜØZP›ØÚÙYMÏY[˜Ý[ÛŠJ^Ü™]\›ˆØYØR\™LMÌÊ
OÞLÌŒMÌOLOŽLÍN˜›ØÚÙY™Y›Ü™LMÌÊJNßNÂ˜ÛÛœÝÛÛY™Y›Ü™LMÌÏZ\ÔÛÛYÚ\ÔÛÛYY[˜Ý[ÛŠK‹‹˜J^Ü™]\›ˆØYØR\™LMÌÊ
OÜØZP›ØÚÙYMÊJNœÛÛY™Y›Ü™LMÌÊK‹‹˜JNßNÂ˜ÛÛœÝ™YÙ[™Y›Ü™LMÌÏ\ØZT™YÙ[ŒMŽNÜØZT™YÙ[ŒMŽOY[˜Ý[ÛŠ
^ÚYŠØYØR\™LMÌÊ
I‰œØYØT[ŒMÌË™šYÚ\œËœÛÛYJOO™KšŒ
J^ÚYŠ^Y\‹šŒ	‰œ^Y\‹œ™YÙ[•ØZ]L
\^Y\‹šSX]›Z[ŠØZRMÊ
K^Y\‹š
ØÛ[\
ŒJJœØZT™YÙ[”˜]LMŽJ
J‹ŒŠNÜ™]\›Žß\™]\›ˆ™YÙ[™Y›Ü™LMÌÊ
NßNÂ˜ÛÛœÝ\]P™Y›Ü™LMÌÏ\ØZU\]LMÎÜØZU\]LMÏY[˜Ý[ÛŠ
^ÚYŠ\ØYØR\™LMÌÊ
_Ý\”Ý]LMÌŠ
K™XY
\™]\›ˆ\]P™Y›Ü™LMÌÊ
NÚYŠ\Ý\Y]\ÙYÚ[™[X]XßØÝ[Y[šY[Š\™]\›ŽØÛÛœÝÝ\XÛ[\
ŒJNÚYŠ^Y\‹šL
^ÜØYØTÛ˜\ÚÝMÌÊ
NÜ™]\›ˆØZQX]MÌŠ˜[ÙJNßZYŠØYØTÝ]LMÌÊ
Kœ[™[™Ê\™]\›ˆØYØPÚ[™[XLMÌÊØYØTÝ]LMÌÊ
Kœ[™[™ËØYØTÝ]LMÌÊ
Kœ[™[˜[ÙJNÝ\]P™Y›Ü™LMŽ
Ý\
NÛÝ\•XÚÌMÌŠÝ\
NÜØYØU\]LMÌÊÝ\
NÜØZRYMÊ
NßNÂ˜ÛÛœÝY™Y›Ü™LMÌÏ\ØZRYMÎÜØZRYMÏY[˜Ý[ÛŠ
^ÚY™Y›Ü™LMÌÊ
NÚYŠ\ØYØR\™LMÌÊ
J\™]\›ŽØÛÛœÝÏ\ØYØTÝ]LMÌÊ
NÉ
	ÈÜØZK\XÙLMÉÊK^ÛÛ[SM
‹‹”ÐQÐWÓSQTÌMÌÊNÉ
	ÈÜØZK][ÌMÉÊKšY[]YNÉ
	ÈÜØZK[Øš™XÝ]™LMÉÊK^ÛÛ[SM
	ÑTÑIË	ÔTÑIË	ÑTÑIË	ÐqgSPIÊJÉÈ	ÊÜËœ\ÙJÉËÌÈ0­È	ÊÊËœ\ÙOOOLÉ‰œË™›Ü›OOOLOÉñcT•H0­È	ÊÓX]˜ÙZ[
X]›X^
ÍK\Ë˜\U[YJJJÉÜÉÎœØYØT[ŒMÌË™šYÚ\œË™š[\ŠOO™KšŒ
K›[™Ý
ÉÈ	ÊÓM
	Ù[™[ZYÛÜÉË	Ù[™[ZY\ÉË	Ú[š[ZYÛÜÉË	Ù0ï1gÛX[‰ÊJJÊË˜ÛZ[\ÖÜËœ\ÙKLWOÉÈ0­È8§$ÉÎ‰ÉÊNßNÂ˜ÛÛœÝY[P™Y›Ü™LMÌÏ\ØZSY[LMÎÜØZSY[LMÏY[˜Ý[ÛŠYÙOIÜÝ]IÊ^ØÛÛœÝÝ][Y[P™Y›Ü™LMÌÊYÙJNÚYŠ\ØZLMÊ
J\™]\›ˆÝ]ØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	Ø]Û‰ÊNØ‹^ÛÛ[SM
	ÔÐQÐHÐRVPS‰Ë	ÔÐRVPSˆÐQÐIË	ÔÐQÐHÐRVPS‰Ë	ÔÐRVPSˆTÕS’IÊNØ‹›Û˜ÛXÚÏ\ØYØSY[LMÌÎÉ
	ÈÙX[ÙØ]ÛœÉÊKœ™\[™
ŠNÚYŠ˜Y]”›ÙÜ™\ÜÌMŽ

K™Y™X]Y	‰ˆ[Ý\”Ý]LMÌŠ
K™XY
^ØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	Ø]Û‰ÊNÜ‹^ÛÛ[SM
	Ô‘TUTˆQUˆ0­È
ÌŒ	Ë	Ô‘TVHQUˆ0­È
ÌŒ	Ë	Ô‘TUTˆQUˆ0­È
ÌŒ	Ë	ÔQUˆRÔT’H0­È
ÌŒ	ÊNÜ‹›Û˜ÛXÚÏ\˜Y]”™\^LMÌÎÉ
	ÈÙX[ÙØ]ÛœÉÊK˜\[™
ŠNß\™]\›ˆÝ]ßNÂ˜ÛÛœÝ[\˜XÝ™Y›Ü™LMÌÏZ[\˜XÝÚ[\˜XÝY[˜Ý[ÛŠ‹‹˜J^Ü™]\›ˆØYØR\™LMÌÊ
OÜØYØSY[LMÌÊ
Nš[\˜XÝ™Y›Ü™LMÌÊ‹‹˜JNßNÂ˜ÛÛœÝÛÜÙP™Y›Ü™LMÌÏXÛÜÙQX[ÙÎØÛÜÙQX[ÙÏY[˜Ý[ÛŠ
^ÚYŠØYØT[ŒMÌË˜Ú[™[XJ\™]\›ˆØYØPÚ[™[XQš[š\ÚMÌÊ
NÜ™]\›ˆÛÜÙP™Y›Ü™LMÌÊ
NßNÂ˜ÛÛœÝ\œÚ\Ý™Y›Ü™LMÌÏ\\œÚ\ÝØ[YNÜ\œÚ\ÝØ[YOY[˜Ý[ÛŠ‹‹˜J^ÚYŠØZLMÊ
J^ÜØZTÝ]LMÊ
Kœ˜Y]”™\^LMÌÏ\˜Y]”™\X]MÌÎÜØYØTÛ˜\ÚÝMÌÊ
Nß\™]\›ˆ\œÚ\Ý™Y›Ü™LMÌÊ‹‹˜JNßNÂ™[˜Ý[ÛˆØYØT™\ÝÜ™LMÌÊ
^ÜØYØT[ŒMÌËÚÙ[ŠÊÎÜØYØT[ŒMÌË˜Ú[™[XO[[ÜØYØT[ŒMÌËœÚÝÏV×NÜØYØT[ŒMÌË™žV×NÜØYØT[ŒMÌËš\LÜØYØP[Y\ÌMÌÏV×NÚYŠØZLMÊ
J^Ü˜Y]”™\X]MÌÏHH\ØZTÝ]LMÊ
Kœ˜Y]”™\^LMÌÎÚYŠÝ\”[ŒMÌ‹šØZI‰ˆJÌ‹LŒKš[˜ÛY\ÊÝ\”[ŒMÌ‹šØZJJJ[Ý\”[ŒMÌ‹šØZOLÚYŠØYØR\™LMÌÊ
J^ÜØYØTÙYYMÌÊ
NÜØYØP[Y\ÔÙYYMÌÊ
Nß_Y[ÙH˜Y]”™\X]MÌÏY˜[ÙNßB˜ÛÛœÝØY™Y›Ü™LMÌÏ[ØYÛØYY[˜Ý[ÛŠ‹‹˜J^ØÛÛœÝÝ][ØY™Y›Ü™LMÌÊ‹‹˜JNÜØYØT™\ÝÜ™LMÌÊ
NÜ™]\›ˆÝ]ßNÂ˜ÛÛœÝÚÛÜÙP™Y›Ü™LMÌÏXÚÛÜÙT˜XÙNØÚÛÜÙT˜XÙOY[˜Ý[ÛŠ‹‹˜J^ÜØYØTÛ˜\ÚÝMÌÊ
NØÛÛœÝÛ\˜XÙKÝ]XÚÛÜÙP™Y›Ü™LMÌÊ‹‹˜JNÚYŠÛOO\˜XÙJ\ØYØT™\ÝÜ™LMÌÊ
NÜ™]\›ˆÝ]ßNÂ˜ÛÛœÝ˜]™[™Y›Ü™LMÌÏ\ØZU˜]™[MÎÜØZU˜]™[MÏY[˜Ý[ÛŠ‹‹˜J^ÜØYØTÛ˜\ÚÝMÌÊ
NÜ™]\›ˆ˜]™[™Y›Ü™LMÌÊ‹‹˜JNßNÂ˜ÛÛœÝX]™Y›Ü™LMÌÏ\ØZQX]MÌŽÜØZQX]MÌY[˜Ý[ÛŠ‹‹˜J^ÜØYØTÛ˜\ÚÝMÌÊ
NÜ˜Y]”™\X]MÌÏY˜[ÙNÜ™]\›ˆX]™Y›Ü™LMÌÊ‹‹˜JNßNÂ˜ÛÛœÝYXP™Y›Ü™LMÌÏ[Û[š\YXLMÎÛÛ[š\YXLMÏY[˜Ý[ÛŠ‹‹˜J^ÜYXP™Y›Ü™LMÌÊ‹‹˜JNØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	Ø]Û‰ÊNØ‹^ÛÛ[IÑQÓÓˆSˆ0­È	ÊÓM
	ÔT”ÓÓR‘TÉË	ÐÒTPÕT”ÉË	ÔT”ÓÓQÑS”ÉË	ÒÐTRÕT“T‰ÊNØ‹›Û˜ÛXÚÏJ
OOœÚÝÑX[ÙÊ	ÓÓS’TQPIË	ÔÐRVPSˆÐQÐIË	Ï]ˆ]K[›ËZLN”ØZX˜[X[ŒÌŒ0­È˜\MŒŒ0­È™YÙ]LMLŒ0­È1c˜\LKLŒÜ‰ÊÓM
	ÑÛÚ[ŽˆX\Ù[šÛËˆXØÛÛÎˆXZØ[šÛÜØ\ËˆÜš[[ŽˆÚY[ž˜[‹ˆX[XÚNˆpì[È[Ø›Ëˆ[œÚ[š[ŽˆÚZÛÚËˆXZš\›Ø™NˆÛÜHHÛÛHH™YÙ]K‰Ë	ÑÛÚ[ŽˆX\Ù[šÛËˆXØÛÛÎˆÜXÚX[™X[HØ[››Û‹ˆÜš[[Žˆ\ÝXÝÈ\ØËˆX[XÚNˆÛÛˆ˜[™Èš\ÝˆY[ŽˆšKP™X[KˆXZš\›Ø™NˆÝ]È™YÙ]x &\ÈZ[‰Ë	ÑÛÚ[ŽˆX\Ù[šÛËˆXØÛÛÎˆXZØ[šÛÜØ\ËˆÜš[[ŽˆÚY[ž˜[‹ˆX[XÚNˆ[šÈÈØ›Ëˆ[œÚ[š[ŽˆÚZÛÚËˆXZš\›Ø™NˆÛÜHHØ]YHH™YÙ]K‰Ë	ÑÛÚ[ŽˆX\Ù[šÛËˆXØÛÛÎˆ0åž™[qgñ,[ˆÜKˆÜš[[ŽˆÚY[ž˜[‹ˆX[XÚNˆÝ\qgÚH][\q'ÝKˆ[œÚ[š[ŽˆÚZÛÚËˆXZš\›Ø™Nˆ™YÙ]x &[±,[ˆÝ^\q'Ý[HÙ\Ù\‹‰ÊJÉÏÜ‰ÊÓM
	ÔÙ\™\ÈY\YÜÈ[YYÛËˆ›È\ØØ[™XX›\Ë‰Ë	ÔÝÙ\ˆ˜[Y\ÈY\Y›ÜˆHØ[YKˆ›ÝØØ[›˜X›K‰Ë	ÔÙ\™\ÈY\YÜÈ[È›ÙÛËˆ°èÛÈ\ØØ[™pè]™Z\Ë‰Ë	Ñðï0éÈq'Ù\›\šHÞ][˜H^X\›[›q,qgÝ1,\‹ˆ\˜[˜[X^‹‰ÊJÉÏÜÙ]‰ËÖÓM
	Õ“Ó‘T‰Ë	ÐPÒÉË	Õ“ÓT‰Ë	ÑÑT±,	ÊK

OO›Û[š\YXLMÊ
WWJNÉ
	ÈÙX[ÙØ]ÛœÉÊKœ™\[™
ŠNßNÂ˜ÛÛœÝ™]ÜÐ™Y›Ü™LMÌÏ]\]SÙÌŒÎÝ\]SÙÌŒÏY[˜Ý[ÛŠ‹‹˜J^Û™]ÜÐ™Y›Ü™LMÌÊ‹‹˜JNÉ
	ÈÙX[ÙÙ^YXœ›ÝÉÊK^ÛÛ[IÓÓS’P“V–ˆÔ’QÒSS0­ÈKŽIÎØÛÛœÝYØÝ[Y[˜Ü™X]Q[[Y[
	Ü	ÊNÜœÙ]]šX]J	Ù]K[›ËZLN‰Ë	ÉÊNÜ^ÛÛ[SM
	ÕY[ÈÚ[ˆœ˜YÛY[ÜÈHÜš]\È™XÚ[›ÜËˆØZ[ÚÙ[ˆ‹ÞÞLÞŒÛÛˆÝY\œÈ›ÙÜ™\Ú]˜[Y[H›Ú›Ëˆ˜Y]ˆ™\]X›NLš[Y\˜HšXÝÜšXKŒÚYÝZY[\ËˆØYØHØZ^X[ˆ[ˆ™\È˜\Ù\ÎˆØZX˜[Y[‹˜\HU™YÙ]Kñc˜\HL[XYÜÈXÚ[™[pè]XØ\È™\]X›\ËÜØ[X›\ËLÜ™˜\ÙH[˜Û\ÛÈ[™\]\‹‰Ë	Ñ›YÚÚ]Ý]™ZYÚ›Üš[™ÈÜš]Hœ˜YÛY[ËˆØZ[ÚÙ[ˆ‹ÞÞLÞŒ[˜Ü™X\Ú[™ÛH[ÈH›ÙH™Yˆ™\X]X›H˜Y]ŽLš\œÝšXÝÜžKŒ]\‹ˆ™YK\\ÙHØZ^X[ˆØYØNˆØZX˜[Y[‹˜\H[™™YÙ]KÑÜ™X]\HL[Y\È[™™\^XX›KÜÚÚ\X›HÚ[™[X]XÜËL\œ\ÙH[˜ÛY[™È™\X]Ë‰Ë	Õ›ÛÈÙ[Hœ˜YÛY[ÜÈš^š[šÜËˆØZ[ÚÙ[ˆ‹ÞÞLÞŒZ^HÈÛÜœÈXZ\È™\›Y[Ëˆ˜Y]ˆ™\]0ë]™[L˜Hš[YZ\˜Hš]0ìÜšXKŒ\Ú\ËˆØYØH[H°êœÈ˜\Ù\ÎˆØZX˜[Y[‹˜\HU™YÙ]Kñc˜\HL[XYÜÈHÙ[˜\È™\]0ë]™Z\ËÜ[0è]™Z\ËLÜ™˜\ÙH[˜Û\Ú]™H™\]péðíY\Ë‰Ë	ÒÛÛqgÝHÜš]H\°éØ[\±,HÛX^X[ˆpéÝqgËˆØZ[ÚÙ[ˆ‹ÞÞLÞŒ™Y[šHÚ]ZðéÙHñ,\›q,^±,HX\\‹ˆ˜Y]ˆZÜ˜\›[±,\Žš[ÍLÛÛœ˜LŒˆ0ç0éÈqgØ[XNˆØZX˜[X[‹˜\H™U™YÙ]Kñc˜\HLpïYšZÛ\‹ZÜ˜\›[˜Xš[\‹Ø][˜Xš[\ˆÚ[™[X]ZÛ\‹ˆZÜ˜\›\™HHqgØ[XH˜qgñ,[˜ML‰ÊNÉ
	ÈÙX[ÙØ›ÙIÊKœ™\[™

NßNÜ™XYSÙÌŒÏY[˜Ý[ÛŠ
^ÚYŠÙÑš\œÝŒß\™XYJ\™]\›ŽÛÙÑš\œÝŒÏ]YNÚYŠØØ[ÝÜ˜YÙK™Ù]][J	ÛÛ[šK\ÙY[‹]\]IÊHOOIÌKŽIÊ^Ý\]SÙÌŒÊ
NÛØØ[ÝÜ˜YÙKœÙ]][J	ÛÛ[šK\ÙY[‹]\]IË	ÌKŽIÊNß_NÂšYŠØØ][Û‹œÙX\˜Úš[˜ÛY\Ê	ÜXOLIÊJ]Ú[™ÝË—×ÝŒMÌÏ^Ù]˜[œÏO™]˜[
Ê_NÂ‚š[š]›ÙÜ™\ÜÊ
NÝÚ[™ÝË“Û[šU\]\ÌMÏË™Ø[YT™XYJ
NÚYŠÚ[™ÝË—×ÙØ[YJSØš™XÝ˜\ÜÚYÛŠ×ÙØ[YKÝ\]K]XÚËÜ™^T[˜Ú˜[œÙ›Ü›KÛÛ[Z]˜[œÙ›Ü›K[XYÙQ[™[^KY™X][\–›Û™K[\˜XÝY[š]›ÙÜ™\ÜË]˜]\”XÚÙ]ÛÜ›XÚÙ][”™XÙZ]™K›Ùš[TÛ˜\ÚÝÛ[š\YXLMË˜]ÔØÙ[™K˜]ÐÚ[™[XKš[š\ÚÚ[™[XK\]PÚ[™[XKÚ\\œÓY[K[’XŸJNÂŸJJ
NÂ