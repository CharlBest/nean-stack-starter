import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';

@Injectable()
export class ShareDialogService {

    constructor(private dialog: MatDialog,
        private router: Router) { }

    share(link: [string, string | number]) {
        const newLink = environment.hostUrlForSharingToWeb + this.router.createUrlTree(link).toString();
        const dialogRef = this.dialog.open(ShareDialogComponent);

        dialogRef.componentInstance.link = newLink;

        return dialogRef.afterClosed();
    }
}
