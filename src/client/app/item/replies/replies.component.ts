import { Component, Input, OnInit } from '@angular/core';
import { DEFAULT_PAGE_SIZE } from '@shared/validation/validators';
import { CommentViewModel } from '@shared/view-models/item/comment.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { CommentService } from '../comment.service';

@Component({
  selector: 'app-replies',
  templateUrl: './replies.component.html',
  styleUrls: ['./replies.component.scss']
})
export class RepliesComponent implements OnInit {

  @Input() comment: CommentViewModel;
  isAuthenticated: boolean = this.authService.hasToken();
  isProcessing = false;
  comments: CommentViewModel[] = [];
  pageIndex = 0;
  listEnd = false;

  constructor(private commentService: CommentService,
    public formErrorsService: FormErrorsService,
    private authService: AuthService) { }

  ngOnInit() {
    this.getReplies();
  }

  async getReplies() {
    this.isProcessing = true;

    try {
      const response = await this.commentService.getReplies(this.comment.uId, this.pageIndex);
      if (response) {
        // TODO: is the the fastest way?
        response.forEach(comment => comment.itemUId = this.comment.itemUId);
        this.comments.push(...response);
      }

      // End of list
      if (!response || (response && response.length !== DEFAULT_PAGE_SIZE)) {
        this.listEnd = true;
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    } finally {
      this.isProcessing = false;
    }
  }

  onScroll() {
    if (!this.listEnd) {
      this.pageIndex++;
      this.getReplies();
    }
  }

  trackByFn(index: number, comment: CommentViewModel) {
    return comment.id;
  }
}
