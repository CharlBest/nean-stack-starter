import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { environment } from '../../environments/environment';

@Injectable()
export class VerifyService {

    constructor(private http: HttpClient) { }

    public verifyEmail(code: string): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${UserRoutes.verifyEmail.constructRootUrl()}`, { code });
    }
}
