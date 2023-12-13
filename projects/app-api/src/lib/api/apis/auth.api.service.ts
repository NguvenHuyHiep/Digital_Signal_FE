import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseOutputString } from '../models/baseOutputString';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<BaseOutputString> {
    return this.http.post<BaseOutputString>(`/api/v1/auth/login`, {
      email,
      password,
    });
  }
}
