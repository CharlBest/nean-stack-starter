import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
    @Input() message: string;
    @Input() confirmButtonText = 'Confirm';
    @Input() closeButtonText = 'Close';
}
