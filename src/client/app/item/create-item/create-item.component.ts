import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CreateOrUpdateItemViewModel } from '../../../../shared/view-models/item/create-or-update-item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ItemFormComponent } from '../item-form/item-form.component';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {

  @ViewChild('itemForm') itemForm: ItemFormComponent;
  isProcessing = false;

  constructor(public formErrorsService: FormErrorsService,
    private itemService: ItemService,
    private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new CreateOrUpdateItemViewModel();
    viewModel.title = this.itemForm.formGroup.get('title').value;
    viewModel.description = this.itemForm.formGroup.get('description').value;
    viewModel.media = this.itemForm.formGroup.get('media').value;

    this.itemService.create(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.router.navigate(['/item/comments', data.uId]);
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.itemForm ? this.itemForm.formGroup : null);
      });
  }
}
