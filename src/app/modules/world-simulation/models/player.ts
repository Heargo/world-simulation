import { Inventory } from './inventory';
import { Job, JobType } from './jobs';
import { Resource } from './resources';

export interface PlayerEtat {
  isInTransit: boolean;
  timeLeftInTransit?: number;
  destinationBurgId?: number;
}

export class Player {
  inventory: Inventory;
  etat: PlayerEtat;
  jobs: Job[];

  constructor(
    inventory: Inventory = new Inventory(),
    jobs: Job[] = [],
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

  stopTransit(): void {
    this.etat.isInTransit = false;
    this.etat.timeLeftInTransit = 0;
    this.etat.destinationBurgId = undefined;
  }

  getJob(job: JobType): Job | undefined {
    return this.jobs.find(j => j.type === job);
  }

  canHarvestResource(resource: Resource): boolean {
    return this.jobs.some(j => j.canHarvestResource(resource));
  }
}
