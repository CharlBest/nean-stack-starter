import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { AuthService } from '../shared/services/auth.service';
import { CommentsComponent } from './comments/comments.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { EditCommentComponent } from './edit-comment/edit-comment.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { FavouritesComponent } from './favourites/favourites.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'create', component: CreateItemComponent, pathMatch: 'full',
                data: { title: 'Create Item', nav: NavigationType.PRIMARY }, canActivate: [AuthService]
            },
            {
                path: 'edit/:uId', component: EditItemComponent, pathMatch: 'full',
                data: { title: 'Edit Item', nav: NavigationType.BACK }, canActivate: [AuthService]
            },
            {
                path: 'comments/:uId', component: CommentsComponent, pathMatch: 'full',
                data: { title: 'Comments', nav: NavigationType.BACK }
            },
            {
                path: 'comment/edit/:uId', component: EditCommentComponent, pathMatch: 'full',
                data: { title: 'Edit Comment', nav: NavigationType.BACK }
            },
            {
                path: 'saved', component: FavouritesComponent, pathMatch: 'full',
                data: { title: 'Saved', nav: NavigationType.BACK }, canActivate: [AuthService]
            },
        ])
    ],
    exports: [RouterModule]
})
export class ItemRoutingModule { }
