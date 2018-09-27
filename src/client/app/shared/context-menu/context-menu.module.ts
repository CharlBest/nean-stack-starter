import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule, MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';
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
