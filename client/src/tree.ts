import { Sandbox } from './sandbox';
import { Position } from './position';
import { Screen } from './screen';
import { Sprite } from './sprite';

export class Tree {
  sandbox: Sandbox;
  position: Position;
  originalPosition: Position;
  sprite: Sprite;

  constructor(sandbox: Sandbox, treeInfo: any) {
    this.sandbox = sandbox;
    this.position = this.originalPosition = new Position(treeInfo.x, treeInfo.y);
    this.sprite = new Sprite({
      path: '/assets/cedar.png',
      bindToPlayerMovements: false,
      imageWidth: 32,
      imageHeight: 32,
      drawWidth: 90,
      drawHeight: 120
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
    this.sprite.update(screen, new Position(
      screen.displayX + this.position.x,
      screen.displayY + this.position.y
    ), this.sandbox);
  }
}
