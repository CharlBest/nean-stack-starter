import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: HomeComponent, pathMatch: 'full', data: { title: 'Home', nav: NavigationType.Primary } },
        ])
    ],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
