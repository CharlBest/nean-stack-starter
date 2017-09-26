import { Component, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';

@Component({
    selector: 'app-share-dialog',
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent {

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
