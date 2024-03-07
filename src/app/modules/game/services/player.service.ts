import { Injectable } from '@angular/core';
import { Player } from '../models/player';
import { Resource } from '../models/resources';
import { WorldService } from './world.service';
import { OfflineGain, OfflineJobGain } from '../models/game';
import { Job } from '../models/jobs';
import { ALL_RESOURCES } from '../data/resources';
import { JOBS } from '../data/jobs';

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
    if (resource.harvestRequiredResources && Object.keys(resource.harvestRequiredResources).length > 0){
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

  private estimateTimeToNextLevel(job: Job): number {
    let xpToNextLevel = job.nextLevelExperience - job.currentExperience;
    //look the available resource with the highest xp per second
    const resources = ALL_RESOURCES.filter(
      r => job.canHarvestResource(r) && r.unlockLevel <= job.currentLevel
    );
    resources.sort((a, b) => {
      let xpA = job.getExperienceGainedFromResourceHarvesting(a);
      let xpB = job.getExperienceGainedFromResourceHarvesting(b);
      let harvestingSpeedA = job.getHarvestingSpeed(a);
      let harvestingSpeedB = job.getHarvestingSpeed(b);
      let xpPerMiliSecondA = xpA / harvestingSpeedA;
      let xpPerMiliSecondB = xpB / harvestingSpeedB;
      return xpPerMiliSecondB - xpPerMiliSecondA;
    });
    if (resources.length === 0) {
      return Infinity;
    }
    let bestResource = resources[0];
    let xpPerMiliSecond =
      job.getExperienceGainedFromResourceHarvesting(bestResource) /
      job.getHarvestingSpeed(bestResource);
    return xpToNextLevel / xpPerMiliSecond;
  }

  private estimateTimeToMaxLevel(job: Job,logDetails:boolean=false): number {
    console.group(job.type);
    let totalTime = 0;
    for (let i = job.currentLevel; i < job.maxLevel; i++) {
      let timeToMaxLevel = this.estimateTimeToNextLevel(job);
      if (timeToMaxLevel === Infinity) {
        console.groupEnd();
        return Infinity;
      }
      if(logDetails){
        console.log(
          job.currentLevel,
          '=>',
          job.currentLevel + 1,
          ':',
          Math.floor(timeToMaxLevel / 1000 / 60 / 60),
          'h',
          Math.floor((timeToMaxLevel / 1000 / 60) % 60),
          'min',
          "cumulated time: ",
          Math.floor(totalTime / 1000 / 60 / 60),
          'h',
          Math.floor((totalTime / 1000 / 60) % 60),
          'min',
          Math.floor((totalTime / 1000) % 60),
          's',
          '\nneeded exp:',
          job.nextLevelExperience
          );
        }
      job.gainExp(job.nextLevelExperience);
      totalTime += timeToMaxLevel;
    }
    console.groupEnd();
    return totalTime;
  }

  public levelingEstimations(): void {
    console.group('Leveling estimations');
    for (let job of JOBS) {
      const jobCopy = Job.fromJSON(job);
      let timeToMaxLevel = this.estimateTimeToMaxLevel(jobCopy);
      if( timeToMaxLevel / 1000 / 60 / 60 > 150){
      console.warn(
        `Time to max level for ${jobCopy.type} : ${
          timeToMaxLevel / 1000 / 60 / 60
        } h`
      );
      }else{
        console.log(
          `Time to max level for ${jobCopy.type} : ${
            timeToMaxLevel / 1000 / 60 / 60
          } h`
        );
      }

    }
    console.groupEnd();
  }
}
