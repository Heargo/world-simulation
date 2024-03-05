import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingPageComponent } from './pages/loading-page/loading-page.component';
import { GameRoutingModule } from './game-routing.module';
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
import { InventoryPageComponent } from './pages/inventory-page/inventory-page.component';
import { GameComponent } from './game.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { InventoryCategoryPipe } from './pipes/inventory-category.pipe';
import { InventoryTabUnlockedPipe } from './pipes/inventory-tab-unlocked.pipe';
import { SaveModalComponent } from './components/modal/save-modal/save-modal.component';
import { OfflineGainsModalComponent } from './components/modal/offline-gains-modal/offline-gains-modal.component';

@NgModule({
  declarations: [
    GameComponent,
    NavBarComponent,
    SideMenuComponent,
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
    InventoryCategoryPipe,
    InventoryTabUnlockedPipe,
    ResourceCardComponent,
    InventoryPageComponent,
    SaveModalComponent,
    OfflineGainsModalComponent,
  ],
  imports: [CommonModule, GameRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GameModule {}
