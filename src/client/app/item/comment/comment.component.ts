import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CommentViewModel } from '@shared/view-models/item/comment.view-model';
import { CreateOrUpdateCommentViewModel } from '@shared/view-models/item/create-or-update-comment.view-model';
import { CreateReportViewModel } from '@shared/view-models/report/create-report.view-model';
import { ReportType } from '@shared/view-models/report/report-type.enum';
import { ContextMenuComponent } from '../../shared/context-menu/context-menu/context-menu.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { ShareService } from '../../shared/services/share.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { CommentService } from '../comment.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @ViewChild('contextMenu', { static: true }) contextMenu: ContextMenuComponent;
  @ViewChild('commentForm') commentForm: CommentFormComponent;
  @Input() comment: CommentViewModel;
  isProcessing = false;
  isProcessingCreateOrUpdate = false;
  showEditItem = false;
  showReplies = false;
  showCreateReply = false;

  constructor(private itemService: ItemService,
    private commentService: CommentService,
    private formErrorsService: FormErrorsService,
    public authService: AuthService,
    private dialogService: DialogService,
    private shareDialogService: ShareDialogService,
    private shareService: ShareService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    const commentUId = this.route.snapshot.params.uId;
    if (!this.comment && commentUId) {
      this.get(commentUId);
    }
  }

  async get(commentUId: string) {
    this.isProcessing = true;

    try {
      const response = await this.commentService.get(commentUId);
      if (response) {
        this.comment = response;
      }
    } catch (error) {
      // TODO: cannot pass in commentForm.formGroup here because the element does not exist
      // because of *ngIf. Hiding it will cause the form to initilize without the data required
      this.formErrorsService.updateFormValidity(error);
    } finally {
      this.isProcessing = false;
    }
  }

  async delete() {
    const hasConfirmed = await this.dialogService.confirm('Delete your comment and all of its replies permanently?', 'Delete', 'Cancel', 'Delete comment');
    if (hasConfirmed) {
      this.contextMenu.close();

      this.snackBar.open('Deleting...');

      try {
        await this.commentService.delete(this.comment.uId);
        this.snackBar.dismiss();
        this.snackBar.open('Deleted');
        // TODO: very dirty and bad UI but will work for now
        window.location.reload();
      } catch (error) {
        this.snackBar.dismiss();
        this.snackBar.open('Delete failed');
        this.formErrorsService.updateFormValidity(error);
      } finally {
        this.isProcessing = false;
      }
    }
  }

  async report() {
    const hasConfirmed = await this.dialogService
      .confirm('This comment is either spam, abusive, harmful or you think it doesn\'t belong on here.');
    if (hasConfirmed) {
      this.contextMenu.close();

      const viewModel = new CreateReportViewModel();
      viewModel.type = ReportType.COMMENT;
      viewModel.uId = this.comment.uId;

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

  openShareDialog() {
    if (this.comment.itemUId) {
      this.contextMenu.close();

      const url = ['/item/comment', this.comment.uId];
      if (!this.shareService.webShareWithUrl('Comment', url)) {
        this.shareDialogService.share(this.comment.description, url);
      }
    }
  }

  copyLink() {
    if (this.comment.itemUId) {
      this.shareService.copyWithUrl(['/item/comment', this.comment.uId]);
      this.contextMenu.close();
    }
  }

  openEdit() {
    this.contextMenu.close();
    this.showEditItem = true;
  }

  async openReply() {
    if (this.authService.loggedInUserId) {
      this.showReplies = true;
      this.showCreateReply = true;
    } else {
      const hasConfirmed = await this.dialogService.confirm('Please log in to reply', 'Sign In');
      if (hasConfirmed) {
        this.authService.removeTokenAndNavigateToLogin();
      }
    }
  }

  async onSubmit() {
    this.isProcessingCreateOrUpdate = true;

    const viewModel = new CreateOrUpdateCommentViewModel();
    viewModel.description = this.commentForm.formGroup.controls.description.value;

    try {
      const response = await this.commentService.update(this.comment.uId, viewModel);
      this.showEditItem = false;
      if (response) {
        this.comment.description = response.description;
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.commentForm ? this.commentForm.formGroup : null);
    } finally {
      this.isProcessingCreateOrUpdate = false;
    }
  }

  insertReply(event: Event) {
    this.comment.commentCount ? this.comment.commentCount++ : this.comment.commentCount = 1;

    // Dirty way of reloading replies child component
    this.showReplies = false;
    this.changeDetector.detectChanges();
    this.showReplies = true;
  }
}
