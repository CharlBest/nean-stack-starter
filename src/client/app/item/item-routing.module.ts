import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderType } from '../shared/header/header/header-type.enum';
import { ItemComponent } from './item/item.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ItemComponent, pathMatch: 'full', data: { title: 'Item', nav: HeaderType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class ItemRoutingModule { }
