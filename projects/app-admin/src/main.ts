import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppAdminModule } from './app/app-admin.module';


platformBrowserDynamic().bootstrapModule(AppAdminModule)
  .catch(err => console.error(err));
