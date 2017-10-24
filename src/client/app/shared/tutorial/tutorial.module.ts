import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialDirective } from './tutorial.directive';
import { TutorialService } from './tutorial.service';
import { TutorialComponent } from './tutorial/tutorial.component';
import {
    MatDialogModule,
    MatButtonModule,
    MatIconModule
} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
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
