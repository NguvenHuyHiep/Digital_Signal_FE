import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authenReducer, IAuthenState } from './store/authen.reducers';
import { ActionReducer } from '@ngrx/store/src/models';
import { AuthenEffects } from './store/authen.effects';
import { LocalStoreModule } from '../local-store/local-store.module';

export const authenReducers: ActionReducer<IAuthenState> = authenReducer;
export const authenMetaReducers: MetaReducer<IAuthenState>[] = [];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LocalStoreModule.forRoot(),
    StoreModule.forFeature('authentication', authenReducers, {
      metaReducers: authenMetaReducers,
    }),
    EffectsModule.forFeature([AuthenEffects]),
  ],
})
export class AuthenModule {}
