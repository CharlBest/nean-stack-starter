import { Component, Input } from '@angular/core';

@Component({
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {
    @Input() title = 'Alert';
    @Input() message: string;
    @Input() closeButtonText = 'Close';
}
