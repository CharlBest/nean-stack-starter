import { Component, Input } from '@angular/core';

@Component({
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
    @Input() title = 'Confirmation';
    @Input() message: string;
    @Input() confirmButtonText = 'Confirm';
    @Input() closeButtonText = 'Close';
}
