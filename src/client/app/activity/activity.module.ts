import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule } from '@angular/material';
import { ActivityRoutingModule } from './activity-routing.module';
import { ActivityComponent } from './activity/activity.component';

const materialModules = [
  MatButtonModule,
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
