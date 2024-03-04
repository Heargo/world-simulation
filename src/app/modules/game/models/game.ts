import { Player } from './player';
import { Vehicle } from './vehicule';
import { World } from './world';
import { Burg } from './burg';
import { TransportationGrid } from './transportation-grid';

export interface Game {
  world: World;
  ground_grid: TransportationGrid;
  sea_grid: TransportationGrid;
  currentBurg: Burg;
  player: Player;
  transports: TransportData;
  saveTime: number;
  saveName?: string;
}

export interface TransportData {
  nbCarriages: number;
  nbShips: number;
  carriages: { [key: number]: Vehicle[] };
  ships: { [key: number]: Vehicle[] };
}
