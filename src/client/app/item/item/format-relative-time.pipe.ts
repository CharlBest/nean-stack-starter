import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../../shared/translate/translate.service';

@Pipe({
    name: 'formatRelativeTime'
})
export class FormatRelativeTimePipe implements PipeTransform {

    constructor(private translateService: TranslateService) { }

    transform(date: string | null) {
        if (!date) {
            return null;
        }

        if (Intl && (Intl as any).RelativeTimeFormat) {
            const { language = this.translateService.activeLanguage || 'en-US' } = navigator;
            const formatter = new (Intl as any).RelativeTimeFormat(language, {
                numeric: 'auto',
                style: 'long', /* alternative = 'narrow' */
            });

            const ms = new Date(date).getTime() - Date.now();

            // Mapping from a Intl.RelativeTimeFormat unit string to the equivalent value in milliseconds

            const years = Math.ceil(ms / 31_557_600_000); // Approx. 86,400 seconds per day * 365.25 days
            if (years) return formatter.format(years, 'year');

            const months = Math.ceil(ms / 2_629_800_000); // Approx. 31,557,600 seconds per year / 12 months
            if (months) return formatter.format(months, 'month');

            const days = Math.ceil(ms / 86_400_000);
            if (days) return formatter.format(days, 'day');

            const hours = Math.ceil(ms / 3_600_000);
            if (hours) return formatter.format(hours, 'hour');

            const minutes = Math.ceil(ms / 60_000);
            if (minutes) return formatter.format(minutes, 'minute');

            const seconds = Math.ceil(ms / 1_000);
            return formatter.format(seconds, 'second');
        } else {
            return this.angularDatePipe(date);
        }
    }

    angularDatePipe(date: string) {
        const locale = this.translateService.activeLanguage || this.translateService.defaultLanguage;
        return formatDate(date, 'HH:mm MMM d, y', locale);
    }
}
