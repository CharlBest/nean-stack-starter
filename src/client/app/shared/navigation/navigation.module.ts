import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';

const materialModules = [
  MatIconModule,
  MatButtonModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule,
  MatBadgeModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ...materialModules
  ],
  exports: [
    NavigationComponent
  ],
  declarations: [
    NavigationComponent
  ]
})
export class NavigationModule { }
