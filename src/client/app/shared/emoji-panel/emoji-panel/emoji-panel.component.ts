import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatMenuTrigger } from '@angular/material/menu';
import * as emojione from 'emojione';
import { BreakpointService } from '../../services/breakpoint.service';
import { PreventBackNavigationService } from '../../services/prevent-back-navigation.service';
import { EmojiCategory, EmojiCategoryName, EmojiData, EmojiJsonFile } from './emoji.model';

@Component({
  selector: 'app-emoji-panel',
  templateUrl: './emoji-panel.component.html',
  styleUrls: ['./emoji-panel.component.scss']
})
export class EmojiPanelComponent {
  file: EmojiJsonFile;
  @Input() closeOnInsert = false;
  @Output() readonly inserted: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('bottomSheet', { static: true }) bottomSheetRef: TemplateRef<any>;
  isPanelForWebOpen = false;
  emojiCategoryName = EmojiCategoryName;
  selectedIndex = 0;

  emojiCategories = [
    new EmojiCategory(EmojiCategoryName.PEOPLE),
    new EmojiCategory(EmojiCategoryName.NATURE),
    new EmojiCategory(EmojiCategoryName.FOOD),
    new EmojiCategory(EmojiCategoryName.ACTIVITY),
    new EmojiCategory(EmojiCategoryName.TRAVEL),
    new EmojiCategory(EmojiCategoryName.OBJECTS),
    new EmojiCategory(EmojiCategoryName.SYMBOLS),
    new EmojiCategory(EmojiCategoryName.FLAGS)
  ];

  constructor(public bottomSheet: MatBottomSheet,
    public bpService: BreakpointService,
    private preventBackNavigationService: PreventBackNavigationService) { }

  async render() {
    (emojione as any).sprites = true;
    (emojione as any).imagePathSVGSprites = '.';

    // TODO: this should potentially move to a service as well as all in memory data like emojiData for when this comp
    // is used on more than one page so that it can be reused rather than loading it again.
    this.file = await import('../../../../../../node_modules/emojione-assets/emoji.json');

    for (const key in this.file) {
      if (this.file[key].diversity === null && this.file[key].category !== 'regional' &&
        this.file[key].category !== 'modifier') {
        const tab = this.emojiCategories.find(emoji => emoji.category === this.file[key].category);
        if (tab) {
          tab.emojiData.push({
            key,
            value: this.file[key]
          });
        } else {
          console.error('Could not find tab');
        }
      }
    }

    this.emojiCategories.forEach(emoji => {
      emoji.emojiData.sort((a, b) => a.value.order - b.value.order);
    });
  }

  onClick(shortname: string) {
    this.inserted.emit(shortname);

    if (this.closeOnInsert) {
      this.isPanelForWebOpen = !this.isPanelForWebOpen;
    }
  }

  async openPanel() {
    if (!this.file) {
      this.render();
    }

    if (this.bpService.isDesktop) {
      this.isPanelForWebOpen = true;
    } else {
      this.preventBackNavigationService.beforeOpen();

      await this.bottomSheet.open(this.bottomSheetRef, {
        backdropClass: 'cdk-overlay-transparent-backdrop',
        panelClass: 'emoji-panel'
      }).afterDismissed().toPromise();

      this.preventBackNavigationService.afterClosed();
    }
  }

  openDiversitiesElseInsert(emojiValue: EmojiData, menuTrigger: MatMenuTrigger) {
    if (emojiValue.diversities.length > 0) {
      menuTrigger.openMenu();
    } else {
      menuTrigger.closeMenu();
      this.onClick(emojiValue.shortname);
    }
  }

  onSwipeLeft(event: HammerInput) {
    if (this.selectedIndex < 7) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  onSwipeRight(event: HammerInput) {
    if (this.selectedIndex > 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  trackByFnForCategory(index: number, item: EmojiCategory) {
    return index;
  }

  trackByFnForEmoji(index: number, item: any) {
    return index;
  }

  trackByFnForEmojiDiversity(index: number, item: any) {
    return index;
  }
}

