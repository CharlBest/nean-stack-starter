import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: HomeComponent, pathMatch: 'full', data: { title: 'Home', nav: HeaderType.Primary } },
        ])
    ],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
