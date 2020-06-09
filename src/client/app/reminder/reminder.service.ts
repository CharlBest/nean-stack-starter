import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReminderRoutes } from '@shared/routes/reminder.routes';
import { CreateOrUpdateReminderViewModel } from '@shared/view-models/reminder/create-or-update-reminder.view-model';
import { ReminderViewModel } from '@shared/view-models/reminder/reminder.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReminderService {

    constructor(private http: HttpClient) { }

    create(viewModel: CreateOrUpdateReminderViewModel): Promise<ReminderViewModel | null> {
        return this.http
            .post<ReminderViewModel>(`${environment.serverEndpoint}${ReminderRoutes.create().client()}`, viewModel).toPromise();
    }

    update(uId: string, viewModel: CreateOrUpdateReminderViewModel): Promise<ReminderViewModel | null> {
        return this.http
            .put<ReminderViewModel>(`${environment.serverEndpoint}${ReminderRoutes.update(uId).client()}`, viewModel).toPromise();
    }

    delete(uId: string): Promise<void> {
        return this.http.delete<void>(`${environment.serverEndpoint}${ReminderRoutes.delete(uId).client()}`).toPromise();
    }

    getAll(pageIndex: number, pageSize?: number): Promise<ReminderViewModel[] | null> {
        return this.http
            .get<ReminderViewModel[]>(`${environment.serverEndpoint}${ReminderRoutes.getAll().client({ pageIndex, pageSize })}`)
            .toPromise();
    }
}
