export interface WorldRaw {
  info: Info;
  settings: Settings;
  mapCoordinates: MapCoordinates;
  pack: Pack;
  grid: Grid;
  biomesData: BiomesData;
  notes: Note[];
  nameBases: NameBase[];
}

export interface BiomesData {
  i: number[];
  name: string[];
  color: string[];
  biomesMartix: { [key: string]: number }[];
  habitability: number[];
  iconsDensity: number[];
  icons: Array<string[]>;
  cost: number[];
}

export interface Grid {
  cells: GridCell[];
  vertices: Vertex[];
  cellsDesired: number;
  spacing: number;
  cellsY: number;
  cellsX: number;
  points: Array<number[]>;
  boundary: Array<number[]>;
  seed: string;
  features: Array<FeatureClass | number>;
}

export interface GridCell {
  i: number;
  v: number[];
  c: number[];
  b: number;
  f: number;
  t: number;
  h: number;
  temp: number;
  prec: number;
}

export interface FeatureClass {
  i: number;
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

export enum FeatureType {
  Island = 'island',
  Lake = 'lake',
  Ocean = 'ocean',
}

export interface Vertex {
  i: number;
  p: number[];
  v: number[];
  c: number[];
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

export interface NameBase {
  name: string;
  i: number;
  min: number;
  max: number;
  d: string;
  m: number;
  b: string;
}

export interface Note {
  id: string;
  name: string;
  legend: string;
}

export interface Pack {
  cells: PackCell[];
  vertices: Vertex[];
  features: Array<FeatureClass | number>;
  cultures: Culture[];
  burgs: Burg[];
  states: State[];
  provinces: Array<ProvinceClass | number>;
  religions: Religion[];
  rivers: River[];
  markers: Marker[];
}

export interface Burg {
  cell?: number;
  x?: number;
  y?: number;
  state?: number;
  i?: number;
  culture?: number;
  name?: string;
  feature?: number;
  capital?: number;
  port?: number;
  population?: number;
  type?: BurgType;
  coa?: Coa;
  citadel?: number;
  plaza?: number;
  walls?: number;
  shanty?: number;
  temple?: number;
}

export interface Coa {
  t1: string;
  division?: DivisionClass;
  ordinaries?: Ordinary[];
  shield: Shield;
  charges?: Charge[];
}

export interface Charge {
  charge: string;
  t: T;
  p: string;
  size: number;
  t2?: T;
  t3?: T;
  divided?: Divided;
  sinister?: number;
}

export enum Divided {
  Counter = 'counter',
}

export enum T {
  Argent = 'argent',
  Azure = 'azure',
  Gules = 'gules',
  Or = 'or',
  PlumettyGulesArgentSmaller = 'plumetty-gules-argent-smaller',
  Purpure = 'purpure',
  Sable = 'sable',
  Vert = 'vert',
}

export interface DivisionClass {
  division: DivisionEnum;
  t: string;
  line?: string;
}

export enum DivisionEnum {
  Chevronny = 'chevronny',
  Gyronny = 'gyronny',
  PerBend = 'perBend',
  PerBendSinister = 'perBendSinister',
  PerChevron = 'perChevron',
  PerChevronReversed = 'perChevronReversed',
  PerCross = 'perCross',
  PerFess = 'perFess',
  PerPale = 'perPale',
  PerPile = 'perPile',
  PerSaltire = 'perSaltire',
}

export interface Ordinary {
  ordinary: string;
  t: T;
  line?: string;
  divided?: string;
}

export enum Shield {
  Boeotian = 'boeotian',
  French = 'french',
  Horsehead = 'horsehead',
  Horsehead2 = 'horsehead2',
  OldFrench = 'oldFrench',
  Polish = 'polish',
  Round = 'round',
  Spanish = 'spanish',
  Swiss = 'swiss',
}

export enum BurgType {
  Generic = 'Generic',
  Highland = 'Highland',
  Hunting = 'Hunting',
  Lake = 'Lake',
  Naval = 'Naval',
  Nomadic = 'Nomadic',
}

export interface PackCell {
  i: number;
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

export interface Culture {
  name: string;
  i: number;
  base: number;
  origins: Array<number | null>;
  shield: Shield;
  center?: number;
  color?: string;
  type?: BurgType;
  expansionism?: number;
  code?: string;
}

export interface Marker {
  icon: string;
  type: string;
  dx?: number;
  px?: number;
  x: number;
  y: number;
  cell: number;
  i: number;
  dy?: number;
}

export interface ProvinceClass {
  i: number;
  state: number;
  center: number;
  burg: number;
  name: string;
  formName: string;
  fullName: string;
  color: string;
  coa: Coa;
}

export interface Religion {
  name: string;
  i: number;
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
  i: number;
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

export interface State {
  i: number;
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
  coa?: Coa;
  campaigns?: Campaign[];
  form?: Form;
  formName?: string;
  fullName?: string;
  pole?: number[];
  alert?: number;
  military?: StateMilitary[];
}

export interface Campaign {
  name: string;
  start: number;
  end: number;
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

export enum Form {
  Monarchy = 'Monarchy',
  Theocracy = 'Theocracy',
  Union = 'Union',
}

export interface StateMilitary {
  i: number;
  a: number;
  cell: number;
  x: number;
  y: number;
  bx: number;
  by: number;
  u: U;
  n: number;
  name: string;
  state: number;
  icon: Icon;
}

export enum Icon {
  Empty = '⚔️',
  Fluffy = '\ud83d\udc51',
  Icon = '\ud83c\udff9',
  Purple = '\ud83c\udf0a',
  Sticky = '\ud83d\udca3',
  Tentacled = '\ud83d\udc34',
}

export interface U {
  archers?: number;
  cavalry?: number;
  artillery?: number;
  infantry?: number;
  fleet?: number;
}

export interface Settings {
  distanceUnit: string;
  distanceScale: string;
  areaUnit: string;
  heightUnit: string;
  heightExponent: string;
  temperatureScale: string;
  barSize: string;
  barLabel: string;
  barBackOpacity: string;
  barBackColor: string;
  barPosX: string;
  barPosY: string;
  populationRate: number;
  urbanization: number;
  mapSize: string;
  latitudeO: string;
  prec: string;
  options: Options;
  mapName: string;
  hideLabels: boolean;
  stylePreset: string;
  rescaleLabels: boolean;
  urbanDensity: number;
}

export interface Options {
  pinNotes: boolean;
  showMFCGMap: boolean;
  winds: number[];
  temperatureEquator: number;
  temperatureNorthPole: number;
  temperatureSouthPole: number;
  stateLabelsMode: string;
  year: number;
  era: string;
  eraShort: string;
  military: OptionsMilitary[];
}

export interface OptionsMilitary {
  icon: Icon;
  name: string;
  rural: number;
  urban: number;
  crew: number;
  power: number;
  type: string;
  separate: number;
}
