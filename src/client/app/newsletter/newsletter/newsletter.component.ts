import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { trimString } from '../../../../shared/validation/validators';
import { NewsletterMemberViewModel } from '../../../../shared/view-models/newsletter/newsletter-member.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { NewsletterService } from '../newsletter.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  input = new FormControl;
  isProcessing = false;
  removingEmail = false;
  message = false;
  tutorialTypeEnum = TutorialType;

  constructor(private newsletterService: NewsletterService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      if (params.has('removeEmail')) {
        this.removingEmail = params.get('removeEmail') === 'true';
      } else {
        this.removingEmail = false;
      }
    });
  }

  add() {
    this.isProcessing = true;

    const viewModel = new NewsletterMemberViewModel();
    viewModel.email = trimString(this.input.value);

    this.newsletterService.createNewsletterMember(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.message = true;
      });
  }

  remove() {
    this.isProcessing = true;

    const viewModel = new NewsletterMemberViewModel();
    viewModel.email = trimString(this.input.value);

    this.newsletterService.deleteNewsletterMember(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(() => {
        this.message = true;
      });
  }
}
