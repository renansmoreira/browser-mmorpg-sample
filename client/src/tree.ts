import { Sandbox } from './sandbox';
import { Position } from './position';
import { Screen } from './screen';

export class Tree {
  sandbox: Sandbox;
  position: Position;
  originalPosition: Position;
  width: number;
  height: number;
  color: string;

  constructor(sandbox: Sandbox, treeInfo: any) {
    this.sandbox = sandbox;
    this.position = this.originalPosition = new Position(treeInfo.x, treeInfo.y);
    this.width = this.height = 20;
    this.color = 'green';

    this.sandbox.mediator.subscribe('update', this, this.update);
    this.sandbox.mediator.subscribe('player-started', this, this.changePosition);
    this.sandbox.mediator.subscribe('movement-was-made', this, this.changePosition);
  }

  changePosition(playerPosition: any) {
    this.position = new Position(this.originalPosition.x - playerPosition.x,
      this.originalPosition.y - playerPosition.y);
  }

  update(screen: Screen): void {
    screen.fillStyle(this.color);
    screen.fillRect(screen.displayX + this.position.x, screen.displayY + this.position.y, this.width, this.height);
  }
}
