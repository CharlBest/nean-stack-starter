import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { UserPublicViewModel } from '@shared/view-models/user/user-public.view-model';
import { ContextMenuComponent } from '../../shared/context-menu/context-menu/context-menu.component';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { ShareService } from '../../shared/services/share.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';
import { UserService } from '../user.service';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @ViewChild('contextMenu', { static: true }) contextMenu: ContextMenuComponent;
  isProcessing = true;
  isProcessingItems = true;
  userId: number | null;
  user: UserPublicViewModel;
  items: ItemViewModel[] = [];
  pageIndex = 0;
  listEnd = false;
  userHasNoItems = false;

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private formErrorsService: FormErrorsService,
    private shareDialogService: ShareDialogService,
    public authService: AuthService,
    private shareService: ShareService) { }

  ngOnInit() {
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
            this.getItems();
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

  async getItems() {
    if (this.userId) {
      this.isProcessingItems = true;

      try {
        const response = await this.userService.getUserPublicItems(this.userId, this.pageIndex);
        if (response) {
          const itemsOwner = {
            id: this.userId,
            username: this.user.username,
            avatar: this.user.avatar
          };

          // TODO: This can be optimized
          response.forEach((item: ItemViewModel) => item.user = itemsOwner);

          this.items.push(...response);
        } else {
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
        this.shareDialogService.share(url, this.user.username);
      }
    }
  }

  copyLink() {
    if (this.userId) {
      this.shareService.copyWithUrl(['/user', this.userId]);
      this.contextMenu.close();
    }
  }

  onScroll() {
    if (!this.listEnd) {
      this.pageIndex++;
      this.getItems();
    }
  }

  trackByFn(index: number, item: ItemViewModel) {
    return item.id;
  }
}
