import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRoutes } from '@shared/routes/user.routes';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VerifyService {

    constructor(private http: HttpClient) { }

    verifyEmail(code: string): Promise<boolean> {
        return this.http.post<boolean>(`${environment.serverEndpoint}${UserRoutes.verifyEmail().client()}`, { code }).toPromise();
    }
}
