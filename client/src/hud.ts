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
    this.width = 200;
    this.height = 5;
    this.borderSize = 1;

    this.sandbox.mediator.subscribe('update', this, this.update);
  }

  update(screen: Screen): void {
    const spawnFinalX = 30;
    const spawnFinalY = screen.height - 10;

    const finalX = spawnFinalX - 20;
    const finalY = spawnFinalY - 10;
    const currentProportion = this.currentValue * 100 / this.maxValue;
    const lifeBarWidth = this.width + 40;
    const currentLifeBarWidth = lifeBarWidth * currentProportion / 100;

    screen.fillStyle('black');
    screen.fillRect(finalX - this.borderSize, finalY - this.borderSize, this.width + 40 + this.borderSize * 2, this.height + this.borderSize * 2);

    screen.fillStyle('yellow');
    screen.fillRect(finalX, finalY, currentLifeBarWidth, this.height);
  }
}
