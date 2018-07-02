import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MyValidators } from '../../../shared/validation/new-validators';

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

  applyServerErrorValidationOnForm(errorResponse: HttpErrorResponse, form: FormGroup) {
    if (errorResponse.status === 400) {
      const errors = errorResponse.error.validation;

      if (errors !== null && errors !== undefined) {
        for (const key in form.controls) {
          if (form.controls.hasOwnProperty(key)) {
            form.get(key).setErrors(errors);
          }
        }

        form[MyValidators.globalErrorKey] = errors.globalErros;
      }
    }
  }
}
