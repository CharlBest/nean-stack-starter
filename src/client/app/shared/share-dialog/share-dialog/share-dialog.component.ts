import { Component } from '@angular/core';
import { ShareService } from '../../services/share.service';

@Component({
    selector: 'app-share-dialog',
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent {

    url: string;

    constructor(public shareService: ShareService) { }

    webShare() {
        this.shareService.webShare('Link', this.url);
    }

    copy() {
        this.shareService.copy(this.url);
        return false;
    }
}
