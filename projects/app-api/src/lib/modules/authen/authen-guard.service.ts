import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, combineLatest, forkJoin, map, of, tap } from 'rxjs';
import { LhAuthenService } from './lh-authen.service';
import { LhStorageService } from '../local-store/lh-storage.service';

@Injectable()
export class AuthenGuardService {
  constructor(
    private auth: LhAuthenService,
    private lhStoreService: LhStorageService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.lhStoreService.currentUser.pipe(
      map((user) => {
        console.log(user);
        if (user) {
          return true;
        } else {
          return false;
        }
      })
    );
    // return combineLatest([this.auth.isAuthenObs(), this.auth.userObs]).pipe(
    //   tap(([isAuthen, user]) => {
    //     console.log(isAuthen);
    //     console.log(user);
    //   }),
    //   map(([isAuthen, user]) => {
    //     if (!isAuthen && !user) {
    //       this.router.navigate(['/login']);
    //       return false;
    //     }

    //     return true;
    //   })
    // );
  }
}
