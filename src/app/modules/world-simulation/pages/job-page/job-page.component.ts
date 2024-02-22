import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JOB_RELATED_RESOURCES } from '../../data/jobs';
import { RAW_RESOURCES } from '../../data/resources';
import { Job, JobType } from '../../models/jobs';
import { Resource } from '../../models/resources';

import { PlayerService } from '../../services/player.service';
import { WorldService } from '../../services/world.service';
import { BaseAppComponent } from '../../../../core/components/base-app/base-app.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.scss'],
})
export class JobPageComponent extends BaseAppComponent implements OnInit {
  job!: Job;
  jobType!: JobType;
  availableResources: Resource[] = [];

  constructor(
    public readonly playerService: PlayerService,
    private readonly worldService: WorldService,
    private readonly route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      let jobType = params.get('jobType') as JobType;
      if (jobType != this.jobType) {
        this.jobType = jobType;
        this.job = this.playerService.player.getJob(jobType)!;
        this.availableResources = Object.values(RAW_RESOURCES).filter(r =>
          JOB_RELATED_RESOURCES[jobType].includes(r.type)
        );
      }
      console.log(this.playerService.player);
    });
  }

  onHarvest(resource: Resource): void {
    this.playerService.harvest(resource);
  }
}
