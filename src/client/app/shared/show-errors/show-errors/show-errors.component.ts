import { Component, Input } from '@angular/core';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';
import { Validators } from '../../../../../shared/validation/validators';

@Component({
  selector: 'app-show-errors',
  templateUrl: './show-errors.component.html',
  styleUrls: ['./show-errors.component.scss']
})
export class ShowErrorsComponent {

  @Input() private control: AbstractControlDirective | AbstractControl;

  constructor() { }

  shouldShowErrors(): boolean {
    return this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched);
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors)
      .map(field => {
        // TODO: this is a hack
        const errors = this.control.errors[field];
        if (errors.message) {
          return errors.message;
        }
        return Validators.getMessage(field, this.control.errors[field]);
      });
  }
}
