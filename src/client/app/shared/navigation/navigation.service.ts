import { ElementRef, EventEmitter, Injectable, Output, TemplateRef } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    backRouterPath: string | null;
    previousUrl = '';
    navigationPlaceholderTemplate: TemplateRef<ElementRef> | null;
    showInstallBanner = false;
    showHomeNavigationBadge = false;
    @Output() searched: EventEmitter<string> = new EventEmitter<string>();
}
