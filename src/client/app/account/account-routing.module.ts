import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { AccountComponent } from './account/account.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AccountComponent, pathMatch: 'full', data: { title: 'Account', nav: NavigationType.Primary } },
        ])
    ],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
