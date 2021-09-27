import { Sandbox, Screen } from './sandbox';

export class Hud {
  sandbox: Sandbox;
  currentExperience: number;
  currentLevel: number = 0;
  experienceForPreviousLevel: number;
  experienceToNextLevel: number;
  width: number;
  height: number;
  borderSize: number;

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox;
    this.width = 240;
    this.height = 5;
    this.borderSize = 1;

    this.sandbox.mediator.subscribe('server:joined', this, this.configure);
    this.sandbox.mediator.subscribe('server:experience-acquired', this, this.configureExperienceBar);
    this.sandbox.mediator.subscribe('update', this, this.update);
  }

  configure(joiningInfo: any): void {
    this.configureExperienceBar(joiningInfo.level);
  }

  configureExperienceBar(level: any): void {
    this.currentExperience = level.currentExperience;
    this.currentLevel = level.currentLevel;
    this.experienceForPreviousLevel = level.experienceForPreviousLevel;
    this.experienceToNextLevel = level.experienceToNextLevel;
  }

  update(screen: Screen): void {
    const positionX = 10;
    const positionY = 10;
    const hundred = this.experienceToNextLevel - this.experienceForPreviousLevel;
    const currentProportion = (this.currentExperience - this.experienceForPreviousLevel) * 100 / hundred;
    const currentLifeBarWidth = this.width * currentProportion / 100;

    screen.fillStyle('black');
    screen.fillRect(positionX - this.borderSize, positionY - this.borderSize, this.width + this.borderSize * 2, this.height + this.borderSize * 2);

    screen.fillStyle('yellow');
    screen.fillRect(positionX, positionY, currentLifeBarWidth, this.height);

    screen.font('15px arial');
    screen.fontColor('black');
    screen.fillText(`Lvl.: ${this.currentLevel}`, 10, 35);
  }
}
