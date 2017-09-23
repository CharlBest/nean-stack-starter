import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MdDialog } from '@angular/material';
import { ViewMediaDialogComponent } from '../view-media-dialog/view-media-dialog.component';

@Component({
  selector: 'app-media-type',
  templateUrl: './media-type.component.html',
  styleUrls: ['./media-type.component.scss']
})
export class MediaTypeComponent implements OnChanges {

  @Input() url: string;
  @Input() thumbnail: boolean;
  mediaType: MediaType;
  mediaTypeEnum = MediaType;
  safeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer,
    public dialog: MdDialog) { }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'url') {
        if (this.url !== null && this.url !== undefined) {
          this.processMediaType();
        }
      }
    }
  }

  processMediaType() {
    if (this.url.substr(0, 25).indexOf('youtube.com') > -1) {
      if (this.thumbnail) {

        let token = '';
        const keyStartIndex = this.url.indexOf('?v=') + 3;
        const keyEndIndex = this.url.indexOf('&', keyStartIndex + 3);
        if (keyEndIndex > -1) {
          token = this.url.substring(keyStartIndex, keyEndIndex);
        } else {
          token = this.url.substring(keyStartIndex, this.url.length);
        }

        this.safeUrl = `http://img.youtube.com/vi/${token}/default.jpg`;
      } else {
        // TODO: rather load image than Iframe and add click to pic to load + play video
        this.url = this.url.replace('youtube.com/watch?v=', 'youtube.com/embed/');

        // TODO: this is dangerous and should be looked at again
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      }

      this.mediaType = MediaType.YouTube;
    } else if (this.url.substr(0, 25).indexOf('vimeo.com') > -1) {
      this.url = this.url.replace('vimeo.com/', 'player.vimeo.com/video/');
      // TODO: this is dangerous and should be looked at again
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      this.mediaType = MediaType.Vimeo;
    } else {
      this.mediaType = MediaType.Image;
      this.safeUrl = this.url;
    }
  }

  viewMedia() {
    if (!this.thumbnail) {
      const dialog = this.dialog.open(ViewMediaDialogComponent);
      dialog.componentInstance.url = this.url;
    }
  }
}

enum MediaType {
  Image = 1,
  YouTube = 2,
  Vimeo = 3
}
