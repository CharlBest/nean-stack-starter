import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatBottomSheet, MatTabChangeEvent } from '@angular/material';
import * as emojione from 'emojione';
import { BreakpointService } from '../../breakpoint.service';

declare function require(moduleName: string): any;
const file: Array<EmojiData> = require('../../../../../../node_modules/emojione-assets/emoji.json');

@Component({
  selector: 'app-emoji-panel',
  templateUrl: './emoji-panel.component.html',
  styleUrls: ['./emoji-panel.component.scss']
})
export class EmojiPanelComponent implements OnInit {
  @Input() closeOnInsert = false;
  @Output() inserted: EventEmitter<string> = new EventEmitter();
  @ViewChild('bottomSheet') bottomSheetRef: TemplateRef<any>;
  isPanelForWebOpen = false;
  visibleEmoji: string;
  emojiList;
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
  newEmojiList = [];

  constructor(public bottomSheet: MatBottomSheet,
    public bpService: BreakpointService) { }

  ngOnInit() {
    console.log(file);
    // console.log((<any>emojione));
    (<any>emojione).sprites = true;
    (<any>emojione).imagePathSVGSprites = './assets/emoji/';

    for (const i in (<any>emojione).emojioneList) {
      this.newEmojiList.push({
        category: (<any>emojione).emojioneList[i].category,
        key: (<any>emojione).emojioneList[i].uc_base
      });
    }

    for (const key in file) {
      if (file[key].diversity === null && file[key].category !== 'regional' && file[key].category !== 'modifier') {
        const tab = this.emojiCategories.find(x => x.category === file[key].category);
        tab.emojiData.push({
          key,
          value: file[key]
        });
      }
    }

    this.emojiCategories.forEach(x => x.emojiData.sort((a, b) => a.value.order - b.value.order));

    // On emoji click
    // document.querySelector('body').addEventListener('click', (event) => {
    //   const img = (<HTMLImageElement>event.target);
    //   if (img
    //     && img.classList
    //     && img.classList.contains('emojione')) {
    //     this.inserted.emit(img.title);

    //     if (this.closeOnInsert) {
    //       this.isPanelForWebOpen = !this.isPanelForWebOpen;
    //     }
    //   }
    // });
  }

  onTabSelectChange(event: MatTabChangeEvent) {
    this.loadCategory(event.index);
  }

  loadCategory(categoryIndex: number) {
    // if (!this.emojiCategories[categoryIndex].hasViewed) {
    //   let shortname = '';
    //   for (const i in (<any>emojione).emojioneList) {
    //     if ((<any>emojione).emojioneList[i].category === this.emojiCategories[categoryIndex].category && i.indexOf('tone') === -1) {
    //       shortname = shortname + i;
    //     }
    //   }
    //   this.emojiCategories[categoryIndex].tabHTMLContent = emojione.toImage(shortname);
    //   this.emojiCategories[categoryIndex].hasViewed = true;
    // }
  }

  openPanel() {
    if (this.bpService.isWeb) {
      this.isPanelForWebOpen = true;
    } else {
      this.bottomSheet.open(this.bottomSheetRef, {
        backdropClass: 'cdk-overlay-transparent-backdrop',
        panelClass: 'emoji-panel'
      });
    }
  }
}

class EmojiCategory {
  category: string;
  tabHTMLContent: string;
  hasViewed = false;
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
  ascii: Array<any>;
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
