export interface ResourceData {
  name: string;
  type: ResourceType;
  value: number;
  spaceUsed?: number;
  quantity?: number;
  harvestRequiredResources?: { [key: string]: number };
  passive?: boolean;
  unlockLevel?: number;
}

export class Resource {
  name: string;
  icon: string;
  type: ResourceType;
  value: number;
  spaceUsed: number;
  quantity: number;
  modificatedAvailabililtyFactor?: ResourceAvailablilty[] = [];
  harvestTime?: number = 1;
  harvestRequiredResources?: { [key: string]: number } = {};
  passive: boolean = false;
  unlockLevel: number;

  constructor(data: ResourceData) {
    this.name = data.name;
    this.icon = data.name.toLowerCase().split(' ').join('-');
    this.type = data.type;
    if (data.value) this.value = data.value;
    else this.value = 1;

    if (data.spaceUsed) this.spaceUsed = data.spaceUsed;
    else this.spaceUsed = 1;

    if (data.quantity) this.quantity = data.quantity;
    else this.quantity = 1;

    if (data.harvestRequiredResources)
      this.harvestRequiredResources = data.harvestRequiredResources;
    else this.harvestRequiredResources = {};

    if (data.passive) this.passive = data.passive;
    else this.passive = false;

    if (data.unlockLevel) this.unlockLevel = data.unlockLevel;
    else this.unlockLevel = 0;
  }

  static fromJSON(data: Object) {
    return new Resource(data as ResourceData);
  }
}

/**
 * Names are the the list of string included in biome names that will modify the quantity of the resource.
 * quantityFactor is the factor that will be applied to the quantity of the resource.
 */
export interface ResourceAvailablilty {
  names: string[];
  quantityFactor: number;
}

export enum ResourceType {
  Currency = 'Currency',
  CookingIngredient = 'CookingIngredient',
  CraftingIngredient = 'CraftingIngredient',
  AlchemyIngredient = 'AlchemyIngredient',
  SmithingIngredient = 'SmithingIngredient',
  Food = 'Food',
  Mining = 'Mining',
  Woodcutting = 'Woodcutting',
  Fishing = 'Fishing',
  Hunting = 'Hunting',
  Farming = 'Farming',
  Construction = 'Construction',
  Effect = 'Effect',
}

/**
 * Represents the size of a resource. Size is used to calculate the space used in a vehicle or a building inventory.
 * Size is a mix between the weight and the volume of the resource.
 */
export enum ResourceSize {
  Unit = 1,
  Small = 5,
  Medium = 10,
  Big = 100,
}
