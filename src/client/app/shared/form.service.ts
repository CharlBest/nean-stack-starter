import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
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
