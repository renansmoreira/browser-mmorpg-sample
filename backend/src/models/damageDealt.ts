import SpawnedMonster from './spawnedMonster';

export default class DamageDealt {
  spawnedMonster: SpawnedMonster;
  damageReceived: number;

  constructor(spawnedMonster: SpawnedMonster, damageReceived: number) {
    this.spawnedMonster = spawnedMonster;
    this.damageReceived = damageReceived;
  }
}
