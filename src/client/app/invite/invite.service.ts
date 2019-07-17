import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralRoutes } from '@shared/routes/general.routes';
import { InviteViewModel } from '@shared/view-models/invite/invite.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InviteService {

    constructor(private http: HttpClient) { }

    sendInvites(viewModel: InviteViewModel): Promise<void> {
        return this.http.post<void>(`${environment.httpDomain}${GeneralRoutes.invite().client()}`, viewModel).toPromise();
    }
}
