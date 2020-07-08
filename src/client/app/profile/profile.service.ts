import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationRoutes } from '@shared/routes/notification.routes';
import { UserRoutes } from '@shared/routes/user.routes';
import { UpdateAvatarViewModel } from '@shared/view-models/profile/update-avatar.view-model';
import { UpdateBioViewModel } from '@shared/view-models/profile/update-bio.view-model';
import { UpdatePasswordViewModel } from '@shared/view-models/profile/update-password.view-model';
import { NotificationPreferencesViewModel } from '@shared/view-models/user/notification-preferences.view-model';
import { TwoFactorAuthenticationViewModel } from '@shared/view-models/user/two-factor-authentication.view-model';
import { UpdateConfigurationViewModel } from '@shared/view-models/user/update-configuration.view-model';
import { UpdateNotificationPreferencesViewModel } from '@shared/view-models/user/update-notification-preferences.view-model';
import { UpdateTwoFactorAuthenticationViewModel } from '@shared/view-models/user/update-two-factor-authentication.view-model';
import { UserProfileViewModel } from '@shared/view-models/user/user-profile.view-model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserProfile(): Promise<UserProfileViewModel | null> {
    return this.http.get<UserProfileViewModel>(UserRoutes.getUserProfile().client()).toPromise();
  }

  updateAvatar(viewModel: UpdateAvatarViewModel): Promise<void> {
    return this.http.put<void>(UserRoutes.updateAvatar().client(), viewModel).toPromise();
  }

  updateBio(viewModel: UpdateBioViewModel): Promise<void> {
    return this.http.put<void>(UserRoutes.updateBio().client(), viewModel).toPromise();
  }

  updatePassword(viewModel: UpdatePasswordViewModel): Promise<void> {
    return this.http.put<void>(UserRoutes.updatePassword().client(), viewModel).toPromise();
  }

  deleteUser(): Promise<boolean> {
    return this.http.delete<boolean>(UserRoutes.deleteUser().client()).toPromise();
  }

  resendEmailVerificationLink(): Promise<void> {
    return this.http.post<void>(UserRoutes.resendEmailVerificationLink().client(), null).toPromise();
  }

  getNotificationPreferences(): Promise<NotificationPreferencesViewModel | null> {
    return this.http.get<NotificationPreferencesViewModel>(NotificationRoutes.getNotificationPreferences().client()).toPromise();
  }

  updateNotificationPreferences(model: UpdateNotificationPreferencesViewModel): Promise<void> {
    return this.http.put<void>(NotificationRoutes.updateNotificationPreferences().client(), model).toPromise();
  }

  updateTwoFactorAuthentication(model: UpdateTwoFactorAuthenticationViewModel): Promise<TwoFactorAuthenticationViewModel> {
    return this.http.put<TwoFactorAuthenticationViewModel>(UserRoutes.updateTwoFactorAuthentication().client(), model).toPromise();
  }

  updateConfiguration(model: UpdateConfigurationViewModel): Promise<boolean> {
    return this.http.put<boolean>(UserRoutes.updateConfiguration().client(), model).toPromise();
  }
}
