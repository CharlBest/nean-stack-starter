import { Injectable } from '@angular/core';
import { app, storage } from 'firebase/app';
import 'firebase/storage';
import { Subject } from 'rxjs';
import { v4 as randomStringGenerator } from 'uuid';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FirebaseStorageService {
    folderName = 'images';

    constructor() { }

    upload(file: File, folderName?: string) {
        const onProgress = new Subject<number>();
        const onUpload = new Subject<string>();

        // Create a storage ref
        const fileName = `${file.name.split('.')[0]}-${randomStringGenerator()}.${file.name.split('.')[1]}`;
        const storageRef = app(environment.firebase.projectId).storage().ref(`${folderName || this.folderName}/${fileName}`);

        // Upload file
        const task: storage.UploadTask = storageRef.put(file);

        task.on(storage.TaskEvent.STATE_CHANGED, (snapshot: storage.UploadTaskSnapshot) => {
            onProgress.next(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));

            switch (snapshot.state) {
                case storage.TaskState.PAUSED:
                    break;
                case storage.TaskState.RUNNING:
                    break;
            }
        }, (error) => {
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch ((<any>error).code) {
                case 'storage/unauthorized':
                    break;

                case 'storage/canceled':
                    break;

                case 'storage/unknown':
                    break;
            }
            console.log(error);
        }, () => {
            task.snapshot.ref.getDownloadURL().then(downloadUrl => {
                onUpload.next(downloadUrl);
            });
        });

        return { onProgress, onUpload };
    }

    delete(url: string) {
        const onDelete = new Subject<boolean>();
        const imageRef = app(environment.firebase.projectId).storage().refFromURL(url);

        imageRef.delete().then(() => {
            onDelete.next(true);
        }).catch((error) => {
            onDelete.next(false);
            console.log(error);
        });

        return onDelete;
    }
}
