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
    this.userService.getUserPublic(this.userId)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.user = data;
        // TODO: This can be optomized
        this.user.items.forEach((x: ItemViewModel) => x.user = {
          id: this.userId,
          username: this.user.username,
          avatarUrl: this.user.avatarUrl
        });
      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }

  openShareDialog() {
    const link = ['/user', this.userId];
    this.shareDialogService.share(link);
  }
}
