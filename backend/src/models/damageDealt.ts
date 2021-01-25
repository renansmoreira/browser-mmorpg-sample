import Monster from './monster';

export default class DamageDealt {
  monster: Monster;
  damageReceived: number;

  constructor(monster: Monster, damageReceived: number) {
    this.monster = monster;
    this.damageReceived = damageReceived;
  }
}
