import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatIconModule, MatSnackBarModule, MatTooltipModule } from '@angular/material';
import { ClipboardModule } from 'ngx-clipboard';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';

const materialModules = [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule
];

@NgModule({
    imports: [
        CommonModule,
        ClipboardModule,
        ...materialModules
    ],
    declarations: [
        ShareDialogComponent
    ],
    entryComponents: [
        ShareDialogComponent
    ]
})
export class ShareDialogModule { }
