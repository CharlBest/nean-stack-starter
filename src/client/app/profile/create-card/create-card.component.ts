import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { StripeElementsComponent } from '../../shared/stripe-elements/stripe-elements/stripe-elements.component';
import { ProfileService } from '../profile.service';

@Component({
    templateUrl: './create-card.component.html',
    styleUrls: ['./create-card.component.scss']
})
export class CreateCardComponent {

    @ViewChild('stripeElements', { static: true }) stripeElementsComponent: StripeElementsComponent;
    isProcessing = true;

    constructor(private profileService: ProfileService,
        private formErrorsService: FormErrorsService,
        private dialogService: DialogService,
        private router: Router) { }

    async onSubmit() {
        this.isProcessing = true;
        const token = await this.stripeElementsComponent.generateToken();

        if (token) {
            try {
                await this.profileService.createCard(token.id);
                this.router.navigate(['/profile']);
            } catch (error) {
                this.formErrorsService.updateFormValidity(error);
                this.isProcessing = false;
            }
        } else {
            this.dialogService.alert('Invalid card details');
            this.isProcessing = false;
        }
    }
}
