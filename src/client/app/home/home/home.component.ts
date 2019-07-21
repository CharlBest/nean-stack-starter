import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { Subscription } from 'rxjs';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { RefreshSameUrlService } from '../../shared/services/refresh-same-url.service';
import { WebSocketService } from '../../shared/services/websocket.service';
import { HomeService } from '../home.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [RefreshSameUrlService]
})
export class HomeComponent implements OnInit, OnDestroy {

  isProcessing = true;
  items: ItemViewModel[] = [];
  pageIndex = 0;
  listEnd = false;
  webSocketSubscription: Subscription;

  constructor(private homeService: HomeService,
    public formErrorsService: FormErrorsService,
    private refreshSameUrlService: RefreshSameUrlService,
    private webSocketService: WebSocketService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.refreshSameUrlService.init(() => {
      this.refresh();
    });

    this.getItems();
    this.listenForNewItemsViaWebSocket();
  }

  async getItems() {
    this.isProcessing = true;

    try {
      const response = await this.homeService.getItems(this.pageIndex);
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
    window.scrollTo(0, 0);
    this.pageIndex = 0;
    this.items = [];
    this.getItems();
  }

  listenForNewItemsViaWebSocket() {
    // TODO: potentially distracting so move to badge on home nav icon
    this.webSocketSubscription = this.webSocketService.newItem$
      .subscribe(() => {
        this.snackBar.dismiss();

        this.snackBar.open('New items available', 'Fetch', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        }).onAction().subscribe(() => this.refresh());
      });
  }

  ngOnDestroy() {
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe();
    }
  }
}
