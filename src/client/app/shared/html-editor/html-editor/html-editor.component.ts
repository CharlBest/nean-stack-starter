import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Quill from 'quill';
import { Observable } from 'rxjs';
import { FirebaseStorageService } from '../../firebase-storage.service';

@Component({
    selector: 'app-html-editor',
    templateUrl: './html-editor.component.html',
    styleUrls: ['./html-editor.component.scss']
})
export class HTMLEditorComponent implements OnInit, AfterViewInit {

    @Input() htmlContent: string;
    @Input() placeholder = 'type here...';
    @Input() imageBucketName = 'html-editor';

    @Input() editorDomElement: HTMLDivElement = null;
    @Output() editorDomElementChange: EventEmitter<HTMLDivElement> = new EventEmitter<HTMLDivElement>(true);

    editor: Quill;
    imageUploadProgressPercentage: Observable<number>;
    editorId = `id${Math.random().toString().replace('.', '')}`;

    constructor(private firebaseStorageService: FirebaseStorageService) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.initQuillEditor();
    }

    initQuillEditor() {
        // Override toolbar icons
        var icons = Quill.import('ui/icons');
        const openingTag = '<mat-icon class="mat-icon material-icons">';
        const closingTag = '</mat-icon>';

        icons['bold'] = `${openingTag}format_bold${closingTag}`;
        icons['italic'] = `${openingTag}format_italic${closingTag}`;
        icons['header'] = {
            '2': `${openingTag}title${closingTag}`
        };
        icons['list'] = {
            'ordered': `${openingTag}format_list_numbered${closingTag}`,
            'bullet': `${openingTag}format_list_bulleted${closingTag}`
        };
        icons['link'] = `${openingTag}insert_link${closingTag}`;
        icons['image'] = `${openingTag}insert_photo${closingTag}`;

        // Initialize
        this.editor = new Quill(`#${this.editorId}`, {
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

        this.editorDomElement = this.editor.root;
        this.editorDomElementChange.emit(this.editorDomElement);

        if (this.htmlContent !== null && this.htmlContent !== undefined) {
            this.editor.pasteHTML(this.htmlContent);
            // Workaround for Quill editor focussing on input after pasteHTML
            if (document.activeElement) {
                (<any>document.activeElement).blur();
            }
        }

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
            this.insertToEditor(data);
        });

        this.imageUploadProgressPercentage = this.firebaseStorageService.progress$;
    }

    insertToEditor(url: string) {
        const range = this.editor.getSelection();
        this.editor.insertEmbed(range.index, 'image', url);
    }
}
