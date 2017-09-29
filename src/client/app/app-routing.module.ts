import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './shared/auth.service';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', loadChildren: './home/home.module#HomeModule', pathMatch: 'full' },
      // Chrome extension routing workaround
      { path: 'index.extension.html', pathMatch: 'full', redirectTo: '' },
      // TODO: add updates consumtion page back in
      { path: 'create-user', loadChildren: './create-user/create-user.module#CreateUserModule', pathMatch: 'full' },
      { path: 'tutorial', loadChildren: './tutorial/tutorial.module#TutorialModule', pathMatch: 'full' },
      { path: 'login', loadChildren: './login/login.module#LoginModule', pathMatch: 'full' },
      { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule', pathMatch: 'full' },
      { path: 'settings', loadChildren: './settings/settings.module#SettingsModule', pathMatch: 'full' },
      { path: 'profile', loadChildren: './profile/profile.module#ProfileModule', pathMatch: 'full', canActivate: [AuthService] },
      { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackModule', pathMatch: 'full' },
      { path: 'newsletter', loadChildren: './newsletter/newsletter.module#NewsletterModule', pathMatch: 'full' },
      { path: 'verify', loadChildren: './verify/verify.module#VerifyModule', pathMatch: 'full', canActivate: [AuthService] },
      { path: '**', redirectTo: '' }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
