import { Sandbox } from '../sandbox';
import { Key } from '../key';
import { Movement } from '../movement';

const inputs: Record<string, Movement> = {};
inputs[Key.W.toString()] = Movement.Up;
inputs[Key.S.toString()] = Movement.Down;
inputs[Key.A.toString()] = Movement.Left;
inputs[Key.D.toString()] = Movement.Right;
inputs[Key.H.toString()] = Movement.Target;
inputs[Key.J.toString()] = Movement.Attack;
inputs[Key.K.toString()] = Movement.Interact;

export class Controllers {
  sandbox: Sandbox;
  leftIsPressed: boolean = false;
  rightIsPressed: boolean = false;
  upIsPressed: boolean = false;
  downIsPressed: boolean = false;
  anyMovementButtonIsPressed: boolean = false;

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;

    document.addEventListener('keydown', (event) => {
      this.processInput(inputs[event.keyCode]);
    });

    document.addEventListener('keyup', (event) => {
      this.removeInput(inputs[event.keyCode]);
    });
  }

  private removeInput(movement: Movement): void {
    if (movement) {
      if (movement === Movement.Left)
        this.leftIsPressed = false;

      if (movement === Movement.Right)
        this.rightIsPressed = false;

      if (movement === Movement.Up)
        this.upIsPressed = false;

      if (movement === Movement.Down)
        this.downIsPressed = false;

      this.anyMovementButtonIsPressed = false; //this.leftIsPressed === false && this.rightIsPressed === false;
      //console.log('up', this.leftIsPressed, this.rightIsPressed, this.anyMovementButtonIsPressed);
      this.sandbox.mediator.publish('movement-key-was-released', movement);
    }
  }

  private processInput(movement: Movement): void {
    if (movement) {
      if (movement === Movement.Left)
        this.leftIsPressed = true;

      if (movement === Movement.Right)
        this.rightIsPressed = true;

      if (movement === Movement.Up)
        this.upIsPressed = true;

      if (movement === Movement.Down)
        this.downIsPressed = true;

      if (movement === Movement.Target)
        return this.sandbox.mediator.publish('target-key-was-pressed', movement);

      if (movement === Movement.Attack)
        return this.sandbox.mediator.publish('attack-key-was-pressed', movement);

      this.anyMovementButtonIsPressed = true; //this.leftIsPressed || this.rightIsPressed;
      //console.log('down', this.leftIsPressed, this.rightIsPressed, this.anyMovementButtonIsPressed);
      this.sandbox.mediator.publish('movement-key-was-pressed', movement);
    }
  }
}
