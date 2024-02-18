import { Injectable } from '@angular/core';
import { WorldService } from './world.service';
import { Vehicle, VehicleType } from '../models/vehicule';
import { Burg } from '../models/burg';

@Injectable({
  providedIn: 'root',
})
export class TransportService {
  nbCarriages: number = 0;
  nbShips: number = 0;
  allCarriages: Vehicle[] = [];
  carriages: { [key: number]: Vehicle[] } = [];
  ships: Vehicle[] = [];
  constructor(private readonly worldService: WorldService) {}

  getName(burg: Burg): string {
    let stateName = this.worldService.world.mapData.states[burg.state!].name;
    return `${stateName.slice(0, 2)}${burg.name.slice(0, 3)}-${
      this.nbCarriages + 1
    }`;
  }

  initCarriages(maxPerCity: number = 20): void {
    let burgs = this.worldService.world.mapData.burgs;

    burgs.forEach(burg => {
      let others = this.worldService.getBurgsByAttractivity(burg.id);
      this.carriages[burg.id] = [];
      for (let i = 0; i < Math.min(maxPerCity, others.burgs.length); i++) {
        //if the attractivity is 0, we don't create a carriage
        if (others.attractivity[i] === 0) continue;

        let other = others.burgs[i];
        let path = this.worldService.getPathBetweenBurgs(burg.name, other.name);

        let costPerKm;
        if (others.attractivity[i] >= 1) {
          costPerKm = 1.2;
        } else {
          costPerKm = 0.8;
        }

        let carriage = new Vehicle(
          VehicleType.Carriage,
          this.getName(burg),
          1,
          100,
          costPerKm,
          path
        );
        this.allCarriages.push(carriage);
        this.nbCarriages++;
      }
    });

    burgs.forEach(burg => {
      this.carriages[burg.id] = this.allCarriages.filter(c => {
        return c.goThroughtBurg(burg);
      });
    });
  }

  getCarriagesByBurg(burg: Burg, limit: number = 20): Vehicle[] {
    //filter and sort by near departure
    return (
      this.carriages[burg.id]
        .sort((a, b) => {
          return (
            a.getTimeUntilDepartureFrom(burg) -
            b.getTimeUntilDepartureFrom(burg)
          );
        })
        //   .filter(c => c.isInBurg(burg))
        .slice(0, limit)
    );
  }
}
