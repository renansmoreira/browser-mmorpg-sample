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
  }

  changeLocalPlayerCurrentPosition(newPosition: any): void {
    this.currentLocalPlayerPosition = newPosition;
  }

  getNearestMonster(position: Position): SpawnedMonster {
    return this.spawnedMonsters.reduce((previous, current) =>
      previous.distanceFromPlayer > current.distanceFromPlayer ? current : previous);
  }
}
