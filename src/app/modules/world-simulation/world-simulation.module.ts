import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestPageComponent } from './test-page/test-page.component';
import { WorldSimulationRoutingModule } from './world-simulation-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [TestPageComponent],
  imports: [CommonModule, WorldSimulationRoutingModule, SharedModule],
})
export class WorldSimulationModule {}
