import { Sandbox, Screen } from '../sandbox';
import { Position } from '../models/position';
import { LifebarOptions } from './lifebarOptions';

export class Lifebar {
  sandbox: Sandbox;
  options: LifebarOptions;
  maxValue: number;
  currentValue: number;
  position: Position;
  originalPosition: Position;
  width: number = 20;
  height: number = 20;

  constructor(sandbox: Sandbox, options: LifebarOptions) {
    this.sandbox = sandbox;
    this.options = options;
    this.currentValue = options.currentValue;
    this.maxValue = options.maxValue;
    this.position = this.originalPosition = options.referencePosition;
  }

  changePosition(position: Position): void {
    this.position = position;
  }

  changeCurrentValue(newValue: number): void {
    this.currentValue = newValue;
  }

  update(screen: Screen, spawnFinalX: number, spawnFinalY: number): void {
    const finalX = spawnFinalX - 20;
    const finalY = spawnFinalY - 10;
    const currentProportion = this.currentValue * 100 / this.maxValue;
    const lifeBarWidth = this.width + 40;
    const currentLifeBarWidth = lifeBarWidth * currentProportion / 100;

    screen.fillStyle('black');
    screen.fillRect(finalX - this.options.borderSize, finalY - this.options.borderSize, this.width + 40 + this.options.borderSize * 2, this.options.height + this.options.borderSize * 2);

    screen.fillStyle('green');
    screen.fillRect(finalX, finalY, currentLifeBarWidth, this.options.height);
  }
}


