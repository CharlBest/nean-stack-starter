import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRoutes } from '@shared/routes/user.routes';

@Injectable({
    providedIn: 'root'
})
export class VerifyService {

    constructor(private http: HttpClient) { }

    verifyEmail(code: string): Promise<boolean> {
        return this.http.post<boolean>(UserRoutes.verifyEmail().client(), { code }).toPromise();
    }
}
