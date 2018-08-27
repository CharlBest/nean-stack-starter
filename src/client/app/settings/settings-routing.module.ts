import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { LanguageComponent } from './language/language.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: SettingsComponent, pathMatch: 'full', data: { title: 'Settings', nav: NavigationType.Back } },
            { path: 'notifications', component: NotificationsComponent, pathMatch: 'full', data: { title: 'Notifications', nav: NavigationType.Back } },
            { path: 'language', component: LanguageComponent, pathMatch: 'full', data: { title: 'Language', nav: NavigationType.Back } },
        ])
    ],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
