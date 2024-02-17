export interface Resource {
  name: string;
  icon: string;
  type: ResourceType;
  value: number;
  spaceUsed: number;
}

export enum ResourceType {
  Currency = 'Currency',
  Food = 'Food',
  CookingIngredient = 'Ingredient',
  CraftingIngredient = 'CraftingIngredient',
  AlchemyIngredient = 'AlchemyIngredient',
  SmithingIngredient = 'SmithingIngredient',
  Mining = 'Mining',
  Woodcutting = 'Woodcutting',
  Fishing = 'Fishing',
  Hunting = 'Hunting',
  Farming = 'Farming',
  Construction = 'Construction',
  Effect = 'Effect',
}

const EFFECTS: { [key: string]: Resource } = {
  military: {
    name: 'Military',
    icon: 'military',
    type: ResourceType.Effect,
    value: 1,
    spaceUsed: 0,
  },
};

const RESOURCES: { [key: string]: Resource } = {
  gold: {
    name: 'Gold',
    icon: 'gold',
    type: ResourceType.Currency,
    value: 10000,
    spaceUsed: 0,
  },
  silver: {
    name: 'Silver',
    icon: 'silver',
    type: ResourceType.Currency,
    value: 100,
    spaceUsed: 0,
  },
  copper: {
    name: 'Copper',
    icon: 'copper',
    type: ResourceType.Currency,
    value: 1,
    spaceUsed: 0,
  },
};