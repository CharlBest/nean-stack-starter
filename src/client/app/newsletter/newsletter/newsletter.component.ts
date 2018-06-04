import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  add(email: string) {
    this.isProcessing = true;

    const viewModel = new NewsletterMemberViewModel();
    viewModel.email = trimString(email);

    this.newsletterService.createNewsletterMember(viewModel).subscribe(data => {
      this.isProcessing = false;
      this.message = true;
    });
  }

  remove(email: string) {
    this.isProcessing = true;

    const viewModel = new NewsletterMemberViewModel();
    viewModel.email = trimString(email);

    this.newsletterService.deleteNewsletterMember(viewModel).subscribe(data => {
      this.isProcessing = false;
      this.message = true;
    });
  }
}
