import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { ClipboardModule } from 'ngx-clipboard';
import { ReportDialogService } from './report-dialog.service';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';

const materialModules = [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
];

@NgModule({
    imports: [
        CommonModule,
        ClipboardModule,
        ...materialModules
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
