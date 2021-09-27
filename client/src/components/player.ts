import { Sandbox, Screen } from '../sandbox';
import { Movement } from '../models/movement';
import { Sprite } from 'spritez';
import { Position } from '../models/position';

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
      show: true,
      drawImage: {
        width: 40,
        height: 50
      },
      position: {
        x: 310,
        y: 310
      },
      defaultAnimation: 'stand_left',
      animations: {
        'stand_left': {
          startFrame: 0,
          maxFrames: 0,
          framesToChangeSprite: 3,
          image: {
            src: '/assets/walking.png',
            width: 96,
            height: 132
          }
        },
        'stand_right': {
          startFrame: 0,
          maxFrames: 0,
          framesToChangeSprite: 3,
          image: {
            src: '/assets/walking_flipped.png',
            width: 96,
            height: 132
          }
        },
        'walk_left': {
          startFrame: 1,
          maxFrames: 24,
          framesToChangeSprite: 3,
          image: {
            src: '/assets/walking.png',
            width: 96,
            height: 132
          }
        },
        'walk_right': {
          startFrame: 1,
          maxFrames: 24,
          framesToChangeSprite: 3,
          image: {
            src: '/assets/walking_flipped.png',
            width: 96,
            height: 132
          }
        }
      }
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
    this.sandbox.mediator.subscribe('movement-key-was-pressed', this, this.changeSprite);
    this.sandbox.mediator.subscribe('movement-key-was-released', this, this.resetSprite);
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

  move(movement: Movement): void {
    (this.movementHandlers[movement] || (() => { }))();
    this.sandbox.mediator.publish('movement-was-made', new Position(this.x, this.y));
  }

  private getCurrentAnimationNameDirection(): string {
    return this.sprite.currentAnimationName.substring(this.sprite.currentAnimationName.indexOf('_'));
  }

  changeSprite(movement: Movement): void {
    if (movement === Movement.Left) {
      this.sprite.changeAnimation('walk_left');
    }

    if (movement === Movement.Right) {
      this.sprite.changeAnimation('walk_right');
    }

    if ([Movement.Up, Movement.Down].indexOf(movement) > -1) {
      this.sprite.changeAnimation(`walk${this.getCurrentAnimationNameDirection()}`);
    }
  }

  resetSprite(): void {
    if (!this.sandbox.controllers.anyMovementButtonIsPressed) {
      this.sprite.changeAnimation(`stand${this.getCurrentAnimationNameDirection()}`);
    }
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

  update(screen: Screen): void {
    // TODO: Replace ifs later using Movement enum and dictionary
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

    this.sprite.changePosition({ x: screen.displayX, y: screen.displayY });
    this.sprite.update(screen.context)

    if (this.sandbox.debug) {
      screen.fillText(`x: ${this.sandbox.gameState.currentLocalPlayerPosition.x}, y: ${this.sandbox.gameState.currentLocalPlayerPosition.y}`, screen.displayX, screen.displayY + 70);
      screen.fillText(`Sx: ${screen.displayX}, Sy: ${screen.displayY}`, screen.displayX, screen.displayY + 90);
    }
  }
}
