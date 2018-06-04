import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LegalService {

    constructor(private http: HttpClient) { }
}
