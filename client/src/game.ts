import { Sandbox } from './sandbox';

export class Game {
  sandbox: Sandbox;
  framesPerSecond: number;
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;
    this.framesPerSecond = 60;

    // TODO: Move to screen adapter
    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth * 95 / 100;
    this.canvas.height = window.innerHeight * 95 / 100;
    this.canvas.style.border = '1px solid black';
    this.canvasContext = this.canvas.getContext('2d');
  }

  configure(): Game {
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    return this;
  }

  start(): void {
    this.sandbox.screen.configure(this.canvasContext);
    setInterval(() => this.sandbox.screen.update(), 1000 / this.framesPerSecond);
  } 
}
