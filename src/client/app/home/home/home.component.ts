import { Component, OnInit } from '@angular/core';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { RefreshSameUrlService } from '../../shared/services/refresh-same-url.service';
import { HomeService } from '../home.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [RefreshSameUrlService]
})
export class HomeComponent implements OnInit {

  isProcessing = true;
  items: ItemViewModel[] = [];
  pageIndex = 0;
  listEnd = false;

  constructor(private homeService: HomeService,
    public formErrorsService: FormErrorsService,
    private refreshSameUrlService: RefreshSameUrlService,
    private navigationService: NavigationService) { }

  ngOnInit() {
    this.refreshSameUrlService.init(() => {
      this.refresh();
    });

    this.getItems();
  }

  async getItems() {
    this.isProcessing = true;

    try {
      const response = await this.homeService.getAll(this.pageIndex);
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
      this.getItems();
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

    // Reset
    this.pageIndex = 0;
    this.items = [];

    // Get new items
    this.getItems();
  }
}
