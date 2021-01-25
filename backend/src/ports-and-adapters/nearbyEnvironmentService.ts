import io from 'socket.io';

import Network from '../network';
import Player from '../models/player';
import Monster from '../models/monster';
import SpawnedMonster from '../models/spawnedMonster';
import Position from '../models/position';
import NearbyEnvironment from '../models/nearbyEnvironment';

export default class NearbyEnvironmentService {
  network: Network;

  constructor(network: Network) {
    this.network = network;
  }

  async fetchAnotherPlayers(playerSocket: io.Socket): Promise<Player[]> {
    const executor = async (resolve, reject) => {
      // TODO: Need to fetch the other player last position, not a fixed one
      const fixedPosition = { x: 120, y: 300 };

      const allClientsIds: string[] = await this.network.getAllClientsIds();
      const players = allClientsIds
        .filter((clientId) => clientId !== playerSocket.id)
        .map((clientId) => new Player(clientId, fixedPosition));

      resolve(players);
    }
    return new Promise<Player[]>(executor);
  }

  async getFor(playerSocket: io.Socket): Promise<NearbyEnvironment> {
    const executor = (resolve) => {
      const players: Player[] = [];
      const monster = new Monster('1', 100);
      const monsters: Monster[] = [
        new SpawnedMonster(monster, new Position(this.getRandomNumber(0, 400), this.getRandomNumber(0, 400))),
        new SpawnedMonster(monster, new Position(this.getRandomNumber(0, 400), this.getRandomNumber(0, 400))),
        new SpawnedMonster(monster, new Position(this.getRandomNumber(0, 400), this.getRandomNumber(0, 400))),
        new SpawnedMonster(monster, new Position(this.getRandomNumber(0, 400), this.getRandomNumber(0, 400))),
        new SpawnedMonster(monster, new Position(this.getRandomNumber(0, 400), this.getRandomNumber(0, 400))),
        new SpawnedMonster(monster, new Position(this.getRandomNumber(0, 400), this.getRandomNumber(0, 400))),
      ];

      resolve(new NearbyEnvironment(players, monsters));
    };
    return new Promise<NearbyEnvironment>(executor);
  }

  getRandomNumber(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // TODO: Pretty sure that I need to have a monster ID and a spawned monster id
  // bcuz I need to hit a spawned one, that will have the same monster id if they are the same
  async getMonster(monsterId: string): Promise<Monster> {
    const executor = (resolve) => {
      resolve(new Monster(monsterId, 100));
    };
    return new Promise<Monster>(executor);
  }
}
