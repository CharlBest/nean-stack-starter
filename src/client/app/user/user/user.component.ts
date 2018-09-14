import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ItemViewModel } from 'shared/view-models/item/item.view-model';
import { UserPublicViewModel } from 'shared/view-models/user/user-public.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  isProcessing = true;
  userId: number;
  user: UserPublicViewModel;

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private formErrorsService: FormErrorsService,
    private shareDialogService: ShareDialogService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.userId = +params.get('id');
        this.getUser();
      }
    });
  }

  getUser() {
    this.userService.getUserPublic(this.userId, 0)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        const itemsOwner = {
          id: this.userId,
          username: data.username,
          avatarUrl: data.avatarUrl
        };

        // TODO: This can be optomized
        data.items.map((x: ItemViewModel) => x.user = itemsOwner);

        this.user = data;
      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }

  openShareDialog() {
    const link = ['/user', this.userId];
    this.shareDialogService.share(link);
  }
}
