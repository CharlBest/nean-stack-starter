import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navigation } from '../shared/navigation/navigation/navigation.component';
import { VerifyComponent } from '../verify/verify/verify.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: ':code', component: VerifyComponent, pathMatch: 'full', data: { title: 'Verify email', nav: Navigation.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class VerifyRoutingModule { }
