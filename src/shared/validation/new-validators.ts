import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class MyValidators {
    public static readonly globalErrorKey = 'globalErrors';

    private static wrapControl(control: AbstractControl | string | number): AbstractControl {
        return control instanceof AbstractControl ? control : <any>{ value: control };
    }

    static required(control: AbstractControl | string | number): ValidationErrors | null {
        return Validators.required(MyValidators.wrapControl(control));
    }

    static email(control: AbstractControl | string | number): ValidationErrors | null {
        return Validators.email(MyValidators.wrapControl(control));
    }

    static minLength(length: number): ValidatorFn {
        return (control: AbstractControl | string | number): ValidationErrors | null => {
            return Validators.minLength(length).call(this, MyValidators.wrapControl(control));
        };
    }

    static is4(control: AbstractControl | string | number): ValidationErrors | null {
        return MyValidators.wrapControl(control).value === '4' ? { is4: true } : null;
    }

    static is5(control: AbstractControl | string | number): ValidationErrors | null {
        return MyValidators.wrapControl(control).value === '5' ? { is5: true } : null;
    }
}
