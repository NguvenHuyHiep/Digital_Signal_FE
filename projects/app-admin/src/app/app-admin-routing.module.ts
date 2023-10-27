import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenGuardService} from '../../../app-api/src/lib/modules/authen/authen-guard.service';

const routes: Routes = [{
  path: '', loadChildren: () => import('./modules/welcome/welcome.module').then((m) => m.WelcomeModule),
}, {
  path: 'login', loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule),
}, {
  path: 'register', loadChildren: () => import('./modules/login/register.module').then((m) => m.RegisterModule),
}, {
  path: 'forgot-password',
  loadChildren: () => import('./modules/login/forgot-password.module').then((m) => m.ForgotPasswordModule),
},];

@NgModule({
  imports: [RouterModule.forRoot(routes)], exports: [RouterModule], providers: [AuthenGuardService],
})
export class AppAdminRoutingModule {
}
