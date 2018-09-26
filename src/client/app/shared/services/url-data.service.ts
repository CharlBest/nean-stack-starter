import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UrlDataService {
    private miliSecondsBeforeSave = 3000;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder) { }

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
                return String.fromCharCode((<any>('0x' + p1)));
            }));
    }

    private b64DecodeUnicode(str: string) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    init(formGroup: FormGroup) {
        const formData = this.route.snapshot.queryParams.data || null;
        if (formData) {
            try {
                const data = JSON.parse(this.b64DecodeUnicode(formData));
                formGroup.setValue(data);
            } catch (error) {
                console.log('Error parsing form data from url', error);
            }
        }

        formGroup.valueChanges.pipe(
            debounceTime(this.miliSecondsBeforeSave)
        ).subscribe(() => {
            this.save(formGroup);
        });
    }
}
