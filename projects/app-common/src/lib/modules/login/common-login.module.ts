import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonLoginComponent } from './components/login/common-login.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { TranslateModule } from '@ngx-translate/core';
import { CommonRegisterComponent } from './components/register/common-register.component';
import { CommonForgotPasswordComponent } from './components/forgot-password/common-forgot-password.component';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { CommonOtpComponent } from './components/otp/common-otp.component';
import { NzMessageModule } from 'ng-zorro-antd/message';

@NgModule({
  declarations: [
    CommonLoginComponent,
    CommonRegisterComponent,
    CommonForgotPasswordComponent,
    CommonOtpComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzCheckboxModule,
    NzInputModule,
    NzSelectModule,
    NzGridModule,
    NzToolTipModule,
    TranslateModule,
    RouterModule,
    NzCardModule,
    NzAvatarModule,
    NzMessageModule,
  ],
  exports: [
    CommonLoginComponent,
    CommonRegisterComponent,
    CommonForgotPasswordComponent,
    CommonOtpComponent,
  ],
})
export class CommonLoginModule {}
