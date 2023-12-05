import { Component, OnInit } from '@angular/core';
import { User } from '@app-api/lib/api/models/user';
import { AdminUserService } from '@app-api/lib/modules/admin/admin-user/admin-user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss'],
})
export class UserInformationComponent implements OnInit {
  user?: User;
  userEmail: string | undefined;

  constructor(
    private adminUserService: AdminUserService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.userEmail = this.activatedRoute.snapshot.params['userEmail'];
  }

  ngOnInit(): void {
    this.getUserByEmail(this.userEmail as string);
  }

  private getUserByEmail(userEmail: string) {
    this.adminUserService.getUserByEmail(userEmail).subscribe({
      next: (response) => {
        if (response && response.status === ResponseStatus.Success) {
          this.user = response.data;
          console.log;
        } else {
          let errorsInStr: string = response.errors
            ?.map((e) => this.translateService.instant(e))
            .join(', ') as string;
          this.message.error(errorsInStr);
        }
      },
      error: (err) => {
        this.message.error('Error', err);
      },
      complete: () => {},
    });
  }

  checkLicenseValidity(): boolean {
    if (this.user && this.user.license) {
      const currentDate = new Date().toISOString();

      const activationDate = this.user.license.activationDate || '';
      const expirationDate = this.user.license.expirationDate || '';

      return currentDate < expirationDate && currentDate >= activationDate;
    }
    return false;
  }
}
