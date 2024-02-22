import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { BaseAppComponent } from '../base-app/base-app.component';
import { LoadingService } from '../../../modules/game/services/loading.service';
import { PlayerService } from '../../../modules/game/services/player.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent extends BaseAppComponent {
  //isConnected = false;
  //use AuthentificationService to get the current user
  constructor(
    public readonly authService: AuthService,
    public readonly playerService: PlayerService,
    public readonly loadingService: LoadingService
  ) {
    super();
  }
}
