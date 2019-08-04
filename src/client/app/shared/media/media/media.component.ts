import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewMediaDialogComponent } from '../view-media-dialog/view-media-dialog.component';
import { MediaType } from './media.enum';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnChanges {

  @Input() src: string;
  @Input() thumbnail = false;
  mediaType: MediaType;
  mediaTypeEnum = MediaType;
  safeSrc: string;

  constructor(private sanitizer: DomSanitizer,
    public dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName) && propName === 'src' && this.src) {
        this.processMediaType();
      }
    }
  }

  processMediaType() {
    if (this.src.substr(0, 25).indexOf('youtube.com') > -1) {
      if (this.thumbnail) {
        let token = '';
        const keyStartIndex = this.src.indexOf('?v=') + 3;
        const keyEndIndex = this.src.indexOf('&', keyStartIndex + 3);
        if (keyEndIndex > -1) {
          token = this.src.substring(keyStartIndex, keyEndIndex);
        } else {
          token = this.src.substring(keyStartIndex, this.src.length);
        }

        this.safeSrc = `http://img.youtube.com/vi/${token}/default.jpg`;
      } else {
        // TODO: rather load image than Iframe and add click to pic to load + play video
        this.src = this.src.replace('youtube.com/watch?v=', 'youtube.com/embed/');

        // TODO: this is dangerous and should be looked at again
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.src) as string;
      }

      this.mediaType = MediaType.YOUTUBE;
    } else if (this.src.substr(0, 25).indexOf('vimeo.com') > -1) {
      this.src = this.src.replace('vimeo.com/', 'player.vimeo.com/video/');
      // TODO: this is dangerous and should be looked at again
      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.src) as string;
      this.mediaType = MediaType.VIMEO;
    } else {
      this.mediaType = MediaType.IMAGE;
      this.safeSrc = this.src;
    }
  }

  openViewMediaDialog() {
    if (!this.thumbnail) {
      const dialog = this.dialog.open(ViewMediaDialogComponent);
      dialog.componentInstance.src = this.src;
    }
  }
}
