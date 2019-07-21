import { Directive, HostListener, Input } from '@angular/core';
import { ContextMenuComponent } from '../context-menu/context-menu/context-menu.component';
import { BreakpointService } from '../services/breakpoint.service';
import { RightClickContextMenuService } from './right-click-context-menu.service';

@Directive({
    selector: '*[appRightClickContextMenu]'
})
export class RightClickContextMenuDirective {

    @Input() appRightClickContextMenu: ContextMenuComponent;

    constructor(private rightClickContextMenuService: RightClickContextMenuService,
        private bpService: BreakpointService) { }

    @HostListener('contextmenu', ['$event']) onRightClick(event: MouseEvent) {
        if (this.bpService.isDesktop) {
            event.preventDefault();
            this.rightClickContextMenuService.open(event, this.appRightClickContextMenu);
        }
    }
}
