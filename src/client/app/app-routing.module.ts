import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './shared/auth.service';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', loadChildren: './home/home.module#HomeModule' },
      // Chrome extension routing workaround
      { path: 'index.extension.html', pathMatch: 'full', redirectTo: '' },
      // TODO: add updates consumtion page back in
      { path: 'create-user', loadChildren: './create-user/create-user.module#CreateUserModule' },
      { path: 'tutorial', loadChildren: './tutorial/tutorial.module#TutorialModule' },
      { path: 'login', loadChildren: './login/login.module#LoginModule' },
      { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule' },
      { path: 'settings', loadChildren: './settings/settings.module#SettingsModule' },
      { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
      { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackModule' },
      { path: 'newsletter', loadChildren: './newsletter/newsletter.module#NewsletterModule' },
      { path: 'verify', loadChildren: './verify/verify.module#VerifyModule', canActivate: [AuthService] }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
