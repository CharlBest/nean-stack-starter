import { Injectable, NgModule } from '@angular/core';
import { PreloadingStrategy, Route, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './shared/services/auth.service';

// Preload defined module routes
@Injectable({
  providedIn: 'root'
})
class CustomPreloading implements PreloadingStrategy {
  preload(route: Route, preload: () => Observable<unknown>): Observable<unknown> {
    return route.data && route.data.preload ? preload() : of(null);
  }
}

const routes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    pathMatch: 'full',
    data: { preload: true }
  },
  // Chrome extension routing workaround
  // { path: 'index.extension.html', pathMatch: 'full', redirectTo: '', data: { preload: true } },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'item',
    loadChildren: () => import('./item/item.module').then(m => m.ItemModule),
    data: { preload: true }
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./create-user/create-user.module').then(m => m.CreateUserModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthService]
  },
  {
    path: 'feedback',
    loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackModule)
  },
  {
    path: 'business',
    loadChildren: () => import('./business/business.module').then(m => m.BusinessModule)
  },
  {
    path: 'call',
    loadChildren: () => import('./call/call.module').then(m => m.CallModule)
  },
  {
    path: 'newsletter',
    loadChildren: () => import('./newsletter/newsletter.module').then(m => m.NewsletterModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'discover',
    loadChildren: () => import('./discover/discover.module').then(m => m.DiscoverModule),
    data: { preload: true }
  },
  {
    path: 'activity',
    loadChildren: () => import('./activity/activity.module').then(m => m.ActivityModule),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
  },
  {
    path: 'invite',
    loadChildren: () => import('./invite/invite.module').then(m => m.InviteModule)
  },
  {
    path: 'language',
    loadChildren: () => import('./language/language.module').then(m => m.LanguageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./verify/verify.module').then(m => m.VerifyModule), canActivate: [AuthService]
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingModule)
  },
  {
    path: '404',
    loadChildren: () => import('./error-404/error-404.module').then(m => m.Error404Module)
  },
  {
    path: '**', redirectTo: '404'
  }
];

// This will cause the page to reload when the url params or query params change.
routes.forEach(x => x.runGuardsAndResolvers = 'paramsOrQueryParamsChange');

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {
        // After initial page load automatically download modules that have data set
        // to perload true so that when the user navigates to that page it is instant
        preloadingStrategy: CustomPreloading,

        // This is necessary otherwise the component will stay the same even if the url data changes
        onSameUrlNavigation: 'reload'
      })
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CustomPreloading
  ]
})
export class AppRoutingModule { }
