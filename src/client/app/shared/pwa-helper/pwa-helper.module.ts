import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule, MatIconModule } from '@angular/material';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { PWAHelperService } from './pwa-helper.service';
import { PWAHelperComponent } from './pwa-helper/pwa-helper.component';

const materialModules = [
    MatCardModule,
    MatIconModule,
    OverlayModule
];

@NgModule({
    imports: [
        CommonModule,
        DeviceDetectorModule.forRoot(),
        ...materialModules
    ],
    exports: [
        PWAHelperComponent
    ],
    providers: [
        PWAHelperService
    ],
    declarations: [
        PWAHelperComponent
    ],
    entryComponents: [
        PWAHelperComponent
    ]
})
export class PWAHelperModule { }
