import { Component, Input } from '@angular/core';

@Component({
  templateUrl: './view-media-dialog.component.html',
  styleUrls: ['./view-media-dialog.component.scss']
})
export class ViewMediaDialogComponent {

  @Input() src: string;
}
