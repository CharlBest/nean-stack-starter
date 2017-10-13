import { Directive, HostListener, HostBinding, Input, ElementRef } from '@angular/core';

@Directive({
  selector: 'img[appImgError]'
})
export class ImgErrorDirective {

  defaultImage = '/assets/default-image.png';

  constructor(private element: ElementRef) { }

  @HostListener('error') onError() {
    this.element.nativeElement.src = this.defaultImage;
  }
}
