import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommentViewModel } from '../../../../shared/view-models/item/comment.view-model';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-comments',
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

  constructor(private itemService: ItemService,
    public formErrorsService: FormErrorsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.getParams();
  }

  getParams() {
    this.route.paramMap.subscribe(params => {
      if (params.has('uId')) {
        this.itemUId = params.get('uId');
        this.getItem();
        this.getComments();
      }
    });
  }

  getItem() {
    if (this.itemUId) {
      this.isProcessing = true;

      this.itemService.get(this.itemUId)
        .pipe(finalize(() => this.isProcessing = false))
        .subscribe(data => {
          if (data) {
            this.item = data;
          }
        }, error => {
          this.formErrorsService.updateFormValidity(error);
        });
    }
  }

  getComments() {
    if (this.itemUId) {
      this.isProcessingComment = true;

      this.itemService.getComments(this.itemUId, 0)
        .pipe(finalize(() => this.isProcessingComment = false))
        .subscribe(data => {
          if (data) {
            // TODO: is the the fastest way?
            data.forEach(comment => comment.itemUId = this.itemUId);
            this.comments = data;
          }
        }, error => {
          this.formErrorsService.updateFormValidity(error);
        });
    }
  }

  insertComment(comment: CommentViewModel) {
    if (this.comments && this.comments.length > 0) {
      this.comments.unshift(comment);
    } else {
      this.comments = [comment];
    }
  }

  goToLogin() {
    this.router.navigate(['login'], { queryParams: { returnUrl: `/item/comments/${this.itemUId}` }, queryParamsHandling: 'merge' });
  }
}
