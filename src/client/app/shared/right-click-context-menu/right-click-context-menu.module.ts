import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RightClickContextMenuDirective } from './right-click-context-menu.directive';
import { RightClickContextMenuComponent } from './right-click-context-menu/right-click-context-menu.component';

const materialModules = [
  MatCardModule
];

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    ...materialModules
  ],
  declarations: [
    RightClickContextMenuComponent,
    RightClickContextMenuDirective
  ],
  exports: [
    RightClickContextMenuDirective
  ]
})
export class RightClickContextMenuModule { }
