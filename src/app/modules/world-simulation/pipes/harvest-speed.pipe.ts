import { Pipe, PipeTransform } from '@angular/core';
import { Vehicle } from '../models/vehicule';
import { WorldService } from '../services/world.service';
import { Job } from '../models/jobs';
import { Resource } from '../models/resources';

@Pipe({
  name: 'harvestSpeed',
})
export class HarvestSpeed implements PipeTransform {
  constructor(private readonly worldService: WorldService) {}

  transform(value: Job, resource: Resource): string {
    return value.getHarvestingSpeed(resource) + 'ms';
  }
}
