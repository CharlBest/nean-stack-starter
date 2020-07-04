import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DEFAULT_PAGE_SIZE } from '@shared/validation/validators';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { FilterComponent } from '../../shared/filter/filter/filter.component';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { RefreshSameUrlService } from '../../shared/services/refresh-same-url.service';
import { HomeService } from '../home.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [RefreshSameUrlService]
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('filters') filters: FilterComponent;
  isProcessing = true;
  items: ItemViewModel[] = [];
  pageIndex: number;
  listEnd: boolean;

  constructor(private homeService: HomeService,
    public formErrorsService: FormErrorsService,
    private navigationService: NavigationService) { }

  ngAfterViewInit() {
    // TODO: add back in refereshing the feed when clicking
    // this.refreshSameUrlService.init(() => {
    //   this.refresh();
    // });

    this.getItems(true);
  }

  async getItems(refresh: boolean = false) {
    this.isProcessing = true;

    if (refresh) {
      this.pageIndex = 0;
      this.listEnd = false;
    }

    try {
      const response = await this.homeService.getAll(this.filters.tags, this.pageIndex);
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
      this.getItems();
    }
  }

  filtersUpdated() {
    this.getItems(true);
  }

  onOverscrolled() {
    if (!this.isProcessing) {
      this.getItems(true);
    }
  }

  trackByFn(index: number, item: ItemViewModel) {
    return item.id;
  }

  refresh() {
    // Scroll to the top
    window.scrollTo(0, 0);

    // Hide/disable badge on home navigation item if it exists
    this.navigationService.showHomeNavigationBadge = false;

    // Get new items
    this.getItems(true);
  }
}
