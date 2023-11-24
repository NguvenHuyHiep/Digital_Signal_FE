import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppAdminRoutingModule } from './app-admin-routing.module';
import { AppComponent } from './app.component';
import { en_US, NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { environment } from '../environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { AppHttpInterceptor } from './app-http-interceptor.service';
import { AppAuthenEffects } from './store/learn-hub-authen-effects.service';
import { ApiModule, Configuration } from '@app-api/lib/api';
import { AppApiModule } from '@app-api/lib/app-api.module';
import { AuthenModule } from '@app-api/lib/modules/authen/authen.module';
import { LocalStoreModule } from '@app-api/lib/modules/local-store/local-store.module';
import { LH_API_VERSION } from '@app-api/public-api';

registerLocaleData(en);

export function ApiConfiguration() {
  return new Configuration({
    basePath: environment.API_URL,
  });
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppAdminRoutingModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([AppAuthenEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 20,
    }),
    StoreRouterConnectingModule.forRoot(),
    ApiModule.forRoot(ApiConfiguration),
    AppApiModule,
    AuthenModule,
    LocalStoreModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      defaultLanguage: vi_VN.locale,
    }),
  ],
  providers: [
    { provide: NZ_I18N, useValue: vi_VN },
    { provide: LH_API_VERSION, useValue: '1.0' },
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppAdminModule {}
