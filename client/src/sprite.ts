import { Sandbox } from './sandbox';
import { Screen } from './screen';

export class Sprite {
  frameNumber: number;
  actualFrameCount: number;
  framesPerSprite: number;
  frameLimit: number;
  spriteImage: HTMLImageElement;
  spriteImageFlipped: HTMLImageElement;
  wasMoving: boolean = false;
  sandbox: Sandbox;
  stop: boolean;

  constructor(spritePath: string) {
    this.frameNumber = 0;
    this.actualFrameCount = 0;
    this.framesPerSprite = 3;
    this.frameLimit = 0;
    this.spriteImage = new Image();
    this.spriteImage.src = spritePath;
    this.spriteImageFlipped = new Image();
    this.spriteImageFlipped.src = '/assets/walking_flipped.png';
    this.stop = true;
  }

  update(screen: Screen, sandbox: Sandbox): void {
    if (!this.sandbox) {
      this.sandbox = sandbox;
    }

    if (this.wasMoving !== this.sandbox.controllers.anyMovementButtonIsPressed) {
      this.wasMoving = this.sandbox.controllers.anyMovementButtonIsPressed;
      this.frameLimit = this.sandbox.controllers.anyMovementButtonIsPressed ? 24 : 0;
      this.actualFrameCount = 0;
      this.frameNumber = 0;
      this.stop = this.sandbox.controllers.anyMovementButtonIsPressed === false;
    }

    if (!this.stop) {
      this.actualFrameCount += 1;

      if (this.actualFrameCount === this.framesPerSprite) {
        this.actualFrameCount = 0;

        if (this.frameNumber < this.frameLimit) {
          this.frameNumber += 1;
        }
        else {
          this.frameNumber = 1;
        }
      }
    }

    const frameClip: number = 96;
    const image: HTMLImageElement = this.sandbox.controllers.leftIsPressed
      ? this.spriteImage
      : this.spriteImageFlipped;
    screen.canvasContext.drawImage(image, this.frameNumber * frameClip, 0, frameClip, 132, screen.displayX, screen.displayY, 40, 50);
  }
}
