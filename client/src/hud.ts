import { Sandbox } from './sandbox';
import { Screen } from './screen';

export class Hud {
  sandbox: Sandbox;
  currentValue: number;
  maxValue: number;
  width: number;
  height: number;
  borderSize: number;

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;
    this.currentValue = 30;
    this.maxValue = 100;
    this.width = 240;
    this.height = 5;
    this.borderSize = 1;

    this.sandbox.mediator.subscribe('update', this, this.update);
  }

  update(screen: Screen): void {
    const positionX = 10;
    const positionY = 10;
    const currentProportion = this.currentValue * 100 / this.maxValue;
    const currentLifeBarWidth = this.width * currentProportion / 100;

    screen.fillStyle('black');
    screen.fillRect(positionX - this.borderSize, positionY - this.borderSize, this.width + this.borderSize * 2, this.height + this.borderSize * 2);

    screen.fillStyle('yellow');
    screen.fillRect(positionX, positionY, currentLifeBarWidth, this.height);

    screen.font('15px arial');
    screen.fontColor('black');
    screen.fillText(`Lvl.: 1`, 10, 35);
  }
}
