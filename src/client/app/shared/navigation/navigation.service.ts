import { EventEmitter, Injectable, TemplateRef } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    backRouterPath: string | null;
    backHeaderTitle: string | null;
    previousUrl = '';
    navigationPlaceholderTemplate: TemplateRef<HTMLElement> | null;
    showHomeNavigationBadge = false;
    readonly searched: EventEmitter<string> = new EventEmitter<string>();
}
