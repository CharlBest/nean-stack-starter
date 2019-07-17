import { Component, Input, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommentViewModel } from '@shared/view-models/item/comment.view-model';
import { ReportCommentViewModel } from '@shared/view-models/item/report-comment.view-model';
import { ContextMenuComponent } from '../../shared/context-menu/context-menu/context-menu.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { ShareService } from '../../shared/services/share.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @ViewChild('contextMenu', { static: true }) contextMenu: ContextMenuComponent;
  @Input() comment: CommentViewModel;
  @Input() itemUserId: number;
  isProcessing = false;

  constructor(private itemService: ItemService,
    private formErrorsService: FormErrorsService,
    public authService: AuthService,
    private dialogService: DialogService,
    private shareDialogService: ShareDialogService,
    private shareService: ShareService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  async deleteComment() {
    const hasConfirmed = await this.dialogService.confirm('Are you sure you want to delete this comment?');
    if (hasConfirmed) {
      this.contextMenu.close();

      this.snackBar.open('Deleting...');

      try {
        await this.itemService.deleteComment(this.comment.uId);
        this.snackBar.dismiss();
        this.snackBar.open('Deleted');
        // TODO: very dirty and bad UI but will work for now
        location.reload();
      } catch (error) {
        this.snackBar.dismiss();
        this.snackBar.open('Delete failed');
        this.formErrorsService.updateFormValidity(error);
      } finally {
        this.isProcessing = false;
      }
    }
  }

  async reportComment() {
    const hasConfirmed = await this.dialogService
      .confirm('This comment is either spam, abusive, harmful or you think it doesn\'t belong on here.');
    if (hasConfirmed) {
      this.contextMenu.close();

      const viewModel = new ReportCommentViewModel();
      viewModel.uId = this.comment.uId;

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

  openShareDialog() {
    if (this.comment.itemUId) {
      this.contextMenu.close();

      const url = ['/item/comments', this.comment.itemUId];
      if (!this.shareService.webShareWithUrl('Comment', url)) {
        this.shareDialogService.share(url);
      }
    }
  }

  copyLink() {
    if (this.comment.itemUId) {
      this.shareService.copyWithUrl(['/item/comments', this.comment.itemUId]);
      this.contextMenu.close();
    }
  }

  goToEdit() {
    this.contextMenu.close();
    this.router.navigate(['/item/comment/edit', this.comment.uId], { state: { comment: this.comment } });
  }
}
