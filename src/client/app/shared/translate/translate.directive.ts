import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { translateService } from '@shared/translate/translate.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[translate]'
})
export class TranslateDirective implements OnInit {

  constructor(private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      $implicit: translateService.getActiveLanguage,
    });
  }
}
