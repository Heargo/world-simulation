import { Component, OnInit } from '@angular/core';
import { firstValueFrom, take } from 'rxjs';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { ToastLevel } from '../../../../core/models/toast-level';
import { Game, GamePreview } from '../../models/game';
import { DbEntry } from '../../models/db';
import { ModalService } from '../../../../core/services/modal/modal.service';
import { SaveModalComponent } from '../../components/modal/save-modal/save-modal.component';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.scss'],
})
export class LoadingPageComponent implements OnInit {
  localSaves: DbEntry<GamePreview>[] = [];
  loadingDetails: 'local' | 'new' | null = null;

  constructor(
    public readonly loadingService: LoadingService,
    private readonly toasts: ToastService,
    private readonly router: Router,
    private readonly modalService: ModalService
  ) {}

  async ngOnInit(): Promise<void> {}

  async onStartGame(): Promise<void> {
    this.modalService
      .open(SaveModalComponent, {
        title: 'Create Game',
        message: 'Please enter a name for the new game.',
        confirmText: 'create game',
      })
      .pipe(take(1))
      .subscribe(async event => {
        if (event.success) {
          this.toasts.ShowLoading('Loading world', true);
          this.loadingService.currentGameName = event.data;
          await firstValueFrom(
            this.loadingService.loadWorld('assets/maps/default-map.json')
          );
          await firstValueFrom(
            this.loadingService.loadSvgMap('assets/maps/default-map.svg')
          );
        }
      });
  }

  async onLoadFromSave(): Promise<void> {
    this.toasts.Show('Not implemented yet', ToastLevel.Warning);
  }

  async getLocalSaves(): Promise<void> {
    this.toasts.ShowLoading('Loading local saves');
    this.localSaves = await this.loadingService.getLocalSaves();
    this.loadingDetails = 'local';
    if (this.localSaves.length === 0) {
      this.toasts.Show('No saves found', ToastLevel.Warning);
    }
    this.toasts.HideLoading();
  }

  async onLoadGame(gamePreview: DbEntry<GamePreview>): Promise<void> {
    this.toasts.ShowLoading('Loading world');
    const game = await this.loadingService.getLocalSave(
      gamePreview.data.gameDataId
    );
    this.loadingService.loadGame(game, gamePreview);
    this.loadingService.loadComplete = true;
    this.router.navigate(['game/transport/road']);
    this.toasts.HideLoading();
  }

  async onSvgRendered() {
    const container = document.getElementById('svg-map-container')!;
    const svg = container.querySelector('svg')!;

    this.loadingService.loadTransportationGrids(svg);
    this.loadingService.loadCompleted();
    this.toasts.HideLoading();

    //redirect to the transport page
    this.router.navigate(['game/transport/road']);
  }
}
