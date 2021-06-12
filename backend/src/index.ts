import Mediator from './base/mediator';
import HttpServer from './httpServer';
import Network from './network';
import PlayerEventHandler from './event-handlers/playerEventHandler';

import diContainer from './dependencyInjectionContainer';

const mediator = diContainer.get(Mediator);
const httpServer = diContainer.get(HttpServer);
const network = diContainer.get(Network);

network.start();
httpServer.start();

diContainer.get(PlayerEventHandler).registerEvents(mediator);
