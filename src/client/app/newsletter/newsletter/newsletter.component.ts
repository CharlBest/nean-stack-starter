import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { NewsletterMemberViewModel } from '../../../../shared/view-models/newsletter/newsletter-member.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { NewsletterService } from '../newsletter.service';

@Component({
  selector: 'app-newsletter',
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
    this.route.queryParamMap.subscribe(params => {
      if (params.has('removeEmail')) {
        this.removingEmail = params.get('removeEmail') === 'true';
      } else {
        this.removingEmail = false;
      }
    });

    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.newsletter());
  }

  add() {
    this.isProcessing = true;

    const viewModel = new NewsletterMemberViewModel();
    viewModel.email = this.formGroup.controls['email'].value.trim();

    this.newsletterService.createNewsletterMember(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.isDone = true;
      });
  }

  remove() {
    this.isProcessing = true;

    const viewModel = new NewsletterMemberViewModel();
    viewModel.email = this.formGroup.controls['email'].value.trim();

    this.newsletterService.deleteNewsletterMember(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.isDone = true;
      });
  }
}
