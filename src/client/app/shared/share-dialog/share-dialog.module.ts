import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { ShareDialogService } from './share-dialog.service';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';
import {
    MatDialogModule,
    MatButtonModule,
    MatIconModule
} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        ClipboardModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
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
