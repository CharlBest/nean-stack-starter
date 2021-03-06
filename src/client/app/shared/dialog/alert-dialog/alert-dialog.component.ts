import { Component, Input } from '@angular/core';

@Component({
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {
    @Input() title: string;
    @Input() body: string;
    @Input() closeButtonText: string;
}
