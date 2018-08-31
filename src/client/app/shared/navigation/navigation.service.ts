import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    navigationPlaceholderTemplate: TemplateRef<any>;
}