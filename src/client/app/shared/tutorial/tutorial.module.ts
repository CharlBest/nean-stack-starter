import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IconsModule } from '../icons/icons.module';
import { TutorialDirective } from './tutorial.directive';
import { TutorialComponent } from './tutorial/tutorial.component';

const materialModules = [
    MatButtonModule,
];

@NgModule({
    imports: [
        CommonModule,
        IconsModule,
        ...materialModules
    ],
    declarations: [
        TutorialComponent,
        TutorialDirective
    ],
    exports: [
        TutorialComponent,
        TutorialDirective
    ]
})
export class TutorialModule { }
