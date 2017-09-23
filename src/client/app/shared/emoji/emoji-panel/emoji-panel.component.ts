import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as emojione from 'emojione';
import { MdTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-emoji-panel',
  templateUrl: './emoji-panel.component.html',
  styleUrls: ['./emoji-panel.component.scss']
})
export class EmojiPanelComponent implements OnInit {

  @Output() onInserted: EventEmitter<string> = new EventEmitter();
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
    new EmojiCategory('flags', 'Flags', 'flag')
  ];

  constructor() { }

  ngOnInit() {
    this.loadCategory(0);

    document.querySelector('body').addEventListener('click', (event) => {
      const img = (<HTMLImageElement>event.target);
      if (img
        && img.classList
        && img.classList.contains('emojione')) {
        this.onInserted.emit(img.title)
      }
    });
  }

  onTabSelectChange(event: MdTabChangeEvent) {
    this.loadCategory(event.index);
  }

  loadCategory(categoryIndex: number) {
    if (!this.emojiCategories[categoryIndex].hasViewed) {
      let shortname = '';
      for (const i in (<any>emojione).emojioneList) {
        if ((<any>emojione).emojioneList[i].category === this.emojiCategories[categoryIndex].category && i.indexOf('tone') === -1) {
          shortname = shortname + i;
        }
      }
      this.emojiCategories[categoryIndex].tabHTMLContent = emojione.toImage(shortname);
      this.emojiCategories[categoryIndex].hasViewed = true;
    }
  }
}

class EmojiCategory {
  category: string;
  tabHTMLContent: string;
  hasViewed = false;
  tabLabelText: string;
  tabLabelIcon: string;

  constructor(category, tabLabelText, tabLabelIcon) {
    this.category = category;
    this.tabLabelText = tabLabelText;
    this.tabLabelIcon = tabLabelIcon;
  }
}
