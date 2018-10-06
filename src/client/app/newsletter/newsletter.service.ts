import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralRoutes } from '../../../shared/routes/general.routes';
import { NewsletterMemberViewModel } from '../../../shared/view-models/newsletter/newsletter-member.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NewsletterService {

    constructor(private http: HttpClient) { }

    createNewsletterMember(viewModel: NewsletterMemberViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${GeneralRoutes.createNewsletterMember().client()}`, viewModel);
    }

    deleteNewsletterMember(email: string): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.apiUrlEndpoint}${GeneralRoutes.deleteNewsletterMember(email).client()}`);
    }
}
