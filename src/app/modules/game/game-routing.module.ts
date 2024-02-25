import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobPageComponent } from './pages/job-page/job-page.component';
import { LoadingPageComponent } from './pages/loading-page/loading-page.component';
import { TransportPageComponent } from './pages/transport-page/transport-page.component';
import { InventoryPageComponent } from './pages/inventory-page/inventory-page.component';
import { GameComponent } from './game.component';

const routes: Routes = [
  {
    path: '',
    component: GameComponent,
    children: [
      {
        path: 'loading',
        component: LoadingPageComponent,
      },
      {
        path: 'transport/:type',
        component: TransportPageComponent,
      },
      {
        path: 'job/:jobType',
        component: JobPageComponent,
      },
      {
        path: 'inventory',
        component: InventoryPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
