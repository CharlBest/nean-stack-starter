import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiPanelComponent } from './emoji-panel/emoji-panel.component';
import {
  MdMenuModule,
  MdTabsModule,
  MdIconModule,
  MdButtonModule,
  MdExpansionModule,
  MdTooltipModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MdMenuModule,
    MdTabsModule,
    MdIconModule,
    MdButtonModule,
    MdExpansionModule,
    MdTooltipModule
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
