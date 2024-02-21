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
