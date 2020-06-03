import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentViewModel } from '@shared/view-models/item/comment.view-model';
import { CreateReportViewModel } from '@shared/view-models/report/create-report.view-model';
import { ReportType } from '@shared/view-models/report/report-type.enum';
import { ContextMenuComponent } from '../../shared/context-menu/context-menu/context-menu.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { ShareService } from '../../shared/services/share.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';
import { CommentService } from '../comment.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @ViewChild('contextMenu', { static: true }) contextMenu: ContextMenuComponent;
  @Input() comment: CommentViewModel;
  isProcessing = false;

  constructor(private itemService: ItemService,
    private commentService: CommentService,
    private formErrorsService: FormErrorsService,
    public authService: AuthService,
    private dialogService: DialogService,
    private shareDialogService: ShareDialogService,
    private shareService: ShareService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute) { }

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
    const hasConfirmed = await this.dialogService.confirm('Delete your comment and all of its replies permanently?', 'DELETE', 'CANCEL', 'Delete comment');
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

  goToEdit() {
    this.contextMenu.close();
    this.router.navigate(['/item/comment/edit', this.comment.uId], { state: { comment: this.comment } });
  }
}
