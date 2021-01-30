export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getDistance(targetPosition: Position): number {
    return Math.hypot(this.x - targetPosition.x, this.y - targetPosition.y);
  }
}
