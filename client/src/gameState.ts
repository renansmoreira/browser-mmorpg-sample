import { Sandbox } from './sandbox';
import { Tree } from './tree';
import { SpawnedMonster } from './spawnedMonster';
import { Position } from './position';

export class GameState {
  sandbox: Sandbox;
  currentLocalPlayerPosition: any;
  trees: Tree[];
  spawnedMonsters: SpawnedMonster[];

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;

    this.sandbox.mediator.subscribe('player-started', this, this.changeLocalPlayerCurrentPosition);
    this.sandbox.mediator.subscribe('movement-was-made', this, this.changeLocalPlayerCurrentPosition);
    this.sandbox.mediator.subscribe('server:monster-attacked', this, this.processMonsterAttack);
  }

  changeLocalPlayerCurrentPosition(newPosition: any): void {
    this.currentLocalPlayerPosition = newPosition;
  }

  getNearestMonster(position: Position): SpawnedMonster {
    // TODO: Return a nullobject when theres no monster
    if (!this.spawnedMonsters.length) {
      return null;
    }

    return this.spawnedMonsters.reduce((previous, current) =>
      previous.distanceFromPlayer > current.distanceFromPlayer ? current : previous);
  }

  processMonsterAttack(damageDealt: any): void {
    if (damageDealt.spawnedMonster.wasKilled) {
      const spawnedMonsterIndex =
        this.spawnedMonsters.findIndex(s => s.id === damageDealt.spawnedMonster.id);
      this.spawnedMonsters.splice(spawnedMonsterIndex, 1);
    }
  }

  addSpawnedMonster(newSpawnedMonster: SpawnedMonster): void {
    this.spawnedMonsters.push(newSpawnedMonster);
  }
}
