import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '@app-admin/app/modules/user/components/users/users.component';
import { UserAddComponent } from '@app-admin/app/modules/user/components/user-add/user-add.component';

let routes: Routes;
routes = [
  {
    path: '',
    component: UsersComponent,
  },
  {
    path: 'create',
    component: UserAddComponent,
  },
  {
    path: 'update/:userId',
    component: UserAddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class UserRoutingModule {}
