import {
  Resource,
  ResourceType,
  ResourceAvailablilty,
} from '../models/resources';

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

export const RAW_RESOURCES: { [key: string]: Resource } = {
  wood: new Resource('Wood', ResourceType.Woodcutting, 1, 5, 1),
  stone: new Resource('Stone', ResourceType.Mining, 1, 5, 1),
  copper: new Resource('Copper', ResourceType.Mining, 1, 5, 1),
};
