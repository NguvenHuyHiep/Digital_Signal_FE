import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../../../../../../app-api/src/lib/api/models/user";
import {LhTableComponent} from "../../../../../../../app-common/src/lib/components/lh-table/lh-table.component";
import {UserAddComponent} from "../user-add/user-add.component";
import {
  LhTableConfigModel,
  LhTableFieldType
} from "../../../../../../../app-common/src/lib/components/lh-table/lh-table-config.model";
import {AdminUserService} from "../../../../../../../app-api/src/lib/modules/admin/admin-user/admin-user.service";
import {TranslateService} from "@ngx-translate/core";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-admin-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  sortBy: any;
  sortDirection: any;
  keyword: any;
  page?: number;
  size?: number;
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
    fields: [
      {
        label: 'user-detail.user.userName',
        field: 'userName',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'user-detail.user.email',
        field: 'email',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'user-detail.user.phone',
        field: 'phone',
        type: LhTableFieldType.STRING,
      },
      {
        label: 'user-detail.user.roles',
        field: 'roles',
        type: LhTableFieldType.STRING,
      },
    ],
  };
  currentUser?: User;

  constructor(
    private adminUserService: AdminUserService,
    private translateService: TranslateService,
    private message: NzMessageService
  ) {}

  get isSelectedRow(): boolean {
    return (this.table?.setOfCheckedId?.size || 0) > 0;
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.loading.searching = true;
    this.adminUserService
      .getAllUserByPaging().subscribe({
        next: (response) => {
          if (response.data) {
            this.users = response.data as Array<User>;
            console.log(this.users + "user");
          }
        },
        error: (err) => {
          //TODO xu ly exception
          this.message.error("Error", err);
          this.loading.searching = false;
        },
        complete: () => {
          this.loading.searching = false;
        },
      });
  }

  add() {}

  gotoSearch() {
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
    this.showFrame.add = true;
    this.showFrame.search = false;
  }

  delete() {}
}
