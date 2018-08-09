import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { CardModel } from '../../../../../shared/models/payment/card.model';
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
    userCards: CardModel[];

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
            // Default card first
            if (this.userCards) {
                this.userCards.sort((a, b) => <any>b.isDefault - <any>a.isDefault);
            }

            const firstCardUId = this.userCards && this.userCards.length > 0 ? this.userCards[0].uId : null;
            this.formGroup.get('cardUId').setValue(firstCardUId);
        });
    }

    async onSubmit() {
        this.isProcessing = true;

        if (this.formGroup.get('cardUId').value === null || this.formGroup.get('cardUId').value === 'new') {
            const token = await this.stripeElementsComponent.generateToken();
            if (token) {
                this.sendPaymentToServer(token.id)
            } else {
                alert('Invalid card details');
            }
        } else {
            this.sendPaymentToServer();
        }
    }

    sendPaymentToServer(token: string = null) {
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
            viewModel.email = this.formGroup.get('email').value;
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

    isFormValid(): boolean {
        // Form validity (Amount is required)
        if (!this.formGroup.valid) {
            return false;
        }

        // Email is requried if anonymous payment
        if (!this.isUserLoggedIn && (this.formGroup.get('email').value === null || this.formGroup.get('email').value === '')) {
            return false;
        }

        // Stripe element valid when adding new card by user
        if (this.isUserLoggedIn && !this.stripeElementsComponent.isValid &&
            (this.formGroup.get('cardUId').value === null || this.formGroup.get('cardUId').value === 'new')) {
            return false;
        }

        return true;
    }
}
