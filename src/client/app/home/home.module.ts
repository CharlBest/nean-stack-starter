import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule, MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatListModule, MatMenuModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { MediaModule } from '../shared/media/media.module';
import { ShareDialogModule } from '../shared/share-dialog/share-dialog.module';
import { CommentsComponent } from './comments/comments.component';
import { GitHubComponent } from './github/github.component';
import { HomeRoutingModule } from './home-routing.module';
import { ItemComponent } from './item/item.component';
import { ItemsComponent } from './items/items.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
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
    MediaModule,
    ShareDialogModule,
    ...materialModules
  ],
  declarations: [
    ItemComponent,
    ItemsComponent,
    CommentsComponent,
    GitHubComponent,
  ],
  exports: [
    ItemComponent
  ]
})
export class HomeModule { }
