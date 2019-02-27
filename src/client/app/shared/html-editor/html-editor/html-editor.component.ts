import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as emojione from 'emojione';
import Quill from 'quill';
import { Observable } from 'rxjs';
import { FirebaseStorageService } from '../../services/firebase-storage.service';

@Component({
    selector: 'app-html-editor',
    templateUrl: './html-editor.component.html',
    styleUrls: ['./html-editor.component.scss']
})
export class HTMLEditorComponent implements AfterViewInit {

    @ViewChild('editor') editorDomElement: ElementRef<HTMLDivElement>;
    @Input() htmlContent: string;
    @Input() placeholder = 'type here...';
    @Input() imageBucketName = 'html-editor';
    @Input() containsEmoji = false;
    @Output() onChange: EventEmitter<string> = new EventEmitter<string>();

    editor: Quill;
    imageUploadProgressPercentage: Observable<number>;

    constructor(private firebaseStorageService: FirebaseStorageService,
        private domSanitizer: DomSanitizer) { }

    ngAfterViewInit() {
        this.initQuillEditor();
    }

    initQuillEditor() {
        // Override toolbar icons
        const icons = Quill.import('ui/icons');
        function buildMatIconTagText(iconName: string, title: string): string {
            return `<mat-icon class="mat-icon material-icons" title="${title}">${iconName}</mat-icon>`;
        }

        icons['bold'] = `${buildMatIconTagText('format_bold', 'Bold')}`;
        icons['italic'] = `${buildMatIconTagText('format_italic', 'Italic')}`;
        icons['header'] = {
            '2': `${buildMatIconTagText('format_size', 'Heading')}`
        };
        icons['list'] = {
            'ordered': `${buildMatIconTagText('format_list_numbered', 'Numbered list')}`,
            'bullet': `${buildMatIconTagText('format_list_bulleted', 'Bullet list')}`
        };
        icons['link'] = `${buildMatIconTagText('insert_link', 'Insert link')}`;
        icons['image'] = `${buildMatIconTagText('insert_photo', 'Insert image')}`;

        // Initialize
        this.editor = new Quill(this.editorDomElement.nativeElement, {
            modules: {
                toolbar: [
                    ['bold', 'italic'],
                    [{ 'header': 2 }],
                    [{ list: 'bullet' }, { list: 'ordered' }],
                    ['link', 'image']
                ]
            },
            placeholder: this.placeholder,
            theme: 'snow'
        });

        this.editor.on('text-change', (delta, oldDelta, source) => {
            this.onChange.emit(this.getInnerHTML());
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
                (<any>document.activeElement).blur();
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
        (<any>emojione).sprites = true;
        (<any>emojione).imagePathSVGSprites = './assets/emoji/';
        return emojione.shortnameToImage(html);
    }

    getInnerHTML() {
        return (<HTMLDivElement>this.editorDomElement.nativeElement.firstChild).innerHTML;
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

        for (let i = 0; i < oldUrls.length; i++) {
            if (!newUrls.includes(oldUrls[i])) {
                this.firebaseStorageService.delete(oldUrls[i]).subscribe();
            }
        }
    }
}
