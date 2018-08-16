import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DialogService } from './dialog.service';

const materialModules = [
    MatDialogModule,
    MatButtonModule
];

@NgModule({
    imports: [
        ...materialModules
    ],
    entryComponents: [
        AlertDialogComponent,
        ConfirmDialogComponent
    ],
    declarations: [
        AlertDialogComponent,
        ConfirmDialogComponent
    ],
    providers: [
        DialogService
    ]
})
export class DialogModule { }
