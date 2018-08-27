import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation/navigation-type.enum';
import { AccountComponent } from './account/account.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AccountComponent, pathMatch: 'full', data: { title: 'Account', nav: NavigationType.Back } },
        ])
    ],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
