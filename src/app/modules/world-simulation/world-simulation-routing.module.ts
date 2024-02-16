import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingPageComponent } from './loading-page/loading-page.component';
import { TransportPageComponent } from './transport-page/transport-page.component';

const routes: Routes = [
  {
    path: '',
    component: LoadingPageComponent,
  },
  {
    path: 'transport/:type',
    component: TransportPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorldSimulationRoutingModule {}
