import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardModel } from '../../../shared/models/payment/card.model';
import { PaymentModel } from '../../../shared/models/payment/payment.model';
import { UserModel } from '../../../shared/models/user/user.model';
import { PaymentRoutes } from '../../../shared/routes/payment.routes';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { UpdateAvatarViewModel } from '../../../shared/view-models/profile/update-avatar.view-model';
import { UpdateBioViewModel } from '../../../shared/view-models/profile/update-bio.view-model';
import { UpdatePasswordViewModel } from '../../../shared/view-models/profile/update-password.view-model';
import { UserProfileViewModel } from '../../../shared/view-models/user/user-profile.view-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  public getUserProfile(): Observable<UserProfileViewModel> {
    return this.http.get<UserProfileViewModel>(`${environment.apiUrlEndpoint}${UserRoutes.getUserProfile().client()}`);
  }

  public updateAvatar(viewModel: UpdateAvatarViewModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.updateAvatar().client()}`, viewModel);
  }

  public updateBio(viewModel: UpdateBioViewModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.updateBio().client()}`, viewModel);
  }

  public updatePassword(viewModel: UpdatePasswordViewModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.updatePassword().client()}`, viewModel);
  }

  public deleteUser(): Observable<UserModel> {
    return this.http.delete<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.deleteUser().client()}`);
  }

  public resendEmailVerificationLink(): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.resendEmailVerificationLink().client()}`, null);
  }

  public createCard(token: string): Observable<CardModel> {
    return this.http.post<CardModel>(`${environment.apiUrlEndpoint}${PaymentRoutes.createCard().client()}`, { token });
  }

  public deleteCard(uId: string): Observable<CardModel> {
    return this.http.delete<CardModel>(`${environment.apiUrlEndpoint}${PaymentRoutes.deleteCard(uId).client()}`);
  }

  public updateDefaultCard(uId: string): Observable<CardModel> {
    return this.http.post<CardModel>(`${environment.apiUrlEndpoint}${PaymentRoutes.updateDefaultCard().client()}`, { uId });
  }

  public paymentHistory(): Observable<PaymentModel[]> {
    return this.http.get<PaymentModel[]>(`${environment.apiUrlEndpoint}${PaymentRoutes.paymentHistory().client()}`);
  }
}
