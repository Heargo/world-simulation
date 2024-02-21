import { Component } from '@angular/core';
import { LoadingService } from '../../../modules/world-simulation/services/loading.service';
import { WorldService } from '../../../modules/world-simulation/services/world.service';
import { PlayerService } from '../../../modules/world-simulation/services/player.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  constructor(
    public readonly loadingService: LoadingService,
    public readonly worldService: WorldService,
    public readonly playerService: PlayerService,
    private readonly router: Router
  ) {}

  onGameplayClick(route: string): void {
    this.router.navigate([route]);
  }
}
