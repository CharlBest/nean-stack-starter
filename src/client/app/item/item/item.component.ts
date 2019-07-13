import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { ReportItemViewModel } from '../../../../shared/view-models/item/report-item.view-model';
import { ContextMenuComponent } from '../../shared/context-menu/context-menu/context-menu.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { ShareService } from '../../shared/services/share.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, AfterViewInit {
  @ViewChild('contextMenu', { static: false }) contextMenu: ContextMenuComponent;
  @ViewChild('description', { static: false }) description: ElementRef<HTMLParagraphElement>;
  @Input() item: ItemViewModel;
  @Input() isViewingComments: boolean;
  isProcessing = false;
  showMoreButton = false;
  activeMediaIndex = 0;

  constructor(private itemService: ItemService,
    public formErrorsService: FormErrorsService,
    public authService: AuthService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    public bpService: BreakpointService,
    private shareDialogService: ShareDialogService,
    private shareService: ShareService,
    private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.processDescription();
  }

  processDescription() {
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

  async deleteItem() {
    const hasConfirmed = await this.dialogService.confirm('Are you sure you want to delete this item?');
    if (hasConfirmed) {
      this.contextMenu.close();

      this.snackBar.open('Deleting...');

      try {
        await this.itemService.delete(this.item.uId);
        this.snackBar.dismiss();
        this.snackBar.open('Deleted');
        // TODO: very dirty and bad UI but will work for now
        this.router.navigate(['']);
      } catch (error) {
        this.snackBar.dismiss();
        this.snackBar.open('Delete failed');
        this.formErrorsService.updateFormValidity(error);
      } finally {
        this.isProcessing = false;
      }
    }
  }

  async reportItem() {
    const hasConfirmed = await this.dialogService
      .confirm('This item is either spam, abusive, harmful or you think it doesn\'t belong on here.');
    if (hasConfirmed) {
      this.contextMenu.close();

      const viewModel = new ReportItemViewModel();
      viewModel.uId = this.item.uId;

      this.snackBar.open('Sending...');

      try {
        await this.itemService.sendReport(viewModel);
        this.snackBar.dismiss();
        this.snackBar.open('Sent');
      } catch (error) {
        this.snackBar.dismiss();
        this.snackBar.open('Sending failed');
      }
    }
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

  // #region Favourties

  favouriteItem(event: Event) {
    event.stopPropagation();

    if (this.item.favourite) {
      this.deleteFavourite();
    } else {
      this.createFavourite();
    }
  }

  async createFavourite() {
    try {
      await this.itemService.createFavourite(this.item.uId);
      this.item.favourite = true;
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    }
  }

  async deleteFavourite() {
    try {
      await this.itemService.deleteFavourite(this.item.uId);
      this.item.favourite = false;
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    }
  }

  // #endregion

  openShareDialog() {
    this.contextMenu.close();

    const url = ['/item/comments', this.item.uId];
    if (!this.shareService.webShareWithUrl('Item', url)) {
      this.shareDialogService.share(url);
    }
  }

  copyLink() {
    this.shareService.copyWithUrl(['/item/comments', this.item.uId]);
    this.contextMenu.close();
  }

  goToComments() {
    this.contextMenu.close();
    this.router.navigate(['/item/edit', this.item.uId], { state: { item: this.item } });
  }

  // #region Subscription

  subscribeToItem(event: Event) {
    event.stopPropagation();

    if (this.item.subscribed) {
      this.deleteSubscription();
    } else {
      this.createSubscription();
    }
  }

  async createSubscription() {
    try {
      await this.itemService.createSubscription(this.item.uId);
      this.item.subscribed = true;
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    }
  }

  async deleteSubscription() {
    try {
      await this.itemService.deleteSubscription(this.item.uId);
      this.item.subscribed = false;
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    }
  }

  // #endregion
}
