import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavigationModule } from './shared/navigation/navigation.module';
import { AuthService } from './shared/auth.service';
import { FormService } from './shared/form.service';
import { GaService } from './shared/ga.service';
import { LoggerService } from './shared/logger.service';
import { TokenInterceptor } from './shared/interceptors/token-interceptor';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';
import { FooterModule } from './shared/footer/footer.module';
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
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
