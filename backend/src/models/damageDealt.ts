import SpawnedMonster from './spawnedMonster';

// TODO: Move to a common models package. Current in use for back-end and front-end
export default class DamageDealt {
  spawnedMonster: SpawnedMonster;
  damageReceived: number;

  constructor(spawnedMonster: SpawnedMonster, damageReceived: number) {
    this.spawnedMonster = spawnedMonster;
    this.damageReceived = damageReceived;
  }
}
