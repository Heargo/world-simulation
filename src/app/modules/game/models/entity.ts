import { JOBS } from '../data/jobs';
import { Inventory } from './inventory';
import { Job, JobType } from './jobs';
import { Resource } from './resources';

export interface EntityState {
  isInTransit: boolean;
  timeLeftInTransit?: number;
  destinationBurgId?: number;
  currentHarvest?: Resource;
  currentJobActive?: Job;
}

export class Entity {
  state: EntityState;
  inventory: Inventory;
  jobs: Job[];

  constructor(
    inventory: Inventory = new Inventory(),
    jobs: Job[] = JOBS,
    state: EntityState = { isInTransit: false }
  ) {
    this.inventory = inventory;
    this.state = state;
    this.jobs = jobs;
  }

  static fromJSON(data: any) {
    const playerInventory = Inventory.fromJSON(data.inventory);

    const jobs: Job[] = [];
    for (let j of data.jobs) {
      jobs.push(Job.fromJSON(j));
    }

    const state: EntityState = {
      isInTransit: data.state.isInTransit,
      timeLeftInTransit: data.state.timeLeftInTransit,
      destinationBurgId: data.state.destinationBurgId,
      currentHarvest: data.state.currentHarvest
        ? Resource.fromJSON(data.state.currentHarvest)
        : undefined,
      currentJobActive: data.state.currentJobActive
        ? Job.fromJSON(data.state.currentJobActive)
        : undefined,
    };

    return new Entity(playerInventory, jobs, state);
  }

  getState() {
    return this.state;
  }

  getInventory() {
    return this.inventory;
  }

  updateState(newState: Partial<EntityState>) {
    this.state = { ...this.state, ...newState };
  }

  startTransit(destinationBurgId: number, timeLeftInTransit: number): void {
    this.state.isInTransit = true;
    this.state.timeLeftInTransit = timeLeftInTransit;
    this.state.destinationBurgId = destinationBurgId;
  }

  setHarvestState(resource: Resource): void {
    this.state.currentHarvest = resource;
    this.state.currentJobActive = this.getJobForResource(resource);
  }

  stopTransit(): void {
    this.state.isInTransit = false;
    this.state.timeLeftInTransit = 0;
    this.state.destinationBurgId = undefined;
  }

  getJob(jobType: JobType): Job | undefined {
    return this.jobs.find(j => j.type === jobType);
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
