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
    // If the player is already harvesting the same resource, we don't start a new action
    if (this.player.etat.currentHarvest?.name === resource.name) return;

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
    this.player.inventory.add(resource, quantity);
    this.player.gainExperienceFromHarvesting(resource, quantity);
    let newSpeed = this.getHarvestingSpeed(resource);
    console.log('harvest', resource.name);
    this.resourceHarvest = setInterval(() => {
      this.performHarvesting(resource, quantity);
    }, newSpeed);
  }
}
