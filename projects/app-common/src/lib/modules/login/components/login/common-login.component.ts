import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { environment } from '@app-admin/environments/environment';
import { Lang, SupportLang } from '@app-api/lib/api/models/language.model';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
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
  lang: Lang = {
    locale: '',
    supportlangs: [],
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private authenService: LhAuthenService,
    private languageService: LhLanguageService,
    private waterMarkService: WaterMarkService,
    private translateService: TranslateService,
    private lhLanguageService: LhLanguageService
  ) {}

  ngOnInit(): void {
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
      userName: [this.initUsername, [Validators.required]],
      password: [this.initPassword, [Validators.required]],
      remember: [true],
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
    if (this.validateForm.valid) {
      this.authenService
        .login(
          this.validateForm.controls['userName'].value,
          this.validateForm.controls['password'].value
        )
        .subscribe({
          next: (response) => {
            if (response && response.status === ResponseStatus.Success) {
              this.router.navigate(['/dashboard']);
            }
          },
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
    this.lang.locale = locale;
    this.languageService.setLang(this.lang);
  }

  public get getCurrentLangObj(): any {
    return this.lang.supportlangs.find((f) => f.value === this.lang.locale);
  }
}
