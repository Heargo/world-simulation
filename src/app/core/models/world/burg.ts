import { INFRASTRUCTURES_STATS, Infrastructure } from './infrastructures';
import { TransportationGrid } from './transportation-grid';
import { BiomesData, DIPLOMACY_ATTRACTIVITY_FACTOR } from './world';
import { DiplomacyEnum } from './world-raw';

export enum BurgType {
  Generic = 'Generic',
  Highland = 'Highland',
  Hunting = 'Hunting',
  Lake = 'Lake',
  Naval = 'Naval',
  Nomadic = 'Nomadic',
}

export class Burg {
  cell?: number;
  x: number;
  y: number;
  state?: number;
  id?: number;
  culture?: number;
  name?: string;
  feature?: number;
  capital?: number;
  population?: number;
  type?: BurgType;
  startingInfrastructure?: Infrastructure[];
  buildedInfrastructure?: Infrastructure[];
  cityAttractivity?: number;

  constructor(data: any) {
    this.cell = data.cell;
    this.x = data.x;
    this.y = data.y;
    this.state = data.state;
    this.id = data.id;
    this.culture = data.culture;
    this.name = data.name;
    this.feature = data.feature;
    this.capital = data.capital;
    this.population = data.population * 1000;
    this.type = data.type;
    this.startingInfrastructure = this.generateStartingInfrastructure(data);
    this.buildedInfrastructure = [];
  }

  generateStartingInfrastructure(data: any) {
    let infras = ['plaza', 'walls', 'shanty', 'temple', 'citadel', 'port'];
    let startingInfrastructure: Infrastructure[] = [];
    for (const key in data) {
      if (infras.includes(key) && data[key] > 0) {
        let infra = new Infrastructure(INFRASTRUCTURES_STATS[key].json());

        let apdatedInfra: Infrastructure = this.adaptInfraToCity(infra);

        startingInfrastructure.push(apdatedInfra);
      }
    }
    return startingInfrastructure;
  }

  private adaptInfraToCity(infra: Infrastructure) {
    //TODO: adapt infra to city
    return infra;
  }

  updateBurgAttractivity(biome: BiomesData) {
    let infraValue = this.startingInfrastructure!.concat(
      this.buildedInfrastructure!
    ).reduce((acc, infra) => {
      return acc + infra.getBuildingValue();
    }, 0);
    let cityAttractivity =
      (this.population! / 1000 + infraValue + biome.habitability) /
      (biome.cost + 1);
    this.cityAttractivity = cityAttractivity;
  }

  getRelativeAttractivity(
    diplomacy: DiplomacyEnum,
    distance: number,
    sameState: boolean
  ) {
    let attractivity = this.cityAttractivity! / distance;

    //modify based on state relationship
    attractivity =
      attractivity * DIPLOMACY_ATTRACTIVITY_FACTOR[diplomacy as DiplomacyEnum];

    if (sameState) {
      attractivity *= 2; // this is to favor intrastate movement
    }
    return attractivity;
  }
}
