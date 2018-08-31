import { NgModule } from '@angular/core';
import { PreloadingStrategy, Route, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './shared/services/auth.service';

// Preload defined module routes
export class CustomPreloading implements PreloadingStrategy {
  preload(route: Route, preload: Function): Observable<any> {
    return route.data && route.data.preload ? preload() : of(null);
  }
}

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', loadChildren: './home/home.module#HomeModule', pathMatch: 'full' },
      // Chrome extension routing workaround
      { path: 'index.extension.html', pathMatch: 'full', redirectTo: '', data: { preload: true } },
      { path: 'home', loadChildren: './home/home.module#HomeModule' },
      { path: 'create-user', loadChildren: './create-user/create-user.module#CreateUserModule' },
      { path: 'login', loadChildren: './login/login.module#LoginModule', data: { preload: true } },
      { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule' },
      { path: 'profile', loadChildren: './profile/profile.module#ProfileModule', data: { preload: true }, canActivate: [AuthService] },
      { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackModule' },
      { path: 'business', loadChildren: './business/business.module#BusinessModule' },
      { path: 'newsletter', loadChildren: './newsletter/newsletter.module#NewsletterModule' },
      { path: 'user', loadChildren: './user/user.module#UserModule' },
      { path: 'search', loadChildren: './search/search.module#SearchModule' },
      { path: 'create-item', loadChildren: './create-item/create-item.module#CreateItemModule', canActivate: [AuthService] },
      { path: 'activity', loadChildren: './activity/activity.module#ActivityModule' },
      { path: 'account', loadChildren: './account/account.module#AccountModule' },
      { path: 'payment', loadChildren: './payment/payment.module#PaymentModule' },
      { path: 'verify', loadChildren: './verify/verify.module#VerifyModule', canActivate: [AuthService] },
      { path: '**', redirectTo: '' }
    ], { preloadingStrategy: CustomPreloading })
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CustomPreloading
  ]
})
export class AppRoutingModule { }
