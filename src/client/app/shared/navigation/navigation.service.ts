import { ElementRef, Injectable, TemplateRef } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    backRouterPath: string | null;
    previousUrl = '';
    navigationPlaceholderTemplate: TemplateRef<ElementRef> | null;
    showInstallBanner = false;
}
