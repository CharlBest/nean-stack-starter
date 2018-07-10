import { Component, OnInit } from '@angular/core';
import { BROWSERS, DeviceDetectorService, DeviceInfo, DEVICES } from 'ngx-device-detector';

@Component({
    selector: 'app-pwa-helper',
    templateUrl: './pwa-helper.component.html',
    styleUrls: ['./pwa-helper.component.scss']
})
export class PWAHelperComponent implements OnInit {

    helperTextSection = HelperTextSection;
    activeHelperTextSection: HelperTextSection;

    constructor(private deviceService: DeviceDetectorService) { }

    ngOnInit() {
        // TODO: work in progress (need to test individually)
        const deviceInfo: DeviceInfo = this.deviceService.getDeviceInfo();

        // Desktop + Chrome
        if (deviceInfo.device === DEVICES.UNKNOWN && deviceInfo.browser === BROWSERS.CHROME) {
            this.activeHelperTextSection = HelperTextSection.DESKTOP_CHROME;
        }
        // Android Mobile + Chrome
        else if (deviceInfo.device === DEVICES.ANDROID && deviceInfo.browser === BROWSERS.CHROME) {
            this.activeHelperTextSection = HelperTextSection.ANDROID_MOBILE_CHROME;
        }
        // Android Mobile + Edge
        else if (deviceInfo.device === DEVICES.ANDROID && deviceInfo.browser === BROWSERS.MS_EDGE) {
        }
    }
}

enum HelperTextSection {
    DESKTOP_CHROME,
    ANDROID_MOBILE_CHROME,
}