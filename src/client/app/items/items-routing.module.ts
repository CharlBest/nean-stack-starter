import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { CommentsComponent } from './comments/comments.component';
import { ItemsComponent } from './items/items.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ItemsComponent, pathMatch: 'full', data: { title: 'Items', nav: HeaderType.Back } },
            { path: ':uId', component: CommentsComponent, pathMatch: 'full', data: { title: 'Comments', nav: HeaderType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class ItemsRoutingModule { }
