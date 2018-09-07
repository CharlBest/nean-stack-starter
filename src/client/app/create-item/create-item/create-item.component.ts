import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CreateItemViewModel } from '../../../../shared/view-models/item/create-item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { CreateItemService } from '../create-item.service';
import { ItemFormComponent } from '../item-form/item-form.component';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {

  @ViewChild('itemForm') itemForm: ItemFormComponent;

  constructor(public formErrorsService: FormErrorsService,
    private createItemService: CreateItemService,
    private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    this.itemForm.isProcessing = true;

    const viewModel = new CreateItemViewModel();
    viewModel.title = this.itemForm.formGroup.get('title').value;
    viewModel.description = this.itemForm.formGroup.get('description').value;

    this.createItemService.create(viewModel)
      .pipe(finalize(() => this.itemForm.isProcessing = false))
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.itemForm.formGroup);
      });
  }
}
