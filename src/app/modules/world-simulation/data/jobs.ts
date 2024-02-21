import { Job, JobType } from '../models/jobs';
import { ResourceType } from '../models/resources';

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

export const JOBS: Job[] = [
  new Job(JobType.Farmer, 1, 100, 1),
  new Job(JobType.Lumberjack, 1, 100, 1),
  new Job(JobType.Miner, 1, 100, 1),
  new Job(JobType.Blacksmith, 1, 100, 1),
  new Job(JobType.CraftsMan, 1, 100, 1),
  new Job(JobType.Alchemist, 1, 100, 1),
  new Job(JobType.Merchant, 1, 100, 1),
  new Job(JobType.Cook, 1, 100, 1),
];
