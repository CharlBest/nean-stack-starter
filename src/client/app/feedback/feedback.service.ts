import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralRoutes } from '@shared/routes/general.routes';
import { FeedbackViewModel } from '@shared/view-models/feedback/feedback.view-model';

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {

    constructor(private http: HttpClient) { }

    sendFeedback(viewModel: FeedbackViewModel): Promise<void> {
        return this.http.post<void>(GeneralRoutes.sendFeedback().client(), viewModel).toPromise();
    }
}
