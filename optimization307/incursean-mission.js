// Store this record in the same profile as the player's level.
const incurseanMission = {
  minimumLevel: 225,
  maximumLevel: 240,
  enemyHealth: 400000,
  enemyDamage: 2900,
  enemyCount: 4,

  available(player) {
    return Number.isInteger(player.level) && player.level >= this.minimumLevel &&
      player.level < this.maximumLevel;
  },

  accept(player) {
    if (!this.available(player) || player.incurseanMission?.active) return false;
    const previousRun = player.incurseanMission?.run || 0;
    player.incurseanMission = { active: true, run: previousRun + 1, defeated: [], arrival: player.incurseanMission?.arrival };
    return true;
  },

  recordDefeat(player, enemy) {
    const mission = player.incurseanMission;
    if (!mission?.active || !enemy.incursean || enemy.run !== mission.run ||
        enemy.hp > 0 || !Number.isInteger(enemy.slot) || enemy.slot < 0 ||
        enemy.slot >= this.enemyCount || mission.defeated.includes(enemy.slot)) return false;
    mission.defeated.push(enemy.slot);
    return true;
  },

  claim(player) {
    const mission = player.incurseanMission;
    if (!this.available(player) || !mission?.active ||
        ![0, 1, 2, 3].every(slot => mission.defeated.includes(slot))) return false;
    player.level += 1;
    mission.active = false;
    return true;
  }
};

if (typeof module !== 'undefined') module.exports = incurseanMission;
