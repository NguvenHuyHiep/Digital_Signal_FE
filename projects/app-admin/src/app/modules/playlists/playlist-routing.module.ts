import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistsComponent } from './components/playlist/playlists/playlists.component';
import { PlaylistAddComponent } from './components/playlist/playlist-add/playlist-add.component';
import { AuthenGuardService } from '@app-api/lib/modules/authen/authen-guard.service';

const routes: Routes = [
  {
    path: '',
    component: PlaylistsComponent,
    canActivate: [AuthenGuardService],
  },
  {
    path: 'update/:playlistId',
    component: PlaylistAddComponent,
    canActivate: [AuthenGuardService],
  },
  {
    path: 'create',
    component: PlaylistAddComponent,
    canActivate: [AuthenGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaylistRoutingModule {}
