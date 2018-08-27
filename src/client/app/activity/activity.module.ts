import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule, MatButtonModule, MatCardModule, MatIconModule, MatListModule } from '@angular/material';
import { ActivityRoutingModule } from './activity-routing.module';
import { ActivityComponent } from './activity/activity.component';

const materialModules = [
  MatIconModule,
  MatButtonModule,
  MatBadgeModule,
  MatListModule,
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    ActivityRoutingModule,
    ...materialModules
  ],
  declarations: [
    ActivityComponent
  ]
})
export class ActivityModule { }
