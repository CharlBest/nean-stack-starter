import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { app, storage } from 'firebase/app';
import 'firebase/storage';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-upload-button',
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent implements OnInit {
    previewImgUrl: string;
    progressPercentage: number;

    @Input() showPreview = false;
    @Output() onUploadComplete: EventEmitter<string> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    handleChange(event: Event) {
        // Reset
        this.progressPercentage = 0;
        this.previewImgUrl = null;

        const file = (<HTMLInputElement>event.target).files[0];

        // User cancelled
        if (!file) {
            return;
        }

        // CONTINUE show preloader imediatly!

        // Create a storage ref
        const storageRef = app(environment.firebase.projectId).storage().ref(`avatars/${file.name}`);

        // Upload file
        const task = storageRef.put(file);

        // Update progress bar
        task.on('state_changed', (snapshot: any) => {
            this.progressPercentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        }, (err) => {
            // TODO show error when file upload fails
            console.log(err);
        }, () => {
            this.onUploadComplete.emit(task.snapshot.downloadURL);

            const reader = new FileReader();
            const url = reader.readAsDataURL(file);
            reader.onloadend = (progressEvent) => {
                this.previewImgUrl = reader.result;
            };
        });
    }
}
