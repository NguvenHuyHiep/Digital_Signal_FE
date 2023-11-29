import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { WatermarkModule } from '../watermark/watermark.module';
import { LhPageComponent } from './lh-common-page/lh-common-page.component';

@NgModule({
  declarations: [LhPageComponent],
  imports: [
    CommonModule,
    WatermarkModule,
    RouterModule,
    TranslateModule,
    NzBreadCrumbModule,
    NzPageHeaderModule,
    NzSpinModule,
  ],
  exports: [NzBreadCrumbModule, LhPageComponent],
})
export class UiCommonModule {}
