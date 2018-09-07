import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CreateItemViewModel } from '../../../../shared/view-models/item/create-item.view-model';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { CreateItemService } from '../create-item.service';
import { ItemFormComponent } from '../item-form/item-form.component';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {

  @ViewChild('itemForm') itemForm: ItemFormComponent;
  itemUId: string;
  isProcessing = true;
  item: ItemViewModel;

  constructor(public formErrorsService: FormErrorsService,
    private createItemService: CreateItemService,
    private router: Router,
    private route: ActivatedRoute) { }

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

    this.createItemService.get(this.itemUId)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.item = data;
      }, error => {
        this.formErrorsService.updateFormValidity(error);
        // this.formErrorsService.updateFormValidity(error, this.formGroup);
      });
  }

  onSubmit() {
    this.itemForm.isProcessing = true;

    const viewModel = new CreateItemViewModel();
    viewModel.title = this.itemForm.formGroup.get('title').value;
    viewModel.description = this.itemForm.formGroup.get('description').value;

    this.createItemService.update(this.item.uId, viewModel)
      .pipe(finalize(() => this.itemForm.isProcessing = false))
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.itemForm.formGroup);
      });
  }
}
