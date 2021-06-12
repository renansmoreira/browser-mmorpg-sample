import io from 'socket.io';
import { v4 } from 'uuid';

import Network from '../network';
import Player from '../models/player';
import Monster from '../models/monster';
import SpawnedMonster from '../models/spawnedMonster';
import Position from '../models/position';
import NearbyEnvironment from '../models/nearbyEnvironment';

export default class NearbyEnvironmentService {
  network: Network;
  spawnedMonsters: SpawnedMonster[];

  constructor(network: Network) {
    this.network = network;

    const monster = new Monster(v4(), 100);
    this.spawnedMonsters = [
      new SpawnedMonster(monster, 100, new Position(120, 300)),
      new SpawnedMonster(monster, 50, new Position(313, 172.5)),
      new SpawnedMonster(monster, 70, new Position(485, 185.5)),
      new SpawnedMonster(monster, 30, new Position(490, 85.5)),
      new SpawnedMonster(monster, 90, new Position(491, 339.5)),
      new SpawnedMonster(monster, 10, new Position(633, 369.5)),
      new SpawnedMonster(monster, 60, new Position(681, 449.5))
    ];
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
      resolve(new NearbyEnvironment(players, this.spawnedMonsters));
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
  async getMonster(spawnedMonsterId: string): Promise<Monster> {
    const executor = (resolve) => {
      const spawnedMonster = this.spawnedMonsters.find(s => s.id === spawnedMonsterId);
      resolve(spawnedMonster);
    };
    return new Promise<Monster>(executor);
  }
}
