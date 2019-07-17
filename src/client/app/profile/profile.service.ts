import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CardModel } from '../../../shared/models/payment/card.model';
import { PaymentModel } from '../../../shared/models/payment/payment.model';
import { NotificationRoutes } from '../../../shared/routes/notification.routes';
import { PaymentRoutes } from '../../../shared/routes/payment.routes';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { ReportUserViewModel } from '@shared/view-models/profile/report-user.view-model';
import { UpdateAvatarViewModel } from '@shared/view-models/profile/update-avatar.view-model';
import { UpdateBioViewModel } from '@shared/view-models/profile/update-bio.view-model';
import { UpdatePasswordViewModel } from '@shared/view-models/profile/update-password.view-model';
import { NotificationPreferencesViewModel } from '@shared/view-models/user/notification-preferences.view-model';
import { UpdateNotificationPreferencesViewModel } from '@shared/view-models/user/update-notification-preferences.view-model';
import { UserProfileViewModel } from '@shared/view-models/user/user-profile.view-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserProfile(): Promise<UserProfileViewModel | null> {
    return this.http.get<UserProfileViewModel>(`${environment.httpDomain}${UserRoutes.getUserProfile().client()}`).toPromise();
  }

  updateAvatar(viewModel: UpdateAvatarViewModel): Promise<void> {
    return this.http.put<void>(`${environment.httpDomain}${UserRoutes.updateAvatar().client()}`, viewModel).toPromise();
  }

  updateBio(viewModel: UpdateBioViewModel): Promise<void> {
    return this.http.put<void>(`${environment.httpDomain}${UserRoutes.updateBio().client()}`, viewModel).toPromise();
  }

  updatePassword(viewModel: UpdatePasswordViewModel): Promise<void> {
    return this.http.put<void>(`${environment.httpDomain}${UserRoutes.updatePassword().client()}`, viewModel).toPromise();
  }

  deleteUser(): Promise<boolean> {
    return this.http.delete<boolean>(`${environment.httpDomain}${UserRoutes.deleteUser().client()}`).toPromise();
  }

  resendEmailVerificationLink(): Promise<void> {
    return this.http.post<void>(`${environment.httpDomain}${UserRoutes.resendEmailVerificationLink().client()}`, null).toPromise();
  }

  createCard(token: string): Promise<CardModel | null> {
    return this.http.post<CardModel>(`${environment.httpDomain}${PaymentRoutes.createCard().client()}`, { token }).toPromise();
  }

  deleteCard(uId: string): Promise<CardModel | null> {
    return this.http.delete<CardModel>(`${environment.httpDomain}${PaymentRoutes.deleteCard(uId).client()}`).toPromise();
  }

  updateDefaultCard(uId: string): Promise<CardModel | null> {
    return this.http.put<CardModel>(`${environment.httpDomain}${PaymentRoutes.updateDefaultCard().client()}`, { uId }).toPromise();
  }

  paymentHistory(): Promise<PaymentModel[] | null> {
    return this.http.get<PaymentModel[]>(`${environment.httpDomain}${PaymentRoutes.paymentHistory().client()}`).toPromise();
  }

  sendReport(viewModel: ReportUserViewModel): Promise<void> {
    return this.http.post<void>(`${environment.httpDomain}${UserRoutes.report().client()}`, viewModel).toPromise();
  }

  getNotificationPreferences(): Promise<NotificationPreferencesViewModel | null> {
    return this.http
      .get<NotificationPreferencesViewModel>(`${environment.httpDomain}${NotificationRoutes.getNotificationPreferences().client()}`)
      .toPromise();
  }

  updateNotificationPreferences(model: UpdateNotificationPreferencesViewModel): Promise<void> {
    return this.http.put<void>(`${environment.httpDomain}${NotificationRoutes.updateNotificationPreferences().client()}`, model)
      .toPromise();
  }
}
