import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { environment } from '@app-admin/environments/environment';
import { LhAuthenService } from '@app-api/lib/modules/authen/lh-authen.service';
import { LhLanguageService } from '@app-api/lib/modules/language/lh-language.service';
import { LhStorageService } from '@app-api/lib/modules/local-store/lh-storage.service';
import { WaterMarkService } from '@app-common/public-api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lh-common-login',
  templateUrl: './common-login.component.html',
  styleUrls: ['./common-login.component.scss'],
})
export class CommonLoginComponent implements OnInit {
  @Input() initUsername?: string;
  @Input() initPassword?: string;

  validateForm!: UntypedFormGroup;
  selectLanguage: string = 'en';
  supportLangs = [
    { label: 'lang.en', value: 'en', img: '' },
    { label: 'lang.vi', value: 'vi', img: '' },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private authenService: LhAuthenService,
    private languageService: LhLanguageService,
    private waterMarkService: WaterMarkService,
    private translateService: TranslateService,
    private storeService: LhStorageService
  ) {}

  ngOnInit(): void {
    this.storeService.language.subscribe({
      next: (value) => {
        if (value) {
          this.updateLocale(value);
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });

    this.validateForm = this.fb.group({
      userName: [this.initUsername, [Validators.required]],
      password: [this.initPassword, [Validators.required]],
      remember: [true],
    });
    this.selectLanguage = this.languageService.currentLang;
    this.supportLangs = this.languageService.supportLangs;
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
    if (this.validateForm.valid) {
      this.authenService
        .login(
          this.validateForm.controls['userName'].value,
          this.validateForm.controls['password'].value
        )
        .subscribe({
          error: (err) => {
            console.log(err);
          },
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

  updateLocale(locale: string) {
    this.selectLanguage = locale;
    this.languageService.updateLocale(locale, true);
  }

  public get getCurrentLangObj(): any {
    return this.supportLangs.find((f) => f.value === this.selectLanguage);
  }
}
