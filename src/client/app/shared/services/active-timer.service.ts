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

    init() {
        this.setTimer();
        this.addVisibilityChangeListener();
    }

    private addVisibilityChangeListener() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.clearTimeout();
            } else {
                this.setTimer();
            }
        });
    }

    private setTimer() {
        this.clearTimeout();
        this.setTimeoutId = window.setTimeout(() => {
            this.showMessageOnNextClick = this.showMessageOnNextClick.bind(this);
            document.addEventListener('click', this.showMessageOnNextClick);
        }, this.timeToWait);
    }

    private showMessageOnNextClick() {
        // Message
        this.dialogService.alert('You have been online for 1 hour. Take a small break.');

        // Remove showing message on click
        document.removeEventListener('click', this.showMessageOnNextClick);

        // Restart timer
        this.setTimer();
    }

    private clearTimeout() {
        if (this.setTimeoutId) {
            clearTimeout(this.setTimeoutId);
            this.setTimeoutId = null;
        }
    }
}
