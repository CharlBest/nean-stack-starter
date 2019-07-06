import { Component, Input, OnInit } from '@angular/core';

@Component({
  templateUrl: './view-media-dialog.component.html',
  styleUrls: ['./view-media-dialog.component.scss']
})
export class ViewMediaDialogComponent implements OnInit {

  @Input() src: string;

  constructor() { }

  ngOnInit() {
  }
}
