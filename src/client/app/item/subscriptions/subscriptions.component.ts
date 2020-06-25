import { Component, OnInit } from '@angular/core';
import { DEFAULT_PAGE_SIZE } from '@shared/validation/validators';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { ItemService } from '../item.service';

@Component({
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  isProcessing = true;
  items: ItemViewModel[] = [];
  pageIndex = 0;
  listEnd = false;

  constructor(private itemService: ItemService,
    public formErrorsService: FormErrorsService) { }

  ngOnInit() {
    this.getSubscriptions();
  }

  async getSubscriptions() {
    this.isProcessing = true;

    try {
      const response = await this.itemService.getSubscriptions(this.pageIndex);
      if (response) {
        this.items.push(...response);
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
      this.getSubscriptions();
    }
  }

  trackByFn(index: number, item: ItemViewModel) {
    return item.id;
  }
}
