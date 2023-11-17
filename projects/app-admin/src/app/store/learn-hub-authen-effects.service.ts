import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Location } from '@angular/common';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { SIGN_OUT } from 'projects/app-api/src/lib/modules/authen/store/authen.reducers';

@Injectable()
export class AppAuthenEffects {
  readonly SIGN_OUT = createEffect(
    () =>
      this._actions$.pipe(
        ofType(SIGN_OUT),
        tap((action) => {
          this.router.navigateByUrl('/login');
        })
      ),
    { dispatch: false }
  );

  constructor(
    private _store: Store,
    private _actions$: Actions,
    private location: Location,
    private router: Router
  ) {}
}
