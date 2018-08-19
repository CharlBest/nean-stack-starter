import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { CardModel } from '../../../../shared/models/payment/card.model';
import { CardViewModel } from '../../../../shared/view-models/payment/card.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { CreateCardDialogComponent } from '../create-card-dialog/create-card-dialog.component';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  @Input() userCards: CardViewModel[] = [];
  isProcessing = false;
  isChangingDefault = false;
  newDefaultCardUId: string = null;

  constructor(private dialog: MatDialog,
    private profileService: ProfileService,
    private formErrorsService: FormErrorsService,
    private dialogService: DialogService) { }

  ngOnInit() {
  }

  addCard() {
    const dialog = this.dialog.open(CreateCardDialogComponent);
    dialog.afterClosed().subscribe((data: CardModel) => {
      if (data) {
        this.userCards.push(data);
      }
    });
  }

  deleteCard(uId: string) {
    this.dialogService.confirm('Are you sure you want to delete this payment method?').subscribe(data => {
      if (data) {
        this.profileService.deleteCard(uId)
          .pipe(finalize(() => this.isProcessing = false))
          .subscribe(data => {
            if (data) {
              if (this.userCards === null || this.userCards === undefined) {
                this.userCards = [];
              }

              this.userCards = this.userCards.filter(x => x.uId !== uId);
            }
          }, error => {
            this.formErrorsService.updateFormValidity(error);
          });
      }
    });
  }

  changeDefaultCard() {
    this.isProcessing = true;
    const currentDefaultCard = this.userCards.find(x => x.isDefault);

    if (this.newDefaultCardUId && this.newDefaultCardUId !== currentDefaultCard.uId) {
      this.profileService.updateDefaultCard(this.newDefaultCardUId)
        .pipe(finalize(() => {
          this.isProcessing = false;
          this.isChangingDefault = false;
        }))
        .subscribe(data => {
          if (data) {
            this.userCards.forEach(x => {
              if (x.uId !== this.newDefaultCardUId) {
                x.isDefault = false;
              } else {
                x.isDefault = true;
              }
            });
          }
        }, error => {
          this.formErrorsService.updateFormValidity(error);
        });
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
