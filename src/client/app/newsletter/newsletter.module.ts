import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { NewsletterRoutingModule } from '../newsletter/newsletter-routing.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { NewsletterComponent } from './newsletter/newsletter.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [
    CommonModule,
    NewsletterRoutingModule,
    ReactiveFormsModule,
    TutorialModule,
    ...materialModules
  ],
  declarations: [
    NewsletterComponent
  ],
  providers: []
})
export class NewsletterModule { }
