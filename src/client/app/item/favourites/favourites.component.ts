import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DEFAULT_PAGE_SIZE } from '@shared/validation/validators';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { OrderFavouriteViewModel } from '@shared/view-models/item/order-favourite.view-model';
import { FilterComponent } from '../../shared/filter/filter/filter.component';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ItemService } from '../item.service';

@Component({
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements AfterViewInit {

  @ViewChild('filters') filters: FilterComponent;
  isProcessing = true;
  items: ItemViewModel[] = [];
  pageIndex: number;
  listEnd: boolean;

  constructor(private itemService: ItemService,
    public formErrorsService: FormErrorsService) { }

  ngAfterViewInit() {
    this.getFavourites(true);
  }

  async getFavourites(refresh: boolean = false) {
    this.isProcessing = true;

    if (refresh) {
      this.pageIndex = 0;
      this.listEnd = false;
    }

    try {
      const response = await this.itemService.getFavourites(this.filters.tags, this.pageIndex);
      if (response) {
        refresh ? this.items = response : this.items.push(...response);
      }

      // End of list
      if (!response || (response && response.length !== DEFAULT_PAGE_SIZE)) {
        this.listEnd = true;
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    } finally {
      this.isProcessing = false;
    }
  }

  onScroll() {
    if (!this.listEnd && !this.isProcessing) {
      this.pageIndex++;
      this.getFavourites();
    }
  }

  filtersUpdated() {
    this.getFavourites(true);
  }

  trackByFn(index: number, item: ItemViewModel) {
    return item.id;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.items, event.previousIndex, event.currentIndex);
      this.orderFavourite(event.item.data, event.previousIndex, event.currentIndex);
    }
  }

  async orderFavourite(item: ItemViewModel, originalOrderVal: number, newOrderVal: number) {
    const viewModel = new OrderFavouriteViewModel();
    viewModel.newOrderVal = newOrderVal;
    viewModel.originalOrderVal = originalOrderVal;

    try {
      await this.itemService.orderFavourite(item.uId, viewModel);
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    }
  }
}
