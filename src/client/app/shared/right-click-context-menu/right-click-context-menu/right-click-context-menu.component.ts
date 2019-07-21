import { Component, ElementRef, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-right-click-context-menu',
  templateUrl: './right-click-context-menu.component.html',
  styleUrls: ['./right-click-context-menu.component.scss']
})
export class RightClickContextMenuComponent {
  @Input() contextMenu: TemplateRef<ElementRef> | null;
}

