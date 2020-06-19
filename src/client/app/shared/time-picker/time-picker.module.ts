import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { IconsModule } from '../icons/icons.module';
import { ExtractTimePipe } from './extract-time.pipe';
import { TimePickerDirective } from './time-picker.directive';
import { TimePickerComponent } from './time-picker/time-picker.component';

const materialModules = [
  MatButtonModule,
  MatInputModule,
  MatAutocompleteModule,
  MatDialogModule,
];

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ReactiveFormsModule,
    ...materialModules
  ],
  declarations: [
    TimePickerComponent,
    TimePickerDirective,
    ExtractTimePipe,
  ],
  exports: [
    TimePickerDirective,
    ExtractTimePipe,
  ]
})
export class TimePickerModule { }
