import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IconsModule } from '../icons/icons.module';
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
    declarations: [
        PWAHelperComponent
    ]
})
export class PWAHelperModule { }
