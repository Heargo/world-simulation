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

  private now: Date = new Date();

  constructor(
    type: VehicleType,
    name: string,
    speed: number,
    capacity: number,
    costPerKm: number,
    travelPath: Path,
    stopDuration: number = 5
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

  log(...args: any[]): void {
    if (this.name.includes('1471')) {
      let toLog = this.name + ': ';
      console.log(toLog, ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.name.includes('1471')) {
      let toLog = this.name + ': ';
      console.warn(toLog, ...args);
    }
  }

  group(name: string): void {
    if (this.name.includes('1471')) {
      console.group(name);
    }
  }

  groupEnd(): void {
    if (this.name.includes('1471')) {
      console.groupEnd();
    }
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

  getTimeUntilDepartureFrom(burg: Burg): number {
    if (!this.goThroughtBurg(burg)) return -1;
    this.now = new Date();
    this.group(this.now.toISOString() + ' ' + this.name);

    let leavingTime = this.getTimeToLeaveBurg(burg);
    let timeSinceLastDeparture =
      this.getTimeSinceLastDepartureInSecondes() * 1000;

    let timeUntilDeparture = leavingTime * 1000 - timeSinceLastDeparture;

    this.warn(
      (this.travelPath.steps[0] as Burg).name.slice(0, 3) + '-',
      this.travelPath.length / this.speed +
        's->' +
        this.getDestination().name.slice(0, 3) +
        (this.isReturning() ? '(returning)' : '') +
        '\nleaving at +' +
        leavingTime +
        's. Last start: ' +
        timeSinceLastDeparture / 1000 +
        's.\nTime until new departure: ' +
        timeUntilDeparture / 1000 +
        's'
    );
    this.groupEnd();
    return timeUntilDeparture;
  }

  getDurationInSecondes(depart: Burg | null = null): number {
    let timeToGetToBurg = 0;
    if (depart !== null) {
      timeToGetToBurg = this.getTimeToGetToBurg(depart);
    }

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

  getLastDeparture(timesTraveled: number = 2): Date {
    //TODO FIX THIS SHIT
    let duration = this.getDurationInSecondes() * 1000;
    let spanBetweenNowAndFirstDeparture =
      this.now.getTime() - this.firstDeparture.getTime();
    this.log(
      'getLastDeparture spanBetweenNowAndFirstDeparture',
      spanBetweenNowAndFirstDeparture
    );
    let numberOfTripsCycleFinished: number;
    if (timesTraveled === 1) {
      numberOfTripsCycleFinished = Math.floor(
        spanBetweenNowAndFirstDeparture / (duration * timesTraveled)
      );
    } else {
      numberOfTripsCycleFinished = Math.floor(
        spanBetweenNowAndFirstDeparture /
          (duration * timesTraveled - this.stopDuration * 2 * 1000)
      );
      this.log(
        'getLastDeparture cyles=span/(d * 2 - s *2)=',
        spanBetweenNowAndFirstDeparture,
        '/',
        '(',
        duration,
        '*',
        timesTraveled,
        '-',
        this.stopDuration,
        '*',
        2 * 1000,
        ')=',
        numberOfTripsCycleFinished
      );
    }
    let currentCycleStart =
      this.firstDeparture.getTime() +
      numberOfTripsCycleFinished * duration * timesTraveled;
    this.log(
      'getLastDeparture numberOfTripsCycleFinished',
      numberOfTripsCycleFinished,
      'currentCycleStart',
      currentCycleStart
    );
    return new Date(currentCycleStart);
  }

  getTimeSinceLastDepartureInSecondes(timesTraveled: number = 2): number {
    let lastDeparture = this.getLastDeparture(timesTraveled);
    return (new Date().getTime() - lastDeparture.getTime()) / 1000;
  }

  flipPath(path: Path): Path {
    //reverse path and stepsCumulativeLength
    let newCumulative = [...path.stepsCumulativeLength];
    //setup first and last
    newCumulative[0] = 0;
    newCumulative[newCumulative.length - 1] = path.length;
    for (let i = 1; i < path.steps.length - 1; i++) {
      newCumulative[i] = path.length - path.stepsCumulativeLength[i];
    }
    path.stepsCumulativeLength = newCumulative;
    path.steps.reverse();
    return path;
  }

  getNbBurgToPathStep(path: Path, step: number): number {
    let nb = 0;
    for (let i = 0; i < step; i++) {
      if (
        path.steps[i] instanceof Object &&
        path.steps[i].hasOwnProperty('id')
      ) {
        nb++;
      }
    }
    return nb;
  }

  getTimeToLeaveBurg(burg: Burg): number {
    let toleave = this.getTimeToGetToBurg(burg) + this.stopDuration;
    return toleave;
  }

  getTimeToGetToBurg(burg: Burg): number {
    this.log('getTimeToGetToBurg', burg.name);
    let timeToGetToBurg = 0;
    let timeSinceLastDepartureInSecondes =
      this.getTimeSinceLastDepartureInSecondes();
    let lastFinishedStep = 0;
    let timeToFinishStep = 0;
    let timeToReachBurg = 0;
    let path: Path = JSON.parse(JSON.stringify(this.travelPath));

    let isReturning = this.isReturning();
    //if we are returning, we need to reverse the path
    if (isReturning) {
      path = this.flipPath(path);
      //if we are returning, we need to add one complete travel time as base + 1 stop duration
      timeToFinishStep = path.length / this.speed;
      timeToFinishStep += this.stopDuration;
    }
    this.log(
      'getTimeToGetToBurg direction',
      (path.steps[0] as Burg).name,
      '->',
      (path.steps[path.steps.length - 1] as Burg).name
    );

    //estimate last finished step and save the time to reach the burg
    let foundLastFinishedStep = false;
    for (let i = 0; i < path.stepsCumulativeLength.length; i++) {
      let step = path.steps[i];
      timeToFinishStep += path.stepsCumulativeLength[i] / this.speed;
      if (step instanceof Object && step.hasOwnProperty('id')) {
        if (step.id === burg.id) {
          timeToReachBurg = timeToFinishStep;
        }
        timeToFinishStep += this.stopDuration;
      }
      if (
        timeSinceLastDepartureInSecondes < timeToFinishStep &&
        !foundLastFinishedStep
      ) {
        lastFinishedStep = i;
        foundLastFinishedStep = true;
      }
    }
    this.log(
      'timeToGetToBurg, lastFinishedStep: ',
      lastFinishedStep,
      ', timeToFinishStep: ',
      timeToFinishStep,
      ', timeToReachBurg: ',
      timeToReachBurg
    );

    //if this is the last burg, we need to add the waiting time
    // if (lastFinishedStep === path.stepsCumulativeLength.length - 1) {
    //   timeToFinishStep += this.stopDuration;
    //   this.warn(
    //     'timeToGetToBurg, last burg, add stop duration to finish step: ' +
    //       timeToFinishStep +
    //       's'
    //   );
    // }

    //look if the burg is foward or backward
    let burgStepIndex = path.steps.findIndex(s => {
      if (s instanceof Object && s.hasOwnProperty('id')) {
        return s.id === burg.id;
      } else return false;
    });

    //burg is behind
    if (burgStepIndex < lastFinishedStep) {
      //1. calculate how long to finish the path
      let remainingTimeUntilPathEnd =
        path.length / this.speed - timeSinceLastDepartureInSecondes;
      //if returning, subsctract the time to finish the path once
      if (isReturning) {
        remainingTimeUntilPathEnd -= path.length / this.speed;
      }
      //add stop times until the burg
      let stopedTimes =
        (this.getNbBurgToPathStep(path, burgStepIndex) + 1) * this.stopDuration;
      remainingTimeUntilPathEnd += stopedTimes;
      this.log('timeToGetToBurg BEHIND, stopedTime: ' + stopedTimes + 's');
      //2. flip the path and stepsCumulativeLength
      path = this.flipPath(path);
      burgStepIndex = path.steps.findIndex(s => {
        if (s instanceof Object && s.hasOwnProperty('id')) {
          return s.id === burg.id;
        } else return false;
      });
      //3. add the time to get to the burg
      let startToBurg = path.stepsCumulativeLength[burgStepIndex] / this.speed;
      let stopTimes =
        this.getNbBurgToPathStep(path, burgStepIndex) * this.stopDuration;
      let timeSinceLastPathStarted =
        this.getTimeSinceLastDepartureInSecondes(1);

      timeToGetToBurg =
        timeSinceLastPathStarted +
        remainingTimeUntilPathEnd +
        startToBurg +
        stopTimes;

      this.log(
        'timeToGetToBurg = timeSinceLastPathStarted + remainingTimeUntilPathEnd+startToBurg + stopTimes=',
        timeSinceLastPathStarted,
        '+',
        remainingTimeUntilPathEnd,
        '+',
        startToBurg,
        '+',
        stopTimes,
        '=',
        timeToGetToBurg
      );
    }
    // burg is ahead
    else {
      //1. calculate the time to get to the burg
      timeToGetToBurg = timeToReachBurg;
      this.log('timeToGetToBurg AHEAD: ' + timeToGetToBurg + 's');
    }
    // console.log(this.name, 'time to get to burg: ' + timeToGetToBurg);
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
    let timeSinceLastDepartureInSecondes =
      this.getTimeSinceLastDepartureInSecondes();
    let duration = this.getDurationInSecondes();
    return (
      timeSinceLastDepartureInSecondes > duration &&
      timeSinceLastDepartureInSecondes < duration * 2 - this.stopDuration
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
