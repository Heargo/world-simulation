import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { VehiculeDestination } from './pipes/vehicule-destination.pipe';
import { vehiculeTimeLeft } from './pipes/vehicule-time-left.pipe';
import { VehiculeAvailable } from './pipes/vehicule-in-burg.pipe';
import { JobPageComponent } from './pages/job-page/job-page.component';
import { HarvestSpeed } from './pipes/harvest-speed.pipe';
import { CanHarvestPipe } from './pipes/can-harvest.pipe';
import { ResourceCardComponent } from './components/resource-card/resource-card.component';

@NgModule({
  declarations: [
    LoadingPageComponent,
    MapComponent,
    BurgCardComponent,
    TransportPageComponent,
    TransportOptionsComponent,
    VehiculeCardComponent,
    VehiculeCardDetailedComponent,
    VehiculeDestination,
    vehiculeTimeLeft,
    VehiculeAvailable,
    JobPageComponent,
    HarvestSpeed,
    CanHarvestPipe,
    ResourceCardComponent,
  ],
  imports: [CommonModule, WorldSimulationRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WorldSimulationModule {}
