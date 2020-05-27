import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationRoutes } from '@shared/routes/notification.routes';
import { UserRoutes } from '@shared/routes/user.routes';
import { ReportUserViewModel } from '@shared/view-models/profile/report-user.view-model';
import { UpdateAvatarViewModel } from '@shared/view-models/profile/update-avatar.view-model';
import { UpdateBioViewModel } from '@shared/view-models/profile/update-bio.view-model';
import { UpdatePasswordViewModel } from '@shared/view-models/profile/update-password.view-model';
import { NotificationPreferencesViewModel } from '@shared/view-models/user/notification-preferences.view-model';
import { TwoFactorAuthenticationViewModel } from '@shared/view-models/user/two-factor-authentication.view-model';
import { UpdateConfigurationViewModel } from '@shared/view-models/user/update-configuration.view-model';
import { UpdateNotificationPreferencesViewModel } from '@shared/view-models/user/update-notification-preferences.view-model';
import { UpdateTwoFactorAuthenticationViewModel } from '@shared/view-models/user/update-two-factor-authentication.view-model';
import { UserProfileViewModel } from '@shared/view-models/user/user-profile.view-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserProfile(): Promise<UserProfileViewModel | null> {
    return this.http.get<UserProfileViewModel>(`${environment.serverEndpoint}${UserRoutes.getUserProfile().client()}`).toPromise();
  }

  updateAvatar(viewModel: UpdateAvatarViewModel): Promise<void> {
    return this.http.put<void>(`${environment.serverEndpoint}${UserRoutes.updateAvatar().client()}`, viewModel).toPromise();
  }

  updateBio(viewModel: UpdateBioViewModel): Promise<void> {
    return this.http.put<void>(`${environment.serverEndpoint}${UserRoutes.updateBio().client()}`, viewModel).toPromise();
  }

  updatePassword(viewModel: UpdatePasswordViewModel): Promise<void> {
    return this.http.put<void>(`${environment.serverEndpoint}${UserRoutes.updatePassword().client()}`, viewModel).toPromise();
  }

  deleteUser(): Promise<boolean> {
    return this.http.delete<boolean>(`${environment.serverEndpoint}${UserRoutes.deleteUser().client()}`).toPromise();
  }

  resendEmailVerificationLink(): Promise<void> {
    return this.http.post<void>(`${environment.serverEndpoint}${UserRoutes.resendEmailVerificationLink().client()}`, null).toPromise();
  }

  sendReport(viewModel: ReportUserViewModel): Promise<void> {
    return this.http.post<void>(`${environment.serverEndpoint}${UserRoutes.report().client()}`, viewModel).toPromise();
  }

  getNotificationPreferences(): Promise<NotificationPreferencesViewModel | null> {
    return this.http
      .get<NotificationPreferencesViewModel>(`${environment.serverEndpoint}${NotificationRoutes.getNotificationPreferences().client()}`)
      .toPromise();
  }

  updateNotificationPreferences(model: UpdateNotificationPreferencesViewModel): Promise<void> {
    return this.http.put<void>(`${environment.serverEndpoint}${NotificationRoutes.updateNotificationPreferences().client()}`, model)
      .toPromise();
  }

  updateTwoFactorAuthentication(model: UpdateTwoFactorAuthenticationViewModel): Promise<TwoFactorAuthenticationViewModel> {
    return this.http
      .put<TwoFactorAuthenticationViewModel>(`${environment.serverEndpoint}${UserRoutes.updateTwoFactorAuthentication().client()}`, model)
      .toPromise();
  }

  updateConfiguration(model: UpdateConfigurationViewModel): Promise<boolean> {
    return this.http.put<boolean>(`${environment.serverEndpoint}${UserRoutes.updateConfiguration().client()}`, model).toPromise();
  }
}
