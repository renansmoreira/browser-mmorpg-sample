import { Sandbox } from './sandbox';
import { Key } from './key';
import { Movement } from './movement';

const inputs: Record<string, Movement> = {};
inputs[Key.W.toString()] = Movement.Up;
inputs[Key.S.toString()] = Movement.Down;
inputs[Key.A.toString()] = Movement.Left;
inputs[Key.D.toString()] = Movement.Right;
inputs[Key.J.toString()] = Movement.Attack;
inputs[Key.K.toString()] = Movement.Interact;

export class Controllers {
  sandbox: Sandbox;

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;
  }

  configureListener(): void {
    document.addEventListener('keypress', (event) => {
      this.processInput(inputs[event.keyCode]);
    });
  }

  private processInput(movement: Movement): void {
    if (movement) {
      this.sandbox.mediator.publish('movement-key-was-pressed', movement);
    }
  }
}
