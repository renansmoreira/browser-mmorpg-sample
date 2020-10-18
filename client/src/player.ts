import { Sandbox } from './sandbox';
import { Screen } from './screen';
import { Movement } from './movement';

export class Player {
  sandbox: Sandbox;
  id: string;
  name: string;
  width: number;
  heigth: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  movementHandlers: Record<Movement, Function> = {};

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;
    this.name = new Date().getTime().toString();
    this.width = this.heigth = 10;
    this.speed = 10;
    this.color = 'black';

    this.registerMovementHandlers();
    this.sandbox.mediator.subscribe('server:joined', this, this.configure);
  }

  configure(joiningInfo: any): void {
    this.id = joiningInfo.id;
    this.x = joiningInfo.position.x;
    this.y = joiningInfo.position.y;

    this.sandbox.mediator.publish('player-started', { x: this.x, y: this.y });
    this.sandbox.network.send('player-started', this.name);
    this.sandbox.mediator.subscribe('movement-key-was-pressed', this, this.move);
    this.sandbox.mediator.subscribe('update', this, this.update);
  }

  registerMovementHandlers(): void {
    this.movementHandlers[Movement.Up] = () => this.y -= 1 * this.speed;
    this.movementHandlers[Movement.Down] = () => this.y += 1 * this.speed;
    this.movementHandlers[Movement.Left] = () => this.x -= 1 * this.speed;
    this.movementHandlers[Movement.Right] = () => this.x += 1 * this.speed;
  }

  update(screen: Screen): void {
    screen.fillStyle(this.color);
    screen.fillRect(screen.displayX, screen.displayY, this.width, this.heigth);
  }

  move(movement: Movement): void {
    (this.movementHandlers[movement] || (() => {}))();

    this.sandbox.mediator.publish('movement-was-made', {
      x: this.x,
      y: this.y
    });
  }
}
