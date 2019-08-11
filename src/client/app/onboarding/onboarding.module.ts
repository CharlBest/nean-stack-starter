import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { IconsModule } from '../shared/icons/icons.module';

const materialModules = [
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
];

@NgModule({
    imports: [
        CommonModule,
        OnboardingRoutingModule,
        IconsModule,
        ...materialModules
    ],
    declarations: [
        OnboardingComponent
    ]
})
export class OnboardingModule { }
