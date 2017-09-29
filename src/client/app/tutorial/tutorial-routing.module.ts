import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TutorialComponent } from '../tutorial/tutorial/tutorial.component';
import { Navigation } from '../shared/navigation/navigation/navigation.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: ':type', component: TutorialComponent, pathMatch: 'full', data: { title: 'Tutorial' } }
        ])
    ],
    exports: [RouterModule]
})
export class TutorialRoutingModule { }
