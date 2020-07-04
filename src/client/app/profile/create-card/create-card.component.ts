import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { StripeIntentViewModel } from '@shared/view-models/payment/stripe-intent.view-model';
import { PaymentService } from '../../payment/payment.service';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { StripeElementsComponent } from '../../shared/stripe-elements/stripe-elements/stripe-elements.component';

@Component({
    templateUrl: './create-card.component.html',
    styleUrls: ['./create-card.component.scss']
})
export class CreateCardComponent implements OnInit {

    @ViewChild('stripeElements', { static: true }) stripeElementsComponent: StripeElementsComponent;
    isProcessing = true;
    formGroup: FormGroup;

    constructor(private fb: FormBuilder,
        private paymentService: PaymentService,
        private formErrorsService: FormErrorsService,
        private dialogService: DialogService,
        private router: Router) { }

    ngOnInit() {
        this.formOnInit();
    }

    formOnInit() {
        this.formGroup = this.fb.group(FormGroupBuilder.createCard());
    }

    async getCardIntent(): Promise<StripeIntentViewModel | null> {
        try {
            return await this.paymentService.createCardIntent({
                default: this.formGroup.controls.setAsDefault.value
            });
        } catch (error) {
            this.formErrorsService.updateFormValidity(error);
            this.isProcessing = false;
            return null;
        }
    }

    async onSubmit() {
        this.isProcessing = true;
        const viewModel = await this.getCardIntent();

        if (viewModel && viewModel.clientSecret) {
            const paymentMethodId = await this.stripeElementsComponent.confirmCardSetup(viewModel.clientSecret);

            if (paymentMethodId) {
                try {
                    await this.paymentService.createCard(paymentMethodId);
                    this.router.navigate(['/profile']);
                } catch (error) {
                    this.formErrorsService.updateFormValidity(error);
                    this.isProcessing = false;
                }
            } else {
                this.dialogService.alert({
                    title: 'Problem',
                    body: 'Invalid card details'
                });
                this.isProcessing = false;
            }
        }
    }
}
