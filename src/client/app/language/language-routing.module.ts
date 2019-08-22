import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { LanguageComponent } from './language/language.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: LanguageComponent, pathMatch: 'full',
                data: { title: 'Language', nav: NavigationType.BACK }
            }
        ])
    ],
    exports: [RouterModule]
})
export class LanguageRoutingModule { }
