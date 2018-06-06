import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MatProgressSpinnerDefaultOptions } from '@angular/material';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './shared/auth.service';
import { FooterModule } from './shared/footer/footer.module';
import { FormService } from './shared/form.service';
import { GaService } from './shared/ga.service';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';
import { TokenInterceptor } from './shared/interceptors/token-interceptor';
import { LoggerService } from './shared/logger.service';
import { NavigationModule } from './shared/navigation/navigation.module';
import { TutorialModule } from './shared/tutorial/tutorial.module';
import { TutorialService } from './shared/tutorial/tutorial.service';
import { WebSocketService } from './shared/websocket.service';

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
    FooterModule,
    TutorialModule
  ],
  providers: [
    Title,
    AuthService,
    FormService,
    GaService,
    TutorialService,
    WebSocketService,
    LoggerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    // TODO: This breaks the progress spinner's animation
    // { provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, useValue: <MatProgressSpinnerDefaultOptions>{ diameter: 16, strokeWidth: 2 } },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
