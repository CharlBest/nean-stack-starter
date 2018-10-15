import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatBottomSheet, MatMenuTrigger } from '@angular/material';
import { BreakpointService } from '../../services/breakpoint.service';
import { PreventBackNavigationService } from '../../services/prevent-back-navigation.service';

@Component({
    selector: 'app-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {
    @ViewChild('bottomSheetContextMenu') bottomSheetContextMenu: TemplateRef<any>;
    @ViewChild('contextMenuTrigger') contextMenuTrigger: MatMenuTrigger;

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
            }).afterDismissed()
                .subscribe(() => this.preventBackNavigationService.afterClosed());
        }
    }

    close() {
        this.contextMenuTrigger.closeMenu();
        this.bottomSheet.dismiss();
    }
}
