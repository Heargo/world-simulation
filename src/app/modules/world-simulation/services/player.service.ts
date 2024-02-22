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

  harvest(resource: Resource): void {
    // If the player is already harvesting the same resource, or can't harvest it we don't start a new action
    if (this.player.etat.currentHarvest?.name === resource.name) return;
    if (!this.canHarvestResource(resource)) return;

    // If the player is already harvesting a resource, we stop the action
    if (this.resourceHarvest) clearInterval(this.resourceHarvest);

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

    console.log('harvested', resource.name);
    //continue harvesting
    let newSpeed = this.getHarvestingSpeed(resource);
    if (this.canHarvestResource(resource)) {
      this.resourceHarvest = setInterval(() => {
        this.performHarvesting(resource, quantity);
      }, newSpeed);
    }
  }
}
