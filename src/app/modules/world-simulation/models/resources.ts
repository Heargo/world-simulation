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

  constructor(
    name: string,
    type: ResourceType,
    value: number,
    spaceUsed: number,
    quantity: number = 1,
    harvestRequiredResources: { [key: string]: number } = {}
  ) {
    this.name = name;
    this.icon = name.toLowerCase();
    this.type = type;
    this.value = value;
    this.spaceUsed = spaceUsed;
    this.quantity = quantity;
    this.passive = false;
    this.quantity = quantity;
    this.harvestRequiredResources = harvestRequiredResources;
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
