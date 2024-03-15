import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenGuardService } from '@app-api/lib/modules/authen/authen-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/welcome/welcome.module').then((m) => m.WelcomeModule),
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/login/login.module').then((m) => m.LoginModule),
      },
    ],
  },
  {
    path: 'otp',
    pathMatch: 'full',
    redirectTo: '/auth/otp',
  },
  {
    path: 'login',
    pathMatch: 'full',
    redirectTo: '/auth/login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthenGuardService],
})
export class AppAdminRoutingModule {}
