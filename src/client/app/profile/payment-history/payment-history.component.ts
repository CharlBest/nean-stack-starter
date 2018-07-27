import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {

  isProcessing = false;

  constructor(private profileService: ProfileService,
    private formErrorsService: FormErrorsService) { }

  ngOnInit() {
    this.profileService.paymentHistory()
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {

      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }

}
