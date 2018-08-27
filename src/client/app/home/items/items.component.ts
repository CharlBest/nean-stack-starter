import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { CreateItemViewModel } from '../../../../shared/view-models/item/create-item.view-model';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  isProcessing = true;
  items: ItemViewModel[];

  constructor(private homeService: HomeService,
    public formErrorsService: FormErrorsService) { }

  ngOnInit() {
    this.getAllItems();
  }

  getAllItems() {
    this.isProcessing = true;

    this.homeService.getAll(0)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.items = data;
      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }
}
