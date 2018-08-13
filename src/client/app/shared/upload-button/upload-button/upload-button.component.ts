import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseStorageService } from '../../firebase-storage.service';

@Component({
    selector: 'app-upload-button',
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {
    previewImgUrl: string;
    progressPercentage: Observable<number>;

    @Input() buttonText = 'Upload file';
    @Input() folderName = 'images';
    @Input() showPreview = false;
    @Input() hideProgressBarAfterUpload = true;
    @Input() maxFileSizeInMB = 10;
    @Output() onUploadComplete: EventEmitter<string> = new EventEmitter();
    error: string;

    constructor(private firebaseStorageService: FirebaseStorageService) { }

    handleChange(event: Event) {
        // Reset
        this.previewImgUrl = null;
        this.error = null;

        const file = (<HTMLInputElement>event.target).files[0];

        // User cancelled
        if (!file) {
            return;
        }

        // Max file size
        if ((file.size / 1024 / 1024 /*in MB*/) > this.maxFileSizeInMB) {
            this.error = `File exceeds ${this.maxFileSizeInMB} MB. Please upload a smaller file`;
            return;
        }

        this.firebaseStorageService.upload(file).subscribe(data => {
            this.onUploadComplete.emit(data);
            this.previewImgUrl = data;
            this.error = null;
        });

        this.progressPercentage = this.firebaseStorageService.progress$;
    }
}
