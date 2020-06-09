import { Component, Input, ViewChild } from '@angular/core';
import { CreateOrUpdateReminderViewModel } from '@shared/view-models/reminder/create-or-update-reminder.view-model';
import { ReminderViewModel } from '@shared/view-models/reminder/reminder.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';
import { ReminderService } from '../reminder.service';

@Component({
  templateUrl: './reminder-dialog.component.html',
  styleUrls: ['./reminder-dialog.component.scss']
})
export class ReminderDialogComponent {

  @Input() reminder?: ReminderViewModel;
  @ViewChild('reminderForm', { static: true }) reminderForm: ReminderFormComponent;
  isProcessing = false;

  constructor(public formErrorsService: FormErrorsService,
    private reminderService: ReminderService) { }

  async onSubmit() {
    this.isProcessing = true;

    const viewModel = new CreateOrUpdateReminderViewModel();
    viewModel.name = this.reminderForm.formGroup.controls.name.value;
    viewModel.date = this.reminderForm.formGroup.controls.date.value;

    try {
      const response = await this.reminderService.create(viewModel);
      if (response) {
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.reminderForm ? this.reminderForm.formGroup : null);
    } finally {
      this.isProcessing = false;
    }
  }
}
