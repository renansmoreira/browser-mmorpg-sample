export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getDistance(position: Position): number {
    return Math.hypot(this.x - position.x, this.y - position.y);
  }
}
