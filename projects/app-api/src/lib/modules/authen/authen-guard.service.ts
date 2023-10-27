import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {LhAuthenService} from "./lh-authen.service";

@Injectable()
export class AuthenGuardService {

  constructor(private auth: LhAuthenService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot
    , state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.isAuthenObs();
  }
}
