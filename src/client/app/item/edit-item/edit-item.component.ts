import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CreateOrEditItemViewModel } from '../../../../shared/view-models/item/create-item.view-model';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ItemFormComponent } from '../item-form/item-form.component';
import { ItemService } from '../item.service';

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
    private itemService: ItemService,
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

    this.itemService.get(this.itemUId)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.item = data;
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.itemForm.formGroup);
      });
  }

  onSubmit() {
    this.itemForm.isProcessing = true;

    const viewModel = new CreateOrEditItemViewModel();
    viewModel.title = this.itemForm.formGroup.get('title').value;
    viewModel.description = this.itemForm.formGroup.get('description').value;

    this.itemService.update(this.item.uId, viewModel)
      .pipe(finalize(() => this.itemForm.isProcessing = false))
      .subscribe(data => {
        this.router.navigate(['/item', data.uId]);
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.itemForm.formGroup);
      });
  }
}
