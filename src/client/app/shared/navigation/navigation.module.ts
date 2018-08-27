import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatSnackBarModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { TutorialModule } from '../tutorial/tutorial.module';
import { NavigationComponent } from './navigation/navigation.component';

const materialModules = [
  MatInputModule,
  MatIconModule,
  MatMenuModule,
  MatButtonModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatListModule,
  MatBottomSheetModule,
  MatTooltipModule,
  MatCardModule,
  MatBadgeModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TutorialModule,
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
