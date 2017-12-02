import { Directive, OnInit, HostListener, HostBinding, ElementRef, Sanitizer, SecurityContext, Renderer2, Input } from '@angular/core';
import { EmojiPanelComponent } from './emoji-panel/emoji-panel.component';
import * as emojione from 'emojione';

@Directive({
    selector: '*[appEmojiPanel]'
})
export class EmojiPanelDirective implements OnInit {

    @Input('placeholder') placeholder = 'Type here...';
    @Input('appEmojiPanel') appEmojiPanel: EmojiPanelComponent;

    @HostListener('keyup') onKeypress() {
        // sanitize
    }

    constructor(private el: ElementRef,
        private renderer: Renderer2,
        private sanitizer: Sanitizer) { }

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
        this.appEmojiPanel.inserted.subscribe(data => {
            (<any>emojione).ascii = true;
            const output = emojione.toImage(data);

            const element = this.el.nativeElement as HTMLElement;
            element.innerHTML = element.innerHTML + output;
        });
    }

    private sanitize(content: string): string {
        return this.sanitizer.sanitize(SecurityContext.HTML, content);
    }
}
