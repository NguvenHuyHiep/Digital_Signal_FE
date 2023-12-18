import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { User } from '@app-api/lib/api/models/user';
import { LhTableComponent } from '@app-common/lib/components/lh-table/lh-table.component';
import { UserAddComponent } from '@app-admin/app/modules/user/components/user-add/user-add.component';
import {
  LhTableConfigModel,
  LhTableFieldType,
} from '@app-common/lib/components/lh-table/lh-table-config.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminUserService } from '@app-api/lib/modules/admin/admin-user/admin-user.service';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { ColumnItem } from '@app-api/lib/api/models/columnItem';

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

  tableColumns: ColumnItem<User>[] = [
    {
      name: 'module.user.userName',
      key: 'userName',
    },
    {
      name: 'module.user.email',
      key: 'email',
    },
    {
      name: 'module.user.phone',
      key: 'phone',
    },
    {
      name: 'module.user.license',
      key: 'license',
    },
  ];

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
                if (response && response.status === ResponseStatus.Success) {
                  this.message.create(
                    'success',
                    response.message
                      ? response.message
                      : this.translateService.instant('common.deleteSuccess')
                  );
                  this.users = this.users.filter((u) => u.id !== user.id);
                } else {
                  let errorsInStr: string = response.errors
                    ?.map((e) => this.translateService.instant(e))
                    .join(', ') as string;
                  this.message.error(errorsInStr);
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
