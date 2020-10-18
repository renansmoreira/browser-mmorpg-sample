import { Logger } from './logger';
import { Randomizer } from './randomizer';
import { Mediator } from './mediator';
import { Network } from './network';
import { Screen } from './screen';
import { GameState } from './gameState';

export class Sandbox {
  logger: Logger;
  randomizer: Randomizer;
  mediator: Mediator;
  network: Network;
  screen: Screen;
  gameState: GameState;

  constructor() {
    this.mediator = new Mediator(this);
    this.screen = new Screen(this.mediator);
    this.logger = new Logger();
    this.randomizer = new Randomizer();
    this.network = new Network(this);
    this.gameState = new GameState(this);
  }
}
