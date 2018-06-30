import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MyValidators } from './shared/validator';


@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.css']
})
export class FormErrorsComponent {
  formGroup: FormGroup;
  SERVER_ERRORS = {
    formErrors: [
      {
        key: 'email',
        errors: {
          required: true,
          minlength: { requiredLength: 10, actualLength: 5 }
        }
      },
      {
        key: 'age',
        errors: {
          required: true,
        }
      }
    ],
    globalErrors: {
      usernameIsTaken: true,
      appDbError: {
        create: 2
      }
    }
  };

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      email: [null, [MyValidators.required, MyValidators.email, MyValidators.minLength(10)]],
      age: [null, [MyValidators.required, MyValidators.is4]]
    });

    const model = {
      email: '',
      age: 1
    };

    const hasErrors = [
      { email: MyValidators.required(model.email) } ||
      MyValidators.email(model.email)
    ];

    console.log(hasErrors);
  }

  addCustomError() {
    this.applyServerErrorValidationOnForm(this.formGroup);
  }

  applyServerErrorValidationOnForm(form: FormGroup) {
    for (const key in form.controls) {
      if (form.controls.hasOwnProperty(key)) {
        form.get(key).setErrors(<any>this.SERVER_ERRORS.formErrors.find(x => x.key === key).errors);
      }
    }

    Object.assign(form[MyValidators.globalErrorKey] = new Errors(), this.SERVER_ERRORS.globalErrors);
  }
}

class Errors {
  required?: boolean;
  minlength?: {
    requiredLength: number,
    actualLength: number
  };

  // Custom
  usernameIsTaken?: boolean;
  appDbError?: {
    create: number
  };

  hasError(errorCode: string): boolean {
    return this[errorCode] ? true : null;
  }
}

@Component({
  selector: 'app-form-errors',
  template: `
 <div *ngIf="errorFormControl.hasError('email')">
  Invalid email address
 </div>

 <div *ngIf="errorFormControl.hasError('required')">
  Required
 </div>

 <div *ngIf="errorFormControl.hasError('minlength')">
  {{errorFormControl.errors['minlength'].actualLength}} but needs to be {{errorFormControl.errors['minlength'].requiredLength}}
 </div>
 `
})

export class FormErrorsComponent {
  @Input() errorFormControl: FormControl;
}