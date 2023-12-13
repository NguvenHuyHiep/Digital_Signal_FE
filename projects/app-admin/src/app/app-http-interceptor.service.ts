import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { LhStorageService } from '@app-api/lib/modules/local-store/lh-storage.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(
    private store: Store,
    private lhStorageService: LhStorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith('/api/v1') && !req.url.startsWith('/api/v1/auth')) {
      return of(this.lhStorageService.getToken()).pipe(
        switchMap((token) => {
          if (token) {
            const cloned = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${token}`),
            });
            return next.handle(cloned);
          }
          return next.handle(req);
        })
      );
    } else {
      return next.handle(req);
    }
  }

  private modifyBody(body: any) {
    /*
     * write your logic to modify the body
     * */
    return body;
  }
}
