import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './profile.service';
import { ProfileRoutingModule } from './profile-routing.module';
import { ShareDialogModule } from '../shared/share-dialog/share-dialog.module';
import { ReportDialogModule } from '../shared/report-dialog/report-dialog.module';
import { UploadButtonModule } from '../shared/upload-button/upload-button.module';
import {
  MdButtonModule,
  MdCardModule,
  MdProgressSpinnerModule,
  MdIconModule,
  MdDialogModule,
  MdMenuModule,
  MdSnackBarModule,
  MdTooltipModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MdButtonModule,
    MdCardModule,
    MdProgressSpinnerModule,
    MdIconModule,
    MdSnackBarModule,
    MdTooltipModule,
    ShareDialogModule,
    ReportDialogModule,
    UploadButtonModule
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule { }
