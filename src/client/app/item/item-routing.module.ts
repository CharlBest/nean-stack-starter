import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { AuthService } from '../shared/services/auth.service';
import { CommentComponent } from './comment/comment.component';
import { CommentsComponent } from './comments/comments.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';

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
                path: 'comment/:uId', component: CommentComponent, pathMatch: 'full',
                data: { title: 'Comment', nav: NavigationType.BACK }
            },
            {
                path: 'saved', component: FavouritesComponent, pathMatch: 'full',
                data: { title: 'Saved', nav: NavigationType.BACK }, canActivate: [AuthService]
            },
            {
                path: 'subscriptions', component: SubscriptionsComponent, pathMatch: 'full',
                data: { title: 'Subscriptions', nav: NavigationType.BACK }, canActivate: [AuthService]
            },
        ])
    ],
    exports: [RouterModule]
})
export class ItemRoutingModule { }
