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
    return this.auth.isAuthenObs();
  }
}
