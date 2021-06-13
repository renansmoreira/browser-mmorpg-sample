import { Monster } from '../models/monster';

export class ExperienceService {
  constructor() {
  }

  calculateFor(monster: Monster): number {
    // TODO: Add some server-side variant in exp calculation later
    return monster.experience;
  }
}
