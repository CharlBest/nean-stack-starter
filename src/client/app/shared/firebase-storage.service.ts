import { Injectable, OnDestroy } from '@angular/core';
import { app } from 'firebase/app';
import 'firebase/storage';
import { Observable, Subject } from 'rxjs';
import { v4 as randomStringGenerator } from 'uuid';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FirebaseStorageService implements OnDestroy {
    folderName = 'images';

    private progress = new Subject<number>();
    public progress$: Observable<number> = this.progress.asObservable();
    private onUpload = new Subject<string>();
    private onUpload$: Observable<string> = this.onUpload.asObservable();
    private onDelete = new Subject<string>();
    private onDelete$: Observable<string> = this.onDelete.asObservable();

    constructor() { }

    upload(file: File, folderName?: string) {
        // Create a storage ref
        const fileName = `${file.name.split('.')[0]}-${randomStringGenerator()}.${file.name.split('.')[1]}`
        const storageRef = app(environment.firebase.projectId).storage().ref(`${folderName || this.folderName}/${fileName}`);

        // Upload file
        const task = storageRef.put(file);

        // Update progress bar
        task.on('state_changed' /*firebase.storage.TaskEvent.STATE_CHANGED*/, (snapshot: any) => {
            this.progress.next(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));

            // switch (snapshot.state) {
            //     case firebase.storage.TaskState.PAUSED: // or 'paused'
            //         console.log('Upload is paused');
            //         break;
            //     case firebase.storage.TaskState.RUNNING: // or 'running'
            //         console.log('Upload is running');
            //         break;
            // }
        }, (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch ((<any>error).code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;

                case 'storage/canceled':
                    // User canceled the upload
                    break;

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
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

    delete(fileName: string, folderName?: string) {
        // Create a storage reference from our storage service
        const storageRef = app(environment.firebase.projectId).storage().ref();

        // Create a reference to the file to delete
        const imageRef = storageRef.child(`${folderName || this.folderName}/${fileName}`);

        // Delete the file
        imageRef.delete().then(function () {
            this.onDelete.next(true);
        }).catch(function (error) {
            this.onDelete.next(false);
            console.log(error);
        });

        return this.onDelete$;
    }

    ngOnDestroy() {
        this.progress.complete();
    }
}
