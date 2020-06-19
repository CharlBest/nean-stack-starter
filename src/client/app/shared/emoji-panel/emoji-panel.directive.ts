import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import * as emojiToolkit from 'emoji-toolkit';
import { EmojiPanelComponent } from './emoji-panel/emoji-panel.component';

@Directive({
    selector: '*[appEmojiPanel]'
})
export class EmojiPanelDirective implements OnInit {

    @Input() placeholder = 'Type here...';
    @Input() appEmojiPanel: EmojiPanelComponent;

    @HostListener('keyup') onKeypress() {
        // sanitize
    }

    constructor(private el: ElementRef<HTMLElement>,
        private renderer: Renderer2) { }

    ngOnInit() {
        this.renderElement();
        this.emojiPanel();
    }

    renderElement() {
        this.renderer.setAttribute(this.el.nativeElement, 'contentEditable', 'true');
        this.renderer.setAttribute(this.el.nativeElement, 'data-text', this.placeholder);
        this.renderer.addClass(this.el.nativeElement, 'emoji-input');
    }

    emojiPanel() {
        this.appEmojiPanel.inserted
            .subscribe((data: string) => {
                emojiToolkit.ascii = true;
                const output = emojiToolkit.toImage(data);

                this.el.nativeElement.innerHTML = this.el.nativeElement.innerHTML + output;
            });
    }
}
