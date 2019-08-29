import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OnboardingComponent } from './onboarding/onboarding.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: OnboardingComponent, pathMatch: 'full',
                data: { title: 'Onboarding' }
            }
        ])
    ],
    exports: [RouterModule]
})
export class OnboardingRoutingModule { }
