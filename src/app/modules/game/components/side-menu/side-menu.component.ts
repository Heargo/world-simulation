import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { PlayerService } from '../../services/player.service';
import { WorldService } from '../../services/world.service';

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
