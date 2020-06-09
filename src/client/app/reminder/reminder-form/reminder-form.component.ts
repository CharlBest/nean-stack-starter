import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { ReminderViewModel } from '@shared/view-models/reminder/reminder.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { CustomReminderDialogComponent } from '../custom-reminder-dialog/custom-reminder-dialog.component';

@Component({
  selector: 'app-reminder-form',
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss']
})
export class ReminderFormComponent implements OnInit {

  @Output() readonly submitForm: EventEmitter<void> = new EventEmitter<void>();
  @Input() reminder: ReminderViewModel | null;
  formGroup: FormGroup;

  constructor(private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.createOrUpdateReminder(
      this.reminder ? this.reminder.name : null,
      this.reminder ? this.reminder.date : null,
    ));
  }

  openCustomReminderDialog() {
    const dialog = this.dialog.open(CustomReminderDialogComponent);
    dialog.afterClosed().subscribe(data => {

    });
  }

  async onSubmit() {
    this.submitForm.emit();
  }
}
