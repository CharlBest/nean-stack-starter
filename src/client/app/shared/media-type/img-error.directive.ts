import { Directive, HostListener, HostBinding, Input, ElementRef } from '@angular/core';

@Directive({
  selector: 'img[appImgError]'
})
export class ImgErrorDirective {

  defaultImage = '/assets/default-image.png';

  constructor(private el: ElementRef) { }

  @HostListener('error') onError() {
    this.el.nativeElement.src = this.defaultImage;
  }
}
