import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ShareService {

    constructor(private snackBar: MatSnackBar,
        private router: Router,
        private clipboardService: ClipboardService) { }

    fullUrl(url: Url): string {
        return environment.httpDomain + this.router.createUrlTree(url).toString();
    }

    hasWebShareApi() {
        if ((<any>navigator).share) {
            return true;
        } else {
            return false;
        }
    }

    webShare(title: string, fullUrl: string): boolean {
        if (this.hasWebShareApi()) {
            (<any>navigator).share({ title, text: '', url: fullUrl });
            return true;
        } else {
            return false;
        }
    }

    webShareWithUrl(title: string, url: Url): boolean {
        return this.webShare(title, this.fullUrl(url));
    }

    copy(url: string) {
        if (this.clipboardService.copyFromContent(url)) {
            this.snackBar.open('Copied');
        }
    }

    copyWithUrl(url: Url) {
        this.copy(this.fullUrl(url));
    }
}

export type Url = [string, string | number] | (string | number)[];
