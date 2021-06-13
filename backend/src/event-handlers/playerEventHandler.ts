import io from 'socket.io';

import EventHandler from './eventHandler';
import Network from '../network';
import Mediator from '../base/mediator';

import Player from '../models/player';
import Monster from '../models/monster';
import DamageDealt from '../models/damageDealt';
import NearbyEnvironment from '../models/nearbyEnvironment';
import PlayerCollection from '../ports-and-adapters/playerCollection';
import NearbyEnvironmentService from '../ports-and-adapters/nearbyEnvironmentService';
import MapCollection from '../ports-and-adapters/mapCollection';

export default class PlayerEventHandler implements EventHandler {
  network: Network;
  playerCollection: PlayerCollection;
  nearbyEnvironmentService: NearbyEnvironmentService;
  mapCollection: MapCollection;

  constructor(network: Network,
    playerCollection: PlayerCollection,
    nearbyEnvironmentService: NearbyEnvironmentService,
    mapCollection: MapCollection) {
    this.network = network;
    this.playerCollection = playerCollection;
    this.nearbyEnvironmentService = nearbyEnvironmentService;
    this.mapCollection = mapCollection;
  }

  async fetchStarterInformation(playerSocket: io.Socket): void {
    const player: Player = await this.playerCollection.get(playerSocket.id);

    // TODO: Maybe I need to create a collection for current player data, moving
    // logic to fetch player last saved state away from logic to fetch player current,
    // and maybe not saved yet, state
    await this.playerCollection.add(player);

    this.network.publishTo(playerSocket, 'joined', player);
  }

  async fetchPlayerMap(playerSocket: io.Socket): void {
    const player: Player = await this.playerCollection.get(playerSocket.id);
    // TODO: Dynamically get map name instead of a fixed one
    const plot: Plot = await this.mapCollection.get('first-map');

    this.network.publishTo(playerSocket, 'map', plot.getClientDefinition());
  }

  // TODO: Remove and add players to fetchNearbyEnvironment event handler
  async fetchOthersPlayers(playerSocket: io.Socket): void {
    const othersPlayers: Player[] = await this.nearbyEnvironmentService.fetchAnotherPlayers(playerSocket);
    this.network.publishTo(playerSocket, 'map-players', othersPlayers);
  }

  async fetchNearbyEnvironment(playerSocket: io.Socket): void {
    const nearbyEnvironment: NearbyEnvironment = await this.nearbyEnvironmentService.getFor(playerSocket);

    this.network.publishTo(playerSocket, 'map-players', nearbyEnvironment.players);
    this.network.publishTo(playerSocket, 'nearby-environment', nearbyEnvironment);
  }
  
  async notifyAboutNewPlayerJoined(playerSocket: io.Socket): void {
    const player: Player = await this.playerCollection.get(playerSocket.id);
    // TODO: Dynamically get the map location instead of a fixed one
    this.network.playerPublishTo(playerSocket, 'first-map', 'new-player-joined', player);
  }

  async registerPlayerInfo(playerSocket: io.Socket, playerName: string): void {
    await this.playerCollection.updateName(playerSocket.id, playerName);
  }

  async processMovement(playerSocket: io.Socket, position: any): void {
    const player: Player = await this.playerCollection.get(playerSocket.id);
    await this.playerCollection.updatePosition(playerSocket.id, position);
    this.network.playerPublishTo(playerSocket, 'first-map', 'player-moved', player);
  }

  async processMonsterAttack(playerSocket: io.Socket, monsterId: string): void {
    // TODO: Add attack validations, like position consistency, map, etc.
    const player: Player = await this.playerCollection.get(playerSocket.id);
    const spawnedMonster: SpawnedMonster = await this.nearbyEnvironmentService.getMonster(monsterId);
    const damageDealt: DamageDealt = player.attack(spawnedMonster);

    if (spawnedMonster.wasKilled) {
      await this.nearbyEnvironmentService.removeMonster(monsterId);
    }

    this.network.publishToEveryone('first-map', 'monster-attacked', damageDealt);
  }

  async removePlayerInfo(playerSocket: io.Socket): void {
    const player: Player = await this.playerCollection.get(playerSocket.id);
    await this.playerCollection.remove(playerSocket.id);
    this.network.playerPublishTo(playerSocket, 'first-map', 'player-disconnected', player);
  }

  registerEvents(mediator: Mediator): void {
    mediator.subscribe('player-joined', this, this.fetchStarterInformation);
    mediator.subscribe('player-joined', this, this.fetchPlayerMap);
    mediator.subscribe('player-joined', this, this.fetchOthersPlayers);
    mediator.subscribe('player-joined', this, this.fetchNearbyEnvironment);
    mediator.subscribe('player-joined', this, this.notifyAboutNewPlayerJoined);

    mediator.subscribe('player-started', this, this.registerPlayerInfo);
    mediator.subscribe('player-moved', this, this.processMovement);
    mediator.subscribe('player-attacked', this, this.processMonsterAttack);
    mediator.subscribe('player-disconnected', this, this.removePlayerInfo);
  }
}
