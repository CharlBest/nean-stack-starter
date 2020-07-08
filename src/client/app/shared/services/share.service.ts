import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ShareService {

    get hasWebShareApi(): boolean {
        if ((navigator as any /*Navigator*/).share) {
            return true;
        } else {
            return false;
        }
    }

    constructor(private snackBar: MatSnackBar,
        private router: Router,
        private clipboard: Clipboard) { }

    fullUrl(url: Url, navigationExtras?: NavigationExtras): string {
        return environment.serverEndpoint + this.router.createUrlTree(url, navigationExtras).toString();
    }

    webShare(title: string, fullUrl: string): boolean {
        if (this.hasWebShareApi) {
            (navigator as any /*Navigator*/).share({ title, text: '', url: fullUrl });
            return true;
        } else {
            return false;
        }
    }

    webShareWithUrl(title: string, url: Url, navigationExtras?: NavigationExtras): boolean {
        return this.webShare(title, this.fullUrl(url, navigationExtras));
    }

    copy(url: string): void {
        if (this.clipboard.copy(url)) {
            this.snackBar.open('Copied');
        }
    }

    copyWithUrl(url: Url): void {
        this.copy(this.fullUrl(url));
    }
}

export type Url = [string, string | number] | (string | number)[];
