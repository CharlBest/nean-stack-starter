import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatBottomSheet, MatMenuTrigger } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { PreventBackNavigationService } from '../../shared/services/prevent-back-navigation.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @ViewChild('bottomSheetContextMenu') bottomSheetContextMenu: TemplateRef<any>;
  @ViewChild('contextMenuTrigger') contextMenuTrigger: MatMenuTrigger;

  loggedInUserId: number = this.authService.getLoggedInUserId();
  isProcessing = false;
  @Input() item: ItemViewModel;

  constructor(private homeService: HomeService,
    public formErrorsService: FormErrorsService,
    private authService: AuthService,
    private dialogService: DialogService,
    public bottomSheet: MatBottomSheet,
    public bpService: BreakpointService,
    private preventBackNavigationService: PreventBackNavigationService) { }

  ngOnInit() {
  }

  deleteItem(uId: string) {
    this.dialogService.confirm('Are you sure you want to delete this item?').subscribe(data => {
      if (data) {
        this.homeService.delete(uId)
          .pipe(finalize(() => this.isProcessing = false))
          .subscribe(data => {
          }, error => {
            this.formErrorsService.updateFormValidity(error);
          });
      }
    });
  }


  openContextMenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.bpService.isWeb) {
      this.contextMenuTrigger.openMenu();
    } else {
      this.contextMenuTrigger.closeMenu();

      this.preventBackNavigationService.beforeOpen();

      this.bottomSheet.open(this.bottomSheetContextMenu, {
        autoFocus: false,
        closeOnNavigation: true
      }).afterDismissed().subscribe(() => this.preventBackNavigationService.afterClosed());
    }
  }
}
