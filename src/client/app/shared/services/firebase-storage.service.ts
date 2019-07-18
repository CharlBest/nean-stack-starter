import { Injectable } from '@angular/core';
import { app, FirebaseError, storage } from 'firebase/app';
import 'firebase/storage';
import { v4 as randomStringGenerator } from 'uuid';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FirebaseStorageService {
    folderName = 'images';

    async upload(file: File, progressCallback: (progress: number) => void, folderName?: string): Promise<string> {
        return new Promise((resolve, reject) => {
            // Create a storage ref
            const fileName = `${file.name.split('.')[0]}-${randomStringGenerator()}.${file.name.split('.')[1]}`;
            const storageRef = app(environment.firebase.projectId).storage().ref(`${folderName || this.folderName}/${fileName}`);

            // Upload file
            const task: storage.UploadTask = storageRef.put(file);

            task.on(storage.TaskEvent.STATE_CHANGED, (snapshot: storage.UploadTaskSnapshot) => {
                progressCallback(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));

                switch (snapshot.state) {
                    case storage.TaskState.PAUSED:
                        break;

                    case storage.TaskState.RUNNING:
                        break;
                }
            }, (error: FirebaseError) => {
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        break;

                    case 'storage/canceled':
                        break;

                    case 'storage/unknown':
                        break;
                }
                console.log(error);
                reject(error);
            }, async () => {
                const downloadUrl = await task.snapshot.ref.getDownloadURL();
                resolve(downloadUrl);
            });
        });
    }

    delete(url: string): Promise<void> {
        return app(environment.firebase.projectId).storage().refFromURL(url).delete();
    }
}
