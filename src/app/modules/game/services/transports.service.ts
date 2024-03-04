import { Injectable } from '@angular/core';
import { WorldService } from './world.service';
import { Vehicle, VehicleType } from '../models/vehicule';
import { Burg } from '../models/burg';
import { TransportData } from '../models/game';
import { Path } from '../models/transportation-grid';

@Injectable({
  providedIn: 'root',
})
export class TransportService {
  nbCarriages: number = 0;
  nbShips: number = 0;
  allCarriages: Vehicle[] = [];
  carriages: { [key: number]: Vehicle[] } = {};
  ships: { [key: number]: Vehicle[] } = {};
  constructor(private readonly worldService: WorldService) {}

  load(data: TransportData): void {
    this.nbCarriages = data.nbCarriages;
    this.nbShips = data.nbShips;
    this.carriages = data.carriages;
    this.ships = data.ships;
    console.log('transportService loaded', data, 'this', this);
  }

  save(): TransportData {
    return {
      nbCarriages: this.nbCarriages,
      nbShips: this.nbShips,
      carriages: this.carriages,
      ships: this.ships,
    };
  }

  getName(burg: Burg): string {
    let stateName = this.worldService.world.mapData.states[burg.state!].name;
    return `${stateName.slice(0, 2)}${burg.name.slice(0, 3)}-${
      this.nbCarriages + 1
    }`;
  }

  getPathBetweenBurgs(burgName1: string, burgName2: string): Path | undefined {
    let burg1 = this.worldService.getBurgByName(burgName1);
    let burg2 = this.worldService.getBurgByName(burgName2);
    let path: Path;
    if (burg1 && burg2) {
      let b1 = this.worldService.ground_grid.getNodeClosestTo(burg1.x, burg1.y);
      let b2 = this.worldService.ground_grid.getNodeClosestTo(burg2.x, burg2.y);
      path = this.worldService.ground_grid.shortestPath(b1.id, b2.id);
    }
    return path!;
  }

  initCarriages(maxPerCity: number = 20): void {
    let burgs = this.worldService.world.mapData.burgs;
    let allCarriages: Vehicle[] = [];
    burgs.forEach(burg => {
      let others = this.worldService.getBurgsByAttractivity(burg.id);
      this.carriages[burg.id] = [];
      for (let i = 0; i < Math.min(maxPerCity, others.burgs.length); i++) {
        //if the attractivity is 0, we don't create a carriage
        if (others.attractivity[i] === 0) continue;

        let other = others.burgs[i];
        let path = this.getPathBetweenBurgs(burg.name, other.name);

        let costPerKm;
        if (others.attractivity[i] >= 1) {
          costPerKm = 1.2;
        } else {
          costPerKm = 0.8;
        }

        let carriage = new Vehicle(
          VehicleType.Carriage,
          this.getName(burg),
          0.2,
          100,
          costPerKm,
          path!
        );
        allCarriages.push(carriage);
        this.nbCarriages++;
      }
    });

    burgs.forEach(burg => {
      this.carriages[burg.id] = allCarriages.filter(c => {
        return c.goThroughtBurg(burg);
      });
    });
  }

  getCarriagesByBurg(burg: Burg): Vehicle[] {
    return this.carriages[burg.id].sort((a, b) => {
      let aVal = a.getTimeUntilDeparture(burg);
      let bVal = b.getTimeUntilDeparture(burg);
      return aVal - bVal;
    });
  }
}
