import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { VerifyComponent } from './verify/verify.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: ':code', component: VerifyComponent, pathMatch: 'full', data: { title: 'Verify email', nav: HeaderType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class VerifyRoutingModule { }
