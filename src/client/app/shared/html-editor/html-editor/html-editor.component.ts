import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, SecurityContext, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import * as emojiToolkit from 'emoji-toolkit';
import Quill from 'quill';
import { FirebaseStorageService } from '../../services/firebase-storage.service';

@Component({
    selector: 'app-html-editor',
    templateUrl: './html-editor.component.html',
    styleUrls: ['./html-editor.component.scss'],
    // These styles needs to be global but only rendered when this component is called
    // tslint:disable-next-line: use-component-view-encapsulation
    encapsulation: ViewEncapsulation.None
})
export class HTMLEditorComponent implements AfterViewInit {

    @ViewChild('editor', { static: true }) editorDomElement: ElementRef<HTMLDivElement>;
    @Input() htmlContent: string;
    @Input() placeholder = 'type here...';
    @Input() imageBucketName = 'html-editor';
    @Input() containsEmoji = false;
    @Output() readonly textChange: EventEmitter<string> = new EventEmitter<string>();

    editor: Quill;
    imageUploadProgressPercentage: number;

    // Toolbar icons (can't use internal icon pack as quill loads the editor dynamically)
    // Can be found in node_modules\material-design-icons
    svgIconBold = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M11.63 7.82C12.46 7.24 13 6.38 13 5.5 13 3.57 11.43 2 9.5 2H4v12h6.25c1.79 0 3.25-1.46 3.25-3.25 0-1.3-.77-2.41-1.87-2.93zM6.5 4h2.75c.83 0 1.5.67 1.5 1.5S10.08 7 9.25 7H6.5V4zm3.25 8H6.5V9h3.25c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>';
    svgIconItalic = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M7 2v2h2.58l-3.66 8H3v2h8v-2H8.42l3.66-8H15V2z"/></svg>';
    svgIconheader = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M1 9h3v6h2V9h3V7H1v2zm6-6v2h4v10h2V5h4V3H7z"/></svg>';
    svgIconListOrdered = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M2 13h2v.5H3v1h1v.5H2v1h3v-4H2v1zm0-5h1.8L2 10.1v.9h3v-1H3.2L5 7.9V7H2v1zm1-2h1V2H2v1h1v3zm4-3v2h9V3H7zm0 12h9v-2H7v2zm0-5h9V8H7v2z"/></svg>';
    svgIconListBullet = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M7 10h9V8H7v2zm0-7v2h9V3H7zm0 12h9v-2H7v2zm-4-5h2V8H3v2zm0-7v2h2V3H3zm0 12h2v-2H3v2z"/></svg>';
    svgIconLink = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M1.9 9c0-1.16.94-2.1 2.1-2.1h4V5H4C1.79 5 0 6.79 0 9s1.79 4 4 4h4v-1.9H4c-1.16 0-2.1-.94-2.1-2.1zM14 5h-4v1.9h4c1.16 0 2.1.94 2.1 2.1 0 1.16-.94 2.1-2.1 2.1h-4V13h4c2.21 0 4-1.79 4-4s-1.79-4-4-4zm-8 5h6V8H6v2z"/></svg>';
    svgIconImage = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M16 1H2c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zM3.5 13l2.75-3.54 1.96 2.36 2.75-3.54L14.5 13h-11z"/></svg>';
    svgIconUndo = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>';
    svgIconRedo = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>';

    constructor(private firebaseStorageService: FirebaseStorageService,
        private domSanitizer: DomSanitizer,
        private snackBar: MatSnackBar) { }

    ngAfterViewInit(): void {
        this.initQuillEditor();
    }

    initQuillEditor(): void {
        // Override toolbar icons
        const icons = Quill.import('ui/icons');
        function buildToolbarIcon(svg: string, title: string): string {
            return `<span title="${title}">${svg}</span>`;
        }
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
        icons.undo = buildToolbarIcon(this.svgIconUndo, 'Undo');
        icons.redo = buildToolbarIcon(this.svgIconRedo, 'Redo');

        // Initialize
        this.editor = new Quill(this.editorDomElement.nativeElement, {
            modules: {
                toolbar: {
                    container: [
                        ['bold', 'italic'],
                        [{ header: 2 }],
                        [{ list: 'bullet' }, { list: 'ordered' }],
                        ['link', 'image'],
                        ['undo', 'redo']
                    ],
                    handlers: {
                        undo(): void {
                            (this as any).quill.history.undo();
                        },
                        redo(): void {
                            (this as any).quill.history.redo();
                        },
                    }
                },
                // History module for Undo and Redo features
                history: {
                    delay: 1000,
                    maxStack: 100,
                    userOnly: false
                },
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
                (document.activeElement as HTMLBodyElement).blur();
                window.scrollTo(0, 0);
            }
        }

        // Set toolbar image button handler
        this.editor.getModule('toolbar').addHandler('image', () => {
            this.selectLocalImage();
        });
    }

    selectLocalImage(): void {
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

    async saveFileToServer(file: File): Promise<void> {
        try {
            const url = await this.firebaseStorageService.upload(file, (progress) => {
                this.imageUploadProgressPercentage = progress;
            });

            this.insertEmbedImage(url);
        } catch (error) {
            // TODO: error handling
        } finally {
            // TODO: show progress spinner
        }
    }

    insertEmbedImage(url: string, blurAfterInsert: boolean = false): void {
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

    insertText(text: string, blurAfterInsert: boolean = false): void {
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

    renderHTMLWithEmoji(html: string): string {
        // Maybe allow ascii emoji as well
        // emojiToolkit.ascii = true;
        emojiToolkit.sprites = true;
        emojiToolkit.imagePathSVGSprites = '.';
        return emojiToolkit.shortnameToImage(html);
    }

    getInnerHTML(): string {
        return (this.editorDomElement.nativeElement.firstChild as HTMLDivElement).innerHTML;
    }

    getUrls(content: string): Array<string> {
        const regex = new RegExp('src="(https:\/\/firebasestorage\.googleapis\.com.*?)"', 'ig');
        const urls: Array<string> = [];

        function getUrl(): RegExpExecArray | null {
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

    updateFileStorageWithUrls(): void {
        const oldUrls = this.getUrls(this.htmlContent);
        const newUrls = this.getUrls(this.getInnerHTML());

        for (const oldUrl of oldUrls) {
            if (!newUrls.includes(oldUrl)) {
                this.firebaseStorageService.delete(oldUrl)
                    .catch(error => {
                        // TODO: error handling
                    });
            }
        }
    }

    @HostListener('keydown.control.z') undoSnackBar(): void {
        this.showSnackBar('Undo');
    }

    @HostListener('keydown.control.y') redoSnackBar(): void {
        this.showSnackBar('Redo');
    }

    showSnackBar(message: string): void {
        this.snackBar.open(message, undefined, {
            duration: 600
        });
    }
}
