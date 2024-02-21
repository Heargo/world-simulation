import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JOB_RELATED_RESOURCES } from '../../data/jobs';
import { RAW_RESOURCES } from '../../data/resources';
import { JobType } from '../../models/jobs';
import { Resource } from '../../models/resources';

import { PlayerService } from '../../services/player.service';
import { WorldService } from '../../services/world.service';

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.scss'],
})
export class JobPageComponent implements OnInit {
  availableResources: Resource[] = [];

  constructor(
    private readonly playerService: PlayerService,
    private readonly worldService: WorldService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let jobType = this.route.snapshot.paramMap.get('jobType') as JobType;
    this.availableResources = Object.values(RAW_RESOURCES).filter(r =>
      JOB_RELATED_RESOURCES[jobType].includes(r.type)
    );
    console.log('availableResources', this.availableResources);
  }
}
