import Player from './players';
import SpawnedMonster from './spawnedMonster';

export default class NearbyEnvironment {
  players: Player[];
  spawnedMonsters: SpawnedMonster[];

  constructor(players: Player[], spawnedMonsters: SpawnedMonster[]) {
    this.players = players;
    this.spawnedMonsters = spawnedMonsters;
  }
}
