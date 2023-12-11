import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';
import { Lang } from '@app-api/lib/api/models/language.model';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LhStorageService } from '../local-store/lh-storage.service';
import { vi_VN, en_US, NzI18nService } from 'ng-zorro-antd/i18n';

@Injectable({
  providedIn: 'root',
})
export class LhLanguageService {
  private _lang: Lang = {
    locale: 'en',
    supportlangs: [
      {
        label: 'lang.en',
        value: 'en',
        img: '/assets/images/multiplelanguage/icons8-great-britain-48.png',
        angularLocale: en_US,
      },
      {
        label: 'lang.vi',
        value: 'vi',
        img: '/assets/images/multiplelanguage/icons8-vietnam-48.png',
        angularLocale: vi_VN,
      },
    ],
  };

  private _langSubject: BehaviorSubject<Lang> = new BehaviorSubject(this._lang);

  constructor(
    private nzI18nService: NzI18nService,
    private translate: TranslateService,
    private store: LhStorageService
  ) {
    this.store.language.subscribe({
      next: (value) => {
        this._lang.locale = value || 'en';
        this.setLang(this._lang);
      },
    });
  }

  public get lang(): Observable<Lang> {
    return this._langSubject.asObservable();
  }

  public getLang() {
    return this._langSubject.getValue();
  }

  public setLang(lang: Lang): void {
    this.updateInputLocale(lang.locale);
    this._langSubject.next(lang);
  }

  private getSystemLocale(defaultValue?: string): string {
    if (
      typeof window === 'undefined' ||
      typeof window.navigator === 'undefined'
    ) {
      return defaultValue || 'en';
    }
    const wn = window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : defaultValue;
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    return lang;
  }

  private updateInputLocale(locale?: string) {
    let newLocale = locale || this.getSystemLocale();
    this.nzI18nService.setLocale(
      this._lang.supportlangs.find((sp) => sp.value === newLocale)
        ?.angularLocale || en_US
    );
    this.translate.setDefaultLang(newLocale);
    this.translate.use(newLocale);
    this.store.setLanguage(newLocale).subscribe({
      next(value) {
        console.log(value);
      },
    });
  }
}
