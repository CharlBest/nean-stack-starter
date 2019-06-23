// tslint:disable-next-line: max-line-length
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, SecurityContext, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as emojione from 'emojione';
import Quill from 'quill';
import { Observable } from 'rxjs';
import { FirebaseStorageService } from '../../services/firebase-storage.service';

@Component({
    selector: 'app-html-editor',
    templateUrl: './html-editor.component.html',
    styleUrls: ['./html-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HTMLEditorComponent implements AfterViewInit {

    @ViewChild('editor', { static: true }) editorDomElement: ElementRef<HTMLDivElement>;
    @Input() htmlContent: string;
    @Input() placeholder = 'type here...';
    @Input() imageBucketName = 'html-editor';
    @Input() containsEmoji = false;
    @Output() textChange: EventEmitter<string> = new EventEmitter<string>();

    editor: Quill;
    imageUploadProgressPercentage: Observable<number>;

    // Toolbar icons (can't use internal icon pack as quill loads the editor dynamically)
    // tslint:disable-next-line: max-line-length
    svgIconBold = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M11.63 7.82C12.46 7.24 13 6.38 13 5.5 13 3.57 11.43 2 9.5 2H4v12h6.25c1.79 0 3.25-1.46 3.25-3.25 0-1.3-.77-2.41-1.87-2.93zM6.5 4h2.75c.83 0 1.5.67 1.5 1.5S10.08 7 9.25 7H6.5V4zm3.25 8H6.5V9h3.25c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>';
    // tslint:disable-next-line: max-line-length
    svgIconItalic = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M7 2v2h2.58l-3.66 8H3v2h8v-2H8.42l3.66-8H15V2z"/></svg>';
    // tslint:disable-next-line: max-line-length
    svgIconheader = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M1 9h3v6h2V9h3V7H1v2zm6-6v2h4v10h2V5h4V3H7z"/></svg>';
    // tslint:disable-next-line: max-line-length
    svgIconListOrdered = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M2 13h2v.5H3v1h1v.5H2v1h3v-4H2v1zm0-5h1.8L2 10.1v.9h3v-1H3.2L5 7.9V7H2v1zm1-2h1V2H2v1h1v3zm4-3v2h9V3H7zm0 12h9v-2H7v2zm0-5h9V8H7v2z"/></svg>';
    // tslint:disable-next-line: max-line-length
    svgIconListBullet = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M7 10h9V8H7v2zm0-7v2h9V3H7zm0 12h9v-2H7v2zm-4-5h2V8H3v2zm0-7v2h2V3H3zm0 12h2v-2H3v2z"/></svg>';
    // tslint:disable-next-line: max-line-length
    svgIconLink = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M1.9 9c0-1.16.94-2.1 2.1-2.1h4V5H4C1.79 5 0 6.79 0 9s1.79 4 4 4h4v-1.9H4c-1.16 0-2.1-.94-2.1-2.1zM14 5h-4v1.9h4c1.16 0 2.1.94 2.1 2.1 0 1.16-.94 2.1-2.1 2.1h-4V13h4c2.21 0 4-1.79 4-4s-1.79-4-4-4zm-8 5h6V8H6v2z"/></svg>';
    // tslint:disable-next-line: max-line-length
    svgIconImage = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M16 1H2c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zM3.5 13l2.75-3.54 1.96 2.36 2.75-3.54L14.5 13h-11z"/></svg>';

    constructor(private firebaseStorageService: FirebaseStorageService,
        private domSanitizer: DomSanitizer) { }

    ngAfterViewInit() {
        this.initQuillEditor();
    }

    initQuillEditor() {
        // Override toolbar icons
        const icons = Quill.import('ui/icons');
        function buildToolbarIcon(svg: string, title: string): string {
            return `<span class="html-editor-toolbar-icon" title="${title}">${svg}</span>`;
        }
        // tslint:disable-next-line: max-line-length
        icons.bold = buildToolbarIcon(this.svgIconBold, 'Bold');
        icons.italic = buildToolbarIcon(this.svgIconItalic, 'Italic');
        icons.header = {
            2: buildToolbarIcon(this.svgIconheader, 'Heading')
        };
        icons.list = {
            ordered: buildToolbarIcon(this.svgIconListOrdered, 'Numbered list'),
            bullet: buildToolbarIcon(this.svgIconListBullet, 'Bullet list')
        };
        icons.link = buildToolbarIcon(this.svgIconLink, 'Insert link');
        icons.image = buildToolbarIcon(this.svgIconImage, 'Insert image');

        // Initialize
        this.editor = new Quill(this.editorDomElement.nativeElement, {
            modules: {
                toolbar: [
                    ['bold', 'italic'],
                    [{ header: 2 }],
                    [{ list: 'bullet' }, { list: 'ordered' }],
                    ['link', 'image']
                ]
            },
            placeholder: this.placeholder,
            theme: 'snow'
        });

        this.editor.on('text-change', (delta, oldDelta, source) => {
            this.textChange.emit(this.getInnerHTML());
        });

        if (this.htmlContent) {
            // Sanitize
            const sanitizedHTML = this.domSanitizer.sanitize(SecurityContext.HTML, this.htmlContent);

            // Add existing content to editor
            if (sanitizedHTML) {
                if (this.containsEmoji) {
                    this.editor.clipboard.dangerouslyPasteHTML(this.renderHTMLWithEmoji(sanitizedHTML));
                } else {
                    this.editor.clipboard.dangerouslyPasteHTML(sanitizedHTML);
                }
            }

            // Workaround for Quill editor focussing on input after pasteHTML (HACK)
            if (document.activeElement) {
                (document.activeElement as any).blur();
                window.scrollTo(0, 0);
            }
        }

        // Set toolbar image button handler
        this.editor.getModule('toolbar').addHandler('image', () => {
            this.selectLocalImage();
        });
    }

    selectLocalImage() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.click();

        // Listen upload local image and save to server
        input.onchange = () => {
            if (input.files) {
                const file = input.files[0];

                // file type is only image.
                if (/^image\//.test(file.type)) {
                    this.saveFileToServer(file);
                } else {
                    console.warn('You could only upload images.');
                }
            }
        };
    }

    saveFileToServer(file: File) {
        const { onProgress, onUpload } = this.firebaseStorageService.upload(file);
        onUpload.subscribe(data => {
            this.insertEmbedImage(data);
        });

        this.imageUploadProgressPercentage = onProgress;
    }

    insertEmbedImage(url: string, blurAfterInsert: boolean = false) {
        // TODO: not sure if setting the default here is a good decision
        const range = this.editor.getSelection() || { index: 0 };
        this.editor.insertEmbed(range.index, 'image', url);

        if (blurAfterInsert) {
            this.editor.blur();
        } else {
            this.editor.setSelection(range.index + 1, 0);
        }

        // TODO: this still won't work when the user inserts an image but does not click update which
        // means the file will be in Firebase storage but not in use
        this.updateFileStorageWithUrls();
    }

    insertText(text: string, blurAfterInsert: boolean = false) {
        let range = this.editor.getSelection();
        if (range) {
            this.editor.insertText(range.index, text);
        } else {
            range = this.editor.getSelection(true);
            this.editor.insertText(range.index, text);
        }

        if (this.containsEmoji) {
            const output = this.renderHTMLWithEmoji(this.getInnerHTML());
            const sanitizedHTML = this.domSanitizer.sanitize(SecurityContext.HTML, output);
            if (sanitizedHTML) {
                this.editor.clipboard.dangerouslyPasteHTML(sanitizedHTML);
            }
            this.editor.setSelection(range.index + 2, 0);
        }

        if (blurAfterInsert) {
            this.editor.blur();
        }
    }

    renderHTMLWithEmoji(html: string) {
        // (<any>emojione).ascii = true;
        (emojione as any).sprites = true;
        (emojione as any).imagePathSVGSprites = './assets/emoji/';
        return emojione.shortnameToImage(html);
    }

    getInnerHTML() {
        return (this.editorDomElement.nativeElement.firstChild as HTMLDivElement).innerHTML;
    }

    getUrls(content: string): Array<string> {
        const regex = new RegExp('src="(https:\/\/firebasestorage\.googleapis\.com.*?)"', 'ig');
        const urls: Array<string> = [];

        function getUrl() {
            const match = regex.exec(content);
            if (match) {
                urls.push(match[1]);
            }
            return match;
        }

        let matches = getUrl();
        if (matches) {
            while (matches !== null) {
                matches = getUrl();
            }
        }

        return urls;
    }

    updateFileStorageWithUrls() {
        const oldUrls = this.getUrls(this.htmlContent);
        const newUrls = this.getUrls(this.getInnerHTML());

        for (const oldUrl of oldUrls) {
            if (!newUrls.includes(oldUrl)) {
                this.firebaseStorageService.delete(oldUrl).subscribe();
            }
        }
    }
}
