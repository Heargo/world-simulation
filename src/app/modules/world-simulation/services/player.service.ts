import { Injectable } from '@angular/core';
import { Player } from '../models/player';
import { Resource } from '../models/resources';
import { WorldService } from './world.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  player: Player = new Player();
  resourceHarvest?: any;

  constructor(private readonly worldService: WorldService) {}

  load(player: Player): void {
    this.player = player;
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
      this.player.etat.currentHarvest = undefined;
      this.player.etat.currentJobActive = undefined;
    }
  }

  harvest(resource: Resource): void {
    if (!this.canHarvestResource(resource)) return;
    if (this.player.etat.currentHarvest?.name === resource.name) {
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
