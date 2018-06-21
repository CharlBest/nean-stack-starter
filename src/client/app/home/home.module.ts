import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatInputModule, MatListModule, MatProgressSpinnerModule } from '@angular/material';
import { MediaModule } from '../shared/media/media.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

const materialModules = [
  MatInputModule,
  MatChipsModule,
  MatListModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatButtonModule,
];

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    MediaModule,
    TutorialModule,
    ...materialModules
  ],
  declarations: [
    HomeComponent,
    SearchBarComponent
  ]
})
export class HomeModule { }
