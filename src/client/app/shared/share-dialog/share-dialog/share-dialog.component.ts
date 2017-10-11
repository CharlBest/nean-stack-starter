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

    hasWebShareApi() {
        if ((<any>navigator).share) {
            return true;
        } else {
            return false;
        }
    }

    webShare() {
        if (this.hasWebShareApi()) {
            (<any>navigator).share({ title: 'Referral link', text: this.link, url: this.link, });
        }
    }

    openSnackBar() {
        this.snackBar.open('Copied', '', {
            duration: 2000,
        });
    }
}
