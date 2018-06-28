import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import 'firebase/storage';
import { Observable } from 'rxjs';
import { FirebaseStorageService } from '../../firebase-storage.service';

@Component({
    selector: 'app-upload-button',
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent implements OnInit {
    previewImgUrl: string;
    progressPercentage: Observable<number>;

    @Input() buttonText = 'Upload file';
    @Input() folderName = 'images';
    @Input() showPreview = false;
    @Input() hideProgressBarAfterUpload = true;
    @Output() onUploadComplete: EventEmitter<string> = new EventEmitter();

    constructor(private firebaseStorageService: FirebaseStorageService) { }

    ngOnInit() {
    }

    handleChange(event: Event) {
        // Reset
        this.previewImgUrl = null;

        const file = (<HTMLInputElement>event.target).files[0];

        // User cancelled
        if (!file) {
            return;
        }

        this.firebaseStorageService.upload(file).subscribe(data => {
            this.onUploadComplete.emit(data);
            this.previewImgUrl = data;
        });

        this.progressPercentage = this.firebaseStorageService.progress$;
    }
}
