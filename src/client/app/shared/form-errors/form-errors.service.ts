import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorModel } from '../../../../shared/models/shared/error.model';

@Injectable({
  providedIn: 'root'
})
export class FormErrorsService {

  formErrors: any;

  constructor() { }

  updateFormValidity(errorResponse: HttpErrorResponse, form: FormGroup | null = null) {
    if (errorResponse.status === 400) {
      const errors = errorResponse.error.error.validation as ErrorModel;

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

        this.formErrors = errors.globalErrors;
      }
    }
  }
}
