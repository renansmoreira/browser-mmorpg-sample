import { Mediator } from '../mediator';
import { Position } from '../position';

export class Screen {
  mediator: Mediator;
  canvasContext: CanvasRenderingContext2D;

  constructor(mediator: Mediator) {
    this.mediator = mediator;
  }

  configure(canvasContext: CanvasRenderingContext2D): void {
    this.canvasContext = canvasContext;
  }

  update(): void {
    this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width,
      this.canvasContext.canvas.height);
    this.mediator.publish('update', this);
  }

  fillStyle(color: string): void {
    this.canvasContext.fillStyle = color;
  }

  fillRect(x: number, y: number, width: number, height: number): void {
    this.canvasContext.fillRect(x, y, width, height);
  }

  font(fontName: string): void {
    this.canvasContext.font = fontName;
  }
  
  fontColor(color: string): void {
    this.canvasContext.fillStyle = color;
  }

  fillText(text: string, x: number, y: number): void {
    this.canvasContext.fillText(text, x, y);
  }

  strokeStyle(color: string): void {
    this.canvasContext.strokeStyle = color;
  }

  stroke(): void {
    this.canvasContext.stroke();
  }

  get context(): CanvasRenderingContext2D {
    return this.canvasContext;
  }

  get width(): number {
    return this.canvasContext.canvas.width;
  }

  get height(): number {
    return this.canvasContext.canvas.height;
  }

  get displayX(): number {
    return this.width / 2;
  }

  get displayY(): number {
    return this.height / 2;
  }

  get displayCenterPosition(): Position {
    return new Position(this.displayX, this.displayY);
  }
}
