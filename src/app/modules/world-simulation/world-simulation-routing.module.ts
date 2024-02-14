import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { TestPageComponent } from './test-page/test-page.component';

const routes: Routes = [
  {
    path: '',
    component: TestPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorldSimulationRoutingModule {}
