import io from 'socket.io';

import EventHandler from './eventHandler';
import Network from '../network';
import Mediator from '../base/mediator';
import PlayerCollection from '../ports-and-adapters/playerCollection';

export default class PlayerEventHandler implements EventHandler {
  constructor(playerCollection: PlayerCollection) {
    this.playerCollection = playerCollection;
  }

  async fetchStarterInformation(network: Network, playerSocket: io.Socket): void {
    const player: Player = await this.playerCollection.get(playerSocket.id);
    
    // TODO: Maybe I need to create a collection for current player data, moving
    // logic to fetch player last saved state away from logic to fetch player current,
    // and maybe not saved yet, state
    await this.playerCollection.add(player);

    // TODO: Move to map collection
    const mapInfo = {
      px: player.position.x,
      py: player.position.y,
      a: [
        { t: 't', x: 5, y: 23 },
        { t: 't', x: 149, y: 212 },
        { t: 't', x: 50, y: 95 },
        { t: 't', x: 123, y: 250 },
        { t: 't', x: 400, y: 20 },
        { t: 't', x: 280, y: 300 },
        { t: 't', x: 319, y: 400 }
      ]
    };

    network
    .publishTo(playerSocket, 'joined', player)
    .publishTo(playerSocket, 'map', mapInfo);
  }

  async registerPlayerInfo(playerSocket: io.Socket, playerName: string): void {
    await this.playerCollection.updateName(playerSocket.id, playerName);
  }

  async processMovement(playerSocket: io.Socket, position: any): void {
    await this.playerCollection.updatePosition(playerSocket.id, position);
  }

  async removePlayerInfo(playerSocket: io.Socket): void {
    await this.playerCollection.remove(playerSocket.id);
    // TODO: Emit disconnection to others map players
  }

  registerEvents(mediator: Mediator): void {
    mediator.subscribe('player-joined', this, this.fetchStarterInformation);
    mediator.subscribe('player-started', this, this.registerPlayerInfo);
    mediator.subscribe('player-moved', this, this.processMovement);
    mediator.subscribe('player-disconnected', this, this.removePlayerInfo);
  }
}
