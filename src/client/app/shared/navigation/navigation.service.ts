import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    backRouterPath: string;
    previousUrl = '';
    navigationPlaceholderTemplate: TemplateRef<any>;
}
