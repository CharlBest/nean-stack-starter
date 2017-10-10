import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatButtonModule, MatIconModule } from '@angular/material';
import { TutorialDirective } from './tutorial.directive';
import { TutorialService } from './tutorial.service';
import { TutorialComponent } from './tutorial/tutorial.component';

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
