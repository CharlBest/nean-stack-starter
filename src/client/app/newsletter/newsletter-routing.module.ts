import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { NewsletterComponent } from './newsletter/newsletter.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: NewsletterComponent, pathMatch: 'full',
                data: { title: 'Newsletter', nav: NavigationType.BACK }
            }
        ])
    ],
    exports: [RouterModule]
})
export class NewsletterRoutingModule { }
