import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { ReportDialogService } from './report-dialog.service';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
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
