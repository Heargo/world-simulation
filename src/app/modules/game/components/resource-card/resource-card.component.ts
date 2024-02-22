import { Component, Input, OnInit } from '@angular/core';
import { Job } from '../../models/jobs';
import { Resource } from '../../models/resources';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss'],
})
export class ResourceCardComponent {
  @Input() resource!: Resource;
  @Input() job!: Job;
  constructor(public readonly playerService: PlayerService) {}
}
