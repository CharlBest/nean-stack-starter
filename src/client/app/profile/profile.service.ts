import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { UserRoutes } from '../../../server/routes/user.routes';
import { UserModel } from '../../../server/models/user/user.model';
import { ReportUserViewModel } from '../../../server/view-models/profile/report-user.view-model';

@Injectable()
export class ProfileService {

  constructor(private http: HttpClient) { }

  public getUser(): Observable<UserModel> {
    return this.http.get<UserModel>(`${environment.apiUrlEndpoint}${UserRoutes.getUser.constructRootUrl()}`);
  }
}
