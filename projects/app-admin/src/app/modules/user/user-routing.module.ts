import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '@app-admin/app/modules/user/components/users/users.component';
import { UserAddComponent } from '@app-admin/app/modules/user/components/user-add/user-add.component';
import { UserInformationComponent } from '@app-admin/app/modules/user/components/user-information/user-information.component';
import { AuthenGuardService } from '@app-api/lib/modules/authen/authen-guard.service';

let routes: Routes;
routes = [
  {
    path: '',
    component: UsersComponent,
    canActivate: [AuthenGuardService],
  },
  {
    path: 'create',
    component: UserAddComponent,
    canActivate: [AuthenGuardService],
  },
  {
    path: 'update/:userId',
    component: UserAddComponent,
    canActivate: [AuthenGuardService],
  },
  {
    path: 'information/:userEmail',
    component: UserInformationComponent,
    canActivate: [AuthenGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class UserRoutingModule {}
