import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2, Sanitizer, SecurityContext } from '@angular/core';
import * as emojione from 'emojione';
import { EmojiPanelComponent } from './emoji-panel/emoji-panel.component';

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
        this.appEmojiPanel.inserted
            .subscribe(data => {
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
