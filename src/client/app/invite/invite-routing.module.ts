import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { InviteComponent } from './invite/invite.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: InviteComponent, pathMatch: 'full',
                data: { title: 'Invite Friends', nav: NavigationType.Back }
            }
        ])
    ],
    exports: [RouterModule]
})
export class InviteRoutingModule { }
