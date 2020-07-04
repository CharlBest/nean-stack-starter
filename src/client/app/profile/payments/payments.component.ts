import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CardViewModel } from '@shared/view-models/payment/card.view-model';
import { PaymentService } from '../../payment/payment.service';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';

interface ExtendedCardViewModel extends CardViewModel {
  hasExpired: boolean;
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnChanges {

  @Input() paymentCards: ExtendedCardViewModel[] = [];
  isProcessing = false;
  isChangingDefault = false;
  newDefaultCardIdControl = new FormControl();

  constructor(private paymentService: PaymentService,
    private formErrorsService: FormErrorsService,
    private dialogService: DialogService) { }

  ngOnChanges(change: SimpleChanges) {
    if (change.paymentCards && this.paymentCards) {
      this.paymentCards.forEach(card => card.hasExpired = this.hasCardExpired(card));
    }
  }

  async deleteCard(id: string) {
    const hasConfirmed = await this.dialogService.confirm({
      title: 'Delete payment method',
      body: 'Are you sure you want to delete this payment method?',
      confirmButtonText: 'Delete'
    });
    if (hasConfirmed) {

      try {
        const response = await this.paymentService.deleteCard(id);
        if (response) {
          if (!this.paymentCards) {
            this.paymentCards = [];
          }

          this.paymentCards = this.paymentCards.filter(card => card.id !== id);
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

    if (this.newDefaultCardIdControl.value && this.newDefaultCardIdControl.value !== currentDefaultCard.id) {

      try {
        const response = await this.paymentService.updateDefaultCard(this.newDefaultCardIdControl.value);
        if (response) {
          this.paymentCards.forEach(card => {
            if (card.id !== this.newDefaultCardIdControl.value) {
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

  trackByFn(index: number, item: CardViewModel) {
    return index;
  }
}
