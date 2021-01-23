import io from 'socket.io';

import Network from '../network';
import Player from '../models/player';

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
}
