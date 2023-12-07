import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesComponent } from '@app-admin/app/modules/file/components/files/files.component';
import { FileAddComponent } from '@app-admin/app/modules/file/components/file-add/file-add.component';
import { AuthenGuardService } from '@app-api/lib/modules/authen/authen-guard.service';

const routes: Routes = [
  {
    path: '',
    component: FilesComponent,
    canActivate: [AuthenGuardService],
  },
  {
    path: 'create',
    component: FileAddComponent,
    canActivate: [AuthenGuardService],
  },
  {
    path: 'update/:fileId',
    component: FileAddComponent,
    canActivate: [AuthenGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileRoutingModule {}
