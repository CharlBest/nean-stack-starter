import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss']
})

export class FormErrorsComponent {
  @Input() control: FormControl;

  passwordCharacterMessageBuilder() {
    // TODO: this is potentailly slow and bad for perf. Rather use a pure pipe
    const errorArray = [];
    if (this.control.errors) {
      if (this.control.errors.passwordCharacters.capital) {
        errorArray.push('Capital Letter');
      }
      if (this.control.errors.passwordCharacters.lowercase) {
        errorArray.push('Lowercase Letter');
      }
      if (this.control.errors.passwordCharacters.number) {
        errorArray.push('Number');
      }
      if (this.control.errors.passwordCharacters.special) {
        errorArray.push('Special Character');
      }
    }
    return errorArray.join(' - ');
  }
}
