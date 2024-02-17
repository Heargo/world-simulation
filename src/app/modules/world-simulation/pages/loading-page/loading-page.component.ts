import { Component, OnInit } from '@angular/core';
import { WorldService } from '../../services/world.service';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.scss'],
})
export class LoadingPageComponent implements OnInit {
  constructor(
    public readonly worldService: WorldService,
    private readonly toasts: ToastService,
    private readonly router: Router
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

    //redirect to the transport page
    this.router.navigate(['game/transport/road']);

    // console.log(this.worldService.getBurgsByAttractivity(99));
  }
}
