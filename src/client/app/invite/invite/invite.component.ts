import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ViewChild } from '@angular/core';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { Validators } from '@shared/validation/validators';
import { InviteViewModel } from '@shared/view-models/invite/invite.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { InviteService } from '../invite.service';

@Component({
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent {

  @ViewChild(MatChipList, { static: true }) chipList: MatChipList;
  isProcessing = false;
  isDone = false;
  emails: Array<string> = [];
  // Enter, comma, semi-colon
  readonly separatorKeysCodes = [ENTER, COMMA, 186];

  constructor(private inviteService: InviteService,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService) { }

  add(event: MatChipInputEvent): void {
    const { input, value } = event;
    const email = value.trim();

    if (value && !Validators.email(email)) {
      if (!this.emails.includes(email)) {
        this.emails.push(email);
        this.chipList.errorState = false;
        input.value = '';
      }
    } else if (value && email && email !== '') {
      this.chipList.errorState = true;
    }
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  async onSubmit(emailsInput: HTMLInputElement): Promise<void> {
    this.isProcessing = true;

    const viewModel = new InviteViewModel();

    if (!this.emails || (this.emails && this.emails.length === 0)) {
      if (emailsInput.value && !Validators.email(emailsInput.value.trim())) {
        viewModel.emails = [emailsInput.value.trim()];
      }
    } else {
      viewModel.emails = this.emails;
    }

    if (viewModel.emails) {
      try {
        await this.inviteService.sendInvites(viewModel);
        this.isDone = true;
      } catch (error) {
        this.formErrorsService.updateFormValidity(error);
      } finally {
        this.isProcessing = false;
      }
    }
  }

  trackByFn(index: number, item: string): number {
    return index;
  }
}
