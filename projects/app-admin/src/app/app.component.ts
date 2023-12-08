import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { LhStorageService } from '@app-api/lib/modules/local-store/lh-storage.service';
import {
  SIGN_IN_SUCCESS,
  SIGN_OUT,
} from '@app-api/lib/modules/authen/store/authen.reducers';
import { LhAuthenService } from '@app-api/lib/modules/authen/lh-authen.service';
import { combineLatest } from 'rxjs';
@Component({
  selector: 'app-admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private _storageService: LhStorageService,
    private _authenService: LhAuthenService,
    private _activatedRoute: ActivatedRoute,
    private location: Location,
    private _router: Router,
    private _store: Store
  ) {}

  ngOnInit(): void {
    combineLatest([
      this._storageService.token,
      this._storageService.currentUser,
    ]).subscribe(([token, user]) => {
      if (token && user) {
        this._store.dispatch(
          SIGN_IN_SUCCESS({ value: { token, email: user.email } })
        );
      } else {
        this._store.dispatch(SIGN_OUT());
      }
    });
    // TODO startsWith dashboard
    // TODO else courselist
    this._authenService.isAuthenObs().subscribe((value) => {
      if (value && this.location.path().startsWith('/login')) {
        let returnUrl = this._activatedRoute.snapshot.queryParams['returnUrl'];
        if (returnUrl != null && returnUrl != '') {
          this._router.navigateByUrl(returnUrl);
        } else {
          this._router.navigateByUrl('/dashboard');
        }
      }
    });
  }
}
