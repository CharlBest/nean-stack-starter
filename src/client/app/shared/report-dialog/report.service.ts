import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRoutes } from '../../../../shared/routes/user.routes';
import { ReportUserViewModel } from '../../../../shared/view-models/profile/report-user.view-model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    constructor(private http: HttpClient) { }

    public sendReport(viewModel: ReportUserViewModel): Observable<void> {
        return this.http.post<void>(`${environment.apiUrlEndpoint}${UserRoutes.report().client()}`, viewModel);
    }
}
