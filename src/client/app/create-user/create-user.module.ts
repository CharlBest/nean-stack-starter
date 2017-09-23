import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUserComponent } from './create-user/create-user.component';
import { CreateUserRoutingModule } from './create-user-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TutorialService } from '../tutorial/tutorial.service';
import { MdButtonModule, MdInputModule, MdProgressSpinnerModule, MdCardModule } from '@angular/material';
import { CreateUserService } from '../../app/create-user/create-user.service';
import { LoginService } from '../login/login.service';
import { ShowErrorsModule } from '../shared/show-errors/show-errors.module';

@NgModule({
  imports: [
    CommonModule,
    CreateUserRoutingModule,
    ReactiveFormsModule,
    MdButtonModule,
    MdInputModule,
    MdProgressSpinnerModule,
    MdCardModule,
    ShowErrorsModule
  ],
  declarations: [
    CreateUserComponent
  ],
  providers: [
    CreateUserService,
    LoginService
  ]
})
export class CreateUserModule { }
