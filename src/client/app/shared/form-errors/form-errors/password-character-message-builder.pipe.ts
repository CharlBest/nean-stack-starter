import { Pipe, PipeTransform } from '@angular/core';
import { PasswordCharacters } from '@shared/models/shared/form-error.model';
import { TranslateParams, translateService } from '@shared/translate/translate.service';

@Pipe({
    name: 'passwordCharacterMessageBuilder'
})
export class PasswordCharacterMessageBuilderPipe implements PipeTransform {
    transform(value: PasswordCharacters, params?: TranslateParams) {
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
