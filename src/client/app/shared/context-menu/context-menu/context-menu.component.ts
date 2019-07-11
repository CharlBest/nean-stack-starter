import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatMenuTrigger } from '@angular/material/menu';
import { BreakpointService } from '../../services/breakpoint.service';
import { PreventBackNavigationService } from '../../services/prevent-back-navigation.service';

@Component({
    selector: 'app-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {
    @ViewChild('bottomSheetContextMenu', { static: true }) bottomSheetContextMenu: TemplateRef<any>;
    @ViewChild('contextMenuTrigger', { static: true }) contextMenuTrigger: MatMenuTrigger;

    constructor(public bottomSheet: MatBottomSheet,
        public bpService: BreakpointService,
        private preventBackNavigationService: PreventBackNavigationService) { }

    open(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.bpService.isDesktop) {
            this.contextMenuTrigger.openMenu();
        } else {
            this.contextMenuTrigger.closeMenu();

            this.preventBackNavigationService.beforeOpen();

            this.bottomSheet.open(this.bottomSheetContextMenu, {
                hasBackdrop: true
            }).afterDismissed().subscribe(() => this.preventBackNavigationService.afterClosed());
        }
    }

    close() {
        this.contextMenuTrigger.closeMenu();
        this.bottomSheet.dismiss();
    }
}
