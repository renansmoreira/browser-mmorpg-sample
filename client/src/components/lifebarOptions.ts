import { Position } from '../models/position';

export class LifebarOptions {
  referencePosition: Position;
  maxValue: number;
  currentValue: number;
  height: number = 5;
  borderSize: number = 1;
}
