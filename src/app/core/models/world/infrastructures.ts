export class Infrastructure {
  static INFRASTRUCTURES_ID = 0;

  id: number;
  name: string;
  icon: string;
  type: InfrastructureType;
  level: number;
  maxLevel?: number;
  quantity: number;
  maxQuantity?: number;
  initialBuildingCost: { [key: string]: number }; //used to calculate the cost of each level
  maintenanceFactor: number; //0-1, used to calculate the maintenance cost of each level
  production: { [key: string]: number }; //used to calculate the production of each level

  constructor(data: any) {
    this.id = Infrastructure.INFRASTRUCTURES_ID++;

    this.name = data.name;
    this.icon = data.icon;
    this.type = data.type;

    //level
    if (data.level) this.level = data.level;
    else this.level = 1;
    //maxLevel
    if (data.maxLevel) this.maxLevel = data.maxLevel;
    else this.maxLevel = 3;
    //quantity
    if (data.quantity) this.quantity = data.quantity;
    else this.quantity = 1;
    //maxQuantity
    if (data.maxQuantity) this.maxQuantity = data.maxQuantity;
    else this.maxQuantity = 1;

    this.initialBuildingCost = data.cost;
    this.maintenanceFactor = data.maintenanceFactor;
    this.production = data.production;
  }

  getBuildingValue(): number {
    //production benefits
    let value = 0;
    for (const key in this.production) {
      value += this.production[key];
    }
    //add initialBuildingCost
    for (const key in this.initialBuildingCost) {
      value += this.initialBuildingCost[key];
    }

    //substract maintenance
    value = value - value * this.maintenanceFactor;
    return value;
  }

  json(): any {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      type: this.type,
      level: this.level,
      maxLevel: this.maxLevel,
      quantity: this.quantity,
      maxQuantity: this.maxQuantity,
      initialBuildingCost: this.initialBuildingCost,
      maintenanceFactor: this.maintenanceFactor,
      production: this.production,
    };
  }
}

export enum InfrastructureType {
  Walls = 'walls',
  Port = 'port',
  Citadel = 'citadel',
  Plaza = 'plaza',
  Shanty = 'shanty',
  Temple = 'temple',
}

export const INFRASTRUCTURES_STATS: { [key: string]: Infrastructure } = {
  walls: new Infrastructure({
    name: 'Walls',
    icon: 'walls',
    type: InfrastructureType.Walls,
    initialBuildingCost: { copper: 50, wood: 50 },
    maintenanceFactor: 0.01,
    production: { military: 100 },
  }),
  port: new Infrastructure({
    name: 'Port',
    icon: 'port',
    type: InfrastructureType.Port,
    initialBuildingCost: { copper: 100, wood: 200 },
    maintenanceFactor: 0.01,
    production: {},
  }),
  citadel: new Infrastructure({
    name: 'Citadel',
    icon: 'citadel',
    type: InfrastructureType.Citadel,
    initialBuildingCost: { gold: 10, wood: 1000, stone: 500 },
    maintenanceFactor: 0.1,
    production: {},
  }),
  plaza: new Infrastructure({
    name: 'Plaza',
    icon: 'plaza',
    type: InfrastructureType.Plaza,
    initialBuildingCost: { silver: 30, wood: 300, stone: 50 },
    maintenanceFactor: 0.02,
    production: {},
  }),
  shanty: new Infrastructure({
    name: 'Shanty',
    icon: 'shanty',
    type: InfrastructureType.Shanty,
    buildingCost: { copper: 10, wood: 10 },
    maintenanceFactor: 0.01,
    production: {},
  }),
  temple: new Infrastructure({
    name: 'Temple',
    icon: 'temple',
    type: InfrastructureType.Temple,
    initialBuildingCost: { gold: 10, wood: 100, stone: 100 },
    maintenanceFactor: 0.05,
    production: {},
  }),
};
