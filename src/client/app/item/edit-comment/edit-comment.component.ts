import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommentViewModel } from '../../../../shared/view-models/item/comment.view-model';
import { CreateOrUpdateCommentViewModel } from '../../../../shared/view-models/item/create-or-update-comment.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent implements OnInit {

  @ViewChild('commentForm', { static: false }) commentForm: CommentFormComponent;
  commentUId: string | null;
  isProcessing = false;
  comment: CommentViewModel;

  constructor(public formErrorsService: FormErrorsService,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.comment = history.state.comment;

    this.getParams();
  }

  getParams() {
    this.route.paramMap.subscribe(params => {
      if (params.has('uId')) {
        this.commentUId = params.get('uId');
        if (!this.comment) {
          this.getComment();
        }
      }
    });
  }

  getComment() {
    if (this.commentUId) {
      this.isProcessing = true;

      this.itemService.getComment(this.commentUId)
        .pipe(finalize(() => this.isProcessing = false))
        .subscribe(data => {
          if (data) {
            this.comment = data;
          }
        }, error => {
          // TODO: cannot pass in commentForm.formGroup here because the element does not exist
          // because of *ngIf. Hiding it will cause the form to initilize without the data required
          this.formErrorsService.updateFormValidity(error, this.commentForm ? this.commentForm.formGroup : null);
        });
    }
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new CreateOrUpdateCommentViewModel();
    viewModel.description = this.commentForm.formGroup.controls.description.value;

    this.itemService.updateComment(this.comment.uId, viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.router.navigate(['/item/comments', this.comment.itemUId]);
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.commentForm ? this.commentForm.formGroup : null);
      });
  }
}
