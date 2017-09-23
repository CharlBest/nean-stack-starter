import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialRoutingModule } from '../tutorial/tutorial-routing.module';
import { TutorialComponent } from '../tutorial/tutorial/tutorial.component';
import { TutorialService } from '../tutorial/tutorial.service';
import { MdButtonModule, MdCardModule } from '@angular/material';
import { FirstTimeUserComponent } from './first-time-user/first-time-user.component';
import { CreatePostComponent } from './create-post/create-post.component';

@NgModule({
  imports: [
    CommonModule,
    TutorialRoutingModule,
    MdButtonModule,
    MdCardModule
  ],
  declarations: [
    TutorialComponent,
    FirstTimeUserComponent,
    CreatePostComponent,
  ],
  providers: [
    TutorialService
  ]
})
export class TutorialModule { }
