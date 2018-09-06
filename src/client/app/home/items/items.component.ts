import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
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
