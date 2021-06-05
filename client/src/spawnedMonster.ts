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
    this.position = this.originalPosition =
      new Position(spawnedMonsterInfo.position.x, spawnedMonsterInfo.position.y);
    this.width = this.height = 20;
    this.color = 'purple';
    this.changePosition();

    this.sandbox.mediator.subscribe('update', this, this.update);
    this.sandbox.mediator.subscribe('player-started', this, this.changePosition);
    this.sandbox.mediator.subscribe('movement-was-made', this, this.changePosition);
    this.sandbox.mediator.subscribe('monster-was-targeted', this, this.changeSelection);
  }

  changePosition(): void {
    if (!this.sandbox.gameState.currentLocalPlayerPosition)
      return;

    this.position = new Position(
      this.originalPosition.x - this.sandbox.gameState.currentLocalPlayerPosition.x,
      this.originalPosition.y - this.sandbox.gameState.currentLocalPlayerPosition.y);
    this.distanceFromPlayer = this.position.getDistance(
      this.sandbox.gameState.currentLocalPlayerPosition);
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
