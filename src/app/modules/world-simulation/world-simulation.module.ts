import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingPageComponent } from './loading-page/loading-page.component';
import { WorldSimulationRoutingModule } from './world-simulation-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MapComponent } from './map/map.component';
import { BurgCardComponent } from './burg-card/burg-card.component';
import { TransportPageComponent } from './transport-page/transport-page.component';

@NgModule({
  declarations: [
    LoadingPageComponent,
    MapComponent,
    BurgCardComponent,
    TransportPageComponent,
  ],
  imports: [CommonModule, WorldSimulationRoutingModule, SharedModule],
})
export class WorldSimulationModule {}
