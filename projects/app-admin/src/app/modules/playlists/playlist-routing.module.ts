import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistsComponent } from './components/playlist/playlists/playlists.component';
import { PlaylistAddComponent } from './components/playlist/playlist-add/playlist-add.component';

const routes: Routes = [
  {
    path: '',
    component: PlaylistsComponent,
  },
  {
    path: 'update/:playlistId',
    component: PlaylistAddComponent,
  },
  {
    path: 'create',
    component: PlaylistAddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaylistRoutingModule {}
