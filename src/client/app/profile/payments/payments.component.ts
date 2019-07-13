import { Component, Input } from '@angular/core';
import { CardViewModel } from '../../../../shared/view-models/payment/card.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent {

  @Input() paymentCards: CardViewModel[] = [];
  isProcessing = false;
  isChangingDefault = false;
  newDefaultCardUId: string | null;

  constructor(private profileService: ProfileService,
    private formErrorsService: FormErrorsService,
    private dialogService: DialogService) { }

  async deleteCard(uId: string) {
    const hasConfirmed = await this.dialogService.confirm('Are you sure you want to delete this payment method?');
    if (hasConfirmed) {

      try {
        const response = await this.profileService.deleteCard(uId);
        if (response) {
          if (!this.paymentCards) {
            this.paymentCards = [];
          }

          this.paymentCards = this.paymentCards.filter(card => card.uId !== uId);
        }
      } catch (error) {
        this.formErrorsService.updateFormValidity(error);
      } finally {
        this.isProcessing = false;
      }

    }
  }

  async changeDefaultCard() {
    this.isProcessing = true;
    const currentDefaultCard = this.paymentCards.find(card => card.isDefault);

    if (!currentDefaultCard) {
      console.error('No default card could be found');
      return;
    }

    if (this.newDefaultCardUId && this.newDefaultCardUId !== currentDefaultCard.uId) {

      try {
        const response = await this.profileService.updateDefaultCard(this.newDefaultCardUId);
        if (response) {
          this.paymentCards.forEach(card => {
            if (card.uId !== this.newDefaultCardUId) {
              card.isDefault = false;
            } else {
              card.isDefault = true;
            }
          });
        }
      } catch (error) {
        this.formErrorsService.updateFormValidity(error);
      } finally {
        this.isProcessing = false;
        this.isChangingDefault = false;
      }

    } else {
      this.isProcessing = false;
      this.isChangingDefault = false;
    }
  }

  hasCardExpired(card: CardViewModel) {
    const expireDate = new Date();
    expireDate.setUTCFullYear(card.expireYear, card.expireMonth - 1, 1);

    if (expireDate <= new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
