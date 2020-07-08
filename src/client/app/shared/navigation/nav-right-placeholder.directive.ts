import { Directive, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { NavigationService } from './navigation.service';

@Directive({
  selector: '[appNavRightPlaceholder]'
})
export class NavRightPlaceholderDirective implements OnInit, OnDestroy {

  constructor(private templateRef: TemplateRef<HTMLElement>,
    private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.navigationService.navigationPlaceholderTemplate = this.templateRef;
  }

  ngOnDestroy(): void {
    this.navigationService.navigationPlaceholderTemplate = null;
  }
}
