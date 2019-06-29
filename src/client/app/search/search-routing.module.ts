import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: SearchComponent, pathMatch: 'full',
                data: { title: 'Search' }
            },
        ])
    ],
    exports: [RouterModule]
})
export class SearchRoutingModule { }
