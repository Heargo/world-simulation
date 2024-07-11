import { Entity, EntityState } from './entity';
import { Inventory } from './inventory';
import { Job } from './jobs';

export enum NpcRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export const NPC_RARITY_PROBABILITIES: { [key: string]: number } = {
  [NpcRarity.COMMON]: 0.5,
  [NpcRarity.UNCOMMON]: 0.3,
  [NpcRarity.RARE]: 0.15,
  [NpcRarity.EPIC]: 0.04,
  [NpcRarity.LEGENDARY]: 0.01,
};

export const NPC_RARITY_EXP_MULTIPLIER: { [key: string]: number } = {
  [NpcRarity.COMMON]: 0.5,
  [NpcRarity.UNCOMMON]: 1,
  [NpcRarity.RARE]: 1.5,
  [NpcRarity.EPIC]: 2,
  [NpcRarity.LEGENDARY]: 3,
};

export class Npc extends Entity {
  rarity: NpcRarity;
  constructor(
    rarity: NpcRarity = NpcRarity.COMMON,
    inventory?: Inventory,
    jobs?: Job[],
    state?: EntityState
  ) {
    super(inventory, jobs, state);
    this.rarity = rarity;

    for (let job of this.jobs) {
      job.levelingFactor = NPC_RARITY_EXP_MULTIPLIER[this.rarity];
    }
  }
}
