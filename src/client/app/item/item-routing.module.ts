import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { AuthService } from '../shared/services/auth.service';
import { CommentsComponent } from './comments/comments.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'create', component: CreateItemComponent, pathMatch: 'full', data: { title: 'Create Item', nav: NavigationType.Primary }, canActivate: [AuthService] },
            { path: 'edit/:uId', component: EditItemComponent, pathMatch: 'full', data: { title: 'Edit Item', nav: NavigationType.Back }, canActivate: [AuthService] },
            { path: ':uId', component: CommentsComponent, pathMatch: 'full', data: { title: 'Comments', nav: NavigationType.Back } },
        ])
    ],
    exports: [RouterModule]
})
export class ItemRoutingModule { }
