import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewsletterComponent } from '../newsletter/newsletter/newsletter.component';
import { HeaderType } from '../shared/header/header/header-type.enum';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: NewsletterComponent, pathMatch: 'full', data: { title: 'Newsletter', nav: HeaderType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class NewsletterRoutingModule { }
