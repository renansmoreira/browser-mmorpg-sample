import { Sandbox } from './sandbox';
import { Movement } from './movement';

export class Player {
  sandbox: Sandbox;
  name: string;
  width: number;
  heigth: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  isReadOnly: boolean;
  movementHandlers: Record<Movement, Function> = {};

  constructor(sandbox: Sandbox, playerInfo?: any, isReadOnly?: boolean) {
    this.sandbox = sandbox;
    this.name = new Date().getTime().toString();
    this.width = this.heigth = 10;
    this.speed = 10;
    this.color = 'black';
    this.isReadOnly = isReadOnly;

    if (!isReadOnly) {
      this.registerMovementHandlers();
      this.sandbox.mediator.subscribe('server:joined', this, this.start);
    }
    else {
      this.start(playerInfo);
    }
  }

  start(joiningInfo: any): void {
    this.x = joiningInfo.position.x;
    this.y = joiningInfo.position.y;

    this.sandbox.mediator.subscribe('update', this, this.update);

    if (!this.isReadOnly) {
      this.sandbox.network.send('player-started', this.name);
      this.sandbox.mediator.subscribe('movement-key-was-pressed', this, this.move);
    }
  }

  registerMovementHandlers(): void {
    this.movementHandlers[Movement.Up] = () => this.y -= 1 * this.speed;
    this.movementHandlers[Movement.Down] = () => this.y += 1 * this.speed;
    this.movementHandlers[Movement.Left] = () => this.x -= 1 * this.speed;
    this.movementHandlers[Movement.Right] = () => this.x += 1 * this.speed;
  }

  changePosition(position: any): void {
    this.x = position.x;
    this.y = position.y;
  }

  remove(): void {
    this.sandbox.mediator.unsubscribe(this);
  }

  update(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.heigth);
  }

  move(movement: Movement): void {
    (this.movementHandlers[movement] || (() => {}))();
    this.sandbox.mediator.publish('movement-was-made', { x: this.x, y: this.y });
  }
}
