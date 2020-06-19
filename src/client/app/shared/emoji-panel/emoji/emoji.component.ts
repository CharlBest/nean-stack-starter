import { Component, Input, OnChanges } from '@angular/core';
import * as emojiToolkit from 'emoji-toolkit';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss']
})
export class EmojiComponent implements OnChanges {

  @Input() shortName: string;
  @Input() size = 2;
  emoji: string;

  ngOnChanges() {
    emojiToolkit.sprites = true;
    const emojiSpan = emojiToolkit.shortnameToImage(this.shortName);
    emojiSpan.startsWith('<span') ? this.emoji = emojiSpan : this.emoji = '';
  }
}

