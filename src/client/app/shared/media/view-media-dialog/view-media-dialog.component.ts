import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-media-dialog',
  templateUrl: './view-media-dialog.component.html',
  styleUrls: ['./view-media-dialog.component.scss']
})
export class ViewMediaDialogComponent implements OnInit {

  @Input() src: string;

  constructor() { }

  ngOnInit() {
  }
}
