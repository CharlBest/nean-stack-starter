import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Url } from '../services/share.service';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class ShareDialogService {

    constructor(private dialog: MatDialog,
        private router: Router) { }

    share(text: string, url: Url, navigationExtras?: NavigationExtras) {
        const dialogRef = this.dialog.open(ShareDialogComponent);
        dialogRef.componentInstance.url = environment.serverEndpoint + this.router.createUrlTree(url, navigationExtras).toString();
        dialogRef.componentInstance.text = text;

        return dialogRef.afterClosed();
    }
}
