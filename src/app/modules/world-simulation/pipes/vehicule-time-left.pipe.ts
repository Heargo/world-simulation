import { Pipe, PipeTransform } from '@angular/core';
import { Vehicle } from '../models/vehicule';
import { WorldService } from '../services/world.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'vehiculeTimeLeft',
})
export class vehiculeTimeLeft implements PipeTransform {
  constructor(private readonly worldService: WorldService) {}

  transform(value: Vehicle): Observable<number> {
    // return time left every second
    return new Observable<number>(observer => {
      let interval = setInterval(() => {
        let timeLeft = Math.round(
          value.getTimeUntilDepartureFrom(this.worldService.currentBurg) / 1000
        );
        observer.next(timeLeft);
        if (timeLeft === 0) {
          observer.complete();
          clearInterval(interval);
        }
      }, 1000);
    });
  }
}
