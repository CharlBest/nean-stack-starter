import { AfterViewInit, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatBottomSheet, MatMenuTrigger, MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { ReportItemViewModel } from '../../../../shared/view-models/item/report-item.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { PreventBackNavigationService } from '../../shared/services/prevent-back-navigation.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, AfterViewInit {
  @ViewChild('bottomSheetContextMenu') bottomSheetContextMenu: TemplateRef<any>;
  @ViewChild('contextMenuTrigger') contextMenuTrigger: MatMenuTrigger;
  @ViewChild('description') description: ElementRef<HTMLParagraphElement>;
  @Input() item: ItemViewModel;
  @Input() isViewingComments: boolean;
  loggedInUserId: number = this.authService.getLoggedInUserId();
  isProcessing = false;
  showMoreButton = false;
  activeMediaIndex = 0;

  constructor(private itemService: ItemService,
    public formErrorsService: FormErrorsService,
    private authService: AuthService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    public bottomSheet: MatBottomSheet,
    public bpService: BreakpointService,
    private preventBackNavigationService: PreventBackNavigationService,
    private shareDialogService: ShareDialogService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.description && !this.isViewingComments) {
      setTimeout(() => {
        if (this.description.nativeElement.offsetHeight < this.description.nativeElement.scrollHeight ||
          this.description.nativeElement.offsetWidth < this.description.nativeElement.scrollWidth) {
          this.showMoreButton = true;
        } else {
          this.showMoreButton = false;
        }
      });
    } else {
      this.showMoreDescription();
    }
  }

  deleteItem() {
    this.dialogService.confirm('Are you sure you want to delete this item?').subscribe(data => {
      if (data) {
        this.itemService.delete(this.item.uId)
          .pipe(finalize(() => this.isProcessing = false))
          .subscribe(() => {
          }, error => {
            this.formErrorsService.updateFormValidity(error);
          });
      }
    });
  }

  openContextMenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.bpService.isDesktop) {
      this.contextMenuTrigger.openMenu();
    } else {
      this.contextMenuTrigger.closeMenu();

      this.preventBackNavigationService.beforeOpen();

      this.bottomSheet.open(this.bottomSheetContextMenu, {
        closeOnNavigation: true
      }).afterDismissed().subscribe(() => this.preventBackNavigationService.afterClosed());
    }
  }

  openShareDialog() {
    const link = ['/home', this.item.uId];
    this.shareDialogService.share(link);
  }

  reportItem() {
    this.dialogService.confirm('This item is either spam, abusive, harmful or you think it doesn\'t belong on here.').subscribe(data => {
      if (data) {
        const viewModel = new ReportItemViewModel;
        viewModel.uId = this.item.uId;

        this.snackBar.open('Sending...');

        this.itemService.sendReport(viewModel)
          .subscribe(() => {
            this.snackBar.dismiss();
            this.snackBar.open('Sent');
          }, error => {
            this.snackBar.dismiss();
            this.snackBar.open('Sending failed');
          });
      }
    });
  }

  showMoreDescription() {
    this.description.nativeElement.style.maxHeight = 'none';
    this.showMoreButton = false;
  }

  mediaPrevious() {
    if (this.activeMediaIndex === 0) {
      this.activeMediaIndex = this.item.media.length - 1;
    } else {
      this.activeMediaIndex--;
    }
  }

  mediaNext() {
    // TODO: swithcing out the images to fast (clicking rapidly) freezes it
    if (this.activeMediaIndex >= this.item.media.length - 1) {
      this.activeMediaIndex = 0;
    } else {
      this.activeMediaIndex++;
    }
  }
}
