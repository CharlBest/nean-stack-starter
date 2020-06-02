import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentViewModel } from '@shared/view-models/item/comment.view-model';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { CommentService } from '../comment.service';
import { ItemService } from '../item.service';

@Component({
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  itemUId: string | null;
  isAuthenticated: boolean = this.authService.hasToken();
  isProcessing = false;
  isProcessingComment = false;
  item: ItemViewModel;
  comments: CommentViewModel[] = [];
  pageIndex = 0;
  listEnd = false;

  constructor(private itemService: ItemService,
    private commentService: CommentService,
    public formErrorsService: FormErrorsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.getParams();
  }

  getParams() {
    this.itemUId = this.route.snapshot.params.uId;
    this.getItem();
    this.getComments();
  }

  async getItem() {
    if (this.itemUId) {
      this.isProcessing = true;

      try {
        const response = await this.itemService.get(this.itemUId);
        if (response) {
          this.item = response;
        }
      } catch (error) {
        this.formErrorsService.updateFormValidity(error);
      } finally {
        this.isProcessing = false;
      }
    }
  }

  async getComments() {
    if (this.itemUId) {
      this.isProcessingComment = true;

      try {
        const response = await this.commentService.getAll(this.itemUId, this.pageIndex);
        if (response) {
          // TODO: is the the fastest way?
          response.forEach(comment => comment.itemUId = this.itemUId);
          this.comments.push(...response);
        } else {
          this.listEnd = true;
        }
      } catch (error) {
        this.formErrorsService.updateFormValidity(error);
      } finally {
        this.isProcessingComment = false;
      }
    }
  }

  insertComment(comment: CommentViewModel) {
    if (this.comments && this.comments.length > 0) {
      this.comments.unshift(comment);
    } else {
      this.comments = [comment];
    }
  }

  goToSignUp() {
    this.router.navigate(['sign-up'], { queryParams: { returnUrl: `/item/comments/${this.itemUId}` }, queryParamsHandling: 'merge' });
  }

  goToLogIn() {
    this.router.navigate(['login'], { queryParams: { returnUrl: `/item/comments/${this.itemUId}` }, queryParamsHandling: 'merge' });
  }

  onScroll() {
    if (!this.listEnd) {
      this.pageIndex++;
      this.getComments();
    }
  }

  trackByFn(index: number, comment: CommentViewModel) {
    return comment.id;
  }
}
