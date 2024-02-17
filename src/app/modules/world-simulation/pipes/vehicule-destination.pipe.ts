import { Pipe, PipeTransform } from '@angular/core';
import { Vehicle } from '../models/vehicule';

@Pipe({
  name: 'vehiculeDestination',
})
export class VehiculeDestination implements PipeTransform {
  transform(value: Vehicle): string {
    return value.getDestination().name;
  }
}
