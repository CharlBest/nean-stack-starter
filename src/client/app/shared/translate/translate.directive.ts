import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { TranslateTerm } from '@shared/translate/translate-term.interface';
import { translateService } from '@shared/translate/translate.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[translate]'
})
export class TranslateDirective implements OnInit {

  constructor(private templateRef: TemplateRef<{ $implicit: TranslateTerm }>,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      $implicit: translateService.getActiveLanguage,
    });
  }
}
