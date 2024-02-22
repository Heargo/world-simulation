import { Burg } from './burg';
import { Inventory } from './inventory';
import { Resource } from './resources';
import { Path } from './transportation-grid';

export interface TimePeriodicity {
  burg: Burg;
  periodicityInMiliseconds: number;
}

export class Vehicle {
  static VEHICLE_ID = 0;

  id: number;
  type: VehicleType;
  name: string;
  speed: number;
  capacity: number;
  costPerDistanceUnit: number;
  inventory: Inventory;
  stopDuration: number; //in seconds
  travelPath: Path;
  firstInit: Date;
  nbBurgsInPath: number = 0;
  burgsInPath: Burg[] = [];
  timePeriodicity: TimePeriodicity[] = [];
  cycle: number;

  private now: Date = new Date();

  constructor(
    type: VehicleType,
    name: string,
    speed: number,
    capacity: number,
    costPerKm: number,
    travelPath: Path,
    stopDuration: number = 300
  ) {
    this.id = Vehicle.VEHICLE_ID++;
    this.type = type;
    this.name = name;
    this.speed = speed;
    this.capacity = capacity;
    this.costPerDistanceUnit = costPerKm;
    this.inventory = new Inventory();
    this.travelPath = travelPath;
    this.stopDuration = stopDuration;
    this.firstInit = new Date();

    this.nbBurgsInPath = travelPath.steps.filter(s => s instanceof Burg).length;
    this.burgsInPath = travelPath.steps.filter(
      s => s instanceof Burg
    ) as Burg[];

    this.cycle =
      (2 * (this.travelPath.length / this.speed) +
        (2 * this.nbBurgsInPath - 2) * this.stopDuration) *
      1000;
  }

  getStep(b: Burg): number {
    return this.travelPath.steps.findIndex(s => {
      if (s instanceof Burg) {
        return s.id === b.id;
      } else return false;
    });
  }

  getCost(depart: Burg): number {
    let currentStep = this.getStep(depart);

    let alreadyTravelled = this.travelPath.stepsCumulativeLength[currentStep];
    let remainingPath = this.travelPath.length - alreadyTravelled;

    return remainingPath * this.costPerDistanceUnit;
  }

  goThroughtBurg(b: Burg): boolean {
    return (
      this.travelPath.steps.find(s => {
        if (s instanceof Burg) {
          return s.id === b.id;
        } else return false;
      }) !== undefined
    );
  }

  getDestination(currentBurg: Burg): Burg {
    let span = this.firstInit.getTime() - this.now.getTime();
    let r = span % this.cycle;
    let start = this.travelPath.steps[0] as Burg;
    let end = this.travelPath.steps[this.travelPath.steps.length - 1] as Burg;

    if (currentBurg.id === start.id) {
      return end;
    } else if (currentBurg.id === end.id) {
      return start;
    }
    if (r > this.cycle / 2) {
      return start;
    } else {
      return end;
    }
  }

  getTimeUntilArrival(burg: Burg): number {
    this.now = new Date();

    //span in ms
    let span = this.now.getTime() - this.firstInit.getTime();

    //ms
    let r = span % this.cycle;
    let i = this.burgsInPath.findIndex(b => b.id === burg.id);
    let j = this.travelPath.steps.findIndex(b => (b as Burg).id === burg.id);

    let dc = (this.travelPath.stepsCumulativeLength[j] / this.speed) * 1000;
    let t0 = dc + i * this.stopDuration * 1000;
    let t1 = this.cycle - t0;

    if (r > this.cycle / 2 && r > t1) {
      return t0 + this.cycle - r; //t0 + this.cycle is t2
    } else if (r > this.cycle / 2 || r > t0) {
      return t1 - r;
    } else {
      return t0 - r;
    }
  }

  getTimeUntilDeparture(burg: Burg): number {
    let timeUntileArrival = this.getTimeUntilArrival(burg);
    let timeUntileDeparture;
    let span = this.now.getTime() - this.firstInit.getTime();
    let r = span % this.cycle;
    let i = this.burgsInPath.findIndex(b => b.id === burg.id);
    let j = this.travelPath.steps.findIndex(b => (b as Burg).id === burg.id);
    let dc = (this.travelPath.stepsCumulativeLength[j] / this.speed) * 1000;
    let t0 = dc + i * this.stopDuration * 1000;
    let t1 = this.cycle - t0;
    if (0 <= r - t0 && r - t0 <= this.stopDuration * 1000) {
      timeUntileDeparture = this.stopDuration * 1000 + t0 - r;
    } else if (0 <= r - t1 && r - t1 <= this.stopDuration * 1000) {
      timeUntileDeparture = this.stopDuration * 1000 + t1 - r;
    } else {
      timeUntileDeparture = timeUntileArrival + this.stopDuration * 1000;
    }
    return timeUntileDeparture;
  }

  isInBurg(burg: Burg): boolean {
    let leaving = this.getTimeUntilDeparture(burg);

    return leaving <= this.stopDuration * 1000;
  }

  addToInventory(resource: Resource, quantity: number): void {
    this.inventory.add(resource, quantity);
  }

  removeFromInventory(resource: Resource, quantity: number): void {
    this.inventory.remove(resource, quantity);
  }

  getAvailableSpace(): number {
    return this.capacity - this.inventory.getTotalSize();
  }
}

export enum VehicleType {
  Carriage = 'Carriage',
  Ship = 'Ship',
}
