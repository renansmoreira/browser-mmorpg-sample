import { Sandbox } from './sandbox';

export class Tree {
  sandbox: Sandbox;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(sandbox: Sandbox, position: any) {
    this.sandbox = sandbox;
    this.x = position.x;
    this.y = position.y;
    this.width = this.height = 20;
    this.color = 'green';

    this.sandbox.mediator.subscribe('update', this, this.update);
  }

  update(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
