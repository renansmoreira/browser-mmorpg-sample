import { Sandbox } from './sandbox';
import { Screen } from './screen';
import { Position } from './position';

export class SpriteConfig {
  framesPerSprite?: number;
  path: string;
  flippedPath?: string;
  bindToPlayerMovements: boolean;
  imageWidth: number;
  imageHeight: number;
  drawWidth: number;
  drawHeight: number;
  stoppedAnimate: boolean = false;
}

export class Sprite {
  frameNumber: number;
  actualFrameCount: number;
  frameLimit: number;
  spriteImage: HTMLImageElement;
  spriteImageFlipped: HTMLImageElement;
  wasMoving: boolean = false;
  sandbox: Sandbox;
  stop: boolean;
  config: SpriteConfig;

  constructor(config: SpriteConfig) {
    this.config = config;
    this.frameNumber = 0;
    this.actualFrameCount = 0;
    this.frameLimit = 0;
    this.spriteImage = new Image();
    this.spriteImage.src = config.path;

    if (config.path.indexOf('cedar') > -1) {
      this.spriteImage.width = 100;
      this.spriteImage.height = 200;
    }

    if (config.flippedPath) {
      this.spriteImageFlipped = new Image();
      this.spriteImageFlipped.src = config.flippedPath;
    }

    this.stop = true;
  }

  update(screen: Screen, position: Position, sandbox: Sandbox): void {
    // TODO: Workaround, sandbox needs to be a constructor dep
    if (!this.sandbox) {
      this.sandbox = sandbox;
    }

    if (this.config.bindToPlayerMovements
      && this.wasMoving !== this.sandbox.controllers.anyMovementButtonIsPressed) {
      this.wasMoving = this.sandbox.controllers.anyMovementButtonIsPressed;
      this.frameLimit = this.sandbox.controllers.anyMovementButtonIsPressed ? 24 : 0;
      this.actualFrameCount = 0;
      this.frameNumber = 0;
      this.stop = this.sandbox.controllers.anyMovementButtonIsPressed === false;
    }

    if (this.config.framesPerSprite && (this.config.stoppedAnimate || !this.stop)) {
      this.actualFrameCount += 1;

      if (this.actualFrameCount === this.config.framesPerSprite) {
        this.actualFrameCount = 0;

        if (this.frameNumber < this.frameLimit) {
          this.frameNumber += 1;
        }
        else {
          this.frameNumber = 1;
        }
      }
    }

    let image: HTMLImageElement;

    if (this.config.bindToPlayerMovements) {
      image = this.sandbox.controllers.leftIsPressed
        ? this.spriteImage
        : this.spriteImageFlipped;
    }
    else {
      image = this.spriteImage;
    }

    screen.canvasContext.drawImage(image,
      this.frameNumber * this.config.imageWidth,
      0,
      this.config.imageWidth,
      this.config.imageHeight,
      position.x,
      position.y,
      this.config.drawWidth,
      this.config.drawHeight);
  }
}
