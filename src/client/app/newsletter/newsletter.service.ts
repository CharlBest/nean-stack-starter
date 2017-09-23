import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { UserRoutes } from '../../../server/routes/user.routes';
import { NewsletterMemberViewModel } from '../../../server/view-models/newsletter/newsletter-member.view-model';

@Injectable()
export class NewsletterService {

    constructor(private http: HttpClient) { }

    public createNewsletterMember(viewModel: NewsletterMemberViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${UserRoutes.createNewsletterMember.constructRootUrl()}`, viewModel);
    }

    public deleteNewsletterMember(viewModel: NewsletterMemberViewModel): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${UserRoutes.deleteNewsletterMember.constructRootUrl()}`, viewModel);
    }
}
