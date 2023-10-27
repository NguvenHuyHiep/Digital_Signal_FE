import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import { LhPageComponent } from './lh-common-page/lh-common-page.component';
import {WatermarkModule} from "../watermark/watermark.module";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    LhPageComponent
  ],
  imports: [
    CommonModule,
    NzBreadCrumbModule,
    WatermarkModule,
    NzPageHeaderModule,
    RouterModule,
    TranslateModule
  ],
  exports: [
    NzBreadCrumbModule,
    LhPageComponent
  ]
})
export class UiCommonModule {
}
