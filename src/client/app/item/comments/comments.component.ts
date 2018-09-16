import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { CreateOrUpdateCommentViewModel } from '../../../../shared/view-models/item/create-or-update-comment.view-model';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { AuthService } from '../../shared/services/auth.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  itemUId: string;
  isAuthenticated: boolean = this.authService.hasToken();
  formGroup: FormGroup;
  isProcessing = false;
  isProcessingComment = false;
  item: ItemViewModel;
  showCommentSubmitButton = false;

  constructor(private itemService: ItemService,
    public formErrorsService: FormErrorsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private authService: AuthService) {
    if (this.navigationService.previousUrl.startsWith('/item/create') ||
      this.navigationService.previousUrl.startsWith('/item/edit')) {
      this.navigationService.backRouterPath = '/';
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('uId')) {
        this.itemUId = params.get('uId');
        this.getItem();
      }
    });

    this.formOnInit();
  }

  getItem() {
    this.isProcessing = true;

    this.itemService.get(this.itemUId)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.item = data;
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.formGroup);
      });
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.createOrUpdateComment());
  }

  createComment() {
    this.isProcessingComment = true;

    const viewModel = new CreateOrUpdateCommentViewModel();
    viewModel.itemUId = this.itemUId;
    viewModel.description = this.formGroup.get('description').value;

    this.itemService.createComment(viewModel)
      .pipe(finalize(() => this.isProcessingComment = false))
      .subscribe(data => {
        console.log(data);
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.formGroup);
      });
  }

  deleteComment() {
    this.isProcessingComment = true;

    const viewModel = new CreateOrUpdateCommentViewModel();
    viewModel.description = this.formGroup.get('description').value;

    this.itemService.createComment(viewModel)
      .pipe(finalize(() => this.isProcessingComment = false))
      .subscribe(data => {
        console.log(data);
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.formGroup);
      });
  }
}
