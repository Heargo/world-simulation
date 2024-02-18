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
    this.firstInit = new Date();

    this.nbBurgsInPath = travelPath.steps.filter(s => s instanceof Burg).length;
    this.burgsInPath = travelPath.steps.filter(
      s => s instanceof Burg
    ) as Burg[];

    this.cycle =
      (2 * (this.travelPath.length / this.speed) +
        (2 * this.nbBurgsInPath - 1) * this.stopDuration) *
      1000;
    if (this.name.includes('AnHer-133')) {
      this.log(
        'estimated time to get to destination: ',
        (this.travelPath.steps[0] as Burg).name.slice(0, 3) + '-',
        this.nbBurgsInPath * this.stopDuration +
          this.travelPath.length / this.speed,
        's->',
        (
          this.travelPath.steps[this.travelPath.steps.length - 1] as Burg
        ).name.slice(0, 3)
      );
    }
  }

  log(...args: any[]): void {
    if (this.name.includes('AnHer-133')) {
      let toLog = this.name + ': ';
      console.log(toLog, ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.name.includes('AnHer-133')) {
      let toLog = this.name + ': ';
      console.warn(toLog, ...args);
    }
  }

  group(name: string): void {
    if (this.name.includes('1AnHer-13333')) {
      console.group(name);
    }
  }

  groupEnd(): void {
    if (this.name.includes('AnHer-133')) {
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

  getDestination(): Burg {
    let span = this.firstInit.getTime() - this.now.getTime();
    let r = span % this.cycle;
    return r <= this.cycle
      ? (this.travelPath.steps[0] as Burg)
      : (this.travelPath.steps[this.travelPath.steps.length - 1] as Burg);
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

    this.log(
      'getTimeUntilArrival',
      burg.name,
      'span',
      span,
      'r',
      r,
      'i',
      i,
      'j',
      j,
      'dc',
      dc,
      't0',
      t0,
      't1',
      t1,
      'cycle',
      this.cycle,
      '(r > this.cycle / 2)',
      r > this.cycle / 2,
      '(r > t0)',
      r > t0,
      '(t1 - r)',
      t1 - r,
      '(t0 - r)',
      t0 - r
    );

    if (r > this.cycle / 2 && r > t1) {
      this.log('getTimeUntilArrival', t0 + this.cycle - r);
      return t0 + this.cycle - r; //t0 + this.cycle is t2
    } else if (r > this.cycle / 2 || r > t0) {
      this.log('getTimeUntilArrival', t1 - r);
      return t1 - r;
    } else {
      this.log('getTimeUntilArrival', t0 - r);
      return t0 - r;
    }
  }

  getTimeUntilDeparture(burg: Burg): number {
    this.group('getTimeUntilDeparture');
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
      //timeUntileArrival > this.cycle - this.stopDuration * 1000
      this.warn('t0', t0, 'r', r);
      timeUntileDeparture = this.stopDuration * 1000 + t0 - r;
    } else if (0 <= r - t1 && r - t1 <= this.stopDuration * 1000) {
      timeUntileDeparture = this.stopDuration * 1000 + t1 - r;
    } else {
      timeUntileDeparture = timeUntileArrival + this.stopDuration * 1000;
    }

    this.log(
      'time until departure from',
      burg.name,
      timeUntileDeparture / 1000,
      's'
    );
    this.groupEnd();
    return timeUntileDeparture;
  }

  // getTimeUntilDepartureFrom(burg: Burg): number {
  //   if (!this.goThroughtBurg(burg)) return -1;
  //   this.now = new Date();
  //   this.group(this.now.toISOString() + ' ' + this.name);

  //   let leavingDate = this.getDateTimeToLeaveBurg(burg);
  //   let timeSinceFirstInit = this.now.getTime() - this.firstInit.getTime();

  //   let timeUntilDeparture = leavingDate.getTime() - this.now.getTime();

  //   this.warn(
  //     (this.travelPath.steps[0] as Burg).name.slice(0, 3) + '-',
  //     this.travelPath.length / this.speed,
  //     's->',
  //     this.getDestination().name.slice(0, 3),
  //     this.isReturning() ? '(returning)' : '',
  //     'now is',
  //     this.now.toLocaleTimeString(),
  //     '\nleaving at',
  //     leavingDate.toLocaleTimeString(),
  //     'firstInit: ',
  //     this.firstInit.toLocaleTimeString(),
  //     'timeSinceFirstInit: ',
  //     timeSinceFirstInit / 1000,
  //     's.\nTime until new departure: ',
  //     timeUntilDeparture / 1000,
  //     's'
  //   );
  //   this.groupEnd();
  //   return timeUntilDeparture;
  // }

  // getDurationInSecondes(depart: Burg | null = null): number {
  //   let timeToGetToBurg = 0;
  //   if (depart !== null) {
  //     timeToGetToBurg = this.getArrivalDateTimeToBurg(depart);
  //   }

  //   //number of stops are the number of burgs
  //   let numberOfStops = this.travelPath.steps.filter(
  //     s => s instanceof Burg
  //   ).length;

  //   let totalTime =
  //     this.travelPath.length / this.speed + this.stopDuration * numberOfStops;

  //   return totalTime - timeToGetToBurg;
  // }

  addToInventory(resource: Resource, quantity: number): void {
    this.inventory.add(resource, quantity);
  }

  removeFromInventory(resource: Resource, quantity: number): void {
    this.inventory.remove(resource, quantity);
  }

  getAvailableSpace(): number {
    return this.capacity - this.inventory.getTotalSize();
  }

  // getLastInit(timesTraveled: number = 2): Date {
  //   let duration = this.getDurationInSecondes() * 1000;
  //   let spanBetweenNowAndFirstInit =
  //     this.now.getTime() - this.firstInit.getTime();
  //   this.log(
  //     'getLastInit spanBetweenNowAndFirstInit',
  //     spanBetweenNowAndFirstInit
  //   );
  //   let numberOfTripsCycleFinished: number;
  //   let travelDuration = 0;
  //   if (timesTraveled === 1) {
  //     travelDuration = duration * timesTraveled;
  //   } else {
  //     travelDuration = duration * timesTraveled - this.stopDuration * 2 * 1000;
  //   }
  //   numberOfTripsCycleFinished = Math.floor(
  //     spanBetweenNowAndFirstInit / travelDuration
  //   );
  //   this.log(
  //     'getLastDeparture cyles=span/(d * 2 - s *2)=',
  //     spanBetweenNowAndFirstInit,
  //     '/',
  //     '(',
  //     duration,
  //     '*',
  //     timesTraveled,
  //     '-',
  //     this.stopDuration,
  //     '*',
  //     2 * 1000,
  //     ')=',
  //     numberOfTripsCycleFinished
  //   );
  //   let cyclesInMiliseconds = numberOfTripsCycleFinished * travelDuration;
  //   let currentCycleStart = this.firstInit.getTime() + cyclesInMiliseconds;

  //   this.log(
  //     'getLastDeparture numberOfTripsCycleFinished',
  //     numberOfTripsCycleFinished,
  //     'currentCycleStart',
  //     currentCycleStart,
  //     'cyclesInMiliseconds',
  //     cyclesInMiliseconds,
  //     'duration',
  //     duration,
  //     'timesTraveled',
  //     timesTraveled
  //   );
  //   return new Date(currentCycleStart);
  // }

  // getTimeSinceLastDeparture(timesTraveled: number = 2): number {
  //   let lastDeparture = this.getLastInit(timesTraveled);
  //   this.log('last cycle start was at', lastDeparture.toLocaleTimeString());
  //   return new Date().getTime() - lastDeparture.getTime();
  // }

  // flipPath(path: Path): Path {
  //   //reverse path and stepsCumulativeLength
  //   let newCumulative = [...path.stepsCumulativeLength];
  //   //setup first and last
  //   newCumulative[0] = 0;
  //   newCumulative[newCumulative.length - 1] = path.length;
  //   for (let i = 1; i < path.steps.length - 1; i++) {
  //     newCumulative[i] = path.length - path.stepsCumulativeLength[i];
  //   }
  //   path.stepsCumulativeLength = newCumulative;
  //   path.steps.reverse();
  //   return path;
  // }

  // getNbBurgToPathStep(path: Path, step: number): number {
  //   let nb = 0;
  //   for (let i = 0; i < step; i++) {
  //     if (
  //       path.steps[i] instanceof Object &&
  //       path.steps[i].hasOwnProperty('id')
  //     ) {
  //       nb++;
  //     }
  //   }
  //   return nb;
  // }

  // getDateTimeToLeaveBurg(burg: Burg): Date {
  //   let arrivalTime = this.getArrivalDateTimeToBurg(burg);
  //   let toleave = arrivalTime + this.stopDuration * 1000;
  //   let leavingDate = new Date(toleave);
  //   this.warn('arriving at', new Date(arrivalTime).toLocaleTimeString());
  //   this.warn('leaving at', leavingDate.toLocaleTimeString());
  //   return leavingDate;
  // }

  // getArrivalDateTimeToBurg(burg: Burg): number {
  //   this.log('getTimeToGetToBurg', burg.name);
  //   let timeToGetToBurg = 0;
  //   let timeSinceLastDeparture = this.getTimeSinceLastDeparture();
  //   let lastInit = this.getLastInit();
  //   let lastFinishedStep = 0;
  //   let timeToFinishStep = 0;
  //   let timeToReachBurg = 0;
  //   let path: Path = JSON.parse(JSON.stringify(this.travelPath));
  //   let isReturning = this.isReturning();
  //   //if we are returning, we need to reverse the path
  //   if (isReturning) {
  //     path = this.flipPath(path);
  //     //if we are returning, we need to add one complete travel time as base + 1 stop duration
  //     timeToFinishStep = path.length / this.speed;
  //     timeToFinishStep += this.stopDuration;
  //   }
  //   this.log(
  //     'getTimeToGetToBurg direction',
  //     (path.steps[0] as Burg).name,
  //     '->',
  //     (path.steps[path.steps.length - 1] as Burg).name
  //     // 'timeSinceFirstDeparture: ',
  //     // timeSinceFirstDepartureInSecondes
  //   );

  //   //estimate last finished step and save the time to reach the burg
  //   let foundLastFinishedStep = false;
  //   for (let i = 0; i < path.stepsCumulativeLength.length; i++) {
  //     let step = path.steps[i];
  //     timeToFinishStep += path.stepsCumulativeLength[i] / this.speed;
  //     if (step instanceof Object && step.hasOwnProperty('id')) {
  //       if (step.id === burg.id) {
  //         timeToReachBurg = timeToFinishStep;
  //       }
  //       timeToFinishStep += this.stopDuration;
  //     }
  //     if (
  //       timeSinceLastDeparture < timeToFinishStep * 1000 &&
  //       !foundLastFinishedStep
  //     ) {
  //       lastFinishedStep = i;
  //       foundLastFinishedStep = true;
  //     }
  //   }
  //   this.log(
  //     'timeToGetToBurg, lastFinishedStep: ',
  //     lastFinishedStep,
  //     ', timeToFinishStep: ',
  //     timeToFinishStep,
  //     ', timeToReachBurg: ',
  //     timeToReachBurg
  //   );

  //   //if this is the last burg, we need to add the waiting time
  //   // if (lastFinishedStep === path.stepsCumulativeLength.length - 1) {
  //   //   timeToFinishStep += this.stopDuration;
  //   //   this.warn(
  //   //     'timeToGetToBurg, last burg, add stop duration to finish step: ' +
  //   //       timeToFinishStep +
  //   //       's'
  //   //   );
  //   // }

  //   //look if the burg is foward or backward
  //   let burgStepIndex = path.steps.findIndex(s => {
  //     if (s instanceof Object && s.hasOwnProperty('id')) {
  //       return s.id === burg.id;
  //     } else return false;
  //   });

  //   //burg is behind
  //   if (burgStepIndex < lastFinishedStep) {
  //     //1. calculate how long to finish the path
  //     let remainingTimeUntilPathEnd =
  //       path.length / this.speed - timeSinceLastDeparture / 1000;
  //     //if returning, subsctract the time to finish the path once
  //     if (isReturning) {
  //       remainingTimeUntilPathEnd -= path.length / this.speed;
  //     }
  //     //add stop times until the burg
  //     let stopedTimes =
  //       (this.getNbBurgToPathStep(path, burgStepIndex) + 1) * this.stopDuration;
  //     remainingTimeUntilPathEnd += stopedTimes;
  //     this.log('timeToGetToBurg BEHIND, stopedTime: ' + stopedTimes + 's');
  //     //2. flip the path and stepsCumulativeLength
  //     path = this.flipPath(path);
  //     burgStepIndex = path.steps.findIndex(s => {
  //       if (s instanceof Object && s.hasOwnProperty('id')) {
  //         return s.id === burg.id;
  //       } else return false;
  //     });
  //     //3. add the time to get to the burg
  //     let startToBurg = path.stepsCumulativeLength[burgStepIndex] / this.speed;
  //     let stopTimes =
  //       this.getNbBurgToPathStep(path, burgStepIndex) * this.stopDuration;

  //     timeToGetToBurg = remainingTimeUntilPathEnd + startToBurg + stopTimes;

  //     this.log(
  //       'timeToGetToBurg = remainingTimeUntilPathEnd+startToBurg + stopTimes=',
  //       remainingTimeUntilPathEnd,
  //       '+',
  //       startToBurg,
  //       '+',
  //       stopTimes,
  //       '=',
  //       timeToGetToBurg
  //     );
  //   }
  //   // burg is ahead
  //   else {
  //     //1. calculate the time to get to the burg
  //     timeToGetToBurg = timeToReachBurg;
  //     this.log('timeToGetToBurg AHEAD: ' + timeToGetToBurg + 's');
  //   }
  //   // console.log(this.name, 'time to get to burg: ' + timeToGetToBurg);
  //   this.warn(
  //     'last init was at',
  //     lastInit.toLocaleTimeString(),
  //     'time to get to burg',
  //     timeToGetToBurg,
  //     's'
  //   );
  //   return lastInit.getTime() + timeToGetToBurg * 1000;
  // }

  // isInBurg(burg: Burg): boolean {
  //   let arrivalTime = this.getArrivalDateTimeToBurg(burg);

  //   return (
  //     this.now.getTime() >= arrivalTime &&
  //     this.now.getTime() <= arrivalTime + this.stopDuration * 1000
  //   );
  // }

  // isReturning(): boolean {
  //   let timeSinceLastDeparture = this.getTimeSinceLastDeparture();
  //   let duration = this.getDurationInSecondes() * 1000;
  //   return (
  //     timeSinceLastDeparture > duration &&
  //     timeSinceLastDeparture < duration * 2 - this.stopDuration
  //   );
  // }
}

export enum VehicleType {
  Carriage = 'Carriage',
  Ship = 'Ship',
}
