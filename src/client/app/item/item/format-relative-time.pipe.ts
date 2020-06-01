import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../../shared/translate/translate.service';

@Pipe({
    name: 'formatRelativeTime'
})
export class FormatRelativeTimePipe implements PipeTransform {

    constructor(private translateService: TranslateService) { }

    transform(timestamp: number | null, params?: any) {
        if (!timestamp) {
            return null;
        }

        if (Intl && (Intl as any).RelativeTimeFormat) {
            const { language = this.translateService.activeLanguage || 'en-US' } = navigator;
            const formatter = new (Intl as any).RelativeTimeFormat(language, {
                numeric: 'auto',
                style: 'long', /* alternative = 'narrow' */
            });

            const ms = timestamp - Date.now();

            const years = Math.ceil(ms / 31536e6);
            if (years) return formatter.format(years, 'year');

            const months = Math.ceil(ms / 168e6);
            if (months) return formatter.format(months, 'month');

            const days = Math.ceil(ms / 864e5);
            if (days) return formatter.format(days, 'day');

            const hours = Math.ceil(ms / 36e5);
            if (hours) return formatter.format(hours, 'hour');

            const minutes = Math.ceil(ms / 6e4);
            if (minutes) return formatter.format(minutes, 'minute');

            const seconds = Math.ceil(ms / 1e3);
            return formatter.format(seconds, 'second');
        } else {
            return this.angularDatePipe(timestamp);
        }
    }

    angularDatePipe(timestamp: number) {
        const locale = this.translateService.activeLanguage || this.translateService.defaultLanguage;
        return formatDate(timestamp, 'HH:mm MMM d, y', locale);
    }
}
