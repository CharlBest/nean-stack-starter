import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShareService, Url } from '../services/share.service';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';

@Injectable()
export class ShareDialogService {

    constructor(private dialog: MatDialog,
        private shareService: ShareService) { }

    share(url: Url, text: string) {
        const dialogRef = this.dialog.open(ShareDialogComponent);
        dialogRef.componentInstance.url = this.shareService.fullUrl(url);
        dialogRef.componentInstance.text = text;

        return dialogRef.afterClosed();
    }
}
