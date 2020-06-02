import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommentViewModel } from '@shared/view-models/item/comment.view-model';
import { CreateOrUpdateCommentViewModel } from '@shared/view-models/item/create-or-update-comment.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { CommentService } from '../comment.service';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss']
})
export class CreateCommentComponent {

  @ViewChild('commentForm', { static: true }) commentForm: CommentFormComponent;
  @Input() itemUId: string;
  @Output() readonly createSuccess: EventEmitter<CommentViewModel> = new EventEmitter();
  isProcessing = false;

  constructor(public formErrorsService: FormErrorsService,
    private commentService: CommentService) { }

  async onSubmit() {
    this.isProcessing = true;

    const viewModel = new CreateOrUpdateCommentViewModel();
    viewModel.description = this.commentForm.formGroup.controls.description.value;

    try {
      const response = await this.commentService.create(this.itemUId, viewModel);
      if (response) {
        this.commentForm.formRef.resetForm();
        response.itemUId = this.itemUId;
        this.createSuccess.emit(response);
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.commentForm ? this.commentForm.formGroup : null);
    } finally {
      this.isProcessing = false;
    }
  }
}
