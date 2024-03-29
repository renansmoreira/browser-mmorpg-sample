export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getDistance(targetPosition: Position): number {
    return Math.sqrt(
      Math.pow(this.x - targetPosition.x, 2) +
      Math.pow(this.y - targetPosition.y, 2)
    );
  }
}
