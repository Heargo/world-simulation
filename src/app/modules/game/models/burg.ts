import {
  DEFAULT_INFRASTRUCTURES,
  INFRASTRUCTURES_STATS,
} from '../data/infrastructure';
import { Infrastructure, InfrastructureType } from './infrastructures';
import { JOB_RELATED_RESOURCES, JobType } from './jobs';
import { Resource, ResourceType } from './resources';
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
  //Foreign keys
  id!: number;
  cell?: number;
  state?: number;
  culture?: number;
  feature?: number;
  //Data
  name!: string;
  capital!: boolean;
  x!: number;
  y!: number;
  population!: number;
  cityAttractivity!: number;
  type!: BurgType;
  startingInfrastructure!: Infrastructure[];
  buildedInfrastructure!: Infrastructure[];
  availableResourcesTypes!: ResourceType[];
  availableJobsTypes!: JobType[];
  resourceTypeFactor!: { [key: string]: number };

  constructor(data?: any) {
    if (!data) return;
    this.cell = data.cell;
    this.x = data.x;
    this.y = data.y;
    this.state = data.state;
    this.id = data.id;
    this.culture = data.culture;
    this.name = data.name;
    this.feature = data.feature;
    this.capital = data.capital === 1 ? true : false;
    this.population = data.population * 1000;
    this.type = data.type;
    this.startingInfrastructure = this.generateStartingInfrastructure(data);
    this.buildedInfrastructure = [];
    this.availableResourcesTypes = [];
    this.availableJobsTypes = [];
    this.cityAttractivity = 0;
    this.resourceTypeFactor = {};
  }

  static fromJSON(data: Object) {
    const startingInfrastructure: Infrastructure[] = [];
    if ((data as any).startingInfrastructure) {
      for (const infra of (data as any).startingInfrastructure as any) {
        startingInfrastructure.push(new Infrastructure(infra));
      }
    }
    (data as any).startingInfrastructure = startingInfrastructure;

    const buildedInfrastructure: Infrastructure[] = [];
    if ((data as any).buildedInfrastructure) {
      for (const infra of (data as any).buildedInfrastructure as any) {
        buildedInfrastructure.push(new Infrastructure(infra));
      }
    }
    (data as any).buildedInfrastructure = buildedInfrastructure;

    return Object.assign(new this(), data);
  }

  generateAvailableJobsTypes(): void {
    let availableJobsTypes: JobType[] = [];
    let availableResourcesTypes = this.availableResourcesTypes;
    for (let job in JOB_RELATED_RESOURCES) {
      if (
        availableResourcesTypes.some(resourceType =>
          JOB_RELATED_RESOURCES[job].includes(resourceType)
        )
      ) {
        availableJobsTypes.push(job as JobType);
      }
    }

    const all_available_infras = this.startingInfrastructure!.concat(
      this.buildedInfrastructure!
    );

    for (let infra of all_available_infras) {
      if (infra.type === InfrastructureType.Job) {
        availableJobsTypes = availableJobsTypes.concat(infra.relatedJobs!);
      }
    }
    //filter duplicates
    availableJobsTypes = availableJobsTypes.filter(
      (value, index, self) => self.indexOf(value) === index
    );
    this.availableJobsTypes = availableJobsTypes;
  }

  updateAvailableResourcesTypes() {
    let availableResourcesTypes: ResourceType[] = this.availableResourcesTypes;
    for (let jobType of this.availableJobsTypes) {
      availableResourcesTypes = availableResourcesTypes.concat(
        JOB_RELATED_RESOURCES[jobType]
      );
    }

    //filter duplicates
    availableResourcesTypes = availableResourcesTypes.filter(
      (value, index, self) => self.indexOf(value) === index
    );

    this.availableResourcesTypes = availableResourcesTypes;
  }

  generateStartingInfrastructure(data: any) {
    let infras = ['plaza', 'walls', 'shanty', 'temple', 'citadel', 'port'];
    let startingInfrastructure: Infrastructure[] = [];
    for (const key in data) {
      if (infras.includes(key) && data[key] > 0) {
        let infra = new Infrastructure(INFRASTRUCTURES_STATS[key].json());
        startingInfrastructure.push(this.adaptInfraToCity(infra));
      }
    }

    for (let infra of DEFAULT_INFRASTRUCTURES) {
      startingInfrastructure.push(
        this.adaptInfraToCity(new Infrastructure(infra.json()))
      );
    }

    return startingInfrastructure;
  }

  private adaptInfraToCity(infra: Infrastructure) {
    //TODO: adapt infra to city
    return infra;
  }

  getResourceHarvestingQuantity(resource: Resource) {
    if (this.availableResourcesTypes.includes(resource.type)) {
      let factor = this.resourceTypeFactor[resource.type] ?? 1;
      return resource.quantity * factor;
    }
    return 0;
  }

  getLocalResourceValue(resource: Resource) {
    let factor = this.resourceTypeFactor[resource.type];
    return resource.value / factor;
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
