import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatBottomSheet, MatMenuTrigger } from '@angular/material';
import * as emojione from 'emojione';
import { BreakpointService } from '../../breakpoint.service';
import { PreventBackNavigationService } from '../../prevent-back-navigation.service';

declare function require(moduleName: string): any;

@Component({
  selector: 'app-emoji-panel',
  templateUrl: './emoji-panel.component.html',
  styleUrls: ['./emoji-panel.component.scss']
})
export class EmojiPanelComponent implements OnInit {
  file: Array<EmojiData> = require('../../../../../../node_modules/emojione-assets/emoji.json');
  @Input() closeOnInsert = false;
  @Output() inserted: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('bottomSheet') bottomSheetRef: TemplateRef<any>;
  isPanelForWebOpen = false;

  emojiCategories = [
    new EmojiCategory('people', 'Smileys & People', 'tag_faces'),
    new EmojiCategory('nature', 'Animals & Nature', 'pets'),
    new EmojiCategory('food', 'Food & Drink', 'free_breakfast'),
    new EmojiCategory('activity', 'Activity', 'beach_access'),
    new EmojiCategory('travel', 'Travel & Places', 'directions_car'),
    new EmojiCategory('objects', 'Objects', 'lightbulb_outline'),
    new EmojiCategory('symbols', 'Symbols', 'priority_high'),
    new EmojiCategory('flags', 'Flags', 'flag'),
  ];

  constructor(public bottomSheet: MatBottomSheet,
    public bpService: BreakpointService,
    private preventBackNavigationService: PreventBackNavigationService) { }

  ngOnInit() {
    (<any>emojione).sprites = true;
    (<any>emojione).imagePathSVGSprites = './assets/emoji/';

    for (const key in this.file) {
      if (this.file[key].diversity === null && this.file[key].category !== 'regional' && this.file[key].category !== 'modifier') {
        const tab = this.emojiCategories.find(x => x.category === this.file[key].category);
        tab.emojiData.push({
          key,
          value: this.file[key]
        });
      }
    }

    this.emojiCategories.forEach(x => x.emojiData.sort((a, b) => a.value.order - b.value.order));
  }

  onClick(shortname: string) {
    this.inserted.emit(shortname);

    if (this.closeOnInsert) {
      this.isPanelForWebOpen = !this.isPanelForWebOpen;
    }
  }

  openPanel() {
    if (this.bpService.isWeb) {
      this.isPanelForWebOpen = true;
    } else {
      this.preventBackNavigationService.beforeOpen();

      this.bottomSheet.open(this.bottomSheetRef, {
        backdropClass: 'cdk-overlay-transparent-backdrop',
        panelClass: 'emoji-panel',
        autoFocus: false,
        closeOnNavigation: true
      }).afterDismissed().subscribe(() => this.preventBackNavigationService.afterClosed());
    }
  }

  openDiversitiesElseInsert(emojiValue: EmojiData, menuTrigger: MatMenuTrigger) {
    if (emojiValue.diversities.length > 0) {
      menuTrigger.openMenu()
    } else {
      menuTrigger.closeMenu();
      this.onClick(emojiValue.shortname);
    }
  }
}

class EmojiCategory {
  category: string;
  tabLabelText: string;
  tabLabelIcon: string;
  emojiData: Array<{ key: string, value: EmojiData }>;

  constructor(category, tabLabelText, tabLabelIcon) {
    this.category = category;
    this.tabLabelText = tabLabelText;
    this.tabLabelIcon = tabLabelIcon;
    this.emojiData = [];
  }
}

interface EmojiData {
  ascii: Array<string>;
  category: string;
  code_points: {
    base: string;
    decimal: string;
    fully_qualified: string;
    non_fully_qualified: string;
    output: string;
    default_matches: Array<string>;
    greedy_matches: Array<string>;
  }
  display: number;
  diversities: Array<string>;
  diversity: string;
  gender: string;
  genders: Array<string>;
  keywords: Array<string>;
  name: string;
  order: number;
  shortname: string;
  shortname_alternates: Array<string>;
  unicode_version: number
}
