import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { Error404Component } from './error-404/error-404.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: Error404Component, pathMatch: 'full',
                data: { title: 'Error 404', nav: NavigationType.BACK }
            }
        ])
    ],
    exports: [RouterModule]
})
export class Error404RoutingModule { }
