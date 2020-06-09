import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { RemindersComponent } from './reminders/reminders.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: RemindersComponent, pathMatch: 'full',
                data: { title: 'Reminders', nav: NavigationType.BACK }
            },
        ])
    ],
    exports: [RouterModule]
})
export class ReminderRoutingModule { }
