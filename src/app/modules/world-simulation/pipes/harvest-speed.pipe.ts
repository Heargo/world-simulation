import { Pipe, PipeTransform } from '@angular/core';
import { Resource } from '../models/resources';
import { PlayerService } from '../services/player.service';

@Pipe({
  name: 'harvestSpeed',
})
export class HarvestSpeed implements PipeTransform {
  constructor(private readonly playerService: PlayerService) {}
  //job level is used to re-trigger the pipe when the job level change
  transform(value: Resource, jobLevel: number): string {
    let job = this.playerService.player.getJobForResource(value)!;
    return job.getHarvestingSpeed(value) + 'ms';
  }
}
