import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './profile.service';
import { ProfileRoutingModule } from './profile-routing.module';
import { ReportUserDialogComponent } from './report-user-dialog/report-user-dialog.component';
import { ShareUserDialogComponent } from './share-user-dialog/share-user-dialog.component';
import { ClipboardModule } from 'ngx-clipboard';
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
    ClipboardModule,
    MdButtonModule,
    MdCardModule,
    MdProgressSpinnerModule,
    MdIconModule,
    MdDialogModule,
    MdMenuModule,
    MdSnackBarModule,
    MdTooltipModule
  ],
  declarations: [
    ProfileComponent,
    ReportUserDialogComponent,
    ShareUserDialogComponent
  ],
  providers: [
    ProfileService
  ],
  entryComponents: [
    ReportUserDialogComponent,
    ShareUserDialogComponent
  ],
})
export class ProfileModule { }
