import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { UserRoutes } from '../../../server/routes/user.routes';

@Injectable()
export class VerifyService {

    constructor(private http: HttpClient) { }

    public verifyEmail(code: string): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${UserRoutes.verifyEmail.constructRootUrl()}`, { code });
    }
}
