import uuid from 'uuid';

import Player from '../models/player';
import Position from '../models/position';

export default class PlayerCollection {
  // TODO: Not scallable, change it to a database provider
  currentPlayers: Record<string, Player>;

  constructor() {
    this.currentPlayers = {};
  }

  async get(playerId: string): Promise<Player> {
    // TODO: Remove default player later, still need to add player creation step
    const executor = (resolve) => {
      resolve(this.currentPlayers[playerId] || new Player(playerId, { x: 120, y: 300 }));
    };
    return new Promise<Player>(executor);
  }

  async add(player: Player): void {
    this.update(player);
  }

  async update(player: Player): void {
    this.currentPlayers[player.id] = player;
  }

  async updateName(playerId: string, newName: string): void {
    const player: Player = await this.get(playerId);
    player.changeName(newName);

    this.update(player);
  }

  async updatePosition(playerId: string, newPosition: Position): void {
    const player: Player = this.get(playerId);
    player.changePosition(newPosition);

    this.update(player);
  }

  async remove(playerId: string): void {
    delete this.currentPlayers[playerId];
  }
}
