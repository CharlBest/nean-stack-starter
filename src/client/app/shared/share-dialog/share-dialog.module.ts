import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdDialogModule, MdButtonModule, MdIconModule } from '@angular/material';
import { ClipboardModule } from 'ngx-clipboard';
import { ShareDialogService } from './share-dialog.service';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        ClipboardModule,
        MdDialogModule,
        MdButtonModule,
        MdIconModule
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
