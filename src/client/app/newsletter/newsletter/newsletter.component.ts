import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup, trimString } from '../../../../shared/validation/validators';
import { NewsletterMemberViewModel } from '../../../../shared/view-models/newsletter/newsletter-member.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { BreakpointService } from '../../shared/breakpoint.service';
import { NewsletterService } from '../newsletter.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  formGroup: FormGroup;
  isProcessing = false;
  removingEmail = false;
  message = false;
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
    viewModel.email = trimString(this.formGroup.get('email').value);

    this.newsletterService.createNewsletterMember(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.message = true;
      });
  }

  remove() {
    this.isProcessing = true;

    const viewModel = new NewsletterMemberViewModel();
    viewModel.email = trimString(this.formGroup.get('email').value);

    this.newsletterService.deleteNewsletterMember(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.message = true;
      });
  }
}
