import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { NewsletterRoutingModule } from '../newsletter/newsletter-routing.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { NewsletterService } from './newsletter.service';
import { NewsletterComponent } from './newsletter/newsletter.component';

@NgModule({
  imports: [
    CommonModule,
    NewsletterRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TutorialModule
  ],
  declarations: [
    NewsletterComponent
  ],
  providers: [
    NewsletterService
  ]
})
export class NewsletterModule { }
