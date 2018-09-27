import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseStorageService } from '../../services/firebase-storage.service';

@Component({
    selector: 'app-upload-button',
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {
    @Input() buttonText = 'Upload file';
    @Input() folderName = 'images';
    @Input() showPreview = false;
    @Input() hideProgressBarAfterUpload = true;
    @Input() maxFileSizeInMB = 10;
    @Output() uploadComplete: EventEmitter<string> = new EventEmitter();
    previewImgUrl: string | null;
    error: string | null;
    progressPercentage: number;
    showProgressBar = false;
    // TODO: better UX is to allow uploading multiple in parallel
    isProcessing = false;

    constructor(private firebaseStorageService: FirebaseStorageService) { }

    handleChange(event: Event) {
        this.showProgressBar = true;
        this.isProcessing = true;

        // Reset
        this.previewImgUrl = null;
        this.error = null;

        const target = event.target as HTMLInputElement;
        const file = target && target.files ? target.files[0] : null;

        // User cancelled
        if (!file) {
            this.showProgressBar = false;
            this.isProcessing = false;
            return;
        }

        // Max file size
        if ((file.size / 1024 / 1024 /*in MB*/) > this.maxFileSizeInMB) {
            this.error = `File exceeds ${this.maxFileSizeInMB} MB. Please upload a smaller file`;
            this.showProgressBar = false;
            this.isProcessing = false;
            return;
        }

        const { onProgress, onUpload } = this.firebaseStorageService.upload(file);
        onUpload.subscribe(data => {
            this.uploadComplete.emit(data);
            this.previewImgUrl = data;
            this.error = null;
            this.isProcessing = false;
        }, () => this.isProcessing = false);

        onProgress.subscribe(progress => {
            this.progressPercentage = progress;
            if (this.hideProgressBarAfterUpload && progress === 100) {
                this.showProgressBar = false;
            }
        });
    }
}
