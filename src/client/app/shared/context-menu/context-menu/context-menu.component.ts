import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatMenuTrigger } from '@angular/material/menu';
import { RightClickContextMenuService } from '../../right-click-context-menu/right-click-context-menu.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { PreventBackNavigationService } from '../../services/prevent-back-navigation.service';

@Component({
    selector: 'app-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {
    @ViewChild('bottomSheetContextMenu', { static: true }) bottomSheetContextMenu: TemplateRef<ElementRef>;
    @ViewChild('contextMenuTrigger', { static: true }) contextMenuTrigger: MatMenuTrigger;

    constructor(public bottomSheet: MatBottomSheet,
        public bpService: BreakpointService,
        private preventBackNavigationService: PreventBackNavigationService,
        private rightClickContextMenuService: RightClickContextMenuService) { }

    async open(event: Event): Promise<void> {
        event.preventDefault();
        event.stopPropagation();
        this.rightClickContextMenuService.close();

        if (this.bpService.isDesktop) {
            this.contextMenuTrigger.openMenu();
        } else {
            this.contextMenuTrigger.closeMenu();

            this.preventBackNavigationService.beforeOpen();

            await this.bottomSheet.open(this.bottomSheetContextMenu, {
                hasBackdrop: true
            }).afterDismissed().toPromise();

            this.preventBackNavigationService.afterClosed();
        }
    }

    close(): void {
        this.contextMenuTrigger.closeMenu();
        this.bottomSheet.dismiss();
    }
}
