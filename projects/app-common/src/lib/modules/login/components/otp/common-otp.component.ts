import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { showErrorMessage } from '@app-admin/app/utils/error-msg-utils';
import { environment } from '@app-admin/environments/environment';
import { Lang } from '@app-api/lib/api/models/language.model';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { LhAuthenService } from '@app-api/lib/modules/authen/lh-authen.service';
import { LhLanguageService } from '@app-api/lib/modules/language/lh-language.service';
import { LhStorageService } from '@app-api/lib/modules/local-store/lh-storage.service';
import { WaterMarkService } from '@app-common/public-api';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'lh-common-otp',
  templateUrl: './common-otp.component.html',
  styleUrls: ['./common-otp.component.scss'],
})
export class CommonOtpComponent implements OnInit {
  validateForm!: UntypedFormGroup;
  lang: Lang = {
    locale: '',
    supportlangs: [],
  };
  email?: string;

  constructor(
    private fb: UntypedFormBuilder,
    private waterMarkService: WaterMarkService,
    private translateService: TranslateService,
    private lhLanguageService: LhLanguageService,
    private message: NzMessageService,
    private storageService: LhStorageService,
    private lhAuthenService: LhAuthenService,
    private router: Router
  ) {
    this.email = this.storageService.getEmail();
  }

  ngOnInit(): void {
    console.log(this.email);

    this.lhLanguageService.lang.subscribe({
      next: (lang: Lang) => {
        this.lang = lang;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });

    this.validateForm = this.fb.group({
      otp: ['', [Validators.required]],
    });

    setTimeout(() => {
      this.translateService
        .get(environment.WATER_MARK)
        .subscribe((translated: string) => {
          this.waterMarkService.updateWatermark.next(
            this.translateService.instant(environment.WATER_MARK)
          );
        });
    }, 100);
  }

  submitForm(): void {
    if (!this.email) {
      this.message.error(
        this.translateService.instant('login.error.email-invalid')
      );
      return;
    }

    if (this.validateForm.valid) {
      console.log(this.validateForm.value);
      const otp = this.validateForm.value.otp ?? undefined;
      if (!otp) {
        this.message.error(
          this.translateService.instant('login.error.otp-invalid')
        );
        return;
      }
      this.lhAuthenService.verifyOtp(this.email, otp).subscribe({
        next: (response) => {
          console.log(response);
          if (response && response.status === ResponseStatus.Success) {
            this.router.navigate(['/dashboard']);
          } else if (response && response.status === ResponseStatus.Failed) {
            showErrorMessage(
              this.message,
              this.translateService,
              response.errors as string[]
            );
          } else {
            this.message.error(
              this.translateService.instant('login.error.login-failed')
            );
          }
        },
        error: (err) => {
          console.error(err);
          if (err instanceof HttpErrorResponse) {
            showErrorMessage(
              this.message,
              this.translateService,
              err.error.errors
            );
          } else {
            this.message.error(
              this.translateService.instant('login.error.login-failed')
            );
          }
        },
        complete: () => {},
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
