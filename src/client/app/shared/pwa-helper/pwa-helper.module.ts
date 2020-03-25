import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IconsModule } from '../icons/icons.module';
import { PWAHelperService } from './pwa-helper.service';
import { PWAHelperComponent } from './pwa-helper/pwa-helper.component';

const materialModules = [
    MatCardModule,
    OverlayModule
];

@NgModule({
    imports: [
        CommonModule,
        IconsModule,
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
    ]
})
export class PWAHelperModule { }
