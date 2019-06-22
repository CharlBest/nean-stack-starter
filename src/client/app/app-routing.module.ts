import { NgModule } from '@angular/core';
import { PreloadingStrategy, Route, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './shared/services/auth.service';

// Preload defined module routes
export class CustomPreloading implements PreloadingStrategy {
  preload(route: Route, preload: () => Observable<any>): Observable<any> {
    return route.data && route.data.preload ? preload() : of(null);
  }
}

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), pathMatch: 'full', data: { preload: true } },
      // Chrome extension routing workaround
      // { path: 'index.extension.html', pathMatch: 'full', redirectTo: '', data: { preload: true } },
      { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
      { path: 'item', loadChildren: () => import('./item/item.module').then(m => m.ItemModule), data: { preload: true } },
      { path: 'create-user', loadChildren: () => import('./create-user/create-user.module').then(m => m.CreateUserModule) },
      { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
      { path: 'forgot-password', loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
      { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthService] },
      { path: 'feedback', loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackModule) },
      { path: 'business', loadChildren: () => import('./business/business.module').then(m => m.BusinessModule) },
      { path: 'newsletter', loadChildren: () => import('./newsletter/newsletter.module').then(m => m.NewsletterModule) },
      { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
      { path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule), data: { preload: true } },
      { path: 'activity', loadChildren: () => import('./activity/activity.module').then(m => m.ActivityModule), data: { preload: true } },
      { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule), data: { preload: true } },
      { path: 'invite', loadChildren: () => import('./invite/invite.module').then(m => m.InviteModule) },
      { path: 'payment', loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule) },
      { path: 'verify', loadChildren: () => import('./verify/verify.module').then(m => m.VerifyModule), canActivate: [AuthService] },
      { path: '404', loadChildren: () => import('./error-404/error-404.module').then(m => m.Error404Module) },
      { path: '**', redirectTo: '404' }
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
