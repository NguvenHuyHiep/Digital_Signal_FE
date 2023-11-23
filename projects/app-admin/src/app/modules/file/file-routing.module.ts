import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesComponent } from './components/files/files.component';
import { FileAddComponent } from './components/file-add/file-add.component';

const routes: Routes = [
  {
    path: '',
    component: FilesComponent,
  },
  {
    path: 'create',
    component: FileAddComponent,
  },
  {
    path: 'update/:fileId',
    component: FileAddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileRoutingModule {}
