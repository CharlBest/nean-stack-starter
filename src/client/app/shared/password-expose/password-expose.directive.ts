import { AfterViewInit, ContentChild, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { MatInput } from '@angular/material/input';

@Directive({
  selector: '[appPasswordExpose]'
})
export class PasswordExposeDirective implements AfterViewInit, OnDestroy {

  @ContentChild(MatInput, { read: ElementRef }) private input: ElementRef<HTMLInputElement>;
  private visibilityIcon: HTMLElement | null;
  private visibilityOffIcon: HTMLElement | null;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.visibilityIcon = this.el.nativeElement.querySelector('app-icon-visibility');
    this.visibilityOffIcon = this.el.nativeElement.querySelector('app-icon-visibility-off');

    this.addEventListeners();

    this.setStyles(this.visibilityIcon);
    this.setStyles(this.visibilityOffIcon);

    this.hide();
  }

  setStyles(element: HTMLElement | null) {
    if (element) {
      element.style.userSelect = 'none';
      element.style.cursor = 'pointer';
    }
  }

  addEventListeners() {
    if (this.visibilityOffIcon) {
      this.show = this.show.bind(this);
      this.visibilityOffIcon.addEventListener('mousedown', this.show);
      this.visibilityOffIcon.addEventListener('touchstart', this.show);

      this.hide = this.hide.bind(this);
      document.addEventListener('mouseup', this.hide);
      document.addEventListener('touchend', this.hide);
    }
  }

  show() {
    this.input.nativeElement.type = 'text';
    this.renderer.setStyle(this.visibilityOffIcon, 'display', 'none');
    this.renderer.removeStyle(this.visibilityIcon, 'display');
  }

  hide() {
    this.input.nativeElement.type = 'password';
    this.renderer.setStyle(this.visibilityIcon, 'display', 'none');
    this.renderer.removeStyle(this.visibilityOffIcon, 'display');
  }

  ngOnDestroy() {
    if (this.visibilityOffIcon) {
      this.visibilityOffIcon.removeEventListener('mousedown', this.show);
      this.visibilityOffIcon.removeEventListener('touchstart', this.show);

      document.removeEventListener('mouseup', this.hide);
      document.removeEventListener('touchend', this.hide);
    }
  }
}
