import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatTabsModule } from '@angular/material';
import { EmojiPanelDirective } from './emoji-panel.directive';
import { EmojiPanelComponent } from './emoji-panel/emoji-panel.component';

const materialModules = [
  MatTabsModule,
  MatIconModule,
  MatButtonModule
];

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    A11yModule,
    ...materialModules
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
