import { Sandbox, Screen } from '../sandbox';
import { Position } from '../models/position';
import { Sprite } from 'spritez';

export class Tree {
  sandbox: Sandbox;
  position: Position;
  originalPosition: Position;
  sprite: Sprite;

  constructor(sandbox: Sandbox, treeInfo: any) {
    this.sandbox = sandbox;
    this.position = this.originalPosition = new Position(treeInfo.x, treeInfo.y);
    this.sprite = new Sprite({
      name: 'Tree',
      show: true,
      drawImage: {
        width: 100,
        height: 100
      },
      position: {
        x: 150,
        y: 150
      },
      defaultAnimation: 'static',
      animations: {
        'static': {
          startFrame: 0,
          maxFrames: 0,
          framesToChangeSprite: 20,
          image: {
            src: '/assets/tree.png',
            width: 48,
            height: 48
          }
        }
      }
    });
    this.changePosition();

    this.sandbox.mediator.subscribe('update', this, this.update);
    this.sandbox.mediator.subscribe('player-started', this, this.changePosition);
    this.sandbox.mediator.subscribe('movement-was-made', this, this.changePosition);
  }

  changePosition() {
    if (!this.sandbox.gameState.currentLocalPlayerPosition)
      return;

    this.position = new Position(
      this.originalPosition.x - this.sandbox.gameState.currentLocalPlayerPosition.x,
      this.originalPosition.y - this.sandbox.gameState.currentLocalPlayerPosition.y);
  }

  update(screen: Screen): void {
    this.sprite.changePosition({
      x: screen.displayX + this.position.x,
      y: screen.displayY + this.position.y
    });
    this.sprite.update(screen.context);
  }
}
