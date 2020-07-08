import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { TimePickerModel } from './time-picker/time-picker.model';

@Directive({
    selector: '*[appTimePicker]'
})
export class TimePickerDirective {

    @Input() time: string;
    @Output() readonly timePicked: EventEmitter<TimePickerModel> = new EventEmitter<TimePickerModel>();

    constructor(private dialog: MatDialog) { }

    @HostListener('click') onClick(): void {
        const dialogRef = this.dialog.open(TimePickerComponent);
        dialogRef.componentInstance.time = this.time;
        dialogRef.componentInstance.timePicked.subscribe((time: TimePickerModel) => {
            this.timePicked.emit(time);
        });
    }
}
