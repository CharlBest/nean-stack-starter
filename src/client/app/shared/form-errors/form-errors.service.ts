import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormErrorsService {

  formErrors: any;

  constructor() { }

  updateFormValidity(errorResponse: HttpErrorResponse, form: FormGroup = null) {
    if (errorResponse.status === 400) {

      const errors = errorResponse.error.error.validation;

      if (errors !== null && errors !== undefined && errors.formErrors !== undefined
        && form !== undefined && form !== null) {
        for (const key in form.controls) {
          if (form.controls.hasOwnProperty(key)) {
            const fieldError = errors.formErrors.find(x => x.field === key);
            if (fieldError !== undefined) {
              form.get(key).setErrors(fieldError.errors);
            }
          }
        }
      }

      this.formErrors = errors.globalErrors;
    }
  }
}
