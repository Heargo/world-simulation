import { Injectable } from '@angular/core';
import { WorldService } from './world.service';
import { Vehicle, VehicleType } from '../models/vehicule';
import { Burg } from '../models/burg';

@Injectable({
  providedIn: 'root',
})
export class TransportService {
  carriages: Vehicle[] = [];
  ships: Vehicle[] = [];
  constructor(private readonly worldService: WorldService) {}

  getName(burg: Burg): string {
    let stateName = this.worldService.world.mapData.states[burg.state!].name;
    return `${stateName.slice(0, 2)}${burg.name.slice(0, 3)}-${
      this.carriages.length + 1
    }`;
  }

  initCarriages(): void {
    let burgs = this.worldService.world.mapData.burgs;

    burgs.forEach(burg => {
      let others = this.worldService.getBurgsByAttractivity(burg.id);
      for (let i = 0; i < others.burgs.length; i++) {
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
        this.carriages.push(carriage);
      }
    });
  }
}
