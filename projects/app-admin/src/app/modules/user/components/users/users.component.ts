import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  showFrame: {
    search: boolean;
    add: boolean;
  } = {
    search: true,
    add: false,
  };
  query: {
    action?: string;
    id?: string;
  } = {
    action: undefined,
    id: undefined,
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
    private route: ActivatedRoute,
    private router: Router,
    private adminUserService: AdminUserService,
    private translateService: TranslateService,
    private message: NzMessageService
  ) {}

  get isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query.action = params['action'];
      this.query.id = params['id'];
      switch (this.query.action) {
        case 'add': {
          this.currentUser = {};
          this.openAddFrame();
          break;
        }
        case 'edit': {
          if (!this.query.id) {
            break;
          }
          if (
            this.currentUser &&
            this.currentUser.id === Number(this.query.id)
          ) {
            break;
          }
          break;
        }
        default: {
          this.gotoSearch();
          break;
        }
      }
    });

    this.getAll();
  }

  getAll(): void {
    this.loading.searching = true;
    this.adminUserService
      .getAllUserByPaging(0, 100, 'id', 'DESC', '')
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.users = response.data;
            console.log('response', response);
            console.log('this.users', this.users);
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

  addOrUpdate() {
    if (!this.addComponent) {
      return;
    }
    this.loading.adding = true;
    this.addComponent.addOrUpdateUser().subscribe({
      next: (response) => {
        if (response.data) {
          this.currentUser = response.data;
          if (this.query.action === 'add') {
            this.routeToEdit(response.data.id as number);
          }
          if (this.query.action === 'edit') {
            this.gotoSearch();
          }
          this.message.create(
            'success',
            this.translateService.instant('common.success')
          );
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
        this.loading.adding = false;
      },
    });
  }

  gotoSearch() {
    this.getAll();
    this.showFrame.search = true;
    this.showFrame.add = false;
  }

  openAddFrame() {
    this.currentUser = undefined;
    this.showFrame.search = false;
    this.showFrame.add = true;
  }

  deleteSelected() {}

  update(user: User) {
    this.currentUser = user;
    this.routeToEdit(user.id as number);
    this.showFrame.add = true;
    this.showFrame.search = false;
  }
  private routeToEdit(id: number) {
    const queryParams = { action: 'edit', id: id };
    this.router.navigate([], { queryParams }).then((r) => {});
  }

  delete(user: User) {
    this.adminUserService.deleteUser(user?.id as number).subscribe({
      next: (response) => {
        this.getAll();
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
  }

  navigateToCreate = (): void => {
    const queryParams = { action: 'add' };
    this.router.navigate([], { queryParams }).then((r) => {});
  };
  protected readonly translate = translate;

  routeToSearch() {
    this.router.navigate([]).then((r) => {});
  }
}
