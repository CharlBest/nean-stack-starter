import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FileModel, ImageRotation } from '@shared/models/shared/file.model';
// TODO: for some reason this creates a worker thread even on pages that isn't using this component
import imageCompression from 'browser-image-compression';
import { DialogService } from '../../dialog/dialog.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { FirebaseStorageService } from '../../services/firebase-storage.service';

interface Metadata extends FileModel {
    file?: File;
    localUrl?: string;
    uploadProgressPercentage?: number;
    errorMessage?: string;
    hasLoaded?: boolean;
}

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent {
    @Input() folderName = 'images';
    @Input() maxFileSizeInMB = 10;
    @Input() showDropZoneForDesktop = true;
    @Output() readonly changed: EventEmitter<void> = new EventEmitter();

    @ViewChild('fileInput', { static: true }) fileInput: ElementRef<HTMLInputElement>;
    rotationEnum = ImageRotation;
    previewImages: Array<Metadata> = [];

    highlightDragDropArea = false;
    message: Metadata;

    constructor(private firebaseStorageService: FirebaseStorageService,
        public bpService: BreakpointService,
        private dialogService: DialogService) { }

    @HostListener('dragenter', ['$event']) onDragEnter(event: DragEvent): void {
        this.preventDefaults(event);
        this.highlightDragDropArea = true;
    }

    @HostListener('dragover', ['$event']) onDragOver(event: DragEvent): void {
        this.preventDefaults(event);
        this.highlightDragDropArea = true;
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent): void {
        this.preventDefaults(event);
        this.highlightDragDropArea = false;
    }

    @HostListener('drop', ['$event']) onDrop(event: DragEvent): void {
        this.preventDefaults(event);
        this.highlightDragDropArea = false;

        const data = event.dataTransfer;
        if (data) {
            this.handleFiles(data.files);
        }
    }

    async handleChange(event: Event): Promise<void> {
        const target = event.target as HTMLInputElement;

        // User cancelled
        if (!target || !target.files) {
            return;
        }

        this.handleFiles(target.files);
    }

    rotate(index: number): void {
        switch (this.previewImages[index].rotation) {
            case undefined:
            case null:
                this.previewImages[index].rotation = ImageRotation.ninetyDegrees;
                break;

            case ImageRotation.ninetyDegrees:
                this.previewImages[index].rotation = ImageRotation.oneHundredAndEightyDegrees;
                break;

            case ImageRotation.oneHundredAndEightyDegrees:
                this.previewImages[index].rotation = ImageRotation.twoHundredAndSeventyDegrees;
                break;

            default:
                this.previewImages[index].rotation = null;
                break;
        }
    }

    async remove(index: number): Promise<void> {
        const hasConfirmed = await this.dialogService.confirm({
            title: 'Remove',
            body: 'Are you sure?',
            confirmButtonText: 'Proceed'
        });
        if (hasConfirmed) {
            this.previewImages.splice(index, 1);
            this.changed.emit();
        }
    }

    openFileUpload(): void {
        this.fileInput.nativeElement.click();
    }

    trackByFn(index: number, item: Metadata): number {
        return index;
    }

    async upload(): Promise<Array<FileModel>> {
        const uploadedFiles: Array<FileModel> = [];
        for (const image of this.previewImages) {
            // If local file upload and get url
            if (image.file) {
                const url = await this.firebaseStorageService.upload(image.file, (progress) => {
                    image.uploadProgressPercentage = progress;
                    // TODO: hide progress bar when finished
                }, this.folderName);

                image.url = url;
            }

            uploadedFiles.push({
                url: image.url,
                width: image.width,
                height: image.height,
                aspectRatio: image.aspectRatio,
                exifOrientation: image.exifOrientation,
                rotation: image.rotation
            });
        }

        return uploadedFiles;
    }

    setImages(files?: FileModel | Array<FileModel> | null): void {
        if (files) {
            if (Array.isArray(files) && files.length > 0) {
                const clonedFiles = JSON.parse(JSON.stringify(files));
                this.previewImages = clonedFiles;
            } else if (!Array.isArray(files)) {
                const clonedFile = JSON.parse(JSON.stringify(files));
                this.previewImages = [clonedFile];
            }
        }
    }

    private async handleFiles(files: FileList): Promise<void> {
        for (const file of Array.from(files)) {
            let error = '';

            // Max file size
            if ((file.size / 1024 / 1024 /*in MB*/) > this.maxFileSizeInMB) {
                error = `File exceeds ${this.maxFileSizeInMB} MB. Please upload a smaller file`;
                return;
            }

            try {
                const compressedFile = await this.compress(file);
                const metadata = await this.preview(compressedFile);

                // https://stackoverflow.com/a/32490603/10395024
                // https://i.stack.imgur.com/VGsAj.gif
                const exifOrientation = await imageCompression.getExifOrientation(file);

                this.previewImages.push({
                    file: compressedFile,
                    ...metadata,
                    exifOrientation,
                    errorMessage: error
                });

                this.changed.emit();
            } catch (error) {
                // TODO: error handling
            }
        }
    }

    private compress(file: File): Promise<File> {
        return imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 600
        }) as Promise<File>;
    }

    private preview(file: File): Promise<Metadata> {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                const img = document.createElement('img');
                img.onload = () => {
                    const metadata: Metadata = {
                        url: '',
                        localUrl: img.src,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        aspectRatio: img.naturalWidth / img.naturalHeight,
                        rotation: null,
                        exifOrientation: -1
                    };

                    resolve(metadata);
                };
                img.src = reader.result as string;
            };

            reader.onerror = event => {
                reject(event);
            };
        });
    }

    private preventDefaults(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
    }
}
