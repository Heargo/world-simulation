import { Job, JobType } from '../models/jobs';

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
