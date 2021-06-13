const baseExperiencePerLevel = 100;

export class Level {
  currentExperience: number;
  experienceForPreviousLevel: number;
  experienceToNextLevel: number;
  currentLevel: number;

  constructor(experience: number) {
    this.currentExperience = experience;
    this.calculateLevel();
  }

  addExperience(newAmount: number): void {
    this.currentExperience += newAmount;
    this.calculateLevel();
  }

  calculateLevel(): void {
    this.currentLevel = Math.ceil(this.currentExperience / baseExperiencePerLevel);

    // TODO: Need to work on a better leveling caps
    this.experienceForPreviousLevel = baseExperiencePerLevel * (this.currentLevel - 1);
    this.experienceToNextLevel = baseExperiencePerLevel * this.currentLevel;
  }
}
