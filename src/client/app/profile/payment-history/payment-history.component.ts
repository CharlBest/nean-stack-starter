import { Component, OnInit } from '@angular/core';
import { PaymentModel } from '@shared/models/payment/payment.model';
import { PaymentService } from '../../payment/payment.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';

@Component({
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {

  isProcessing = false;
  paymentHistory: PaymentModel[];

  constructor(private paymentService: PaymentService,
    private formErrorsService: FormErrorsService) { }

  ngOnInit() {
    this.getPaymentHistory();
  }

  async getPaymentHistory() {
    try {
      const response = await this.paymentService.paymentHistory();
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
