import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { environment } from './environments/environment';

/**
 * Configuración de la aplicación Angular con providers esenciales.
 * Incluye HttpClientModule para manejo de requests HTTP,
 * BrowserAnimationsModule para soporte de animaciones,
 * y configuración del router.
 */
const enhancedAppConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideHttpClient(withFetch()),
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    provideAnimationsAsync(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    },
    {
      provide: 'API_BASE_URL',
      useValue: environment.apiBaseUrl
    }
  ]
};

/**
 * Punto de entrada de la aplicación Angular.
 * Bootstrappea el componente raíz AppComponent con la configuración
 * necesaria para manejar eventos en tiempo real y consumo de APIs.
 */
bootstrapApplication(AppComponent, enhancedAppConfig)
  .catch((err) => {
    console.error('Error bootstrapping Angular application:', err);
    // Fallback UI: muestra un mensaje de error en el DOM
    const errorElement = document.createElement('div');
    errorElement.style.position = 'fixed';
    errorElement.style.top = '0';
    errorElement.style.left = '0';
    errorElement.style.width = '100%';
    errorElement.style.backgroundColor = '#ffebee';
    errorElement.style.color = '#c62828';
    errorElement.style.padding = '16px';
    errorElement.style.boxSizing = 'border-box';
    errorElement.style.zIndex = '9999';
    errorElement.textContent = 'Error al iniciar la aplicación. Ver consola para detalles.';
    document.body.appendChild(errorElement);
  });