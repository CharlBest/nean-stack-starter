import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiPanelComponent } from './emoji-panel/emoji-panel.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import {
  MatMenuModule,
  MatTabsModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    OverlayModule,
    A11yModule
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
