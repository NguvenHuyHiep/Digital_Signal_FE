import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from './components/welcome.component';

const routes: Routes = [{
  path: '', component: WelcomeComponent, children: [{path: '', pathMatch: 'full', redirectTo: 'search'}, {
    path: 'dashboard', data: {
      label: 'module.dashboard.title',
    }, loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
    {
      path: 'playlist',
      data: {
        label: 'Danh sách phát',
      },
      loadChildren: () =>
        import('../playlists/playlists.module').then(
          (m) => m.PlaylistsModule
        ),
    },
    {
      path: 'user',
      data: {
        label: 'module.user.title',
      },
      loadChildren: () =>
        import('../user/user.module').then(
          (m) => m.UserModule
        ),
    },
    {
      path: 'group-device',
      data: {
        label: 'Group Device',
      },
      loadChildren: () =>
        import('../group-device-manage/group-device.module').then(
          (m) => m.GroupDeviceModule
        ),
    },
    {
      path: 'license',
      data: {
        label: 'License',
      },
      loadChildren: () =>
        import('../license/license.module').then(
          (m) => m.LicenseModule
        ),
    },

  ],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)], exports: [RouterModule],
})
export class WelcomeRoutingModule {
}
