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
            path: 'device-group',
            data: {
                label: 'Group Device',
            },
            loadChildren: () =>
                import('../device-group/device-group.module').then(
                    (m) => m.DeviceGroupModule
                ),
        },
    {
      path: 'device',
      data: {
        label: 'Device',
      },
      loadChildren: () =>
        import('../device/device.module').then(
          (m) => m.DeviceModule
        ),
    }],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeRoutingModule {}
