import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { CreateItemComponent } from './create-item/create-item.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CreateItemComponent, pathMatch: 'full', data: { title: 'Create Item', nav: HeaderType.Back } },
        ])
    ],
    exports: [RouterModule]
})
export class CreateItemRoutingModule { }
