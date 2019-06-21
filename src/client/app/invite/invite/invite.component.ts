import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent, MatChipList } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { Validators } from '../../../../shared/validation/validators';
import { InviteViewModel } from '../../../../shared/view-models/invite/invite.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { InviteService } from '../invite.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  @ViewChild(MatChipList, { static: true }) chipList: MatChipList;
  isProcessing = false;
  isDone = false;
  emails: Array<string> = [];
  // Enter, comma, semi-colon
  separatorKeysCodes = [ENTER, COMMA, 186];

  constructor(private inviteService: InviteService,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService) { }

  ngOnInit() {
  }

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

  onSubmit(emailsInput: HTMLInputElement) {
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
      this.inviteService.sendInvites(viewModel)
        .pipe(finalize(() => this.isProcessing = false))
        .subscribe(() => {
          this.isDone = true;
        }, error => {
          this.formErrorsService.updateFormValidity(error);
        });
    }
  }
}
