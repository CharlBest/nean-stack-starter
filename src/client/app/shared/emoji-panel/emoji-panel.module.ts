import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiPanelComponent } from './emoji-panel/emoji-panel.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { EmojiPanelDirective } from './emoji-panel.directive';
import {
  MatTabsModule,
  MatIconModule,
  MatButtonModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    OverlayModule,
    A11yModule
  ],
  declarations: [
    EmojiPanelComponent,
    EmojiPanelDirective
  ],
  exports: [
    EmojiPanelComponent,
    EmojiPanelDirective
  ],
  entryComponents: [
    EmojiPanelComponent
  ]
})
export class EmojiPanelModule { }
