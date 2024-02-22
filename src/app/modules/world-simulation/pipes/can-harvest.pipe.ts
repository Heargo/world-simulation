import { Pipe, PipeTransform } from '@angular/core';
import { Resource } from '../models/resources';
import { PlayerService } from '../services/player.service';

@Pipe({
  name: 'canHarvest',
})
export class CanHarvestPipe implements PipeTransform {
  constructor(private readonly playerService: PlayerService) {}

  transform(value: Resource): boolean {
    console.log('resources requirements', value);
    let harvestable = this.playerService.player.canHarvestResource(value);
    console.log('Can harvest', value.name, harvestable ? 'yes' : 'no');
    return harvestable;
  }
}
