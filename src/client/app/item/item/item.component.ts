import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { CreateItemViewModel } from '../../../../shared/view-models/item/create-item.view-model';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  isAuthenticated: boolean = this.authService.hasToken();
  formGroup: FormGroup;
  isProcessing = false;
  items: ItemViewModel[];

  constructor(private itemService: ItemService,
    private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    private authService: AuthService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.formOnInit();
    this.getAllItems();
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.createItem());
  }

  getAllItems() {
    this.isProcessing = true;

    this.itemService.getAll(0)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.items = data;
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.formGroup);
      });
  }

  createItem() {
    this.isProcessing = true;

    const viewModel = new CreateItemViewModel();
    viewModel.title = this.formGroup.get('title').value;
    viewModel.description = this.formGroup.get('description').value;

    this.itemService.create(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.items.unshift(data);
        this.formGroup.reset();
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.formGroup);
      });
  }

  deleteItem(uId: string) {
    this.dialogService.confirm('Are you sure you want to delete this item?').subscribe(data => {
      if (data) {
        this.itemService.delete(uId)
          .pipe(finalize(() => this.isProcessing = false))
          .subscribe(data => {
            if (data) {
              this.items.splice(this.items.findIndex(x => x.uId === uId), 1);
            }
          }, error => {
            this.formErrorsService.updateFormValidity(error, this.formGroup);
          });
      }
    });
  }
}
