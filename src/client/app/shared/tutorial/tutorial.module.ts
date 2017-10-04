import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdDialogModule, MdButtonModule, MdIconModule } from '@angular/material';
import { TutorialDirective } from './tutorial.directive';
import { TutorialService } from './tutorial.service';
import { TutorialComponent } from './tutorial/tutorial.component';

@NgModule({
    imports: [
        CommonModule,
        MdDialogModule,
        MdButtonModule,
        MdIconModule
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
