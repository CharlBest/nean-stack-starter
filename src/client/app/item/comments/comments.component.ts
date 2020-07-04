import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DEFAULT_PAGE_SIZE } from '@shared/validation/validators';
import { CommentViewModel } from '@shared/view-models/comment/comment.view-model';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { AuthService } from '../../shared/services/auth.service';
import { CommentService } from '../comment.service';
import { ItemService } from '../item.service';

@Component({
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  itemUId: string | null;
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
    public authService: AuthService,
    private router: Router,
    private navigationService: NavigationService) { }

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

          // Set header text
          this.navigationService.backHeaderTitle = this.item.title;
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
        }

        // End of list
        if (!response || (response && response.length !== DEFAULT_PAGE_SIZE)) {
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

    this.item.commentCount ? this.item.commentCount++ : this.item.commentCount = 1;
  }

  goToSignUp() {
    this.router.navigate(['sign-up'], { queryParams: { returnUrl: `/item/comments/${this.itemUId}` }, queryParamsHandling: 'merge' });
  }

  goToLogIn() {
    this.router.navigate(['login'], { queryParams: { returnUrl: `/item/comments/${this.itemUId}` }, queryParamsHandling: 'merge' });
  }

  onScroll() {
    if (!this.listEnd && !this.isProcessing) {
      this.pageIndex++;
      this.getComments();
    }
  }

  trackByFn(index: number, comment: CommentViewModel) {
    return comment.id;
  }
}
