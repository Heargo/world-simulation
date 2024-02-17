import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingPageComponent } from './pages/loading-page/loading-page.component';
import { WorldSimulationRoutingModule } from './world-simulation-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MapComponent } from './components/map/map.component';
import { BurgCardComponent } from './components/burg-card/burg-card.component';
import { TransportPageComponent } from './pages/transport-page/transport-page.component';
import { TransportOptionsComponent } from './components/transport-options/transport-options.component';
import { VehiculeCardComponent } from './components/vehicule-card/vehicule-card.component';
import { VehiculeCardDetailedComponent } from './components/vehicule-card-detailed/vehicule-card-detailed.component';

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
