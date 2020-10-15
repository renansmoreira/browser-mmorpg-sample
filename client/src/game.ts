import { Sandbox } from './sandbox';

export class Game {
  sandbox: Sandbox;
  framesPerSecond: number;
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;
    this.framesPerSecond = 20;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.canvas.style.border = '1px solid black';
    this.canvasContext = this.canvas.getContext('2d');
  }

  configure(): Game {
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    return this;
  }

  start(): void {
    setInterval(() => this.update(), 1000 / this.framesPerSecond);
  } 

  update(): void {
    this.canvasContext.clearRect(0, 0, 500, 500);
    this.sandbox.mediator.publish('update', this.canvasContext);
  }
}
