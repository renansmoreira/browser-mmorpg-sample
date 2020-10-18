import { Sandbox } from './sandbox';

export class GameState {
  sandbox: Sandbox;
  currentLocalPlayerPosition: any;

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;

    this.sandbox.mediator.subscribe('player-started', this, this.changeLocalPlayerCurrentPosition);
    this.sandbox.mediator.subscribe('movement-was-made', this, this.changeLocalPlayerCurrentPosition);
  }

  changeLocalPlayerCurrentPosition(newPosition: any): void {
    this.currentLocalPlayerPosition = newPosition;
  }
}
