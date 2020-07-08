import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { NewsletterMemberViewModel } from '@shared/view-models/newsletter/newsletter-member.view-model';
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

  constructor(private newsletterService: NewsletterService,
    private route: ActivatedRoute,
    public bpService: BreakpointService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formOnInit();
    this.getParams();
  }

  formOnInit(): void {
    this.formGroup = this.fb.group(FormGroupBuilder.newsletter());
  }

  getParams(): void {
    const email = this.route.snapshot.queryParams.email;
    if (email) {
      this.formGroup.controls.email.setValue(email);
      this.removingEmail = true;
    }
  }

  async add(): Promise<void> {
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

  async remove(): Promise<void> {
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
