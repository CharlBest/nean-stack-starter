import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { RefreshSameUrlService } from '../../shared/services/refresh-same-url.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-home',
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
    private refreshSameUrlService: RefreshSameUrlService) { }

  ngOnInit() {
    this.refreshSameUrlService.init(() => {
      window.scrollTo(0, 0);
      this.pageIndex = 0;
      this.items = [];
      this.getItems();
    });

    this.getItems();
  }

  getItems() {
    this.isProcessing = true;

    this.homeService.getItems(this.pageIndex)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        if (data) {
          this.items.push(...data);
        } else {
          this.listEnd = true;
        }
      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }

  onScroll() {
    if (!this.listEnd) {
      this.pageIndex++;
      this.getItems();
    }
  }
}
