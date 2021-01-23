import io from 'socket.io';

import HttpServer from './httpServer';
import Mediator from './base/mediator';

export default class Network {
  socket: io.Server;
  mediator: Mediator;

  constructor(httpServer: HttpServer, mediator: Mediator) {
    this.socket = new io(httpServer.server, {
      origins: '*:*',
      pingInterval: 3000
    });
    this.mediator = mediator;
  }

  start(): void {
    const mapName = 'first-map';
    this.socket.on('connection', (playerSocket) => {
      playerSocket.join(mapName, () => this.mediator.publish('player-joined', playerSocket));
      this.registerPlayerEvents(playerSocket);
    });
  }

  async getAllClientsIds(): Promise<string> {
    const executor = (resolve, reject) => {
      this.socket.clients((error, allClientsIds) => {
        if (error) {
          console.error('Failed to fetch all clients from socket');
          return console.error(error);
        }

        resolve(allClientsIds);
      });
    };

    return new Promise<string>(executor);
  }

  registerPlayerEvents(playerSocket: io.Socket): void {
    playerSocket.on('player-started', (playerName) => this.mediator.publish('player-started', playerSocket, playerName));
    playerSocket.on('movement-was-made', (position) => this.mediator.publish('player-moved', playerSocket, position));
    playerSocket.on('disconnect', () => this.mediator.publish('player-disconnected', playerSocket));
  }

  publishTo(destinationSocket: io.Socket, event: string, data: any): Network {
    this.socket.to(destinationSocket.id).emit(event, data);
    return this;
  }

  playerPublishTo(playerSocket: io.Socket, roomName: string, event: string, data: any): Network {
    playerSocket.to(roomName).emit(event, data);
    return this;
  }
}
