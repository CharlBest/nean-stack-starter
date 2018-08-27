import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { CreateItemComponent } from './create-item/create-item.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CreateItemComponent, pathMatch: 'full', data: { title: 'Create Item', nav: NavigationType.Primary } },
        ])
    ],
    exports: [RouterModule]
})
export class CreateItemRoutingModule { }
