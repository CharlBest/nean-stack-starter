import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogConfig, MatProgressSpinnerDefaultOptions, MatTooltipDefaultOptions, MAT_DIALOG_DEFAULT_OPTIONS, MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogModule } from './shared/dialog/dialog.module';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';
import { ErrorInterceptor } from './shared/interceptors/error-interceptor';
import { NavigationModule } from './shared/navigation/navigation.module';
import { TutorialModule } from './shared/tutorial/tutorial.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NavigationModule,
    TutorialModule,
    DialogModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: <MatTooltipDefaultOptions>{ showDelay: 700 }
    },
    {
      provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
      useValue: <MatProgressSpinnerDefaultOptions>{ diameter: 25, strokeWidth: 2 }
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: <MatDialogConfig>{ autoFocus: false, hasBackdrop: true, closeOnNavigation: true }
    },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
