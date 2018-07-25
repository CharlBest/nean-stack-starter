import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { StripeElementsComponent } from '../../shared/stripe-elements/stripe-elements/stripe-elements.component';
import { ProfileService } from '../profile.service';

@Component({
    selector: 'app-create-card-dialog',
    templateUrl: './create-card-dialog.component.html',
    styleUrls: ['./create-card-dialog.component.scss']
})
export class CreateCardDialogComponent {

    @ViewChild('stripeElements') stripeElementsComponent: StripeElementsComponent;
    isProcessing = false;

    constructor(private profileService: ProfileService,
        private formErrorsService: FormErrorsService,
        private dialogRef: MatDialogRef<CreateCardDialogComponent>) { }

    async onSubmit() {
        this.isProcessing = true;
        const token = await this.stripeElementsComponent.generateToken();

        if (token) {
            this.profileService.createCard(token.id)
                .pipe(finalize(() => this.isProcessing = false))
                .subscribe(data => {
                    this.dialogRef.close(data);
                }, error => {
                    this.formErrorsService.updateFormValidity(error);
                });
        }
    }
}
