import { Burg } from './burg';
import { Inventory } from './inventory';
import { Resource } from './resources';
import { Path } from './transportation-grid';

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
  firstDeparture: Date;

  constructor(
    type: VehicleType,
    name: string,
    speed: number,
    capacity: number,
    costPerKm: number,
    travelPath: Path,
    stopDuration: number = 30
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
    this.firstDeparture = new Date();
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

  getDurationInSecondes(depart: Burg | null = null): number {
    if (depart === null) {
      depart = this.travelPath.steps[0] as Burg;
    }
    let timeToGetToBurg = this.getTimeToGetToBurg(depart);

    //number of stops are the number of burgs
    let numberOfStops = this.travelPath.steps.filter(
      s => s instanceof Burg
    ).length;

    let totalTime =
      this.travelPath.length / this.speed + this.stopDuration * numberOfStops;

    return totalTime - timeToGetToBurg;
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

  getLastDeparture(): Date {
    let duration = this.getDurationInSecondes() * 1000;
    let now = new Date().getTime();
    let spanBetweenNowAndFirstDeparture = now - this.firstDeparture.getTime();
    let numberOfTripsCycleFinished = Math.floor(
      spanBetweenNowAndFirstDeparture / (duration * 2)
    );
    let currentCycleStart =
      this.firstDeparture.getTime() + numberOfTripsCycleFinished * duration * 2;

    return new Date(currentCycleStart);
  }

  getReturnDate(): Date {
    let lastDeparture = this.getLastDeparture();
    let returnDate =
      lastDeparture.getTime() + this.getDurationInSecondes() * 1000;
    return new Date(returnDate);
  }

  getTimeSinceLastDepartureInSecondes(): number {
    let lastDeparture = this.getLastDeparture();
    return (new Date().getTime() - lastDeparture.getTime()) / 1000;
  }

  getTimeToGetToBurg(burg: Burg): number {
    let stops = this.travelPath.steps.filter(s => s instanceof Burg) as Burg[];
    let timeToGetToBurg =
      stops.findIndex(s => s.id === burg.id) * this.stopDuration;

    let burgIndex = this.travelPath.steps.findIndex(s => {
      if (s instanceof Burg) {
        return s.id === burg.id;
      } else return false;
    });
    timeToGetToBurg +=
      this.travelPath.stepsCumulativeLength[burgIndex] / this.speed;

    if (this.isReturning()) {
      timeToGetToBurg = this.getDurationInSecondes() - timeToGetToBurg;
    }

    return timeToGetToBurg;
  }

  isInBurg(burg: Burg): boolean {
    let timeSinceLastDepartureInSecondes =
      this.getTimeSinceLastDepartureInSecondes();

    let timeToGetToBurg = this.getTimeToGetToBurg(burg);

    return (
      timeSinceLastDepartureInSecondes >= timeToGetToBurg &&
      timeSinceLastDepartureInSecondes <= timeToGetToBurg + this.stopDuration
    );
  }

  isReturning(): boolean {
    return (
      this.getTimeSinceLastDepartureInSecondes() > this.getDurationInSecondes()
    );
  }

  getDestination(): Burg {
    if (this.isReturning()) {
      return this.travelPath.steps[0] as Burg;
    } else {
      return this.travelPath.steps[this.travelPath.steps.length - 1] as Burg;
    }
  }
}

export enum VehicleType {
  Carriage = 'Carriage',
  Ship = 'Ship',
}
