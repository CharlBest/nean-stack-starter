import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation/navigation-type.enum';
import { CommentsComponent } from './comments/comments.component';
import { ItemsComponent } from './items/items.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ItemsComponent, pathMatch: 'full', data: { title: 'Home', nav: NavigationType.Primary } },
            { path: ':uId', component: CommentsComponent, pathMatch: 'full', data: { title: 'Comments', nav: NavigationType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
