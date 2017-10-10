import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiPanelComponent } from './emoji-panel/emoji-panel.component';
import {
  MatMenuModule,
  MatTabsModule,
  MatIconModule,
  MatButtonModule,
  MatExpansionModule,
  MatTooltipModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  declarations: [
    EmojiPanelComponent
  ],
  exports: [
    EmojiPanelComponent
  ],
  entryComponents: [
    EmojiPanelComponent
  ]
})
export class EmojiModule { }
