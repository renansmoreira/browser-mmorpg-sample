import { v4 } from 'uuid';

import Monster from './monster';
import Position from './position';
import DamageDealt from './damageDealt';

export default class SpawnedMonster {
  id: string;
  monster: Monster;
  position: Position;
  currentHp: number;
  wasKilled: boolean;
  
  constructor(monster: Monster, currentHp: number, position: Position) {
    this.id = v4();
    this.monster = monster;
    this.position = position;
    this.currentHp = currentHp;
    this.wasKilled = false;
  }

  receive(playerAttack: PlayerAttack): DamageDealt {
    const previousHp = this.currentHp;
    this.currentHp = this.currentHp - playerAttack.damage;
    this.wasKilled = this.currentHp <= 0;

    return new DamageDealt(this, previousHp - this.currentHp);
  }
}
