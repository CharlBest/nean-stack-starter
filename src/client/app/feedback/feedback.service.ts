import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GeneralRoutes } from '../../../shared/routes/general.routes';
import { FeedbackViewModel } from '../../../shared/view-models/feedback/feedback.view-model';

@Injectable()
export class FeedbackService {

    constructor(private http: HttpClient) { }

    public sendFeedback(viewModel: FeedbackViewModel): Observable<void> {
        return this.http.post<void>(`${environment.apiUrlEndpoint}${GeneralRoutes.sendFeedback.constructRootUrl()}`, viewModel);
    }
}
