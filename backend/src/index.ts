import Mediator from './base/mediator';
import HttpServer from './httpServer';
import Network from './network';

import PlayerCollection from './ports-and-adapters/playerCollection';
import NearbyEnvironmentService from './ports-and-adapters/nearbyEnvironmentService';
import MapCollection from './ports-and-adapters/mapCollection';
import PlayerEventHandler from './event-handlers/playerEventHandler';

import diContainer from './dependencyInjectionContainer';

const mediator = diContainer.get(Mediator);
const httpServer = diContainer.get(HttpServer);
const network = diContainer.get(Network);

network.start();
httpServer.start();

const playerCollection: PlayerCollection = diContainer.get(PlayerCollection);
const nearbyEnviromentService = diContainer.get(NearbyEnvironmentService);
const mapCollection: MapCollection = diContainer.get(MapCollection);
diContainer.get(PlayerEventHandler).registerEvents(mediator);
