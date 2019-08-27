import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { TranslateParams, translateService } from '@shared/translate/translate.service';

@Pipe({
    name: 'passwordCharacterMessageBuilder'
})
export class PasswordCharacterMessageBuilderPipe implements PipeTransform {
    transform(value: ValidationErrors | null, params?: TranslateParams) {
        const errorArray = [];
        if (value) {
            if (value.passwordCharacters.capital) {
                errorArray.push('Capital Letter');
            }
            if (value.passwordCharacters.lowercase) {
                errorArray.push('Lowercase Letter');
            }
            if (value.passwordCharacters.number) {
                errorArray.push('Number');
            }
            if (value.passwordCharacters.special) {
                errorArray.push('Special Character');
            }
        }
        return translateService.replacePlaceholders(errorArray.join(' - '), params);
    }
}
