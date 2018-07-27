import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { UserCardModel } from '../../../../../shared/models/user/user-card.model';
import { BuildFormGroup } from '../../../../../shared/validation/validators';
import { AnonymousPaymentViewModel } from '../../../../../shared/view-models/payment/anonymous-payment.view-model';
import { UserPaymentViewModel } from '../../../../../shared/view-models/payment/user-payment.view-model';
import { AuthService } from '../../auth.service';
import { FormErrorsService } from '../../form-errors/form-errors.service';
import { StripeElementsComponent } from '../../stripe-elements/stripe-elements/stripe-elements.component';
import { PaymentService } from '../payment.service';

@Component({
    selector: 'app-payment-dialog',
    templateUrl: './payment-dialog.component.html',
    styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {

    @ViewChild('stripeElements') stripeElementsComponent: StripeElementsComponent;

    isUserLoggedIn: boolean = this.authService.hasToken();
    isProcessing = true;
    formGroup: FormGroup;
    paymentSuccess = false;
    userCards: UserCardModel[];

    constructor(private fb: FormBuilder,
        private paymentService: PaymentService,
        public formErrorsService: FormErrorsService,
        private authService: AuthService) { }

    ngOnInit() {
        this.formOnInit();
        this.getUserCards();
    }

    formOnInit() {
        this.formGroup = this.fb.group(BuildFormGroup.payment());
    }

    getUserCards() {
        this.paymentService.userCards().subscribe(data => {
            this.userCards = data;
            const firstCardUId = this.userCards && this.userCards.length > 0 ? this.userCards[0].uId : null;
            this.formGroup.get('cardUId').setValue(firstCardUId);
        });
    }

    async onSubmit() {
        this.isProcessing = true;
        const token = await this.stripeElementsComponent.generateToken();

        if (token) {
            this.sendPaymentToServer(token.id)
        }
    }

    sendPaymentToServer(token: string) {
        if (this.isUserLoggedIn) {
            const viewModel = new UserPaymentViewModel();
            viewModel.token = token;
            viewModel.cardUId = this.formGroup.get('cardUId').value;
            viewModel.amount = +this.formGroup.get('amount').value;
            viewModel.saveCard = this.formGroup.get('saveCard').value === true;

            this.paymentService.userPayment(viewModel)
                .pipe(finalize(() => this.isProcessing = false))
                .subscribe(() => {
                    this.paymentSuccess = true;
                }, error => {
                    this.formErrorsService.updateFormValidity(error, this.formGroup);
                });
        } else {
            const viewModel = new AnonymousPaymentViewModel();
            viewModel.token = token;
            viewModel.amount = +this.formGroup.get('amount').value;

            this.paymentService.anonymousPayment(viewModel)
                .pipe(finalize(() => this.isProcessing = false))
                .subscribe(() => {
                    this.paymentSuccess = true;
                }, error => {
                    this.formErrorsService.updateFormValidity(error, this.formGroup);
                });
        }
    }
}
