import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatIconModule, MatSnackBarModule } from '@angular/material';
import { ClipboardModule } from 'ngx-clipboard';
import { ShareDialogService } from './share-dialog.service';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';

const materialModules = [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
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
    providers: [
        ShareDialogService
    ],
    entryComponents: [
        ShareDialogComponent
    ]
})
export class ShareDialogModule { }
