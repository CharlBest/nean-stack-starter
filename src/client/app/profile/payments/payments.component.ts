import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent {

  isProcessing = false;

  constructor(private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    private profileService: ProfileService) { }
}
