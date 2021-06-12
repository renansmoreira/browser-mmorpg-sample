import Position from './position';
import SpawnedMonster from './spawnedMonster';
import PlayerAttack from './playerAttack';

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

  attack(spawnedMonster: SpawnedMonster): number {
    const attack: PlayerAttack = new PlayerAttack(10);
    return spawnedMonster.receive(attack);
  }
}
