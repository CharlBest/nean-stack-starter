import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuComponent } from './context-menu/context-menu.component';

const materialModules = [
    MatButtonModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatIconModule,
];

@NgModule({
    imports: [
        CommonModule,
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
