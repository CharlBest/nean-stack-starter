import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
    selector: 'app-file-drop',
    templateUrl: './file-drop.component.html',
    styleUrls: ['./file-drop.component.scss']
})
export class FileDropComponent {

    // TODO: not in use. Sync features with upload-button
    // TODO: show progress bar, image preview, remove options, etc.

    @Input() maxFileSize: number;
    @Input() allowMultiple = false;
    @Output() readonly selectedFile: EventEmitter<File> = new EventEmitter();
    @Output() readonly maxFileSizeExceeded: EventEmitter<boolean> = new EventEmitter();

    message: string;
    highlightDragDropArea = false;

    @HostListener('dragenter', ['$event']) onDragEnter(event: DragEvent) {
        this.preventDefaults(event);
        this.highlightDragDropArea = true;
    }

    @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
        this.preventDefaults(event);
        this.highlightDragDropArea = true;
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
        this.preventDefaults(event);
        this.highlightDragDropArea = false;
    }

    @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
        this.preventDefaults(event);
        this.highlightDragDropArea = false;

        const data = event.dataTransfer;
        if (data) {
            const files = data.files as any;

            for (const file of files) {
                this.handleFile(file);
            }
        }
    }

    preventDefaults(event: Event) {
        event.preventDefault();
        event.stopPropagation();
    }

    onInputChange(event: Event) {
        const files = (event.target as HTMLInputElement).files as any;
        for (const file of files) {
            this.handleFile(file);
        }
    }

    handleFile(file: File) {
        // User cancelled, or file exceeds size
        if (!file || (this.maxFileSize && file.size > this.maxFileSize)) {
            this.maxFileSizeExceeded.emit(true);
        }

        this.selectedFile.emit(file);

        // Set message text
        this.message = file.name;
    }
}
