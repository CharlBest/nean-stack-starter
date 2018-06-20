import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { app } from 'firebase/app';
import Quill from 'quill';
import { environment } from '../../../../environments/environment';

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
    imageUploadProgressPercentage: number;
    editorId = `id${Math.random().toString().replace('.', '')}`;

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.initQuillEditor();
    }

    initQuillEditor() {
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
        const storageRef = app(environment.firebase.projectId).storage().ref(`${this.imageBucketName}/${file.name}`);

        // Upload file
        const task = storageRef.put(file);

        // Update progress bar
        task.on('state_changed', (snapshot: any) => {
            this.imageUploadProgressPercentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        }, (err) => {
            // TODO show error when file upload fails
            console.log(err);
        }, () => {
            this.insertToEditor(task.snapshot.downloadURL);
        });
    }

    insertToEditor(url: string) {
        const range = this.editor.getSelection();
        this.editor.insertEmbed(range.index, 'image', url);
    }
}
