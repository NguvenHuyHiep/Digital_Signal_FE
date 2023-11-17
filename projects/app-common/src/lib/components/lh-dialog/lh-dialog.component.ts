import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'lh-common-lh-dialog',
  templateUrl: './lh-dialog.component.html',
  styleUrls: ['./lh-dialog.component.scss'],
})
export class LhDialogComponent {
  @Input() footerTemplateRight?: TemplateRef<any>;
  @Input() footerTemplateLeft?: TemplateRef<any>;
  @Input() expandTemplate?: TemplateRef<any>;
  @Input() loading: boolean = false;
}
