import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { StripeElementsComponent } from '../../shared/stripe-elements/stripe-elements/stripe-elements.component';
import { ProfileService } from '../profile.service';

@Component({
    selector: 'app-create-card',
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
            this.profileService.createCard(token.id)
                .pipe(finalize(() => this.isProcessing = false))
                .subscribe(() => {
                    this.router.navigate(['/profile']);
                }, error => {
                    this.formErrorsService.updateFormValidity(error);
                });
        } else {
            this.dialogService.alert('Invalid card details');
            this.isProcessing = false;
        }
    }
}
