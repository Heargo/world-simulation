import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { BaseAppComponent } from '../../../../core/components/base-app/base-app.component';
import { LoadingService } from '../../services/loading.service';
import { PlayerService } from '../../services/player.service';
import { ModalService } from '../../../../core/services/modal/modal.service';
import { SaveModalComponent } from '../modal/save-modal/save-modal.component';
import { take } from 'rxjs';

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
    public readonly loadingService: LoadingService,
    private readonly modalService: ModalService
  ) {
    super();
  }

  saveGame() {
    this.modalService
      .open(SaveModalComponent, {
        title: 'Save Game',
        message:
          'Do you want to save the game? Please enter a name for the save.',
        confirmText: 'Save',
      })
      .pipe(take(1))
      .subscribe(event => {
        if (event.success) {
          this.loadingService.saveGame(event.data);
        }
      });
  }
}
