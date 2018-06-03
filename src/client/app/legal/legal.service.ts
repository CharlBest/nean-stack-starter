import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserRoutes } from '../../../shared/routes/user.routes';

@Injectable()
export class LegalService {

    constructor(private http: HttpClient) { }
}
