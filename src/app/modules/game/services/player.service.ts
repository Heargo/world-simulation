import { Injectable } from '@angular/core';
import { Player } from '../models/player';
import { Resource } from '../models/resources';
import { WorldService } from './world.service';
import { OfflineGain, OfflineJobGain } from '../models/game';
import { Job } from '../models/jobs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  player: Player = new Player();
  resourceHarvest?: any;

  constructor(private readonly worldService: WorldService) {}

  load(player: Player): void {
    this.player = player;
    //based on the player's state, we can re-trigger the harvesting
    if (player.etat.currentHarvest) {
      this.harvest(player.etat.currentHarvest, true);
    }
  }

  calculateAndApplyGainsOverTime(
    player: Player,
    savedTime: number
  ): OfflineGain {
    const spanBetweenLastUpdate = Date.now() - savedTime;
    let gains: OfflineGain = {
      resources: [],
      jobs: [],
      timeOffline: spanBetweenLastUpdate,
    };

    //calculate gain over time from player etat
    if (player.etat.currentHarvest) {
      const resource: Resource = player.etat.currentHarvest;
      const job: Job = player.etat.currentJobActive!;
      //time to perform the harvest in ms
      const speed: number = job.getHarvestingSpeed(resource) || 0;
      const quantityFactor: number =
        this.worldService.currentBurg.getResourceHarvestingQuantity(resource);
      const gain = Math.floor((spanBetweenLastUpdate / speed) * quantityFactor);
      gains.resources.push({ resource: resource, quantity: gain });
    }
    //apply the gains to the player
    gains.resources.forEach(gain => {
      this.player.inventory.add(gain.resource, gain.quantity);
      this.player.gainExperienceFromHarvesting(gain.resource, gain.quantity);
    });

    gains.jobs = this.getOfflineJobGains(player);
    return gains;
  }

  private getOfflineJobGains(player: Player): OfflineJobGain[] {
    const jobGains: OfflineJobGain[] = [];
    for (let job of this.player.jobs) {
      const jobGain: OfflineJobGain = {
        job: job.type,
        oldLevel: player.getJob(job.type)!.currentLevel,
        newLevel: job.currentLevel,
      };
      if (jobGain.oldLevel !== jobGain.newLevel) jobGains.push(jobGain);
    }

    return jobGains;
  }

  canHarvestResource(resource: Resource): boolean {
    return this.player.canHarvestResource(resource);
  }

  getHarvestingSpeed(resource: Resource): number {
    let job = this.player.jobs.find(j => j.canHarvestResource(resource));
    if (job) {
      return job.getHarvestingSpeed(resource);
    }
    return 0;
  }

  stopHarvesting(): void {
    if (this.resourceHarvest) {
      clearInterval(this.resourceHarvest);
    }
    this.player.etat.currentJobActive = undefined;
    this.player.etat.currentHarvest = undefined;
  }

  harvest(resource: Resource, forceHarvest: boolean = false): void {
    if (!this.canHarvestResource(resource)) return;
    if (
      this.player.etat.currentHarvest?.name === resource.name &&
      !forceHarvest
    ) {
      this.stopHarvesting();
      return;
    }
    this.stopHarvesting();

    //start harvesting the resource
    this.player.setHarvestState(resource);
    let harvestingSpeedInMs = this.getHarvestingSpeed(resource);

    //find quantity of resource that will be harvested per harvest
    let quantity =
      this.worldService.currentBurg.getResourceHarvestingQuantity(resource);
    if (harvestingSpeedInMs > 0) {
      this.resourceHarvest = setInterval(() => {
        this.performHarvesting(resource, quantity);
      }, harvestingSpeedInMs);
    }
  }

  private performHarvesting(resource: Resource, quantity: number): void {
    clearInterval(this.resourceHarvest);

    //consume the required resources to harvest the resource
    if (resource.harvestRequiredResources) {
      this.player.inventory.removeMultiple(resource.harvestRequiredResources);
    }
    //collect it & gain experience
    this.player.inventory.add(resource, quantity);
    this.player.gainExperienceFromHarvesting(resource, quantity);

    //continue harvesting
    let newSpeed = this.getHarvestingSpeed(resource);
    if (this.canHarvestResource(resource)) {
      this.resourceHarvest = setInterval(() => {
        this.performHarvesting(resource, quantity);
      }, newSpeed);
    }
  }
}
