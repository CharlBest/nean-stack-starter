import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogConfig, MatProgressSpinnerDefaultOptions, MatTooltipDefaultOptions, MAT_DIALOG_DEFAULT_OPTIONS, MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './shared/auth.service';
import { BreakpointService } from './shared/breakpoint.service';
import { FooterModule } from './shared/footer/footer.module';
import { FormService } from './shared/form.service';
import { GaService } from './shared/ga.service';
import { HeaderModule } from './shared/header/header.module';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';
import { TokenInterceptor } from './shared/interceptors/token-interceptor';
import { LoggerService } from './shared/logger.service';
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
    HeaderModule,
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
    BreakpointService,
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
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: <MatTooltipDefaultOptions>{ showDelay: 700 } },
    { provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, useValue: <MatProgressSpinnerDefaultOptions>{ diameter: 25, strokeWidth: 2 } },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: <MatDialogConfig>{ autoFocus: false } },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
