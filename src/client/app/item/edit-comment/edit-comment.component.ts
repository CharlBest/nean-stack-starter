import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentViewModel } from '../../../../shared/view-models/item/comment.view-model';
import { CreateOrUpdateCommentViewModel } from '../../../../shared/view-models/item/create-or-update-comment.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { ItemService } from '../item.service';

@Component({
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

  async getComment() {
    if (this.commentUId) {
      this.isProcessing = true;

      try {
        const response = await this.itemService.getComment(this.commentUId);
        if (response) {
          this.comment = response;
        }
      } catch (error) {
        // TODO: cannot pass in commentForm.formGroup here because the element does not exist
        // because of *ngIf. Hiding it will cause the form to initilize without the data required
        this.formErrorsService.updateFormValidity(error, this.commentForm ? this.commentForm.formGroup : null);
      } finally {
        this.isProcessing = false;
      }
    }
  }

  async onSubmit() {
    this.isProcessing = true;

    const viewModel = new CreateOrUpdateCommentViewModel();
    viewModel.description = this.commentForm.formGroup.controls.description.value;

    try {
      await this.itemService.updateComment(this.comment.uId, viewModel);
      this.router.navigate(['/item/comments', this.comment.itemUId]);
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.commentForm ? this.commentForm.formGroup : null);
    } finally {
      this.isProcessing = false;
    }
  }
}
