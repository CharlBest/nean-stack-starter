import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { IconsModule } from '../shared/icons/icons.module';
import { PreloaderModule } from '../shared/preloader/preloader.module';
import { CustomReminderDialogComponent } from './custom-reminder-dialog/custom-reminder-dialog.component';
import { ReminderDialogComponent } from './reminder-dialog/reminder-dialog.component';
import { ReminderFormComponent } from './reminder-form/reminder-form.component';
import { ReminderRoutingModule } from './reminder-routing.module';
import { RemindersComponent } from './reminders/reminders.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatTooltipModule,
  MatDialogModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatDividerModule,
];

@NgModule({
  imports: [
    CommonModule,
    ReminderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IconsModule,
    FormErrorsModule,
    PreloaderModule,
    ...materialModules
  ],
  declarations: [
    RemindersComponent,
    ReminderFormComponent,
    ReminderDialogComponent,
    CustomReminderDialogComponent,
  ]
})
export class ReminderModule { }
