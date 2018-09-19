import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CommentViewModel } from '../../../../shared/view-models/item/comment.view-model';
import { CreateOrUpdateCommentViewModel } from '../../../../shared/view-models/item/create-or-update-comment.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss']
})
export class CreateCommentComponent implements OnInit {

  @ViewChild('commentForm') commentForm: CommentFormComponent;
  @Input() itemUId: string;
  @Output() onSuccess: EventEmitter<CommentViewModel> = new EventEmitter();
  isProcessing = false;

  constructor(public formErrorsService: FormErrorsService,
    private itemService: ItemService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new CreateOrUpdateCommentViewModel();
    viewModel.itemUId = this.itemUId;
    viewModel.description = this.commentForm.formGroup.get('description').value;

    this.itemService.createComment(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.commentForm.formRef.resetForm();
        this.onSuccess.emit(data);
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.commentForm ? this.commentForm.formGroup : null);
      });
  }
}
