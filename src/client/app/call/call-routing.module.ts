import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { CallComponent } from './call/call.component';
import { CreateCallComponent } from './create-call/create-call.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: CallComponent, pathMatch: 'full',
                data: { title: 'Call' }
            },
            {
                path: 'create', component: CreateCallComponent, pathMatch: 'full',
                data: { title: 'Create Call', nav: NavigationType.BACK }
            }
        ])
    ],
    exports: [RouterModule]
})
export class CallRoutingModule { }
