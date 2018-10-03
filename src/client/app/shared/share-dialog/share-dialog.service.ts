import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ShareService, Url } from '../services/share.service';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';

@Injectable()
export class ShareDialogService {

    constructor(private dialog: MatDialog,
        private shareService: ShareService) { }

    share(url: Url) {
        const dialogRef = this.dialog.open(ShareDialogComponent);
        dialogRef.componentInstance.url = this.shareService.fullUrl(url);

        return dialogRef.afterClosed();
    }
}
