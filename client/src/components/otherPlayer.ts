import { Sandbox, Screen } from '../sandbox';
import { Sprite } from 'spritez';

export class OtherPlayer {
  sandbox: Sandbox;
  id: string;
  name: string;
  width: number;
  heigth: number;
  x: number;
  displayX: number;
  y: number;
  displayY: number;
  sprite: Sprite;

  constructor(sandbox: Sandbox, playerInfo: any) {
    this.sandbox = sandbox;
    this.id = playerInfo.id;
    this.name = new Date().getTime().toString();
    this.width = this.heigth = 10;
    this.x = playerInfo.position.x;
    this.y = playerInfo.position.y;
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

    this.sandbox.mediator.subscribe('other-player-moved', this, this.changePosition);
    this.sandbox.mediator.subscribe('other-player-disconnected', this, this.disconnect);
    this.sandbox.mediator.subscribe('movement-was-made', this, this.changePositionBasedOnLocalPlayer);
    this.sandbox.mediator.subscribe('update', this, this.update);
  }

  disconnect(playerInfo: any): void {
    if (playerInfo.id !== this.id) {
      return;
    }

    this.sandbox.mediator.unsubscribe(this);
  }

  changePosition(playerInfo: any): void {
    if (playerInfo.id !== this.id) {
      return;
    }

    this.x = playerInfo.position.x;
    this.y = playerInfo.position.y;
    this.changePositionBasedOnLocalPlayer(this.sandbox.gameState.currentLocalPlayerPosition);
  }

  changePositionBasedOnLocalPlayer(localPlayerCurrentPosition: any): void {
    this.displayX = this.x - localPlayerCurrentPosition.x + this.sandbox.screen.displayX;
    this.displayY = this.y - localPlayerCurrentPosition.y + this.sandbox.screen.displayY;
  }

  update(screen: Screen): void {

    this.sprite.changePosition({ x: this.displayX, y: this.displayY });
    this.sprite.update(screen.context)
  }
}
