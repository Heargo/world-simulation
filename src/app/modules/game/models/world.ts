import { JOB_RELATED_RESOURCES } from '../data/jobs';
import { RESOURCE_TYPE_AVAILABILTY } from '../data/resources';
import { Burg, BurgType } from './burg';
import { JobType } from './jobs';
import { ResourceType } from './resources';

import { WorldRaw } from './world-raw';

export class World {
  info: Info;
  mapCoordinates: MapCoordinates;
  mapData: MapData;
  biomesData: BiomesData[];
  notes: Note[];
  nameBases: NameBase[];

  constructor(raw: WorldRaw) {
    let world: any = {};
    world = this.convertWithProperId(raw);
    this.info = world.info;
    this.mapCoordinates = world.mapCoordinates;
    this.biomesData = this.convertBiomeData(world.biomesData);
    this.mapData = this.convertMapData(world.pack);
    this.notes = world.notes;
    this.nameBases = world.nameBases;
  }

  private convertWithProperId(raw: any): any {
    let result: any = JSON.parse(JSON.stringify(raw));
    for (let key in raw) {
      //rename key i to id for better readability
      if (key == 'i') {
        result['id'] = raw.i;
        delete result.i;
      }

      //if object, convert it if list convert all objects in list
      if (Object.prototype.toString.call(raw[key]) == '[object Object]') {
        result[key] = this.convertWithProperId(raw[key]);
      }

      if (Object.prototype.toString.call(raw[key]) == '[object Array]') {
        result[key] = [];
        for (let i = 0; i < raw[key].length; i++) {
          result[key].push(this.convertWithProperId(raw[key][i]));
        }
      }
    }
    return result;
  }

  private convertBiomeData(raw: any): BiomesData[] {
    let biomesData: BiomesData[] = [];
    for (let i = 0; i < raw.i.length; i++) {
      let id = raw.i[i];
      let b = {
        id: id,
        name: raw.name[i],
        color: raw.color[i],
        habitability: raw.habitability[i],
        iconsDensity: raw.iconsDensity[i],
        icons: raw.icons[i],
        cost: raw.cost[i],
      } as BiomesData;
      biomesData.push(b);
    }
    return biomesData;
  }

  private convertMapData(raw: any): MapData {
    //remove vertices
    delete raw.vertices;
    //convert burgs to Burg class
    for (let i = 0; i < raw.burgs.length; i++) {
      if (raw.burgs[i].name == undefined) continue;
      let burg = new Burg(raw.burgs[i]);
      let burgCell = raw.cells[burg.cell!];
      let biome = this.biomesData[burgCell.biome];
      burg.updateBurgAttractivity(biome);
      burg.availableResourcesTypes = this.resourceTypeAvailableInBurg(
        biome.name
      );
      burg.resourceTypeFactor = this.getResourceTypeFactor(biome.name);
      burg.availableJobsTypes = this.getAvailableJobsTypes(burg);
      raw.burgs[i] = burg;
    }
    //remove burgs with undefined id
    raw.burgs = raw.burgs.filter((b: Burg) => b.id != undefined);
    return raw as MapData;
  }

  private getAvailableJobsTypes(burg: Burg): JobType[] {
    let availableJobsTypes: JobType[] = [];
    let availableResourcesTypes = burg.availableResourcesTypes;
    for (let job in JOB_RELATED_RESOURCES) {
      if (
        availableResourcesTypes.some(resourceType =>
          JOB_RELATED_RESOURCES[job].includes(resourceType)
        )
      ) {
        availableJobsTypes.push(job as JobType);
      }
    }
    return availableJobsTypes;
  }

  private resourceTypeAvailableInBurg(biomeName: string): ResourceType[] {
    let availableResources: ResourceType[] = [];
    //for each resource Type, check if the name of the biome contains any of the names in the resourceTypeAvailablilty names
    for (let key in RESOURCE_TYPE_AVAILABILTY) {
      let resourceType = key as ResourceType;
      let resourceAvailablilties = RESOURCE_TYPE_AVAILABILTY[resourceType];
      let notAvailable = false;
      for (let i = 0; i < resourceAvailablilties.length; i++) {
        if (resourceAvailablilties[i].quantityFactor === 0) {
          let names = resourceAvailablilties[i].names;
          if (
            names.some(name =>
              biomeName.toLowerCase().includes(name.toLowerCase())
            )
          ) {
            //found availability of 0 for this resource type, no need to check the other availabilities modifiers
            notAvailable = true;
            break;
          }
        }
      }
      if (!notAvailable) availableResources.push(resourceType);
    }
    return availableResources;
  }

  private getResourceTypeFactor(biomeName: string): { [key: string]: number } {
    let resourceTypeFactor: { [key: string]: number } = {};
    //for each resource Type, get the highest quantity factor
    for (let key in RESOURCE_TYPE_AVAILABILTY) {
      let resourceType = key as ResourceType;
      let resourceAvailablilties = RESOURCE_TYPE_AVAILABILTY[resourceType];
      //set the factor to 1 by default
      resourceTypeFactor[resourceType] = 1;
      for (let i = 0; i < resourceAvailablilties.length; i++) {
        let names = resourceAvailablilties[i].names;
        if (
          names.some(name =>
            biomeName.toLowerCase().includes(name.toLowerCase())
          )
        ) {
          //if found a 0 factor, no need to check the other availabilities modifiers
          if (resourceTypeFactor[resourceType] === 0) {
            resourceTypeFactor[resourceType] = 0;
            break;
          }
          //look for the highest factor,
          if (
            resourceTypeFactor[resourceType] <
            resourceAvailablilties[i].quantityFactor
          ) {
            resourceTypeFactor[resourceType] =
              resourceAvailablilties[i].quantityFactor;
          }
        }
      }
    }
    return resourceTypeFactor;
  }
}

export interface Info {
  version: string;
  description: string;
  exportedAt: Date;
  mapName: string;
  seed: string;
  mapId: number;
}

export interface MapCoordinates {
  latT: number;
  latN: number;
  latS: number;
  lonT: number;
  lonW: number;
  lonE: number;
}

export interface MapData {
  cells: Cell[]; //cell data
  features: Array<FeatureClass | number>; // island, lake, ocean etc
  cultures: Culture[];
  burgs: Burg[]; // cities, towns and villages
  states: State[];
  provinces: Array<ProvinceClass | number>;
  religions: Religion[];
  rivers: River[];
  markers: Marker[];
}

export interface Culture {
  name: string;
  id: number;
  base: number;
  origins: Array<number | null>;
  center?: number;
  color?: string;
  type?: BurgType;
  expansionism?: number;
  code?: string;
}

export interface BiomesData {
  id: number;
  name: string;
  color: string;
  habitability: number; // biome habitability, must be 0 or positive. 0 means the biome is uninhabitable, max value is not defined, but 100 is the actual max used by default
  iconsDensity: number;
  icons: string[];
  cost: number; // biome movement cost, must be 0 or positive. Extensively used during cultures, states and religions growth phase. 0 means spread to this biome costs nothing. Max value is not defined, but 5000 is the actual max used by default
}

export interface Note {
  id: string;
  name: string;
  legend: string;
}

export interface NameBase {
  name: string;
  id: number;
  min: number;
  max: number;
  d: string;
  m: number;
  b: string;
}

export interface Cell {
  id: number;
  v: number[];
  c: number[];
  p: number[];
  g: number;
  h: number;
  area: number;
  f: number;
  t: number;
  haven: number;
  harbor: number;
  fl: number;
  r: number;
  conf: number;
  biome: number;
  s: number;
  pop: number;
  culture: number;
  burg: number;
  road: number;
  crossroad: number;
  state: number;
  religion: number;
  province: number;
}

export enum FeatureType {
  Island = 'island',
  Lake = 'lake',
  Ocean = 'ocean',
}

export interface FeatureClass {
  id: number;
  land: boolean;
  border: boolean;
  type: FeatureType;
  cells: number;
  firstCell: number;
  group: string;
  area?: number;
  vertices?: number[];
  shoreline?: number[];
  height?: number;
  flux?: number;
  temp?: number;
  evaporation?: number;
  inlets?: number[];
  outlet?: number;
  name?: string;
}

export enum DiplomacyEnum {
  Ally = 'Ally',
  Enemy = 'Enemy',
  Friendly = 'Friendly',
  Neutral = 'Neutral',
  Rival = 'Rival',
  Suspicion = 'Suspicion',
  Suzerain = 'Suzerain',
  Unknown = 'Unknown',
  Vassal = 'Vassal',
  X = 'x',
}

export const DIPLOMACY_ATTRACTIVITY_FACTOR = {
  [DiplomacyEnum.Ally]: 1.5,
  [DiplomacyEnum.Enemy]: 0,
  [DiplomacyEnum.Friendly]: 1.25,
  [DiplomacyEnum.Neutral]: 1,
  [DiplomacyEnum.Rival]: 0.75,
  [DiplomacyEnum.Suspicion]: 0.5,
  [DiplomacyEnum.Suzerain]: 1.5,
  [DiplomacyEnum.Unknown]: 1,
  [DiplomacyEnum.Vassal]: 1.25,
  [DiplomacyEnum.X]: 1,
};

export interface Campaign {
  name: string;
  start: number;
  end: number;
}

export enum Form {
  Monarchy = 'Monarchy',
  Theocracy = 'Theocracy',
  Union = 'Union',
}

export interface State {
  id: number;
  name: string;
  urban: number;
  rural: number;
  burgs: number;
  area: number;
  cells: number;
  neighbors: number[];
  diplomacy: Array<string[] | DiplomacyEnum>;
  provinces: number[];
  color?: string;
  expansionism?: number;
  capital?: number;
  type?: BurgType;
  center?: number;
  culture?: number;
  campaigns?: Campaign[];
  form?: Form;
  formName?: string;
  fullName?: string;
  pole?: number[];
  alert?: number;
  military?: StateMilitary[];
}

export interface StateMilitary {
  id: number;
  a: number;
  cell: number;
  x: number;
  y: number;
  bx: number;
  by: number;
  u: Unit;
  n: number;
  name: string;
  state: number;
}

export interface Unit {
  archers?: number;
  cavalry?: number;
  artillery?: number;
  infantry?: number;
  fleet?: number;
}

export interface ProvinceClass {
  id: number;
  state: number;
  center: number;
  burg: number;
  name: string;
  formName: string;
  fullName: string;
  color: string;
}

export interface Religion {
  name: string;
  id: number;
  origins: number[] | null;
  type?: string;
  form?: string;
  culture?: number;
  center?: number;
  deity?: null | string;
  expansion?: Expansion;
  expansionism?: number;
  color?: string;
  code?: string;
}

export enum Expansion {
  Culture = 'culture',
  Global = 'global',
  State = 'state',
}

export interface River {
  id: number;
  source: number;
  mouth: number;
  discharge: number;
  length: number;
  width: number;
  widthFactor: number;
  sourceWidth: number;
  parent: number;
  cells: number[];
  basin: number;
  name: string;
  type: RiverType;
}

export enum RiverType {
  Branch = 'Branch',
  Brook = 'Brook',
  Creek = 'Creek',
  Fork = 'Fork',
  River = 'River',
  Stream = 'Stream',
}

export interface Marker {
  icon: string;
  type: string;
  dx?: number;
  px?: number;
  x: number;
  y: number;
  cell: number;
  id: number;
  dy?: number;
}
