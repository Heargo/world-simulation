import { JOBS } from '../data/jobs';
import { Inventory } from './inventory';
import { Job, JobType } from './jobs';
import { Resource } from './resources';

export interface PlayerEtat {
  isInTransit: boolean;
  timeLeftInTransit?: number;
  destinationBurgId?: number;
  currentHarvest?: Resource;
  currentJobActive?: JobType;
}

export class Player {
  inventory: Inventory;
  etat: PlayerEtat;
  jobs: Job[];

  constructor(
    inventory: Inventory = new Inventory(),
    jobs: Job[] = JOBS,
    etat: PlayerEtat = { isInTransit: false }
  ) {
    this.inventory = inventory;
    this.etat = etat;
    this.jobs = jobs;
  }

  startTransit(destinationBurgId: number, timeLeftInTransit: number): void {
    this.etat.isInTransit = true;
    this.etat.timeLeftInTransit = timeLeftInTransit;
    this.etat.destinationBurgId = destinationBurgId;
  }

  setHarvestState(resource: Resource): void {
    this.etat.currentHarvest = resource;
    this.etat.currentJobActive = this.getJobForResource(resource)?.type;
  }

  stopTransit(): void {
    this.etat.isInTransit = false;
    this.etat.timeLeftInTransit = 0;
    this.etat.destinationBurgId = undefined;
  }

  getJob(job: JobType): Job | undefined {
    return this.jobs.find(j => j.type === job);
  }

  getJobForResource(resource: Resource): Job | undefined {
    return this.jobs.find(j => j.canHarvestResource(resource));
  }

  gainExperienceFromHarvesting(resource: Resource, quantity: number): void {
    let job = this.getJobForResource(resource);
    if (job) {
      let xp = job?.getExperienceGainedFromResourceHarvesting(resource);
      job.gainExp(xp * quantity);
    }
  }

  canHarvestResource(resource: Resource): boolean {
    let jobOk = this.jobs.some(j => j.canHarvestResource(resource));
    let playerHasResources = this.inventory.hasResources(
      resource.harvestRequiredResources
    );
    return jobOk && playerHasResources;
  }
}
