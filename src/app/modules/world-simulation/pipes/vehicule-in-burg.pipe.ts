import { Pipe, PipeTransform } from '@angular/core';
import { Vehicle } from '../models/vehicule';
import { Observable, map, timer } from 'rxjs';
import { WorldService } from '../services/world.service';

@Pipe({
  name: 'vehiculeAvailable',
})
export class VehiculeAvailable implements PipeTransform {
  constructor(private readonly worldService: WorldService) {}

  transform(value: Vehicle): Observable<boolean> {
    return timer(0, 1 * 1000).pipe(
      map(() => value.isInBurg(this.worldService.currentBurg))
    );
  }
}
