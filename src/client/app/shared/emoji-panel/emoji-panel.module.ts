import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmojiPanelDirective } from './emoji-panel.directive';
import { EmojiPanelComponent } from './emoji-panel/emoji-panel.component';

const materialModules = [
  MatTabsModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatCardModule,
  MatBottomSheetModule,
  MatMenuModule
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
