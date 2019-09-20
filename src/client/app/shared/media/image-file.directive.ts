import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { FileModel } from '@shared/models/shared/file.model';

@Directive({
  selector: 'img[appImageFile]'
})
export class ImageFileDirective implements OnInit {

  @Input() appImageFile: FileModel;

  constructor(private element: ElementRef<HTMLImageElement>) { }

  ngOnInit() {
    this.element.nativeElement.src = this.appImageFile.url;

    if (this.appImageFile.width) {
      this.element.nativeElement.width = this.appImageFile.width;
    }

    if (this.appImageFile.height) {
      this.element.nativeElement.height = this.appImageFile.height;
    }

    // Set rotation
  }
}
