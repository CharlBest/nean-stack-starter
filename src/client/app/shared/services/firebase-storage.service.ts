import { Injectable, OnDestroy } from '@angular/core';
import { app, storage } from 'firebase/app';
import 'firebase/storage';
import { Observable, Subject } from 'rxjs';
import { v4 as randomStringGenerator } from 'uuid';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FirebaseStorageService implements OnDestroy {
    folderName = 'images';

    private progress = new Subject<number>();
    public progress$: Observable<number> = this.progress.asObservable();
    private onUpload = new Subject<string>();
    private onUpload$: Observable<string> = this.onUpload.asObservable();
    private onDelete = new Subject<boolean>();
    private onDelete$: Observable<boolean> = this.onDelete.asObservable();

    constructor() { }

    upload(file: File, folderName?: string) {
        this.progress.next(0);

        // Create a storage ref
        let fileName = `${file.name.split('.')[0]}-${randomStringGenerator()}.${file.name.split('.')[1]}`;
        const storageRef = app(environment.firebase.projectId).storage().ref(`${folderName || this.folderName}/${fileName}`);

        // Upload file
        const task: storage.UploadTask = storageRef.put(file);

        task.on(storage.TaskEvent.STATE_CHANGED, (snapshot: storage.UploadTaskSnapshot) => {
            this.progress.next(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));

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
                this.onUpload.next(downloadUrl);
            });
        });

        return this.onUpload$;
    }

    delete(url: string) {
        const imageRef = app(environment.firebase.projectId).storage().refFromURL(url);

        imageRef.delete().then(() => {
            this.onDelete.next(true);
        }).catch((error) => {
            this.onDelete.next(false);
            console.log(error);
        });

        return this.onDelete$;
    }

    ngOnDestroy() {
        this.progress.complete();
    }
}
