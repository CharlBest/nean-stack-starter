import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-share-dialog',
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent {

    link: string;

    constructor(public snackBar: MatSnackBar) { }

    onLinkClick() {
        return false;
    }

    openSnackBar() {
        this.snackBar.open('Copied', '', {
            duration: 2000,
        });
    }
}
