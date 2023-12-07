import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome.component';
import { AuthenGuardService } from '@app-api/lib/modules/authen/authen-guard.service';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    canActivate: [AuthenGuardService],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'search' },
      {
        path: 'dashboard',
        data: {
          label: 'module.dashboard.title',
        },
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'playlist',
        data: {
          label: 'module.playlist.title',
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
          import('../user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'device-group',
        data: {
          label: 'module.groupDevice.title',
        },
        loadChildren: () =>
          import('../device-group/device-group.module').then(
            (m) => m.DeviceGroupModule
          ),
      },
      {
        path: 'device',
        data: {
          label: 'module.device.title',
        },
        loadChildren: () =>
          import('../device/device.module').then((m) => m.DeviceModule),
      },
      {
        path: 'file',
        data: {
          label: 'module.file.title',
        },
        loadChildren: () =>
          import('../file/file.module').then((m) => m.FileModule),
      },
      {
        path: 'schedule',
        data: {
          label: 'module.schedule.title',
        },
        loadChildren: () =>
          import('../schedule/schedule.module').then((m) => m.ScheduleModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeRoutingModule {}
