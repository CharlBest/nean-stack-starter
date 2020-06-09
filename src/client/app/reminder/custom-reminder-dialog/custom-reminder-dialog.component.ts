import { Component } from '@angular/core';
import { BreakpointService } from '../../shared/services/breakpoint.service';

@Component({
  templateUrl: './custom-reminder-dialog.component.html',
  styleUrls: ['./custom-reminder-dialog.component.scss']
})
export class CustomReminderDialogComponent {

  durationInMinutes = 10
  timeFrame: TimeFrame = 'min';
  notificationType: 'notification' | 'email' = 'notification';

  constructor(public bpService: BreakpointService) { }

  onDurationInMinutesChange(value: number) {
    this.durationInMinutes = value;
    this.checkMaxDuration();
  }

  onTimeFrameChange(value: TimeFrame) {
    this.timeFrame = value;
    this.checkMaxDuration();
  }

  checkMaxDuration() {
    if (this.timeFrame === 'min' && this.durationInMinutes > 600) {
      this.durationInMinutes = 600;
    } else if (this.timeFrame === 'hour' && this.durationInMinutes > 120) {
      this.durationInMinutes = 120;
    } else if (this.timeFrame === 'day' && this.durationInMinutes > 28) {
      this.durationInMinutes = 28;
    } else if (this.timeFrame === 'week' && this.durationInMinutes > 4) {
      this.durationInMinutes = 4;
    }
  }

  async onSubmit() {

  }
}

type TimeFrame = 'min' | 'hour' | 'day' | 'week';