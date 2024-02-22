import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateFn,
} from '@angular/router';
import { JobType } from '../models/jobs';
import { WorldService } from '../services/world.service';

export const AvailableResourceType: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const worldService = inject(WorldService);
  const router = inject(Router);
  //get JobType from route param
  let jobType: JobType = route.paramMap.get('jobType') as JobType;
  return worldService.currentBurg.availableJobsTypes.includes(jobType);
};
