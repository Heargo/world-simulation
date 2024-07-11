import { Entity, EntityState } from './entity';
import { Inventory } from './inventory';
import { Job } from './jobs';

export class Player extends Entity {
  constructor(inventory?: Inventory, jobs?: Job[], state?: EntityState) {
    super(inventory, jobs, state);
  }
}
