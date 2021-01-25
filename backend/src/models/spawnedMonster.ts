import { v4 } from 'uuid';

import Monster from './monster';
import Position from './position';

export default class SpawnedMonster {
  id: string;
  monster: Monster;
  position: Position;
  
  constructor(monster: Monster, position: Position) {
    this.id = v4();
    this.monster = monster;
    this.position = position;
  }
}
