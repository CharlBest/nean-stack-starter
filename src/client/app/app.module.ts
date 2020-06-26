import { ClipboardModule } from '@angular/cdk/clipboard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatBottomSheetConfig, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from '@angular/material/bottom-sheet';
import { MatDialogConfig, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatSnackBarConfig, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS, MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/tooltip';
import { BrowserModule, HammerModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogModule } from './shared/dialog/dialog.module';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';
import { ErrorInterceptor } from './shared/interceptors/error-interceptor';
import { LanguageInterceptor } from './shared/interceptors/language-interceptor';
import { NavigationModule } from './shared/navigation/navigation.module';
import { ParticleEffectModule } from './shared/particle-effect/particle-effect.module';
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
    ClipboardModule,
    ParticleEffectModule,
    HammerModule,
    ServiceWorkerModule.register('/custom-service-worker.js', { enabled: environment.production, registrationStrategy: 'registerWithDelay:3000' })
  ],
  providers: [
    Title,
    // Interceptors
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
      provide: HTTP_INTERCEPTORS,
      useClass: LanguageInterceptor,
      multi: true
    },
    // Material defaults
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: { showDelay: 700 } as MatTooltipDefaultOptions
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { closeOnNavigation: true, autoFocus: false, restoreFocus: false, hasBackdrop: true } as MatDialogConfig
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2000 } as MatSnackBarConfig
    },
    {
      provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: { closeOnNavigation: true, autoFocus: false, restoreFocus: false } as MatBottomSheetConfig
    },
    // Temp fix for Share Dialog service https://github.com/angular/angular/issues/35759
    MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
