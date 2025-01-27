import { ApplicationConfig,  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'


import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { authExpired } from './core/auth/auth-expired.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [ 
    provideRouter(routes), 
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura
        }
    }), 
    provideHttpClient(
      withInterceptors([authExpired]),
      withXsrfConfiguration({cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN'})
    )],
};
