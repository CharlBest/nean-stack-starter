import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

const materialModules = [
    MatDialogModule,
    MatButtonModule
];

@NgModule({
    imports: [
        ...materialModules
    ],
    declarations: [
        AlertDialogComponent,
        ConfirmDialogComponent
    ]
})
export class DialogModule { }
