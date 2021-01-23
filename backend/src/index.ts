import Mediator from './base/mediator';
import HttpServer from './httpServer';
import Network from './network';

import PlayerCollection from './ports-and-adapters/playerCollection';
import NearbyEnvironmentService from './ports-and-adapters/nearbyEnvironmentService';
import MapCollection from './ports-and-adapters/mapCollection';
import PlayerEventHandler from './event-handlers/playerEventHandler';

const mediator = new Mediator();
const httpServer = new HttpServer();
const network = new Network(httpServer, mediator);

network.start();
httpServer.start();

const playerCollection: PlayerCollection = new PlayerCollection();
const nearbyEnviromentService = new NearbyEnvironmentService(network);
const mapCollection: MapCollection = new MapCollection();
new PlayerEventHandler(playerCollection, nearbyEnviromentService, mapCollection).registerEvents(mediator);
