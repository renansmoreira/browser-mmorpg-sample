import { Sandbox } from './sandbox';
import { Position } from './position';
import { Screen } from './screen';
import { Lifebar } from './lifebar';
import { LifebarOptions } from './lifebarOptions';

export class SpawnedMonster {
  id: string;
  sandbox: Sandbox;
  position: Position;
  originalPosition: Position;
  distanceFromPlayer: number;
  width: number;
  height: number;
  color: string;
  lifebar: Lifebar;

  constructor(sandbox: Sandbox, spawnedMonsterInfo: any) {
    this.id = spawnedMonsterInfo.id;
    this.sandbox = sandbox;
    this.position = this.originalPosition =
      new Position(spawnedMonsterInfo.position.x, spawnedMonsterInfo.position.y);
    this.width = this.height = 20;
    this.color = 'purple';
    this.lifebar = new Lifebar(sandbox, {
      referencePosition: this.position,
      maxValue: spawnedMonsterInfo.monster.hp,
      currentValue: spawnedMonsterInfo.currentHp,
      height: 5,
      borderSize: 1
    });
    this.changePosition();

    this.sandbox.mediator.subscribe('update', this, this.update);
    this.sandbox.mediator.subscribe('player-started', this, this.changePosition);
    this.sandbox.mediator.subscribe('movement-was-made', this, this.changePosition);
    this.sandbox.mediator.subscribe('monster-was-targeted', this, this.changeSelection);
    this.sandbox.mediator.subscribe('server:monster-attacked', this, this.processDamageReceived);
  }

  processDamageReceived(damageDealt: any): void {
    if (this.id !== damageDealt.spawnedMonster.id)
    return;

    this.lifebar.changeCurrentValue(damageDealt.spawnedMonster.currentHp);
  }

  changePosition(): void {
    if (!this.sandbox.gameState.currentLocalPlayerPosition)
    return;

    this.position = new Position(
      this.originalPosition.x - this.sandbox.gameState.currentLocalPlayerPosition.x,
      this.originalPosition.y - this.sandbox.gameState.currentLocalPlayerPosition.y);
    const finalX = this.sandbox.screen.displayX + this.position.x;
    const finalY = this.sandbox.screen.displayY + this.position.y;

    this.distanceFromPlayer = this.sandbox.screen.displayCenterPosition.getDistance(
      new Position(finalX, finalY));
    this.lifebar.changePosition(this.position);
  }

  changeSelection(selectedMonsterId: string): void {
    this.color = 'purple';

    if (selectedMonsterId === this.id)
    this.color = 'red';
  }

  update(screen: Screen): void {
    const finalX = screen.displayX + (this.position.x);
    const finalY = screen.displayY + (this.position.y);

    screen.fillStyle(this.color);

    if (this.sandbox.debug) {
      screen.fillText(`d: ${this.distanceFromPlayer.toString()}`, finalX, finalY + 40);
      screen.fillText(`x: ${this.position.x}, y: ${this.position.y}`, finalX, finalY + 55);
      screen.fillText(`Sx: ${finalX}, Sy: ${finalY}`, finalX, finalY + 75);
    }

    screen.fillRect(finalX, finalY, this.width, this.height);

    this.lifebar.update(screen, finalX, finalY);
  }
}
