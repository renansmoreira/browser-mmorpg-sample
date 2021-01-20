import Position from './position';

export default class Player {
  id: string;
  position: Position;
  name: string;

  constructor(id: string, position: Position) {
    this.id = id;
    this.position = position;
  }

  changeName(newName: string): void {
    this.name = newName;
  }

  changePosition(newPosition: Position): void {
    this.position = newPosition;
  }
}
