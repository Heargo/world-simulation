import { Pipe, PipeTransform } from '@angular/core';
import { Vehicle } from '../models/vehicule';
import { WorldService } from '../services/world.service';
import { Observable, map, timer } from 'rxjs';

@Pipe({
  name: 'vehiculeTimeLeft',
})
export class vehiculeTimeLeft implements PipeTransform {
  constructor(private readonly worldService: WorldService) {}

  transform(value: Vehicle): Observable<string> {
    return timer(0, 1 * 1000).pipe(
      map(() => {
        let timeLeft =
          value.getTimeUntilDeparture(this.worldService.currentBurg) / 1000;
        let formated = '';
        if (timeLeft > 60) {
          formated = `${Math.floor(timeLeft / 60)} min`;
        } else {
          formated = `${Math.floor(timeLeft)} seconds`;
        }
        return formated;
      })
    );
  }
}
