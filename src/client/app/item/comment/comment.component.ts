import { Component, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CommentViewModel } from '../../../../shared/view-models/item/comment.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: CommentViewModel;
  @Input() itemUserId: number;
  loggedInUserId: number = this.authService.getLoggedInUserId();
  isProcessing = false;

  constructor(private itemService: ItemService,
    private formErrorsService: FormErrorsService,
    private authService: AuthService) { }

  ngOnInit() {
  }

  deleteComment() {
    this.isProcessing = true;

    this.itemService.deleteComment(this.comment.uId)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        console.log(data);
      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }
}
