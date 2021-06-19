import { Sandbox } from './sandbox';
import { Sprite } from './sprite';
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
  sprite: Sprite;
  lifebar: Lifebar;
  wasKilled: boolean;

  constructor(sandbox: Sandbox, spawnedMonsterInfo: any) {
    this.id = spawnedMonsterInfo.id;
    this.sandbox = sandbox;
    this.position = this.originalPosition =
      new Position(spawnedMonsterInfo.position.x, spawnedMonsterInfo.position.y);
    this.sprite = new Sprite({
      framesPerSprite: 3,
      path: '/assets/ghoul_right.png',
      flippedPath: '/assets/ghoul_left.png',
      bindToPlayerMovements: true,
      imageWidth: 31,
      imageHeight: 24,
      drawWidth: 50,
      drawHeight: 40,
      stoppedAnimate: true
    });
    this.lifebar = new Lifebar(sandbox, {
      referencePosition: this.position,
      maxValue: spawnedMonsterInfo.monster.hp,
      currentValue: spawnedMonsterInfo.currentHp,
      height: 5,
      borderSize: 1
    });
    this.wasKilled = false;
    this.changePosition();

    this.sandbox.mediator.subscribe('update', this, this.update);
    this.sandbox.mediator.subscribe('player-started', this, this.changePosition);
    this.sandbox.mediator.subscribe('movement-was-made', this, this.changePosition);
    this.sandbox.mediator.subscribe('monster-was-targeted', this, this.changeSelection);
    this.sandbox.mediator.subscribe('server:monster-attacked', this, this.processDamageReceived);
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
    // TODO: Decide later how to mark a selected target
  }

  processDamageReceived(damageDealt: any): void {
    if (this.id !== damageDealt.spawnedMonster.id) {
      return;
    }

    this.wasKilled = damageDealt.spawnedMonster.wasKilled;
    this.lifebar.changeCurrentValue(damageDealt.spawnedMonster.currentHp);
  }

  update(screen: Screen): void {
    if (this.wasKilled) {
      // TODO: Play death animation
      return;
    }

    const finalX = screen.displayX + (this.position.x);
    const finalY = screen.displayY + (this.position.y);

    if (this.sandbox.debug) {
      screen.fillText(`d: ${this.distanceFromPlayer.toString()}`, finalX, finalY + 40);
      screen.fillText(`x: ${this.position.x}, y: ${this.position.y}`, finalX, finalY + 55);
      screen.fillText(`Sx: ${finalX}, Sy: ${finalY}`, finalX, finalY + 75);
    }

    this.sprite.update(screen, new Position(
      finalX, finalY), this.sandbox);
    this.lifebar.update(screen, finalX, finalY);
  }
}
