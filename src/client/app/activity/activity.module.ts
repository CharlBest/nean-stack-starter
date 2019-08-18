import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconsModule } from '../shared/icons/icons.module';
import { TranslateModule } from '../shared/translate/translate.module';
import { ActivityRoutingModule } from './activity-routing.module';
import { ActivityComponent } from './activity/activity.component';

const materialModules = [
  MatButtonModule,
  MatListModule,
  MatCardModule,
  MatTooltipModule,
];

@NgModule({
  imports: [
    CommonModule,
    ActivityRoutingModule,
    IconsModule,
    TranslateModule,
    ...materialModules
  ],
  declarations: [
    ActivityComponent
  ]
})
export class ActivityModule { }
