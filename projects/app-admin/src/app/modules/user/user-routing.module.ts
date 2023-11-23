import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { UserAddComponent } from './components/user-add/user-add.component';

const routes: Routes = [
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
