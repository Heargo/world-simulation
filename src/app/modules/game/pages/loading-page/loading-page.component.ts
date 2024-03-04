import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { ToastLevel } from '../../../../core/models/toast-level';
import { Game } from '../../models/game';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.scss'],
})
export class LoadingPageComponent implements OnInit {
  localSaves: Game[] = [];
  loadingDetails: 'local' | 'new' | null = null;

  constructor(
    public readonly loadingService: LoadingService,
    private readonly toasts: ToastService,
    private readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {}

  async onStartGame(): Promise<void> {
    this.toasts.ShowLoading('Loading world', true);
    await firstValueFrom(
      this.loadingService.loadWorld('assets/maps/default-map.json')
    );
    await firstValueFrom(
      this.loadingService.loadSvgMap('assets/maps/default-map.svg')
    );
  }

  async onLoadFromSave(): Promise<void> {
    this.toasts.Show('Not implemented yet', ToastLevel.Warning);
  }

  async getLocalSaves(): Promise<void> {
    this.toasts.ShowLoading('Loading local saves');
    this.localSaves = await this.loadingService.getLocalSaves();
    this.loadingDetails = 'local';
    // console.log('localSaves', this.localSaves);
    if (this.localSaves.length === 0) {
      this.toasts.Show('No saves found', ToastLevel.Warning);
    }
    this.toasts.HideLoading();
  }

  async onLoadGame(game: Game): Promise<void> {
    this.toasts.ShowLoading('Loading world');
    this.loadingService.loadGame(game);
    this.loadingService.loadComplete = true;
    console.log('loaded game', game);
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

    // console.log(this.worldService.getBurgsByAttractivity(99));
  }
}
