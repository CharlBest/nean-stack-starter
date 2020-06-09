import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReminderViewModel } from '@shared/view-models/reminder/reminder.view-model';
import { ReminderDialogComponent } from '../reminder-dialog/reminder-dialog.component';

@Component({
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss']
})
export class RemindersComponent {

  constructor(private dialog: MatDialog) { }

  createOrUpdateReminder(reminder?: ReminderViewModel) {
    const dialog = this.dialog.open(ReminderDialogComponent);
    dialog.componentInstance.reminder = reminder;
  }

  trackByFn(index: number, reminder: string) {
    return index;
  }
}
