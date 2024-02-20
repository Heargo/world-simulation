export class Resource {
  name: string;
  icon: string;
  type: ResourceType;
  value: number;
  spaceUsed: number;
  defaultAvailabililtyFactor: number = 1;
  modificatedAvailabililtyFactor?: ResourceAvailablilty[] = [];
  harvestTime?: number = 1;
  harvestRequiredResources?: { [key: string]: number } = {};
  passive: boolean = false;

  constructor(
    name: string,
    type: ResourceType,
    value: number,
    spaceUsed: number,
    defaultAvailabililtyFactor?: number,
    modificatedAvailabililtyFactor?: ResourceAvailablilty[],
    harvestRequiredResources?: { [key: string]: number }
  ) {
    this.name = name;
    this.icon = name.toLowerCase();
    this.type = type;
    this.value = value;
    this.spaceUsed = spaceUsed;
    this.defaultAvailabililtyFactor = 1;
    this.passive = false;
    if (modificatedAvailabililtyFactor) {
      this.modificatedAvailabililtyFactor = modificatedAvailabililtyFactor;
    }
    if (defaultAvailabililtyFactor) {
      this.defaultAvailabililtyFactor = defaultAvailabililtyFactor;
    }
    if (harvestRequiredResources) {
      this.harvestRequiredResources = harvestRequiredResources;
    }
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

const EFFECTS: { [key: string]: Resource } = {
  military: new Resource('Military', ResourceType.Effect, 1, 0, 1),
};

const CURRENCIES: { [key: string]: Resource } = {
  coin: new Resource('Coin', ResourceType.Currency, 1, 1, 1),
};

let biomes = [
  'Marine',
  'Hot desert',
  'Cold desert',
  'Savanna',
  'Grassland',
  'Tropical seasonal forest',
  'Temperate deciduous forest',
  'Tropical rainforest',
  'Temperate rainforest',
  'Taiga',
  'Tundra',
  'Glacier',
  'Wetland',
];

const ResourceTypeAvailability: { [key: string]: ResourceAvailablilty[] } = {
  [ResourceType.Woodcutting]: [
    {
      names: ['forest', 'taiga'],
      quantityFactor: 2,
    },
    {
      names: ['glacier', 'desert', 'tundra', 'marine'],
      quantityFactor: 0,
    },
  ],
  [ResourceType.Mining]: [
    {
      names: ['mountain', 'tundra'],
      quantityFactor: 2,
    },
    {
      names: ['desert', 'marine'],
      quantityFactor: 0,
    },
  ],
  [ResourceType.Fishing]: [
    {
      names: ['marine', 'wetland'],
      quantityFactor: 2,
    },
    {
      names: ['desert', 'tundra', 'glacier'],
      quantityFactor: 0,
    },
  ],
};

export const RAW_RESOURCES: { [key: string]: Resource } = {
  wood: new Resource(
    'Wood',
    ResourceType.Woodcutting,
    1,
    5,
    1,
    ResourceTypeAvailability[ResourceType.Woodcutting]
  ),
  stone: new Resource(
    'Stone',
    ResourceType.Mining,
    1,
    5,
    1,
    ResourceTypeAvailability[ResourceType.Mining]
  ),
  copper: new Resource(
    'Copper',
    ResourceType.Mining,
    1,
    5,
    1,
    ResourceTypeAvailability[ResourceType.Mining]
  ),
};
