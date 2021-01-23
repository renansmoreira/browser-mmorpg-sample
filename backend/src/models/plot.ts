import Player from './player';
import Position from './position';

export default class Plot {
  player: Player;
  position: Position;
  environmentObjects: any[];

  constructor(name: string, player: Player) {
    this.name = name;
    this.playerPosition = player.position;
  }

  setEnvironmentObjects(environmentObjects: any[]): void {
    this.environmentObjects = environmentObjects;
  }

  getClientDefinition(): any {
    return {
      px: this.playerPosition.x,
      py: this.playerPosition.y,
      a: this.environmentObjects
    };
  }
}
