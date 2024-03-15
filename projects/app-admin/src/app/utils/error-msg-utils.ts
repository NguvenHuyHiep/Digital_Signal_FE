import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

export const showErrorMessage = (
  messageService: NzMessageService,
  translateService: TranslateService,
  errors: string[]
): void => {
  if (messageService && errors) {
    let content = `<ul>`;
    errors.forEach((error) => {
      content += `<li>${translateService.instant(error)}</li>`;
    });
    content += `</ul>`;
    messageService.error(content, { nzDuration: 2000 });
  }
};
