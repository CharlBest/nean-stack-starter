import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { TimeZone, TimeZoneGroup, timeZones } from './time-zones';

@Component({
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Output() readonly timePicked: EventEmitter<string> = new EventEmitter<string>();

  is24Hour = false;
  isAM = true;
  timeZoneGroups: Observable<TimeZoneGroup[]>;;
  editTimeZone = false;
  // TODO: hours should rather show 00:00 than 24:00
  hoursControl: FormControl;
  minutesControl: FormControl;
  timeZone: FormControl;
  minutes = 0;
  userTimeZone = '00:00';

  constructor(private dialogRef: MatDialogRef<TimePickerComponent>) { }

  ngOnInit() {
    this.formOnInit();

    // Hours
    this.setOnHoursChange();

    // Minutes
    this.setOnMinutesChange();

    // Get user time zone
    this.setUserTimeZone();
  }

  formOnInit() {
    this.hoursControl = new FormControl(10, [
      Validators.required,
      Validators.min(1),
      Validators.max(24),
      Validators.pattern('^\d{2}$')
    ]);

    this.minutesControl = new FormControl('00', [
      Validators.required,
      Validators.pattern('^\d{2}$')
    ]);

    this.timeZone = new FormControl(this.getTimeZone());
    this.timeZoneGroups = this.timeZone.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          if (value) {
            return timeZones
              .map(group => ({ name: group.name, zones: this.filterTimeZones(group.zones, value) }))
              .filter(group => group.zones.length > 0);
          }

          return timeZones;
        })
      );
  }

  setOnHoursChange() {
    this.hoursControl.valueChanges.subscribe((value: number) => {
      if ((this.is24Hour && value > 24) || (!this.is24Hour && value > 12)) {
        value = this.is24Hour ? 24 : 12;
      } else if (value < 1) {
        value = 1;
      }

      this.hoursControl.setValue(value, { emitEvent: false });
    });
  }

  setOnMinutesChange() {
    this.minutesControl.valueChanges.subscribe((value: string) => {
      let intValue = 0;

      if (value !== '') {
        intValue = parseInt(value, 10);
      }

      if (intValue > 59) {
        this.minutes = 59;
      } else if (intValue < 0) {
        this.minutes = 0;
      } else {
        this.minutes = intValue;
      }

      let newValue = '';
      if (this.minutes === 0) {
        newValue = '00';
      } else if (this.minutes > 0 && this.minutes < 10) {
        newValue = `0${this.minutes}`;
      } else {
        newValue = this.minutes.toString();
      }

      this.minutesControl.setValue(newValue, { emitEvent: false });
    });
  }

  filterTimeZones(timeZone: TimeZone[], value: string): TimeZone[] {
    const filterValue = value.toLowerCase();
    return timeZone.filter(zone => zone.name.toLowerCase().indexOf(filterValue) === 0);
  }

  autocompleteDisplayFn(timeZone: TimeZone): string {
    return timeZone && timeZone.name ? timeZone.name : '';
  }

  toggleHours(increment: boolean = true) {
    // Up
    if (increment) {
      if ((this.is24Hour && this.hoursControl.value < 24) || (!this.is24Hour && this.hoursControl.value < 12)) {
        this.hoursControl.setValue(this.hoursControl.value + 1);
      } else {
        this.hoursControl.setValue(1);
      }
    }

    // Down
    if (!increment) {
      if (this.hoursControl.value > 1) {
        this.hoursControl.setValue(this.hoursControl.value - 1);
      } else {
        this.hoursControl.setValue(this.is24Hour ? 24 : 12);
      }
    }
  }

  toggleMinutes(increment: boolean = true) {
    // Up
    if (increment) {
      if (this.minutes < 59) {
        this.minutes++;
      } else {
        this.minutes = 0;
      }
    }

    // Down
    if (!increment) {
      if (this.minutes > 0) {
        this.minutes--;
      } else {
        this.minutes = 59;
      }
    }

    // Set display
    this.minutesControl.setValue(this.minutes.toString());
  }

  toggle24Hour() {
    // This is neccessary for when value change is triggered on form control
    const is24Hour = this.is24Hour;

    if (!is24Hour) {
      this.is24Hour = true;

      if (!this.isAM) {
        this.hoursControl.setValue(this.hoursControl.value + 12);
      }
    }

    if (is24Hour) {
      this.is24Hour = false;

      if (this.hoursControl.value > 12) {
        this.hoursControl.setValue(this.hoursControl.value - 12);
        this.isAM = false;
      } else {
        this.isAM = true;
      }
    }
  }

  setUserTimeZone() {
    if (Intl && (Intl as any).DateTimeFormat) {
      this.userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } else {
      this.userTimeZone = this.getTimeZone();
    }
  }

  getTimeZone() {
    const offset = new Date().getTimezoneOffset();
    const totalMinutes = Math.abs(offset);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${offset < 0 ? '+' : '-'}${hours.toString().length > 1 ? hours : '0' + hours}:${minutes.toString().length > 1 ? minutes : '0' + minutes}`;
  }

  onSubmit() {
    let hours = this.hoursControl.value;
    if (!this.is24Hour && !this.isAM) {
      hours = hours + 12;
    }
    const hoursFormatted = hours.toString().length > 1 ? hours : `0${hours}`;
    const dateString = `2000-01-01T${hoursFormatted}:${this.minutesControl.value}:00${this.timeZone.value}`;
    console.log(dateString);
    const date = new Date(dateString);

    this.dialogRef.close();
    this.timePicked.emit(date.toISOString());
  }

  trackByFn(index: number, timeZoneGroup: TimeZoneGroup) {
    return index;
  }
}
