import { Sandbox } from './sandbox';
import { Screen } from './screen';
import { Movement } from './movement';
import { Sprite } from './sprite';
import { Position } from './position';

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
  sprite: Sprite;
  selectedMonsterId: string;

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;
    this.name = new Date().getTime().toString();
    this.width = this.heigth = 10;
    this.speed = 5;
    this.color = 'black';
    this.sprite = new Sprite({
      framesPerSprite: 3,
      path: '/assets/walking.png',
      flippedPath: '/assets/walking_flipped.png',
      bindToPlayerMovements: true,
      imageWidth: 96,
      imageHeight: 132,
      drawWidth: 40,
      drawHeight: 50
    });

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
    this.sandbox.mediator.subscribe('target-key-was-pressed', this, this.selectNearbyMonster);
    this.sandbox.mediator.subscribe('attack-key-was-pressed', this, this.attackSelectedMonster);
    this.sandbox.mediator.subscribe('update', this, this.update);
  }

  registerMovementHandlers(): void {
    this.movementHandlers[Movement.Up] = () => this.y -= 1 * this.speed;
    this.movementHandlers[Movement.Down] = () => this.y += 1 * this.speed;
    this.movementHandlers[Movement.Left] = () => this.x -= 1 * this.speed;
    this.movementHandlers[Movement.Right] = () => this.x += 1 * this.speed;
  }

  update(screen: Screen): void {
    // TODO: Remove later
    if (this.sandbox.controllers.leftIsPressed) {
      this.move(Movement.Left);
    }

    if (this.sandbox.controllers.rightIsPressed) {
      this.move(Movement.Right);
    }

    if (this.sandbox.controllers.upIsPressed) {
      this.move(Movement.Up);
    }

    if (this.sandbox.controllers.downIsPressed) {
      this.move(Movement.Down);
    }
     
    this.sprite.update(screen, new Position(
      screen.displayX, screen.displayY), this.sandbox);

    if (this.sandbox.debug) {
      screen.fillText(`x: ${this.sandbox.gameState.currentLocalPlayerPosition.x}, y: ${this.sandbox.gameState.currentLocalPlayerPosition.y}`, screen.displayX, screen.displayY + 70);
      screen.fillText(`Sx: ${screen.displayX}, Sy: ${screen.displayY}`, screen.displayX, screen.displayY + 90);
    }
  }

  move(movement: Movement): void {
    (this.movementHandlers[movement] || (() => {}))();

    this.sandbox.mediator.publish('movement-was-made', new Position(this.x, this.y));
  }

  selectNearbyMonster(): void {
    const selectedMonster = this.sandbox.gameState.getNearestMonster(new Position(this.x, this.y));

    if (selectedMonster) {
      this.selectedMonsterId = selectedMonster.id;
      this.sandbox.mediator.publish('monster-was-targeted', this.selectedMonsterId);
    }
    else {
      this.selectedMonsterId = null;
    }
  }

  attackSelectedMonster(): void {
    this.sandbox.mediator.publish('monster-was-attacked', this.selectedMonsterId);
  }
}
