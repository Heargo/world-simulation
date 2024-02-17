import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingPageComponent } from './loading-page/loading-page.component';
import { WorldSimulationRoutingModule } from './world-simulation-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MapComponent } from './map/map.component';
import { BurgCardComponent } from './burg-card/burg-card.component';
import { TransportPageComponent } from './transport-page/transport-page.component';
import { TransportOptionsComponent } from './transport-options/transport-options.component';
import { VehiculeCardComponent } from './vehicule-card/vehicule-card.component';
import { VehiculeCardDetailedComponent } from './vehicule-card-detailed/vehicule-card-detailed.component';

@NgModule({
  declarations: [
    LoadingPageComponent,
    MapComponent,
    BurgCardComponent,
    TransportPageComponent,
    TransportOptionsComponent,
    VehiculeCardComponent,
    VehiculeCardDetailedComponent,
  ],
  imports: [CommonModule, WorldSimulationRoutingModule, SharedModule],
})
export class WorldSimulationModule {}
