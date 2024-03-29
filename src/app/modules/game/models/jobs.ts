import { JOB_RELATED_RESOURCES } from '../data/jobs';
import { Resource } from './resources';

export enum JobType {
  Farmer = 'farmer',
  Lumberjack = 'lumberjack',
  Miner = 'miner',
  Blacksmith = 'blacksmith',
  CraftsMan = 'craftsman',
  Alchemist = 'alchemist',
  Merchant = 'merchant',
  Cook = 'cook',
}

export class Job {
  static JOB_ID = 0;

  type: JobType;
  currentLevel: number;
  maxLevel: number;
  currentExperience: number;
  nextLevelExperience: number;
  maxHarvestingValue: number;

  constructor(
    type: JobType,
    currentLevel: number,
    maxLevel: number,
    maxHarvestingValue: number,
    currentExperience?: number,
    nextLevelExperience?: number
  ) {
    this.type = type;
    this.currentLevel = currentLevel;
    this.maxLevel = maxLevel;
    this.maxHarvestingValue = maxHarvestingValue;

    if (currentExperience) this.currentExperience = currentExperience;
    else this.currentExperience = 0;

    if (nextLevelExperience) this.nextLevelExperience = nextLevelExperience;
    else this.nextLevelExperience = this.calculateExperienceToNextLevel();
  }

  levelUp() {
    if (this.currentLevel < this.maxLevel) {
      this.currentLevel++;
      this.currentExperience = 0;
      this.nextLevelExperience = this.calculateExperienceToNextLevel();
      this.maxHarvestingValue += this.currentLevel;
    }
  }

  gainExp(experience: number) {
    if (this.currentLevel === this.maxLevel) return;
    this.currentExperience += experience;
    let prct = (this.currentExperience / this.nextLevelExperience) * 100;
    if (this.currentExperience >= this.nextLevelExperience) {
      this.levelUp();
    }
  }

  calculateExperienceToNextLevel(): number {
    return this.currentLevel ** 2 * 10;
  }

  canHarvestResource(resource: Resource): boolean {
    return JOB_RELATED_RESOURCES[this.type].includes(resource.type);
  }

  getExperienceGainedFromResourceHarvesting(resource: Resource): number {
    if (this.canHarvestResource(resource)) {
      return resource.value;
    }
    return 0;
  }

  getHarvestingSpeed(resource: Resource): number {
    if (JOB_RELATED_RESOURCES[this.type].includes(resource.type)) {
      // Bonus apply only if the resource as a value lower than 90 % maxHarvestingValue or 1
      // This is to avoid avoid bonus on new unlocked resources
      if (resource.value <= Math.max(this.maxHarvestingValue * 0.9, 1)) {
        //linear interpolation between minBoost and maxBoost based on the level of the job
        let minLevel = 1;
        let minBoost = 1;
        let maxBoost = 10;
        let boost =
          ((this.maxLevel - this.currentLevel) / (this.maxLevel - minLevel)) *
            minBoost +
          ((this.currentLevel - minLevel) / (this.maxLevel - minLevel)) *
            maxBoost;

        return 1000 / boost; //return the time in ms to harvest the resource. minimum harvesting time is 100ms
      } else {
        return 1000;
      }
    }
    return 0; //return 0 if the resource is not harvestable by the job
  }
}
