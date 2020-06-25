import { CronJob } from 'cron';
import { emailBroker } from '../communication/emailer-broker';

class Cron {
    // Every 5 minutes - check for and send reminders
    // Every day at 07:15 - email previous day error logs

    // Every day at 07:30 - email previous day system report
    systemEmailCron = new CronJob('30 07 * * *', () => {
        emailBroker.system({ success: true });
    });

    init(): void {
        this.systemEmailCron.start();
    }
}

export const cron = new Cron();