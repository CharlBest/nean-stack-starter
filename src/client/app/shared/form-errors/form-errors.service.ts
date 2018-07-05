import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GLOBAL_ERROR_KEY } from '../../../../shared/validation/validators';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  updateFormValidity(errorResponse: HttpErrorResponse, form: FormGroup) {
    if (errorResponse.status === 400) {

      const errors = errorResponse.error.error.validation;

      if (errors !== null && errors !== undefined && errors.formErrors !== undefined) {
        for (const key in form.controls) {
          if (form.controls.hasOwnProperty(key)) {
            const fieldError = errors.formErrors.find(x => x.field === key);
            if (fieldError !== undefined) {
              form.get(key).setErrors(fieldError.errors);
            }
          }
        }
      }

      form[GLOBAL_ERROR_KEY] = errors.globalErrors;
    }
  }
}
