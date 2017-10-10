import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { NewsletterRoutingModule } from '../newsletter/newsletter-routing.module';
import { NewsletterService } from './newsletter.service';
import { TutorialModule } from '../shared/tutorial/tutorial.module';

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
