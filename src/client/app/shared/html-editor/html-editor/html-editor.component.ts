import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
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

    editor: Quill;
    imageUploadProgressPercentage: Observable<number>;

    constructor(private firebaseStorageService: FirebaseStorageService) { }

    ngAfterViewInit() {
        this.initQuillEditor();
    }

    initQuillEditor() {
        // Override toolbar icons
        var icons = Quill.import('ui/icons');
        function buildMatIconTagText(iconName: string, title: string): string {
            return `<mat-icon class="mat-icon material-icons" title="${title}">${iconName}</mat-icon>`
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

        if (this.htmlContent !== null && this.htmlContent !== undefined) {
            // Add existing content to editor
            if (this.containsEmoji) {
                this.editor.clipboard.dangerouslyPasteHTML(this.renderHTMLWithEmoji(this.htmlContent));
            } else {
                this.editor.clipboard.dangerouslyPasteHTML(this.htmlContent);
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
            const file = input.files[0];

            // file type is only image.
            if (/^image\//.test(file.type)) {
                this.saveToServer(file);
            } else {
                console.warn('You could only upload images.');
            }
        };
    }

    saveToServer(file: File) {
        this.firebaseStorageService.upload(file).subscribe(data => {
            this.insertEmbedImage(data);
        });

        this.imageUploadProgressPercentage = this.firebaseStorageService.progress$;
    }

    insertEmbedImage(url: string, blurAfterInsert: boolean = false) {
        const range = this.editor.getSelection();
        this.editor.insertEmbed(range.index, 'image', url);

        if (blurAfterInsert) {
            this.editor.blur();
        }
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
            const output = this.renderHTMLWithEmoji(this.editorDomElement.nativeElement.innerHTML);
            this.editor.clipboard.dangerouslyPasteHTML(output);
            this.editor.setSelection(range.index, 0);
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
}
