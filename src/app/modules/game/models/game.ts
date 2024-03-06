import { Player } from './player';
import { Vehicle } from './vehicule';
import { World } from './world';
import { Burg } from './burg';
import { TransportationGrid } from './transportation-grid';
import { Resource } from './resources';
import { JobType } from './jobs';

export interface Game {
  world: World;
  ground_grid: TransportationGrid;
  sea_grid: TransportationGrid;
  currentBurg: Burg;
  player: Player;
  transports: TransportData;
  saveTime: number;
  saveName: string;
}

export interface GamePreview {
  name: string;
  date: number;
  worldName: string;
  gameDataId: number;
}

export interface TransportData {
  nbCarriages: number;
  nbShips: number;
  carriages: { [key: number]: Vehicle[] };
  ships: { [key: number]: Vehicle[] };
}

export interface OfflineGain {
  resources: OfflineResourceGain[];
  jobs: OfflineJobGain[];
  timeOffline: number; //in ms
}

export interface OfflineResourceGain {
  resource: Resource;
  quantity: number;
}

export interface OfflineJobGain {
  job: JobType;
  oldLevel: number;
  newLevel: number;
}
