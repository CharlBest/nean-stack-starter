import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardModel } from '../../../shared/models/payment/card.model';
import { PaymentModel } from '../../../shared/models/payment/payment.model';
import { NotificationRoutes } from '../../../shared/routes/notification.routes';
import { PaymentRoutes } from '../../../shared/routes/payment.routes';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { ReportUserViewModel } from '../../../shared/view-models/profile/report-user.view-model';
import { UpdateAvatarViewModel } from '../../../shared/view-models/profile/update-avatar.view-model';
import { UpdateBioViewModel } from '../../../shared/view-models/profile/update-bio.view-model';
import { UpdatePasswordViewModel } from '../../../shared/view-models/profile/update-password.view-model';
import { NotificationPreferencesViewModel } from '../../../shared/view-models/user/notification-preferences.view-model';
import { UpdateNotificationPreferencesViewModel } from '../../../shared/view-models/user/update-notification-preferences.view-model';
import { UserProfileViewModel } from '../../../shared/view-models/user/user-profile.view-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<UserProfileViewModel | null> {
    return this.http.get<UserProfileViewModel>(`${environment.apiUrlEndpoint}${UserRoutes.getUserProfile().client()}`);
  }

  updateAvatar(viewModel: UpdateAvatarViewModel): Observable<void> {
    return this.http.put<void>(`${environment.apiUrlEndpoint}${UserRoutes.updateAvatar().client()}`, viewModel);
  }

  updateBio(viewModel: UpdateBioViewModel): Observable<void> {
    return this.http.put<void>(`${environment.apiUrlEndpoint}${UserRoutes.updateBio().client()}`, viewModel);
  }

  updatePassword(viewModel: UpdatePasswordViewModel): Observable<void> {
    return this.http.put<void>(`${environment.apiUrlEndpoint}${UserRoutes.updatePassword().client()}`, viewModel);
  }

  deleteUser(): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrlEndpoint}${UserRoutes.deleteUser().client()}`);
  }

  resendEmailVerificationLink(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrlEndpoint}${UserRoutes.resendEmailVerificationLink().client()}`, null);
  }

  createCard(token: string): Observable<CardModel | null> {
    return this.http.post<CardModel>(`${environment.apiUrlEndpoint}${PaymentRoutes.createCard().client()}`, { token });
  }

  deleteCard(uId: string): Observable<CardModel | null> {
    return this.http.delete<CardModel>(`${environment.apiUrlEndpoint}${PaymentRoutes.deleteCard(uId).client()}`);
  }

  updateDefaultCard(uId: string): Observable<CardModel | null> {
    return this.http.put<CardModel>(`${environment.apiUrlEndpoint}${PaymentRoutes.updateDefaultCard().client()}`, { uId });
  }

  paymentHistory(): Observable<PaymentModel[] | null> {
    return this.http.get<PaymentModel[]>(`${environment.apiUrlEndpoint}${PaymentRoutes.paymentHistory().client()}`);
  }

  sendReport(viewModel: ReportUserViewModel): Observable<void> {
    return this.http.post<void>(`${environment.apiUrlEndpoint}${UserRoutes.report().client()}`, viewModel);
  }

  getNotificationPreferences(): Observable<NotificationPreferencesViewModel | null> {
    return this.http
      .get<NotificationPreferencesViewModel>(`${environment.apiUrlEndpoint}${NotificationRoutes.getNotificationPreferences().client()}`);
  }

  updateNotificationPreferences(model: UpdateNotificationPreferencesViewModel): Observable<void> {
    return this.http.put<void>(`${environment.apiUrlEndpoint}${NotificationRoutes.updateNotificationPreferences().client()}`, model);
  }
}
