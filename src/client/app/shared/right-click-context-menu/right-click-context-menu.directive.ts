import { Directive, HostListener, Input } from '@angular/core';
import { ContextMenuComponent } from '../context-menu/context-menu/context-menu.component';
import { RightClickContextMenuService } from './right-click-context-menu.service';

@Directive({
    selector: '*[appRightClickContextMenu]'
})
export class RightClickContextMenuDirective {

    @Input() appRightClickContextMenu: ContextMenuComponent;

    constructor(private rightClickContextMenuService: RightClickContextMenuService) { }

    @HostListener('contextmenu', ['$event']) onRightClick(event: MouseEvent) {
        event.preventDefault();
        this.rightClickContextMenuService.open(event, this.appRightClickContextMenu);
    }
}
