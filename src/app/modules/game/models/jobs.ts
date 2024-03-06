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
  type: JobType;
  currentLevel: number;
  maxLevel: number;
  currentExperience: number;
  nextLevelExperience: number;

  constructor(
    type: JobType,
    currentLevel: number,
    maxLevel: number,
    currentExperience?: number,
    nextLevelExperience?: number
  ) {
    this.type = type;
    this.currentLevel = currentLevel;
    this.maxLevel = maxLevel;

    if (currentExperience) {
      this.currentExperience = currentExperience;
    } else {
      console.log(
        'no current experience setting to 0 instead',
        currentExperience
      );
      this.currentExperience = 0;
    }

    if (nextLevelExperience) {
      this.nextLevelExperience = nextLevelExperience;
    } else {
      console.log(
        'no next level experience setting to calculated value instead',
        nextLevelExperience
      );
      this.nextLevelExperience = this.calculateExperienceToNextLevel();
    }
  }

  static fromJSON(data: any) {
    return new this(
      data.type,
      data.currentLevel,
      data.maxLevel,
      data.currentExperience,
      data.nextLevelExperience
    );
  }

  levelUp() {
    if (this.currentLevel < this.maxLevel) {
      this.currentLevel++;
      this.currentExperience = 0;
      this.nextLevelExperience = this.calculateExperienceToNextLevel();
    }
  }

  gainExp(experience: number) {
    if (this.currentLevel === this.maxLevel) return;
    let expToCap = this.nextLevelExperience - this.currentExperience;
    if (experience >= expToCap) {
      this.levelUp();
      this.gainExp(experience - expToCap);
    } else {
      this.currentExperience += experience;
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
      // This is to avoid avoid bonus on new unlocked resources
      if (resource.unlockLevel < this.currentLevel) {
        //linear interpolation between minBoost and maxBoost based on the level of the job
        let minLevel = resource.unlockLevel; //we use the min level as the unlock level of the resource
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
