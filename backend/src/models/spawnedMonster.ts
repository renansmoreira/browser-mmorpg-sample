import { v4 } from 'uuid';

import Monster from './monster';
import Position from './position';
import DamageDealt from './damageDealt';

export default class SpawnedMonster {
  id: string;
  monster: Monster;
  currentHp: number;
  position: Position;
  
  constructor(monster: Monster, currentHp: number, position: Position) {
    this.id = v4();
    this.monster = monster;
    this.currentHp = currentHp;
    this.position = position;
  }

  receive(playerAttack: PlayerAttack): DamageDealt {
    const previousHp = this.currentHp;
    this.currentHp = this.currentHp - playerAttack.damage;
    return new DamageDealt(this, previousHp - this.currentHp);
  }
}
