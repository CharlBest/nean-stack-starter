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

        if (deviceInfo.device === DEVICES.UNKNOWN && deviceInfo.browser === BROWSERS.CHROME) { // Desktop + Chrome
            this.activeHelperTextSection = HelperTextSection.DESKTOP_CHROME;
        } else if (deviceInfo.device === DEVICES.ANDROID && deviceInfo.browser === BROWSERS.CHROME) { // Android Mobile + Chrome
            this.activeHelperTextSection = HelperTextSection.ANDROID_MOBILE_CHROME;
        } else if (deviceInfo.device === DEVICES.ANDROID && deviceInfo.browser === BROWSERS.MS_EDGE) { // Android Mobile + Edge
        }
    }
}

enum HelperTextSection {
    DESKTOP_CHROME,
    ANDROID_MOBILE_CHROME,
}
