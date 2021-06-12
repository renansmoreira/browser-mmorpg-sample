import PlayerAttack from './playerAttack';

export default class Monster {
  id: string;
  hp: number;

  constructor(id: string, hp: number) {
    this.id = id;
    this.hp = hp;
  }
}
