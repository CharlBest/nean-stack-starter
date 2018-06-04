import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';

@Injectable()
export class ShareDialogService {

    constructor(private dialog: MatDialog,
        private router: Router) { }

    share(link: any[]) {
        const newLink = environment.hostUrlForSharingToWeb + this.router.createUrlTree(link).toString();
        const dialogRef = this.dialog.open(ShareDialogComponent, {
            // width: '300px',
        });

        dialogRef.componentInstance.link = newLink;

        return dialogRef.afterClosed();
    }
}
