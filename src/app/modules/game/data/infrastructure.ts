import { Infrastructure, InfrastructureType } from '../models/infrastructures';
import { JobType } from '../models/jobs';

export const INFRASTRUCTURES_STATS: { [key: string]: Infrastructure } = {
  walls: new Infrastructure({
    name: 'Walls',
    icon: 'walls',
    type: InfrastructureType.Walls,
    initialBuildingCost: { coin: 50, wood: 50 },
    maintenanceFactor: 0.01,
    production: { military: 100 },
  }),
  port: new Infrastructure({
    name: 'Port',
    icon: 'port',
    type: InfrastructureType.Port,
    initialBuildingCost: { coin: 100, wood: 200 },
    maintenanceFactor: 0.01,
    production: {},
  }),
  citadel: new Infrastructure({
    name: 'Citadel',
    icon: 'citadel',
    type: InfrastructureType.Citadel,
    initialBuildingCost: { coin: 100000, wood: 1000, stone: 500 },
    maintenanceFactor: 0.1,
    production: {},
  }),
  plaza: new Infrastructure({
    name: 'Plaza',
    icon: 'plaza',
    type: InfrastructureType.Plaza,
    initialBuildingCost: { coin: 300, wood: 300, stone: 50 },
    maintenanceFactor: 0.02,
    production: {},
  }),
  shanty: new Infrastructure({
    name: 'Shanty',
    icon: 'shanty',
    type: InfrastructureType.Shanty,
    buildingCost: { coin: 10, wood: 10 },
    maintenanceFactor: 0.01,
    production: {},
  }),
  temple: new Infrastructure({
    name: 'Temple',
    icon: 'temple',
    type: InfrastructureType.Temple,
    initialBuildingCost: { coin: 100000, wood: 100, stone: 100 },
    maintenanceFactor: 0.05,
    production: {},
  }),
  smithy: new Infrastructure({
    name: 'Smithy',
    icon: 'smithy',
    type: InfrastructureType.Job,
    initialBuildingCost: { coin: 100, wood: 100, stone: 100, iron: 100 },
    maintenanceFactor: 0.05,
    production: {},
    relatedJobs: [JobType.Blacksmith],
  }),
};

export const DEFAULT_INFRASTRUCTURES: Infrastructure[] = [
  INFRASTRUCTURES_STATS['smithy'],
];
