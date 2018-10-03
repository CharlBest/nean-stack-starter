import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorModel, GlobalError } from '../../../../shared/models/shared/error.model';

@Injectable({
  providedIn: 'root'
})
export class FormErrorsService {

  globalErrors: GlobalError;

  constructor() { }

  updateFormValidity(errorResponse: HttpErrorResponse, form: FormGroup | null = null) {
    if (errorResponse.status === 400) {
      const errors = errorResponse && errorResponse.error && errorResponse.error.error
        ? errorResponse.error.error.validation as ErrorModel
        : null;

      if (errors) {
        if (errors.formErrors && form) {
          for (const key in form.controls) {
            if (form.controls.hasOwnProperty(key)) {
              const fieldError = errors.formErrors.find(x => x.field === key);
              if (fieldError) {
                form.controls[key].setErrors(fieldError.errors);
              }
            }
          }
        }

        this.globalErrors = errors.globalErrors;
      }
    }
  }
}
