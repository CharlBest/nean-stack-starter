import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { MdButtonModule, MdCardModule, MdInputModule, MdProgressSpinnerModule } from '@angular/material';
import { NewsletterRoutingModule } from '../newsletter/newsletter-routing.module';
import { NewsletterService } from './newsletter.service';
import { TutorialModule } from '../shared/tutorial/tutorial.module';

@NgModule({
  imports: [
    CommonModule,
    NewsletterRoutingModule,
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    MdProgressSpinnerModule,
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
