import { Component, OnInit } from '@angular/core';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ItemService } from '../item.service';

@Component({
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {

  isProcessing = true;
  items: ItemViewModel[] = [];
  pageIndex = 0;
  listEnd = false;

  constructor(private itemService: ItemService,
    public formErrorsService: FormErrorsService) { }

  ngOnInit() {
    this.getFavourites();
  }

  async getFavourites() {
    this.isProcessing = true;

    try {
      const response = await this.itemService.getFavourites(this.pageIndex);
      if (response) {
        this.items.push(...response);
      } else {
        this.listEnd = true;
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    } finally {
      this.isProcessing = false;
    }
  }

  onScroll() {
    if (!this.listEnd) {
      this.pageIndex++;
      this.getFavourites();
    }
  }

  trackByFn(index: number, item: ItemViewModel) {
    return item.id;
  }
}
