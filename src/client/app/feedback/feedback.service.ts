import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { UserRoutes } from '../../../server/routes/user.routes';
import { FeedbackViewModel } from '../../../server/view-models/feedback/feedback.view-model';

@Injectable()
export class FeedbackService {

    constructor(private http: HttpClient) { }

    public sendFeedback(viewModel: FeedbackViewModel): Observable<void> {
        return this.http.post<void>(`${environment.apiUrlEndpoint}${UserRoutes.sendFeedback.constructRootUrl()}`, viewModel);
    }
}
