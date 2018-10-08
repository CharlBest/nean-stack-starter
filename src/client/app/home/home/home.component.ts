import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, finalize } from 'rxjs/operators';
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

  @ViewChild('virtualScroll') virtualScroll: CdkVirtualScrollViewport;
  isProcessing = true;
  items: ItemViewModel[];
  itemHeight = 320;
  pageIndex = 0;

  constructor(private homeService: HomeService,
    public formErrorsService: FormErrorsService,
    private refreshSameUrlService: RefreshSameUrlService) { }

  ngOnInit() {
    this.refreshSameUrlService.init(() => {
      window.scrollTo(0, 0);
      this.getItems();
    });

    this.getItems();
    this.infinityScrollOnInit();
  }

  getItems() {
    this.isProcessing = true;

    this.homeService.getItems(this.pageIndex)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        if (data) {
          this.items = data;
        }
      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }

  infinityScrollOnInit() {
    fromEvent(this.virtualScroll.elementRef.nativeElement, 'scroll')
      .pipe(
        debounceTime(40),
        filter(() => !this.isProcessing)
      )
      .subscribe((x: Event) => {
        const target = x.target as HTMLDivElement;
        const scrollBottom = target.scrollTop + target.clientHeight || target.offsetHeight;
        console.log(scrollBottom);
        console.log(target.scrollHeight);
        if (scrollBottom + (this.itemHeight * 3) > target.scrollHeight) {
          console.log('load....');
          this.pageIndex++;
          this.getItems();
        }
      });
  }
}
