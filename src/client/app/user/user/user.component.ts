import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ItemViewModel } from 'shared/view-models/item/item.view-model';
import { UserPublicViewModel } from 'shared/view-models/user/user-public.view-model';
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
  loggedInUserId = this.authService.getLoggedInUserId();
  pageIndex = 0;
  listEnd = false;
  userHasNoItems = false;

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private formErrorsService: FormErrorsService,
    private shareDialogService: ShareDialogService,
    private authService: AuthService,
    private shareService: ShareService) { }

  ngOnInit() {
    this.getParams();
  }

  getParams() {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        const userId = params.get('id');
        this.userId = userId ? +userId : null;
        this.getUser();
      }
    });
  }

  getUser() {
    if (this.userId) {
      this.userService.getUserPublic(this.userId)
        .pipe(finalize(() => this.isProcessing = false))
        .subscribe(data => {
          if (data) {
            this.user = data;
            if (this.user.haveItems) {
              this.getItems();
            } else {
              this.userHasNoItems = true;
            }
          }
        }, error => {
          this.formErrorsService.updateFormValidity(error);
        });
    }
  }

  getItems() {
    if (this.userId) {
      this.isProcessingItems = true;

      this.userService.getUserPublicItems(this.userId, this.pageIndex)
        .pipe(finalize(() => this.isProcessingItems = false))
        .subscribe(data => {
          if (data) {
            if (this.userId) {
              const itemsOwner = {
                id: this.userId,
                username: this.user.username,
                avatarUrl: this.user.avatarUrl
              };

              // TODO: This can be optimized
              data.map((item: ItemViewModel) => item.user = itemsOwner);
            }

            this.items.push(...data);
          } else {
            this.listEnd = true;
          }
        }, error => {
          this.formErrorsService.updateFormValidity(error);
        });
    }
  }

  openShareDialog() {
    if (this.userId) {
      this.contextMenu.close();

      const url = ['/user', this.userId];
      if (!this.shareService.webShareWithUrl('User', url)) {
        this.shareDialogService.share(url);
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
}
