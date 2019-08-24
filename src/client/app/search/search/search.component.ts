import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { Subscription } from 'rxjs';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { SearchService } from '../search.service';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  term: string;
  searchedSubscription: Subscription;
  isProcessing = false;
  items: ItemViewModel[] | null;
  pageIndex = 0;
  listEnd = false;

  constructor(public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private searchService: SearchService,
    private navigationService: NavigationService) { }

  ngOnInit() {
    this.searchedSubscription = this.navigationService.searched.subscribe((value: string) => {
      this.term = value;
      this.search();
    });
  }

  async search(newSearch = true) {
    if (this.term && !this.isProcessing) {
      this.isProcessing = true;

      // This will maybe alter results
      this.term = this.term.trim();

      // Reset
      if (newSearch) {
        this.pageIndex = 0;
        this.listEnd = false;
        this.items = null;
      }

      try {
        const response = await this.searchService.search(this.term, this.pageIndex);
        if (response) {
          if (!this.items) {
            this.items = [];
          }

          this.items.push(...response);
        } else {
          this.items = [];
          this.listEnd = true;
        }
      } catch (error) {
        this.formErrorsService.updateFormValidity(error);
      } finally {
        this.isProcessing = false;
      }
    }
  }

  onScroll() {
    if (!this.listEnd) {
      this.pageIndex++;
      this.search(false);
    }
  }

  trackByFn(index: number, item: ItemViewModel) {
    return item.id;
  }

  ngOnDestroy() {
    if (this.searchedSubscription) {
      this.searchedSubscription.unsubscribe();
    }
  }
}
