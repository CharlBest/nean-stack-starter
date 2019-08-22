import { AfterViewInit, ContentChild, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { IconVisibilityComponent, IconVisibilityOffComponent } from '../icons/icons/material-icons.component';

@Directive({
  selector: '[appPasswordExpose]'
})
export class PasswordExposeDirective implements AfterViewInit {

  @ContentChild(MatInput, { read: ElementRef, static: false })
  private input: ElementRef<HTMLInputElement>;
  private visibilityIcon: IconVisibilityComponent;
  private visibilityOffIcon: IconVisibilityOffComponent;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.visibilityIcon = this.el.nativeElement.querySelector('app-icon-visibility');
    this.visibilityOffIcon = this.el.nativeElement.querySelector('app-icon-visibility-off');
    this.hide();
  }
  @HostListener('mousedown') onMouseDown() {
    this.show();
  }

  @HostListener('document:mouseup') onMouseUp() {
    this.hide();
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
}
