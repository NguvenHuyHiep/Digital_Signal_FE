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
import { from, Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: any, caught: Observable<any>) => {
        return from(Promise.reject(error));
      }),
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            event = event.clone({ body: this.modifyBody(event.body) });
          }
          return event;
        },
        (error) => {
          if (error instanceof HttpResponseBase && error.status === 401) {
            // this.store.dispatch(SIGN_OUT());
          }
        }
      ),
      finalize(() => {})
    );
  }

  private modifyBody(body: any) {
    /*
     * write your logic to modify the body
     * */
    return body;
  }
}
