import {
  Resource,
  ResourceType,
  ResourceAvailablilty,
} from '../models/resources';

const EFFECTS: { [key: string]: Resource } = {
  military: new Resource({
    name: 'Military',
    type: ResourceType.Currency,
    value: 1,
  }),
};

const CURRENCIES: { [key: string]: Resource } = {
  coin: new Resource({
    name: 'Coin',
    type: ResourceType.Currency,
    value: 1,
  }),
};

export const RESOURCE_TYPE_AVAILABILTY: {
  [key: string]: ResourceAvailablilty[];
} = {
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

export const RAW_RESOURCES: Resource[] = [
  new Resource({
    name: 'Wood',
    type: ResourceType.Woodcutting,
    value: 1,
  }),
  new Resource({
    name: 'Stone',
    type: ResourceType.Mining,
    value: 1,
  }),
  new Resource({
    name: 'Coal',
    type: ResourceType.Mining,
    value: 2,
  }),
  new Resource({
    name: 'Copper',
    type: ResourceType.Mining,
    value: 5,
    unlockLevel: 5,
  }),
  new Resource({
    name: 'Iron',
    type: ResourceType.Mining,
    value: 10,
    unlockLevel: 10,
  }),
  new Resource({
    name: 'Salmon',
    type: ResourceType.Fishing,
    value: 1,
  }),
  new Resource({
    name: 'Tuna',
    type: ResourceType.Fishing,
    value: 3,
    unlockLevel: 5,
  }),
  new Resource({
    name: 'Plank',
    type: ResourceType.CraftingIngredient,
    value: 2,
    harvestRequiredResources: { wood: 1 },
  }),
  new Resource({
    name: 'Copper Ingot',
    type: ResourceType.SmithingIngredient,
    value: 10,
    harvestRequiredResources: { copper: 1, coal: 1 },
    unlockLevel: 1,
  }),
  new Resource({
    name: 'Iron Ingot',
    type: ResourceType.SmithingIngredient,
    value: 20,
    harvestRequiredResources: { iron: 1, coal: 2 },
    unlockLevel: 10,
  }),
  new Resource({
    name: 'Refined Coal',
    type: ResourceType.SmithingIngredient,
    value: 50,
    harvestRequiredResources: { coal: 10 },
    unlockLevel: 15,
  }),
];
