export interface World {
  info: Info;
  mapCoordinates: MapCoordinates;
  mapData: MapData;
  biomesData: BiomesData[];
  //   notes: Note[];
  //   nameBases: NameBase[];
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
  biomesMartix: { [key: string]: number }; // 2d matrix used to define cell biome by temperature and moisture. Columns contain temperature data going from > 19 °C to < -4 °C. Rows contain data for 5 moisture bands from the drier to the wettest one.
  habitability: number; // biome habitability, must be 0 or positive. 0 means the biome is uninhabitable, max value is not defined, but 100 is the actual max used by default
  iconsDensity: number;
  icons: string[];
  cost: number; // biome movement cost, must be 0 or positive. Extensively used during cultures, states and religions growth phase. 0 means spread to this biome costs nothing. Max value is not defined, but 5000 is the actual max used by default
}

// export interface Note {
//   id: string;
//   name: string;
//   legend: string;
// }

// export interface NameBase {
//   name: string;
//   id: number;
//   min: number;
//   max: number;
//   d: string;
//   m: number;
//   b: string;
// }

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

export enum BurgType {
  Generic = 'Generic',
  Highland = 'Highland',
  Hunting = 'Hunting',
  Lake = 'Lake',
  Naval = 'Naval',
  Nomadic = 'Nomadic',
}

export interface Burg {
  cell?: number;
  x: number;
  y: number;
  state?: number;
  id?: number;
  culture?: number;
  name?: string;
  feature?: number;
  capital?: number;
  port?: number;
  population?: number;
  type?: BurgType;
  citadel?: number;
  plaza?: number;
  walls?: number;
  shanty?: number;
  temple?: number;
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
