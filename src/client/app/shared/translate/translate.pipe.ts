import { Pipe, PipeTransform } from '@angular/core';
import { TranslateParams, translateService } from '@shared/translate/translate.service';

@Pipe({
  name: 'translateParams'
})
export class TranslatePipe implements PipeTransform {
  constructor() { }

  transform(value: string, params?: TranslateParams) {
    return translateService.replacePlaceholders(value, params);
  }
}
