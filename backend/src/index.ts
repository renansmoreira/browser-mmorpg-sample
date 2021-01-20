import HttpServer from './httpServer';
import Network from './network';
import Mediator from './base/mediator';

import PlayerCollection from './ports-and-adapters/playerCollection';
import PlayerEventHandler from './event-handlers/playerEventHandler';

const mediator = new Mediator();
const httpServer = new HttpServer();
const network = new Network(httpServer, mediator);

network.start();
httpServer.start();

const playerCollection: PlayerCollection = new PlayerCollection();
new PlayerEventHandler(playerCollection).registerEvents(mediator);
