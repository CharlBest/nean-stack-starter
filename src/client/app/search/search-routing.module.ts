import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { SearchComponent } from './search/search.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: SearchComponent, pathMatch: 'full', data: { title: 'Search', nav: HeaderType.Back } },
        ])
    ],
    exports: [RouterModule]
})
export class SearchRoutingModule { }
