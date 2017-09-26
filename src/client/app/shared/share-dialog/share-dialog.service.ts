import { Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class ShareDialogService {

    constructor(private dialog: MdDialog,
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
