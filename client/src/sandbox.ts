import { Logger } from './logger';
import { Randomizer } from './randomizer';
import { Mediator } from './mediator';
import { Network } from './network';
import { Screen } from './screen';
import { GameState } from './gameState';
import { Controllers } from './controllers';

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
