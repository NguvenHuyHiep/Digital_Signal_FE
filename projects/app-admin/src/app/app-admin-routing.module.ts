import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenGuardService} from '../../../app-api/src/lib/modules/authen/authen-guard.service';

const routes: Routes = [{
  path: '', loadChildren: () => import('./modules/welcome/welcome.module').then((m) => m.WelcomeModule),
}, {
  path: 'login', loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule),
}, {
  path: 'register', loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule),
}, {
  path: 'forgot-password',
  loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule),
},];

@NgModule({
  imports: [RouterModule.forRoot(routes)], exports: [RouterModule], providers: [AuthenGuardService],
})
export class AppAdminRoutingModule {
}
