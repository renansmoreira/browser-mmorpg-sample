import Mediator from './base/mediator';
import HttpServer from './httpServer';
import Network from './network';
import PlayerCollection from './ports-and-adapters/playerCollection';
import NearbyEnvironmentService from './ports-and-adapters/nearbyEnvironmentService';
import MapCollection from './ports-and-adapters/mapCollection';
import PlayerEventHandler from './event-handlers/playerEventHandler';
import { ExperienceService } from './services/experienceService';

class DependencyInjectionContainer {
  cache: Record<string, any>;
  
  constructor() {
    this.cache = {};
  }

  get(wantedType: T): T {
    if (this.cache[wantedType.name]) {
      console.log(`Got ${wantedType.name} from cache`);
      return this.cache[wantedType.name];
    }

    const instance = (factories[wantedType.name] || emptyFactory(wantedType))();
    this.cache[wantedType.name] = instance;

    return instance;
  }
}

const diContainer = new DependencyInjectionContainer();
const factories = {
  'Mediator': () => new Mediator(),
  'HttpServer': () => new HttpServer(),
  'Network': () => new Network(diContainer.get(HttpServer), diContainer.get(Mediator)),
  'PlayerCollection': () => new PlayerCollection(),
  'NearbyEnvironmentService': () => new NearbyEnvironmentService(diContainer.get(Network)),
  'MapCollection': () => new MapCollection(),
  'ExperienceService': () => new ExperienceService(),
  'PlayerEventHandler': () => new PlayerEventHandler(diContainer.get(Network), diContainer.get(PlayerCollection),
    diContainer.get(NearbyEnvironmentService), diContainer.get(MapCollection), diContainer.get(ExperienceService))
};

const emptyFactory = (wantedType: any) =>
  () => console.warn(`Type ${wantedType.name} has no factory defined`);

export default diContainer;
