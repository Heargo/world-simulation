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
    path: ROUTES.game,
    loadChildren: () =>
      import('./modules/game/game.module').then(m => m.GameModule),
  },
  { path: ROUTES.notFound, component: NotFoundComponent },
  { path: '**', redirectTo: ROUTES.notFound },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
