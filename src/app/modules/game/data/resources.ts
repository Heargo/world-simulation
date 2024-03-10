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

export const WOODCUTTING_RESOURCES: Resource[] = [
  new Resource({
    name: 'Wood stick',
    type: ResourceType.Woodcutting,
    value: 1,
  }),
  new Resource({
    name: 'Oak',
    type: ResourceType.Woodcutting,
    value: 2,
    unlockLevel: 2,
  }),
  new Resource({
    name: 'Pine',
    type: ResourceType.Woodcutting,
    value: 10,
    unlockLevel: 10,
  }),
  new Resource({
    name: 'Birch',
    type: ResourceType.Woodcutting,
    value: 20,
    unlockLevel: 15,
  }),
  new Resource({
    name: 'Mahogany',
    type: ResourceType.Woodcutting,
    value: 50,
    unlockLevel: 30,
  }),
  new Resource({
    name: 'Teak',
    type: ResourceType.Woodcutting,
    value: 100,
    unlockLevel: 60,
  }),
  new Resource({
    name: 'Yew',
    type: ResourceType.Woodcutting,
    value: 1000,
    unlockLevel: 80,
  })
];

export const MINING_RESOURCES: Resource[] = [
  new Resource({
    name: 'Stone',
    type: ResourceType.Mining,
    value: 1,
  }),
  new Resource({
    name: 'Coal',
    type: ResourceType.Mining,
    value: 2,
    unlockLevel: 2,
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
    name: 'Gold',
    type: ResourceType.Mining,
    value: 100,
    unlockLevel: 15,
  }),
  new Resource({
    name: 'Silver',
    type: ResourceType.Mining,
    value: 1000,
    unlockLevel: 30,
  }),
  new Resource({
    name: 'Platinum',
    type: ResourceType.Mining,
    value: 10000,
    unlockLevel: 60,
  }),
  new Resource({
    name: 'Diamond',
    type: ResourceType.Mining,
    value: 100000,
    unlockLevel: 80,
  })
];

export const CRAFTING_RESOURCES: Resource[] = [
  new Resource({
    name: 'Sawdust',
    type: ResourceType.CraftingIngredient,
    value: 2,
    harvestRequiredResources: { wood_stick: 1 },
  }),
  new Resource({
    name: 'Oak Plank',
    type: ResourceType.CraftingIngredient,
    value: 5,
    harvestRequiredResources: { oak: 1 },
    unlockLevel: 5,
  }),
  new Resource({
    name: 'Pine Plank',
    type: ResourceType.CraftingIngredient,
    value: 10,
    harvestRequiredResources: { pine: 1 },
    unlockLevel: 10,
  }),
  new Resource({
    name: 'Birch Plank',
    type: ResourceType.CraftingIngredient,
    value: 20,
    harvestRequiredResources: { birch: 1 },
    unlockLevel: 15,
  }),
  new Resource({
    name: 'Mahogany Plank',
    type: ResourceType.CraftingIngredient,
    value: 50,
    harvestRequiredResources: { mahogany: 1 },
    unlockLevel: 30,
  }),
  new Resource({
    name: 'Teak Plank',
    type: ResourceType.CraftingIngredient,
    value: 100,
    harvestRequiredResources: { teak: 1 },
    unlockLevel: 60,
  }),
  new Resource({
    name: 'Yew Plank',
    type: ResourceType.CraftingIngredient,
    value: 1000,
    harvestRequiredResources: { yew: 1 },
    unlockLevel: 80,
  })
];

export const SMITHING_RESOURCES: Resource[] = [
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
  new Resource({
    name: 'Gold Ingot',
    type: ResourceType.SmithingIngredient,
    value: 150,
    harvestRequiredResources: { gold: 1, coal: 10 },
    unlockLevel: 30,
  }),
  new Resource({
    name: 'Silver Ingot',
    type: ResourceType.SmithingIngredient,
    value: 1500,
    harvestRequiredResources: { silver: 1, coal: 50 },
    unlockLevel: 60,
  }),
  new Resource({
    name: 'Platinum Ingot',
    type: ResourceType.SmithingIngredient,
    value: 15000,
    harvestRequiredResources: { platinum: 1, coal: 100 },
    unlockLevel: 80,
  }),
  new Resource({
    name: 'Diamond Gem',
    type: ResourceType.SmithingIngredient,
    value: 150000,
    harvestRequiredResources: { diamond: 1 },
    unlockLevel: 80,
  })
];

export const ALL_RESOURCES: Resource[] = [
  ...WOODCUTTING_RESOURCES,
  ...MINING_RESOURCES,
  ...CRAFTING_RESOURCES,
  ...SMITHING_RESOURCES,
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
];
