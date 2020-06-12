import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { IconsModule } from '../icons/icons.module';
import { TimePickerDirective } from './time-picker.directive';
import { TimePickerComponent } from './time-picker/time-picker.component';

const materialModules = [
  MatDialogModule,
  MatButtonModule,
  MatInputModule,
  MatAutocompleteModule,
];

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    FormsModule,
    ReactiveFormsModule,
    ...materialModules
  ],
  declarations: [
    TimePickerComponent,
    TimePickerDirective,
  ],
  exports: [
    TimePickerComponent,
    TimePickerDirective,
  ]
})
export class TimePickerModule { }
