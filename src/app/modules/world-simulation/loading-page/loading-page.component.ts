import { Component, OnInit } from '@angular/core';
import { WorldService } from '../../../core/services/world/world.service';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.scss'],
})
export class LoadingPageComponent implements OnInit {
  constructor(
    public readonly worldService: WorldService,
    private readonly toasts: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    this.toasts.ShowLoading('Loading world', true);
    await firstValueFrom(
      this.worldService.loadWorld('assets/maps/default-map.json')
    );
    await firstValueFrom(
      this.worldService.loadSvgMap('assets/maps/default-map.svg')
    );
  }

  onSvgRendered() {
    const container = document.getElementById('svg-map-container')!;
    const svg = container.querySelector('svg')!;

    this.worldService.loadTransportationGrids(svg);
    this.worldService.loadComplete = true;
    this.toasts.HideLoading();

    console.log(this.worldService.getBurgsByAttractivity(99));
  }
}
