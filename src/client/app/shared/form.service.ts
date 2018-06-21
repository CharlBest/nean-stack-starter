import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  public getServerErrors(errorResponse: HttpErrorResponse): Object {
    if (errorResponse.status === 400) {
      const errors = errorResponse.error.validation;

      if (errors !== null && errors !== undefined) {
        return errors;
      }

      return null;
    }
  }
}
