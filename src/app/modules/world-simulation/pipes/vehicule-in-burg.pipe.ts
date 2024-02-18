import { Pipe, PipeTransform } from '@angular/core';
import { Vehicle } from '../models/vehicule';
import { Observable } from 'rxjs';
import { WorldService } from '../services/world.service';

@Pipe({
  name: 'vehiculeAvailable',
})
export class VehiculeAvailable implements PipeTransform {
  constructor(private readonly worldService: WorldService) {}

  transform(value: Vehicle): Observable<boolean> {
    return new Observable<boolean>(observer => {
      setInterval(() => {
        let isInBurg = value.isInBurg(this.worldService.currentBurg);
        observer.next(isInBurg);
      }, 1000);
    });
  }
}
