import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  // isAuthenticated: boolean = this.authService.hasToken();
  itemUId: string;
  // formGroup: FormGroup;
  isProcessing = false;
  item: ItemViewModel;

  constructor(private homeService: HomeService,
    private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialogService: DialogService) { }

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

    this.homeService.get(this.itemUId)
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
