import { Logger } from './adapters/logger';
import { Randomizer } from './adapters/randomizer';
import { Mediator } from './mediator';
import { Network } from './adapters/network';
import { Screen } from './adapters/screen';
import { GameState } from './gameState';
import { Controllers } from './adapters/controllers';

export { Screen };

export class Sandbox {
  debug: boolean;
  logger: Logger;
  randomizer: Randomizer;
  mediator: Mediator;
  network: Network;
  screen: Screen;
  gameState: GameState;
  controllers: Controllers;

  constructor() {
    this.debug = false;
    this.mediator = new Mediator(this);
    this.screen = new Screen(this.mediator);
    this.logger = new Logger();
    this.randomizer = new Randomizer();
    this.network = new Network(this);
    this.gameState = new GameState(this);
    this.controllers = new Controllers(this);
  }
}
