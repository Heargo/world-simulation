import { Resource, ResourceType } from './resources';

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

export const JOB_RELATED_RESOURCES: { [key: string]: ResourceType[] } = {
  [JobType.Farmer]: [ResourceType.Farming],
  [JobType.Lumberjack]: [ResourceType.Woodcutting],
  [JobType.Miner]: [ResourceType.Mining],
  [JobType.Blacksmith]: [ResourceType.SmithingIngredient],
  [JobType.CraftsMan]: [
    ResourceType.Construction,
    ResourceType.CraftingIngredient,
  ],
  [JobType.Alchemist]: [ResourceType.AlchemyIngredient],
  [JobType.Merchant]: [ResourceType.Currency],
  [JobType.Cook]: [ResourceType.CookingIngredient, ResourceType.Food],
};

export class Job {
  static JOB_ID = 0;

  id: number;
  type: JobType;
  currentLevel: number;
  maxLevel: number;
  currentExperience: number;
  nextLevelExperience: number;
  maxHarvestingValue: number;

  constructor(
    id: number,
    type: JobType,
    currentLevel: number,
    maxLevel: number,
    maxHarvestingValue: number,
    currentExperience?: number,
    nextLevelExperience?: number
  ) {
    this.id = id;
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
      this.nextLevelExperience = this.calculateExperienceToNextLevel();
      this.maxHarvestingValue += this.currentLevel;
    }
  }

  calculateExperienceToNextLevel(): number {
    return this.currentLevel ** 2 * 100;
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
      // speed boost is between 1 and 10. 1 is the slowest, 10 is the fastest
      // Bonus apply only if the resource as a value lower than 90 % maxHarvestingValue
      // This is to avoid avoid bonus on new unlocked resources
      if (resource.value < this.maxHarvestingValue * 0.9) {
        let boost = (this.currentLevel * 10) / this.maxLevel;

        return 1000 / boost; //return the time in ms to harvest the resource
      }
    }
    return 0; //return 0 if the resource is not harvestable by the job
  }
}
