import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-share-dialog',
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent {

    link: string;

    constructor(private snackBar: MatSnackBar) { }

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
            (<any>navigator).share({ title: 'Referral link', text: '', url: this.link, });
        }
    }

    openSnackBar() {
        this.snackBar.open('Copied', null, {
            duration: 2000,
        });
    }
}
