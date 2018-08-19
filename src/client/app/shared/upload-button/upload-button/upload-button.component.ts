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
    @Output() onUploadComplete: EventEmitter<string> = new EventEmitter();
    previewImgUrl: string;
    error: string;
    progressPercentage: number;
    showProgressBar = false;

    constructor(private firebaseStorageService: FirebaseStorageService) { }

    handleChange(event: Event) {
        this.showProgressBar = true;

        // Reset
        this.previewImgUrl = null;
        this.error = null;

        const file = (<HTMLInputElement>event.target).files[0];

        // User cancelled
        if (!file) {
            this.showProgressBar = false;
            return;
        }

        // Max file size
        if ((file.size / 1024 / 1024 /*in MB*/) > this.maxFileSizeInMB) {
            this.error = `File exceeds ${this.maxFileSizeInMB} MB. Please upload a smaller file`;
            this.showProgressBar = false;
            return;
        }

        this.firebaseStorageService.upload(file).subscribe(data => {
            this.onUploadComplete.emit(data);
            this.previewImgUrl = data;
            this.error = null;
        });

        // Progress
        this.firebaseStorageService.progress$.subscribe(progress => {
            this.progressPercentage = progress;
            if (this.hideProgressBarAfterUpload && progress === 100) {
                this.showProgressBar = false;
            }
        });
    }
}
