import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { UserCardModel } from 'shared/models/user/user-card.model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { CreateCardDialogComponent } from '../create-card-dialog/create-card-dialog.component';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  @Input() userCards: UserCardModel[] = [];
  isProcessing = false;
  isChangingDefault = false;
  newDefaultCardUId: string = null;

  constructor(private dialog: MatDialog,
    private profileService: ProfileService,
    private formErrorsService: FormErrorsService) { }

  ngOnInit() {
  }

  addCard() {
    const dialog = this.dialog.open(CreateCardDialogComponent);
    dialog.afterClosed().subscribe((data: UserCardModel) => {
      if (data) {
        this.userCards.push(data);
      }
    });
  }

  deleteCard(uId: string) {
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

  changeDefaultCard() {
    this.isProcessing = true;
    const currentDefaultCard = this.userCards.find(x => x.isDefault);

    if (this.newDefaultCardUId !== null && this.newDefaultCardUId !== currentDefaultCard.uId) {
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
    }
  }
}
