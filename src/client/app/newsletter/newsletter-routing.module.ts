import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewsletterComponent } from '../newsletter/newsletter/newsletter.component';
import { Navigation } from '../shared/navigation/navigation/navigation.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: NewsletterComponent, pathMatch: 'full', data: { title: 'Newsletter', nav: Navigation.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class NewsletterRoutingModule { }
