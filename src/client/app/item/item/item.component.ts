import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { CreateReportViewModel } from '@shared/view-models/report/create-report.view-model';
import { ReportType } from '@shared/view-models/report/report-type.enum';
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
export class ItemComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contextMenu') contextMenu: ContextMenuComponent;
  @ViewChild('description') description: ElementRef<HTMLParagraphElement>;
  @Input() item: ItemViewModel;
  @Input() isViewingComments: boolean;
  @Output() readonly filterClicked: EventEmitter<string> = new EventEmitter<string>();
  isProcessing = false;
  showMoreButton = false;
  activeMediaIndex = 0;
  descriptionTimeoutId: number | null;

  constructor(private itemService: ItemService,
    public formErrorsService: FormErrorsService,
    public authService: AuthService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    public bpService: BreakpointService,
    private shareDialogService: ShareDialogService,
    private shareService: ShareService,
    private router: Router) { }

  ngAfterViewInit(): void {
    this.processDescription();
  }

  processDescription(): void {
    if (this.description && !this.isViewingComments) {
      this.descriptionTimeoutId = window.setTimeout(() => {
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

  async delete(): Promise<void> {
    const hasConfirmed = await this.dialogService.confirm({
      title: 'Delete item',
      body: 'Are you sure you want to delete this item?',
      confirmButtonText: 'Delete'
    });
    if (hasConfirmed) {
      this.contextMenu.close();

      this.snackBar.open('Deleting...');

      try {
        await this.itemService.delete(this.item.uId);
        this.snackBar.dismiss();
        this.snackBar.open('Deleted');
        this.router.navigate(['/']);
      } catch (error) {
        this.snackBar.dismiss();
        this.snackBar.open('Delete failed');
        this.formErrorsService.updateFormValidity(error);
      } finally {
        this.isProcessing = false;
      }
    }
  }

  async report(): Promise<void> {
    const hasConfirmed = await this.dialogService
      .confirm({
        title: 'Report',
        body: 'This item is either spam, abusive, harmful or you think it doesn\'t belong on here.',
        confirmButtonText: 'Report'
      });
    if (hasConfirmed) {
      this.contextMenu.close();

      const viewModel = new CreateReportViewModel();
      viewModel.type = ReportType.ITEM;
      viewModel.uId = this.item.uId;

      this.snackBar.open('Sending...');

      try {
        await this.itemService.report(viewModel);
        this.snackBar.dismiss();
        this.snackBar.open('Sent');
      } catch (error) {
        this.snackBar.dismiss();
        this.snackBar.open('Sending failed');
      }
    }
  }

  showMoreDescription(): void {
    this.description.nativeElement.style.maxHeight = 'none';
    this.showMoreButton = false;
  }

  mediaPrevious(event: Event): void {
    event.stopPropagation();

    if (this.activeMediaIndex === 0) {
      this.activeMediaIndex = this.item.files.length - 1;
    } else {
      this.activeMediaIndex--;
    }
  }

  mediaNext(event: Event): void {
    event.stopPropagation();

    // TODO: swithcing out the images to fast (clicking rapidly) freezes it
    if (this.activeMediaIndex >= this.item.files.length - 1) {
      this.activeMediaIndex = 0;
    } else {
      this.activeMediaIndex++;
    }
  }

  openShareDialog(): void {
    this.contextMenu.close();

    const url = ['/item/comments', this.item.uId];
    if (!this.shareService.webShareWithUrl('Item', url)) {
      this.shareDialogService.share(this.item.title, url);
    }
  }

  copyLink(): void {
    this.shareService.copyWithUrl(['/item/comments', this.item.uId]);
    this.contextMenu.close();
  }

  goToComments(): void {
    this.contextMenu.close();
    this.router.navigate(['/item/edit', this.item.uId], { state: { item: this.item } });
  }

  // #region Favourties

  favouriteItem(event: Event): void {
    event.stopPropagation();

    if (this.item.favourite) {
      this.deleteFavourite();
    } else {
      this.createFavourite();
    }
  }

  async createFavourite(): Promise<void> {
    try {
      await this.itemService.createFavourite(this.item.uId);
      this.item.favourite = true;
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    }
  }

  async deleteFavourite(): Promise<void> {
    try {
      await this.itemService.deleteFavourite(this.item.uId);
      this.item.favourite = false;

      // TODO: very dirty and bad UI but will work for now
      window.location.reload();
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    }
  }

  // #endregion

  // #region Subscription

  subscribeToItem(event: Event): void {
    event.stopPropagation();

    if (this.item.subscribed) {
      this.deleteSubscription();
    } else {
      this.createSubscription();
    }
  }

  async createSubscription(): Promise<void> {
    try {
      await this.itemService.createSubscription(this.item.uId);
      this.item.subscribed = true;
      this.item.subscriptionCount ? this.item.subscriptionCount++ : this.item.subscriptionCount = 1;
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    }
  }

  async deleteSubscription(): Promise<void> {
    try {
      await this.itemService.deleteSubscription(this.item.uId);
      this.item.subscribed = false;
      this.item.subscriptionCount ? this.item.subscriptionCount-- : this.item.subscriptionCount = 0;
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    }
  }

  // #endregion

  trackByFn(index: number, tag: string): number {
    return index;
  }

  ngOnDestroy(): void {
    if (this.descriptionTimeoutId) {
      clearTimeout(this.descriptionTimeoutId);
    }
  }
}
