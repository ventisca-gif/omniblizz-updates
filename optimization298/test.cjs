const fs=require('fs'),vm=require('vm'),assert=require('assert');
const s=fs.readFileSync(process.argv[2],'utf8');
const loopAt=s.indexOf('loop=function(now){',s.indexOf('const loopBefore202=loop;'));
const loop=s.slice(loopAt,s.indexOf('document.addEventListener',loopAt));
const clockAt=s.indexOf('function paintClock194(');
const clock=s.slice(clockAt,s.indexOf('const worldClock194',clockAt));
const extAt=s.indexOf('const simulateBefore297=simulate75;');
const ext=s.slice(extAt,s.indexOf('initProgress();window.OmniUpdates147?.gameReady();',extAt));
let passed=0;
for(const race of ['omni','anodite','osmo','bendy','system148','saiyan','pokemon','undertale'])for(const hz of [60,90,120,144])for(const fps of [30,60]){
 const c={race,requestAnimationFrame(){},last:0,pendingTime202:0,countPlay56(){},renderStats202:{callbacks:0,simulations:0,seconds:0,updateMs:0,drawMs:0,draws:0},ready:true,started:true,paused:false,cinematic:null,document:{hidden:false},window:{omniMode61:'offline'},net:{remoteAway:false,waiting:false},performance:{now:()=>0},quality17:'high',sampleFrame201(){},netUpdate(){},updateCinema(){},draw(){},drawCinema(){},sound:false,zone:0,dayMode:0,clock:0,total:0,steps:[],simulate75(dt){this.total+=dt;},loopBefore202(){throw Error('race bypass');}};
 c.simulate75=dt=>{c.total+=dt;for(let r=Math.min(.25,dt);r>1e-10;r-=Math.min(.04,r))c.steps.push(Math.min(.04,r));};
 vm.createContext(c);vm.runInContext(clock,c);const wc={last:-Infinity,rate:0};c.frameControl75={render:now=>c.paintClock194(wc,now,fps),sample(){}};vm.runInContext(loop,c);
 for(let i=1;i<=hz*4;i++)c.loop(i*1000/hz);
 assert(Math.abs(c.total-4)<.04,JSON.stringify({race,hz,fps,total:c.total}));assert(c.steps.every(x=>x<=.04));assert(c.renderStats202.draws<=4*fps+1);passed++;
}
for(const fail of [false,true]){
 const c={simulationDepth200:0,hudDirty200:false,performance:{now:()=>1000},hudKey200:()=> 'changed',lastKey200:'old',lastHud200:0,race:'omni',paints:0,hud(){c.paints++;},simulate75(){for(let i=0;i<3;i++){c.simulationDepth200++;c.hudDirty200=true;c.simulationDepth200--;}if(fail)throw Error('expected');return 42;}};
 vm.createContext(c);vm.runInContext(ext,c);if(fail)assert.throws(()=>c.simulate75(),/expected/);else assert.equal(c.simulate75(),42);assert.equal(c.simulationDepth200,0);assert.equal(c.paints,1);assert.equal(c.hudDirty200,false);passed++;
}
console.log(JSON.stringify({passed,failed:0,scope:'extracted production loop and HUD transaction; no Android device benchmark'},null,2));
