import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NewsletterMemberViewModel } from '@shared/view-models/newsletter/newsletter-member.view-model';
import { TutorialType } from '@shared/view-models/tutorial/tutorial-type.enum';
import { FormGroupBuilder } from '../../../../shared/validation/form-group-builder';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { NewsletterService } from '../newsletter.service';

@Component({
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  formGroup: FormGroup;
  isProcessing = false;
  removingEmail = false;
  isDone = false;
  tutorialTypeEnum = TutorialType;

  constructor(private newsletterService: NewsletterService,
    private route: ActivatedRoute,
    public bpService: BreakpointService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.formOnInit();
    this.getParams();
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.newsletter());
  }

  getParams() {
    this.removingEmail = this.route.snapshot.queryParams.removeEmail === 'true';

    const email = this.route.snapshot.queryParams.email;
    this.formGroup.controls.email.setValue(email);
    this.removingEmail = true;
  }

  async add() {
    this.isProcessing = true;

    const viewModel = new NewsletterMemberViewModel();
    viewModel.email = this.formGroup.controls.email.value.trim();

    try {
      await this.newsletterService.createNewsletterMember(viewModel);
      this.isDone = true;
    } catch (error) {
      // TODO: error handling
    } finally {
      this.isProcessing = false;
    }
  }

  async remove() {
    this.isProcessing = true;

    const email = this.formGroup.controls.email.value.trim();

    try {
      await this.newsletterService.deleteNewsletterMember(email);
      this.isDone = true;
    } catch (error) {
      // TODO: error handling
    } finally {
      this.isProcessing = false;
    }
  }
}
