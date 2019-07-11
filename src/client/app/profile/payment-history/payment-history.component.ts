import { Component, OnInit } from '@angular/core';
import { PaymentModel } from '../../../../shared/models/payment/payment.model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ProfileService } from '../profile.service';

@Component({
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {

  isProcessing = false;
  paymentHistory: PaymentModel[];

  constructor(private profileService: ProfileService,
    private formErrorsService: FormErrorsService) { }

  ngOnInit() {
    this.getPaymentHistory();
  }

  async getPaymentHistory() {
    try {
      const response = await this.profileService.paymentHistory();
      if (response) {
        this.paymentHistory = response;
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    } finally {
      this.isProcessing = false;
    }
  }
}
