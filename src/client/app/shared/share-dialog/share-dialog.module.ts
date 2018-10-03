import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatIconModule, MatSnackBarModule, MatTooltipModule } from '@angular/material';
import { ShareDialogService } from './share-dialog.service';
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
