import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  itemUId: string;
  // isAuthenticated: boolean = this.authService.hasToken();
  // formGroup: FormGroup;
  isProcessing = false;
  item: ItemViewModel;

  constructor(private itemService: ItemService,
    public formErrorsService: FormErrorsService,
    private route: ActivatedRoute,
    private navigationService: NavigationService) {
    if (this.navigationService.previousUrl.startsWith('/item/create') ||
      this.navigationService.previousUrl.startsWith('/item/edit')) {
      this.navigationService.backRouterPath = '/';
      console.log('hit');
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('uId')) {
        this.itemUId = params.get('uId');
        this.getItem();
      }
    });
  }

  getItem() {
    this.isProcessing = true;

    this.itemService.get(this.itemUId)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.item = data;
      }, error => {
        this.formErrorsService.updateFormValidity(error);
        // this.formErrorsService.updateFormValidity(error, this.formGroup);
      });
  }

  // formOnInit() {
  //   this.formGroup = this.fb.group(BuildFormGroup.createItem());
  // }
}
