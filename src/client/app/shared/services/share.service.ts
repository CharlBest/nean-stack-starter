import { Clipboard } from '@angular/cdk-experimental/clipboard';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ShareService {

    constructor(private snackBar: MatSnackBar,
        private router: Router,
        private clipboard: Clipboard) { }

    fullUrl(url: Url): string {
        return environment.httpDomain + this.router.createUrlTree(url).toString();
    }

    hasWebShareApi() {
        if ((navigator as any /*Navigator*/).share) {
            return true;
        } else {
            return false;
        }
    }

    webShare(title: string, fullUrl: string): boolean {
        if (this.hasWebShareApi()) {
            (navigator as any /*Navigator*/).share({ title, text: '', url: fullUrl });
            return true;
        } else {
            return false;
        }
    }

    webShareWithUrl(title: string, url: Url): boolean {
        return this.webShare(title, this.fullUrl(url));
    }

    copy(url: string) {
        if (this.clipboard.copy(url)) {
            this.snackBar.open('Copied');
        }
    }

    copyWithUrl(url: Url) {
        this.copy(this.fullUrl(url));
    }
}

export type Url = [string, string | number] | (string | number)[];
