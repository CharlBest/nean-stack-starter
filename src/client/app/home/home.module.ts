import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule, MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { MediaModule } from '../shared/media/media.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { CommentsComponent } from './comments/comments.component';
import { GitHubComponent } from './github/github.component';
import { HomeRoutingModule } from './home-routing.module';
import { ItemComponent } from './item/item.component';
import { ItemsComponent } from './items/items.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatListModule,
  MatBottomSheetModule,
  MatTooltipModule,
  MatExpansionModule,
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
    ItemComponent,
    ItemsComponent,
    CommentsComponent,
    GitHubComponent,
  ]
})
export class HomeModule { }
