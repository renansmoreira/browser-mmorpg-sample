import { Sandbox } from '../sandbox';
import { Key } from '../models/key';
import { Movement } from '../models/movement';

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

  private _inputHandlers: { [key: string]: Function } = {
    'Up': (isPressed: boolean): boolean => this.upIsPressed = isPressed,
    'Down': (isPressed: boolean): boolean => this.downIsPressed = isPressed,
    'Left': (isPressed: boolean): boolean => this.leftIsPressed = isPressed,
    'Right': (isPressed: boolean): boolean => this.rightIsPressed = isPressed,
    'Target': (): void => this.sandbox.mediator.publish('target-key-was-pressed', Movement.Target),
    'Attack': (): void => this.sandbox.mediator.publish('attack-key-was-pressed', Movement.Attack)
  };

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;

    document.addEventListener('keydown', (event) => {
      this.processInput(inputs[event.keyCode]);
    });

    document.addEventListener('keyup', (event) => {
      this.removeInput(inputs[event.keyCode]);
    });
  }

  private getInputHandler(movement: Movement): Function {
    const defaultFunction: Function = (): boolean => false;
    return this._inputHandlers[Movement[movement]] || defaultFunction;
  }

  private removeInput(movement: Movement): void {
    if (movement) {
      this.getInputHandler(movement).apply(this, [false]);
      this.anyMovementButtonIsPressed = false;
      this.sandbox.mediator.publish('movement-key-was-released', movement);
    }
  }

  private processInput(movement: Movement): void {
    if (movement) {
      this.getInputHandler(movement).apply(this, [true]);
      this.anyMovementButtonIsPressed = true;
      this.sandbox.mediator.publish('movement-key-was-pressed', movement);
    }
  }
}
