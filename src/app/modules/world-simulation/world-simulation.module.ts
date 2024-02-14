import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestPageComponent } from './test-page/test-page.component';
import { WorldSimulationRoutingModule } from './world-simulation-routing.module';

@NgModule({
  declarations: [TestPageComponent],
  imports: [CommonModule, WorldSimulationRoutingModule],
})
export class WorldSimulationModule {}
