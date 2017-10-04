import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterModule } from '@angular/router';
import { TutorialModule } from '../../shared/tutorial/tutorial.module';
import {
  MdTabsModule,
  MdInputModule,
  MdIconModule,
  MdMenuModule,
  MdButtonModule,
  MdSnackBarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MdInputModule,
    MdIconModule,
    MdMenuModule,
    MdButtonModule,
    MdTabsModule,
    MdSnackBarModule,
    TutorialModule
  ],
  exports: [
    NavigationComponent
  ],
  declarations: [
    NavigationComponent
  ]
})
export class NavigationModule { }
