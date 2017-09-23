import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-share-user-dialog',
  templateUrl: './share-user-dialog.component.html',
  styleUrls: ['./share-user-dialog.component.scss']
})
export class ShareUserDialogComponent {

  link: string;

  constructor(public snackBar: MdSnackBar) { }

  onLinkClick() {
    return false;
  }

  openSnackBar() {
    this.snackBar.open('Copied', '', {
      duration: 2000,
    });
  }
}
