import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { GeneralRoutes } from '../../../server/routes/general.routes';
import { NewsletterMemberViewModel } from '../../../server/view-models/newsletter/newsletter-member.view-model';

@Injectable()
export class NewsletterService {

    constructor(private http: HttpClient) { }

    public createNewsletterMember(viewModel: NewsletterMemberViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${GeneralRoutes.createNewsletterMember.constructRootUrl()}`, viewModel);
    }

    public deleteNewsletterMember(viewModel: NewsletterMemberViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${GeneralRoutes.deleteNewsletterMember.constructRootUrl()}`, viewModel);
    }
}
