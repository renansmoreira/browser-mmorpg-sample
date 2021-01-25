import PlayerAttack from './playerAttack';
import DamageDealt from './damageDealt';

export default class Monster {
  id: string;
  hp: number;

  constructor(id: string, hp: number) {
    this.id = id;
    this.hp = hp;
  }

  receive(playerAttack: PlayerAttack): DamageDealt {
    const previousHp = this.hp;
    this.hp = this.hp - playerAttack.damage;
    return new DamageDealt(this, previousHp - this.hp);
  }
}
