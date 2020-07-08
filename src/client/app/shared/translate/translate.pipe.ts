import { Pipe, PipeTransform } from '@angular/core';
import { TranslateParams, translateService } from '@shared/translate/translate.service';

@Pipe({
  name: 'translateParams'
})
export class TranslatePipe implements PipeTransform {
  transform(value: string, params?: TranslateParams): string | null {
    return translateService.replacePlaceholders(value, params);
  }
}
