import { Component, OnDestroy, OnInit } from '@angular/core';
import { DEFAULT_PAGE_SIZE } from '@shared/validation/validators';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { Subscription } from 'rxjs';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { DiscoverService } from '../discover.service';

@Component({
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit, OnDestroy {
  term: string;
  searchedSubscription: Subscription;
  isProcessing = true;
  items: ItemViewModel[] = [];
  pageIndex = 0;
  private readonly pageSize = 20;
  listEnd = false;

  constructor(public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private discoverService: DiscoverService,
    private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.getItems(true);

    this.searchedSubscription = this.navigationService.searched.subscribe((value: string) => {
      this.term = value;
      this.getItems(true);
    });
  }

  async getItems(refresh: boolean = false): Promise<void> {
    this.isProcessing = true;

    if (refresh) {
      this.pageIndex = 0;
      this.listEnd = false;
    }

    try {
      let response = null;
      if (this.term) {
        // This will maybe alter results
        this.term = this.term.trim();

        response = await this.discoverService.search(this.term, this.pageIndex, this.pageSize);
      } else {
        response = await this.discoverService.getAll(this.pageIndex);
      }

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
      this.getItems();
    }
  }

  trackByFn(index: number, item: ItemViewModel): number {
    return item.id;
  }

  ngOnDestroy(): void {
    if (this.searchedSubscription) {
      this.searchedSubscription.unsubscribe();
    }
  }
}
