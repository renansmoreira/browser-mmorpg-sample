import { Sandbox } from './sandbox';
import { Position } from './position';
import { Screen } from './screen';

export class SpawnedMonster {
  id: string;
  sandbox: Sandbox;
  position: Position;
  originalPosition: Position;
  distanceFromPlayer: number;
  width: number;
  height: number;
  color: string;

  constructor(sandbox: Sandbox, spawnedMonsterInfo: any) {
    this.id = spawnedMonsterInfo.id;
    this.sandbox = sandbox;
    this.originalPosition = new Position(spawnedMonsterInfo.position.x, spawnedMonsterInfo.position.y);
    this.width = this.height = 20;
    this.color = 'purple';

    this.sandbox.mediator.subscribe('update', this, this.update);
    this.sandbox.mediator.subscribe('player-started', this, this.changePosition);
    this.sandbox.mediator.subscribe('movement-was-made', this, this.changePosition);
    this.sandbox.mediator.subscribe('monster-was-targeted', this, this.changeSelection);
  }

  changePosition(playerPosition: Position) {
    this.position = new Position(this.originalPosition.x - playerPosition.x,
      this.originalPosition.y - playerPosition.y);
    this.distanceFromPlayer = this.position.getDistance(playerPosition);
  }

  changeSelection(selectedMonsterId: string): void {
    this.color = 'purple';

    if (selectedMonsterId === this.id)
      this.color = 'red';
  }

  update(screen: Screen): void {
    screen.fillStyle(this.color);
    screen.fillRect(screen.displayX + this.position.x, screen.displayY + this.position.y, this.width, this.height);
  }
}
