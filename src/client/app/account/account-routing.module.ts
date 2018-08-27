import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { AccountComponent } from './account/account.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AccountComponent, pathMatch: 'full', data: { title: 'Account', nav: HeaderType.Back } },
        ])
    ],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
