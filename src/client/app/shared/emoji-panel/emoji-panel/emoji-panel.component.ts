import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatMenuTrigger } from '@angular/material/menu';
import * as emojiToolkit from 'emoji-toolkit';
import { debounceTime } from 'rxjs/operators';
import { BreakpointService } from '../../services/breakpoint.service';
import { PreventBackNavigationService } from '../../services/prevent-back-navigation.service';
import { EmojiCategory, EmojiCategoryName, EmojiData, EmojiJsonFile } from './emoji.model';

@Component({
  selector: 'app-emoji-panel',
  templateUrl: './emoji-panel.component.html',
  styleUrls: ['./emoji-panel.component.scss']
})
export class EmojiPanelComponent implements OnInit {
  file: EmojiJsonFile;
  @Input() closeOnInsert = false;
  @Output() readonly selected: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('bottomSheet', { static: true }) bottomSheetRef: TemplateRef<unknown>;
  searchControl = new FormControl();
  isPanelForWebOpen = false;
  emojiCategoryName = EmojiCategoryName;
  selectedIndex = 1;
  isProcessing = true;

  emojiCategories = [
    new EmojiCategory(EmojiCategoryName.SEARCH),
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

  ngOnInit(): void {
    this.onSearch();
  }

  async render(): Promise<void> {
    emojiToolkit.sprites = true;
    emojiToolkit.imagePathSVGSprites = '.';

    // TODO: this should potentially move to a service as well as all in memory data like emojiData for when this comp
    // is used on more than one page so that it can be reused rather than loading it again.
    this.file = await import('../../../../../../node_modules/emoji-assets/emoji.json') as any;

    for (const key in this.file) {
      if (this.file[key].diversity === null &&
        this.file[key].category !== 'regional' && this.file[key].category !== 'modifier') {
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

    this.isProcessing = false;
  }

  onSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(400)
    ).subscribe(value => {
      // Reset
      if (value === '') {
        this.clearSearch();
        return;
      }

      const searchTab = this.emojiCategories.find(emoji => emoji.category === EmojiCategoryName.SEARCH);
      if (searchTab) {
        this.selectedIndex = 0;
        const searchResults = [];

        for (const key in this.file) {
          if (this.file[key].diversity === null && // Remove diversity emoji
            ((this.file[key].keywords && this.file[key].keywords.some(keyword => keyword.startsWith(value))) || // keyword
              (this.file[key].name && this.file[key].name.startsWith(value)))) { // name
            searchResults.push({
              key,
              value: this.file[key]
            });
          }
        }

        searchTab.emojiData = searchResults;
      }
    });
  }

  clearSearch(): void {
    const searchTab = this.emojiCategories.find(emoji => emoji.category === EmojiCategoryName.SEARCH);
    if (searchTab) {
      this.selectedIndex = 1;
      this.searchControl.setValue(null, { emitEvent: false });
      searchTab.emojiData = [];
    }
  }

  onClick(shortname: string): void {
    this.selected.emit(shortname);

    if (this.closeOnInsert) {
      this.isPanelForWebOpen = !this.isPanelForWebOpen;
    }
  }

  async openPanel(): Promise<void> {
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

  openDiversitiesElseInsert(emojiValue: EmojiData, menuTrigger: MatMenuTrigger): void {
    if (emojiValue.diversities.length > 0) {
      menuTrigger.openMenu();
    } else {
      menuTrigger.closeMenu();
      this.onClick(emojiValue.shortname);
    }
  }

  // TODO: reimplement swipe features
  // onSwipeLeft(event: HammerInput): void {
  //   if (this.selectedIndex < 8) {
  //     this.selectedIndex = this.selectedIndex + 1;
  //   }
  // }
  // onSwipeRight(event: HammerInput): void {
  //   const searchTab = this.emojiCategories.find(emoji => emoji.category === EmojiCategoryName.SEARCH);
  //   if (this.selectedIndex > 1 || (this.selectedIndex === 1 && searchTab && searchTab.emojiData.length > 0)) {
  //     this.selectedIndex = this.selectedIndex - 1;
  //   }
  // }

  trackByFnForCategory(index: number, item: EmojiCategory): number {
    return index;
  }

  trackByFnForEmoji(index: number, item: unknown): number {
    return index;
  }

  trackByFnForEmojiDiversity(index: number, emojiDiversity: string): number {
    return index;
  }
}

