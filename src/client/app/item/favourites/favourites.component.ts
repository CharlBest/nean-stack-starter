import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {

  isProcessing = true;
  items: ItemViewModel[];

  constructor(private itemService: ItemService,
    public formErrorsService: FormErrorsService) { }

  ngOnInit() {
    this.getFavourites();
  }

  getFavourites() {
    this.isProcessing = true;

    this.itemService.getFavourites(0)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        if (data) {
          this.items = data;
        }
      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }
}
