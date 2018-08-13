import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralRoutes } from '../../../shared/routes/general.routes';
import { FeedbackViewModel } from '../../../shared/view-models/feedback/feedback.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {

    constructor(private http: HttpClient) { }

    public sendFeedback(viewModel: FeedbackViewModel): Observable<void> {
        return this.http.post<void>(`${environment.apiUrlEndpoint}${GeneralRoutes.sendFeedback().client()}`, viewModel);
    }
}
