import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

// Use this service if you want to store data big data like objects in the url
// This is useful for when you want to prevent the user from losing data in their
// current session. The advantage of using this over local storage is when you share
// the url someone else can get that sessions data as well like prefilling a form

@Injectable({
    providedIn: 'root'
})
export class UrlDataService {
    private miliSecondsBeforeSave = 3000;

    constructor(private router: Router,
        private route: ActivatedRoute) { }

    init(formGroup: FormGroup): boolean {
        formGroup.valueChanges.pipe(
            debounceTime(this.miliSecondsBeforeSave)
        ).subscribe(() => {
            this.save(formGroup);
        });

        const formData: string = this.route.snapshot.queryParams.data || null;
        if (formData) {
            return this.buildForm(formGroup, formData);
        } else {
            return false;
        }
    }

    buildForm(formGroup: FormGroup, formData: string): boolean {
        try {
            const data = JSON.parse(this.b64DecodeUnicode(formData));

            for (const field in data) {
                if (data.hasOwnProperty(field) && data[field]) {
                    const control = formGroup.get(field);
                    if (control && !control.value) {
                        const newControl = formGroup.get(field);
                        if (newControl) {
                            newControl.setValue(data[field]);
                        }
                    }
                }
            }

            return true;
        } catch (error) {
            console.log('Error parsing form data from url', error);
            return false;
        }
    }

    private save(formGroup: FormGroup) {
        const encodedData = this.b64EncodeUnicode(JSON.stringify(formGroup.value));
        this.router.navigate([], { queryParams: { data: encodedData }, queryParamsHandling: 'merge' });
    }

    private b64EncodeUnicode(str: string) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            (match, p1) => {
                return String.fromCharCode((('0x' + p1) as any));
            }));
    }

    private b64DecodeUnicode(str: string) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
}
