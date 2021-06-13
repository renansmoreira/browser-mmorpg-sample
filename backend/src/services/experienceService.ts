import { Monster } from '../models/monster';

export class ExperienceService {
  constructor() {
  }

  calculateFor(monster: Monster): number {
    return 100;
  }
}
