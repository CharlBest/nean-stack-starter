import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-upload-button',
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent implements OnInit {
    // TODO: this could potentially be a directive
    previewImgUrl: string;

    constructor() { }

    ngOnInit() {
    }

    handleChange(event) {
        const file = event.target.files[0];

        // User cancelled
        if (!file) {
            return;
        }

        this.generatePreviewImgUrl(file, previewImgUrl => {
            this.previewImgUrl = previewImgUrl;
        });
    }

    generatePreviewImgUrl(file, callback) {
        const reader = new FileReader()
        const url = reader.readAsDataURL(file)
        reader.onloadend = e => callback(reader.result)
    }
}
