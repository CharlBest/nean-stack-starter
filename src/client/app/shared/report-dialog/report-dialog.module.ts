import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdDialogModule, MdButtonModule, MdIconModule } from '@angular/material';
import { ClipboardModule } from 'ngx-clipboard';
import { ReportDialogService } from './report-dialog.service';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        ClipboardModule,
        MdDialogModule,
        MdButtonModule,
        MdIconModule
    ],
    declarations: [
        ReportDialogComponent
    ],
    providers: [
        ReportDialogService
    ],
    entryComponents: [
        ReportDialogComponent
    ]
})
export class ReportDialogModule { }
