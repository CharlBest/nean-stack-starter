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

  @ViewChild('commentForm') commentForm: CommentFormComponent;
  commentUId: string;
  isProcessing = true;
  comment: CommentViewModel;

  constructor(public formErrorsService: FormErrorsService,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('uId')) {
        this.commentUId = params.get('uId');
        this.getComment();
      }
    });
  }

  getComment() {
    this.isProcessing = true;

    this.itemService.getComment(this.commentUId)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.comment = data;
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.commentForm.formGroup);
      });
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new CreateOrUpdateCommentViewModel();
    viewModel.description = this.commentForm.formGroup.get('description').value;

    this.itemService.updateComment(this.comment.uId, viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.router.navigate(['/item/comments', data.uId]);
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.commentForm.formGroup);
      });
  }
}
