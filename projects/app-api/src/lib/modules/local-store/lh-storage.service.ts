import { Injectable } from '@angular/core';
import { User } from '@app-api/lib/api/models/user';

@Injectable({
  providedIn: 'root',
})
export class LhStorageService {
  private LOCAL_STORAGE = 'LOCAL_STORAGE_';
  private LOCALE: string = this.LOCAL_STORAGE + 'LOCALE';
  private USER: string = this.LOCAL_STORAGE + 'USER';
  private TOKEN: string = this.LOCAL_STORAGE + 'TOKEN';

  constructor() {}

  public getLocale(): string | undefined {
    return localStorage.getItem(this.LOCALE) || undefined;
  }

  public setLocale(locale?: string): void {
    if (locale) {
      localStorage.setItem(this.LOCALE, locale);
    } else {
      localStorage.removeItem(this.LOCALE);
    }
  }

  public getCurrentUser(): User | undefined {
    const jsonData = localStorage.getItem(this.USER);
    return jsonData ? JSON.parse(jsonData) : undefined;
  }

  public setCurrentUser(user?: User): void {
    if (user) {
      const jsonData = JSON.stringify(user);
      localStorage.setItem(this.USER, jsonData);
    } else {
      localStorage.removeItem(this.USER);
    }
  }

  public getToken(): string | undefined {
    return localStorage.getItem(this.TOKEN) || undefined;
  }

  public setToken(token?: string): void {
    if (token) {
      localStorage.setItem(this.TOKEN, token);
    } else {
      localStorage.removeItem(this.TOKEN);
    }
  }
}
