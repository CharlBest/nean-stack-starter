import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralRoutes } from '@shared/routes/general.routes';
import { NewsletterMemberViewModel } from '@shared/view-models/newsletter/newsletter-member.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NewsletterService {

    constructor(private http: HttpClient) { }

    createNewsletterMember(viewModel: NewsletterMemberViewModel): Promise<boolean> {
        return this.http
            .post<boolean>(`${environment.serverEndpoint}${GeneralRoutes.createNewsletterMember().client()}`, viewModel)
            .toPromise();
    }

    deleteNewsletterMember(email: string): Promise<boolean> {
        return this.http.delete<boolean>(`${environment.serverEndpoint}${GeneralRoutes.deleteNewsletterMember(email).client()}`).toPromise();
    }
}
