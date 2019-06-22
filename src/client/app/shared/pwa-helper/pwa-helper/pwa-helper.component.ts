import { Platform } from '@angular/cdk/platform';
import { Component, OnInit } from '@angular/core';
import { HelperTextSection } from './pwa-helper.enum';

@Component({
    selector: 'app-pwa-helper',
    templateUrl: './pwa-helper.component.html',
    styleUrls: ['./pwa-helper.component.scss']
})
export class PWAHelperComponent implements OnInit {

    helperTextSection = HelperTextSection;
    activeHelperTextSection: HelperTextSection;

    constructor(private platform: Platform) { }

    ngOnInit() {
        this.initScreenSizes();
    }

    initScreenSizes() {
        // TODO: work in progress (need to test individually)

        if (!this.platform.ANDROID && !this.platform.IOS && this.platform.BLINK) { // Desktop + Chrome
            this.activeHelperTextSection = HelperTextSection.DESKTOP_CHROME;
        } else if (this.platform.ANDROID && this.platform.BLINK) { // Android Mobile + Chrome
            this.activeHelperTextSection = HelperTextSection.ANDROID_MOBILE_CHROME;
        } else if (this.platform.IOS && this.platform.EDGE) { // Android Mobile + Edge
        }
    }
}
