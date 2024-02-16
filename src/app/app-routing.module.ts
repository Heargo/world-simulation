import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from './core/constants/routes';
import { NotFoundComponent } from './core/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'game',
    pathMatch: 'full',
  },
  {
    path: ROUTES.starterKit,
    loadChildren: () =>
      import('./modules/starter-kit/starter-kit.module').then(
        m => m.StarterKitModule
      ),
  },
  {
    path: ROUTES.authentification,
    loadChildren: () =>
      import('./modules/authentification/authentification.module').then(
        m => m.AuthentificationModule
      ),
  },
  {
    path: ROUTES.user,
    loadChildren: () =>
      import('./modules/user/user.module').then(m => m.UserModule),
  },
  {
    path: ROUTES.worldSimulation,
    loadChildren: () =>
      import('./modules/world-simulation/world-simulation.module').then(
        m => m.WorldSimulationModule
      ),
  },
  { path: ROUTES.notFound, component: NotFoundComponent },
  { path: '**', redirectTo: ROUTES.notFound },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
