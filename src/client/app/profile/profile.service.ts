import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserCardModel } from '../../../shared/models/user/user-card.model';
import { UserModel } from '../../../shared/models/user/user.model';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { UpdateAvatarViewModel } from '../../../shared/view-models/profile/update-avatar.view-model';
import { UpdateBioViewModel } from '../../../shared/view-models/profile/update-bio.view-model';
import { UpdatePasswordViewModel } from '../../../shared/view-models/profile/update-password.view-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  public getUser(): Observable<UserModel> {
    return this.http.get<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.getUser.constructRootUrl()}`);
  }

  public updateAvatar(viewModel: UpdateAvatarViewModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.updateAvatar.constructRootUrl()}`, viewModel);
  }

  public updateBio(viewModel: UpdateBioViewModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.updateBio.constructRootUrl()}`, viewModel);
  }

  public updatePassword(viewModel: UpdatePasswordViewModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.updatePassword.constructRootUrl()}`, viewModel);
  }

  public deleteUser(): Observable<UserModel> {
    return this.http.delete<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.deleteUser.constructRootUrl()}`);
  }

  public resendEmailVerificationLink(): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.resendEmailVerificationLink.constructRootUrl()}`, null);
  }

  public createCard(token: string): Observable<UserCardModel> {
    return this.http.post<UserCardModel>(`${environment.apiUrlEndpoint}${UserRoutes.createCard.constructRootUrl()}`, { token });
  }

  public deleteCard(uId: string): Observable<UserCardModel> {
    return this.http.delete<UserCardModel>(`${environment.apiUrlEndpoint}${UserRoutes.deleteCard.constructRootUrl()}`);
  }
}
