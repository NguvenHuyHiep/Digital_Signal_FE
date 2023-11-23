import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LhTableComponent } from './lh-table.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@NgModule({
  declarations: [LhTableComponent],
  imports: [
    CommonModule,
    NzTableModule,
    NzDividerModule,
    TranslateModule,
    NzButtonModule,
    NzPaginationModule,
  ],
  providers: [DatePipe],
  exports: [LhTableComponent],
})
export class LhTableModule {}
