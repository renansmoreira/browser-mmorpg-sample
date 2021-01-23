import io from 'socket.io';

import EventHandler from './eventHandler';
import Network from '../network';
import Mediator from '../base/mediator';

import PlayerCollection from '../ports-and-adapters/playerCollection';
import NearbyEnvironmentService from '../ports-and-adapters/nearbyEnvironmentService';
import MapCollection from '../ports-and-adapters/mapCollection';

export default class PlayerEventHandler implements EventHandler {
  playerCollection: PlayerCollection;
  nearbyEnvironmentService: NearbyEnvironmentService;
  mapCollection: MapCollection;

  constructor(playerCollection: PlayerCollection,
    nearbyEnvironmentService: NearbyEnvironmentService,
    mapCollection: MapCollection) {
    this.playerCollection = playerCollection;
    this.nearbyEnvironmentService = nearbyEnvironmentService;
    this.mapCollection = mapCollection;
  }

  async fetchStarterInformation(network: Network, playerSocket: io.Socket): void {
    const player: Player = await this.playerCollection.get(playerSocket.id);

    // TODO: Maybe I need to create a collection for current player data, moving
    // logic to fetch player last saved state away from logic to fetch player current,
    // and maybe not saved yet, state
    await this.playerCollection.add(player);

    network.publishTo(playerSocket, 'joined', player);
  }

  async fetchPlayerMap(network: Network, playerSocket: io.Socket): void {
    const player: Player = await this.playerCollection.get(playerSocket.id);
    // TODO: Dynamically get map name instead of a fixed one
    const plot: Plot = await this.mapCollection.get('first-map', player);

    network.publishTo(playerSocket, 'map', plot.getClientDefinition());
  }

  async fetchNearbyEnvironment(network: Network, playerSocket: io.Socket): void {
    const othersPlayers: Player[] = await this.nearbyEnvironmentService.fetchAnotherPlayers(playerSocket);
    network.publishTo(playerSocket, 'map-players', othersPlayers);
  }
  
  async notifyAboutNewPlayerJoined(network: Network, playerSocket: io.Socket): void {
    const player: Player = await this.playerCollection.get(playerSocket.id);
    // TODO: Dynamically get the map location instead of a fixed one
    network.playerPublishTo(playerSocket, 'first-map', 'new-player-joined', player);
  }

  async registerPlayerInfo(playerSocket: io.Socket, playerName: string): void {
    await this.playerCollection.updateName(playerSocket.id, playerName);
  }

  async processMovement(network: Network, playerSocket: io.Socket, position: any): void {
    const player: Player = await this.playerCollection.get(playerSocket.id);
    await this.playerCollection.updatePosition(playerSocket.id, position);
    network.playerPublishTo(playerSocket, 'first-map', 'player-moved', player);
  }

  async removePlayerInfo(network: Network, playerSocket: io.Socket): void {
    const player: Player = await this.playerCollection.get(playerSocket.id);
    await this.playerCollection.remove(playerSocket.id);
    network.playerPublishTo(playerSocket, 'first-map', 'player-disconnected', player);
  }

  registerEvents(mediator: Mediator): void {
    mediator.subscribe('player-joined', this, this.fetchStarterInformation);
    mediator.subscribe('player-joined', this, this.fetchPlayerMap);
    mediator.subscribe('player-joined', this, this.fetchNearbyEnvironment);
    mediator.subscribe('player-joined', this, this.notifyAboutNewPlayerJoined);

    mediator.subscribe('player-started', this, this.registerPlayerInfo);
    mediator.subscribe('player-moved', this, this.processMovement);
    mediator.subscribe('player-disconnected', this, this.removePlayerInfo);
  }
}
