import { Injectable } from '@angular/core';
import { NPC_RARITY_PROBABILITIES, Npc, NpcRarity } from '../models/npc';
import * as random from 'random-seed';
import { JOBS } from '../data/jobs';

@Injectable({
  providedIn: 'root',
})
export class NpcService {
  hiredNpcs: Npc[] = [];

  private rand: random.RandomSeed;

  constructor() {
    this.rand = random.create('npc');
  }

  randomRarity(): NpcRarity {
    const rand = this.rand.random();
    let rarity: NpcRarity = NpcRarity.COMMON;
    Object.keys(NPC_RARITY_PROBABILITIES).forEach(r => {
      if (rand >= 1 - NPC_RARITY_PROBABILITIES[r]) {
        rarity = r as NpcRarity;
      }
    });

    return rarity;
  }

  generateNpc(): Npc {
    let nbJobs = this.rand.intBetween(1, 3);
    let jobs = [...JOBS];
    jobs.sort(() => 0.5 - this.rand.random());

    const npcJobs = jobs.slice(0, nbJobs);
    const rarity = this.randomRarity();
    return new Npc(rarity, undefined, npcJobs);
  }

  testRandomRarity(): { [key: string]: number } {
    const nbTests = 100;
    let results: { [key: string]: number } = {
      [NpcRarity.COMMON]: 0,
      [NpcRarity.UNCOMMON]: 0,
      [NpcRarity.RARE]: 0,
      [NpcRarity.EPIC]: 0,
      [NpcRarity.LEGENDARY]: 0,
    };

    for (let i = 0; i < nbTests; i++) {
      results[this.randomRarity()]++;
    }
    console.log('rarity results', results);
    return results;
  }
}
