import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { SearchComponent } from './search/search.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: SearchComponent, pathMatch: 'full', data: { title: 'Search', nav: NavigationType.Primary } },
        ])
    ],
    exports: [RouterModule]
})
export class SearchRoutingModule { }
