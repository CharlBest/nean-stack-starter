import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material';
import { FooterComponent } from './footer/footer.component';

const materialModules = [
    MatCardModule
];

@NgModule({
    imports: [
        ...materialModules
    ],
    exports: [
        FooterComponent
    ],
    declarations: [
        FooterComponent
    ]
})
export class FooterModule { }
