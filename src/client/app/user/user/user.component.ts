import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DEFAULT_PAGE_SIZE } from '@shared/validation/validators';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { CreateReportViewModel } from '@shared/view-models/report/create-report.view-model';
import { ReportType } from '@shared/view-models/report/report-type.enum';
import { UserPublicViewModel } from '@shared/view-models/user/user-public.view-model';
import { ContextMenuComponent } from '../../shared/context-menu/context-menu/context-menu.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FilterComponent } from '../../shared/filter/filter/filter.component';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { ShareService } from '../../shared/services/share.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';
import { UserService } from '../user.service';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements AfterViewInit {

  @ViewChild('filters') filters: FilterComponent;
  @ViewChild('contextMenu', { static: true }) contextMenu: ContextMenuComponent;
  isProcessing = true;
  isProcessingItems = true;
  userId: number | null;
  user: UserPublicViewModel;
  items: ItemViewModel[] = [];
  pageIndex: number;
  listEnd: boolean;
  userHasNoItems = false;

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private formErrorsService: FormErrorsService,
    private shareDialogService: ShareDialogService,
    public authService: AuthService,
    private shareService: ShareService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar) { }

  ngAfterViewInit() {
    this.getParams();
  }

  getParams() {
    const userId = this.route.snapshot.params.id;
    this.userId = userId ? +userId : null;
    this.getUser();
  }

  async getUser() {
    if (this.userId) {
      try {
        const response = await this.userService.getUserPublic(this.userId);
        if (response) {
          this.user = response;
          if (this.user.haveItems) {
            this.getItems(true);
          } else {
            this.userHasNoItems = true;
          }
        }
      } catch (error) {
        this.formErrorsService.updateFormValidity(error);
      } finally {
        this.isProcessing = false;
      }
    }
  }

  async getItems(refresh: boolean = false) {
    if (this.userId) {
      this.isProcessingItems = true;

      if (refresh) {
        this.pageIndex = 0;
        this.listEnd = false;
      }

      try {
        const response = await this.userService.getUserPublicItems(this.userId, this.filters.tags, this.pageIndex);
        if (response) {
          const itemsOwner = {
            id: this.userId,
            username: this.user.username,
            avatar: this.user.avatar
          };

          // TODO: This can be optimized
          response.forEach((item: ItemViewModel) => item.user = itemsOwner);

          refresh ? this.items = response : this.items.push(...response);
        }

        // End of list
        if (!response || (response && response.length !== DEFAULT_PAGE_SIZE)) {
          this.listEnd = true;
        }
      } catch (error) {
        this.formErrorsService.updateFormValidity(error);
      } finally {
        this.isProcessingItems = false;
      }
    }
  }

  openShareDialog() {
    if (this.userId) {
      this.contextMenu.close();

      const url = ['/user', this.userId];
      if (!this.shareService.webShareWithUrl('User', url)) {
        this.shareDialogService.share(this.user.username, url);
      }
    }
  }

  copyLink() {
    if (this.userId) {
      this.shareService.copyWithUrl(['/user', this.userId]);
      this.contextMenu.close();
    }
  }

  async report() {
    const hasConfirmed = await this.dialogService
      .confirm({
        title: 'Report',
        body: 'This user is either spam, abusive, harmful or you think it doesn\'t belong on here.',
        confirmButtonText: 'Report'
      });
    if (hasConfirmed) {
      this.contextMenu.close();

      const viewModel = new CreateReportViewModel();
      viewModel.type = ReportType.USER;
      viewModel.uId = this.user.uId;

      this.snackBar.open('Sending...');

      try {
        await this.userService.report(viewModel);
        this.snackBar.dismiss();
        this.snackBar.open('Sent');
      } catch (error) {
        this.snackBar.dismiss();
        this.snackBar.open('Sending failed');
      }
    }
  }

  filtersUpdated() {
    this.getItems(true);
  }

  onScroll() {
    if (!this.listEnd && !this.isProcessing) {
      this.pageIndex++;
      this.getItems();
    }
  }

  trackByFn(index: number, item: ItemViewModel) {
    return item.id;
  }
}
