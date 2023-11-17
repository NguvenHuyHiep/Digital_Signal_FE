import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserService } from './admin-user.service';
import { AdminLicenseService } from '../admin-license/admin-license.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [AdminUserService, AdminLicenseService],
})
export class AdminUserModule {}
