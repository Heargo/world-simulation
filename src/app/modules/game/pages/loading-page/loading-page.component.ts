import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { ToastLevel } from '../../../../core/models/toast-level';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.scss'],
})
export class LoadingPageComponent implements OnInit {
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

  async onLoadFromLocal(): Promise<void> {
    this.toasts.ShowLoading('Loading world');
    const saves = await this.loadingService.getLocalSaves();
    console.log('saves', saves);
    let game = saves[0];
    console.log('game', game);
    if (game) {
      this.loadingService.loadGame(game);
      this.loadingService.loadComplete = true;
      this.toasts.HideLoading();
      this.router.navigate(['game/transport/road']);
    } else {
      this.toasts.HideLoading();
      this.toasts.Show('No local save found', ToastLevel.Error);
    }
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
