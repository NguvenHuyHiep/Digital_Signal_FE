import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistsComponent } from './components/playlist/playlists/playlists.component';
import { PlaylistComponent } from './components/playlist/playlist/playlist.component';
import { PlaylistAddComponent } from './components/playlist/playlist-add/playlist-add.component';

const routes: Routes = [
  {
    path: '',
    component: PlaylistsComponent,
  },
  {
    path: ':file',
    component: PlaylistComponent,
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
