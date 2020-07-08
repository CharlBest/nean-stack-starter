import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DEFAULT_PAGE_SIZE } from '@shared/validation/validators';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { FilterComponent } from '../../shared/filter/filter/filter.component';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ItemService } from '../item.service';

@Component({
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements AfterViewInit {

  @ViewChild('filters') filters: FilterComponent;
  isProcessing = true;
  items: ItemViewModel[] = [];
  pageIndex: number;
  listEnd: boolean;

  constructor(private itemService: ItemService,
    public formErrorsService: FormErrorsService) { }

  ngAfterViewInit(): void {
    this.getSubscriptions(true);
  }

  async getSubscriptions(refresh: boolean = false): Promise<void> {
    this.isProcessing = true;

    if (refresh) {
      this.pageIndex = 0;
      this.listEnd = false;
    }

    try {
      const response = await this.itemService.getSubscriptions(this.filters.tags, this.pageIndex);
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

  onScroll(): void {
    if (!this.listEnd && !this.isProcessing) {
      this.pageIndex++;
      this.getSubscriptions();
    }
  }

  filtersUpdated(): void {
    this.getSubscriptions(true);
  }

  trackByFn(index: number, item: ItemViewModel): number {
    return item.id;
  }
}
