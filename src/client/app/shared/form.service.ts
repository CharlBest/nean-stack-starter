import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class FormService {

  constructor() { }

  public getServerErrors(errorResponse: HttpErrorResponse): Object {
    if (errorResponse.status === 400) {
      const errors = errorResponse.error;

      if (errors !== null && errors !== undefined) {
        try {
          return JSON.parse(errors);
        } catch (err) {
          return null;
        }
      }

      return null;
    }
  }
}
