import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { VerifyComponent } from './verify/verify.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: ':code', component: VerifyComponent, pathMatch: 'full',
                data: { title: 'Verify email', nav: NavigationType.BACK }
            }
        ])
    ],
    exports: [RouterModule]
})
export class VerifyRoutingModule { }
