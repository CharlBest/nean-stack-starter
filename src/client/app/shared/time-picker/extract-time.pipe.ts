import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'extractTime'
})
export class ExtractTimePipe implements PipeTransform {

    constructor() { }

    transform(date: string | null): string | null {
        if (!date) {
            return null;
        }

        return date.substring(date.indexOf('T') + 1, date.lastIndexOf(':'));
    }
}
