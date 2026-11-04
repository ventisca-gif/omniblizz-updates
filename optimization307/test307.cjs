const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const player = { level: 239, hp: 10000, x: 420, y: 780, points: 2 };
const ship = { aboard: false };
const ctx = {
  player, zone: 1, enemies: [], REGIONS: [{id:'zero'}, {id:'earth'}], EARTH134: { x: 2200, y: 11000 },
  SPACE134: 0, L219: (...words) => words[0], started: true, paused: false, cinematic: null,
  net: {}, photon145: {}, blocked112: () => false, safeGateZone151: () => true, zoneStates: {},
  makeRegion17: (id, name, subtitle, links, options) => ({ id, name, ...options }),
  closeDialog() {}, persistGame() {}, hud() {}, interact() {}, drawScene() {}, drawSpace134() {},
  drawMob78() {}, updateMobs78() {}, nearSpace134() {}, damageEnemy() {}, update() {},
  journalRows219: () => [], missions161: [], target80() {}, npcDetails78() {},
  ship134: () => ship, inSpace134: () => ctx.zone === 0, region: () => ctx.REGIONS[ctx.zone],
  personalEnter47(z,x,y) {
    if (ctx.failTravel) return false;
    ctx.zone=z; player.x=x; player.y=y; ctx.enemies=ctx.zoneStates[ctx.REGIONS[z].id] || [];
    return true;
  },
  showDialog(_a,_b,_c,options) { ctx.options = options; }
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname+'/incursean-mission.js','utf8')+
  fs.readFileSync(__dirname+'/integration.js','utf8'),ctx);
assert.equal(ctx.journalRows219('available').length,1);
ctx.failTravel=true;
assert.equal(ctx.boardIncurseanShip(),false);
assert.equal(player.incurseanMission,undefined);
ctx.failTravel=false;
assert(ctx.boardIncurseanShip());
assert.equal(ctx.enemies.length,4);
for(const enemy of ctx.enemies) {
  assert.equal(enemy.max,400000);
  assert.equal(enemy.damage,2900);
}
ctx.damageEnemy(ctx.enemies[0],400000);
ctx.interact();
ctx.options.find(([label])=>label==='Salir de la nave')[1]();
assert.equal(ctx.zone,1);
assert.equal(player.x,420);
assert(ctx.boardIncurseanShip());
assert.equal(ctx.enemies.length,3);
for(const enemy of ctx.enemies) ctx.damageEnemy(enemy,400000);
assert(ctx.journalRows219('active')[0].ready);
ctx.interact();
ctx.options.find(([label])=>label==='Reclamar nivel')[1]();
assert.equal(player.level,240);
assert.equal(player.points,3);
assert.equal(ctx.boardIncurseanShip(),false);
console.log('Entrada rechazada, retorno, reentrada, cuatro bajas y recompensa verificados.');
