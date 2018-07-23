import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { LanguageComponent } from './language/language.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: SettingsComponent, pathMatch: 'full', data: { title: 'Settings', nav: HeaderType.Back } },
            { path: 'notifications', component: NotificationsComponent, pathMatch: 'full', data: { title: 'Notifications', nav: HeaderType.Back } },
            { path: 'language', component: LanguageComponent, pathMatch: 'full', data: { title: 'Language', nav: HeaderType.Back } },
        ])
    ],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
