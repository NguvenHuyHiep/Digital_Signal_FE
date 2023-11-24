import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../../../../../app-api/src/lib/api/models/user';
import { LhTableComponent } from '../../../../../../../app-common/src/lib/components/lh-table/lh-table.component';
import { UserAddComponent } from '../user-add/user-add.component';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model';
import { AdminUserService } from '../../../../../../../app-api/src/lib/modules/admin/admin-user/admin-user.service';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { translate } from '@antv/g2/lib/util/transform';
import { ResponseStatus } from '../../../../../../../app-api/src/lib/api/models/responseStatus';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @Input() userAdmin?: User;
  showFrame: {
    search: boolean;
    add: boolean;
  } = {
    search: true,
    add: false,
  };
  users: Array<User> = [];

  @ViewChild('table') table?: LhTableComponent<User>;
  @ViewChild('addComponent', { static: false }) addComponent?: UserAddComponent;

  loading: {
    adding: boolean;
    searching: boolean;
  } = {
    adding: false,
    searching: false,
  };

  tableConfig: LhTableConfigModel = {
    key: 'id',
    disableDetail: true,
    fields: [
      {
        label: 'module.user.userName',
        field: 'userName',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.user.email',
        field: 'email',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.user.phone',
        field: 'phone',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'module.user.license',
        field: 'license.code',
        type: LhTableFieldType.STRING,
      },
    ],
  };
  currentUser?: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adminUserService: AdminUserService,
    private translateService: TranslateService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {}
  ngOnInit(): void {
    this.getAllUser();
  }
  get isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  getAllUser(): void {
    this.loading.searching = true;
    this.adminUserService
      .getAllUserByPaging(0, 100, 'id', 'DESC', '')
      .subscribe({
        next: (response) => {
          if (response && response.status === ResponseStatus.Success) {
            this.users = response.data as User[];
          } else {
            let errorsInStr: string = response.errors
              ?.map((e) => this.translateService.instant(e))
              .join(',') as string;
            this.message.error(errorsInStr);
            this.users = [];
          }
        },
        error: (err) => {
          this.message.create(
            'error',
            err.message
              ? err.message
              : this.translateService.instant('common.error')
          );
          console.log(err);
        },
        complete: () => {
          this.loading.searching = false;
        },
      });
  }
  deleteSelected() {}

  delete(user: User) {
    this.modalService.confirm({
      nzTitle:
        this.translateService.instant('module.user.modalDeleteUser') +
        `${user.userName}` +
        ' ?',
      nzOnOk: () => {
        new Promise((resolve, reject) => {
          return this.adminUserService
            .deleteUser(user?.id as number)
            .subscribe({
              next: (response) => {
                this.message.create(
                  'success',
                  response.message
                    ? response.message
                    : this.translateService.instant('common.deleteSuccess')
                );
              },
              error: (err) => {
                this.message.create(
                  'error',
                  err.message
                    ? err.message
                    : this.translateService.instant('common.error')
                );
                console.log(err);
              },
              complete: () => {
                this.loading.searching = false;
              },
            });
        });
      },
    });
  }

  navigateToCreate = (): void => {
    this.router.navigate(['./create'], {
      relativeTo: this.activatedRoute,
    });
  };

  navigateToUpdate = (record: User): void => {
    console.log(record);
    this.currentUser = record;
    this.router.navigate(['./update', record.id], {
      relativeTo: this.activatedRoute,
    });
  };
}
