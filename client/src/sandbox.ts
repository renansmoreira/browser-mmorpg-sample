import { Logger } from './logger';
import { Randomizer } from './randomizer';
import { Mediator } from './mediator';
import { Network } from './network';

export class Sandbox {
  logger: Logger;
  randomizer: Randomizer;
  mediator: Mediator;
  network: Network;

  constructor() {
    this.logger = new Logger();
    this.randomizer = new Randomizer();
    this.mediator = new Mediator(this);
    this.network = new Network(this);
  }
}
