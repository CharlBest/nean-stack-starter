import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { IconsModule } from '../shared/icons/icons.module';
import { PreloaderModule } from '../shared/preloader/preloader.module';
import { CallRoutingModule } from './call-routing.module';
import { CallComponent } from './call/call.component';
import { CreateCallComponent } from './create-call/create-call.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatMenuModule
];

@NgModule({
  imports: [
    CommonModule,
    CallRoutingModule,
    FormsModule,
    IconsModule,
    PreloaderModule,
    ...materialModules
  ],
  declarations: [
    CallComponent,
    CreateCallComponent
  ]
})
export class CallModule { }
