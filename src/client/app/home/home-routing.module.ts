import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navigation } from '../shared/navigation/navigation/navigation.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: HomeComponent, pathMatch: 'full', data: { title: 'Home', nav: Navigation.Primary } },
        ])
    ],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
