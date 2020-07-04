import { Component, Input } from '@angular/core';

@Component({
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
    @Input() title: string;
    @Input() body: string;
    @Input() confirmButtonText: string;
    @Input() closeButtonText: string;
}
