import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class PaymentService {

  // NB: needs to provide the payments controller in module this service is being used
  constructor(public snackBar: MatSnackBar) { }

  takePayment(productName: string, amount: number, token: any) {

    // const viewModel = new PaymentRequestViewModel;
    // viewModel.productName = productName;
    // viewModel.amount = amount;
    // viewModel.tokenId = token.id;

    // this.paymentController.processPayment(viewModel).subscribe((data) => {
    //   if (data.status === 'succeeded') {
    //     // TODO: make this more rewarding for the user by showing full page and saying thank you!
    //     this.snackBar.open('Payment successful', '', {
    //       duration: 10000,
    //     });
    //   }
    // }, error => {
    //   // TODO: crucial. handel payment error!
    //   this.snackBar.open('Payment error', '', {
    //     duration: 10000,
    //   });
    // });
  }

  openCheckout(productName: string, amount: number, tokenCallback) {
    // TODO: using window any removes type checking
    const handler = (<any>window).StripeCheckout.configure({
      // key: environment.stripePublishableKey,
      locale: 'auto',
      token: tokenCallback
    });

    // TODO: customize the amount being payed
    handler.open({
      name: 'Test user',
      description: productName,
      zipCode: false,
      currency: 'gbp',
      amount: amount,
      panelLabel: 'Pay {{amount}}',
      allowRememberMe: false
    });
  }
}
