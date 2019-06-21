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
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @ViewChild('contextMenu') contextMenu: ContextMenuComponent;
  isProcessing = true;
  userId: number | null;
  user: UserPublicViewModel;
  loggedInUserId = this.authService.getLoggedInUserId();

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
      this.userService.getUserPublic(this.userId, 0)
        .pipe(finalize(() => this.isProcessing = false))
        .subscribe(data => {
          if (data) {
            if (this.userId) {
              const itemsOwner = {
                id: this.userId,
                username: data.username,
                avatarUrl: data.avatarUrl
              };

              // TODO: This can be optimized
              data.items.map((item: ItemViewModel) => item.user = itemsOwner);
            }

            this.user = data;
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
}
