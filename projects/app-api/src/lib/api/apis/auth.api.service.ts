import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseOutputString } from '../models/baseOutputString';
import { Observable } from 'rxjs';
import { BaseOutputAuth } from '../models/baseOutputAuth';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<BaseOutputAuth> {
    return this.http.post<BaseOutputAuth>(`/api/v1/auth/login`, {
      email,
      password,
    });
  }

  public verifyOtp(email: string, otp: string): Observable<BaseOutputAuth> {
    return this.http.post<BaseOutputAuth>(`/api/v1/auth/verify-otp`, {
      email,
      otp,
    });
  }
}
