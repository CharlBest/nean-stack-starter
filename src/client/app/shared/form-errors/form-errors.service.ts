import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ErrorModel, GlobalError } from '@shared/models/shared/error.model';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormErrorsService implements OnDestroy {

  private routerEventsSubscription: Subscription;
  globalErrors: GlobalError | null;

  constructor(private router: Router) {
    this.routerEventsSubscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.globalErrors = null;
      });
  }

  updateFormValidity(errorResponse: HttpErrorResponse, form: FormGroup | null = null) {
    if (errorResponse.status === 400) {
      const errors = errorResponse && errorResponse.error && errorResponse.error.error
        ? errorResponse.error.error.validation as ErrorModel
        : null;

      if (errors) {
        // Set form errors
        if (errors.formErrors && form) {
          this.setErrorsOnControls(errors, form);
        }
        this.globalErrors = errors.globalErrors;
      }
    }
  }

  setErrorsOnControls(errors: ErrorModel, form: FormGroup) {
    for (const key in form.controls) {
      if (form.controls.hasOwnProperty(key)) {
        const fieldError = errors.formErrors.find(formError => formError.field === key);
        if (fieldError) {
          form.controls[key].setErrors(fieldError.errors);
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }
}
