import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { IconsModule } from '../icons/icons.module';
import { ContextMenuComponent } from './context-menu/context-menu.component';

const materialModules = [
    MatButtonModule,
    MatMenuModule,
    MatBottomSheetModule,
];

@NgModule({
    imports: [
        CommonModule,
        IconsModule,
        ...materialModules,
    ],
    declarations: [
        ContextMenuComponent
    ],
    exports: [
        ContextMenuComponent
    ]
})
export class ContextMenuModule { }
