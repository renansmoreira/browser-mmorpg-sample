import Mediator from '../base/mediator';

export default interface EventHandler {
  registerEvents(mediator: Mediator): void;
}
