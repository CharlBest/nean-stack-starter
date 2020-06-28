import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { DiscoverComponent } from './discover/discover.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: DiscoverComponent, pathMatch: 'full',
                data: { title: 'Discover', nav: NavigationType.BACK }
            },
        ])
    ],
    exports: [RouterModule]
})
export class DiscoverRoutingModule { }
