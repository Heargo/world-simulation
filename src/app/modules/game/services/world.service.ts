import { Injectable } from '@angular/core';
import { BiomesData, State, World } from '../models/world';
import { DiplomacyEnum } from '../models/world-raw';
import { TransportationGrid } from '../models/transportation-grid';
import { Burg } from '../models/burg';

@Injectable({
  providedIn: 'root',
})
export class WorldService {
  world!: World;
  ground_grid!: TransportationGrid;
  sea_grid!: TransportationGrid;
  currentBurg!: Burg;

  load(
    world: World,
    ground: TransportationGrid,
    sea: TransportationGrid,
    currentBurg?: Burg
  ): void {
    this.world = world;
    this.ground_grid = ground;
    this.sea_grid = sea;
    if (currentBurg) {
      this.currentBurg = currentBurg;
    }
  }

  setCurrentBurg(burg: Burg): void {
    this.currentBurg = burg;
  }

  getBurgByName(name: string): Burg | undefined {
    return this.world.mapData.burgs.find(b => b.name === name);
  }

  getBurgById(id: number): Burg | undefined {
    return this.world.mapData.burgs.find(b => b.id === id);
  }

  getBurgBiome(burg: Burg): BiomesData {
    return this.world.biomesData[this.world.mapData.cells[burg.cell!].biome];
  }

  getBurgState(burg: Burg): State {
    return this.world.mapData.states[burg.state!];
  }

  getBurgsByAttractivity(burgId: number): {
    burgs: Burg[];
    attractivity: number[];
  } {
    let burg = this.getBurgById(burgId)!;
    let otherBurgs = [...this.world.mapData.burgs.filter(b => b.id !== burgId)];
    let relativeAttractivity: number[] = [];
    //order by attractivity
    otherBurgs.sort((a, b) => {
      let diplomacyA =
        this.world.mapData.states[burg.state!].diplomacy[a.state!];
      let diplomacyB =
        this.world.mapData.states[burg.state!].diplomacy[b.state!];

      let distanceA = this.ground_grid.getDistanceBetweenTwoBurgs(
        burgId,
        a.id!
      );
      let distanceB = this.ground_grid.getDistanceBetweenTwoBurgs(
        burgId,
        b.id!
      );
      return (
        burg!.getRelativeAttractivity(
          diplomacyB as DiplomacyEnum,
          distanceB,
          burg.state === b.state
        ) -
        burg!.getRelativeAttractivity(
          diplomacyA as DiplomacyEnum,
          distanceA,
          burg.state === a.state
        )
      );
    });

    for (let otherBurg of otherBurgs) {
      let diplomacy =
        this.world.mapData.states[burg.state!].diplomacy[otherBurg.state!];
      let distance = this.ground_grid.getDistanceBetweenTwoBurgs(
        burgId,
        otherBurg.id!
      );
      relativeAttractivity.push(
        burg.getRelativeAttractivity(
          diplomacy as DiplomacyEnum,
          distance,
          burg.state === otherBurg.state
        )
      );
    }

    return { burgs: otherBurgs, attractivity: relativeAttractivity };
  }
}
