import { Component, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss']
})

export class FormErrorsComponent implements OnChanges {
  @Input() control: FormControl;
  isValid: boolean;

  ngOnChanges() {
    this.control.statusChanges.subscribe(x => {
      this.isValid = !this.control.hasError('email') && !this.control.hasError('required') && !this.control.hasError('minlength');
    });
  }
}
