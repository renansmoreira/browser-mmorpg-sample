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

  // TODO: Store in some database and not only in memory
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

  // TODO: Change from array to map for better performance
  async getMonster(spawnedMonsterId: string): Promise<SpawnedMonster> {
    const executor = (resolve) => {
      resolve(this.spawnedMonsters.find(s => s.id === spawnedMonsterId));
    };
    return new Promise<SpawnedMonster>(executor);
  }

  async removeMonster(spawnedMonsterId: string): Promise<void> {
    const spawnedMonsterIndex = this.spawnedMonsters
    .findIndex(s => s.id === spawnedMonsterId);

    this.respawnMonster(this.spawnedMonsters[spawnedMonsterIndex]);
    this.spawnedMonsters.splice(spawnedMonsterIndex, 1);

    return Promise.resolve();
  }

  async respawnMonster(spawnedMonster: SpawnedMonster): Promise<void> {
    return Promise.resolve(setTimeout(() => {
      const newSpawnedMonster = new SpawnedMonster(spawnedMonster.monster, 100, spawnedMonster.position);

      this.spawnedMonsters.push(newSpawnedMonster);
      this.network.publishToEveryone('first-map', 'monster-spawned', newSpawnedMonster);
    }, 3000));
  }
}
