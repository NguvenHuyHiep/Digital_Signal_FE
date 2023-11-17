import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LhStorageService } from '../local-store/lh-storage.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LhLanguageService {
  constructor(
    private translate: TranslateService,
    private store: LhStorageService
  ) {
    this.store.language.pipe(
      tap((value) => {
        if (!value || value == null) {
          let sysLocale = this.getSystemLocale();
          this.updateLocale(sysLocale);
        }
        this.updateLocale(value as string, false);
      })
    );
  }

  private _supportLangs = [
    {
      label: 'lang.en',
      value: 'en',
      img: '/assets/images/multiplelanguage/icons8-great-britain-48.png',
    },
    {
      label: 'lang.vi',
      value: 'vi',
      img: '/assets/images/multiplelanguage/icons8-vietnam-48.png',
    },
  ];

  get supportLangs() {
    return this._supportLangs;
  }

  private _currentLang: string = 'vi';

  get currentLang() {
    return this._currentLang;
  }

  updateLocale(locale: string, save: boolean = true) {
    console.log('update locale', locale);
    if (this._supportLangs.some((l) => l.value === locale)) {
      this._currentLang = locale;
    }
    this._currentLang = this._currentLang.substring(0, 2);
    this.translate.setDefaultLang(this._currentLang);
    this.translate.use(this._currentLang);
    if (save) {
      this.store.setLanguage(this._currentLang).subscribe();
    }
  }

  getSystemLocale(defaultValue?: string): string {
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
}
