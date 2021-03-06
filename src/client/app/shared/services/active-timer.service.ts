import { Injectable } from '@angular/core';
import { DialogService } from '../dialog/dialog.service';

// Use this service if you want to notify the user that they have been using
// the paltfrom for a while now and should think about taking a break as
// spending to much time online can potentially effect your wellbeing

@Injectable({
    providedIn: 'root'
})
export class ActiveTimerService {
    private readonly timeToWait = 3600000; // 1 hour
    private setTimeoutId: number | null;

    constructor(public dialogService: DialogService) { }

    init(): void {
        this.setTimer();
        this.addVisibilityChangeListener();
    }

    private addVisibilityChangeListener(): void {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.clearTimeout();
                this.clearClickListener();
            } else {
                this.setTimer();
            }
        });
    }

    private setTimer(): void {
        this.clearTimeout();
        this.setTimeoutId = window.setTimeout(() => {
            this.showMessageOnNextClick = this.showMessageOnNextClick.bind(this);
            document.addEventListener('click', this.showMessageOnNextClick);
        }, this.timeToWait);
    }

    private showMessageOnNextClick(): void {
        // Message
        this.dialogService.alert({
            title: 'Time for a break?',
            body: 'You\'ve been online for 1 hour.'
        });

        // Remove showing message on click
        this.clearClickListener();

        // Restart timer
        this.setTimer();
    }

    private clearClickListener(): void {
        document.removeEventListener('click', this.showMessageOnNextClick);
    }

    private clearTimeout(): void {
        if (this.setTimeoutId) {
            clearTimeout(this.setTimeoutId);
            this.setTimeoutId = null;
        }
    }
}
