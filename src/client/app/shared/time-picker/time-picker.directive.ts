import { Directive, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimePickerComponent } from './time-picker/time-picker.component';

@Directive({
    selector: '*[appTimePicker]'
})
export class TimePickerDirective {

    constructor(private dialog: MatDialog) { }

    @HostListener('click') onClick() {
        this.dialog.open(TimePickerComponent);
    }
}
