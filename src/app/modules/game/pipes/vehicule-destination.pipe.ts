import { Pipe, PipeTransform } from '@angular/core';
import { Vehicle } from '../models/vehicule';
import { WorldService } from '../services/world.service';

@Pipe({
  name: 'vehiculeDestination',
})
export class VehiculeDestination implements PipeTransform {
  constructor(private readonly worldService: WorldService) {}

  transform(value: Vehicle): string {
    return value.getDestination(this.worldService.currentBurg).name;
  }
}
