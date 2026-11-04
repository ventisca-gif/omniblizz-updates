const INCURSEAN_ZONE = REGIONS.length;
const incurseanOrbit = { x: EARTH134.x + 1150, y: EARTH134.y + 350 };
const incurseanTitle = () => L219('Nave incurseana', 'Incursean ship', 'Nave incurseana', 'Incursean gemisi');
REGIONS.push(makeRegion17('incurseanShip307', incurseanTitle(), '225–240', {}, {
  worldW: 1800, worldH: 1000, minX: 75, maxX: 1725, top: 560, bottom: 940,
  exitY: 800, portalX: 220, colliders: [], spawns: []
}));

function boardIncurseanShip() {
  if (!started || paused || cinematic || !incurseanMission.available(player) ||
      net.role || photon145.joined || blocked112() || player.hp <= 0 ||
      (zone !== INCURSEAN_ZONE && !inSpace134() && !safeGateZone151())) return false;
  const arrival = zone === INCURSEAN_ZONE ? null : {
    zone, x: player.x, y: player.y,
    aboard: !!ship134().aboard
  };
  closeDialog();
  if (!personalEnter47(INCURSEAN_ZONE, 230, 780)) return false;
  ship134().aboard = false;
  incurseanMission.accept(player);
  const mission = player.incurseanMission;
  if (arrival) mission.arrival = arrival;
  const savedEnemies = new Map(enemies
    .filter(enemy => enemy.incursean && enemy.run === mission.run && enemy.alive)
    .map(enemy => [enemy.slot, enemy]));
  enemies = Array.from({ length: incurseanMission.enemyCount }, (_, slot) => savedEnemies.get(slot) ?? ({
    id: 'incursean307-' + mission.run + '-' + slot, slot, run: mission.run,
    kind: 'enemy', incursean: true, mob78: 'incursean307',
    x: 730 + slot * 220, y: 660 + (slot % 2) * 150,
    hp: incurseanMission.enemyHealth, max: incurseanMission.enemyHealth,
    damage: incurseanMission.enemyDamage, level: player.level,
    alive: true, face: -1, anim: 0, cd: 1.5 + slot * .5, wind: 0,
    hit: 0, stun: 0, eliteChecked97: true
  })).filter(enemy => !mission.defeated.includes(enemy.slot));
  zoneStates[region().id] = enemies;
  persistGame();
  return true;
}

const previousIncurseanLanding = nearSpace134;
nearSpace134 = function () {
  if (inSpace134() && dist(player, incurseanOrbit) < 230) {
    return { label: incurseanTitle() + ' · 225–240', action: boardIncurseanShip };
  }
  return previousIncurseanLanding();
};

const previousIncurseanDamage = damageEnemy;
damageEnemy = function (enemy, damage, ...args) {
  if (!enemy?.incursean) return previousIncurseanDamage(enemy, damage, ...args);
  if (!enemy.alive || zone !== INCURSEAN_ZONE || !Number.isFinite(damage) || damage <= 0) return false;
  enemy.hp = Math.max(0, enemy.hp - damage);
  enemy.hit = .15;
  if (enemy.hp === 0) {
    enemy.alive = false;
    if (incurseanMission.recordDefeat(player, enemy)) persistGame();
  }
  return true;
};

const previousIncurseanMobs = updateMobs78;
updateMobs78 = function (dt) {
  if (zone !== INCURSEAN_ZONE) return previousIncurseanMobs(dt);
  for (const enemy of enemies) {
    if (!enemy.incursean || !enemy.alive) continue;
    enemy.anim += dt * 8;
    enemy.hit = Math.max(0, enemy.hit - dt);
    enemy.cd = Math.max(0, enemy.cd - dt);
    const distance = dist(enemy, player);
    enemy.face = player.x < enemy.x ? -1 : 1;
    enemy.moving = false;
    if (enemy.wind > 0) {
      enemy.wind = Math.max(0, enemy.wind - dt);
      if (!enemy.wind && distance < 155) hitPlayer(enemy.damage);
    } else if (distance > 110) {
      const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      moveActor(enemy, Math.cos(angle) * 105 * dt, Math.sin(angle) * 105 * dt);
      enemy.moving = true;
    } else if (!enemy.cd) {
      enemy.wind = 1;
      enemy.cd = 3;
    }
  }
};

const previousIncurseanJournal = journalRows219;
journalRows219 = function (tab) {
  const rows = previousIncurseanJournal(tab).filter(row => row.id !== 'incurseanMission');
  if (!incurseanMission.available(player)) return rows;
  const mission = player.incurseanMission;
  if (tab !== (mission?.active ? 'active' : 'available')) return rows;
  const kills = mission?.active ? mission.defeated.length : 0;
  return [...rows, {
    id: 'incurseanMission', title: incurseanTitle(), ready: kills === 4,
    progress: kills + ' / 4', raw: { goal: 4, kills }
  }];
};

const incurseanArt = new Map();
function loadIncurseanArt(name) {
  if (!incurseanArt.has(name)) {
    const image = new Image();
    const path = 'expansion307/' + name + '.webp';
    image.src = window.OmniUpdates147?.resolve?.(path) || path;
    incurseanArt.set(name, image);
  }
  return incurseanArt.get(name);
}

const previousIncurseanSpace = drawSpace134;
drawSpace134 = function (c) {
  previousIncurseanSpace(c);
  const { x, y } = incurseanOrbit;
  if (!visibleSpace134(x - 165, y - 100, 330, 220, spaceView134())) return;
  const image = loadIncurseanArt('ship');
  if (image.complete && image.naturalWidth) c.drawImage(image, x - 165, y - 100, 330, 190);
  txt(incurseanTitle(), x, y + 110, 20, '#d5ff9d');
};

const previousIncurseanScene = drawScene;
drawScene = function (c, z, day) {
  if (z !== INCURSEAN_ZONE) return previousIncurseanScene(c, z, day);
  c.fillStyle = '#182329';
  c.fillRect(0, 0, 1800, 1000);
  const image = loadIncurseanArt('interior');
  if (image.complete && image.naturalWidth) c.drawImage(image, 0, 0, 1800, 1000);
};

const previousIncurseanSprite = drawMob78;
drawMob78 = function (enemy) {
  if (!enemy.incursean) return previousIncurseanSprite(enemy);
  const image = loadIncurseanArt('soldier');
  const frame = enemy.wind > 0 ? 3 : enemy.moving ? 1 + Math.floor(enemy.anim) % 2 : 0;
  if (image.complete && image.naturalWidth) {
    const width = image.naturalWidth / 4;
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.scale(enemy.face < 0 ? -1 : 1, 1);
    ctx.drawImage(image, frame * width, 0, width, image.naturalHeight, -70, -140, 140, 140);
    ctx.restore();
  }
  txt(Math.ceil(enemy.hp) + ' HP', enemy.x, enemy.y - 150, 12, '#e4ffa0');
};

const previousIncurseanInteract = interact;
interact = function (...args) {
  if (zone !== INCURSEAN_ZONE) return previousIncurseanInteract(...args);
  const mission = player.incurseanMission;
  const kills = mission?.active ? mission.defeated.length : 0;
  const options = [];
  if (kills === 4) options.push([
    L219('Reclamar nivel', 'Claim level', 'Resgatar nível', 'Seviyeyi al'),
    () => {
      if (incurseanMission.claim(player)) {
        player.points = (player.points || 0) + 1;
        persistGame();
      }
      closeDialog();
      hud();
    }
  ]);
  if (!mission?.active && incurseanMission.available(player)) options.push([
    L219('Nueva ronda', 'New round', 'Nova rodada', 'Yeni tur'), boardIncurseanShip
  ]);
  options.push([
    L219('Salir de la nave', 'Leave the ship', 'Sair da nave', 'Gemiden çık'),
    () => {
      closeDialog();
      const origin = mission?.arrival;
      const destination = origin && REGIONS[origin.zone] && origin.zone !== INCURSEAN_ZONE &&
        Number.isFinite(origin.x) && Number.isFinite(origin.y) ? origin : { zone: 1, x: 540, y: 627 };
      if (!personalEnter47(destination.zone, destination.x, destination.y)) return;
      Object.assign(ship134(), {
        aboard: destination.zone === SPACE134 && destination.aboard,
        x: player.x, y: player.y, oxygen: 30
      });
      spaceLock134 = 2;
      persistGame();
    }
  ]);
  options.push([L219('Cerrar', 'Close', 'Fechar', 'Kapat'), closeDialog]);
  showDialog(incurseanTitle(), kills + ' / 4', '<p>+1 LV · 240 MAX</p>', options);
};

const incurseanGuide = {
  id: 'incursean307',
  name: ['Nave incurseana', 'Incursean ship', 'Nave incurseana', 'Incursean gemisi'],
  zone: SPACE134,
  ...incurseanOrbit,
  level: 225,
  range: '225–240',
  brief: [
    'Derrota cuatro incurseanos en una ronda y reclama un nivel. Cada enemigo tiene 400 000 HP y causa 2 900 de daño. Tope: 240.',
    'Defeat four Incurseans in one round and claim one level. Each enemy has 400,000 HP and deals 2,900 damage. Cap: 240.',
    'Derrote quatro Incurseanos em uma rodada e receba um nível. Cada inimigo tem 400.000 HP e causa 2.900 de dano. Limite: 240.',
    'Bir turda dört Incursean yen ve bir seviye kazan. Her düşmanın 400.000 canı vardır ve 2.900 hasar verir. Sınır: 240.'
  ]
};
missions161.push(incurseanGuide);

const previousIncurseanTarget = target80;
target80 = function (...args) {
  if (player.guide78 === incurseanGuide.id && inSpace134()) {
    return { ...incurseanOrbit, label: incurseanTitle(), manual: true };
  }
  return previousIncurseanTarget(...args);
};

const previousIncurseanDetails = npcDetails78;
npcDetails78 = function (id) {
  if (id !== incurseanGuide.id) return previousIncurseanDetails(id);
  const actions = [[L219('Activar flecha', 'Enable arrow', 'Ativar seta', 'Oku aç'), () => {
    player.guide78 = id;
    routeCache80 = null;
    persistGame();
    closeDialog();
    hud();
  }]];
  if (incurseanMission.available(player)) actions.push([
    L219('Ir a la nave', 'Travel to the ship', 'Viajar à nave', 'Gemiye git'),
    boardIncurseanShip
  ]);
  actions.push([L219('Volver', 'Back', 'Voltar', 'Geri'), guideNPC78]);
  showDialog(incurseanTitle(), '225–240', '<p data-no-i18n>' + L219(...incurseanGuide.brief) + '</p>', actions);
};

const incurseanNotified = new WeakSet();
const previousIncurseanUpdate = update;
update = function (dt, ...args) {
  const result = previousIncurseanUpdate(dt, ...args);
  if (started && !paused && !cinematic && !dialogOpen &&
      incurseanMission.available(player) && !incurseanNotified.has(player)) {
    incurseanNotified.add(player);
    toast(incurseanTitle() + ' · 225–240');
  }
  return result;
};
