import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from './components/welcome.component';

const routes: Routes = [{
  path: '', component: WelcomeComponent, children: [{path: '', pathMatch: 'full', redirectTo: 'search'}, {
    path: 'dashboard', data: {
      label: 'module.dashboard.title',
    }, loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
  }],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)], exports: [RouterModule],
})
export class WelcomeRoutingModule {
}
